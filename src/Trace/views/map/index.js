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

                    //实例化鼠标绘制工具
                    var drawingManager = new BMapLib.DrawingManager(map, {
                        isOpen: false, //是否开启绘制模式
                        enableDrawingTool: true, //是否显示工具栏
                        drawingToolOptions: {
                            anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
                            offset: new BMap.Size(5, 5), //偏离值
                            scale: 0.8 //工具栏缩放比例
                        },
                        circleOptions: styleOptions, //圆的样式
                        polylineOptions: styleOptions, //线的样式
                        polygonOptions: styleOptions, //多边形的样式
                        rectangleOptions: styleOptions //矩形的样式
                    });
                };
            }
        ]);
})();

