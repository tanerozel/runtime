"use strict";angular.module("primeapps").controller("MenuListController",["$rootScope","$scope","$filter","$dropdown","MenuService","$window","ModuleService","AppService","mdToast",function(e,t,n,o,a,i,d,l,r){function u(){a.getAllMenus().then(function(e){t.menuList=e.data;for(var o=0;o<e.data.length;o++)t.menuList[o].id=e.data[o].id,t.menuList[o].name=e.data[o].name,t.menuList[o].profile_name=n("filter")(t.profiles,{id:e.data[o].profile_id},!0)[0].name;e.data.length<1&&c(),t.loading=!1})}function c(){l.getMyAccount(!0)}t.loading=!0,u(),t["delete"]=function(e){a["delete"](e).then(function(){r.success(n("translate")("Menu.DeleteSuccess")),u()})},t.openDropdown=function(e){t["dropdown"+e.name]=t["dropdown"+e.name]||o(angular.element(document.getElementById("actionButton-"+e.name)),{placement:"bottom-right",scope:t,animation:"",show:!0});var a=[{text:n("translate")("Common.Edit"),href:"#/app/setup/menu?id="+e.id},{text:n("translate")("Common.Copy"),href:"#app/setup/menu?id="+e.id+"&clone=true"}];e["default"]||a.push({text:n("translate")("Common.Delete"),click:"delete('"+e.id+"')"}),t["dropdown"+e.name].$scope.content=a}}]);