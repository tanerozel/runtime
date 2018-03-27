﻿using Elmah;
using Newtonsoft.Json.Linq;
using PrimeApps.App.Models;
using PrimeApps.Model.Context;
using PrimeApps.Model.Entities.Application;
using PrimeApps.Model.Enums;
using PrimeApps.Model.Helpers;
using PrimeApps.Model.Repositories;
using PrimeApps.Model.Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using Microsoft.ApplicationInsights.AspNetCore;
using Microsoft.IdentityModel.Protocols;
using PrimeApps.Model.Common.Cache;
using PrimeApps.Model.Common.Record;

namespace PrimeApps.App.Helpers
{
    public static class ProcessHelper
    {
        public static async Task Run(OperationType operationType, JObject record, Module module, UserItem appUser, Warehouse warehouse, ProcessTriggerTime triggerTime)
        {
            using (var databaseContext = new TenantDBContext(appUser.TenantId))
            {

                using (var processRequestRepository = new ProcessRequestRepository(databaseContext))
                {
                    var requestInsert = await processRequestRepository.GetByRecordId((int)record["id"], OperationType.insert);
                    var requestUpdate = await processRequestRepository.GetByRecordId((int)record["id"], OperationType.update);
                    if ((requestInsert != null && requestInsert.Status == Model.Enums.ProcessStatus.Rejected) || (requestUpdate != null && requestUpdate.Status == Model.Enums.ProcessStatus.Rejected))
                        return;
                }

                using (var processRepository = new ProcessRepository(databaseContext))
                {
                    var processes = await processRepository.GetAll(module.Id, appUser.Id, true);
                    processes = processes.Where(x => x.OperationsArray.Contains(operationType.ToString())).ToList();
                    var culture = CultureInfo.CreateSpecificCulture(appUser.TenantLanguage == "tr" ? "tr-TR" : "en-US");

                    if (processes.Count < 1)
                        return;

                    foreach (var process in processes)
                    {
                        if (process.TriggerTime != triggerTime)
                            return;

                        if ((process.Frequency == WorkflowFrequency.NotSet || process.Frequency == WorkflowFrequency.OneTime) && operationType != OperationType.delete)
                        {
                            var hasLog = await processRepository.HasLog(process.Id, module.Id, (int)record["id"]);

                            if (hasLog)
                                continue;
                        }

                        using (var moduleRepository = new ModuleRepository(databaseContext))
                        {
                            using (var recordRepository = new RecordRepository(databaseContext))
                            {
                                var lookupModuleNames = new List<string>();
                                ICollection<Module> lookupModules = null;

                                foreach (var field in module.Fields)
                                {
                                    if (!field.Deleted && field.DataType == DataType.Lookup && field.LookupType != "users" && field.LookupType != "relation" && !lookupModuleNames.Contains(field.LookupType))
                                        lookupModuleNames.Add(field.LookupType);
                                }


                                if (lookupModuleNames.Count > 0)
                                    lookupModules = await moduleRepository.GetByNamesBasic(lookupModuleNames);
                                else
                                    lookupModules = new List<Module>();

                                lookupModules.Add(Model.Helpers.ModuleHelper.GetFakeUserModule());
                                if (process.ApproverType == ProcessApproverType.DynamicApprover)
                                    await CalculationHelper.Calculate((int)record["id"], module, appUser, warehouse, OperationType.insert);

                                record = recordRepository.GetById(module, (int)record["id"], false, lookupModules);
                            }
                        }

                        if (process.Filters != null && process.Filters.Count > 0)
                        {
                            var filters = process.Filters;
                            var mismatchedCount = 0;

                            foreach (var filter in filters)
                            {
                                var filterField = module.Fields.FirstOrDefault(x => x.Name == filter.Field);

                                if (filterField.DataType == DataType.Lookup && filterField.LookupType != "users")
                                    filter.Field = filter.Field + ".id";

                                if (filterField == null || record[filter.Field] == null)
                                {
                                    mismatchedCount++;
                                    continue;
                                }

                                var filterOperator = filter.Operator;
                                var fieldValueString = record[filter.Field].ToString();
                                var filterValueString = filter.Value;
                                double fieldValueNumber;
                                double filterValueNumber;
                                double.TryParse(fieldValueString, out fieldValueNumber);
                                double.TryParse(filterValueString, out filterValueNumber);

                                if (filterField.DataType == DataType.Lookup && filterField.LookupType == "users" && filterValueNumber == 0)
                                    filterValueNumber = appUser.Id;

                                switch (filterOperator)
                                {
                                    case Operator.Is:
                                        if (fieldValueString.Trim().ToLower(culture) != filterValueString.Trim().ToLower(culture))
                                            mismatchedCount++;
                                        break;
                                    case Operator.IsNot:
                                        if (fieldValueString.Trim().ToLower(culture) == filterValueString.Trim().ToLower(culture))
                                            mismatchedCount++;
                                        break;
                                    case Operator.Equals:
                                        if (fieldValueNumber != filterValueNumber)
                                            mismatchedCount++;
                                        break;
                                    case Operator.NotEqual:
                                        if (fieldValueNumber == filterValueNumber)
                                            mismatchedCount++;
                                        break;
                                    case Operator.Contains:
                                        if (!(fieldValueString.Contains("|") || filterValueString.Contains("|")))
                                        {
                                            if (!fieldValueString.Trim().ToLower(culture).Contains(filterValueString.Trim().ToLower(culture)))
                                                mismatchedCount++;
                                        }
                                        else
                                        {
                                            var fieldValueStringArray = fieldValueString.Split('|');
                                            var filterValueStringArray = filterValueString.Split('|');

                                            foreach (var filterValueStr in filterValueStringArray)
                                            {
                                                if (!fieldValueStringArray.Contains(filterValueStr))
                                                    mismatchedCount++;
                                            }
                                        }
                                        break;
                                    case Operator.NotContain:
                                        if (!(fieldValueString.Contains("|") || filterValueString.Contains("|")))
                                        {
                                            if (fieldValueString.Trim().ToLower(culture).Contains(filterValueString.Trim().ToLower(culture)))
                                                mismatchedCount++;
                                        }
                                        else
                                        {
                                            var fieldValueStringArray = fieldValueString.Split('|');
                                            var filterValueStringArray = filterValueString.Split('|');

                                            foreach (var filterValueStr in filterValueStringArray)
                                            {
                                                if (fieldValueStringArray.Contains(filterValueStr))
                                                    mismatchedCount++;
                                            }
                                        }
                                        break;
                                    case Operator.StartsWith:
                                        if (!fieldValueString.Trim().ToLower(culture).StartsWith(filterValueString.Trim().ToLower(culture)))
                                            mismatchedCount++;
                                        break;
                                    case Operator.EndsWith:
                                        if (!fieldValueString.Trim().ToLower(culture).EndsWith(filterValueString.Trim().ToLower(culture)))
                                            mismatchedCount++;
                                        break;
                                    case Operator.Empty:
                                        if (!string.IsNullOrWhiteSpace(fieldValueString))
                                            mismatchedCount++;
                                        break;
                                    case Operator.NotEmpty:
                                        if (string.IsNullOrWhiteSpace(fieldValueString))
                                            mismatchedCount++;
                                        break;
                                    case Operator.Greater:
                                        if (fieldValueNumber <= filterValueNumber)
                                            mismatchedCount++;
                                        break;
                                    case Operator.GreaterEqual:
                                        if (fieldValueNumber < filterValueNumber)
                                            mismatchedCount++;
                                        break;
                                    case Operator.Less:
                                        if (fieldValueNumber >= filterValueNumber)
                                            mismatchedCount++;
                                        break;
                                    case Operator.LessEqual:
                                        if (fieldValueNumber > filterValueNumber)
                                            mismatchedCount++;
                                        break;
                                }
                            }

                            if (mismatchedCount > 0)
                                continue;
                        }

                        using (var recordRepository = new RecordRepository(databaseContext, warehouse))
                        {
                            //Set warehouse database name
                            warehouse.DatabaseName = appUser.WarehouseDatabaseName;

                            using (var userRepository = new UserRepository(databaseContext))
                            {
                                var user = new TenantUser();
                                if (process.ApproverType == ProcessApproverType.StaticApprover)
                                {
                                    user = await userRepository.GetById(process.Approvers.First(x => x.Order == 1).UserId);
                                }
                                else
                                {
                                    if (record["custom_approver"].IsNullOrEmpty() && record["custom_approver_2"].IsNullOrEmpty())
                                    {
                                        var approverFields = process.ApproverField.Split(',');
                                        var firstApprover = approverFields[0];
                                        var approverModuleName = firstApprover.Split('.')[0];
                                        var approverLookupName = firstApprover.Split('.')[1];
                                        var approverFieldName = firstApprover.Split('.')[2];

                                        foreach (var field in module.Fields)
                                        {
                                            if (!field.Deleted && field.DataType == DataType.Lookup && field.Name == approverModuleName)
                                                approverModuleName = field.LookupType;
                                        }

                                        Module approverLookupFieldModule;

                                        if (approverModuleName == process.Module.Name)
                                            approverLookupFieldModule = process.Module;
                                        else
                                        {
                                            using (var moduleRepository = new ModuleRepository(databaseContext))
                                            {
                                                var approverModule = await moduleRepository.GetByNameBasic(approverModuleName);
                                                var approverLookupField = approverModule.Fields.FirstOrDefault(x => x.Name == approverLookupName);
                                                approverLookupFieldModule = await moduleRepository.GetByNameBasic(approverLookupField.LookupType);
                                            }
                                        }

                                        var approverUserRecord = recordRepository.GetById(approverLookupFieldModule, (int)record[firstApprover.Split('.')[0] + "." + approverLookupName], false);
                                        var userMail = (string)approverUserRecord[approverFieldName];
                                        record["custom_approver"] = userMail;

                                        if (approverFields.Length > 1)
                                        {
                                            var secondApprover = approverFields[1];
                                            var secondApproverModuleName = secondApprover.Split('.')[0];
                                            var secondApproverLookupName = secondApprover.Split('.')[1];
                                            var secondApproverFieldName = secondApprover.Split('.')[2];
                                            foreach (var field in process.Module.Fields)
                                            {
                                                if (!field.Deleted && field.DataType == DataType.Lookup && field.Name == secondApproverModuleName)
                                                    secondApproverModuleName = field.LookupType;
                                            }

                                            var secondApproverModule = new Module();
                                            if (secondApproverModuleName == process.Module.Name)
                                                secondApproverModule = process.Module;
                                            else
                                            {
                                                using (var moduleRepository = new ModuleRepository(databaseContext))
                                                {
                                                    secondApproverModule = await moduleRepository.GetByNameBasic(secondApproverModuleName);
                                                }
                                            }
                                            var secondApproverUserRecord = recordRepository.GetById(secondApproverModule, (int)record[secondApprover.Split('.')[0] + "." + secondApproverLookupName], false);
                                            var secondUserMail = (string)secondApproverUserRecord[secondApproverFieldName];
                                            record["custom_approver_2"] = secondUserMail;
                                        }

                                        await recordRepository.Update(record, module);
                                        user = await userRepository.GetByEmail(userMail);
                                    }
                                    else
                                    {
                                        var approverMail = (string)record["custom_approver"];
                                        user = await userRepository.GetByEmail(approverMail);
                                    }
                                }

                                var emailData = new Dictionary<string, string>();
                                string domain;

                                domain = "https://{0}.ofisim.com/";
                                var appDomain = "crm";

                                switch (appUser.AppId)
                                {
                                    case 2:
                                        appDomain = "kobi";
                                        break;
                                    case 3:
                                        appDomain = "asistan";
                                        break;
                                    case 4:
                                        appDomain = "ik";
                                        break;
                                    case 5:
                                        appDomain = "cagri";
                                        break;
                                }

                                var subdomain = ConfigurationManager<>.AppSettings.Get("TestMode") == "true" ? "test" : appDomain;
                                domain = string.Format(domain, subdomain);

                                //domain = "http://localhost:5554/";

                                string url = "";
                                if (module.Name == "timetrackers")
                                {
                                    url = domain + "#/app/crm/timetracker?user=" + (int)record["created_by.id"] + "&year=" + (int)record["year"] + "&month=" + (int)record["month"] + "&week=" + (int)record["week"];
                                }
                                else
                                {
                                    url = domain + "#/app/crm/module/" + module.Name + "?id=" + (int)record["id"];
                                }


                                if (appUser.Culture.Contains("tr"))
                                    emailData.Add("ModuleName", module.LabelTrSingular);
                                else
                                    emailData.Add("ModuleName", module.LabelEnSingular);

                                emailData.Add("Url", url);
                                emailData.Add("ApproverName", user.FullName);
                                emailData.Add("UserName", (string)record["owner.full_name"]);


                                if (module.Name == "izinler")
                                {
                                    if ((bool)record["izin_turu.yillik_izin"] && (int)record["mevcut_kullanilabilir_izin"] -
                                        (int)record["hesaplanan_alinacak_toplam_izin"] < 0)
                                    {
                                        if (appUser.TenantLanguage == "tr")
                                            emailData.Add("ExtraLeave", "İlgili çalışan izin borçlanma talep etmektedir.");
                                        else
                                            emailData.Add("ExtraLeave", "The employee requests for leave with borrowing right.");
                                    }
                                    else
                                    {
                                        emailData.Add("ExtraLeave", "");
                                    }

                                }
                                else
                                {
                                    emailData.Add("ExtraLeave", "");
                                }

                                if (!string.IsNullOrWhiteSpace(appUser.Culture) && Constants.CULTURES.Contains(appUser.Culture))
                                    Thread.CurrentThread.CurrentCulture = CultureInfo.CreateSpecificCulture(appUser.Culture);

                                if (operationType == OperationType.insert)
                                {
                                    var notification = new Email(typeof(Resources.Email.ApprovalProcessCreateNotification), Thread.CurrentThread.CurrentCulture.Name, emailData, appUser.AppId, appUser);
                                    notification.AddRecipient(user.Email);
                                    notification.AddToQueue(appUser.TenantId, module.Id, (int)record["id"], appUser: appUser);
                                }
                                else if (operationType == OperationType.update)
                                {
                                    var notification = new Email(typeof(Resources.Email.ApprovalProcessUpdateNotification), Thread.CurrentThread.CurrentCulture.Name, emailData, appUser.AppId, appUser);
                                    notification.AddRecipient(user.Email);
                                    notification.AddToQueue(appUser.TenantId, module.Id, (int)record["id"], appUser: appUser);
                                }
                                else if (operationType == OperationType.delete)
                                {

                                }

                                var processRequest = new ProcessRequest
                                {
                                    ProcessId = process.Id,
                                    RecordId = (int)record["id"],
                                    Status = Model.Enums.ProcessStatus.Waiting,
                                    OperationType = operationType,
                                    ProcessStatusOrder = 1,
                                    CreatedById = (int)record["owner.id"],
                                    Active = true,
                                    Module = module.Name
                                };


                                try
                                {
                                    var resultRequestLog = await processRepository.CreateRequest(processRequest);
                                    
                                    if (resultRequestLog < 1)
                                        ErrorLog.GetDefault(null).Log(new Error(new Exception("ProcessRequest cannot be created! Object: " + processRequest.ToJsonString())));

                                    var newRecord = recordRepository.GetById(module, (int)record["id"], false);
                                    await WorkflowHelper.Run(operationType, newRecord, module, appUser, warehouse);
                                }
                                catch (Exception ex)
                                {
                                    ErrorLog.GetDefault(null).Log(new Error(ex));
                                }
                            }

                            var processLog = new ProcessLog
                            {
                                ProcessId = process.Id,
                                ModuleId = module.Id,
                                RecordId = (int)record["id"]
                            };

                            try
                            {
                                var resultCreateLog = await processRepository.CreateLog(processLog);

                                if (resultCreateLog < 1)
                                    ErrorLog.GetDefault(null).Log(new Error(new Exception("ProcessLog cannot be created! Object: " + processLog.ToJsonString())));
                            }
                            catch (Exception ex)
                            {
                                ErrorLog.GetDefault(null).Log(new Error(ex));
                            }
                        }
                    }
                }
            }
        }

        public async static Task<Process> CreateEntity(ProcessBindingModel processModel, string tenantLanguage, IModuleRepository moduleRepository, IPicklistRepository picklistRepository)
        {
            var process = new Process
            {
                ModuleId = processModel.ModuleId,
                UserId = processModel.UserId,
                Name = processModel.Name,
                Frequency = processModel.Frequency,
                Active = processModel.Active,
                OperationsArray = processModel.Operations,
                ApproverType = processModel.ApproverType,
                TriggerTime = processModel.TriggerTime,
                ApproverField = processModel.ApproverField,
                Profiles = processModel.Profiles
            };

            if (processModel.Filters != null && processModel.Filters.Count > 0)
            {
                var module = await moduleRepository.GetById(processModel.ModuleId);
                var picklistItemIds = new List<int>();
                process.Filters = new List<ProcessFilter>();

                foreach (var filterModel in processModel.Filters)
                {
                    var field = module.Fields.Single(x => x.Name == filterModel.Field);

                    if (field.DataType == DataType.Picklist)
                    {
                        picklistItemIds.Add(int.Parse(filterModel.Value.ToString()));
                    }
                    else if (field.DataType == DataType.Multiselect)
                    {
                        var values = filterModel.Value.ToString().Split(',');

                        foreach (var value in values)
                        {
                            picklistItemIds.Add(int.Parse(value));
                        }
                    }
                }

                ICollection<PicklistItem> picklistItems = null;

                if (picklistItemIds.Count > 0)
                    picklistItems = await picklistRepository.FindItems(picklistItemIds);

                foreach (var filterModel in processModel.Filters)
                {
                    var field = module.Fields.Single(x => x.Name == filterModel.Field);
                    var value = filterModel.Value.ToString();

                    if (field.DataType == DataType.Picklist)
                    {
                        var picklistItem = picklistItems.Single(x => x.Id == int.Parse(filterModel.Value.ToString()));
                        value = tenantLanguage == "tr" ? picklistItem.LabelTr : picklistItem.LabelEn;
                    }
                    else if (field.DataType == DataType.Multiselect)
                    {
                        var picklistLabels = new List<string>();

                        var values = filterModel.Value.ToString().Split(',');

                        foreach (var val in values)
                        {
                            var picklistItem = picklistItems.Single(x => x.Id == int.Parse(val));
                            picklistLabels.Add(tenantLanguage == "tr" ? picklistItem.LabelTr : picklistItem.LabelEn);
                        }

                        value = string.Join("|", picklistLabels);
                    }

                    var filter = new ProcessFilter
                    {
                        Field = filterModel.Field,
                        Operator = filterModel.Operator,
                        Value = value,
                        No = filterModel.No
                    };

                    process.Filters.Add(filter);
                }
            }

            if (processModel.Approvers != null)
            {
                process.Approvers = new List<ProcessApprover>();

                foreach (var processes in processModel.Approvers)
                {
                    var processApprover = new ProcessApprover
                    {
                        UserId = processes.UserId,
                        Order = processes.Order
                    };

                    process.Approvers.Add(processApprover);
                }
            }

            return process;
        }

        public static async Task UpdateEntity(ProcessBindingModel processModel, Process process, string tenantLanguage, IModuleRepository moduleRepository, IPicklistRepository picklistRepository)
        {
            process.Name = processModel.Name;
            process.Frequency = processModel.Frequency;
            process.Active = processModel.Active;
            process.OperationsArray = processModel.Operations;
            process.Profiles = processModel.Profiles;
            process.ApproverField = processModel.ApproverField;

            if (processModel.Filters != null && processModel.Filters.Count > 0)
            {
                if (process.Filters == null)
                    process.Filters = new List<ProcessFilter>();

                var module = await moduleRepository.GetById(processModel.ModuleId);
                var picklistItemIds = new List<int>();

                foreach (var filterModel in processModel.Filters)
                {
                    var field = module.Fields.Single(x => x.Name == filterModel.Field);

                    if (field.DataType == DataType.Picklist)
                    {
                        picklistItemIds.Add(int.Parse(filterModel.Value.ToString()));
                    }
                    else if (field.DataType == DataType.Multiselect)
                    {
                        var values = filterModel.Value.ToString().Split(',');

                        foreach (var value in values)
                        {
                            picklistItemIds.Add(int.Parse(value));
                        }
                    }
                }

                ICollection<PicklistItem> picklistItems = null;

                if (picklistItemIds.Count > 0)
                    picklistItems = await picklistRepository.FindItems(picklistItemIds);

                foreach (var filterModel in processModel.Filters)
                {
                    var field = module.Fields.Single(x => x.Name == filterModel.Field);
                    var value = filterModel.Value.ToString();

                    if (field.DataType == DataType.Picklist)
                    {
                        var picklistItem = picklistItems.Single(x => x.Id == int.Parse(filterModel.Value.ToString()));
                        value = tenantLanguage == "tr" ? picklistItem.LabelTr : picklistItem.LabelEn;
                    }
                    else if (field.DataType == DataType.Multiselect)
                    {
                        var picklistLabels = new List<string>();

                        var values = filterModel.Value.ToString().Split(',');

                        foreach (var val in values)
                        {
                            var picklistItem = picklistItems.Single(x => x.Id == int.Parse(val));
                            picklistLabels.Add(tenantLanguage == "tr" ? picklistItem.LabelTr : picklistItem.LabelEn);
                        }

                        value = string.Join("|", picklistLabels);
                    }

                    var filter = new ProcessFilter
                    {
                        Field = filterModel.Field,
                        Operator = filterModel.Operator,
                        Value = value,
                        No = filterModel.No
                    };

                    process.Filters.Add(filter);
                }
            }

            if (processModel.Approvers != null)
            {
                if (process.Approvers == null)
                    process.Approvers = new List<ProcessApprover>();

                foreach (var processes in processModel.Approvers)
                {
                    var processApprover = new ProcessApprover
                    {
                        UserId = processes.UserId,
                        Order = processes.Order
                    };

                    process.Approvers.Add(processApprover);
                }

            }
        }

        public static async Task ApproveRequest(ProcessRequest request, UserItem appUser, Warehouse warehouse)
        {
            using (var databaseContext = new TenantDBContext(appUser.TenantId))
            {
                using (var recordRepository = new RecordRepository(databaseContext, warehouse))
                {
                    warehouse.DatabaseName = appUser.WarehouseDatabaseName;

                    using (var processRepository = new ProcessRepository(databaseContext))
                    {
                        var process = await processRepository.GetById(request.ProcessId);

                        if ((process.Approvers.Count != request.ProcessStatusOrder && process.ApproverType == ProcessApproverType.StaticApprover) || (process.ApproverType == ProcessApproverType.DynamicApprover && request.ProcessStatusOrder == 1 && process.ApproverField.Split(',').Length > 1))
                        {
                            request.ProcessStatusOrder++;

                            using (var userRepository = new UserRepository(databaseContext))
                            {
                                var user = new TenantUser();
                                var record = new JObject();
                                if (process.ApproverType == ProcessApproverType.StaticApprover)
                                {
                                    var nextApproverOrder = request.ProcessStatusOrder;
                                    var nextApprover = process.Approvers.FirstOrDefault(x => x.Order == nextApproverOrder);
                                    user = await userRepository.GetById(nextApprover.UserId);
                                }
                                else
                                {
                                    var lookupModuleNames = new List<string>();
                                    ICollection<Module> lookupModules = null;

                                    foreach (var field in process.Module.Fields)
                                    {
                                        if (!field.Deleted && field.DataType == DataType.Lookup && field.LookupType != "users" && field.LookupType != "relation" && !lookupModuleNames.Contains(field.LookupType))
                                            lookupModuleNames.Add(field.LookupType);
                                    }

                                    using (var moduleRepository = new ModuleRepository(databaseContext))
                                    {
                                        if (lookupModuleNames.Count > 0)
                                            lookupModules = await moduleRepository.GetByNamesBasic(lookupModuleNames);
                                        else
                                            lookupModules = new List<Module>();

                                        lookupModules.Add(Model.Helpers.ModuleHelper.GetFakeUserModule());
                                        if (process.ApproverType == ProcessApproverType.DynamicApprover)
                                            await CalculationHelper.Calculate(request.RecordId, process.Module, appUser, warehouse, OperationType.insert);

                                        record = recordRepository.GetById(process.Module, request.RecordId, false, lookupModules);
                                        var approverMail = (string)record["custom_approver_2"];
                                        user = await userRepository.GetByEmail(approverMail);
                                    }
                                }

                                var emailData = new Dictionary<string, string>();
                                string domain;

                                domain = "https://{0}.ofisim.com/";
                                var appDomain = "crm";

                                switch (appUser.AppId)
                                {
                                    case 2:
                                        appDomain = "kobi";
                                        break;
                                    case 3:
                                        appDomain = "asistan";
                                        break;
                                    case 4:
                                        appDomain = "ik";
                                        break;
                                    case 5:
                                        appDomain = "cagri";
                                        break;
                                }

                                var subdomain = ConfigurationManager.AppSettings.Get("TestMode") == "true" ? "test" : appDomain;
                                domain = string.Format(domain, subdomain);

                                //domain = "http://localhost:5554/";

                                string url = "";
                                if (process.Module.Name == "timetrackers")
                                {
                                    var findTimetracker = new FindRequest { Filters = new List<Filter> { new Filter { Field = "id", Operator = Operator.Equals, Value = (int)request.RecordId, No = 1 } }, Limit = 9999 };
                                    var timetrackerRecord = recordRepository.Find("timetrackers", findTimetracker);
                                    url = domain + "#/app/crm/timetracker?user=" + (int)timetrackerRecord["created_by.id"] + "&year=" + (int)timetrackerRecord["year"] + "&month=" + (int)timetrackerRecord["month"] + "&week=" + (int)timetrackerRecord["week"];
                                }
                                else
                                {
                                    url = domain + "#/app/crm/module/" + process.Module.Name + "?id=" + request.RecordId;
                                }

                                if (appUser.TenantLanguage == "tr")
                                    emailData.Add("ModuleName", process.Module.LabelTrSingular);
                                else
                                    emailData.Add("ModuleName", process.Module.LabelEnSingular);

                                emailData.Add("Url", url);
                                emailData.Add("ApproverName", user.FullName);

                                if (process.ApproverType == ProcessApproverType.StaticApprover)
                                {
                                    emailData.Add("UserName", appUser.UserName);
                                }
                                else
                                {
                                    emailData.Add("UserName", (string)record["owner.full_name"]);
                                }


                                if (!string.IsNullOrWhiteSpace(user.Culture) && Constants.CULTURES.Contains(user.Culture))
                                    Thread.CurrentThread.CurrentCulture = CultureInfo.CreateSpecificCulture(user.Culture);

                                if (request.OperationType == OperationType.insert)
                                {
                                    var notification = new Email(typeof(Resources.Email.ApprovalProcessCreateNotification), Thread.CurrentThread.CurrentCulture.Name, emailData, appUser.AppId, appUser);
                                    notification.AddRecipient(user.Email);
                                    notification.AddToQueue(appUser.TenantId, process.Module.Id, request.RecordId, appUser: appUser);
                                }
                                else if (request.OperationType == OperationType.update)
                                {
                                    var notification = new Email(typeof(Resources.Email.ApprovalProcessUpdateNotification), Thread.CurrentThread.CurrentCulture.Name, emailData, appUser.AppId, appUser);
                                    notification.AddRecipient(user.Email);
                                    notification.AddToQueue(appUser.TenantId, process.Module.Id, request.RecordId, appUser: appUser);
                                }
                                else if (request.OperationType == OperationType.delete)
                                {

                                }
                            }
                        }
                        else
                        {
                            if (request.OperationType == OperationType.delete)
                            {
                                var record = recordRepository.GetById(process.Module, request.RecordId, !appUser.HasAdminProfile);
                                await recordRepository.Delete(record, process.Module);
                            }

                            using (var userRepository = new UserRepository(databaseContext))
                            {
                                var user = await userRepository.GetById(request.CreatedById);
                                request.Status = Model.Enums.ProcessStatus.Approved;
                                request.Active = false;
                                var emailData = new Dictionary<string, string>();
                                string domain;

                                domain = "https://{0}.ofisim.com/";
                                var appDomain = "crm";

                                switch (appUser.AppId)
                                {
                                    case 2:
                                        appDomain = "kobi";
                                        break;
                                    case 3:
                                        appDomain = "asistan";
                                        break;
                                    case 4:
                                        appDomain = "ik";
                                        break;
                                    case 5:
                                        appDomain = "cagri";
                                        break;
                                }

                                var subdomain = ConfigurationManager.AppSettings.Get("TestMode") == "true" ? "test" : appDomain;
                                domain = string.Format(domain, subdomain);

                                //domain = "http://localhost:5554/";
                                string url = "";
                                if (process.Module.Name == "timetrackers")
                                {
                                    var findTimetracker = new FindRequest { Filters = new List<Filter> { new Filter { Field = "id", Operator = Operator.Equals, Value = (int)request.RecordId, No = 1 } }, Limit = 9999 };
                                    var timetrackerRecord = recordRepository.Find("timetrackers", findTimetracker);
                                    url = domain + "#/app/crm/timetracker?user=" + (int)timetrackerRecord.First()["created_by"] + "&year=" + (int)timetrackerRecord.First()["year"] + "&month=" + (int)timetrackerRecord.First()["month"] + "&week=" + (int)timetrackerRecord.First()["week"];
                                }
                                else
                                {
                                    url = domain + "#/app/crm/module/" + process.Module.Name + "?id=" + request.RecordId;
                                }

                                if (appUser.TenantLanguage == "tr")
                                    emailData.Add("ModuleName", process.Module.LabelTrSingular);
                                else
                                    emailData.Add("ModuleName", process.Module.LabelEnSingular);

                                emailData.Add("Url", url);
                                emailData.Add("UserName", user.FullName);

                                if (!string.IsNullOrWhiteSpace(user.Culture) && Constants.CULTURES.Contains(user.Culture))
                                    Thread.CurrentThread.CurrentCulture = CultureInfo.CreateSpecificCulture(user.Culture);

                                var notification = new Email(typeof(Resources.Email.ApprovalProcessApproveNotification), Thread.CurrentThread.CurrentCulture.Name, emailData, appUser.AppId, appUser);
                                notification.AddRecipient(user.Email);
                                notification.AddToQueue(appUser.TenantId, process.Module.Id, request.RecordId, appUser: appUser);
                            }
                        }
                    }
                }
            }
        }

        public static async Task RejectRequest(ProcessRequest request, string message, UserItem appUser, Warehouse warehouse)
        {
            using (var databaseContext = new TenantDBContext(appUser.TenantId))
            {
                using (var recordRepository = new RecordRepository(databaseContext, warehouse))
                {
                    warehouse.DatabaseName = appUser.WarehouseDatabaseName;

                    using (var processRepository = new ProcessRepository(databaseContext))
                    {
                        var process = await processRepository.GetById(request.ProcessId);

                        using (var userRepository = new UserRepository(databaseContext))
                        {
                            var user = await userRepository.GetById(request.CreatedById);
                            request.Status = Model.Enums.ProcessStatus.Rejected;
                            request.ProcessStatusOrder = 0;
                            var emailData = new Dictionary<string, string>();
                            string domain;

                            domain = "https://{0}.ofisim.com/";
                            var appDomain = "crm";

                            switch (appUser.AppId)
                            {
                                case 2:
                                    appDomain = "kobi";
                                    break;
                                case 3:
                                    appDomain = "asistan";
                                    break;
                                case 4:
                                    appDomain = "ik";
                                    break;
                                case 5:
                                    appDomain = "cagri";
                                    break;
                            }

                            var subdomain = ConfigurationManager.AppSettings.Get("TestMode") == "true" ? "test" : appDomain;
                            domain = string.Format(domain, subdomain);

                            //domain = "http://localhost:5554/";
                            string url = "";
                            if (process.Module.Name == "timetrackers")
                            {
                                var findTimetracker = new FindRequest { Filters = new List<Filter> { new Filter { Field = "id", Operator = Operator.Equals, Value = (int)request.RecordId, No = 1 } }, Limit = 9999 };
                                var timetrackerRecord = recordRepository.Find("timetrackers", findTimetracker);
                                url = domain + "#/app/crm/timetracker?user=" + (int)timetrackerRecord.First()["created_by"] + "&year=" + (int)timetrackerRecord.First()["year"] + "&month=" + (int)timetrackerRecord.First()["month"] + "&week=" + (int)timetrackerRecord.First()["week"];
                            }
                            else
                            {
                                url = domain + "#/app/crm/module/" + process.Module.Name + "?id=" + request.RecordId;
                            }

                            if (appUser.TenantLanguage == "tr")
                                emailData.Add("ModuleName", process.Module.LabelTrSingular);
                            else
                                emailData.Add("ModuleName", process.Module.LabelEnSingular);

                            emailData.Add("Url", url);
                            emailData.Add("UserName", user.FullName);
                            emailData.Add("Message", message);
                            emailData.Add("RejectedUser", appUser.UserName);

                            if (!string.IsNullOrWhiteSpace(user.Culture) && Constants.CULTURES.Contains(user.Culture))
                                Thread.CurrentThread.CurrentCulture = CultureInfo.CreateSpecificCulture(user.Culture);

                            if (request.OperationType == OperationType.insert)
                            {
                                var notification = new Email(typeof(Resources.Email.ApprovalProcessrejectNotification), Thread.CurrentThread.CurrentCulture.Name, emailData, appUser.AppId, appUser);
                                notification.AddRecipient(user.Email);
                                notification.AddToQueue(appUser.TenantId, process.Module.Id, request.RecordId, appUser: appUser);
                            }
                            else if (request.OperationType == OperationType.update)
                            {
                                var notification = new Email(typeof(Resources.Email.ApprovalProcessUpdateRejectNotification), Thread.CurrentThread.CurrentCulture.Name, emailData, appUser.AppId, appUser);
                                notification.AddRecipient(user.Email);
                                notification.AddToQueue(appUser.TenantId, process.Module.Id, request.RecordId, appUser: appUser);
                            }

                        }
                    }
                }
            }
        }

        public static async Task SendToApprovalAgain(ProcessRequest request, UserItem appUser, Warehouse warehouse)
        {
            using (var databaseContext = new TenantDBContext(appUser.TenantId))
            {
                using (var recordRepository = new RecordRepository(databaseContext, warehouse))
                {
                    warehouse.DatabaseName = appUser.WarehouseDatabaseName;


                    using (var processRepository = new ProcessRepository(databaseContext))
                    {
                        var process = await processRepository.GetById(request.ProcessId);

                        request.ProcessStatusOrder++;
                        request.Status = Model.Enums.ProcessStatus.Waiting;

                        using (var userRepository = new UserRepository(databaseContext))
                        {
                            var user = new TenantUser();
                            var record = new JObject();
                            if (process.ApproverType == ProcessApproverType.StaticApprover)
                            {
                                var nextApproverOrder = request.ProcessStatusOrder;
                                var nextApprover = process.Approvers.FirstOrDefault(x => x.Order == nextApproverOrder);
                                user = await userRepository.GetById(nextApprover.UserId);
                            }
                            else
                            {
                                var lookupModuleNames = new List<string>();
                                ICollection<Module> lookupModules = null;

                                foreach (var field in process.Module.Fields)
                                {
                                    if (!field.Deleted && field.DataType == DataType.Lookup && field.LookupType != "users" && field.LookupType != "relation" && !lookupModuleNames.Contains(field.LookupType))
                                        lookupModuleNames.Add(field.LookupType);
                                }

                                using (var moduleRepository = new ModuleRepository(databaseContext))
                                {
                                    if (lookupModuleNames.Count > 0)
                                        lookupModules = await moduleRepository.GetByNamesBasic(lookupModuleNames);
                                    else
                                        lookupModules = new List<Module>();

                                    lookupModules.Add(Model.Helpers.ModuleHelper.GetFakeUserModule());
                                    if (process.ApproverType == ProcessApproverType.DynamicApprover)
                                        await CalculationHelper.Calculate(request.RecordId, process.Module, appUser, warehouse, OperationType.insert);

                                    record = recordRepository.GetById(process.Module, request.RecordId, false, lookupModules);
                                    var approverMail = (string)record["custom_approver"];
                                    user = await userRepository.GetByEmail(approverMail);
                                }
                            }

                            var emailData = new Dictionary<string, string>();
                            string domain;

                            domain = "https://{0}.ofisim.com/";
                            var appDomain = "crm";

                            switch (appUser.AppId)
                            {
                                case 2:
                                    appDomain = "kobi";
                                    break;
                                case 3:
                                    appDomain = "asistan";
                                    break;
                                case 4:
                                    appDomain = "ik";
                                    break;
                                case 5:
                                    appDomain = "cagri";
                                    break;
                            }

                            var subdomain = ConfigurationManager.AppSettings.Get("TestMode") == "true" ? "test" : appDomain;
                            domain = string.Format(domain, subdomain);

                            //domain = "http://localhost:5554/";
                            string url = "";
                            if (process.Module.Name == "timetrackers")
                            {
                                var findTimetracker = new FindRequest { Filters = new List<Filter> { new Filter { Field = "id", Operator = Operator.Equals, Value = (int)request.RecordId, No = 1 } }, Limit = 9999 };
                                var timetrackerRecord = recordRepository.Find("timetrackers", findTimetracker);
                                url = domain + "#/app/crm/timetracker?user=" + (int)timetrackerRecord.First()["created_by"] + "&year=" + (int)timetrackerRecord.First()["year"] + "&month=" + (int)timetrackerRecord.First()["month"] + "&week=" + (int)timetrackerRecord.First()["week"];
                            }
                            else
                            {
                                url = domain + "#/app/crm/module/" + process.Module.Name + "?id=" + request.RecordId;
                            }

                            if (appUser.TenantLanguage == "tr")
                                emailData.Add("ModuleName", process.Module.LabelTrSingular);
                            else
                                emailData.Add("ModuleName", process.Module.LabelEnSingular);

                            emailData.Add("Url", url);
                            emailData.Add("ApproverName", user.FullName);
                            if (process.ApproverType == ProcessApproverType.StaticApprover)
                            {
                                emailData.Add("UserName", appUser.UserName);
                            }
                            else
                            {
                                emailData.Add("UserName", (string)record["owner.full_name"]);
                            }

                            if (!string.IsNullOrWhiteSpace(user.Culture) && Constants.CULTURES.Contains(user.Culture))
                                Thread.CurrentThread.CurrentCulture = CultureInfo.CreateSpecificCulture(user.Culture);

                            if (request.OperationType == OperationType.insert)
                            {
                                var notification = new Email(typeof(Resources.Email.ApprovalProcessCreateNotification), Thread.CurrentThread.CurrentCulture.Name, emailData, appUser.AppId, appUser);
                                notification.AddRecipient(user.Email);
                                notification.AddToQueue(appUser.TenantId, process.Module.Id, request.RecordId, appUser: appUser);
                            }
                            else if (request.OperationType == OperationType.update)
                            {
                                var notification = new Email(typeof(Resources.Email.ApprovalProcessUpdateNotification), Thread.CurrentThread.CurrentCulture.Name, emailData, appUser.AppId, appUser);
                                notification.AddRecipient(user.Email);
                                notification.AddToQueue(appUser.TenantId, process.Module.Id, request.RecordId, appUser: appUser);
                            }
                            else if (request.OperationType == OperationType.delete)
                            {

                            }
                        }
                    }
                }
            }
        }

        public static async Task SendToApprovalApprovedRequest(OperationType operationType, JObject record, UserItem appUser, Warehouse warehouse)
        {
            using (var databaseContext = new TenantDBContext(appUser.TenantId))
            {
                using (var recordRepository = new RecordRepository(databaseContext, warehouse))
                {
                    warehouse.DatabaseName = appUser.WarehouseDatabaseName;

                    using (var processRequestRepository = new ProcessRequestRepository(databaseContext))
                    {
                        var requestEntity = await processRequestRepository.GetByRecordId((int)record["id"], operationType);
                        using (var processRepository = new ProcessRepository(databaseContext))
                        {
                            var process = await processRepository.GetById(requestEntity.ProcessId);

                            requestEntity.ProcessStatusOrder = 1;
                            requestEntity.Status = Model.Enums.ProcessStatus.Waiting;

                            using (var userRepository = new UserRepository(databaseContext))
                            {
                                var nextApproverOrder = requestEntity.ProcessStatusOrder;
                                var nextApprover = process.Approvers.FirstOrDefault(x => x.Order == nextApproverOrder);
                                var user = await userRepository.GetById(nextApprover.UserId);

                                var emailData = new Dictionary<string, string>();
                                string domain;

                                domain = "https://{0}.ofisim.com/";
                                var appDomain = "crm";

                                switch (appUser.AppId)
                                {
                                    case 2:
                                        appDomain = "kobi";
                                        break;
                                    case 3:
                                        appDomain = "asistan";
                                        break;
                                    case 4:
                                        appDomain = "ik";
                                        break;
                                    case 5:
                                        appDomain = "cagri";
                                        break;
                                }

                                var subdomain = ConfigurationManager.AppSettings.Get("TestMode") == "true" ? "test" : appDomain;
                                domain = string.Format(domain, subdomain);

                                //domain = "http://localhost:5554/";
                                string url = "";
                                if (process.Module.Name == "timetrackers")
                                {
                                    var findTimetracker = new FindRequest { Filters = new List<Filter> { new Filter { Field = "id", Operator = Operator.Equals, Value = (int)requestEntity.RecordId, No = 1 } }, Limit = 9999 };
                                    var timetrackerRecord = recordRepository.Find("timetrackers", findTimetracker);
                                    url = domain + "#/app/crm/timetracker?user=" + (int)timetrackerRecord.First()["created_by"] + "&year=" + (int)timetrackerRecord.First()["year"] + "&month=" + (int)timetrackerRecord.First()["month"] + "&week=" + (int)timetrackerRecord.First()["week"];
                                }
                                else
                                {
                                    url = domain + "#/app/crm/module/" + process.Module.Name + "?id=" + requestEntity.RecordId;
                                }

                                if (appUser.TenantLanguage == "tr")
                                    emailData.Add("ModuleName", process.Module.LabelTrSingular);
                                else
                                    emailData.Add("ModuleName", process.Module.LabelEnSingular);

                                emailData.Add("Url", url);
                                emailData.Add("ApproverName", user.FullName);
                                emailData.Add("UserName", appUser.UserName);

                                if (!string.IsNullOrWhiteSpace(user.Culture) && Constants.CULTURES.Contains(user.Culture))
                                    Thread.CurrentThread.CurrentCulture = CultureInfo.CreateSpecificCulture(user.Culture);

                                var notification = new Email(typeof(Resources.Email.ApprovalProcessUpdateNotification), Thread.CurrentThread.CurrentCulture.Name, emailData, appUser.AppId, appUser);
                                notification.AddRecipient(user.Email);
                                notification.AddToQueue(appUser.TenantId, process.Module.Id, (int)record["id"], appUser: appUser);
                            }

                            await processRequestRepository.Update(requestEntity);
                        }

                    }
                }
            }
        }

        public static async Task AfterCreateProcess(ProcessRequest request, UserItem appUser, Warehouse warehouse)
        {
            using (var databaseContext = new TenantDBContext(appUser.TenantId))
            {
                using (var recordRepository = new RecordRepository(databaseContext, warehouse))
                {
                    warehouse.DatabaseName = appUser.WarehouseDatabaseName;


                    using (var processRepository = new ProcessRepository(databaseContext))
                    {
                        var process = await processRepository.GetById(request.ProcessId);

                        var record = recordRepository.GetById(process.Module, request.RecordId, false);
                        await WorkflowHelper.Run(request.OperationType, record, process.Module, appUser, warehouse);

                        if (process.Module.Name == "izinler" && request.Status == Model.Enums.ProcessStatus.Approved)
                            await CalculationHelper.Calculate(request.RecordId, process.Module, appUser, warehouse, OperationType.update);
                    }
                }
            }
        }
    }
}