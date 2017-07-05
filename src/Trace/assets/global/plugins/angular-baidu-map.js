(function () {
    'use strict';

    var app = angular.module('angular-baidu-map', []);

    app.directive('baiduMap', ['$window', function ($window) {
        return {
            restrict: 'A',
            scope: {
                mapReady: '&',
                overlays:"="
            },
            link: function (scope, element, attrs) {
                $window.baiduMapLoaded = function () {
                    var map = new BMap.Map(element[0]);
                    var styleOptions = {
                        strokeColor: "red",    //边线颜色。
                        fillColor: "red",      //填充颜色。当参数为空时，圆形将没有填充效果。
                        strokeWeight: 3,       //边线的宽度，以像素为单位。
                        strokeOpacity: 0.8,    //边线透明度，取值范围0 - 1。
                        fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
                        strokeStyle: 'solid' //边线的样式，solid或dashed。
                    }
                    //实例化鼠标绘制工具
                    var draw = new BMapLib.DrawingManager(map, {
                        isOpen: false, //是否开启绘制模式
                        enableDrawingTool: true, //是否显示工具栏
                        drawingToolOptions: {
                            anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
                            offset: new BMap.Size(20, 20), //偏离值
                            scale: 0.8 //工具栏缩放比例
                        },
                        circleOptions: styleOptions, //圆的样式
                        polylineOptions: styleOptions, //线的样式
                        polygonOptions: styleOptions, //多边形的样式
                        rectangleOptions: styleOptions //矩形的样式
                    });
                    //回调获得覆盖物信息
                    var overlaycomplete = function (e) {
                        var temp = { drawingMode: e.drawingMode,overlay:e.overlay };
                        scope.overlays.push(temp);
                       
                    };
                    //添加鼠标绘制工具监听事件，用于获取绘制结果
                    draw.addEventListener("overlaycomplete", overlaycomplete);

                    scope.mapReady({map: map,draw:draw});
                };
                var script = document.createElement("script");
                script.src = 'http://api.map.baidu.com/api?v=2.0&ak=' + attrs.baiduMap + '&callback=baiduMapLoaded';
                document.body.appendChild(script);
            }
        };
    }]);
})();