"use strict";angular.module("primeapps").controller("ModuleSetupController",["$rootScope","$scope","$filter","$state","$dropdown","helper","ModuleService","$cache","AppService","LicenseService","mdToast",function(e,t,o,n,l,s,u,a,d,i,r){var p=function(){t.modulesSetup=[],angular.forEach(e.modules,function(e){0!==e.order&&t.modulesSetup.push(e)}),t.customModules=o("filter")(t.modulesSetup,{system_type:"custom"})};t.user=e.user,p(),t.moduleListFilter=function(e){return"users"!==e.name&&"profiles"!==e.name&&"roles"!==e.name},t.openDropdown=function(e){t["dropdown"+e.name]=t["dropdown"+e.name]||l(angular.element(document.getElementById("actionButton-"+e.name)),{placement:"bottom-right",scope:t,animation:"",show:!0});var n=[{text:o("translate")("Common.Edit"),href:"#app/setup/module?id="+e.name}];"activities"!==e.name&&"mails"!==e.name&&n.push({text:o("translate")("Common.Copy"),click:"moduleLicenseCopyCountLimit('"+e.name+"')"}),"system"!=e.system_type&&n.push({text:o("translate")("Common.Delete"),click:"showDeleteForm('"+e.id+"')"}),"adaylar"===e.name&&n.push({text:o("translate")("Setup.Conversion.ConversionMapping"),href:"#app/setup/candidateconvertmap"}),n.push({divider:!0},{text:o("translate")("Setup.Modules.ModuleRelations"),href:"#app/setup/module/relations/"+e.name},{text:o("translate")("Setup.Modules.FieldsDependencies"),href:"#app/setup/module/dependencies/"+e.name},{text:o("translate")("Setup.Modules.ActionButtons"),href:"#app/setup/module/actionButtons/"+e.name},{text:o("translate")("Setup.Modules.ModuleProfileSettings"),href:"#app/setup/module/moduleProfileSettings/"+e.name}),t["dropdown"+e.name].$scope.content=n},t.showDeleteForm=function(e){t.selectedModuleId=e,t.deleteModal=t.deleteModal||$modal({scope:t,template:"view/setup/modules/deleteForm.html",animation:"",backdrop:"static",show:!1}),t.deleteModal.$promise.then(function(){t.deleteModal.show()})},t.moduleLicenseCopyCountLimit=function(e){i.getModuleLicenseCount().then(function(n){var l=n.data;t.customModules.length>=l?r.warning(o("translate")("Setup.License.ModuleLicanse",{count:l})):window.location="#app/setup/module?clone="+e})},t.moduleLicenseCountLimit=function(){i.getModuleLicenseCount().then(function(e){var l=e.data;t.customModules.length>=l?r.warning(o("translate")("Setup.License.ModuleLicanse",{count:l})):n.go("app.setup.module")})},t["delete"]=function(){t.deleting=!0,u["delete"](t.selectedModuleId).then(function(){var n=o("filter")(e.modules,{id:parseInt(t.selectedModuleId)},!0)[0];n.display=!1,n.order=0;for(var l=e.modules.length-1;l>=0;l--)for(var u=e.modules[l].fields.length-1;u>=0;u--)if(e.modules[l].fields[u].lookup_type===n.name){e.modules[l].fields.splice(u,1);var d=e.modules[l].name;a.remove(d+"_"+d)}p(),s.getPicklists([0],!0),r.success(o("translate")("Setup.Modules.DeleteSuccess")),t.deleting=!1,t.deleteModal.hide()})["catch"](function(){t.deleteModal.hide()})}}]);