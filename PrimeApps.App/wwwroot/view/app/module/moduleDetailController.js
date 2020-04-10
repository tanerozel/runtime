"use strict";angular.module("primeapps").controller("ModuleDetailController",["$rootScope","$scope","ngToast","$filter","helper","sipHelper","$location","$state","$stateParams","$q","$window","$localStorage","$cache","entityTypes","operations","config","guidEmpty","$popover","$timeout","$modal","$sce","yesNo","activityTypes","transactionTypes","$anchorScroll","blockUI","FileUploader","DocumentService","ModuleService","$http","components",function(e,r,t,o,a,n,i,l,s,d,u,c,p,m,f,h,_,g,v,y,M,w,k,P,F,b,S,T,A,D,R){if(r.type=s.type,r.id=i.search().id,r.parentType=i.search().ptype,r.parentId=i.search().pid,r.returnParentType=i.search().rptype,r.returnTab=i.search().rtab,r.previousParentType=i.search().pptype,r.previousParentId=i.search().ppid,r.previousReturnTab=i.search().prtab,r.returnPreviousParentType=i.search().rpptype,r.returnPreviousParentId=i.search().rppid,r.returnPreviousReturnTab=i.search().rprtab,r.back=i.search().back,r.module=o("filter")(e.modules,{name:r.type},!0)[0],r.operations=f,r.hasPermission=a.hasPermission,r.hasDocumentsPermission=a.hasDocumentsPermission,r.hasFieldDisplayPermission=A.hasFieldDisplayPermission,r.hasFieldFullPermission=A.hasFieldFullPermission,r.hasSectionDisplayPermission=A.hasSectionDisplayPermission,r.hasSectionFullPermission=A.hasSectionFullPermission,r.hasActionButtonDisplayPermission=A.hasActionButtonDisplayPermission,r.loading=!0,r.pdfUrl="",r.isDetail=!0,r.refreshSubModules={},r.editLookup={},r.tab="general",r.activityTypes=k,r.transactionTypes=P,r.lookupUser=a.lookupUser,r.isActive={},r.waitingForApproval=!1,r.isProcessRecord=!1,r.isApproved=!1,r.isRejectedRequest=!1,r.appId=e.user.app_id,r.hasManuelProcess=!1,r.manuelApproveRequest=!1,r.freeze=i.search().freeze,r.currentModuleProcess=null,r.customHide=!1,r.googleMapsApiKey=googleMapsApiKey,r.currentSectionComponentsTemplate=currentSectionComponentsTemplate,r.scriptRunning={},r.pageBlockUI=b.instances.get("pageBlockUI"),r.actionButtonDisabled=!1,!r.module)return t.create({content:o("translate")("Common.NotFound"),className:"warning"}),void l.go("app.dashboard");if(!r.id)return t.create({content:o("translate")("Common.NotFound"),className:"warning"}),void l.go("app.dashboard");R.run("BeforeDetailLoaded","script",r),r.setDropdownData=function(e){if(e.filters&&e.filters.length>0)r.dropdownFieldDatas[e.name]=null;else if(r.dropdownFieldDatas[e.name]&&r.dropdownFieldDatas[e.name].length>0)return;r.currentLookupField=e,r.lookup().then(function(t){r.dropdownFieldDatas[e.name]=t})},r.trustAsHtml=function(e){return M.trustAsHtml(e)},r.dropdownFields=o("filter")(r.module.fields,{data_type:"lookup",show_as_dropdown:!0},!0),r.dropdownFieldDatas={};for(var U=0;U<r.dropdownFields.length;U++)r.dropdownFieldDatas[r.dropdownFields[U].name]=[];r.tabconfig=r.module.detail_view_type?"flat"!=r.module.detail_view_type?!0:!1:"flat"!=e.detailViewType?!0:!1,r.returnPreviousParentType&&r.returnPreviousParentId!=r.id&&(r.parentType=angular.copy(r.returnPreviousParentType),r.parentId=angular.copy(r.returnPreviousParentId),r.returnTab=angular.copy(r.returnPreviousReturnTab));var z=function(){r.tabconfig?r.scrollHeightTab={height:u.innerHeight-255+"px"}:r.scrollHeight={height:u.innerHeight-165+"px"}};z(),angular.element(u).on("resize",function(){v(function(){z()})}),r.primaryField=o("filter")(r.module.fields,{primary:!0})[0],r.currentUser=A.processUser(e.user),r.currentDayMin=a.getCurrentDateMin().toISOString(),r.currentDayMax=a.getCurrentDateMax().toISOString(),r.currentHour=a.floorMinutes(new Date),r.entityTypes=m,r.guidEmpty=_,r.relatedToField=o("filter")(r.module.fields,{name:"related_to"},!0)[0],r.record={},r.allFields=[],r.showEditor=!1,r.isAdmin=e.user.profile.has_admin_rights,angular.forEach(r.module.fields,function(e){A.hasFieldDisplayPermission(e)&&r.allFields.push(angular.copy(e))});for(var E=0;E<e.approvalProcesses.length;E++){var L=e.approvalProcesses[E];L.module_id===r.module.id&&(r.currentModuleProcess=L)}if(r.currentModuleProcess){var I=r.currentModuleProcess.profiles.split(",");r.hasProcessEditPermission=!1;for(var U=0;U<I.length;U++)I[U]===e.user.profile.id.toString()&&(r.hasProcessEditPermission=!0)}if(r.module.relations&&angular.forEach(r.module.relations,function(t){if(!t.deleted){var a=o("filter")(e.modules,{name:t.related_module},!0)[0],n={};if("activities"!==t.related_module&&"mails"!==t.related_module||"many_to_many"===t.relation_type)if("many_to_many"===t.relation_type){if(!a)return;var i=o("filter")(a.fields,{primary:!0},!0)[0],s=t.related_module+"_id."+t.related_module+"."+i.name;n={fields:["total_count()",s],filters:[{field:r.module.name+"_id",operator:"equals",value:r.id,no:1}],limit:1,offset:0,many_to_many:r.module.name}}else n={fields:["total_count()"],filters:[{field:t.relation_field,operator:"equals",value:r.id,no:1}],limit:1,offset:0};else n={fields:["total_count()"],filters:[{field:t.relation_field,operator:"equals",value:r.id,no:1},{field:"related_module",operator:"is",value:r.module["label_"+e.user.tenant_language+"_singular"],no:1}],limit:1,offset:0};A.findRecords(t.related_module,n).then(function(e){var o=e.data;o[0]&&o[0].total_count?t.total=o[0].total_count:delete t.total,"flat"===t.detail_view_type&&(r.changeTab(t),r.returnParentType==t.id&&(r.activeType="tab",r.tab="general"))}).then(function(){r.isActive[l.params.rptype]=!0})}}),r.parentType){if("activities"===r.type||"mails"===r.type||r.many)r.parentModule=r.parentType;else{var C=o("filter")(r.module.fields,{name:r.parentType},!0)[0];C?r.parentModule=C.lookup_type:(r.parentModule=r.parentType,r.returnType="general")}r.previousParentType||(r.previousParentType=angular.copy(r.parentType),r.previousParentId=angular.copy(r.parentId),!r.previousReturnTab&&r.returnTab&&(r.previousReturnTab=angular.copy(r.returnTab)))}r.module.default_tab&&(r.tab=r.module.default_tab),r.returnParentType&&(r.tab=r.returnParentType,r.tabconfig||(r.isActive[r.returnParentType]=!0,i.hash("relation"+r.returnParentType),F()));var q=function(){if("izinler"===r.module.name&&(r.hasManuelProcess&&(r.record.owner.id===r.currentUser.id||r.hasProcessRights)&&!r.record.process_id||3===r.record.process_status&&r.record.owner.id===r.currentUser.id&&!r.waitingForApproval)&&r.record.izin_turu){var e=moment().date(1).month(1).year(moment().year()).format("YYYY-MM-DD");if(r.record.goreve_baslama_tarihi=r.record.calisan.ise_baslama_tarihi,r.record.izin_turu_data=r.record.izin_turu,r.record.dogum_tarihi=r.record.calisan.dogum_tarihi,r.record.calisan_data=r.record.calisan,r.record.izin_turu_data.yillik_izin){var t=moment(r.record.calisan_data.ise_baslama_tarihi),o=t.get("date"),a=t.get("month"),n=moment().get("year"),i=moment().date(o).month(a).year(n).format("YYYY-MM-DD");moment(i).isAfter(moment().format("YYYY-MM-DD"))&&(n-=1),e=moment().date(o).month(a).year(n).format("YYYY-MM-DD")}r.record.izin_turu_data.her_ay_yenilenir&&(e=moment().date(1).month(moment().month()).year(moment().year()).format("YYYY-MM-DD"));var l={fields:["hesaplanan_alinacak_toplam_izin","baslangic_tarihi","bitis_tarihi","izin_turu","process.process_requests.process_status","system_code"],filters:[{field:"calisan",operator:"equals",value:r.record.calisan.id,no:1},{field:"baslangic_tarihi",operator:"greater_equal",value:e,no:2},{field:"deleted",operator:"equals",value:!1,no:3},{field:"process.process_requests.process_status",operator:"not_equal",value:3,no:4}],limit:999999};A.findRecords("izinler",l).then(function(e){e.data.length>0&&(r.record.alinan_izinler=e.data)})}};r.picklistFilter=function(){return function(e){return r.componentFilter={},r.componentFilter.item=e,r.componentFilter.result=!0,R.run("PicklistFilter","Script",r),!e.hidden&&!e.inactive&&r.componentFilter.result}};var N=function(){A.getPicklists(r.module).then(function(a){r.picklistsModule=a,A.getRecord(r.module.name,r.id).then(function(a){0===Object.keys(a.data).length&&(t.create({content:o("translate")("Common.Forbidden"),className:"warning"}),l.go("app.dashboard")),"activities"!=r.module.name&&angular.forEach(r.module.fields,function(e){A.setDependency(e,r.module,r.record,r.picklistsModule),e.default_value&&"picklist"==e.data_type&&(r.record[e.name]=o("filter")(r.picklistsModule[e.picklist_id],{id:e.default_value})[0],r.fieldValueChange(e))});for(var n=A.processRecordSingle(a.data,r.module,r.picklistsModule),i=0;i<e.approvalProcesses.length;i++){var s=e.approvalProcesses[i];s.module_id===r.module.id&&"manuel"===s.trigger_time&&(r.hasManuelProcess=!0),s.module_id===r.module.id&&(r.currentModuleProcess=s)}for(var d=0;d<r.module.fields.length;d++){var u=r.module.fields[d],c=!1;if(u.encrypted&&u.encryption_authorized_users_list.length>0&&n[u.name])for(var p=0;p<u.encryption_authorized_users_list.length;p++){var m=u.encryption_authorized_users_list[p];e.user.id==parseInt(m)&&(c=!0)}u.show_lock=u.encrypted&&!c?!0:!1}if(n.process_status&&(2===n.process_status&&(r.isApproved=!0),(1===n.process_status||2===n.process_status||3===n.process_status&&n.created_by.id!=r.currentUser.id)&&(n.freeze=!0),A.getProcess(n.process_id).then(function(t){var a=t.data.approvers;if(a.length>0){var i=o("filter")(a,{id:r.currentUser.id},!0)[0];i||3===n.process_status||(r.waitingForApproval=!0),i&&(i.order===n.process_status_order?r.isApprovalRecord=!0:3!==n.process_status&&(r.waitingForApproval=!0))}else if(1===n.process_status_order){var l=n.custom_approver;l===e.user.email?r.isApprovalRecord=!0:l!==e.user.email&&3!==n.process_status&&(r.waitingForApproval=!0)}else if(2===n.process_status_order){var s=n.custom_approver_2;s===e.user.email?r.isApprovalRecord=!0:s!==e.user.email&&3!==n.process_status&&(r.waitingForApproval=!0)}else if(3===n.process_status_order){var d=n.custom_approver_3;d===e.user.email?r.isApprovalRecord=!0:d!==e.user.email&&3!==n.process_status&&(r.waitingForApproval=!0)}else if(4===n.process_status_order){var u=n.custom_approver_4;u===e.user.email?r.isApprovalRecord=!0:u!==e.user.email&&3!==n.process_status&&(r.waitingForApproval=!0)}else if(5===n.process_status_order){var c=n.custom_approver_5;c===e.user.email?r.isApprovalRecord=!0:c!==e.user.email&&3!==n.process_status&&(r.waitingForApproval=!0)}if(0===n.operation_type&&2===n.process_status)for(var p=0;p<t.data.operations_array.length;p++){var m=t.data.operations_array[p];"update"===m&&(n.freeze=!1)}1===n.operation_type&&2===n.process_status&&(n.freeze=!1),"izinler"===r.module.name&&q()})),r.module.dependencies.length>0){var f=o("filter")(r.module.dependencies,{dependency_type:"freeze",deleted:!1},!0);angular.forEach(f,function(e){var t=o("filter")(r.module.fields,{name:e.parent_field},!0);angular.forEach(t,function(r){angular.forEach(e.values_array,function(e){!n[r.name]||e!=n[r.name]&&e!=n[r.name].id||(n.freeze=!0)})})})}if(r.freeze&&(n.freeze=!0),null!==r.currentModuleProcess){if(r.currentModuleProcess.profile_list&&r.currentModuleProcess.profile_list.length>0)for(var h=0;h<r.currentModuleProcess.profile_list.length;h++){var _=r.currentModuleProcess.profile_list[h];parseInt(_)===e.user.profile.id&&(n.freeze=!1)}e.user.profile.has_admin_rights&&(n.freeze=!1)}A.formatRecordFieldValues(angular.copy(a.data),r.module,r.picklistsModule),r.title=r.primaryField.valueFormatted;var g=function(t){r.record=t,r.recordState=angular.copy(r.record),A.setDisplayDependency(r.module,r.record),r.record.currency&&(r.currencySymbol=r.record.currency.value||e.currencySymbol),R.run("AfterRecordLoaded","Script",r,r.record),r.currentModuleProcess&&r.currentModuleProcess.profile_list&&(r.hasProcessRights=r.currentModuleProcess.profile_list.indexOf(e.user.profile.ID.toString())>-1?!0:!1),"izinler"===r.module.name&&q()};if(A.getActionButtons(r.module.id).then(function(e){r.actionButtons=o("filter")(e,function(e){return"List"!==e.trigger&&"Form"!==e.trigger&&"Relation"!==e.trigger},!0),angular.forEach(r.actionButtons,function(e){e.isShown=!1,e.dependent_field?n[e.dependent_field]&&n[e.dependent_field].labelStr==e.dependent&&(e.isShown=!0):e.isShown=!0})}),r.relatedToField&&n.related_to&&n[r.relatedToField.lookup_relation]){var v=o("filter")(e.modules,{id:n[r.relatedToField.lookup_relation].id-9e5},!0)[0],y=o("filter")(v.fields,{primary:!0},!0)[0];A.getRecord(v.name,n.related_to,!0).then(function(e){e=e.data,e.primary_value=e[y.name],n.related_to=e,g(n),r.loading=!1,r.refreshing=!1,r.pageBlockUI.stop()})["catch"](function(e){404===e.status&&(n.related_to=null,g(n)),r.loading=!1,r.refreshing=!1,r.pageBlockUI.stop()})}else g(n),r.loading=!1,r.refreshing=!1,r.pageBlockUI.stop()})["catch"](function(){r.loading=!1,r.refreshing=!1,r.pageBlockUI.stop()}),r.yesNo=A.getYesNo(w)})};N(),r.refreshSubModules[r.type]={},r.refresh=function(){r.refreshing=!0,r.pageBlockUI.start(),N(),angular.forEach(r.module.relations,function(e){r.refreshSubModules[r.type][e.related_module]=r.getCurrentTime()})},r.changeTab=function(e){"flat"!=e.detail_view_type?(r.tab=angular.copy(e.id.toString()),r.activeType="flat"):r.activeType="tab",r.isActive=[],r.isActive[e.id]=!0},r.lookup=function(t){if("users"===r.currentLookupField.lookup_type&&!r.currentLookupField.lookupModulePrimaryField){var a={};a.data_type="text_single",a.name="full_name",r.currentLookupField.lookupModulePrimaryField=a}if("profiles"===r.currentLookupField.lookup_type&&!r.currentLookupField.lookupModulePrimaryField){var a={};a.data_type="text_single",a.name="name",r.currentLookupField.lookupModulePrimaryField=a}if("roles"===r.currentLookupField.lookup_type&&!r.currentLookupField.lookupModulePrimaryField){var a={};a.data_type="text_single",a.name="label_"+e.user.tenantLanguage,r.currentLookupField.lookupModulePrimaryField=a}if("relation"===r.currentLookupField.lookup_type){if(!r.record.related_module)return r.$broadcast("angucomplete-alt:clearInput",r.currentLookupField.name),d.defer().promise;var n=o("filter")(e.modules,{name:r.record.related_module.value},!0)[0];if(!n)return r.$broadcast("angucomplete-alt:clearInput",r.currentLookupField.name),d.defer().promise;r.currentLookupField.lookupModulePrimaryField=o("filter")(n.fields,{primary:!0},!0)[0]}return"number"!==r.currentLookupField.lookupModulePrimaryField.data_type&&"number_auto"!==r.currentLookupField.lookupModulePrimaryField.data_type||!isNaN(parseFloat(t))?A.lookup(t,r.currentLookupField,r.record):(r.$broadcast("angucomplete-alt:clearInput",r.currentLookupField.name),d.defer().promise)},r.multiselect=function(e,t){var o=[];return angular.forEach(r.picklistsModule[t.picklist_id],function(r){r.inactive||r.hidden||(r.labelStr.toLowerCase().indexOf(e.toLowerCase())>-1||r.labelStr.toUpperCase().indexOf(e.toUpperCase())>-1||r.labelStr.toLowerCaseTurkish().indexOf(e.toLowerCaseTurkish())>-1||r.labelStr.toUpperCaseTurkish().indexOf(e.toUpperCaseTurkish())>-1)&&o.push(r)}),o},r.setCurrentLookupField=function(e){r.currentLookupField=e},r.validate=function(e,r,t){if(t){if(t.required&&!e)return o("translate")("Module.Required");if("lookup"===r&&e&&"object"!=typeof e)return o("translate")("Module.RequiredAutoCompleteError");if("email"===r&&e){var a=/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;if(!a.test(e))return o("translate")("Module.EmailInvalid")}if("url"===r&&e){var n=/(http|https|file|ftp):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;if(!n.test(e))return o("translate")("Module.UrlInvalid")}if("checkbox"===r&&void 0===e&&(e=!1),t.min&&e){var i=parseFloat(e),l=parseFloat(t.min);if(l>i)return o("translate")("Module.MinError")}if(t.min&&e){var s=parseFloat(e),d=parseFloat(t.max);if(d>s)return o("translate")("Module.MaxError")}return t.min_length&&e&&e.length<t.min_length?o("translate")("Module.MinLengthError"):!0}},r.update=function(){r.updating=!0;var a=A.prepareRecord(r.record,r.module,r.recordState);a.activity_type_system&&delete a.activity_type_system,A.updateRecord(r.module.name,a).then(function(t){var a=function(){r.recordState=angular.copy(r.record),B(),angular.forEach(r.actionButtons,function(e){e.isShown=!1,e.dependent_field?t[e.dependent_field]&&t[e.dependent_field]==e.dependent&&(e.isShown=!0):e.isShown=!0})},n=o("filter")(e.approvalProcesses,{module_id:r.module.id},!0);if(n){for(var i=!1,l=0;l<n.length;l++)(0===n[l].user_id||n[l].user_id===r.currentUser.id)&&n[l].operations.indexOf("update")>-1&&(i=!0);i&&3!==r.record.process_status?(r.record.freeze=!0,setTimeout(function(){A.getRecord(r.module.name,r.record.id).then(function(a){var n=A.processRecordSingle(a.data,r.module,r.picklistsModule);if(n.process_status&&(2===n.process_status?r.isApproved=!0:1===n.process_status&&(r.isApproved=!1),(1===n.process_status||2===n.process_status||3===n.process_status&&n.created_by.id!=r.currentUser.id)&&(n.freeze=!0),A.getProcess(n.process_id).then(function(t){var a=t.data.approvers;if(a.length>0){var i=o("filter")(a,{id:r.currentUser.id},!0)[0];i||3===n.process_status||(r.waitingForApproval=!0),i&&(i.order===n.process_status_order?r.isApprovalRecord=!0:3!==n.process_status&&(r.waitingForApproval=!0))}else if(1===n.process_status_order){var l=n.custom_approver;l===e.user.email?r.isApprovalRecord=!0:l!==e.user.email&&3!==n.process_status&&(r.waitingForApproval=!0)}else if(2===n.process_status_order){var s=n.custom_approver_2;s===e.user.email?r.isApprovalRecord=!0:s!==e.user.email&&3!==n.process_status&&(r.waitingForApproval=!0)}else if(3===n.process_status_order){var d=n.custom_approver_3;d===e.user.email?r.isApprovalRecord=!0:d!==e.user.email&&3!==n.process_status&&(r.waitingForApproval=!0)}else if(4===n.process_status_order){var u=n.custom_approver_4;u===e.user.email?r.isApprovalRecord=!0:u!==e.user.email&&3!==n.process_status&&(r.waitingForApproval=!0)}else if(5===n.process_status_order){var c=n.custom_approver_5;c===e.user.email?r.isApprovalRecord=!0:c!==e.user.email&&3!==n.process_status&&(r.waitingForApproval=!0)}if(0===n.operation_type&&2===n.process_status)for(var p=0;p<t.data.operations_array.length;p++){var m=t.data.operations_array[p];"update"===m&&(n.freeze=!1)}1===n.operation_type&&2===n.process_status&&(n.freeze=!1)})),r.module.dependencies.length>0){var i=o("filter")(r.module.dependencies,{dependency_type:"freeze"},!0);angular.forEach(i,function(e){var t=o("filter")(r.module.fields,{name:e.parent_field},!0);angular.forEach(t,function(r){angular.forEach(e.values_array,function(e){!n[r.name]||e!=n[r.name]&&e!=n[r.name].id||(n.freeze=!0)})})})}if(null!==r.currentModuleProcess&&r.currentModuleProcess.profile_list&&r.currentModuleProcess.profile_list.length>0)for(var l=0;l<r.currentModuleProcess.profile_list.length;l++){var s=r.currentModuleProcess.profile_list[l];parseInt(s)===e.user.profile.id&&(n.freeze=!1)}A.formatRecordFieldValues(angular.copy(a.data),r.module,r.picklistsModule),r.title=r.primaryField.valueFormatted;var d=function(t){r.record=t,r.recordState=angular.copy(r.record),A.setDisplayDependency(r.module,r.record),r.record.currency&&(r.currencySymbol=r.record.currency.value||e.currencySymbol),getProducts(r.type)};if(angular.forEach(r.actionButtons,function(e){e.isShown=!1,e.dependent_field?t[e.dependent_field]&&t[e.dependent_field]==e.dependent&&(e.isShown=!0):e.isShown=!0}),r.relatedToField&&n.related_to){var u=o("filter")(e.modules,{id:n[r.relatedToField.lookup_relation].id-9e5},!0)[0],c=o("filter")(u.fields,{primary:!0},!0)[0];A.getRecord(u.name,n.related_to,!0).then(function(e){e=e.data,e.primary_value=e[c.name],n.related_to=e,d(n),r.updating=!1})["catch"](function(e){404===e.status&&(n.related_to=null,d(n)),r.updating=!1})}else d(n),r.updating=!1})["catch"](function(){r.updating=!1})},2e3)):a()}else a()})["catch"](function(e,a){409===a&&(t.create({content:o("translate")("Module.UniqueError"),className:"danger"}),r.record[e.field]=r.recordState[e.field])})},r["delete"]=function(){r.executeCode=!1,R.run("BeforeDelete","Script",r,r.record),r.executeCode||A.deleteRecord(r.module.name,r.record.id).then(function(){return R.run("AfterDelete","Script",r,r.record),B(),r.parentId?void l.go("app.moduleDetail",{type:r.parentModule,id:r.parentId}):void l.go("app.moduleList",{type:r.type})})};var B=function(){var t=r.module.name+"_"+r.module.name;if(r.parentId){t=(r.relatedToField?"related_to":r.parentType)+r.parentId+"_"+r.module.name;var o=r.parentType+"_"+r.parentType;p.remove(t),p.remove(o)}else p.remove(t);e.activePages&&e.activePages[r.module.name]&&(e.activePages[r.module.name]=null),(r.module.display_calendar||"activities"===r.module.name)&&p.remove("calendar_events")};if(r.calculate=function(e){A.calculate(e,r.module,r.record)},r.fieldValueChange=function(t){A.setDependency(t,r.module,r.record,r.picklistsModule),r.record.currency&&(r.currencySymbol=r.record.currency.value||e.currencySymbol)},r.reformatFieldValues=function(){A.formatRecordFieldValues(r.record,r.module,r.picklistsModule)},r.hideCreateNew=function(e){return"users"===e.lookup_type?!0:"relation"!==e.lookup_type||r.record.related_module?!1:!0},r.openFormModal=function(e){r.primaryValueModal=e,r.formModalShown=!0,r.formModal=r.formModal||y({scope:r,templateUrl:"view/app/module/moduleFormModal.html",animation:"",backdrop:"static",show:!1,tag:"formModal"}),r.formModal.$promise.then(r.formModal.show)},r.$on("modal.hide",function(e,t){"formModal"==t.$options.tag&&(r.formModalShown=!1,"object"!=typeof r.record[r.currentLookupField.name]?r.lookupFocusOut():(delete r.editLookup[r.currentLookupField.name],r.update())),"relatedModuleInModal"==t.$options.tag&&(r.selectedRelatedModule.relatedModuleInModal=!1)}),r.lookupFocusOut=function(){v(function(){r.formModalShown||r.updating||(r.record[r.currentLookupField.name]=r.recordState[r.currentLookupField.name],r.$broadcast("angucomplete-alt:changeInput",r.currentLookupField.name,r.recordState[r.currentLookupField.name]),delete r.editLookup[r.currentLookupField.name])},200)},r.getAttachments=function(){a.hasDocumentsPermission(r.operations.read)&&T.getEntityDocuments(e.workgroup.tenant_id,r.id,r.module.id).then(function(t){r.documentsResultSet=T.processDocuments(t.data,e.users),r.documents=r.documentsResultSet.documentList,r.loadingDocuments=!1})},r.getAttachments(),r.showActivityButtons=function(){r.activityButtonsPopover=r.activityButtonsPopover||g(angular.element(document.getElementById("activityButtons")),{templateUrl:"view/common/newactivity.html",placement:"bottom",autoClose:!0,scope:r,show:!0})},r.getCurrentTime=function(){var e=new Date;return e.getTime()},r.openExportDialog=function(){r.pdfCreating=!0;var a=function(){r.PdfModal=r.PdfModal||y({scope:r,templateUrl:"view/app/module/modulePdfModal.html",animation:"",backdrop:"static",show:!1}),r.PdfModal.$promise.then(r.PdfModal.show)};r.quoteTemplates&&(a(),r.quoteTemplate=r.quoteTemplates[0]),A.getTemplates(r.module.name,"module").then(function(n){if(0==n.data.length)t.create(e.preview?{content:o("translate")("Setup.Templates.TemplateDefined"),className:"warning"}:{content:o("translate")("Setup.Templates.TemplateNotFound"),className:"warning"}),r.pdfCreating=!1;else{var i=n.data;r.quoteTemplates=o("filter")(i,{active:!0},!0),r.isShownWarning=!0;for(var l=0;l<r.quoteTemplates.length;l++){var s=r.quoteTemplates[l];if(s.permissions.length>0){var d=o("filter")(s.permissions,{profile_id:e.user.profile.id},!0)[0];s.isShown="none"===d.type?!1:!0,1==s.isShown&&(r.isShownWarning=!1)}else s.isShown=!0,r.isShownWarning=!1}r.quoteTemplate=r.quoteTemplates[0],r.PdfModal=r.PdfModal||y({scope:r,templateUrl:"view/app/module/modulePdfModal.html",animation:"",backdrop:"static",show:!1}),a()}})["catch"](function(){r.pdfCreating=!1})},r.getDownloadUrl=function(a){u.open("/attach/export?module="+r.type+"&id="+r.id+"&templateId="+r.quoteTemplate.id+"&access_token="+c.read("access_token")+"&format="+a+"&locale="+e.locale+"&timezoneOffset="+-1*(new Date).getTimezoneOffset(),"_blank"),t.create({content:o("translate")("Module.ExcelDesktop"),className:"success"})},r.openAddModal=function(e){r.selectedRelatedModule=e,r.selectedRelatedModule.relatedModuleInModal=!0,r.addModal=r.addModal||y({scope:r,templateUrl:"view/app/module/moduleAddModal.html",animation:"",backdrop:"static",show:!1,tag:"relatedModuleInModal"}),r.addModal.$promise.then(r.addModal.show)},r.showEMailModal=function(t,o){if(!e.system.messaging.SystemEMail&&!e.system.messaging.PersonalEMail){var a="mailto:"+o,n=u.open(a,"_blank");return void(n.document.title="Ofisim.com")}r.mailModal=r.mailModal||y({scope:r,templateUrl:"view/app/email/singleEmailModal.html",backdrop:"static",show:!1}),t||r.mailModal.$promise.then(r.mailModal.show)},r.showQuoteEMailModal=function(a){return e.system.messaging.SystemEMail||e.system.messaging.PersonalEMail?(r.mailModal=r.mailModal||y({scope:r,templateUrl:"view/app/email/singleEmailModal.html",backdrop:"static",show:!1}),void(a||r.mailModal.$promise.then(r.mailModal.show))):void t.create({content:o("translate")("EMail.NoProvider"),className:"warning"})},r.showSingleSMSModal=function(){return e.system.messaging.SMS?(r.smsModal=r.smsModal||y({scope:r,templateUrl:"view/app/sms/singleSMSModal.html",backdrop:"static",show:!1}),void r.smsModal.$promise.then(r.smsModal.show)):void t.create({content:o("translate")("SMS.NoProvider"),className:"warning"})},r.showModuleFrameModal=function(e){if(new RegExp("https:").test(e)){var t,o,a;t="myPop1",o=document.body.offsetWidth-200,a=document.body.offsetHeight-200;var n=screen.width/2-o/2,i=screen.height/2-a/2;window.open(e,t,"toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width="+o+", height="+a+", top="+i+", left="+n)}else r.frameUrl=e,r.frameModal=r.frameModal||y({scope:r,controller:"ActionButtonFrameController",templateUrl:"view/app/actionbutton/actionButtonFrameModal.html",backdrop:"static",show:!1}),r.frameModal.$promise.then(r.frameModal.show)},r.dropdownHide=function(){angular.element(document.getElementsByClassName("dropdown-menu"))[0].click(),angular.element(document.getElementsByClassName("dropdown-menu"))[1].click()},r.documentDownload=function(e){u.location="/storage/record_file_download?fileName="+e},r.getmoduledownloadurl=function(e,t){return e?h.apiUrl+"Document/download_module_document?module="+r.module.name+"&fileNameExt="+a.getFileExtension(e)+"&fileName="+e+"&fieldName="+t+"&recordId="+r.record.id+"&access_token="+c.read("access_token"):void 0},r.showHideSipPhone=function(r){function a(r){var a=e.sipUser.session;a?t.create({content:o("translate")("Phone.AlreadyInCall"),className:"warning"}):(e.sipUser.numberToDial=r,e.sipUser.numberToDial.length>2?(e.sipUser.lineInfo.PhoneStatus=o("translate")("Setup.Phone.Dialing"),e.sipUser.lineInfo.State="Dialing",e.sipUser.lineInfo.TalkingNumber=e.sipUser.numberToDial,n.dial(e.sipUser.lineInfo.TalkingNumber,!1),e.sipUser.activePhoneScreen="connectingScreen"):t.create({content:o("translate")("Phone.NoNumber"),className:"warning"}))}e.sipUser&&e.sipPhone&&e.sipPhone[e.app]?(e.sipUser.lineInfo.State="Dialing",a(r),e.sipPhone.crm.show()):v(function(){e.sipPhone?e.sipPhone.crm.show():e.showSipPhone("call"),a(r)},1e3)},r.showLightBox=function(e){r.lightBox=!0,r.ImageUrl=e},r.closeLightBox=function(){r.lightBox=!1},r.openLocationModal=function(e){r.filedName=e,r.locationModal=r.frameModal||y({scope:r,controller:"locationFormModalController",templateUrl:"view/app/location/locationFormModal.html",backdrop:"static",show:!1}),r.locationModal.$promise.then(r.locationModal.show)},r.webhookRequest=function(a){var a=angular.copy(a),n=new XMLHttpRequest;n.onreadystatechange=function(){4==this.readyState&&(v(function(){r.webhookRequesting[a.id]=!1}),t.create(200==this.status?{content:o("translate")("Module.ActionButtonWebhookSuccess"),className:"success"}:{content:o("translate")("Module.ActionButtonWebhookFail"),className:"warning"}))};var i={},l=[],s=a.parameters.split(","),d=a.headers.split(",");if(r.webhookRequesting={},r.webhookRequesting[a.id]=!0,angular.forEach(s,function(e){var t=e.split("|"),o=t[0],a=t[1],n=t[2];i[o]=a!=r.module.name?r.record[a]?r.record[a][n]:null:r.record[n]?r.record[n]:null}),angular.forEach(d,function(t){var o=null,a=t.split("|"),n=a[0],i=a[1],s=a[2],d=a[3],u={};switch(n){case"module":var c=d;o=i!=r.module.name?r.record[i]?r.record[i][c]:r.record[i][c]:r.record[c]?r.record[c]:null;break;case"static":switch(d){case"{:app:}":o=e.user.app_id;break;case"{:tenant:}":o=e.user.tenant_id;break;case"{:user:}":o=e.user.id;break;default:o=null}break;case"custom":o=d;break;default:o=null}u.key=s,u.value=o,l.push(u)}),"post"===a.method_type)n.open("POST",a.url,!0),a.url.indexOf(window.location.host)>-1&&n.setRequestHeader("Authorization","Bearer "+c.read("access_token")),n.setRequestHeader("Content-Type","application/json"),angular.forEach(l,function(e){n.setRequestHeader(e.key,e.value)}),n.send(JSON.stringify(i));else if("get"===a.method_type){var u="";for(var p in i)u+=p+"="+i[p]+"&";u.length>0&&(u=u.substring(0,u.length-1)),a.url+=a.url.indexOf("?")<0?"?":"&",n.open("GET",a.url+u,!0),a.url.indexOf(window.location.host)>-1&&n.setRequestHeader("Authorization","Bearer "+c.read("access_token")),angular.forEach(l,function(e){n.setRequestHeader(e.key,e.value)}),n.send()}},r.approveProcess=function(){r.executeCode=!1,R.run("BeforeApproveProcess","Script",r),r.executeCode||(r.approving=!0,A.approveProcessRequest(r.record.operation_type,r.module.name,r.record.id).then(function(e){"approved"===e.data.status?(r.isApproved=!0,r.record.freeze=!0,R.run("AfterApproveProcess","Script",r)):r.record.process_status_order++,r.approving=!1,r.waitingForApproval=!0})["catch"](function(){r.approving=!1}))},r.rejectProcess=function(e){r.executeCode=!1,R.run("BeforeRejectProcess","Script",r),r.executeCode||(r.rejecting=!0,A.rejectProcessRequest(r.record.operation_type,r.module.name,e,r.record.id).then(function(){r.isRejectedRequest=!0,r.rejecting=!1,r.record.process_status=3,r.rejectModal.hide()})["catch"](function(){r.rejecting=!1}))},r.reApproveProcess=function(){r.reapproving=!0,A.send_approval(r.record.operation_type,r.module.name,r.record.id).then(function(){r.waitingForApproval=!0,r.record.freeze=!0,r.reapproving=!1,r.record.process_status=1,r.record.process_status_order++})["catch"](function(){r.reapproving=!1})},r.openRejectApprovalModal=function(){r.rejectModal=r.rejectModal||y({scope:r,templateUrl:"view/app/module/rejectProcessModal.html",animation:"",backdrop:"static",show:!1,tag:"createModal"}),r.rejectModal.$promise.then(r.rejectModal.show)},r.sendToProcessApproval=function(){if(r.executeCode=!1,R.run("BeforeSendToProcessApproval","Script",r,r.record),!r.executeCode){if("izinler"===r.module.name){var e="";if(r.skipValidation||(e=A.customValidations(r.module,r.record)),""!=e)return void t.create({content:e,className:"warning",timeout:8e3})}r.manuelApproveRequest=!0;var a={record_id:r.record.id,module_id:r.module.id};A.sendApprovalManuel(a).then(function(){R.run("AfterSendToProcessApproval","Script",r,r.record),r.hasManuelProcess=!1,r.waitingForApproval=!0,r.record.freeze=!0,r.manuelApproveRequest=!1,r.record.process_status=1,r.record.process_status_order++})["catch"](function(e){r.manuelApproveRequest=!1,400===e.status&&(e.data.model_state&&e.data.model_state.filters_not_match&&t.create({content:o("translate")("Common.FiltersNotMatched"),className:"warning"}),e.data.model_state&&e.data.model_state.approver_not_found&&t.create({content:o("translate")("Common.ApproverNotFound"),className:"warning"}))})}},r.module.relations.length>0){r.relationActionButtons=[];var x=o("filter")(r.module.relations,{deleted:!1},!0),$=function(e){e.isShown=!1,e.dependent_field?record[e.dependent_field]&&record[e.dependent_field].labelStr==e.dependent&&(e.isShown=!0):e.isShown=!0};if(x.length>0)for(var U=0;U<x.length;U++){var Y=o("filter")(e.modules,{name:x[U].related_module},!0)[0];A.getActionButtons(Y.id).then(function(e){if(e.length>0){var t=o("filter")(e,function(e){return"Detail"!==e.trigger&&"Form"!==e.trigger&&"List"!==e.trigger},!0);if(t)for(var a=0;a<t.length;a++){var n=t[a];n.module_name=Y.name,r.relationActionButtons.push(n),$(n)}}})}}R.run("AfterDetailLoaded","script",r);var j=/\[([^\[\]]+)\]\(([^)]+)/;
r.getUrlFieldText=function(e){if(!e)return e;var r=e.match(j);return r?r[1]:e},r.getUrlFieldLink=function(e){if(!e)return e;var r=e.match(j);return r?r[2]:e}}]);