'use strict';

angular.module('ofisim')

    .factory('TemplateService', ['$rootScope', '$http', 'config',
        function ($rootScope, $http, config) {
            return {
                get: function (id) {
                    return $http.get(config.apiUrl + 'template/get/' + id);
                },

                getAll: function (type) {
                    return $http.get(config.apiUrl + 'template/get_all?type=' + (type || ''));
                },

                create: function (quoteTemplate) {
                    return $http.post(config.apiUrl + 'template/create', quoteTemplate);
                },
                update: function (quoteTemplate) {
                    return $http.put(config.apiUrl + 'template/update/' + quoteTemplate.id, quoteTemplate);
                },

                delete: function (id) {
                    return $http.delete(config.apiUrl + 'template/delete/' + id);
                }
            }
        }]);