(function () {
    'use strict';

    var app = angular.module('angular-baidu-map', []);
    app.directive('baiduMap', ['$window', function ($window) {
        return {
            restrict: 'A',
            scope: {
                mapReady: '&',
                overlays: "=overlays"
            },
            link: function (scope, element, attrs) {
                var dto;

                var genderModel = function (map, bMap) {
                    if (scope.overlays && scope.overlays.points) {
                        var model = scope.overlays;
                        var point = model.points[0];
                        var temp = [];
                        //点
                        if (model.drawingMode === "marker") {
                            dto = new bMap.Marker(new bMap.Point(point.x, point.y)); // 创建点
                            //可拖拽
                            //  dto.enableDragging();

                        } else if (model.drawingMode === "circle") {
                            dto = new bMap.Circle(new bMap.Point(point.x, point.y),
                                point.r,
                                { strokeColor: "red", strokeWeight: 2, strokeOpacity: 0.5 }); //创建圆

                        } else if (model.drawingMode === "polyline") {
                            angular.forEach(model.points,
                                function (v, i) {
                                    temp.push(new bMap.Point(v.x, v.y));
                                });
                            dto = new bMap.Polyline(temp, { strokeColor: "red", strokeWeight: 2, strokeOpacity: 0.5 }); //创建折线

                            // dto.enableEditing();

                        } else if (model.drawingMode === "polygon" || model.drawingMode === "rectangle") {
                            angular.forEach(model.points,
                              function (v, i) {
                                  temp.push(new bMap.Point(v.x, v.y));
                              });
                            dto = new bMap.Polygon(temp, { strokeColor: "red", strokeWeight: 2, strokeOpacity: 0.5 }); //创建多边形
                            //  dto.enableEditing();
                        }
                        if (dto) {
                            map.addOverlay(dto);
                        }
                    }
                }
                var getmodel = function (mode, overlay) {
                    var dto = { drawingMode: mode };
                    //点
                    if (mode === "marker") {
                        dto.points = [{ x: overlay.point.lng, y: overlay.point.lat }];
                    } else if (mode === "circle") {
                        dto.points = [{ x: overlay.point.lng, y: overlay.point.lat, r: overlay.xa }];
                    } else if (mode === "polyline" || mode === "rectangle" || mode === "polygon") {
                        var temp = [];
                        angular.forEach(overlay.po,
                            function (v, i) {
                                temp.push({ x: v.lng, y: v.lat });
                            });
                        dto.points = temp;
                    }
                    return dto;
                }
                $window.baiduMapLoaded = function () {
                    var temp = null;
                    var map = new BMap.Map(element[0]);
                    var styleOptions = {
                        strokeColor: "red",    //边线颜色。
                        fillColor: "red",      //填充颜色。当参数为空时，圆形将没有填充效果。
                        strokeWeight: 3,       //边线的宽度，以像素为单位。
                        strokeOpacity: 0.8,    //边线透明度，取值范围0 - 1。
                        fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
                        strokeStyle: 'solid' //边线的样式，solid或dashed。
                    }
                    var config = {
                        isOpen: true, //是否开启绘制模式
                        enableDrawingTool: true, //是否显示工具栏
                        drawingToolOptions: {
                            anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
                            offset: new BMap.Size(5, 5), //偏离值
                            scale: 0.8,//工具栏缩放比例
                       
                        },
                        circleOptions: styleOptions, //圆的样式
                        polylineOptions: styleOptions, //线的样式
                        polygonOptions: styleOptions, //多边形的样式
                        rectangleOptions: styleOptions //矩形的样式
                    };
                    // var marker = new BMap.Marker(point);
                    //实例化鼠标绘制工具
                    var draw = new BMapLib.DrawingManager(map, config);
                    genderModel(map, BMap);
                    //回调获得覆盖物信息
                    var overlaycomplete = function (e) {
                        scope.overlays = {};
                        if (scope.overlays) {
                            map.removeOverlay(dto);
                            scope.overlays = {};
                        }
                        if (temp) {
                            map.removeOverlay(temp);
                        }
                        scope.overlays = getmodel(e.drawingMode, e.overlay);
                        temp = e.overlay;
                        map.addOverlay(e.overlay);
                    };


                    //添加鼠标绘制工具监听事件，用于获取绘制结果
                    draw.addEventListener("overlaycomplete", overlaycomplete);
                    scope.mapReady({ map: map, draw: draw });
                };
                var script = document.createElement("script");
                script.src = 'http://api.map.baidu.com/api?v=2.0&ak=' + attrs.baiduMap + '&callback=baiduMapLoaded';
                document.body.appendChild(script);




            }


        };
    }]);
})();