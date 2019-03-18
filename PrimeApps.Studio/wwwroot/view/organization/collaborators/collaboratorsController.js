'use strict';

angular.module('primeapps')

    .controller('CollaboratorsController', ['$rootScope', '$scope', 'guidEmpty', 'entityTypes', 'helper', 'config', '$http', '$localStorage', 'operations', '$filter', '$cache', 'activityTypes', 'CollaboratorsService', '$window', '$state', '$modal', 'dragularService', '$timeout', '$interval', '$aside',
        function ($rootScope, $scope, guidEmpty, entityTypes, helper, config, $http, $localStorage, operations, $filter, $cache, activityTypes, CollaboratorsService, $window, $state, $modal, dragularService, $timeout, $interval, $aside) {

            if ($rootScope.currentOrganization.role != 'administrator') {
                toastr.warning($filter('translate')('Common.Forbidden'));
                $state.go('studio.allApps');
                return;
            }


            $scope.collaboratorArray = [];
            // $scope.$parent.menuTopTitle = "Organization";
            $scope.$parent.activeMenu = 'organization';
            $scope.$parent.activeMenuItem = 'collaborators';
            // $scope.updatingRole = false;
            $scope.collaboratorModel = {};
            $scope.loading = true;
            $scope.showNewCollaboratorInfo = false;
            $scope.activePage = 1;

            $scope.requestModel = {
                limit: "10",
                offset: 0
            };

            $scope.roles = [
                { name: 'Admin', value: 'administrator' },
                { name: 'Collaborator', value: 'collaborator' }
            ];

            $scope.generator = function (limit) {
                $scope.placeholderArray = [];
                for (var i = 0; i < limit; i++) {
                    $scope.placeholderArray[i] = i;
                }

            };
            $scope.generator(10);

            CollaboratorsService.count($rootScope.currentOrgId).then(function (response) {
                $scope.$parent.collaboratorCount = response.data;
                $scope.pageTotal = response.data;
            });

            CollaboratorsService.find($scope.requestModel, $rootScope.currentOrgId).then(function (response) {
                $scope.collaboratorArray = response.data;
                $scope.loading = false;
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

                CollaboratorsService.find(requestModel, $rootScope.currentOrgId).then(function (response) {
                    $scope.collaboratorArray = response.data;
                    // $scope.collaboratorArray = response.data;
                    $scope.loading = false;
                });

            };

            $scope.changeOffset = function () {
                $scope.changePage($scope.activePage);
            };
            $scope.getCollaborators = function () {
                var filter = {};
                filter.organization_id = $rootScope.currentOrgId;
                filter.page = 1;
                filter.order_by = null;
                filter.order_field = null;

                CollaboratorsService.get(filter)
                    .then(function (response) {
                        if (response.data) {
                            $scope.collaboratorArray = response.data;
                            // $scope.$parent.collaboratorArray = response.data;
                        }
                    })
                    .catch(function (error) {
                        getToastMsg('Common.Error', 'danger');
                    });
            }

            //$scope.getCollaborators();

            $scope.selectCollaborators = function (id) {
                if (!id)
                    return false;

                var result = $filter('filter')($scope.collaboratorArray, { id: id }, true)[0];
                $scope.collaboratorModel.role = $filter('filter')($scope.roles, { value: $scope.selectedCollaborator.role }, true)[0];
                //$scope.$parent.activeMenu = "collaborator";
                //$scope.$parent.activeMenuItem = 'collaborator';
            }

            //$scope.selectCollaborators = function (id) {
            //    if (!id)
            //        return false;

            //    var result = $filter('filter')($scope.collaboratorArray, { id: id }, true)[0];
            //    $scope.collaboratorId = id;
            //    //$scope.$parent.collaboratorId = id;
            //    $scope.selectedCollaborator = angular.copy(result);
            //   // $scope.$parent.selectedCollaborator = angular.copy(result);
            //    $scope.collaboratorModel.role = $filter('filter')($scope.roles, { value: $scope.selectedCollaborator.role }, true)[0];
            //}



            $scope.addNewCollaborator = function () {
                $scope.addNewCollaboratorModal = $scope.addNewCollaboratorModal || $modal({
                    scope: $scope,
                    templateUrl: 'view/organization/collaborators/addNewCollaborator.html',
                    animation: 'am-fade-and-slide-right',
                    backdrop: 'static',
                    show: false
                });
                $scope.addNewCollaboratorModal.$promise.then(function () {
                    $scope.addNewCollaboratorModal.show();

                });

            };

            $scope.save = function (newCollaboratorForm) {
                if (!newCollaboratorForm.$valid)
                    return false;

                var result = $filter('filter')($scope.collaboratorArray, { email: $scope.collaboratorModel.email }, true)[0];

                if (result)
                    return false;

                $scope.submitting = true;

                var newCol = {};
                newCol.organization_id = $rootScope.currentOrgId;
                newCol.role = $scope.collaboratorModel.role.value;
                newCol.email = $scope.collaboratorModel.email;
                newCol.first_name = $scope.collaboratorModel.first_name;
                newCol.last_name = $scope.collaboratorModel.last_name;
                newCol.created_at = new Date();

                CollaboratorsService.save(newCol)
                    .then(function (response) {
                        if (response.data) {
                            toastr.success('Collaborator is saved successfully');
                            $scope.sendCollaboratorEmail = $scope.collaboratorModel.email;
                            $scope.collaboratorModel.email = "";
                            $scope.submitting = false;
                            $scope.userPassword = response.data.password;
                            $scope.showNewCollaboratorInfo = true;
                            $scope.changePage(1);
                        }
                    })
                    .catch(function () {
                        toastr.error($filter('translate')('Common.Error'));
                        $scope.submitting = false;
                    });

            }

            $scope.close = function () {
                $scope.getCollaborators();
                $state.reload();
                $scope.addNewCollaboratorModal.hide();
                //Modal kapanırken inputun kırmızı olmasına sebep oluyordu.
                // $scope.showNewCollaboratorInfo = false;
            }

            $scope.update = function (collaborator) {
                collaborator.updating = true;

                if (!collaborator) {
                    collaborator.updating = false;
                    return false;
                }
                //var updCollaborator = {};
                //updCollaborator.id = collaboratorModel.id;
                //updCollaborator.organization_id = collaboratorModel.organization_id;
                //updCollaborator.email = collaboratorModel.email;
                //updCollaborator.role = collaboratorModel.role.value;
                CollaboratorsService.update(collaborator)
                    .then(function (response) {
                        if (response.data) {
                            toastr.success('Role is changed successfully');
                            $scope.getCollaborators();
                            collaborator.updating = false;
                        }
                    })
                    .catch(function (error) {
                        toastr.error($filter('translate')('Common.Error'));
                        collaborator.updating = false;
                    });
            }

            $scope.delete = function (collaborator) { 
                if (!collaborator) 
                    return false;
                
                swal({
                    title: "Are you sure?",
                    text: " ",
                    icon: "warning",
                    buttons: ['Cancel', 'Yes'],
                    dangerMode: true
                }).then(function (value) { 
                    if (value) {
                        collaborator.deleting = true; 
                        var result = $filter('filter')($scope.collaboratorArray, { id: collaborator.id }, true)[0];

                        if (!result) {
                            collaborator.deleting = false;
                            return false;
                        }

                        var data = {};
                        data.user_id = collaborator.id;
                        data.organization_id = $rootScope.currentOrgId;
                        data.role = result.role;

                        CollaboratorsService.delete(data)
                            .then(function (response) {
                                if (response.data) {
                                    toastr.success('Collaborator is deleted successfully');

                                    collaborator.deleting = false;
                                    $scope.getCollaborators();
                                    $state.reload();
                                }
                            })
                            .catch(function (error) {
                                toastr.error($filter('translate')('Common.Error'));
                                collaborator.deleting = false;
                            });
                    }
                    else {
                        collaborator.deleting = false;
                    }
                });
            };

            $scope.sendEmail = function () {
                if ($scope.sendCollaboratorEmail) {
                    $scope.savingEmailPassword = true;
                    var sendEmailData = {};
                    sendEmailData.email = $scope.sendCollaboratorEmail;
                    sendEmailData.app_id = 2;
                    sendEmailData.culture = "en";
                    sendEmailData.first_name = $scope.collaboratorModel.first_name;
                    sendEmailData.password = $scope.userPassword;
                    CollaboratorsService.sendEmail(sendEmailData)
                        .then(function (response) {
                            $scope.savingEmailPassword = false;
                            toastr.success("Email sent successfullyl");
                        });
                }
                else {
                    toastr.warning("Email the new password to the following recipient not null");
                }
            };

        }
    ]);