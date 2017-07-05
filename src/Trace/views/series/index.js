(function () {
    angular.module("MetronicApp")
        .controller("views.series.index",
        ["$scope", "$state", "settings", "dataFactory",
            function($scope, $state, settings, dataFactory) {
                // ajax初始化
                $scope.$on("$viewContentLoaded",
                    function() {
                        App.initAjax();
                    });
                var vm = this;
                vm.mapper;
                vm.overlays = [];
               vm.mapReady = function (map,draw) {
                    map.enableScrollWheelZoom();
                    map.addControl(new BMap.NavigationControl());
                    map.addControl(new BMap.ScaleControl());
                    map.addControl(new BMap.OverviewMapControl());
                    map.addControl(new BMap.MapTypeControl());
                    var point = new BMap.Point(116.404, 39.915);
                    map.centerAndZoom(point, 15);
                    var marker = new BMap.Marker(point);
                    map.addOverlay(marker);
                    vm.mapper = { map: map, draw: draw };
               };
              
               vm.show = function () {
                   var temp = vm.overlays;

               }

            }
        ]);
})();

