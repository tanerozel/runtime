'use strict';

angular.module('ofisim')

    .controller('ModuleFormSetupController', ['$rootScope', '$scope', '$filter', '$location', '$state', 'ngToast', 'guidEmpty', '$popover', '$modal', 'helper', '$timeout', 'dragularService', 'defaultLabels', '$interval', '$cache', 'systemRequiredFields', 'systemReadonlyFields', 'ModuleSetupService', 'ModuleService', 'AppService',
        function ($rootScope, $scope, $filter, $location, $state, ngToast, guidEmpty, $popover, $modal, helper, $timeout, dragularService, defaultLabels, $interval, $cache, systemRequiredFields, systemReadonlyFields, ModuleSetupService, ModuleService, AppService) {
            $scope.id = $location.search().id;
            $scope.clone = $location.search().clone;
            $scope.redirect = $location.search().redirect;
            $scope.record = {};
            $scope.currentDeletedFields = [];
            $scope.documentSearch = $rootScope.user.profile.DocumentSearch;
            $scope.dataTypes = ModuleSetupService.getDataTypes();
            $scope.calendarColors = [
                { dark: '#b8c110', light: '#e9ebb9' },
                { dark: '#01a0e4', light: '#b3e2f5' },
                { dark: '#61b033', light: '#d0e6c3' },
                { dark: '#ee6d1a', light: '#fad2bb' },
                { dark: '#e21550', light: '#f5bacb' },
                { dark: '#b62f7c', light: '#e8c1d7' },
                { dark: '#643a8c', light: '#d1c5db' },
                { dark: '#174c9c', light: '#bacae0' },
                { dark: '#00995e', light: '#b4e0ce' },
                { dark: '#e83a21', light: '#f7c4be' }
            ];
            $scope.addressTypes = [
                { name: 'country', value: $filter('translate')('Common.Country') },
                { name: 'city', value: $filter('translate')('Common.City') },
                { name: 'disrict', value: $filter('translate')('Common.Disrict') },
                { name: 'street', value: $filter('translate')('Common.Street') }
            ];
            $scope.viewTypes = [
                { name: 'dropdown', value: $filter('translate')('Common.Dropdown') },
                { name: 'radio', value: $filter('translate')('Common.Radio') },
                { name: 'checkbox', value: $filter('translate')('Common.Checkbox') }
            ];
            $scope.positions = [
                { name: 'left', value: $filter('translate')('Common.Left') },
                { name: 'right', value: $filter('translate')('Common.Right') }
            ];
            var module = {};

            if (!$scope.id && !$scope.clone) {
                $scope.module = ModuleSetupService.prepareDefaults(module);
                $scope.moduleLabelNotChanged = true;
            }
            else {
                module = $filter('filter')($rootScope.modules, { name: $scope.id || $scope.clone }, true)[0];

                if (!module) {
                    ngToast.create({ content: $filter('translate')('Common.NotFound'), className: 'warning' });
                    $state.go('app.crm.dashboard');
                    return;
                }

                $scope.module = angular.copy(module);

                if ($scope.clone) {
                    if ($scope.clone === 'opportunity' || $scope.clone === 'activity') {
                        ngToast.create({ content: $filter('translate')('Common.NotFound'), className: 'warning' });
                        $state.go('app.crm.dashboard');
                        return;
                    }

                    $scope.module.label_en_plural = $scope.module.label_en_plural + ' (Copy)';
                    $scope.module.label_en_singular = $scope.module.label_en_singular + ' (Copy)';
                    $scope.module.label_tr_plural = $scope.module.label_tr_plural + ' (Kopya)';
                    $scope.module.label_tr_singular = $scope.module.label_tr_singular + ' (Kopya)';
                    $scope.module.related_modules = [];
                    $scope.moduleLabelNotChanged = true;
                    $scope.module.system_type = 'custom';
                    var sortOrders = [];

                    angular.forEach($rootScope.modules, function (moduleItem) {
                        sortOrders.push(moduleItem.order);
                    });

                    angular.forEach($scope.module.fields, function (field) {
                        if (!field.deleted) {
                            if (systemRequiredFields.all.indexOf(field.name) < 0) {
                                field.systemRequired = false;
                            }

                            if (systemReadonlyFields.all.indexOf(field.name) < 0) {
                                field.systemReadonly = false;
                            }
                        }
                    });

                    var sectionsCopied = angular.copy($filter('filter')($scope.module.sections, { deleted: '!true' }, true));
                    var fieldsCopied = angular.copy($filter('filter')($scope.module.fields, { deleted: '!true' }, true));
                    var defaultFields = ['owner', 'created_by', 'created_at', 'updated_by', 'updated_at'];
                    var sectionNames = [];

                    for (var i = 0; i < sectionsCopied.length; i++) {
                        var section = sectionsCopied[i];
                        delete section.id;
                        var newName = 'custom_section' + i + 1;

                        var sectionName = $filter('filter')(sectionNames, { name: section.name }, true)[0];

                        if (!sectionName)
                            sectionNames.push({ name: section.name, newName: newName });

                        section.name = newName;
                    }

                    for (var j = 0; j < fieldsCopied.length; j++) {
                        var field = fieldsCopied[j];

                        if (defaultFields.indexOf(field.name) < 0) {
                            delete field.id;
                            field.name = 'custom_field' + j + 1;
                        }

                        var sectionName = $filter('filter')(sectionNames, { name: field.section }, true)[0];

                        field.section = sectionName.newName;
                    }

                    $scope.module.sections = sectionsCopied;
                    $scope.module.fields = fieldsCopied;

                    $scope.module.order = Math.max.apply(null, sortOrders) + 1;
                    $scope.module.name = 'custom_module' + module.order + '_c';
                }

                if (!$scope.module.detail_view_type)
                    $scope.module.detail_view_type = 'tab';
            }

            $scope.module = ModuleSetupService.processModule($scope.module);
            $scope.moduleLayout = ModuleSetupService.getModuleLayout($scope.module);

            ModuleSetupService.getPicklists()
                .then(function onSuccess(picklists) {
                    $scope.picklists = picklists.data;
                });

            var getMultilineTypes = function () {
                var multilineType1 = { value: 'small', label: $filter('translate')('Setup.Modules.MultilineTypeSmall') };
                var multilineType2 = { value: 'large', label: $filter('translate')('Setup.Modules.MultilineTypeLarge') };

                $scope.multilineTypes = [];
                $scope.multilineTypes.push(multilineType1);
                $scope.multilineTypes.push(multilineType2);
            };

            var getLookupTypes = function (refresh) {
                helper.getPicklists([0], refresh)
                    .then(function (picklists) {
                        $scope.lookupTypes = picklists['900000'];

                        var hasUserLookType = $filter('filter')($scope.lookupTypes, { name: 'users' }, true).length > 0;

                        if (!hasUserLookType) {
                            var userLookType = {};
                            userLookType.id = 900000;
                            userLookType.label = {};
                            userLookType.label.en = defaultLabels.UserLookupFieldEn;
                            userLookType.label.tr = defaultLabels.UserLookupFieldTr;
                            userLookType.order = 0;
                            userLookType.type = 0;
                            userLookType.value = 'users';

                            $scope.lookupTypes.unshift(userLookType);
                        }
                    });
            };

            var getRoundingTypes = function () {
                var roundingType1 = { value: 'off', label: $filter('translate')('Setup.Modules.RoundingTypeOff') };
                var roundingType2 = { value: 'down', label: $filter('translate')('Setup.Modules.RoundingTypeDown') };
                var roundingType3 = { value: 'up', label: $filter('translate')('Setup.Modules.RoundingTypeUp') };

                $scope.roundingTypes = [];
                $scope.roundingTypes.push(roundingType1);
                $scope.roundingTypes.push(roundingType2);
                $scope.roundingTypes.push(roundingType3);
            };

            var getSortOrderTypes = function () {
                var sortOrderType1 = { value: 'alphabetical', label: $filter('translate')('Setup.Modules.PicklistSortOrderAlphabetical') };
                var sortOrderType2 = { value: 'order', label: $filter('translate')('Setup.Modules.PicklistSortOrderOrder') };

                $scope.sortOrderTypes = [];
                $scope.sortOrderTypes.push(sortOrderType1);
                $scope.sortOrderTypes.push(sortOrderType2);
            };

            var getCalendarDateTypes = function () {
                var calendarDateType1 = { value: 'start_date', label: $filter('translate')('Setup.Modules.CalendarDateTypeStartDate') };
                var calendarDateType2 = { value: 'end_date', label: $filter('translate')('Setup.Modules.CalendarDateTypeEndDate') };

                $scope.calendarDateTypes = [];
                $scope.calendarDateTypes.push(calendarDateType1);
                $scope.calendarDateTypes.push(calendarDateType2);
            };

            getMultilineTypes();
            getLookupTypes(false);
            getRoundingTypes();
            getSortOrderTypes();
            getCalendarDateTypes();

            ModuleSetupService.getDeletedModules()
                .then(function (deletedModules) {
                    $scope.deletedModules = deletedModules;
                });

            $scope.lookup = function (searchTerm) {
                if ($scope.currentLookupField.lookup_type === 'users' && !$scope.currentLookupField.lookupModulePrimaryField) {
                    var userModulePrimaryField = {};
                    userModulePrimaryField.data_type = 'text_single';
                    userModulePrimaryField.name = 'full_name';
                    $scope.currentLookupField.lookupModulePrimaryField = userModulePrimaryField;
                }

                if (($scope.currentLookupField.lookupModulePrimaryField.data_type === 'number' || $scope.currentLookupField.lookupModulePrimaryField.data_type === 'number_auto') && isNaN(parseFloat(searchTerm))) {
                    $scope.$broadcast('angucomplete-alt:clearInput', $scope.currentLookupField.name);
                    return $q.defer().promise;
                }

                return ModuleService.lookup(searchTerm, $scope.currentLookupField, $scope.record);
            };

            $scope.setCurrentLookupField = function (field) {
                $scope.currentLookupField = field;
            };

            $scope.calculate = function (field) {
                ModuleService.calculate(field, $scope.module, $scope.record);
            };

            $scope.setDependency = function (field) {
                ModuleService.setDependency(field, $scope.module, $scope.record);
                ModuleService.setDisplayDependency($scope.module, $scope.record);
            };

            $scope.refreshModule = function () {
                ModuleSetupService.refreshModule($scope.moduleLayout, $scope.module);
            };

            $scope.showEditModal = function (isModuleSaving) {
                $scope.moduleState = angular.copy($scope.module);
                $scope.isModuleSaving = isModuleSaving;
                $scope.editModal = $scope.editModal || $modal({
                        scope: $scope,
                        templateUrl: 'views/setup/modules/editForm.html',
                        animation: '',
                        backdrop: 'static',
                        show: false
                    });
                $scope.icons = ModuleService.getIcons();
                $scope.showAdvancedOptionsEdit = false;
                $scope.editModal.$promise.then($scope.editModal.show);
            };

            $scope.cancelModule = function () {
                angular.forEach($scope.module, function (value, key) {
                    if (angular.isArray($scope.module[key]) || angular.isObject($scope.module[key]))
                        return;

                    $scope.module[key] = $scope.moduleState[key];
                });

                $scope.editModal.hide();
            };

            $scope.hasCalendarDateFields = function () {
                if ($scope.module.name === 'activities')
                    return true;

                var startDateField = $filter('filter')($scope.module.fields, { calendar_date_type: 'start_date' }, true)[0];
                var endDateField = $filter('filter')($scope.module.fields, { calendar_date_type: 'end_date' }, true)[0];

                return startDateField && endDateField;
            };

            var newField = function () {
                var field = {};
                field.label_en = '';
                field.label_tr = '';
                field.validation = {};
                field.validation.required = false;
                field.primary = false;
                field.display_form = true;
                field.display_detail = true;
                field.display_list = true;
                field.inline_edit = true;
                field.editable = true;
                field.show_label = true;
                field.deleted = false;

                var sortOrders = [];

                angular.forEach($scope.module.fields, function (item) {
                    sortOrders.push(item.order);
                });

                field.order = Math.max.apply(null, sortOrders) + 1;
                field.name = 'custom_field' + field.order;
                field.isNew = true;
                field.permissions = [];

                angular.forEach($rootScope.profiles, function (profile) {
                    if (profile.IsPersistent && profile.HasAdminRights)
                        profile.Name = $filter('translate')('Setup.Profiles.Administrator');

                    if (profile.IsPersistent && !profile.HasAdminRights)
                        profile.Name = $filter('translate')('Setup.Profiles.Standard');

                    field.permissions.push({ profile_id: profile.Id, profile_name: profile.Name, type: 'full', profile_is_admin: profile.HasAdminRights });
                });

                return field;
            };

            $scope.showFieldModal = function (row, column, field) {
                $scope.currentRow = row;
                $scope.currentColumn = column;
                $scope.showPermissionWarning = false;

                if (!field) {
                    field = newField();
                }
                else {
                    if (field.data_type === 'lookup')
                        field.lookupType = $filter('filter')($scope.lookupTypes, { value: field.lookup_type }, true)[0];

                    $scope.currentFieldState = angular.copy(field);

                    if (field.default_value && field.data_type === 'lookup') {
                        var lookupId = parseInt(field.default_value);

                        ModuleService.getRecord(field.lookup_type, lookupId, true)
                            .then(function (response) {
                                var lookupObject = {};
                                lookupObject.id = response.data.id;
                                lookupObject.primary_value = response.data[field.lookupModulePrimaryField.name];
                                field.temporary_default_value = lookupObject;
                            });
                    }

                    if (field.data_type === 'picklist' || field.data_type === 'multiselect') {
                        ModuleSetupService.getPicklist(field.picklist_id)
                            .then(function (response) {
                                $scope.defaulPicklistValues = response.data.items;
                                if (field.default_value) {
                                    if (field.data_type === 'picklist') {
                                        field.default_value = parseInt(field.default_value);
                                        field.default_value = $filter('filter')($scope.defaulPicklistValues, { id: parseInt(field.default_value) }, true)[0];
                                    }
                                    else if (field.data_type === 'multiselect') {
                                        var picklistIds = field.default_value.split(';');
                                        var values = [];

                                        angular.forEach(picklistIds, function (picklistId) {
                                            var picklistRecord = $filter('filter')($scope.defaulPicklistValues, { id: parseInt(picklistId) }, true)[0];
                                            picklistRecord.labelStr = picklistRecord['label_' + $rootScope.user.tenantLanguage];
                                            values.push(picklistRecord);
                                        });

                                        $scope.currentField.defaultValueMultiselect = values;
                                    }
                                }
                            });
                    }

                    if (field.data_type === 'checkbox') {
                        if (field.default_value === 'true')
                            field.default_value = true;
                        else
                            field.default_value = false;
                    }
                }

                $scope.currentField = field;
                $scope.currentFieldState = angular.copy(field);
                $scope.showAdvancedOptions = false;
                $scope.currentField.dataType = $filter('filter')($scope.dataTypes, { name: $scope.currentField.data_type }, true)[0];
                $scope.setMultilineDataType();

                $scope.fieldModal = $scope.fieldModal || $modal({
                        scope: $scope,
                        templateUrl: 'views/setup/modules/fieldForm.html',
                        animation: '',
                        backdrop: 'static',
                        show: false
                    });
                $scope.fieldModal.$promise.then(function () {
                    $scope.fieldModal.show();
                });
            };

            $scope.dataTypeChanged = function () {
                if (!$scope.currentField.dataType)
                    return;

                if ($scope.currentField.isNew) {
                    var label = $scope.currentField['label_' + $rootScope.language];
                    var dataType = $scope.currentField.dataType;
                    var required = $scope.currentField.validation.required;

                    $scope.currentField = newField();
                    $scope.currentField['label_' + $rootScope.language] = label;

                    if (dataType)
                        $scope.currentField.dataType = dataType;

                    if (required)
                        $scope.currentField.validation.required = required;

                    $scope.showAdvancedOptions = false;

                    switch (dataType.name) {
                        case 'text_single':
                            $scope.currentField.validation.max_length = 400;
                        case 'picklist':
                        case 'multiselect':
                            $scope.currentField.picklist_sortorder = 'order';
                            break;
                        case 'rating':
                            $scope.currentField.validation.min_length = 5;
                            break;
                    }
                }
            };

            $scope.requiredChanged = function () {
                if ($scope.currentField.validation.required) {
                    $scope.currentField.display_form = true;

                    angular.forEach($scope.currentField.permissions, function (permission) {
                        permission.type = 'full';
                    });
                }
                else {
                    $scope.currentField.permissions = $scope.currentFieldState.permissions;
                }

                $scope.showPermissionWarning = !$scope.currentFieldState.validation.required && $scope.currentField.validation.required;
            };

            $scope.lookupTypeChanged = function (asd) {
                $scope.asd = asd;
                if (!$scope.currentField.lookupType)
                    return;

                var lookupModule = $filter('filter')($rootScope.modules, { name: $scope.currentField.lookupType.value }, true)[0];
                var lookupModulePrimaryField = $filter('filter')(lookupModule.fields, { primary: true }, true)[0];

                if (lookupModulePrimaryField.data_type != 'text_single' && lookupModulePrimaryField.data_type != 'picklist' && lookupModulePrimaryField.data_type != 'email' &&
                    lookupModulePrimaryField.data_type != 'number' && lookupModulePrimaryField.data_type != 'number_auto') {
                    ngToast.create({ content: $filter('translate')('Setup.Modules.NotApplicablePrimaryField'), className: 'warning' });
                    $scope.currentField.lookupType = null;
                }


            };

            $scope.calendarDateTypeChanged = function () {
                if ($scope.currentField.calendar_date_type) {
                    if (!$scope.currentField.validation)
                        $scope.currentField.validation = {};

                    $scope.currentField.validation.required = true;
                }
                else {
                    $scope.currentField.validation.required = $scope.currentFieldState.validation.required;
                }
            };

            $scope.setMultilineDataType = function () {
                if (!$scope.currentField.dataType || $scope.currentField.dataType.name != 'text_multi')
                    return;

                if ($scope.currentField.multiline_type && $scope.currentField.multiline_type === 'large') {
                    $scope.currentField.dataType.maxLength = 5;
                    $scope.currentField.dataType.max = 32000;
                    $scope.multiLineShowHtml = true;
                }
                else {
                    $scope.currentField.dataType.maxLength = 4;
                    $scope.currentField.dataType.max = 2000;
                    $scope.multiLineShowHtml = false;
                }
            };

            // $scope.validateInlineEdit = function () {
            //     if ($scope.currentField.multiline_type_use_html === true) {
            //         $scope.currentField.inline_edit = false;
            //     }
            // }

            $scope.bindPicklistDragDrop = function () {
                $timeout(function () {
                    if ($scope.drakePicklist) {
                        $scope.drakePicklist.destroy();
                        $scope.drakePicklist = null;
                    }

                    var picklistContainer = document.querySelector('#picklistContainer');
                    var picklistOptionContainer = document.querySelector('#picklistOptionContainer');
                    var rightTopBar = document.getElementById('rightTopBar');
                    var rightBottomBar = document.getElementById('rightBottomBar');
                    var timer;

                    $scope.drakePicklist = dragularService([picklistContainer], {
                        scope: $scope,
                        containersModel: [$scope.picklistModel.items],
                        classes: {
                            mirror: 'gu-mirror-option',
                            transit: 'gu-transit-option'
                        },
                        lockY: true,
                        moves: function (el, container, handle) {
                            return handle.classList.contains('option-handle');
                        }
                    });

                    angular.element(picklistContainer).on('dragulardrop', function () {
                        var picklistSortOrder = $filter('filter')($scope.sortOrderTypes, { value: 'order' }, true)[0];
                        $scope.currentField.picklist_sortorder = picklistSortOrder;
                    });

                    registerEvents(rightTopBar, picklistOptionContainer, -5);
                    registerEvents(rightBottomBar, picklistOptionContainer, 5);

                    function registerEvents(bar, container, inc, speed) {
                        if (!speed) {
                            speed = 10;
                        }

                        angular.element(bar).on('dragularenter', function () {
                            container.scrollTop += inc;

                            timer = $interval(function moveScroll() {
                                container.scrollTop += inc;
                            }, speed);
                        });

                        angular.element(bar).on('dragularleave dragularrelease', function () {
                            $interval.cancel(timer);
                        });
                    }
                }, 100);
            };

            var combinationDataTypes = [
                'text_single',
                'number',
                'number_decimal',
                'number_auto',
                'currency',
                'date',
                'date_time',
                'time',
                'email',
                'picklist'
            ];

            $scope.filterToCombinations = function (field) {
                return !field.systemRequired && !field.systemReadonly && combinationDataTypes.indexOf(field.data_type) > -1 && !field.deleted;
            };

            $scope.filterToUniqueCombinations = function (field) {
                if (!field.systemReadonly && field.data_type != 'combination' && field.data_type != 'number_auto' && field.data_type != 'text_multi' && field.data_type != 'checkbox')
                    return true;

                return false;
            };

            $scope.showSectionModal = function (section) {
                if (!section) {
                    section = {};
                    section.column_count = 2;
                    section.label_en = '';
                    section.label_tr = '';
                    section.display_form = true;
                    section.display_detail = true;
                    section.deleted = false;
                    $scope.showPermissionWarning = false;
                    section.permissions = [];
                    angular.forEach($rootScope.profiles, function (profile) {
                        if (profile.IsPersistent && profile.HasAdminRights)
                            profile.Name = $filter('translate')('Setup.Profiles.Administrator');

                        if (profile.IsPersistent && !profile.HasAdminRights)
                            profile.Name = $filter('translate')('Setup.Profiles.Standard');

                        section.permissions.push({ profile_id: profile.Id, profile_name: profile.Name, type: 'full', profile_is_admin: profile.HasAdminRights });
                    });
                    var sortOrders = [];

                    angular.forEach($scope.module.sections, function (item) {
                        sortOrders.push(item.order);
                    });

                    section.order = Math.max.apply(null, sortOrders) + 1;
                    section.name = 'custom_section' + section.order;
                    section.columns = [];

                    for (var i = 1; i <= section.column_count; i++) {
                        var column = {};
                        column.no = i;

                        section.columns.push(column);
                    }

                    section.isNew = true;
                }
                else {
                    $scope.currentSectionState = angular.copy(section);
                }

                $scope.currentSection = section;
                $scope.currentSectionState = angular.copy(section);

                $scope.sectionModal = $scope.sectionModal || $modal({
                        scope: $scope,
                        templateUrl: 'views/setup/modules/sectionForm.html',
                        animation: '',
                        backdrop: 'static',
                        show: false
                    });

                $scope.sectionModal.$promise.then($scope.sectionModal.show);
            };

            $scope.saveSettings = function (editForm) {
                if (!editForm.$valid)
                    return;

                $scope.moduleLabelNotChanged = false;

                if ($scope.module.calendar_color_dark)
                    $scope.module.calendar_color_light = $filter('filter')($scope.calendarColors, { dark: $scope.module.calendar_color_dark }, true)[0].light;

                if (!$scope.isModuleSaving)
                    $scope.editModal.hide();
                else
                    $scope.saveModule();
            };


            $scope.saveField = function (fieldForm) {
                if (!fieldForm.$valid) {
                    $timeout(function () {
                        var scroller = document.getElementById('field-form-body');
                        scroller.scrollTop = scroller.scrollHeight;
                    }, 0, false);

                    return;
                }
                if ($scope.currentField.dataType.name === 'lookup' && !$scope.currentField.id) {
                    var lookupcount = $filter('filter')($scope.module.fields, {
                        data_type: 'lookup',
                        deleted: false
                    }, true);
                    if (lookupcount.length > 9) {
                        ngToast.create({
                            content: $filter('translate')('Setup.Modules.MaxLookupCount'),
                            className: 'warning'
                        });
                        return;
                    }
                }


                $scope.showAdvancedOptions = false;

                if ($scope.currentField.lookupType) {
                    if ($scope.currentField.show_as_dropdown) {
                        // $scope.currentField.inline_edit = false;
                    }
                    $scope.currentField.lookup_type = $scope.currentField.lookupType.value;
                    delete $scope.currentField.lookupType;
                    delete $scope.currentField.temporary_default_value;
                }

                if ($scope.currentField.dataType.name === 'checkbox' && !$scope.currentField.default_value)
                    $scope.currentField.default_value = false;

                if ($scope.currentField.dataType.name === 'picklist' && $scope.currentField.default_value && $scope.currentField.default_value.id)
                    $scope.currentField.default_value = $scope.currentField.default_value.id;

                //model settings for tags-input dataType
                if ($scope.currentField.defaultValueMultiselect) {
                    $scope.currentField.default_value = '';
                    angular.forEach($scope.currentField.defaultValueMultiselect, function (item) {
                        $scope.currentField.default_value += (item.id) + ';';
                    });
                    $scope.currentField.default_value = $scope.currentField.default_value.slice(0, -1);
                }

                if ($scope.currentField.isNew) {
                    delete $scope.currentField.isNew;

                    var otherLanguage = $rootScope.language === 'en' ? 'tr' : 'en';
                    var field = angular.copy($scope.currentField);
                    field.data_type = field.dataType.name;
                    field.section = $scope.currentRow.section.name;
                    field.section_column = $scope.currentColumn.column.no;
                    field['label_' + otherLanguage] = field['label_' + $rootScope.language];
                    field.validation.readonly = false;

                    $scope.module.fields.push(field);
                    $scope.moduleLayout = ModuleSetupService.getModuleLayout($scope.module);
                    $scope.fieldModal.hide();
                    $scope.moduleChange = new Date();
                }
                else {
                    $scope.fieldModal.hide();
                }

                if ($scope.currentField.dataType.name === 'lookup' && $scope.currentField.default_value)
                    $scope.currentField.default_value = $scope.currentField.default_value.id;

                if ($scope.currentField.calendar_date_type) {
                    for (var i = 0; i < module.fields.length; i++) {
                        var moduleField = module.fields[i];

                        if (moduleField.calendar_date_type && moduleField.calendar_date_type === $scope.currentField.calendar_date_type)
                            moduleField.calendar_date_type = null;
                    }
                }

            };

            $scope.saveSection = function (sectionForm) {
                if (!sectionForm.$valid)
                    return;

                if ($scope.currentSection.isNew) {
                    delete $scope.currentSection.isNew;

                    var otherLanguage = $rootScope.language === 'en' ? 'tr' : 'en';
                    var section = angular.copy($scope.currentSection);
                    section['label_' + otherLanguage] = section['label_' + $rootScope.language];

                    $scope.module.sections.push(section);
                    $scope.moduleLayout = ModuleSetupService.getModuleLayout($scope.module);
                    $scope.sectionModal.hide();
                    $scope.moduleChange = new Date();
                }
                else {
                    $scope.sectionModal.hide();
                }
            };

            $scope.deleteField = function (fieldName) {
                var field = $filter('filter')($scope.module.fields, { name: fieldName }, true)[0];

                if (field.name.indexOf('custom_field') > -1) {
                    var fieldIndex = helper.arrayObjectIndexOf($scope.module.fields, field);
                    $scope.module.fields.splice(fieldIndex, 1);
                }
                else {
                    field.deleted = true;
                    field.order = 999;

                    var deletedField = {
                        name: field.name,
                        id: field.id
                    };

                    $scope.currentDeletedFields.push(deletedField);
                }

                $scope.moduleLayout = ModuleSetupService.getModuleLayout($scope.module);
                $scope.moduleChange = new Date();
            };

            $scope.deleteSection = function (sectionName) {
                var section = $filter('filter')($scope.module.sections, { name: sectionName }, true)[0];
                var sectionFields = $filter('filter')($scope.module.fields, { section: section.name }, true);

                if (section.name.indexOf('custom_section') > -1) {
                    var sectionIndex = helper.arrayObjectIndexOf($scope.module.sections, section);
                    $scope.module.sections.splice(sectionIndex, 1);

                    angular.forEach(sectionFields, function (field) {
                        if (field.name.indexOf('custom_field') > -1) {
                            var fieldIndex = helper.arrayObjectIndexOf($scope.module.fields, field);
                            $scope.module.fields.splice(fieldIndex, 1);
                        }
                        else {
                            field.deleted = true;
                        }
                    });
                }
                else {
                    section.deleted = true;

                    angular.forEach(sectionFields, function (field) {
                        field.deleted = true;
                    });
                }

                $scope.moduleLayout = ModuleSetupService.getModuleLayout($scope.module);
                $scope.moduleChange = new Date();
            };

            $scope.changeSectionColumn = function (section) {
                $scope.moduleLayout = ModuleSetupService.getModuleLayout($scope.module);
                $scope.moduleChange = new Date();
            };

            $scope.cancelField = function () {
                if ($scope.currentField.isNew) {
                    if ($scope.picklistsModule)
                        delete $scope.picklistsModule[$scope.currentField.name];

                    $scope.currentField = null;
                    $scope.fieldModal.hide();
                    return;
                }

                angular.forEach($scope.currentField, function (value, key) {
                    $scope.currentField[key] = $scope.currentFieldState[key];
                });

                $scope.fieldModal.hide();
            };

            $scope.cancelSection = function () {
                angular.forEach($scope.currentSection, function (value, key) {
                    $scope.currentSection[key] = $scope.currentSectionState[key];
                });

                $scope.sectionModal.hide();
            };

            $scope.getPicklistById = function (id) {
                ModuleSetupService.getPicklist(id)
                    .then(function (response) {
                        $scope.defaulPicklistValues = response.data.items;
                    });
            };

            $scope.fieldValueChange = function (field) {
                ModuleService.setDependency(field, $scope.module, $scope.record, $scope.picklistsModule);
                ModuleService.setDisplayDependency($scope.module, $scope.record);

                if ($scope.record.currency)
                    $scope.currencySymbol = $scope.record.currency.value || $rootScope.currencySymbol;
            };


            ModuleService.getPicklists($scope.module)
                .then(function (picklists) {
                    $scope.picklistsModule = picklists;
                });

            //multiselect default value
            $scope.multiselect = function (searchTerm, field) {
                var picklistItems = [];

                angular.forEach($scope.picklistsModule[field.picklist_id], function (picklistItem) {
                    if (picklistItem.inactive || picklistItem.hidden)
                        return;

                    if (picklistItem.labelStr.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 || picklistItem.labelStr.toUpperCase().indexOf(searchTerm.toUpperCase()) > -1
                        || picklistItem.labelStr.toLowerCaseTurkish().indexOf(searchTerm.toLowerCaseTurkish()) > -1 || picklistItem.labelStr.toUpperCaseTurkish().indexOf(searchTerm.toUpperCaseTurkish()) > -1)
                        picklistItems.push(picklistItem);
                });
                return picklistItems;
            };

            $scope.newPicklist = function () {
                $scope.picklistModel = {};
                $scope.showPicklistForm = true;
            };

            $scope.editPicklist = function () {
                ModuleSetupService.getPicklist($scope.currentField.picklist_id)
                    .then(function onSuccess(picklist) {
                        $scope.picklistModel = ModuleSetupService.processPicklist(picklist.data);
                        $scope.showPicklistForm = true;
                        $scope.bindPicklistDragDrop();
                    });
            };

            $scope.newOption = function (picklistForm) {
                picklistForm.$submitted = false;
                picklistForm.$setValidity('minimum', true);

                if (!$scope.picklistModel.items)
                    $scope.picklistModel.items = [];

                var picklistItem = {};
                picklistItem.label = '';

                var sortOrders = [];

                angular.forEach($scope.picklistModel.items, function (item) {
                    sortOrders.push(item.order);
                });

                if ($scope.picklistModel.items.length > 0)
                    picklistItem.order = Math.max.apply(null, sortOrders) + 1;
                else
                    picklistItem.order = 1;

                picklistItem.track = picklistItem.order;
                $scope.picklistModel.items.push(picklistItem);

                $scope.bindPicklistDragDrop();
            };

            $scope.deleteOption = function (picklistItem) {
                $scope.picklistModel.items.splice($scope.picklistModel.items.indexOf(picklistItem), 1);
            };

            $scope.savePicklist = function (picklistForm) {
                if (!picklistForm.$valid)
                    return;

                var existingPicklist = null;

                if ($rootScope.language === 'tr')
                    existingPicklist = $filter('filter')($scope.picklists, { label_tr: $scope.picklistModel.label }, true)[0];
                else
                    existingPicklist = $filter('filter')($scope.picklists, { label_en: $scope.picklistModel.label }, true)[0];

                if (!$scope.picklistModel.id && existingPicklist) {
                    picklistForm.$setValidity('unique', false);
                    return;
                }

                if ($scope.picklistModel.id && existingPicklist && existingPicklist.id != $scope.picklistModel.id) {
                    picklistForm.$setValidity('unique', false);
                    return;
                }

                if (!$scope.picklistModel.items || $scope.picklistModel.items.length < 2) {
                    picklistForm.$setValidity('minimum', false);
                    return;
                }

                if (!picklistForm.$valid)
                    return;

                for (var i = 0; i < $scope.picklistModel.items.length; i++) {
                    var picklistItem = $scope.picklistModel.items[i];
                    picklistItem.order = i + 1;
                }

                $scope.picklistSaving = true;
                ModuleSetupService.preparePicklist($scope.picklistModel);

                if (!$scope.picklistModel.id) {
                    ModuleSetupService.createPicklist($scope.picklistModel)
                        .then(function onSuccess(response) {
                            if (!response.data.id) {
                                ngToast.create({ content: $filter('translate')('Common.NotFound'), className: 'warning' });
                                $scope.picklistSaving = false;
                                return;
                            }

                            ModuleSetupService.getPicklists()
                                .then(function (picklists) {
                                    if (picklists.data) {
                                        $scope.picklists = picklists.data;
                                        $scope.currentField.picklist_id = response.data.id;
                                    }
                                    $scope.showPicklistForm = false;
                                })
                                .catch(function onError() {
                                    $scope.picklistSaving = true;
                                });
                        })
                        .catch(function onError() {
                            $scope.picklistSaving = true;
                        });
                }
                else {
                    ModuleSetupService.updatePicklist($scope.picklistModel)
                        .then(function onSuccess() {
                            ModuleSetupService.getPicklists()
                                .then(function onSuccess(picklists) {
                                    $scope.picklists = picklists.data;
                                    $scope.showPicklistForm = false;
                                    $cache.remove('picklist_' + $scope.picklistModel.id);
                                })
                                .catch(function onError() {
                                    $scope.picklistSaving = true;
                                });
                        })
                        .catch(function onError() {
                            $scope.picklistSaving = true;
                        });
                }
            };
            $scope.openLocationModal = function (filedName) {
                $scope.filedName = filedName;
                $scope.locationModal = $scope.frameModal || $modal({
                        scope: $scope,
                        controller: 'locationFormModalController',
                        templateUrl: 'views/app/location/locationFormModal.html',
                        backdrop: 'static',
                        show: false
                    });
                $scope.locationModal.$promise.then($scope.locationModal.show);
            };

            $scope.makePrimary = function (field) {
                field.primary = true;
                field.validation.required = true;

                angular.forEach($scope.module.fields, function (fieldItem) {
                    fieldItem.primary = fieldItem.name === field.name;
                });

                $scope.moduleLayout = ModuleSetupService.getModuleLayout($scope.module);
                $scope.moduleChange = new Date();
            };

            $scope.makePrimaryLookup = function (field) {
                field.primary_lookup = true;
                field.validation.required = true;

                angular.forEach($scope.module.fields, function (fieldItem) {
                    fieldItem.primary_lookup = fieldItem.name === field.name;
                });

                $scope.moduleLayout = ModuleSetupService.getModuleLayout($scope.module);
                $scope.moduleChange = new Date();
            };

            var checkRequiredFields = function () {
                $scope.notValidFields = [];
                var allowedFields = ['created_by', 'created_at', 'updated_by', 'updated_at', 'owner'];

                angular.forEach($scope.module.fields, function (field) {
                    var section = $filter('filter')($scope.module.sections, { name: field.section }, true)[0];

                    if (!section.display_form && field.validation.required && allowedFields.indexOf(field.name) < 0)
                        $scope.notValidFields.push(field);
                });

                if ($scope.notValidFields.length) {
                    $scope.fieldErrorModal = $scope.fieldErrorModal || $modal({
                            scope: $scope,
                            templateUrl: 'views/setup/modules/warningRequiredFieldDisplay.html',
                            animation: '',
                            backdrop: 'static',
                            show: false
                        });

                    $scope.fieldErrorModal.$promise.then($scope.fieldErrorModal.show);

                    return false;
                }

                return true;
            };

            var updateView = function (views, cacheKey) {
                angular.forEach(views, function (view, key) {
                    angular.forEach(view.fields, function (_field, key) {
                        if (_field.field.split(".")[1] == $scope.module.name) {
                            var primaryField = $filter('filter')($scope.module.fields, { primary: true }, true)[0];
                            _field.field = _field.field.replace(_field.field.split(".")[2], primaryField.name);
                            ModuleService.updateView(view, view.id, undefined);
                        }
                    });
                });
                if (cacheKey)
                    $cache.remove(cacheKey + "_" + cacheKey);
            };
            var currenyPK = $filter('filter')($scope.module.fields, { primary: true }, true)[0];
            $scope.saveModule = function () {
                if (!checkRequiredFields())
                    return;

                if (!$scope.isModuleSaving)
                    return;

                if ((!$scope.id || $scope.clone) && $scope.moduleLabelNotChanged) {
                    $scope.showEditModal(true);
                    return;
                }
                //When update modelu primary key also change view lookup view.
                var newPK = $filter('filter')($scope.module.fields, { primary: true }, true)[0];
                if (currenyPK.name !== newPK.name) {
                    for (var moduleKey = $rootScope.modules.length - 1; moduleKey >= 0; moduleKey--) {
                        for (var fieldKey = $rootScope.modules[moduleKey].fields.length - 1; fieldKey >= 0; fieldKey--) {
                            if ($rootScope.modules[moduleKey].fields[fieldKey].lookup_type == $scope.module.name) {
                                var cacheKey = $rootScope.modules[moduleKey].name;
                                var cache = $cache.get(cacheKey + "_" + cacheKey);
                                if (!cache) {
                                    ModuleService.getViews($rootScope.modules[moduleKey].id, undefined, undefined)
                                        .then(function (views) {
                                            updateView(views);

                                        });
                                } else {
                                    updateView(cache.views, cacheKey);
                                }
                            }
                        }
                    }
                }

                $scope.saving = true;
                var deletedFields = $filter('filter')($scope.module.fields, { deleted: true }, true);
                ModuleSetupService.refreshModule($scope.moduleLayout, $scope.module);

                if (deletedFields.length)
                    $scope.module.fields = $scope.module.fields.concat(deletedFields);

                var moduleModel = ModuleSetupService.prepareModule(angular.copy($scope.module), $scope.picklistsModule, $scope.deletedModules);
                var resultPromise;

                if (!$scope.id || $scope.clone) {
                    resultPromise = ModuleService.create(moduleModel);
                }
                else {
                    delete moduleModel.relations;
                    delete moduleModel.dependencies;

                    resultPromise = ModuleService.update(moduleModel, moduleModel.id);
                }

                resultPromise
                    .then(function onSuccess() {
                        AppService.getMyAccount(true)
                            .then(function () {
                                var moduleKey = $scope.module.name + "_" + $scope.module.name;
                                $cache.remove(moduleKey);

                                //When delete a fields. Also delete their mappings and view filters
                                if ($scope.currentDeletedFields.length) {
                                    var deletedFieldsIds = [];

                                    $scope.currentDeletedFields.forEach(function (deletedField) {
                                        deletedFieldsIds.push(deletedField.id);

                                        if ($rootScope.activeFilters && $rootScope.activeFilters.hasOwnProperty(moduleKey) &&
                                            $rootScope.activeFilters[moduleKey].hasOwnProperty(deletedField.name)) {

                                            if (Object.keys($rootScope.activeFilters[moduleKey]).length > 1)
                                                delete $rootScope.activeFilters[moduleKey][deletedField.name];
                                            else
                                                delete $rootScope.activeFilters[moduleKey];
                                        }

                                    });

                                    ModuleSetupService.deleteFieldsMappings(deletedFieldsIds);
                                }

                                if ($scope.editModal)
                                    $scope.editModal.hide();

                                if (!$scope.redirect)
                                    $state.go('app.setup.modules');
                                else
                                    $state.go('app.crm.moduleForm', { type: $scope.module.name });

                                ngToast.create({
                                    content: $filter('translate')('Setup.Modules.SaveSuccess'),
                                    className: 'success'
                                });

                                if (!$scope.id || $scope.clone)
                                    getLookupTypes(true);

                                $cache.remove('calendar_events');
                            });
                    })
                    .catch(function onError(data, status) {
                        if (!$scope.id) {
                            $scope.saving = false;

                            if ($scope.editModal)
                                $scope.editModal.hide();
                        }
                        else {
                            AppService.getMyAccount(true)
                                .then(function () {
                                    if ($scope.editModal)
                                        $scope.editModal.hide();

                                    $state.go('app.setup.modules');
                                });
                        }
                    });
            }
        }
    ]);