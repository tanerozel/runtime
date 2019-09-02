"use strict";angular.module("primeapps").controller("UserController",["$rootScope","$scope","$filter","$state","ngToast","guidEmpty","$popover","helper","UserService","WorkgroupService","AppService","ProfileService","RoleService","LicenseService","$q","officeHelper",function(e,t,r,i,s,a,o,l,c,n,d,u,f,m,p){function U(){var r=[];r.push(c.getAllUser()),r.push(u.getAll()),r.push(f.getAll()),r.push(m.getUserLicenseStatus()),p.all(r).then(function(r){var i=r[0].data,s=r[1].data,a=r[2].data,o=r[3].data;e.workgroup.users=i,t.profiles=u.getProfiles(s,e.workgroup.tenant_id,!0),t.roles=a,t.users=c.getUsers(i,t.profiles,t.roles),t.licensesBought=o.total||0,t.licensesUsed=o.used||0,t.licenseAvailable=t.licensesBought-t.licensesUsed,t.loading=!1})}t.loading=!0,t.isOfficeConnected=!1,t.officeUserReady=!1,t.officeUsers=null,t.selectedOfficeUser={},t.addUserModel={},t.addUserForm=!0,t.submitting=!1,t.hideSendEmailToUser=!1,t.officeUserChanged=function(e){t.addUserModel.email=e.email,t.addUserModel.phone=e.phone,t.addUserModel.fullName=e.fullName,t.addUserModel.firstName=e.name,t.addUserModel.lastName=e.surname},t.sendOfficeUserPassword=function(){var i="crm";switch(e.user.appId){case 2:i="kobi";break;case 3:i="asistan";break;case 4:i="ik";break;case 5:i="cagri";break;default:i="crm"}t.submitting=!0;var a=r("translate")("Setup.Office.EmailNotification.Hello")+" "+t.addedUser.fullName+"<br />"+r("translate")("Setup.Office.EmailNotification.Created")+"<br />"+r("translate")("Setup.Office.EmailNotification.Email")+t.addedUser.email+"<br />"+r("translate")("Setup.Office.EmailNotification.Password")+t.userPassword,o={};o.Subject=r("translate")("Setup.Office.EmailNotification.Subject"),o.Template_With_Body=a,o.To_Addresses=[t.addedUser.email],o.Template_Name="add_user",c.sendPasswordToOfficeUser(o).then(function(){t.closeUserInfoPopover(),s.create({content:r("translate")("Setup.Office.SendEmailSuccess"),className:"success",timeout:5e3})})["catch"](function(){t.closeUserInfoPopover(),s.create({content:r("translate")("Setup.Office.SendEmailError"),className:"danger",timeout:5e3})})},t.closeUserInfoPopover=function(){t.submitting=!1,t.addUserForm=!0,t.userPassword=null,t.hideSendEmailToUser=!1,t.createOfficePopover?t.createOfficePopover.hide():t.createPopover&&t.createPopover.hide(),t.addedUser={}},U(),t.showCreateForm=function(){t.addedUser={},t.addUserForm=!0,t.createPopover=t.createPopover||o(angular.element(document.getElementById("createButton")),{templateUrl:"view/setup/users/userCreate.html",placement:"bottom-right",scope:t,autoClose:!0,show:!0})},t.showOfficeUserCreateForm=function(){t.addedUser={},t.addUserForm=!0,t.createOfficePopover=t.createOfficePopover||o(angular.element(document.getElementById("officeCreateButton")),{templateUrl:"view/setup/users/officeUserCreate.html",placement:"bottom-right",scope:t,autoClose:!0,show:!0})},t.addUser=function(e){e&&e.email&&e.profile&&e.role&&e.firstName&&e.lastName&&(e.fullName||(e.fullName=e.firstName+" "+e.lastName),t.userInviting=!0,e.profileId=e.profile,e.roleId=e.role,t.addedUser=angular.copy(e),e=l.SnakeToCamel(e),c.addUser(e).then(function(e){e.data&&(U(),t.userInviting=!1,s.create({content:r("translate")("Setup.Users.NewUserSuccess"),className:"success"}),t.userPassword=e.data.password,t.hideSendEmailToUser=e.data.password.contains("***"),t.addUserForm=!1,t.addUserModel={})})["catch"](function(e){t.userInviting=!1,409===e.status&&s.create({content:r("translate")("Setup.Users.NewUserError"),className:"warning"})}))},t.showEditForm=function(e){t.selectedUser=e,t.editModel={},t.editModel.profile=e.profile.id,t.editModel.role=e.role.id,t.editModel.activeDirectoryEmail=e.activeDirectoryEmail,t.userHaveActiveDirectoryEmail=null!==e.activeDirectoryEmail&&"null"!==e.activeDirectoryEmail&&""!==e.activeDirectoryEmail,t.editModelState=angular.copy(t.editModel),t["editPopover"+e.id]=t["editPopover"+e.id]||o(angular.element(document.getElementById("editButton"+e.id)),{templateUrl:"view/setup/users/userEdit.html",placement:"left",scope:t,autoClose:!0,show:!0})},t.edit=function(){if(t.userEditing=!0,t.editModel.profile===t.editModelState.profile&&t.editModel.role===t.editModelState.role&&t.editModel.activeDirectoryEmail===t.editModelState.activeDirectoryEmail)return t.userEditing=!1,void t.popover.hide();var i=function(){U(),t.userEditing=!1,t.popover.hide(),s.create({content:r("translate")("Setup.Users.EditSuccess"),className:"success"})},a=function(){c.updateActiveDirectoryEmail(t.selectedUser.id,t.editModel.activeDirectoryEmail).then(function(){i()})["catch"](function(e){t.userEditing=!1,409===e.status&&s.create({content:r("translate")("Setup.Users.NewUserError"),className:"warning"})})};u.changeUserProfile(t.selectedUser.id,e.workgroup.tenant_id,t.editModel.profile).then(function(){f.updateUserRole(t.selectedUser.id,t.editModel.role).then(function(){null===t.editModel.activeDirectoryEmail&&""===t.editModel.activeDirectoryEmail||t.editModel.activeDirectoryEmail===t.editModelState.activeDirectoryEmail?i():a()})["catch"](function(){t.userEditing=!1})})["catch"](function(){t.userEditing=!1})},t.dismiss=function(i,a,o){t.userDeleting=!0,c.dismiss(i,e.workgroup.tenant_id).then(function(){t.users.splice(a,1),t.userDeleting=!1,s.create({content:r("translate")("Setup.Users.DismissSuccess"),className:"success"}),d.getMyAccount(!0),m.getUserLicenseStatus().then(function(e){t.licensesBought=e.data.total||0,t.licensesUsed=e.data.used||0,t.licenseAvailable=t.licensesBought-t.licensesUsed}),o()})["catch"](function(){t.userDeleting=!1,o()})},t.gotoLicencePage=function(){var e=r("filter")(t.$parent.menuItems,{link:"#/app/setup/license"})[0];t.$parent.selectMenuItem(e),i.go("app.setup.license")}}]);