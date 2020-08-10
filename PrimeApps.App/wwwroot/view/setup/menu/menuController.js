"use strict";angular.module("primeapps").controller("MenuController",["$rootScope","$scope","$filter","MenuService","$window","ModuleService","$location","$state","$cache","AppService","mdToast",function(e,n,t,a,u,i,l,r,s,m,o){function d(){var e=void 0,t=void 0,a=angular.copy(n.menuLists);return angular.forEach(a,function(n){if(n.items.length>0)for(var u=0;u<n.items.length;u++)0===n.items[u].id&&(t=n.items.findIndex(function(e){return 0===e.id}),e=a.findIndex(function(e){return e.no===n.no}),u=subIndex-1,a[e].items.splice(t,1));0===n.id&&(e=a.findIndex(function(e){return e.no===n.no}),u=e-1,a.splice(e,1))}),a}function c(){var e=[];return angular.forEach(n.deleteArray,function(n){p?(e.push(n.id),n.items&&n.items.length>0&&angular.forEach(n.items,function(n){e.push(n.id)})):n.items&&n.items.length>0&&(e.push(n.id),angular.forEach(n.items,function(n){e.push(n.id)}))}),e}n.loading=!0,n.id=l.search().id;var f=l.search().clone;n.wizardStep=0,n.menuModuleList=null,n.menuLists=[],n.counter=1,n.updateArray=[],n.deleteArray=[],n.createArray=[],n.firstMenuName="",n.firstMenuDescription="",n.firstDefaultMenu=null,n.firstProfileId=null,n.newProfiles=angular.copy(n.profiles),n.defaultMenu=!1,n.description=null,n.menuName=null,n.icons=i.getIcons();var p=!1,_=t("filter")(n.users,{is_subscriber:!0},!0)[0].profile_id;n.$parent.collapsed=!0;var g=!1;n.index=n.createArray.length;var h=[{label_tr_singular:"Pano",label_tr_plural:"Pano",label_en_singular:"Pano",label_en_plural:"Pano",name:"dashboard",route:"dashboard",custom:!0,menu_icon:"fa fa-pie-chart",display:!0},{label_tr_singular:"Haber Akışı",label_tr_plural:"Haber Akışları",Label_en_singular:"News Feed",Label_en_plural:"News Feed",name:"newsfeed",route:"newsfeed",custom:!0,menu_icon:"fa fa-comments",display:!0},{label_tr_singular:"Takvim",label_tr_plural:"Takvim",Label_en_singular:"Calendar",Label_en_plural:"Calendar",name:"calendar",route:"calendar",custom:!0,menu_icon:"fa fa-calendar",display:!0},{label_tr_singular:"İş Listesi",label_tr_plural:"İş Listesi",Label_en_singular:"Task",Label_en_plural:"Task",name:"tasks",route:"tasks",custom:!0,menu_icon:"fa fa-check-square-o",display:!0},{label_tr_singular:"Raporlar",label_tr_plural:"Raporlar",Label_en_singular:"Reports",Label_en_plural:"Reports",name:"reports",route:"reports",custom:!0,menu_icon:"fa fa-bar-chart",display:!0},{label_tr_singular:"Masraf",label_tr_plural:"Masraflarım",Label_en_singular:"Expense",Label_en_plural:"Expenses",name:"expense",route:"expense",custom:!0,menu_icon:"fa fa-credit-card",display:!0},{label_tr_singular:"Timesheet",label_tr_plural:"Timesheet",Label_en_singular:"Timesheet",Label_en_plural:"Timesheet",name:"timesheet",route:"timesheet",custom:!0,menu_icon:"fa fa-calendar-o",display:!0},{label_tr_singular:"Zaman Çizelgem",label_tr_plural:"Zaman Çizelgem",Label_en_singular:"Timetracker",Label_en_plural:"Timetracker",name:"timetracker",route:"timetracker",custom:!0,menu_icon:"fa fa-calendar-o",display:!0},{label_tr_singular:"İş Zekası",label_tr_plural:"İş Zekası",Label_en_singular:"Analytic",Label_en_plural:"Analytics",name:"analytics",route:"analytics",custom:!0,menu_icon:"fa fa-line-chart",display:!0},{label_tr_singular:"Döküman Ara",label_tr_plural:"Döküman Ara",Label_en_singular:"Document Search",Label_en_plural:"Document Search",name:"documentSearch",route:"documentSearch",custom:!0,menu_icon:"fa fa-search",display:!0}];n.newModuleList=angular.copy(n.modules),angular.forEach(h,function(e){n.newModuleList.push(e)}),n.id?a.getMenuById(n.id).then(function(e){n.menuName=e.data.name,n.defaultMenu=e.data["default"],n.description=e.data.description,n.firstMenuName=n.menuName,n.firstDefaultMenu=n.defaultMenu,n.firstMenuDescription=n.description,a.getAllMenus().then(function(){n.profileItem=t("filter")(n.newProfiles,{id:e.data.profile_id},!0)[0],n.profileItem.deleted=f?!0:!1,n.firstProfileId=n.profileItem.id,a.getMenuItem(n.firstProfileId).then(function(e){for(var t=0;t<e.data.length;t++){var a={};a.menuModuleType=e.data[t].route?"Mevcut Modül":"Tanım Giriş",a.name="tr"===n.language?e.data[t].label_tr:e.data[t].label_en,a.id=e.data[t].id,a.no=t+1,a.menuId=a.no,a.isDynamic=e.data[t].is_dynamic,a.parentId=0,a.items=[],a.route=e.data[t].route?e.data[t].route.contains("modules/")?"":e.data[t].route:"",a.icon=e.data[t].menu_icon?e.data[t].menu_icon:"fa fa-square",a.menuName=e.data[t].route?e.data[t].route.replace("modules/",""):"";for(var u=0;u<e.data[t].menu_items.length;u++)if(!e.data[t].menu_items[u].deleted){var i={};i.name=e.data[t].menu_items[u].label_tr,i.menuName=e.data[t].menu_items[u].route?e.data[t].menu_items[u].route.replace("modules/",""):"",i.no=u+1,i.menuId=a.no,i.id=e.data[t].menu_items[u].id,i.isDynamic=e.data[t].menu_items[u].is_dynamic,i.parentId=f?0:e.data[t].menu_items[u].parent_id,i.icon=e.data[t].menu_items[u].menu_icon?e.data[t].menu_items[u].menu_icon:"",i.route=e.data[t].menu_items[u].route?e.data[t].menu_items[u].route.contains("modules/")?"":e.data[t].menu_items[u].route:"",a.items.push(i)}n.menuLists.push(a)}n.counter=n.menuLists.length+1,n.loading=!1})})}):n.loading=!1,a.getAllMenus().then(function(e){for(var a=0;a<e.data.length;a++)t("filter")(n.newProfiles,{id:e.data[a].profile_id},!0)[0].deleted=!0}),n.step1=function(){return n.menuForm.$submitted=!0,n.menuForm.$valid?(n.wizardStep=1,!0):!1},n.addItem=function(){var e={};e.no=n.counter,e.menuModuleType=n.menuItem&&n.menuItem.length>0?"Tanım Giriş":"Mevcut Modül",e.name=n.menuItem&&n.menuItem.length>0?n.menuItem:"tr"===n.language?n.moduleItem.label_tr_plural:n.moduleItem.label_en_plural,e.menuName=n.menuItem&&n.menuItem.length>0?"":n.moduleItem.name,e.id=0,e.isDynamic=n.moduleItem?n.moduleItem.custom?!1:!0:!1,e.route=null!=n.moduleItem&&n.moduleItem.route?n.moduleItem.route:"",e.menuId=e.no,e.icon=null!=n.moduleItem?n.moduleItem.menu_icon?n.moduleItem.menu_icon:"":null!=n.menu_icon?n.menu_icon:"fa fa-square",n.counter+=1,e.parentId=0,e.items=[],e.index=n.index,n.index+=1,n.menuLists.push(e),n.id&&n.createArray.push(e),n.menuItem=null,n.moduleItem=null,n.menu_icon=null},n.addModule=function(e){var a=t("filter")(n.menuLists,{no:e},!0)[0],u={};u.no=a.items.length>0?a.items.length+1:1,u.name=null!=n.menuModuleList?"tr"===n.language?n.menuModuleList.label_tr_plural:n.menuModuleList.label_en_plural:"",u.id=0,u.menuId=a.no,u.parentId=a.id,a.items.push(u)},n.selectModule=function(e,a,u){var i=t("filter")(n.menuLists,{no:e},!0)[0],l=t("filter")(i.items,{no:a},!0)[0];l.name=null!=u?"tr"===n.language?u.label_tr_plural:u.label_en_plural:"",l.menuName=null!=u?u.name:"",l.route=null!=u&&u.route?u.route:"",l.icon=null!=u&&u.menu_icon?u.menu_icon:"",l.no=a,l.menuId=i.no,l.menuNo=e,l.isDynamic=u.custom?!1:!0,l.parentId=null!=i.id?i.id:0,l.items=[],menuList.index=n.index,n.index+=1,n.id&&l.parentId>0&&n.createArray.push(l)},n.save=function(e){var u;if(n.loading=!0,n.id&&!f){var i={name:n.menuName,description:n.description?n.description:"","default":n.defaultMenu?n.defaultMenu:!1,profile_id:n.defaultMenu?_:n.profileItem.id},l=!1;angular.equals(n.firstMenuName,n.menuName)||(i.name=n.menuName,l=!0),n.firstProfileId==n.profileItem.id||n.defaultMenu||(i.profile_id=n.profileItem.id,l=!0),n.firstDefaultMenu!=n.defaultMenu&&(i["default"]=n.defaultMenu,l=!0),n.firstMenuDescription!=n.description&&(i.description=n.description,l=!0),n.updateArray.push(i),n.updateArray.length>0&&l&&(u=a.update(n.id,n.updateArray),g=!0),n.createArray.length>0?(p&&angular.forEach(n.createArray,function(e){var a=t("filter")(n.menuLists,{parentId:0,name:e.name,menuModuleType:e.menuModuleType},!0)[0];if(a)e.no=a.no;else for(var u=0;u<n.menuLists.length;u++)n.menuLists[u].items.length>0&&(a=t("filter")(n.menuLists[u].items,{id:0,name:e.name,menuModuleType:e.menuModuleType},!0)[0],a&&(e.no=a.no))}),a.createMenuItems(n.createArray,n.defaultMenu?_:n.profileItem.id).then(function(){p?a.updateMenuItems(d()).then(function(){n.deleteArray.length>0?a.deleteMenuItems(c()).then(function(){m.getMyAccount(!0),o.success(t("translate")("Menu.UpdateSucces")),r.go("app.setup.menu_list")}):(m.getMyAccount(!0),o.success(t("translate")("Menu.UpdateSucces")),r.go("app.setup.menu_list"))}):(m.getMyAccount(!0),o.success(t("translate")("Menu.UpdateSucces")),r.go("app.setup.menu_list"))})):p?a.updateMenuItems(d()).then(function(){n.deleteArray.length>0?a.deleteMenuItems(c()).then(function(){m.getMyAccount(!0),o.success(t("translate")("Menu.UpdateSucces")),r.go("app.setup.menu_list")}):(m.getMyAccount(!0),o.success(t("translate")("Menu.UpdateSucces")),r.go("app.setup.menu_list"))}):g?u.then(function(){r.go("app.setup.menu_list")}):r.go("app.setup.menu_list")}else{var e=[{profile_id:n.defaultMenu?_:n.profileItem.id,name:n.menuName,"default":n.defaultMenu,description:n.description}];a.create(e).then(function(){a.createMenuItems(n.menuLists,e[0].profile_id).then(function(){o.success(t("translate")("Menu.MenuSaving")),n.loading=!1,m.getMyAccount(!0),r.go("app.setup.menu_list")})})}},n.edit=function(e,a){if(a){var u=t("filter")(n.menuLists,{no:e},!0)[0],i=t("filter")(u.items,{no:a},!0)[0];i.isEdit=!0}else{var u=t("filter")(n.menuLists,{no:e},!0)[0];u.isEdit=!0}},n.update=function(e,a,u){if(u){var i=t("filter")(n.menuLists,{no:e},!0)[0],l=t("filter")(i.items,{no:u},!0)[0];l.icon=a,l.isEdit=!1}else{var i=t("filter")(n.menuLists,{no:e},!0)[0];i.icon=a,i.isEdit=!1}p=!0},n.remove_=function(e,a,u,i){if(null!=u&&i){var l="",r=null,s=null;n.id&&(l=n.menuLists[e-1],r=t("filter")(n.createArray,{menuId:e},!0)[0],s=r?t("filter")(r.items,{name:l.name},!0)[0]:t("filter")(n.menuLists[e-1].items,{name:l.name},!0)[0],s||r||n.deleteArray.push(l),s&&!r&&n.deleteArray.push(s),l&&(n.createArray.splice(l.index,1),n.index=l.index?n.index-1:n.index)),n.menuLists.splice(u,1),angular.forEach(n.menuLists,function(n){n.no=n.no>e?n.no-1:n.no,n.menuId=n.no,n.items.length>0&&angular.forEach(n.items,function(e){e.menuId=n.menuId})}),n.counter=n.counter-1,n.counterMenuItem=1}else n.id&&(l=n.menuLists[e-1].items[a-1],r=t("filter")(n.createArray,{menuId:e},!0)[0],s=r?t("filter")(r.items,{name:l.name},!0)[0]:t("filter")(n.menuLists[e-1].items,{name:l.name},!0)[0],s||r||n.deleteArray.push(s),s&&!r&&""!=l.name&&n.deleteArray.push(s),l&&(n.createArray.splice(l.index,1),n.index=l.index?n.index-1:n.index)),n.menuLists[e-1].items.splice(1===a?0:a-1,1),angular.forEach(n.menuLists[e-1].items,function(e){e.no=e.no>a?e.no-1:e.no});p=!0},n.radioChange=function(){n.module.display&&n.moduleItem?n.moduleItem="":(n.menuItem="",n.menu_icon=null)},n.up=function(e,a,u){var i=t("orderBy")(n.menuLists,"no");if(u){{var l=t("filter")(n.menuLists,{no:a},!0)[0];t("filter")(l.items,{no:u},!0)[0]}r=angular.copy(l.items[e-1]),l.items[e-1]=angular.copy(l.items[e]),l.items[e-1].no=r.no,l.items[e]=r,l.items[e].no=u}else{var r=angular.copy(i[e-1]);i[e-1]=angular.copy(i[e]),i[e-1].no=r.no,i[e-1].menuId=r.no,i[e-1].items.length>0&&angular.forEach(i[e-1].items,function(e){e.menuId=r.no}),i[e]=r,i[e].no=a,i[e].menuId=a,i[e].items.length>0&&angular.forEach(i[e].items,function(e){e.menuId=a}),n.menuLists=i}p=!0,n.menuLists=i},n.down=function(e,a,u){var i=t("orderBy")(n.menuLists,"no");if(u){{var l=t("filter")(n.menuLists,{no:a},!0)[0];t("filter")(l.items,{no:u},!0)[0]}r=angular.copy(l.items[e+1]),l.items[e+1]=angular.copy(l.items[e]),l.items[e+1].no=r.no,l.items[e]=r,l.items[e].no=u}else{var r=angular.copy(i[e+1]);i[e+1]=angular.copy(i[e]),i[e+1].no=r.no,i[e+1].menuId=r.no,i[e+1].items.length>0&&angular.forEach(i[e+1].items,function(e){e.menuId=r.no}),i[e]=r,i[e].no=a,i[e].menuId=a,i[e].items.length>0&&angular.forEach(i[e].items,function(e){e.menuId=a})}p=!0,n.menuLists=i}}]);