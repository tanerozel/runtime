'use strict';

angular.module('primeapps')

    .controller('AuthenticationController', ['$rootScope', '$scope', '$filter', '$state', '$stateParams', 'ngToast', '$modal', '$timeout', 'helper', 'dragularService', 'AuthenticationService', 'LayoutService', '$http', 'config',
        function ($rootScope, $scope, $filter, $state, $stateParams, ngToast, $modal, $timeout, helper, dragularService,AuthenticationService, LayoutService, $http, config) {

            //$rootScope.modules = $http.get(config.apiUrl + 'module/get_all');

            $scope.$parent.menuTopTitle = "Identity";
            $scope.$parent.activeMenu = 'identity';
            $scope.$parent.activeMenuItem = 'authentication';

            console.log("AuthenticationController");

        }
    ]);