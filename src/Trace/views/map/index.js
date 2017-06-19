(function () {
    angular.module("MetronicApp")
        .controller("views.map.index",
        ["$scope", "$state", "settings", "dataFactory",
            function($scope, $state, settings, dataFactory) {
                // ajax初始化
                $scope.$on("$viewContentLoaded",
                    function() {
                        App.initAjax();
                    });
                var vm = this;
                vm.mapReady = function (map) {
                    map.enableScrollWheelZoom();
                    map.addControl(new BMap.NavigationControl());
                    map.addControl(new BMap.ScaleControl());
                    map.addControl(new BMap.OverviewMapControl());
                    map.addControl(new BMap.MapTypeControl());
                    var point = new BMap.Point(116.404, 39.915);
                    map.centerAndZoom(point, 15);
                    var marker = new BMap.Marker(point);
                    map.addOverlay(marker);
                  


                    var myDrawingManagerObject = new BMapLib.DrawingManager(map, {isOpen: true, 
                        drawingType: BMAP_DRAWING_MARKER, enableDrawingTool: true,
                        enableCalculate: false,
                        drawingToolOptions: {
                            anchor: BMAP_ANCHOR_TOP_LEFT,
                            offset: new BMap.Size(5, 5),
                            drawingTypes : [
                                BMAP_DRAWING_MARKER,
                                BMAP_DRAWING_CIRCLE,
                                BMAP_DRAWING_POLYLINE,
                                BMAP_DRAWING_POLYGON,
                                BMAP_DRAWING_RECTANGLE 
                            ]
                        },
                        polylineOptions: {
                            strokeColor: "#333"
                        }});
                };
            }
        ]);
})();

