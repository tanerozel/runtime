"use strict";angular.module("primeapps").controller("RoleController",["$rootScope","$scope","$filter","RoleService","AppService","$state","$mdDialog","mdToast","helper",function(e,t,a,l,o,r,s,i){o.checkPermission().then(function(n){if(n&&n.data){var d=JSON.parse(n.data.profile),c=void 0;if(n.data.customProfilePermissions&&(c=JSON.parse(n.data.customProfilePermissions)),!d.HasAdminRights){var u=void 0;c&&(u=c.permissions.indexOf("roles")>-1),u||r.go("app.setup.usercustomshares")}}e.breadcrumblist=[{title:a("translate")("Layout.Menu.Dashboard"),link:"#/app/dashboard"},{title:a("translate")("Setup.Nav.AccessControl"),link:"#/app/setup/profiles"},{title:a("translate")("Setup.Nav.Tabs.Roles")}],t.loading=!0,t.load=function(){l.getAll().then(function(e){t.roles=e.data,t.tree=t.rolesToTree(e.data),t.loading=!1,m()})},t.load(),t.toggle=function(e){e.toggle()},t.rolesToTree=function(e){var l=a("filter")(e,{master:!0})[0],o=t.getItem(l),r=t.getChildren(e,o),s=[],i=t.traverseTree(e,r,o);return s.push(i),s},t.traverseTree=function(e,a,l){return angular.forEach(a,function(a){var o=t.getItem(a),r=t.getChildren(e,o);if(0===r.length)t.addChild(l,o);else{var s=t.traverseTree(e,r,o);t.addChild(l,s)}}),l},t.getChildren=function(e,t){var l=a("filter")(e,{reports_to:t.id},!0);return l},t.addChild=function(e,t){return e.items.push(t)},t.getItem=function(e){var a={id:e.id,title:e["label_"+t.language],items:[],expanded:!0,system_type:e.system_type,master:e.master};return a},t.showDeleteForm=function(e){t.selectedRoleId=e.id,t.selectedRoleIsSystem="system"===e.system_type,t.transferRoles=a("filter")(t.roles,{id:"!"+e.id}),t.transferRoles=a("filter")(t.transferRoles,{reports_to:"!"+e.id}),t.transferRolesOptions={dataSource:new kendo.data.HierarchicalDataSource({data:t.tree}),dataTextField:"title",dataValueField:"id",select:function(e){var l=e.sender.dataItem(e.node);l.id===t.selectedRoleId&&(e.preventDefault(),i.warning(a("translate")("Setup.Roles.Warning")))},filter:"contains",placeholder:a("translate")("Common.Select")},t.transferRole=t.transferRoles=a("filter")(t.roles,{master:!0},!0)[0],t.deleteModal=function(){var e=angular.element(document.body);s.show({parent:e,templateUrl:"view/setup/roles/roleDelete.html",clickOutsideToClose:!1,scope:t,preserveScope:!0})},t.deleteModal()},t["delete"]=function(e){e||(e=t.transferRoles.id),t.roleDeleting=!0,l["delete"](t.selectedRoleId,e).then(function(){l.getAll().then(function(e){t.roles=e.data,t.tree=t.rolesToTree(e.data),t.roleDeleting=!1,i.success(a("translate")("Setup.Roles.DeleteSuccess")),o.getMyAccount(!0),t.close(),t.loading=!0,t.load()})})["catch"](function(){t.roleDeleting=!1})},t.showSideModal=function(a,l){e.sideLoad=!1,t.currentRole={id:a,reportsTo:l},e.buildToggler("sideModal","view/setup/roles/roleForm.html")},t.close=function(){s.hide()};var m=function(){t.rolesOptions?t.rolesOptions.dataSource.data(t.tree):t.rolesOptions={dataSource:new kendo.data.HierarchicalDataSource({data:t.tree}),template:function(e){return'<strong style="cursor:pointer;" ng-click="showSideModal('+e.item.id+',null)" flex md-truncate>'+e.item.title+'</strong > <md-button class="md-icon-button" aria-label="Delete" ng-if="!dataItem.master" ng-click="showDeleteForm(dataItem)" ng-disabled="dataItem.system_type === \'system\'"> <i class="fas fa-trash"></i></md-button><md-button class="md-icon-button" aria-label="Edit" ng-click="showSideModal('+e.item.id+',null)" ng-disabled="dataItem.system_type === \'system\'"> <i class="fas fa-pen"></i></md-button><md-button class="md-icon-button" aria-label="Add" ng-click="showSideModal(null,'+e.item.id+')"> <i class="fas fa-plus"></i></md-button>'},dragAndDrop:!1,autoBind:!0,dataTextField:"title",dataValueField:"id"}}})}]);