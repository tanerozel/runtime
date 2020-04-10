"use strict";angular.module("primeapps").controller("ModuleListController",["$rootScope","$scope","ngToast","$sce","$filter","helper","$location","$state","$stateParams","$q","$window","$localStorage","$cache","config","ngTableParams","blockUI","exportFile","$popover","$modal","operations","activityTypes","transactionTypes","ModuleService","$http","components",function(e,t,a,o,l,r,s,n,i,c,d,u,p,m,f,v,h,g,w,M,b,k,_,y,P){if(t.type=i.type,t.operations=M,t.hasPermission=r.hasPermission,t.activityTypes=b,t.transactionTypes=k,t.loading=!0,t.module=l("filter")(e.modules,{name:t.type},!0)[0],t.lookupUser=r.lookupUser,t.lookupProfile=r.lookupProfile,t.lookupRole=r.lookupRole,t.searchingDocuments=!1,t.isAdmin=e.user.profile.has_admin_rights,t.hasActionButtonDisplayPermission=_.hasActionButtonDisplayPermission,t.hideDeleteAll=l("filter")(e.deleteAllHiddenModules,t.type+"|"+t.type,!0)[0],t.actionButtonDisabled=!1,t.showExportButton=!0,t.hasViewPermission=!1,t.hasBulkUpdatePermission=!1,t.isAdmin||(r.hasCustomProfilePermission("view")&&(t.hasViewPermission=!0),r.hasCustomProfilePermission("bulk_update")&&(t.hasBulkUpdatePermission=!0)),!t.module)return a.create({content:l("translate")("Common.NotFound"),className:"warning"}),void n.go("app.dashboard");if(t.bulkUpdate={},t.filter={},!t.hasPermission(t.type,t.operations.read))return a.create({content:l("translate")("Common.Forbidden"),className:"warning"}),void n.go("app.dashboard");_.getActionButtons(t.module.id).then(function(e){t.actionButtons=l("filter")(e,function(e){return"Detail"!==e.trigger&&"Form"!==e.trigger&&"Relation"!==e.trigger},!0)}),t.fields=[],t.selectedRows=[],t.selectedRecords=[],t.isAllSelected=!1,t.currentUser=_.processUser(e.user),t.currentDayMin=r.getCurrentDateMin().toISOString(),t.currentDayMax=r.getCurrentDateMax().toISOString(),t.currentHour=r.floorMinutes(new Date);var R=v.instances.get("tableBlockUI"),S=[10,25,50,100],x=t.module.name+"_"+t.module.name;t.allFields=[];for(var A=0;A<t.module.fields.length;A++){var D=t.module.fields[A];_.hasFieldDisplayPermission(D)&&t.allFields.push(angular.copy(D))}if(t.viewid=i.viewid?i.viewid:null,"activities"===t.module.name){var U=l("filter")(b,{hidden:"!true"});U&&1===U.length&&(t.activityTypeActive=U[0])}_.setTable(t,R,S,10,null,t.module.name,t.type,!0),t.refresh=function(e){p.remove(x),e&&(t.tableParams.filterList=null,t.tableParams.refreshing=!0),t.tableParams.reloading=!0,t.tableParams.reload()};var B=function(){if("leaves"===t.module.name||"izinler"===t.module.name){var a=l("filter")(e.modules,{name:"holidays"},!0)[0];if(a){var o=l("filter")(a.fields,{name:"country"},!0)[0];r.getPicklists([o.picklist_id]).then(function(t){var a=t[o.picklist_id],r=l("filter")(a,{value:"tr"},!0)[0],s=l("filter")(a,{value:"en"},!0)[0],n=window.localStorage.NG_TRANSLATE_LANG_KEY||"tr",i={};i.limit=1e3,i.filters="tr"===e.language?[{field:"country",operator:"equals",value:r.labelStr,no:1}]:[{field:"country",operator:"is",value:s.labelStr}],_.findRecords("holidays",i).then(function(t){for(var a=t.data,o=[],r=0;r<a.length;r++)if(!a[r].half_day){var s=moment(a[r].date).format("DD-MM-YYYY");o.push(s)}var i=[1,2,3,4,5],c=l("filter")(e.moduleSettings,{key:"work_saturdays"},!0);c.length>0&&"t"===c[0].value&&i.push(6),e.holidaysData=a,moment.locale(n,{week:{dow:1},workingWeekdays:i,holidays:o,holidayFormat:"DD-MM-YYYY"})})})}}};B(),t.collectiveLeave=function(){t.mailModal&&t.mailModal.show(),t.mailModal=t.mailModal||w({scope:t,templateUrl:"view/app/leave/collectiveLeave.html",backdrop:"static",show:!0})},t.showModuleFrameModal=function(e){if(new RegExp("https:").test(e)){var a,o,l;a="myPop1",o=document.body.offsetWidth-200,l=document.body.offsetHeight-200;var r=screen.width/2-o/2,s=screen.height/2-l/2;window.open(e,a,"toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width="+o+", height="+l+", top="+s+", left="+r)}else t.frameUrl=e,t.frameModal=t.frameModal||w({scope:t,controller:"ActionButtonFrameController",templateUrl:"view/app/actionbutton/actionButtonFrameModal.html",backdrop:"static",show:!1}),t.frameModal.$promise.then(t.frameModal.show)},t.trustAsHtml=function(e){return o.trustAsHtml(e)},t.webhookRequest=function(o){var r={},s=o.parameters.split(","),n=o.headers.split(","),i={"Content-Type":"application/json"};if(t.webhookRequesting={},t.webhookRequesting[o.id]=!0,angular.forEach(s,function(e){var a=e.split("|"),o=a[0],l=a[1],s=a[2];r[o]=l!=t.module.name?t.record[l]?t.record[l][s]:null:t.record[s]?t.record[s]:null}),angular.forEach(n,function(a){var o=a.split("|"),l=o[0],r=o[1],s=o[2],n=o[3];switch(l){case"module":var c=n;i[s]=r!=t.module.name?t.record[r]?t.record[r][c]:null:t.record[c]?t.record[c]:null;break;case"static":switch(n){case"{:app:}":i[s]=e.user.app_id;break;case"{:tenant:}":i[s]=e.user.tenant_id;break;case"{:user:}":i[s]=e.user.id;break;default:i[s]=null}break;case"custom":i[s]=n;break;default:i[s]=null}}),"post"===o.method_type)y.post(o.url,r,{headers:i}).then(function(){a.create({content:l("translate")("Module.ActionButtonWebhookSuccess"),className:"success"}),t.webhookRequesting[o.id]=!1})["catch"](function(){a.create({content:l("translate")("Module.ActionButtonWebhookFail"),className:"warning"}),t.webhookRequesting[o.id]=!1});else if("get"===o.method_type){var c="";for(var d in r)c+=d+"="+r[d]+"&";c.length>0&&(c=c.substring(0,c.length-1)),y.get(o.url+"?"+c).then(function(){a.create({content:l("translate")("Module.ActionButtonWebhookSuccess"),className:"success"}),t.webhookRequesting[o.id]=!1})["catch"](function(){a.create({content:l("translate")("Module.ActionButtonWebhookFail"),className:"warning"}),t.webhookRequesting[o.id]=!1})}},t["delete"]=function(e){_.getRecord(t.module.name,e).then(function(o){if(!r.hasPermission(t.type,M.modify,o.data))return void a.create({content:l("translate")("Common.Forbidden"),className:"warning"});var s=_.processRecordSingle(o.data,t.module,t.modulePicklists);t.executeCode=!1,P.run("BeforeDelete","Script",t,s),t.executeCode||_.deleteRecord(t.module.name,e).then(function(){P.run("AfterDelete","Script",t,t.record),p.remove(x),t.tableParams.reload()})})},t.hideCreateNew=function(e){return"users"===e.lookup_type?!0:"relation"!==e.lookup_type||t.record.related_module?!1:!0},t.multiselect=function(e,a){for(var o=[],l=0;l<t.tableParams.picklists[a.picklist_id].length;l++){var r=t.tableParams.picklists[a.picklist_id][l];r.inactive||r.labelStr.toLowerCase().indexOf(e)>-1&&o.push(r)}return o},t.tags=function(e,t){return y.get(m.apiUrl+"tag/get_tag/"+t.id).then(function(t){var a=t.data;return a.filter(function(t){return-1!=t.text.toLowerCase().indexOf(e.toLowerCase())})})},t.changeView=function(){R.start(),t.selectedView=t.view;var e=p.get(x),a=e.viewState,o=a||{};o.active_view=t.selectedView.id,_.setViewState(o,t.module.id,o.id).then(function(){R.stop(),t.refresh(!0)})},t.deleteView=function(e){_.deleteView(e).then(function(){t.view=l("filter")(t.views,{active:!0})[0],t.changeView()})},t["export"]=function(){if(!(t.tableParams.total()<1)){var o=!1;try{o=!!new Blob}catch(r){}if(!o)return void a.create({content:l("translate")("Module.ExportUnsupported"),className:"warning",timeout:8e3});if(t.tableParams.total()>3e3)return void a.create({content:l("translate")("Module.ExportWarning"),className:"warning",timeout:8e3});var s=t.module["label_"+e.language+"_plural"]+"-"+l("date")(new Date,"dd-MM-yyyy")+".xls";t.exporting=!0,_.getCSVData(t,t.type).then(function(e){a.create({content:l("translate")("Module.ExcelExportSuccess"),className:"success",timeout:5e3}),h.excel(e,s),t.exporting=!1})}},t.showActivityButtons=function(){t.activityButtonsPopover=t.activityButtonsPopover||g(angular.element(document.getElementById("activityButtons")),{templateUrl:"view/common/newactivity.html",placement:"bottom",autoClose:!0,scope:t,show:!0})},t.showDataTransferButtons=function(){t.dataTransferButtonsPopover=t.dataTransferButtonsPopover||g(angular.element(document.getElementById("dataTransferButtons")),{template:"view/common/datatransfer.html",placement:"bottom",autoClose:!0,scope:t,show:!0})},t.selectRow=function(e,a){e.target.checked?(t.selectedRows.push(a.id),t.selectedRecords.push({id:a.id})):(t.selectedRows=t.selectedRows.filter(function(e){return e!==a.id}),t.selectedRecords=t.selectedRecords.filter(function(e){return e.id!==a.id})),t.isAllSelected=!1},t.isRowSelected=function(e){return t.selectedRows.filter(function(t){return t===e}).length>0},t.selectAll=function(e,a){var o=-1;if(t.isAllSelected){t.isAllSelected=!1;for(var l=0;l<a.length;l++){var r=a[l];o=t.selectedRows.indexOf(r.id),-1!==o&&t.selectedRows.splice(o,1)}t.selectedRecords=[]}else{t.isAllSelected=!0;for(var l=0;l<a.length;l++){var s=a[l];o=t.selectedRows.indexOf(s.id);for(var n=0;n<s.fields.length;n++){var i=s.fields[n];i.primary&&-1===o&&t.selectedRows.push(s.id)}}}},t.deleteSelecteds=function(){return t.selectedRows&&t.selectedRows.length?void _.deleteRecordBulk(t.module.name,t.selectedRows).then(function(){p.remove(x),t.tableParams.reloading=!0,t.tableParams.reload(),a.create({content:l("translate")("Silme işleminiz başarıyla gerçekleşti. "),className:"success"}),t.selectedRows=[],t.isAllSelected=!1}):void a.create({content:l("translate")("Module.NoRecordSelected"),className:"warning"})},t.addCustomField=function(e,t){tinymce.activeEditor.execCommand("mceInsertContent",!1,"{"+t.name+"}")},t.showEMailModal=function(){return t.executeCode=!1,e.system.messaging.SystemEMail||e.system.messaging.PersonalEMail?0!==t.selectedRows.length||t.isAllSelected?(t.mailModal=t.mailModal||w({scope:t,templateUrl:"view/app/email/bulkEMailModal.html",backdrop:"static",show:!1}),P.run("BeforeModalLoad","Script",t),void(t.executeCode||t.mailModal.$promise.then(t.mailModal.show))):void a.create({content:l("translate")("Module.NoRecordSelected"),className:"warning"}):void a.create({content:l("translate")("EMail.NoProvider"),className:"warning"})},t.showSMSModal=function(){return e.system.messaging.SMS?0!==t.selectedRows.length||t.isAllSelected?(t.smsModal=t.smsModal||w({scope:t,templateUrl:"view/app/sms/bulkSMSModal.html",backdrop:"static",show:!1}),void t.smsModal.$promise.then(t.smsModal.show)):void a.create({content:l("translate")("Module.NoRecordSelected"),className:"warning"}):void a.create({content:l("translate")("SMS.NoProvider"),className:"warning"})},t.collectiveApproval=function(){t.loading=!0;var e=[];angular.forEach(t.selectedRows,function(a){var o=l("filter")(t.tableParams.data,{id:a},!0)[0];angular.isUndefined(o)||2!=o["process.process_requests.process_status"]&&e.push(o.id)}),e.length>0&&_.approveMultipleProcessRequest(e,t.module.name).then(function(){a.create({content:e.length+l("translate")("Module.ApprovedRecordCount"),className:"success"}),t.loading=!1,t.refresh(!0)})},t.showCollectiveApproval=function(){t.selected=t.selectedRows.length,!t.selectedRows||t.selectedRows.length>0?(t.collectiveApprovalModal=t.collectiveApprovalModal||w({scope:t,templateUrl:"view/app/module/collectiveApproveAlert.html",animation:"",backdrop:"static",show:!1,tag:"createModal"}),t.collectiveApprovalModal.$promise.then(t.collectiveApprovalModal.show)):a.create({content:l("translate")("Module.NoRecordSelected"),className:"warning"})},t.dropdownHide=function(){var e=angular.element(document.getElementById("dropdownMenu1"));e[0]&&e[0].click(),e[1]&&e[1].click()},t.showLightBox=function(e,a){t.lightBox=!0,t.recordData=e,t.Index=a},t.closeLightBox=function(){t.lightBox=!1};var D=l("filter")(t.module.fields,{name:name},!0)[0];t.setCurrentLookupField=function(e){t.currentLookupField=e},t.inputReset=function(){t.bulkUpdate.value=null},t.updateSelected=function(e){function o(){var a=!0;return angular.forEach(t.module.fields,function(o){t.bulkUpdate.value&&"lookup"===t.bulkUpdate.field.data_type&&"object"!=typeof t.bulkUpdate.value&&(e[o.name].$setValidity("object",!1),a=!1)}),a}if(t.selectedRows&&t.selectedRows.length&&e.$valid&&o()){t.submittingModal=!0;{var r={};t.bulkUpdate.field.name}r.ids=t.selectedRows,r.records=[];var s={};s[t.bulkUpdate.field.name]=t.bulkUpdate.value,s=_.prepareRecord(s,t.module),r.records.push(s),_.updateRecordBulk(t.module.name,r).then(function(){t.updateModal.hide(),t.submittingModal=!1,a.create({content:l("translate")("Module.UpdateRecordBulkSuccess"),className:"success"}),p.remove(x),t.tableParams.reloading=!0,t.tableParams.reload(),t.isAllSelected=!1,t.bulkUpdate.value=null})}},t.openExcelTemplate=function(){t.excelCreating=!0,t.hasQuoteTemplateDisplayPermission=_.hasQuoteTemplateDisplayPermission;var o=function(){t.excelModal=t.excelModal||w({scope:t,templateUrl:"view/app/module/moduleExcelModal.html",animation:"",backdrop:"static",show:!1}),t.excelModal.$promise.then(t.excelModal.show)};t.quoteTemplates&&(o(),t.quoteTemplate=t.quoteTemplates[0]),_.getTemplates(t.module.name,"excel").then(function(r){if(0===r.data.length)a.create(e.preview?{content:l("translate")("Setup.Templates.TemplateDefined"),className:"warning"}:{content:l("translate")("Setup.Templates.TemplateNotFound"),className:"warning"}),t.excelCreating=!1;else{var s=r.data;t.quoteTemplates=l("filter")(s,{active:!0},!0),t.isShownWarning=!0;for(var n=0;n<t.quoteTemplates.length;n++){var i=t.quoteTemplates[n],c=l("filter")(i.permissions,{profile_id:e.user.profile.id},!0)[0];i.isShown="none"===c.type?!1:!0,1==i.isShown&&(t.isShownWarning=!1)}t.quoteTemplate=t.quoteTemplates[0],t.excelModal=t.excelModal||w({scope:t,templateUrl:"view/app/module/moduleExcelModal.html",animation:"",backdrop:"static",show:!1}),o()}})["catch"](function(){t.excelCreating=!1})},t.UpdateMultiselect=function(e,a){var o=[];return angular.forEach(t.modulePicklists[a.picklist_id],function(t){t.inactive||t.labelStr.toLowerCase().indexOf(e)>-1&&o.push(t)}),o},_.getPicklists(t.module,!0).then(function(a){t.modulePicklists=a;for(var o=0;5>o;o++){var r={};r.field=null,r.operator=null,r.value=null,r.no=o+1}name.indexOf(".")>-1&&(name=name.split(".")[0]);var s=null;if(D){switch(D.data_type){case"picklist":s=l("filter")(t.modulePicklists[D.picklist_id],{labelStr:value},!0)[0];break;case"multiselect":s=[];var n=value.split("|");angular.forEach(n,function(e){var a=l("filter")(t.modulePicklists[D.picklist_id],{labelStr:e},!0)[0];a&&s.push(a)});break;case"lookup":if("users"===D.lookup_type){var i={};if("0"===value||"[me]"===value)i.id=0,i.email="[me]",i.full_name=l("translate")("Common.LoggedInUser");else{var c=l("filter")(e.users,{id:parseInt(value)},!0)[0];i.id=c.id,i.email=c.Email,i.full_name=c.FullName}s=[i]}else s=value;break;case"date":case"date_time":case"time":s=new Date(value);break;case"checkbox":s=l("filter")(t.modulePicklists.yes_no,{system_code:value},!0)[0];break;default:s=value}t.view.filterList[j].field=D,t.view.filterList[j].value=s}}),t.customModuleFields=function(e){var t=[];return angular.forEach(e,function(e){"image"==e.data_type||"location"==e.data_type||"document"==e.data_type||"number_auto"==e.data_type||"text_multi"==e.data_type||!e.validation||e.validation.readonly||"url"==e.data_type||e.custom_label||t.push(e)}),t},t.showUpdateModal=function(){return t.selectedRows&&t.selectedRows.length?t.selectedRows.length>100?void a.create({content:l("translate")("Module.RecordLimit"),className:"warning"}):(t.selected=t.selectedRows.length,t.updateModal=t.updateModal||w({scope:t,templateUrl:"view/app/module/bulkUpdateModal.html",animation:"",backdrop:"static",show:!1,tag:"createModal"}),void t.updateModal.$promise.then(t.updateModal.show)):void a.create({content:l("translate")("Module.NoRecordSelected"),className:"warning"})},t.showDeleteModal=function(){t.selected=t.selectedRows.length,t.deleteModal=t.deleteModal||w({scope:t,templateUrl:"view/app/module/bulkDelete.html",animation:"",backdrop:"static",show:!1,tag:"createModal"}),t.deleteModal.$promise.then(t.deleteModal.show)},t.showExportDataModal=function(){t["export"].moduleAllColumn=null,t.exportDataModal=t.exportDataModal||w({scope:t,templateUrl:"view/app/module/exportData.html",animation:"",backdrop:"static",show:!1,tag:"createModal"}),t.exportDataModal.$promise.then(t.exportDataModal.show)},t.recordProcessDetail=function(a){t.previousApprovers&&delete t.previousApprovers,t.processOrderParam&&delete t.processOrderParam,t.currentApprover&&delete t.currentApprover,t.updateTime&&delete t.updateTime,t.rejectApprover&&delete t.rejectApprover;for(var o,r=0;r<e.approvalProcesses.length;r++){var s=e.approvalProcesses[r];s.module_id===t.module.id&&(o=s)}"dynamicApprover"===o.approver_type&&(t.loadingProcessPopup=!0,t.processStatusParam=a["process.process_requests.process_status"],t["processInformPopover"+a.id]=t["processInformPopover"+a.id]||g(angular.element(document.getElementById("processPopover"+a.id)),{templateUrl:"view/common/processInform.html",placement:"left",autoClose:!0,scope:t,show:!0}),_.getRecord(t.module.name,a.id).then(function(a){var o,r,s,n,i=a.data,c=[];if(1===i.process_status){if(o=i.process_status_order,1===i.process_status_order)r=l("filter")(e.users,{email:i.custom_approver},!0)[0].full_name;else{r=l("filter")(e.users,{email:i["custom_approver_"+i.process_status_order]},!0)[0].full_name;var d=l("filter")(e.users,{email:i.custom_approver},!0)[0].full_name;c.push(d);for(var u=2;u<i.process_status_order;u++)c.push(l("filter")(e.users,{email:i["custom_approver_"+u]},!0)[0].full_name);t.previousApprovers=c}t.processOrderParam=o,t.currentApprover=r}else if(2===i.process_status){s=i.process_request_updated_at;var d=l("filter")(e.users,{email:i.custom_approver},!0)[0].full_name;c.push(d);for(var u=2;u<i.process_status_order+1;u++)c.push(l("filter")(e.users,{email:i["custom_approver_"+u]},!0)[0].full_name);t.previousApprovers=c,t.updateTime=moment(s).utc().format("DD-MM-YYYY HH:mm")}else 3===i.process_status&&(s=i.process_request_updated_at,n=l("filter")(e.users,{id:i.process_request_updated_by},!0)[0].full_name,t.rejectApprover=n,t.updateTime=moment(s).utc().format("DD-MM-YYYY HH:mm"));t.loadingProcessPopup=!1}))}}]);