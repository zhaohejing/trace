(function () {
    angular.module('MetronicApp').factory('dataFactory', ["$http", "$q", "appSession", function ($http, $q, appSession) {
        var factory = {};
        factory.action = function (url, method, headers, params) {
            if (method === "") {
                method = "POST";
            }
          
            var u = "http://118.89.225.78:8080/";
            url = u + url;
         
            var defer = $q.defer();
            if (appSession == null) {
                abp.notify.error("用户token不存在");
                return defer.promise;
            }
            if (!headers) {
                headers = { 'Content-Type': 'application/json',"authorization":"Bearer "+appSession.token };
            }
            if (method == 'GET') {
                $http({
                    url: url,
                    method: "GET",
                    headers: headers,
                    params: params
                }).success(function (data) {
                    defer.resolve(data);
                }).
                error(function (data, status, headers, config) {
                    // defer.resolve(data);  
                    defer.reject(data);
                });
            } else {
                $http({
                    url: url,
                    method: method,
                    headers: headers,
                    data: params
                }).success(function (data) {
                    defer.resolve(data);
                }).
                error(function (data, status, headers, config) {
                    // defer.resolve(data);  
                    defer.reject(data);
                });
            }
            return defer.promise;
        };
        return factory;
    }]);
})();

