(function () {
    angular.module('MetronicApp').controller('views.trace.modify',
        ['$scope', 'settings', '$state', '$stateParams', 'dataFactory', '$qupload',
        function ($scope, settings, $state, $stateParams, dataFactory, $qupload) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                App.initAjax();
            });
            var vm = this;
            var aid = $stateParams.id;
            vm.cate = {
                a: [], b: [], c: [],
                init: function (pid, child) {
                    dataFactory.action("api/category/getAllByPid?pid=0", "", null, {})
                 .then(function (res) {
                     if (res.success) {
                         vm.cate.a = res.result;
                     } else {
                         abp.notify.error(res.error);
                     }
                 });
                    if (pid) {
                        dataFactory.action("api/category/getAllByPid?pid=" + pid, "", null, {})
                .then(function (res) {
                    if (res.success) {
                        vm.cate.b = res.result;
                    } else {
                        abp.notify.error(res.error);
                    }
                });
                    }
                    if (child) {
                        dataFactory.action("api/category/getAllByPid?pid=" + child, "", null, {})
                .then(function (res) {
                    if (res.success) {
                        vm.cate.c = res.result;
                    } else {
                        abp.notify.error(res.error);
                    }
                });
                    }


                },
                change: function (type) {
                    var pid = type === 1 ? vm.trace.category1 : vm.trace.category2;
                    dataFactory.action("api/category/getAllByPid?pid=" + pid, "", null, {})
            .then(function (res) {
                if (res.success) {
                    if (type === 1) {
                        vm.cate.b = res.result;
                    } else {
                        vm.cate.c = res.result;
                    }
                } else {
                    abp.notify.error(res.error);
                }
            });
                }
            }
            vm.trace = {};
            vm.url = "api/travels/add";
            vm.mapReady = function (map, draw) {
                map.enableScrollWheelZoom();
                map.addControl(new BMap.NavigationControl());
                map.addControl(new BMap.ScaleControl());
                map.addControl(new BMap.OverviewMapControl());
                map.addControl(new BMap.MapTypeControl());
                var point = new BMap.Point(116.404, 39.915);
                map.centerAndZoom(point, 15);
                vm.mapper = { map: map, draw: draw };
            };
            if (aid) {
                vm.url = "api/travels/update";
                dataFactory.action("api/travels/get?id=" + aid, "GET", null, {})
                    .then(function(res) {
                        if (res.success) {
                            vm.trace = res.result;
                            vm.cate.init(vm.trace.category1, vm.trace.category2);
                            vm.overlays = angular.fromJson(vm.trace.content);
                        } else {
                            abp.notify.error(res.error);
                        }
                    });
            } else {
                vm.cate.init(vm.trace.category1, vm.trace.category2);
            }
          
            vm.cancel = function () {
                $state.go("trace");
            }
           
           
            //保存
            vm.save = function () {
                vm.trace.image = vm.file.model[1] ? vm.file.model[1].url : "";
                vm.trace.content = angular.toJson(vm.overlays);
                dataFactory.action(vm.url, "", null, vm.trace)
                    .then(function (res) {
                        if (res.success) {
                            abp.notify.success("成功");
                            $state.go("trace");
                        } else {
                            abp.notify.error(res.error);
                        }
                    });
            }

            vm.file = {
                multiple: false,
                token: abp.qiniuToken,
                uploadstate: false,
                show: [],
                model: {},
                selectFiles: [],
                start: function (index, type) {
                    vm.file.selectFiles[index].progress = {
                        p: 0
                    };
                    vm.file.selectFiles[index].upload = $qupload.upload({
                        key: '',
                        file: vm.file.selectFiles[index].file,
                        token: vm.file.token
                    });
                    vm.file.selectFiles[index].upload.then(function (response) {
                        var dto = {
                            type: type,
                            url: abp.qiniuUrl + response.key,
                        };
                        vm.file.model[type] = dto;
                        vm.file.show.push(dto);
                        vm.file.uploadstate = true;
                    }, function (response) {
                        abp.notify.error("上传失败,请重试");
                    }, function (evt) {
                        // progress
                        vm.file.selectFiles[index].progress.p = Math.floor(100 * evt.loaded / evt.totalSize);
                    });
                },
                abort: function () {
                    vm.file.model = {};
                    //  vm.model.address = response.address;
                    vm.file.show = [];
                    vm.file.selectFiles = [];
                },
                onFileSelect: function ($files, type) {
                    vm.file.selectFiles = [];
                    var offsetx = vm.file.selectFiles.length;
                    for (var i = 0; i < $files.length; i++) {
                        vm.file.selectFiles[i + offsetx] = {
                            file: $files[i]
                        };
                        vm.file.start(i + offsetx, type);
                    }
                }
            }
        }]);
})();

