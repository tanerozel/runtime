"use strict";angular.module("primeapps").controller("UserGroupController",["$rootScope","$scope","$filter","helper","UserGroupService","mdToast","$localStorage","$mdDialog","$state","AppService",function(e,t,a,n,o,i,s,r,d,l){l.checkPermission().then(function(n){if(n&&n.data){var s=JSON.parse(n.data.profile),l=void 0;if(n.data.customProfilePermissions&&(l=JSON.parse(n.data.customProfilePermissions)),!s.HasAdminRights){var m=void 0;l&&(m=l.permissions.indexOf("user_groups")>-1),m||(i.error(a("translate")("Common.Forbidden")),d.go("app.dashboard"))}}e.breadcrumblist=[{title:a("translate")("Layout.Menu.Dashboard"),link:"#/app/dashboard"},{title:a("translate")("Setup.Nav.Users"),link:"#/app/setup/users"},{title:a("translate")("Setup.Nav.Tabs.UserGroups")}],t.loading=!0,t.selectedGroup={id:null,clone:null},t["delete"]=function(e){var n=r.confirm().title(a("translate")("Common.AreYouSure")).ok(a("translate")("Common.Yes")).cancel(a("translate")("Common.No"));r.show(n).then(function(){o["delete"](e).then(function(){i.success(a("translate")("Setup.UserGroups.DeleteSuccess")),t.grid.dataSource.read()})})},t.goUrl2=function(e){var a=window.getSelection();0===a.toString().length&&t.showSideModal(e,!1)};var p='<md-menu md-position-mode="target-right target"><md-button class="md-icon-button" aria-label=" " ng-click="$mdMenu.open()"> <i class="fas fa-ellipsis-v"></i></md-button><md-menu-content width="2" class="md-dense"><md-menu-item><md-button ng-click="showSideModal(dataItem.id,true)"><i class="fas fa-copy"></i> '+a("translate")("Common.Copy")+'<span></span></md-button></md-menu-item><md-menu-item><md-button id="deleteButton-{{dataItem.id}}" ng-click="delete(dataItem.id)"><i class="fas fa-trash"></i> <span> '+a("translate")("Common.Delete")+"</span></md-button></md-menu-item></md-menu-content></md-menu>",u=[{field:"name",title:a("translate")("Setup.UserGroups.GroupName"),media:"(min-width: 575px)"},{field:"description",title:a("translate")("Setup.UserGroups.GroupDescription"),media:"(min-width: 575px)"},{title:a("translate")("Setup.Nav.Tabs.UserGroups"),media:"(max-width: 575px)"},{field:"",title:"",width:"80px"}],c=function(){var a=new kendo.data.DataSource({type:"odata-v4",page:1,pageSize:10,serverPaging:!0,serverFiltering:!0,serverSorting:!0,transport:{read:{url:"/api/user_group/find",type:"GET",dataType:"json",beforeSend:e.beforeSend()}},schema:{data:"items",total:"count",model:{id:"id",fields:{name:{type:"string"},description:{type:"string"}}}}});t.groupGridOptions={dataSource:a,rowTemplate:function(){var e='<tr ng-click="goUrl2(dataItem.id)">';e+='<td class="hide-on-m2"><span>{{dataItem.name}}</span></td>',e+='<td class="hide-on-m2"><span>{{dataItem.description}}</span></td>',e+='<td class="show-on-m2">';var t="<div><strong>{{dataItem.name}}</strong></div>";return t+="<div>{{dataItem.description}}</div>",e+=t+"</td>",e+='<td ng-click="$event.stopPropagation();" class="position-relative"><span>'+p+"</span></td>",e+="</tr>"},altRowTemplate:function(){var e='<tr class="k-alt" ng-click="goUrl2(dataItem.id)">';e+='<td class="hide-on-m2"><span>{{dataItem.name}}</span></td>',e+='<td class="hide-on-m2"><span>{{dataItem.description}}</span></td>',e+='<td class="show-on-m2">';var t="<div><strong>{{dataItem.name}}</strong></div>";return t+="<div>{{dataItem.description}}</div>",e+=t+"</td>",e+='<td ng-click="$event.stopPropagation();" class="position-relative"><span>'+p+"</span></td>",e+="</tr>"},scrollable:!0,sortable:!0,noRecords:!0,persistSelection:!0,pageable:{refresh:!0,pageSize:10,pageSizes:[10,25,50,100],buttonCount:5,info:!0},filterable:!0,filter:function(e){if(e.filter)for(var t=0;t<e.filter.filters.length;t++)e.filter.filters[t].ignoreCase=!0},columns:u},a.fetch(function(){t.loading=!1})};t.showSideModal=function(a,n){e.sideLoad=!1,t.userGroup={},t.selectedGroup={id:a,clone:n},e.buildToggler("sideModal","view/setup/usergroups/userGroupForm.html"),t.loadingModal=!1},angular.element(document).ready(function(){c()})})}]);