'use strict';

angular.module('primeapps')

    .controller('ManageController', ['$rootScope', '$scope', '$filter', '$location', 'helper', 'ManageService', 'ModuleService',
        function ($rootScope, $scope, $filter, $location, helper, ManageService, ModuleService) {

            $scope.orgModel = {};
            $scope.icons = ModuleService.getIcons(2);

            $rootScope.breadcrumblist[1].link = "";
            $rootScope.breadcrumblist[1].title = 'Manage';
            $rootScope.breadcrumblist[2] = {};
            $rootScope.breadcrumblist[3] = {};

            $scope.orgDeleteDisabled = false;

            ManageService.get($scope.$parent.$parent.$parent.currentOrgId).then(function (response) {
                var data = response.data;
                $scope.orgModel.icon = data.icon;
                $scope.orgModel.label = data.label;
                $scope.orgModel.icon = data.icon;
                $scope.orgModel.name = data.name;
                $scope.orgModel.id = data.id;
            });

            $scope.changeIcon = function () {
                $scope.orgModel.icon = $scope.orgModel.icon.value;
            };

            $scope.deleteButtonControl = function () {
                var currentOrg = $filter('filter')($rootScope.organizations, {id: $scope.$parent.$parent.$parent.currentOrgId}, true)[0];
                if (currentOrg.role != 'administrator' || currentOrg.default === true)
                    $scope.orgDeleteDisabled = true;
            };
            $scope.deleteButtonControl();


            $scope.save = function () {
                $scope.saving = true;
                if (angular.isObject($scope.orgModel.icon))
                    $scope.orgModel.icon = $scope.orgModel.icon.value;

                ManageService.update($scope.$parent.$parent.$parent.currentOrgId, $scope.orgModel)
                    .then(function (response) {
                        $rootScope.currentOrganization.label = $scope.orgModel.label;
                        $rootScope.currentOrganization.icon = $scope.orgModel.icon;
                        toastr.success($filter('translate')('Güncelleme Başarılı'));
                        $scope.saving = false;
                    });
            };

            $scope.delete = function (orgId) {
                var willDelete =
                    swal({
                        title: "Are you sure?",
                        text: " ",
                        icon: "warning",
                        buttons: ['Cancel', 'Yes'],
                        dangerMode: true
                    }).then(function (value) {
                        if (value) {
                            ManageService.delete(orgId)
                                .then(function () {
                                    toastr.success("Organization is deleted successfully.", "Deleted!");

                                });
                        }
                    });
            };
        }
    ]);