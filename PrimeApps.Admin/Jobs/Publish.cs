using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Serialization;
using PrimeApps.Admin.ActionFilters;
using PrimeApps.Admin.Helpers;
using PrimeApps.Model.Context;
using PrimeApps.Model.Entities.Platform;
using PrimeApps.Model.Enums;
using PrimeApps.Model.Helpers;
using PrimeApps.Model.Repositories;
using PrimeApps.Model.Storage;
using Sentry.Protocol;
using PublishHelper = PrimeApps.Model.Helpers.PublishHelper;

namespace PrimeApps.Admin.Jobs
{
    public interface IPublish
    {
        Task PackageApply(int appId, int orgId, string token, int newReleaseId, int userId, string appUrl, string authUrl, bool useSsl);
        Task UpdateTenants(int appId, int orgId, int userId, IList<int> tenants, string token, int pointerReleaseId);
    }

    public class Publish : IPublish
    {
        private IConfiguration _configuration;
        private IServiceScopeFactory _serviceScopeFactory;
        private readonly IUnifiedStorage _storage;
        private IHostingEnvironment _hostingEnvironment;

        public Publish(IConfiguration configuration, IServiceScopeFactory serviceScopeFactory, IUnifiedStorage storage, IHostingEnvironment hostingEnvironment)
        {
            _configuration = configuration;
            _serviceScopeFactory = serviceScopeFactory;
            _storage = storage;
            _hostingEnvironment = hostingEnvironment;
        }

        [QueueCustom]
        public async Task PackageApply(int appId, int orgId, string token, int newReleaseId, int userId, string appUrl, string authUrl, bool useSsl)
        {
            var studioClient = new StudioClient(_configuration, token, appId, orgId);
            using (var scope = _serviceScopeFactory.CreateScope())
            {
                var platformDbContext = scope.ServiceProvider.GetRequiredService<PlatformDBContext>();

                using (var releaseRepository = new ReleaseRepository(platformDbContext, _configuration)) //, cacheHelper))
                using (var platformRepository = new PlatformRepository(platformDbContext, _configuration)) //, cacheHelper))
                using (var applicationRepository = new ApplicationRepository(platformDbContext, _configuration)) //, cacheHelper))
                {
                    applicationRepository.CurrentUser = platformRepository.CurrentUser = releaseRepository.CurrentUser = new CurrentUser {UserId = userId};

                    var app = await studioClient.AppDraftGetById(appId);

                    var appTemplates = await studioClient.GetAllAppTemplates();
                    app.Templates = appTemplates;

                    var contractResolver = new DefaultContractResolver
                    {
                        NamingStrategy = new SnakeCaseNamingStrategy()
                    };

                    var appString = JsonConvert.SerializeObject(app, new JsonSerializerSettings
                    {
                        ContractResolver = contractResolver,
                        Formatting = Formatting.Indented,
                        ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                    });

                    var packages = await studioClient.PackageGetAll();
                    var lastPackageVersion = packages.Last().Version;
                    var versions = new List<string>();

                    foreach (var package in packages)
                    {
                        if (package.Version != lastPackageVersion)
                        {
                            var release = await releaseRepository.Get(appId, package.Version);
                            if (release == null)
                                versions.Add(package.Version);
                        }
                    }

                    versions.Add(lastPackageVersion);

                    var firstRelease = await releaseRepository.FirstTime(appId);
                    var platformApp = await applicationRepository.Get(appId);

                    //var currentReleaseId = lastRecord?.Id ?? 0;


                    /*   var releaseModel = new Release
                       {
                           Id = currentReleaseId + 1,
                           Status = ReleaseStatus.Running,
                           AppId = appId,
                           Version = ""
                       };
   
                       try
                       {
                           await releaseRepository.Create(releaseModel);
                       }
                       catch (Exception e)
                       {
                           Console.WriteLine(e);
                           throw;
                       }*/

                    if (versions.Count == 0)
                    {
                        var newRelease = await releaseRepository.Get(newReleaseId);

                        await releaseRepository.Delete(newRelease);
                    }


                    var releases = await PublishHelper.ApplyVersions(_configuration, _storage, JObject.Parse(appString), orgId, $"app{appId}", versions, platformApp == null, firstRelease, token, appUrl, authUrl, useSsl, _hostingEnvironment);

                    foreach (var obj in releases.OfType<Release>().Select((release, index) => new {release, index}))
                    {
                        var release = obj.release;
                        var index = obj.index;

                        if (index == 0)
                        {
                            var newRelease = await releaseRepository.Get(newReleaseId);
                            newRelease.AppId = release.AppId;
                            newRelease.Version = release.Version;
                            newRelease.EndTime = release.EndTime;
                            newRelease.Status = release.Status;
                            newRelease.UpdatedById = 1;
                            
                            await releaseRepository.Update(newRelease);
                        }
                        else
                        {
                            var releaseNew = new Release
                            {
                                AppId = release.AppId,
                                EndTime = release.EndTime,
                                StartTime = release.StartTime,
                                Status = release.Status,
                                Settings = release.Settings,
                                Version = release.Version,
                                CreatedById = 1
                            };

                            await releaseRepository.Create(releaseNew);
                        }
                    }
                }
            }
        }

        [QueueCustom]
        public async Task UpdateTenants(int appId, int orgId, int userId, IList<int> tenants, string token, int pointerReleaseId)
        {
            var studioClient = new StudioClient(_configuration, token, appId, orgId);
            using (var scope = _serviceScopeFactory.CreateScope())
            {
                var platformDbContext = scope.ServiceProvider.GetRequiredService<PlatformDBContext>();

                using (var releaseRepository = new ReleaseRepository(platformDbContext, _configuration)) //, cacheHelper))
                using (var platformRepository = new PlatformRepository(platformDbContext, _configuration)) //, cacheHelper))
                {
                    platformRepository.CurrentUser = releaseRepository.CurrentUser = new CurrentUser {UserId = userId};

                    var packages = await studioClient.PackageGetAll();
                    var lastPackageVersion = packages.Last().Version;
                    var versions = new List<string>();
                    var logResult = new JObject();
                    foreach (var tenantObj in tenants.OfType<object>().Select((id, index) => new {id, index}))
                    {
                        var dbName = $"tenant{tenantObj.id}";
                        var exists = PostgresHelper.Read(_configuration.GetConnectionString("PlatformDBConnection"), "platform", $"SELECT datname FROM pg_catalog.pg_database WHERE lower(datname) = lower('{dbName}');", "hasRows");

                        if (!exists)
                        {
                            logResult[dbName] = "Tenant not exists";
                            continue;
                        }
                        
                        logResult[dbName] = new JObject();
                        
                        versions = new List<string>();
                        foreach (var package in packages)
                        {
                            if (package.Version != lastPackageVersion)
                            {
                                var release = await releaseRepository.Get(appId, package.Version, int.Parse(tenantObj.id.ToString()));
                                if (release == null)
                                    versions.Add(package.Version);
                            }
                        }

                        versions.Add(lastPackageVersion);

                        foreach (var versionObj in versions.OfType<object>().Select((value, index) => new {value, index}))
                        {
                            var version = versionObj.value.ToString();
                            
                            var release = await releaseRepository.Get(appId, version, int.Parse(tenantObj.id.ToString()));

                            if (release == null)
                            {
                                var releaseModel = new Release()
                                {
                                    Status = ReleaseStatus.Running,
                                    TenantId = int.Parse(tenantObj.id.ToString()),
                                    StartTime = DateTime.Now,
                                    Version = version,
                                    AppId = appId,
                                    CreatedById = 1
                                };

                                await releaseRepository.Create(releaseModel);

                                var result = await PublishHelper.UpdateTenant(version, dbName, _configuration, _storage, appId, orgId, token, _hostingEnvironment);

                                if (result)
                                {
                                    releaseModel.EndTime = DateTime.Now;
                                    releaseModel.Status = ReleaseStatus.Succeed;
                                    releaseModel.UpdatedById = 1;
                                    
                                    await releaseRepository.Update(releaseModel);
                                    logResult[dbName][version] = "Success";
                                }
                                else
                                {
                                    releaseModel.EndTime = DateTime.Now;
                                    releaseModel.Status = ReleaseStatus.Failed;
                                    releaseModel.UpdatedById = 1;
                                    
                                    await releaseRepository.Update(releaseModel);

                                    try
                                    {
                                        var logPath = Path.Combine(Path.Combine(DataHelper.GetDataDirectoryPath(_configuration, _hostingEnvironment), "tenant-update-logs"), $"update-{dbName}-version-{version}-log.txt");
                                        var log = File.ReadAllText(logPath, Encoding.UTF8);
                                    
                                        logResult[dbName][version] = new JObject
                                        {
                                            ["Status"] = "Error",
                                            ["Logs"] = log
                                        };
                                    }
                                    catch (Exception e)
                                    {
                                        logResult[dbName][version] = new JObject
                                        {
                                            ["Status"] = "Error",
                                            ["Logs"] = "Log not found."
                                        };
                                    }
                                    
                                    break;
                                }
                            }
                            else
                            {
                                if (release.Status == ReleaseStatus.Failed)
                                {
                                    var result = await PublishHelper.UpdateTenant(version, dbName, _configuration, _storage, appId, orgId, token, _hostingEnvironment);

                                    if (result)
                                    {
                                        await releaseRepository.Update(new Release()
                                        {
                                            Id = release.Id,
                                            EndTime = DateTime.Now,
                                            Status = ReleaseStatus.Succeed,
                                            UpdatedById = 1
                                        });
                                        logResult[dbName][version] = "Success";
                                    }
                                    else
                                    {
                                        try
                                        {
                                            var logPath = Path.Combine(Path.Combine(DataHelper.GetDataDirectoryPath(_configuration, _hostingEnvironment), "tenant-update-logs"), $"update-{dbName}-version-{version}-log.txt");
                                            var log = File.ReadAllText(logPath, Encoding.UTF8);
                                    
                                            logResult[dbName][version] = new JObject
                                            {
                                                ["Status"] = "Error - Not First",
                                                ["Logs"] = log
                                            };
                                        }
                                        catch (Exception e)
                                        {
                                            logResult[dbName][version] = new JObject
                                            {
                                                ["Status"] = "Error - Not First",
                                                ["Logs"] = "Log not found."
                                            };
                                        }
                                        break;
                                    }
                                }
                            }
                        }
                    }

                    var pointerRelease = await releaseRepository.Get(pointerReleaseId);
                    pointerRelease.Status = ReleaseStatus.Succeed;
                    pointerRelease.UpdatedById = 1;
                    await releaseRepository.Update(pointerRelease);

                    var rootPath = DataHelper.GetDataDirectoryPath(_configuration, _hostingEnvironment);
                    Directory.Delete(Path.Combine(rootPath, "packages", $"app{appId}"), true);
                    ErrorHandler.LogMessage("Update tenants has ended for app id : " + appId + ". Info json : " + logResult.ToJsonString(), SentryLevel.Info);
                }
            }
        }
    }
}