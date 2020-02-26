﻿using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using PrimeApps.Model.Context;
using PrimeApps.Model.Enums;
using PrimeApps.Model.Helpers;
using PrimeApps.Model.Repositories;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Hosting;
using Newtonsoft.Json.Serialization;
using PrimeApps.Model.Entities.Tenant;
using PrimeApps.Model.Storage;

namespace PrimeApps.Studio.Helpers
{
	public interface IPackageHelper
	{
		Task All(int appId, JObject packageModel, string dbName, string version, int packageId, List<HistoryStorage> historyStorages);

		Task Diffs(List<HistoryDatabase> historyDatabases, List<HistoryStorage> historyStorages, int appId, string dbName, string version, int packageId);
	}

	public class PackageHelper : IPackageHelper
	{
		private CurrentUser _currentUser;
		private IConfiguration _configuration;
		private IServiceScopeFactory _serviceScopeFactory;
		private IHttpContextAccessor _context;
		private IUnifiedStorage _storage;
		private IHostingEnvironment _hostingEnvironment;

		public PackageHelper(IConfiguration configuration,
			IServiceScopeFactory serviceScopeFactory,
			IHttpContextAccessor context,
			IUnifiedStorage storage,
			IHostingEnvironment hostingEnvironment)
		{
			_storage = storage;
			_configuration = configuration;
			_serviceScopeFactory = serviceScopeFactory;
			_context = context;
			_currentUser = UserHelper.GetCurrentUser(_context);
			_hostingEnvironment = hostingEnvironment;
		}

		public async Task All(int appId, JObject packageModel, string dbName, string version, int packageId, List<HistoryStorage> historyStorages)
		{
			using (var _scope = _serviceScopeFactory.CreateScope())
			{
				var studioDbContext = _scope.ServiceProvider.GetRequiredService<StudioDBContext>();
				var platformDbContext = _scope.ServiceProvider.GetRequiredService<PlatformDBContext>();
				var tenantDbContext = _scope.ServiceProvider.GetRequiredService<TenantDBContext>();

				using (var platformRepository = new PlatformRepository(platformDbContext, _configuration))
				//using (var deploymentRepository = new DeploymentRepository(studioDbContext, _configuration))
				using (var appDraftRepository = new AppDraftRepository(studioDbContext, _configuration))
				using (var packageRepository = new PackageRepository(studioDbContext, _configuration))
				using (var historyDatabaseRepository = new HistoryDatabaseRepository(tenantDbContext, _configuration))
				using (var recordRepository = new RecordRepository(tenantDbContext, _configuration))
				using (var moduleRepository = new ModuleRepository(tenantDbContext, _configuration))
				using (var historyStorageRepository = new HistoryStorageRepository(tenantDbContext, _configuration))
				{
					historyStorageRepository.CurrentUser = historyDatabaseRepository.CurrentUser = packageRepository.CurrentUser = platformRepository.CurrentUser = appDraftRepository.CurrentUser = recordRepository.CurrentUser = moduleRepository.CurrentUser = _currentUser;

					var studioClientId = _configuration.GetValue("AppSettings:ClientId", string.Empty);

					var app = await appDraftRepository.Get(appId);
					var studioApp = await platformRepository.AppGetByName(studioClientId);

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

					var result = false;

					try
					{
						result = await Model.Helpers.PackageHelper.All(JObject.Parse(appString), packageModel, dbName, version, _configuration, _storage, historyStorages, _hostingEnvironment, recordRepository, moduleRepository);
					}
					catch (Exception e)
					{
						ErrorHandler.LogError(e, "Studio PackageHelper All method error.");
					}

					var package = await packageRepository.Get(packageId);
					package.Status = result ? ReleaseStatus.Succeed : ReleaseStatus.Failed;
					package.EndTime = DateTime.Now;
					await packageRepository.Update(package);

					if (package.Status == ReleaseStatus.Failed)
					{
						var dbHistory = await historyDatabaseRepository.GetLast();
						if (dbHistory != null && dbHistory.Tag == version)
						{
							dbHistory.Tag = null;
							await historyDatabaseRepository.Update(dbHistory);
						}

						var storageHistory = await historyStorageRepository.GetLast();
						if (storageHistory != null && storageHistory.Tag == version)
						{
							storageHistory.Tag = null;
							await historyDatabaseRepository.Update(dbHistory);
						}
					}

					/*
                      * TODO BC
                      * Burada da bir sorun gerçekleşebilir.
                      * Böyle bir durumun önüne geçmek için burayıda try catch bloklarının içine alıp
                      * Bir sorun olma durumunda historey_database tablosunda atılan versiyon tag ını eski haline getirmek gerekiyor.
                      * Aynı zaman da packages tablosunda oluşan kaydıda düzeltmek gerekiyor.
                      */
					UploadPackage(appId, dbName, package.Version);
				}
			}
		}

		public async Task Diffs(List<HistoryDatabase> historyDatabases, List<HistoryStorage> historyStorages, int appId, string dbName, string version, int packageId)
		{
			using (var _scope = _serviceScopeFactory.CreateScope())
			{
				var studioDbContext = _scope.ServiceProvider.GetRequiredService<StudioDBContext>();
				var platformDbContext = _scope.ServiceProvider.GetRequiredService<PlatformDBContext>();
				var tenantDbContext = _scope.ServiceProvider.GetRequiredService<TenantDBContext>();

				using (var platformRepository = new PlatformRepository(platformDbContext, _configuration))
				//using (var deploymentRepository = new DeploymentRepository(studioDbContext, _configuration))
				using (var appDraftRepository = new AppDraftRepository(studioDbContext, _configuration))
				using (var packageRepository = new PackageRepository(studioDbContext, _configuration))
				using (var historyDatabaseRepository = new HistoryDatabaseRepository(tenantDbContext, _configuration))
				using (var historyStorageRepository = new HistoryStorageRepository(tenantDbContext, _configuration))
				{
					historyStorageRepository.CurrentUser = historyDatabaseRepository.CurrentUser = packageRepository.CurrentUser = platformRepository.CurrentUser = appDraftRepository.CurrentUser = _currentUser;

					var studioClientId = _configuration.GetValue("AppSettings:ClientId", string.Empty);

					var app = await appDraftRepository.Get(appId);
					var studioApp = await platformRepository.AppGetByName(studioClientId);

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

					//var missingScripts = await CheckMissingScripts(version, appId);
					//var missingFiles = await CheckMissingFiles(version, appId);
					var result = false;

					try
					{
						result = await Model.Helpers.PackageHelper.Diffs(historyDatabases, historyStorages, JObject.Parse(appString), dbName, version, packageId, _configuration, _storage, _hostingEnvironment);
					}
					catch (Exception e)
					{
						Console.WriteLine(e);
					}


					var package = await packageRepository.Get(packageId);
					package.Status = result ? ReleaseStatus.Succeed : ReleaseStatus.Failed;
					package.EndTime = DateTime.Now;
					await packageRepository.Update(package);

					if (package.Status == ReleaseStatus.Failed)
					{
						var dbHistory = await historyDatabaseRepository.GetLast();
						if (dbHistory != null && dbHistory.Tag == version)
						{
							dbHistory.Tag = null;
							await historyDatabaseRepository.Update(dbHistory);
						}

						var storageHistory = await historyStorageRepository.GetLast();
						if (storageHistory != null && storageHistory.Tag == version)
						{
							storageHistory.Tag = null;
							await historyDatabaseRepository.Update(dbHistory);
						}
					}

					/*
                     * TODO BC
                     * Burada da bir sorun gerçekleşebilir.
                     * Böyle bir durumun önüne geçmek için burayıda try catch bloklarının içine alıp
                     * Bir sorun olma durumunda historey_database tablosunda atılan versiyon tag ını eski haline getirmek gerekiyor.
                     * Aynı zaman da packages tablosunda oluşan kaydıda düzeltmek gerekiyor.
                     */
					UploadPackage(appId, dbName, package.Version);
					/*var deployment = await deploymentRepository.Get(deploymentId);

                    if (deployment != null)
                    {
                        deployment.Status = result ? DeploymentStatus.Succeed : DeploymentStatus.Failed;
                        deployment.EndTime = DateTime.Now;

                        await deploymentRepository.Update(deployment);
                    }*/
				}
			}
		}


		/*public async Task<List<string>> CheckMissingFiles(int version, int appId)
        {
            var endLoop = false;
            var scripts = new List<string>();
            var PREConnectionString = _configuration.GetConnectionString("PlatformDBConnection");

            while (!endLoop)
            {
                version = version - 1;

                try
                {
                    var query = $"SELECT * FROM \"public\".history_storages WHERE \"public\".history_storages.tag = '{version.ToString()}'";
                    var result = PosgresHelper.Read(PREConnectionString, $"app{appId}", query);

                    if (result == null)
                    {
                        var bucketName = UnifiedStorage.GetPath("packages", "app", appId, version + "/");


                        //var objects = await _storage.GetObject(bucketName, "scripts.txt");

                        using (var response = await _storage.GetObject(bucketName, "scripts.txt"))
                        using (var responseStream = response.ResponseStream)
                        using (var reader = new StreamReader(responseStream))
                        {
                            var script = reader.ReadToEnd();
                            if (!string.IsNullOrEmpty(script))
                                scripts.Add(script);
                        }
                    }
                    else
                        endLoop = true;
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    throw;
                }
            }

            return scripts;
        }

        public async Task<List<JObject>> CheckMissingScripts(int version, int appId)
        {
            var endLoop = false;
            var scripts = new List<JObject>();
            var PREConnectionString = _configuration.GetConnectionString("PlatformDBConnection");

            while (!endLoop)
            {
                version = version - 1;

                var query = $"SELECT * FROM \"public\".history_database WHERE \"public\".history_database.tag = '{version.ToString()}'";
                var result = PosgresHelper.Read(PREConnectionString, $"app{appId}", query);

                if (result == null)
                {
                    var bucketName = UnifiedStorage.GetPath("packages", "app", appId, version + "/");
                    //var objects = await _storage.GetObject(bucketName, "scripts.txt");
                    using (var response = await _storage.GetObject(bucketName, "scripts.txt"))
                    using (var responseStream = response.ResponseStream)
                    using (var reader = new StreamReader(responseStream))
                    {
                        var script = reader.ReadToEnd();
                        if (!string.IsNullOrEmpty(script))
                        {
                            scripts.Add(new JObject {["is_dump"] = false, ["script"] = script});


                            var dumpExists = await _storage.ObjectExists(bucketName, $"app{appId}.dmp");
                            if (dumpExists)
                            {
                                using (var dumpResponse = await _storage.GetObject(bucketName, $"app{appId}.dmp"))
                                using (var dumpResponseStream = dumpResponse.ResponseStream)
                                using (var dumpReader = new StreamReader(dumpResponseStream))
                                {
                                    var dump = dumpReader.ReadToEnd();
                                    scripts.Add(new JObject {["is_dump"] = true, ["script"] = dump});
                                    endLoop = true;
                                }
                            }
                        }
                    }
                }
                else
                    endLoop = true;
            }

            return scripts;
        }*/

		public async void UploadPackage(int appId, string dbName, string version)
		{
			var path = DataHelper.GetDataDirectoryPath(_configuration, _hostingEnvironment);
			var bucketName = UnifiedStorage.GetPath("packages", "app", appId, version + "/");

			await _storage.CreateBucketIfNotExists(bucketName);

			try
			{
				using (var fileStream = new FileStream(Path.Combine(path, "packages", dbName, $"{dbName}.zip"), FileMode.OpenOrCreate))
				{
					var request = new PutObjectRequest()
					{
						BucketName = bucketName,
						Key = $"{version}.zip",
						InputStream = fileStream,
						ContentType = "application/zip"
					};
					await _storage.Upload(request);
				}

				//await _storage.UploadDirAsync(bucketName, $"{path}releases\\{dbName}\\{dbName}.zip");
			}
			catch (Exception e)
			{
				throw e;
			}

			Directory.Delete(Path.Combine(path, "packages", dbName, version), true);
			File.Delete(Path.Combine(path, "packages", dbName, $"{dbName}.zip"));
		}
	}
}