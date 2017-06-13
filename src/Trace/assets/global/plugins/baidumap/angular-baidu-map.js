(function () {
    'use strict';

    var app = angular.module('angular-baidu-map', []);

    app.directive('baiduMap', ['$window', function ($window) {
        return {
            restrict: 'A',
            scope: {
                mapReady: '&'
            },
            link: function (scope, element, attrs) {
                $window.baiduMapLoaded = function () {
                    var map = new BMap.Map(element[0]);
                    scope.mapReady({map: map});
                };
                var script = document.createElement("script");
                script.src = 'http://api.map.baidu.com/api?v=2.0&ak=' + attrs.baiduMap + '&callback=baiduMapLoaded';
                document.body.appendChild(script);
            }
        };
    }]);
})();