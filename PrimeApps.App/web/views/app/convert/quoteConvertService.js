'use strict';

angular.module('ofisim')

    .factory('QuoteConvertService', ['$rootScope', '$http', 'config', '$filter', 'helper',
        function ($rootScope, $http, config, $filter, helper) {
            return {
                convert: function (query) {
                    return $http.post(config.apiUrl + 'convert/convert_quote', query);
                }
            };
        }]);