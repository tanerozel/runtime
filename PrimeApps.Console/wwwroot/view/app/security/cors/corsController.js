'use strict';

angular.module('primeapps')

    .controller('CorsController', ['$rootScope', '$scope', '$filter', '$state', '$stateParams', 'ngToast', '$modal', '$timeout', 'helper', 'dragularService', 'CorsService', 'LayoutService', '$http', 'config',
        function ($rootScope, $scope, $filter, $state, $stateParams, ngToast, $modal, $timeout, helper, dragularService,CorsService, LayoutService, $http, config) {

            //$rootScope.modules = $http.get(config.apiUrl + 'module/get_all');

            $scope.$parent.menuTopTitle = "Security";
            $scope.$parent.activeMenu = 'security';
            $scope.$parent.activeMenuItem = 'cors';

            console.log("CorsController");

        }
    ]);