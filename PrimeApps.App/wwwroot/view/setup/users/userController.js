"use strict";angular.module("primeapps").controller("UserController",["$rootScope","$scope","$filter","$state","guidEmpty","helper","UserService","WorkgroupService","AppService","ProfileService","RoleService","LicenseService","$q","officeHelper","$localStorage","mdToast","$mdDialog",function(e,a,t,s,i,r,n,o,d,l,c,u,p,m,f,g,h){a.loading=!0,d.checkPermission().then(function(i){function o(){var s=[];s.push(l.getAll()),s.push(c.getAll()),p.all(s).then(function(s){var i=s[0].data;a.roles=angular.copy(s[1].data),a.profiles=l.getProfiles(i,e.workgroup.tenant_id,!0),e.user.profile.has_admin_rights||(a.profiles=t("filter")(a.profiles,{has_admin_rights:!1},!0)),U()})}if(i&&i.data){var u=JSON.parse(i.data.profile),m=void 0;if(i.data.customProfilePermissions&&(m=JSON.parse(i.data.customProfilePermissions)),!u.HasAdminRights){var f=void 0;m&&(f=m.permissions.indexOf("users")>-1),f||s.go("app.setup.usergroups")}}e.breadcrumblist=[{title:t("translate")("Layout.Menu.Dashboard"),link:"#/app/dashboard"},{title:t("translate")("Setup.Nav.Users"),link:"#/app/setup/users"},{title:t("translate")("Setup.Nav.Tabs.Users")}],a.isOfficeConnected=!1,a.officeUserReady=!1,a.officeUsers=null,a.selectedOfficeUser={},a.addUserModel={},a.addUserForm=!0,a.submitting=!1,a.hideSendEmailToUser=!1,a.officeUserChanged=function(e){a.addUserModel.email=e.email,a.addUserModel.phone=e.phone,a.addUserModel.full_name=e.fullName,a.addUserModel.first_bame=e.name,a.addUserModel.last_name=e.surname},a.sendOfficeUserPassword=function(){var s="crm";switch(e.user.appId){case 2:s="kobi";break;case 3:s="asistan";break;case 4:s="ik";break;case 5:s="cagri";break;default:s="crm"}a.submitting=!0;var i={};i.full_name=a.addedUser.first_name+" "+a.addedUser.last_name,i.password=a.userPassword,i.email=a.addedUser.email,n.sendPasswordToOfficeUser(i).then(function(){a.closeUserInfoPopover(),g.success({content:t("translate")("Setup.Office.SendEmailSuccess"),timeout:5e3})})["catch"](function(){a.closeUserInfoPopover(),g.error({content:t("translate")("Setup.Office.SendEmailError"),timeout:5e3})})},a.closeUserInfoPopover=function(){a.submitting=!1,a.addUserForm=!0,a.userPassword=null,a.hideSendEmailToUser=!1,e.closeSide("sideModal"),a.addedUser={},a.grid.dataSource.read()},o(),a.showCreateForm=function(){a.addedUser={},a.addUserModel={},a.addUserForm=!0,a.showSideModal()},a.showOfficeUserCreateForm=function(){a.addedUser={},a.addUserForm=!0,a.createOfficePopover=a.createOfficePopover||$popover(angular.element(document.getElementById("officeCreateButton")),{templateUrl:"view/setup/users/officeUserCreate.html",placement:"bottom-right",scope:a,autoClose:!0,show:!0})},a.addUser=function(s){if(!(s&&s.email&&s.profile&&s.role&&s.first_name&&s.last_name))return void g.error(t("translate")("Module.RequiredError"));a.loadingModal=!0;var i={};return s.id?void a.edit(s):(a.userInviting=!0,i.firstName=s.first_name,i.LastName=s.last_name,i.email=s.email,i.profileId=s.profile.id,i.roleId=s.role.id,a.addedUser=angular.copy(s),i=r.SnakeToCamel(i),void n.addUser(i).then(function(s){s.data&&(o(),a.userInviting=!1,g.success(t("translate")("Setup.Users.NewUserSuccess")),a.grid.dataSource.read(),a.loadingModal=!1,a.userPassword=s.data.password,a.hideSendEmailToUser=s.data.password.contains("***"),a.addUserForm=!1,a.addUserModel={}),n.getAllUser().then(function(a){e.users=a.data})})["catch"](function(e){a.userInviting=!1,a.loadingModal=!1,409===e.status&&g.warning(t("translate")("Setup.Users.NewUserError"))}))},a.showEditForm=function(e){a.loadingModal=!0,a.selectedUser=angular.copy(e),a.addUserModel=e,a.editModel={},a.editModel.profile=e.profile.id,a.editModel.role=e.role.id,a.editModel.activeDirectoryEmail=e.activeDirectoryEmail,a.userHaveActiveDirectoryEmail=null!==e.activeDirectoryEmail&&"null"!==e.activeDirectoryEmail&&""!==e.activeDirectoryEmail,a.editModelState=angular.copy(a.editModel),a.showSideModal()},a.edit=function(s){if(a.loadingModal=!0,a.editModel=s,a.editModel.profile===a.editModelState.profile&&a.editModel.role===a.editModelState.role&&a.editModel.activeDirectoryEmail===a.editModelState.activeDirectoryEmail)return void(a.loadingModal=!1);var i=function(){o(),a.loadingModal=!1,a.closeUserInfoPopover(),g.success(t("translate")("Setup.Users.EditSuccess"))},r=function(){n.updateActiveDirectoryEmail(a.selectedUser.id,a.editModel.activeDirectoryEmail).then(function(){i()})["catch"](function(e){a.loadingModal=!1,409===e.status&&g.warning(t("translate")("Setup.Users.NewUserError"))})};l.changeUserProfile(a.selectedUser.id,e.workgroup.tenant_id,a.editModel.profile.id).then(function(){c.updateUserRole(a.selectedUser.id,a.editModel.role.id).then(function(){null===a.editModel.activeDirectoryEmail&&""===a.editModel.activeDirectoryEmail||a.editModel.activeDirectoryEmail===a.editModelState.activeDirectoryEmail?i():r()})["catch"](function(){a.loadingModal=!1,a.userEditing=!1})})["catch"](function(){a.loadingModal=!1,a.userEditing=!1})},a.dismiss=function(s){if(s){var i=t("filter")(a.users,{id:s},!0)[0];n.dismiss(i,e.workgroup.tenant_id).then(function(){a.closeUserInfoPopover(),g.success(t("translate")("Setup.Users.DismissSuccess")),d.getMyAccount(!0)})["catch"](function(){})}},a.showConfirm=function(e,s){var i=h.confirm(t("translate")("Setup.Users.UserDeleteMessage")).title(t("translate")("Common.AreYouSure")).targetEvent(s).ok(t("translate")("Common.Yes")).cancel(t("translate")("Common.No"));h.show(i).then(function(){a.dismiss(e)},function(){})},a.showSideModal=function(){e.sideLoad=!1,e.buildToggler("sideModal","view/setup/users/userSideModal.html"),a.loadingModal=!1},a.copySuccess=function(){g.success(t("translate")("Setup.Users.PasswordCopySuccess"))},a.goUrl2=function(e){var t=window.getSelection();0===t.toString().length&&a.showEditForm(angular.copy(e))};var U=function(){var s=new kendo.data.DataSource({type:"odata-v4",page:1,pageSize:10,serverPaging:!0,serverFiltering:!0,serverSorting:!0,transport:{read:{url:"/api/user/find_users",type:"GET",dataType:"json",beforeSend:e.beforeSend()}},schema:{data:"items",total:"count",model:{id:"id",fields:{email:{type:"string"},user_name:{type:"string"},first_name:{type:"string"},last_name:{type:"string"}}}}});a.usersGridOptions={dataSource:s,scrollable:!1,persistSelection:!0,sortable:!0,noRecords:!0,pageable:{refresh:!0,pageSize:10,pageSizes:[10,25,50,100],buttonCount:5,info:!0},filterable:!0,filter:function(e){if(e.filter&&e.field!=="Role.Label"+a.language&&"Profile.Name"!==e.field)for(var t=0;t<e.filter.filters.length;t++)e.filter.filters[t].ignoreCase=!0},rowTemplate:function(e){var s='<tr ng-click="goUrl2(dataItem)">';s+='<td class="hide-on-m2"><span ng-if="'+e.has_account+'">'+e.user_name+"</span></td>",s+='<td class="hide-on-m2"><span>{{dataItem.email}}</span></td>',s+=e.profile?'<td class="hide-on-m2"><span>{{dataItem.profile.name_'+a.language+"}}</span></td>":'<td class="hide-on-m2"><span>-</span></td>',s+=e.role?'<td class="hide-on-m2"><span>{{dataItem.role.label_'+a.language+"}}</span></td>":'<td class="hide-on-m2"><span>-</span></td>',s+=e.is_admin?'<td class="hide-on-m2"><span>'+t("translate")("Setup.Users.GroupOwner")+"</span></td>":e.has_account?'<td class="hide-on-m2"><span>'+t("translate")("Setup.Users.UserStatus1")+"</span></td>":'<td class="hide-on-m2"><span>'+t("translate")("Setup.Users.UserStatus2")+"</span></td>",s+='<td class="show-on-m2">';var i='<div class="d-flex align-items-center"><strong ng-if="'+e.has_account+'">'+e.user_name+"</strong>";return i+='<span class="k-badge k-info-colored ml-2" style="font-size: 12px">{{dataItem.profile.name}}</span> ',i+="</div><div><span>{{dataItem.email}}</span></div>",s+=i+"</td>",s+='<td ng-click="$event.stopPropagation();"><span><md-button class="md-icon-button" aria-label=" " ng-disabled="'+(e.is_admin||e.profile.has_admin_rights&&e.id===a.user.id)+'" ng-click="showConfirm('+e.id+')"><i class="fas fa-trash"></i> </md-button></span></td>',s+="</tr>"},altRowTemplate:function(e){var s='<tr class="k-alt" ng-click="goUrl2(dataItem)">';s+='<td class="hide-on-m2"><span>{{dataItem.email}}</span></td>',s+='<td class="hide-on-m2"><span ng-if="'+e.has_account+'">'+e.user_name+"</span></td>",s+=e.profile?'<td class="hide-on-m2"><span>{{dataItem.profile.name_'+a.language+"}}</span></td>":'<td class="hide-on-m2"><span>-</span></td>',s+=e.role?'<td class="hide-on-m2"><span>{{dataItem.role.label_'+a.language+"}}</span></td>":'<td class="hide-on-m2"><span>-</span></td>',s+=e.is_admin?'<td class="hide-on-m2"><span>'+t("translate")("Setup.Users.GroupOwner")+"</span></td>":e.has_account?'<td class="hide-on-m2"><span>'+t("translate")("Setup.Users.UserStatus1")+"</span></td>":'<td class="hide-on-m2"><span>'+t("translate")("Setup.Users.UserStatus2")+"</span></td>",s+='<td class="show-on-m2">';var i='<div class="d-flex align-items-center"><strong ng-if="'+e.has_account+'">'+e.user_name+"</strong>";return i+=e.profile?'<span class="k-badge k-info-colored ml-2" style="font-size: 12px">{{dataItem.profile.name_'+a.language+"}}</span> ":'<span class="k-badge k-info-colored ml-2" style="font-size: 12px">-</span> ',i+="</div><div><span>{{dataItem.email}}</span></div>",s+=i+"</td>",s+='<td ng-click="$event.stopPropagation();"><span><md-button class="md-icon-button" aria-label=" " ng-disabled="'+(e.is_admin||e.profile.has_admin_rights&&e.id===a.user.id)+'" ng-click="showConfirm('+e.id+')"><i class="fas fa-trash"></i> </md-button></span></td>',s+="</tr>"},columns:[{field:"UserName",title:t("translate")("Setup.Users.UserFullName"),media:"(min-width: 575px)"},{field:"Email",title:t("translate")("Setup.Users.UserEmail"),media:"(min-width: 575px)"},{field:"Profile.Name",title:t("translate")("Setup.Users.Profile"),media:"(min-width: 575px)"},{field:"Role.Label"+a.language,title:t("translate")("Setup.Users.Role"),media:"(min-width: 575px)"},{field:"",title:t("translate")("Setup.Users.UserStatus"),filterable:!1,media:"(min-width: 575px)"},{title:t("translate")("Setup.Nav.Tabs.Users"),media:"(max-width: 575px)"},{field:"",title:"",filterable:!1,width:"40px"}]},s.fetch(function(){a.loading=!1})};a.profileOptions={dataSource:t("orderBy")(a.profiles,"name_"+a.language),dataTextField:"name_"+a.language,dataValueField:"id"},a.roleOptions={dataSource:{transport:{read:function(e){e.success(t("orderBy")(a.roles,"label_"+a.language))}}},autoBind:!1,filter:"contains",dataTextField:"label_"+a.language,dataValueField:"id"}})}]);