'use strict';

angular.module('primeapps')

    .controller('ComponentDetailController', ['$rootScope', '$scope', '$filter', '$state', '$stateParams', '$modal', '$timeout', 'helper', 'dragularService', 'ComponentsService', 'componentPlaces', 'componentPlaceEnums', 'componentTypes', 'componentTypeEnums', '$localStorage',
        function ($rootScope, $scope, $filter, $state, $stateParams, $modal, $timeout, helper, dragularService, ComponentsService, componentPlaces, componentPlaceEnums, componentTypes, componentTypeEnums, $localStorage) {
            $scope.modules = [];
            $scope.id = $state.params.id;
            $scope.orgId = $state.params.orgId;

            $scope.$parent.menuTopTitle = $scope.currentApp.label;
            $scope.$parent.activeMenu = 'app';
            $scope.$parent.activeMenuItem = 'components';

            $scope.currentApp = $localStorage.get("current_app");

            /*if (!$scope.orgId || !$scope.appId) {
             $state.go('studio.apps', { organizationId: $scope.orgId });
             }*/

            $scope.componentPlaces = componentPlaces;
            $scope.componentTypes = componentTypes;
            $scope.loading = true;
            //var currentOrganization = $localStorage.get("currentApp");
            $scope.organization = $filter('filter')($rootScope.organizations, {id: $scope.orgId})[0];
            //$scope.giteaUrl = giteaUrl;

            /*$scope.aceOption = {
             mode: 'javascript',
             theme: 'tomorrow_night',
             onLoad: function (_ace) {
             // HACK to have the ace instance in the scope...
             $scope.modeChanged = function () {
             _ace.getSession().setMode("ace/mode/javascript");
             };
             }
             };*/

            if (!$scope.id) {
                $state.go('studio.app.components');
            }

            ComponentsService.get($scope.id)
                .then(function (response) {
                    if (!response.data) {
                        toastr.error('Component Not Found !');
                        $state.go('studio.app.components');
                    }

                    $scope.componentCopy = angular.copy(response.data);
                    $scope.component = response.data;
                    $scope.componentTypeName = $scope.component.type;
                    $scope.component.place = componentPlaceEnums[$scope.component.place];
                    $scope.component.type = componentTypeEnums[$scope.component.type];
                    $scope.loading = false;
                });

            $scope.closeModal = function () {
                $scope.component = angular.copy($scope.componentCopy);
                $scope.createFormModal.hide();
            };

            var openModal = function () {
                $scope.createFormModal = $scope.createFormModal || $modal({
                    scope: $scope,
                    templateUrl: 'view/app/components/componentFormModal.html',
                    animation: 'am-fade-and-slide-right',
                    backdrop: 'static',
                    show: false
                });
                $scope.createFormModal.$promise.then(function () {
                    $scope.createFormModal.show();
                });
            };

            $scope.edit = function () {
                //$scope.modalLoading = true;
                $scope.editing = true;

                openModal();
                if ($scope.modules.length === 0) {
                    ComponentsService.getAllModulesBasic()
                        .then(function (response) {
                            $scope.modules = response.data;
                            //$scope.modalLoading = false;
                        })
                }
                else {
                    //$scope.modalLoading = false;
                }
            };

            $scope.save = function (componentFormValidation) {
                if (!componentFormValidation.$valid){
                    toastr.error($filter('translate')('Module.RequiredError'));
                    return;
                }
                    

                $scope.saving = true;

                if ($scope.component.type === 2) {
                    $scope.component.place = 0;
                    $scope.component.order = 0;
                }

                ComponentsService.update($scope.component)
                    .then(function (response) {
                        $scope.saving = false;
                        $scope.createFormModal.hide();
                        $scope.editing = false;
                        $scope.componentCopy = angular.copy($scope.component);
                    })
            }
        }
    ]);