'use strict';

angular.module('primeapps')

    .controller('TemplateController', ['$rootScope', '$scope', '$filter', '$state', 'ngToast', '$dropdown', '$modal', 'helper', '$localStorage', 'config', 'TemplateService',
        function ($rootScope, $scope, $filter, $state, ngToast, $dropdown, $modal, helper, $localStorage, config, TemplateService) {
            $scope.loading = true;

            TemplateService.getAllList('module', 'excel')
                .then(function (templates) {
                    angular.forEach(templates.data, function (template) {
                        template.module = $filter('filter')($rootScope.modules, { name: template.module }, true)[0];
                    });

                    $scope.templates = templates.data;
                })
                .finally(function () {
                    $scope.loading = false;
                });

            $scope.getDownloadUrl = function (template) {
                return 'attach/download_template?template_id=' + template.id + '&access_token=' + $localStorage.read('access_token');
            };

            $scope.delete = function (template) {
                TemplateService.delete(template.id)
                    .then(function () {
                        $scope.templates.splice($scope.templates.indexOf(template), 1);
                    });
            };
        }
    ]);