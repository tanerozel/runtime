'use strict';

angular.module('primeapps')

    .controller('MenusController', ['$rootScope', '$scope', '$filter', '$state', '$modal', 'helper', 'MenusService', 'config', '$location', 'ModuleService', 'ProfilesService',
        function ($rootScope, $scope, $filter, $state, $modal, helper, MenusService, config, $location, ModuleService, ProfilesService) {

            $scope.$parent.activeMenu = 'app';
            $scope.$parent.activeMenuItem = 'menus';

            $rootScope.breadcrumblist[2].title = 'Menu';

            $scope.icons = ModuleService.getIcons();

            $scope.generator = function (limit) {
                $scope.placeholderArray = [];
                for (var i = 0; i < limit; i++) {
                    $scope.placeholderArray[i] = i;
                }
            };
            $scope.generator(10);

            $scope.loading = true;

            $scope.requestModel = {
                limit: '10',
                offset: 0
            };

            $scope.activePage = 1;
            MenusService.count().then(function (response) {
                $scope.pageTotal = response.data;
                $scope.changePage(1);
            });

            $scope.changePage = function (page) {
                $scope.loading = true;

                if (page !== 1) {
                    var difference = Math.ceil($scope.pageTotal / $scope.requestModel.limit);

                    if (page > difference) {
                        if (Math.abs(page - difference) < 1)
                            --page;
                        else
                            page = page - Math.abs(page - Math.ceil($scope.pageTotal / $scope.requestModel.limit))
                    }
                }

                $scope.activePage = page;
                var requestModel = angular.copy($scope.requestModel);
                requestModel.offset = page - 1;

                MenusService.find(requestModel).then(function (response) {
                    var menuList = response.data;
                    ProfilesService.getAllBasic().then(function (response) {
                        //$scope.newProfiles = response.data;
                        $scope.newProfiles = ProfilesService.getProfiles(response.data, $rootScope.appModules, false);
                        angular.forEach(menuList, function (menu) {
                            menu.profile_name = $filter('filter')($scope.newProfiles, {id: menu.profile_id}, true)[0].name;
                        });
                        $scope.menuList = menuList;
                        $scope.menuListState = menuList;
                        $scope.loading = false;
                    });
                });
            };

            $scope.changeOffset = function () {
                $scope.changePage($scope.activePage);
            };

            var isUpdate = false; // up and down menu is click
            var menuUpdate = false;

            /* var customModules = [
                 {
                     label_tr_singular: 'Pano',
                     label_tr_plural: 'Pano',
                     label_en_singular: 'Pano',
                     label_en_plural: 'Pano',
                     name: 'dashboard',
                     route: "dashboard",
                     custom: true,
                     menu_icon: 'fa fa-pie-chart',
                     display: true
                 },
                 {
                     label_tr_singular: "Haber Akışı",
                     label_tr_plural: "Haber Akışları",
                     label_en_singular: 'News Feed',
                     label_en_plural: 'News Feed',
                     name: 'newsfeed',
                     route: "newsfeed",
                     custom: true,
                     menu_icon: 'fa fa-comments',
                     display: true
                 },
                 {
                     label_tr_singular: "Takvim",
                     label_tr_plural: "Takvim",
                     label_en_singular: 'Calendar',
                     label_en_plural: 'Calendar',
                     name: 'calendar',
                     route: "calendar",
                     custom: true,
                     menu_icon: 'fa fa-calendar',
                     display: true
                 },
                 {
                     label_tr_singular: "İş Listesi",
                     label_tr_plural: "İş Listesi",
                     label_en_singular: 'Task',
                     label_en_plural: 'Task',
                     name: 'tasks',
                     route: "tasks",
                     custom: true,
                     menu_icon: 'fa fa-check-square-o',
                     display: true
                 },
                 {
                     label_tr_singular: "Raporlar",
                     label_tr_plural: "Raporlar",
                     label_en_singular: 'Reports',
                     label_en_plural: 'Reports',
                     name: 'reports',
                     route: "reports",
                     custom: true,
                     menu_icon: 'fa fa-bar-chart',
                     display: true
                 },
                 {
                     label_tr_singular: "Masraf",
                     label_tr_plural: "Masraflarım",
                     label_en_singular: 'Expense',
                     label_en_plural: 'Expenses',
                     name: 'expense',
                     route: "expense",
                     custom: true,
                     menu_icon: 'fa fa-credit-card',
                     display: true
                 },
                 {
                     label_tr_singular: "Timesheet",
                     label_tr_plural: "Timesheet",
                     label_en_singular: "Timesheet",
                     label_en_plural: "Timesheet",
                     name: "timesheet",
                     route: "timesheet",
                     custom: true,
                     menu_icon: "fa fa-calendar-o",
                     display: true
                 }, {
                     label_tr_singular: "Zaman Çizelgem",
                     label_tr_plural: "Zaman Çizelgem",
                     label_en_singular: "Timetracker",
                     label_en_plural: "Timetracker",
                     name: "timetracker",
                     route: "timetracker",
                     custom: true,
                     menu_icon: "fa fa-calendar-o",
                     display: true
                 },
                 {
                     label_tr_singular: "İş Zekası",
                     label_tr_plural: "İş Zekası",
                     label_en_singular: "Analytic",
                     label_en_plural: "Analytics",
                     name: "analytics",
                     route: "analytics",
                     custom: true,
                     menu_icon: "fa fa-line-chart",
                     display: true
                 },
                 {
                     label_tr_singular: "Döküman Ara",
                     label_tr_plural: "Döküman Ara",
                     label_en_singular: "Document Search",
                     label_en_plural: "Document Search",
                     name: "documentSearch",
                     route: "documentSearch",
                     custom: true,
                     menu_icon: "fa fa-search",
                     display: true
                 }
             ];*/

            $scope.newModuleList = angular.copy($rootScope.appModules);
            var parentItem = {
                label_tr_plural: "Add Empty Menu Item",
                label_en_plural: "Add Empty Menu Item",
                menu_icon: "fa fa-square",
                order: 0,
                display: true
            };
            $scope.newModuleList.push(parentItem);
            //push customModules to modules
            /*  angular.forEach(customModules, function (customModule) {
                  $scope.newModuleList.push(customModule);
              });*/

            $scope.showFormModal = function (id, cloneSettings) {
                $scope.loadingModal = true;
                $scope.id = id;
                $scope.wizardStep = 0;
                $scope.data = [];
                $scope.menu = {};
                $scope.counter = 1;
                $scope.clone = angular.copy(cloneSettings);
                $scope.updateArray = [];
                $scope.deleteArray = [];
                $scope.createArray = [];
                /**
                 * Profile picklist filter, If exist delete from picklist
                 * Yapılacaklar
                 * */
                angular.forEach($scope.menuList, function (menu) {
                    $filter('filter')($scope.newProfiles, {id: menu.profile_id}, true)[0].deleted = true;
                });

                if (id) {
                    setMenuList(id);
                } else {
                    $scope.loadingModal = false;
                }
                $scope.addNewMenuFormModal = $scope.addNewMenuFormModal || $modal({
                    scope: $scope,
                    templateUrl: 'view/app/visualization/menus/menuForm.html',
                    animation: 'am-fade-and-slide-right',
                    backdrop: 'static',
                    show: false
                });

                $scope.addNewMenuFormModal.$promise.then(function () {
                    $scope.addNewMenuFormModal.show();
                });
            };

            var setMenuList = function (id) {

                $scope.data = [];
                /* $scope.updateArray = [];
                 $scope.deleteArray = [];
                 $scope.createArray = [];*/
                $scope.index = $scope.createArray.length;

                if (id) {
                    MenusService.getMenuById(id)
                        .then(function (response) {
                            $scope.menu = response.data;
                            $scope.menu.name = $scope.clone ? $scope.menu.name + '(Copy)' : $scope.menu.name;
                            //We will use this first values when click the next button, and find is update or not
                            //$scope.firstMenuName = $scope.menu.name;
                            //$scope.firstDefaultMenu = $scope.menu.default;
                            //$scope.firstMenuDescription = $scope.menu.description;

                            //If update, we added again all profiles
                            //Then, get selected profile and menuitems
                            $scope.menu.profile = $filter('filter')($scope.newProfiles, {id: response.data.profile_id}, true)[0];
                            //If clone deleted true
                            $scope.menu.profile.deleted = $scope.clone ? true : false;

                            // $scope.firstProfileId = $scope.menu.profile.id;

                            $scope.loadingModal = true;
                            //We use firstprofileId because maybe user was changed
                            MenusService.getMenuItem($scope.menu.profile_id)
                                .then(function onSuccess(response) {
                                    $scope.data = [];
                                    for (var i = 0; i < response.data.length; i++) {
                                        var menuList = {};
                                        menuList.menuModuleType = response.data[i].route ? 'Mevcut Modül' : 'Tanım Giriş';
                                        menuList.name = $scope.language === 'tr' ? response.data[i].label_tr : response.data[i].label_en;
                                        menuList.id = response.data[i].id;
                                        menuList.isDynamic = response.data[i].is_dynamic;
                                        menuList.no = i + 1;//response.data[i].order;
                                        menuList.menuId = menuList.no;
                                        menuList.parentId = 0;
                                        menuList.isEdit = false;
                                        menuList.nodes = [];
                                        menuList.route = response.data[i].route ? response.data[i].route.contains('modules/') ? '' : response.data[i].route : '';
                                        menuList.icon = response.data[i].menu_icon ? response.data[i].menu_icon : 'fa fa-square';
                                        menuList.menuName = response.data[i].route ? response.data[i].route.replace('modules/', '') : '';
                                        // menuList.menuParent = [];

                                        for (var j = 0; j < response.data[i].menu_items.length; j++) {
                                            if (!response.data[i].menu_items[j].deleted) {
                                                var labelMenu = {};
                                                labelMenu.name = response.data[i].menu_items[j].label_tr;
                                                labelMenu.menuName = response.data[i].menu_items[j].route ? response.data[i].menu_items[j].route.replace('modules/', '') : '';
                                                labelMenu.no = j + 1;//response.data[i].menu_items[j].order;
                                                labelMenu.menuId = menuList.no;
                                                labelMenu.isEdit = false;
                                                labelMenu.id = response.data[i].menu_items[j].id;
                                                labelMenu.isDynamic = response.data[i].menu_items[j].is_dynamic;
                                                labelMenu.parentId = $scope.clone ? 0 : response.data[i].menu_items[j].parent_id;
                                                labelMenu.icon = response.data[i].menu_items[j].menu_icon ? response.data[i].menu_items[j].menu_icon : 'fa fa-square';
                                                labelMenu.route = response.data[i].menu_items[j].route ? response.data[i].menu_items[j].route.contains('modules/') ? '' : response.data[i].menu_items[j].route : '';
                                                menuList.nodes.push(labelMenu);
                                            }
                                        }
                                        $scope.data.push(menuList);
                                    }
                                    //Yeni eklenecek olan modülü +1'den başlatmamız gerekiyor
                                    $scope.counter = $scope.data.length + 1;
                                    $scope.loadingModal = false;
                                })
                                .catch(function () {
                                    $scope.loadingModal = false;
                                    $scope.addNewMenuFormModal.hide();
                                });
                        });
                }
            };

            $scope.validate = function (menuForm, next) {
                menuForm.$submitted = true;
                if (menuForm.$valid) {
                    $scope.wizardStep += next ? 1 : $scope.wizardStep > 0 ? -1 : $scope.wizardStep;
                    return true;
                } else if (menuForm.$invalid) {
                    if (menuForm.name_menu.$error.required && menuForm.profile_name.$error.required) {
                        toastr.error($filter('translate')('Menu.RequiredError'));
                    }
                    if (!menuForm.name_menu.$error.required && menuForm.profile_name.$error.required) {
                        toastr.error($filter('translate')('Menu.ProfileRequiredError'));
                    }
                    if (!menuForm.profile_name.$error.required && menuForm.name_menu.$error.required) {
                        toastr.error($filter('translate')('Menu.MenuNameRequiredError'));
                    }

                    return false;
                }

            };

            $scope.addItem = function () {

                var menuList = {};
                menuList.no = $scope.counter;
                /**Tanım Giriş yoksa Modüldür
                 * menuItem-> Tanım Giriş
                 * moduleItem->modül picklist
                 * moduleItem.menu_icon-> modülün iconu
                 * menu_icon -> Tanım giriş için seçilen icon
                 * */
                menuList.menuModuleType = !$scope.menu.moduleItem.id ? "Tanım Giriş" : "Mevcut Modül";
                menuList.name = $scope.language === 'tr' ? $scope.menu.moduleItem.label_tr_plural : $scope.menu.moduleItem.label_en_plural;
                menuList.menuName = $scope.menu.moduleItem.name;
                menuList.id = 0;
                menuList.isDynamic = $scope.menu.moduleItem ? $scope.menu.moduleItem.custom ? false : true : false;
                menuList.route = $scope.menu.moduleItem != null ? $scope.menu.moduleItem.route ? $scope.menu.moduleItem.route : '' : '';
                menuList.menuId = menuList.no;
                menuList.icon = $scope.menu.moduleItem != null ? $scope.menu.moduleItem.menu_icon ? $scope.menu.moduleItem.menu_icon : 'fa fa-square' : $scope.menu.menu_icon != null ? $scope.menu.menu_icon.value : 'fa fa-square';
                $scope.counter += 1;
                menuList.parentId = 0;
                menuList.nodes = [];
                menuList.isEdit = true;
                menuList.index = $scope.index;
                $scope.index += 1;
                $scope.data.push(menuList);

                /* if ($scope.id)
                     $scope.createArray.push(menuList);
 */
                $scope.menu.menuItem = null;
                $scope.menu.moduleItem = null;
                $scope.menu.menu_icon = null;

            };

            $scope.addModule = function (menuNo) {

                var menu = $filter('filter')($scope.data, {no: menuNo}, true)[0];
                var labelMenu = {};
                labelMenu.no = menu.nodes.length > 0 ? menu.nodes.length + 1 : 1;
                labelMenu.name = $scope.menuModuleList != null ? $scope.language === 'tr' ? $scope.menuModuleList.label_tr_plural : $scope.menuModuleList.label_en_plural : '';
                labelMenu.id = 0;
                labelMenu.menuId = menu.no;
                labelMenu.parentId = menu.id;
                labelMenu.showModuleList = true;
                menu.nodes.push(labelMenu);
            };

            $scope.selectModule = function (menuNo, labelNo, module) {

                var menu = $filter('filter')($scope.data, {no: menuNo}, true)[0];
                var menuItem = $filter('filter')(menu.nodes, {no: labelNo}, true)[0];
                menuItem.name = module != null ? $scope.language === 'tr' ? module.label_tr_plural : module.label_en_plural : '';
                menuItem.menuName = module != null ? module.name : '';
                menuItem.route = module != null ? module.route ? module.route : '' : '';
                menuItem.icon = module != null ? module.menu_icon ? module.menu_icon : 'fa fa-square' : 'fa fa-square';
                menuItem.no = labelNo;
                menuItem.menuId = menu.no;
                menuItem.menuNo = menuNo;
                menuItem.isDynamic = module.custom ? false : true;
                menuItem.parentId = menu.id != null ? menu.id : 0;
                menuItem.nodes = [];
                menuItem.index = $scope.index;
                menuItem.isEdit = true;
                menuItem.showModuleList = false;
                $scope.index += 1;
            };

            $scope.save = function (menu, menuForm) {

                var copyData = angular.copy($scope.data);
                var updateData = [];
                $scope.saving = true;
                var resultPromise;
                var count = 0;
                var countChield = 0;
                for (var i = 0; i < copyData.length; i++) {

                    /*Her türlü burada menuId ve no'ları yeniden düzenlemeliyiz*/
                    copyData[i].no = count + 1;//copyData[i].id === 0 ? count + 1 : i + 1;
                    copyData[i].menuId = count + 1;// copyData[i].id === 0 ? count + 1 : i + 1;
                    copyData[i].menuNo = copyData[i].menuId;

                    /*eğer kategori ise alt kırılımında yeni eklenen child var mı ? varsa ekle*/
                    for (var j = 0; j < copyData[i].nodes.length; j++) {

                        var createItem = $filter('filter')(copyData[i].nodes, {id: 0}, true)[0];
                        copyData[i].nodes[j].no = countChield + 1;
                        copyData[i].nodes[j].menuId = count + 1;
                        copyData[i].nodes[j].menuNo = copyData[i].nodes[j].menuId;

                        if (createItem && copyData[i].id > 0) {
                            $scope.createArray.push(createItem);
                            copyData[i].nodes.splice(j, 1);
                            j--
                        }
                        countChield++;
                    }

                    if (copyData[i].id === 0) {
                        $scope.createArray.push(copyData[i]);
                        copyData.splice(i, 1);
                        i--;
                    }
                    count++;
                }

                //If update
                if (menu.id && !$scope.clone) {

                    //we will check  first values for update
                    var menuListIsUpdate = isMenuDirty(menuForm);

                    if ($scope.updateArray.length > 0 && menuListIsUpdate) {
                        resultPromise = MenusService.update($scope.id, $scope.updateArray);
                        menuUpdate = true;
                    }

                    //Create MenuItem
                    if ($scope.createArray.length > 0) {

                        //we just check if createArray item isUpdate

                        MenusService.createMenuItems($scope.createArray, !$scope.menu.default ? $scope.menu.profile.id : 1)
                            .then(function onSuccess() {
                                if (isUpdate) {
                                    //Update
                                    MenusService.updateMenuItems(copyData).then(function onSuccess() { //updateMenuItem()
                                        //Delete
                                        if ($scope.deleteArray.length > 0)
                                            MenusService.deleteMenuItems($scope.deleteArray).then(function onSuccess() {
                                                toastr.success($filter('translate')('Menu.UpdateSucces'));
                                                $scope.addNewMenuFormModal.hide();
                                                $scope.changePage($scope.activePage);
                                                $scope.saving = false;
                                            }).catch(function () {
                                                $scope.saving = false;
                                                $scope.addNewMenuFormModal.hide();
                                            });
                                        else {

                                            toastr.success($filter('translate')('Menu.UpdateSucces'));
                                            $scope.saving = false;
                                            $scope.addNewMenuFormModal.hide();
                                            $scope.changePage($scope.activePage);
                                        }
                                    }).catch(function () {
                                        $scope.saving = false;
                                        $scope.addNewMenuFormModal.hide();
                                    });
                                } else {
                                    toastr.success($filter('translate')('Menu.UpdateSucces'));
                                    $scope.saving = false;
                                    $scope.addNewMenuFormModal.hide();
                                    $scope.changePage($scope.activePage);
                                }
                            });
                    }

                    //if !create -> Update menuList
                    else if (isUpdate)//$scope.updateMenuItemArray.length > 0)
                    {
                        MenusService.updateMenuItems(copyData).then(function onSuccess() {
                            //Delete
                            if ($scope.deleteArray.length > 0)
                                MenusService.deleteMenuItems($scope.deleteArray).then(function onSuccess() {

                                    toastr.success($filter('translate')('Menu.UpdateSucces'));
                                    $scope.addNewMenuFormModal.hide();
                                    $scope.changePage($scope.activePage);
                                    $scope.saving = false;
                                }).catch(function () {
                                    $scope.saving = false;
                                    $scope.addNewMenuFormModal.hide();
                                });
                            else {

                                toastr.success($filter('translate')('Menu.UpdateSucces'));
                                $scope.saving = false;
                                $scope.addNewMenuFormModal.hide();
                                $scope.changePage($scope.activePage);
                            }
                        }).catch(function () {
                            $scope.saving = false;
                            $scope.addNewMenuFormModal.hide();
                        });
                    } else if (menuUpdate) {
                        resultPromise.then(function onSuccess() {
                            toastr.success($filter('translate')('Menu.UpdateSucces'));
                            $scope.saving = false;
                            $scope.addNewMenuFormModal.hide();
                            $scope.changePage($scope.activePage);
                        });
                    } else {
                        toastr.success($filter('translate')('Menu.UpdateSucces'));
                        $scope.addNewMenuFormModal.hide();
                        $scope.saving = false;
                        $scope.changePage($scope.activePage);
                    }
                }
                //If first create
                else {
                    menu = [
                        {
                            profile_id: $scope.menu.default ? 1 : $scope.menu.profile.id,
                            name: $scope.menu.name,
                            default: $scope.menu.default ? $scope.menu.default : false,
                            description: $scope.menu.description,
                        }];

                    MenusService.create(menu).then(function () {
                        if ($scope.createArray.length > 0) {
                            MenusService.createMenuItems($scope.createArray, menu[0].profile_id).then(function onSuccess() {
                                toastr.success($filter('translate')('Menu.MenuSaving'));
                                $scope.addNewMenuFormModal.hide();
                                $scope.changePage($scope.activePage);
                                $scope.pageTotal += 1;
                                $scope.saving = false;
                            }).catch(function () {
                                $scope.saving = false;
                                $scope.addNewMenuFormModal.hide();
                            });
                        } else {
                            toastr.success($filter('translate')('Menu.MenuSaving'));
                            $scope.addNewMenuFormModal.hide();
                            $scope.changePage($scope.activePage);
                            $scope.pageTotal += 1;
                            $scope.saving = false;
                        }
                    });
                }
            }
            ;

            $scope.edit = function (node) {
                node.isEdit = true;
            };

            $scope.update = function (node) {
                node.isEdit = false;
                isUpdate = true;
            };

            $scope.remve = function (node, parentList, parent) { //(node, index) {
                var index = parentList.indexOf(node);
                if (index > -1) {
                    //Ana kırılım 
                    if (node.id > 0 && !parent) {
                        //ana kırılımın childları var mı ?
                        for (var i = 0; i < node.nodes.length; i++) {
                            node.nodes[i].no = i + 1;
                            if (node.nodes[i].id > 0) {
                                $scope.deleteArray.push(node.nodes[i].id);
                                $scope.data[node.no].nodes.splice(i, 1);
                                i--;
                            }
                        }
                        $scope.deleteArray.push(node.id);
                        $scope.data.splice(index, 1);
                    }
                    //alt kırılım
                    else if (node.id > 0 && parent) {
                        $scope.deleteArray.push(node.id);
                        //Daha öncesinden data arryinden herhangi bir veri silinmiş olabilir 
                        /* var parentIndex = $scope.data.indexOf(parent);
                         $scope.data[parentIndex].nodes.splice(index, 1);*/
                    }
                    var parentIndex = $scope.data.indexOf(parent);
                    if (parentIndex > -1) {
                        $scope.data[parentIndex].nodes.splice(index, 1);
                        for (var k = 0; k < $scope.data[parentIndex].nodes.length; k++) {
                            $scope.data[parentIndex].nodes[k].no = k + 1;
                        }
                    } else if (parentIndex < 0 && !parent && node.id < 0) {
                        $scope.data.splice(index, 1);
                    }

                }
                isUpdate = true;
            };

            $scope.radioChange = function () {
                /**moduleItem, Mevcut modül
                 * If choice value True and moduleItem was select, we will clear module picklist
                 * */
                if ($scope.menu.display && $scope.menu.moduleItem)
                // if (moduleDisplay && moduleItem)
                    $scope.menu.moduleItem = '';

                else {
                    $scope.menu.menuItem = '';
                    $scope.menu.menu_icon = null;
                }
            };

            $scope.up = function (index, no, menuItemNo) {

                var menuList = $filter('orderBy')($scope.data, 'no');

                if (!menuItemNo) {
                    var prev = angular.copy(menuList[index - 1]);
                    menuList[index - 1] = angular.copy(menuList[index]);
                    menuList[index - 1].no = prev.no;
                    menuList[index - 1].menuId = prev.no;
                    if (menuList[index - 1].nodes.length > 0)
                        angular.forEach(menuList[index - 1].nodes, function (menuItem) {
                            menuItem.menuId = prev.no;
                        });
                    menuList[index] = prev;
                    menuList[index].no = no;
                    menuList[index].menuId = no;
                    if (menuList[index].nodes.length > 0)
                        angular.forEach(menuList[index].nodes, function (menuItem) {
                            menuItem.menuId = no;
                        });
                    $scope.data = menuList;
                } else {

                    var menu = $filter('filter')($scope.data, {no: no}, true)[0];
                    var menuItem = $filter('filter')(menu.nodes, {no: menuItemNo}, true)[0];
                    var prev = angular.copy(menu.nodes[index - 1]);
                    menu.nodes[index - 1] = angular.copy(menu.nodes[index]);
                    menu.nodes[index - 1].no = prev.no;

                    menu.nodes[index] = prev;
                    menu.nodes[index].no = menuItemNo;
                }
                isUpdate = true;
                $scope.data = menuList;
            };

            $scope.down = function (index, no, menuItemNo) {

                var menuList = $filter('orderBy')($scope.data, 'no');

                if (!menuItemNo) {
                    var prev = angular.copy(menuList[index + 1]);
                    menuList[index + 1] = angular.copy(menuList[index]);
                    menuList[index + 1].no = prev.no;
                    menuList[index + 1].menuId = prev.no;
                    if (menuList[index + 1].nodes.length > 0)
                        angular.forEach(menuList[index + 1].nodes, function (menuItem) {
                            menuItem.menuId = prev.no;
                        });

                    menuList[index] = prev;
                    menuList[index].no = no;
                    menuList[index].menuId = no;
                    if (menuList[index].nodes.length > 0)
                        angular.forEach(menuList[index].nodes, function (menuItem) {
                            menuItem.menuId = no;
                        });
                } else {
                    var menu = $filter('filter')($scope.data, {no: no}, true)[0];
                    var menuItem = $filter('filter')(menu.nodes, {no: menuItemNo}, true)[0];
                    var prev = angular.copy(menu.nodes[index + 1]);
                    menu.nodes[index + 1] = angular.copy(menu.nodes[index]);
                    menu.nodes[index + 1].no = prev.no;

                    menu.nodes[index] = prev;
                    menu.nodes[index].no = menuItemNo;
                }
                isUpdate = true;
                $scope.data = menuList;
            };

            function updateMenuItem() {
                var index = undefined;
                var subIndex = undefined;

                var copyMenuList = angular.copy($scope.data);
                //  angular.forEach(copyMenuList, function (menuItem) {
                for (var o = 0; o < copyMenuList.length; o++) {

                    if (copyMenuList[o].nodes.length > 0 && copyMenuList[o].id !== 0) {
                        for (var i = 0; i < copyMenuList[o].nodes.length; i++) {
                            if (copyMenuList[o].nodes[i].id === 0) {
                                subIndex = copyMenuList[o].nodes.findIndex(function (el) {
                                    return el.id === 0;
                                });
                                index = copyMenuList.findIndex(function (el) {
                                    return el.no === copyMenuList[o].no;
                                });
                                i = subIndex - 1;
                                copyMenuList[index].nodes.splice(subIndex, 1);
                            }
                        }
                    }

                    if (copyMenuList[o].id === 0) {
                        index = copyMenuList.findIndex(function (el) {
                            return el.no === copyMenuList[o].no;
                        });
                        o = index - 1;
                        copyMenuList.splice(index, 1); //we deleted this item, because this item will create
                    }
                }
                //});

                // var filterItem = $filter('filter')(copyMenuList, { id: 0 }, true)[0];
                // var filterSubItem = $filter('filter')(menuItem.nodes, { id: 0 }, true); // if we added new item under the old label
                // /** we sorted descending items, because when we splice the menuItem we need a index
                //  */
                // filterSubItem = $filter('orderBy')(filterSubItem, 'no', true);
                // var index = undefined;
                // var SubIndex = undefined;
                // if (filterItem) {
                //     //angular.forEach(filterItem.items, function (subItem) {
                //     if (filterItem.items.length > 0) {
                //         var filterSubItem = $filter('filter')(filterItem.items, { id: 0 }, true);
                //         if (filterSubItem) {
                //             for (var i = 0; i < filterSubItem.length; i++) {
                //                 SubIndex = filterItem.items.findIndex(function (el) {
                //                     return el.id === 0;
                //                 });//(x => x.id === 0);//filterSubItem.no);
                //                 index = copyMenuList.findIndex(function (el) {
                //                     return el.no === filterItem.no;
                //                 });//(x => x.no === filterItem.no);
                //                 copyMenuList[index].items.splice(SubIndex, 1);
                //             }
                //         }
                //     }
                //
                //     index = copyMenuList.findIndex(function (el) {
                //         return el.no === filterItem.no;
                //     });//(x => x.no === filterItem.no);
                //     copyMenuList.splice(index, 1); //we deleted this item, because this item will create
                // }
                // // !filterItem -> we check this case previous step, with chield
                // if (!filterItem && filterSubItem.length > 0) {
                //     index = copyMenuList.findIndex(function (el) {
                //         return el.no === menuItem.no;
                //     });//x => x.no === menuItem.no);
                //     for (var i = 0; i < copyMenuList[index].items.length; i++) {
                //         SubIndex = copyMenuList[index].items.findIndex(function (el) {
                //             return el.id === 0;
                //         });//(x => x.id === 0);
                //         copyMenuList[index].items.splice(SubIndex, 1);
                //     }
                // }
                // if (filterItem && filterSubItem.length > 0) {
                //     index = copyMenuList.findIndex(function (el) {
                //         return el.id === 0;
                //     });//(x => x.no === menuItem.no);
                //     for (var i = 0; i < copyMenuList[index].items.length; i++) {
                //         SubIndex = copyMenuList[index].items.findIndex(function (el) {
                //             return el.id === 0;
                //         });//(x => x.id === 0);
                //         copyMenuList[index].items.splice(SubIndex, 1);
                //     }
                // }
                // }
                //);
                return copyMenuList;
            }

            function deleteMenuItem() {
                var ids = [];
                angular.forEach($scope.deleteArray, function (deleteLabel) {
                    if (isUpdate) {
                        ids.push(deleteLabel.id);
                        if (deleteLabel.nodes && deleteLabel.nodes.length > 0) {
                            //Then, We was deleting Label's childs
                            angular.forEach(deleteLabel.nodes, function (deleteItem) {
                                ids.push(deleteItem.id);
                            });
                        }
                    } else {
                        //First Level Label was deleting
                        if (deleteLabel.nodes && deleteLabel.nodes.length > 0) {
                            ids.push(deleteLabel.id);
                            //Then, We was deleting Label's childs
                            angular.forEach(deleteLabel.nodes, function (deleteItem) {
                                ids.push(deleteItem.id);
                            });
                        }
                    }
                });
                return ids;
            }

            //Menu Delete
            $scope.delete = function (id, event) {
                //First delete Menu
                var willDelete =
                    swal({
                        title: "Are you sure?",
                        text: " ",
                        icon: "warning",
                        buttons: ['Cancel', 'Yes'],
                        dangerMode: true
                    }).then(function (value) {
                        if (value) {
                            var elem = angular.element(event.srcElement);
                            angular.element(elem.closest('tr')).addClass('animated-background');

                            MenusService.delete(id)
                                .then(function () {
                                    angular.element(document.getElementsByClassName('ng-scope animated-background')).remove();
                                    $scope.pageTotal--;
                                    $scope.changePage($scope.activePage);
                                    toastr.success($filter('translate')('Menu.DeleteSuccess'));
                                    $scope.saving = false;
                                })
                                .catch(function () {
                                    $scope.menuList = $scope.menuListState;
                                    angular.element(document.getElementsByClassName('ng-scope animated-background')).removeClass('animated-background');
                                    toastr.warning($filter('translate')('Common.Error'));
                                    if ($scope.addNewMenuFormModal) {
                                        $scope.addNewMenuFormModal.hide();
                                        $scope.saving = false;
                                    }
                                });
                        }
                    });
            };

            function isMenuDirty(menuForm) {
                var res = false;
                //Update Menu
                var updateList = {
                    name: $scope.menu.name,
                    description: $scope.description ? $scope.menu.description : '',
                    default: $scope.menu.default ? $scope.menu.default : false,
                    profile_id: $scope.menu.default ? 1 : $scope.menu.profile.id
                };

                if (menuForm.name_menu.$dirty) {
                    updateList.name = $scope.menu.name;
                    res = true;
                }

                if (menuForm.profile_name.$dirty && !$scope.menu.default) {
                    updateList.profile_id = $scope.menu.profile.id;
                    res = true;
                }

                if (menuForm.default.$dirty) {
                    updateList.default = $scope.menu.default;
                    res = true;
                }

                if (menuForm.menu_description.$dirty) {
                    updateList.description = $scope.menu.description;
                    res = true;
                }

                $scope.updateArray.push(updateList);

                return res;
            }

            $scope.treeOptions = {
                accept: function (sourceNodeScope, destNodesScope, destIndex) {
                    //modulü yer değiştirirken
                    if (!destNodesScope.$parent.$modelValue && sourceNodeScope.$modelValue.menuName) {
                        return true;
                    }
                    //kategoriyi yer değiştirirken
                    else if (!destNodesScope.$parent.$modelValue && !sourceNodeScope.$modelValue.menuName) {
                        return true;
                    }
                    //gideceği yer module değilse ve giden kategori değilse 
                    else if (destNodesScope.$parent.$modelValue && !destNodesScope.$parent.$modelValue.menuName && sourceNodeScope.$modelValue.menuName) {
                        return true;
                    }
                    return false;
                }
            };

        }
    ]);