(function () {
    angular.module('MetronicApp').controller('views.achievement.trace.modify',
        ['$scope', 'settings',  '$state', '$stateParams', 'dataFactory','$qupload',
        function ($scope, settings, $state, $stateParams, dataFactory, $qupload) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                App.initAjax();
            });
            var vm = this;
            var aid = $stateParams.id;
            vm.overlays = [];
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

            vm.activity = {};
            if (aid) {
                dataFactory.action("api/activity/detail", "", null, { id: aid })
                  .then(function (res) {
                      if (res.success) {
                          vm.activity = res.result;
                      } else {
                          abp.notify.error(res.error);
                      }
                  });
            }
       
            vm.cates = [{ id: 1, name: "纪念章" }, { id: 2, name: "名片" }, { id: 3, name: "明信片" }, { id: 4, name: "周边" }];
            
            vm.cancel = function () {
                $state.go("integral");
            }
            //保存
            vm.save = function () {
                if (vm.activity.id <= 0 && vm.file.show.length <= 0) {
                    abp.notify.warn("请先上传文件");
                    return;
                }
                vm.activity.images = vm.file.show;
                var url = "api/activity/modify";
                dataFactory.action(url, "", null, vm.activity)
                    .then(function(res) {
                        if (res.success) {
                            abp.notify.success("成功");
                            $state.go("activity");
                        } else {
                            abp.notify.error(res.error);
                        }
                    });
            }

            vm.file = {
                multiple: false,
                token: "",
                init: function () {
                    dataFactory.action("api/token/qnToken", "", null, {}).then(function (res) {
                        if (res.result == "1") {
                            vm.file.token = res.data;
                        }
                    })
                },
                uploadstate: false,
                show: [],
                selectFiles: [],
                start: function (index) {
                    vm.file.selectFiles[index].progress = {
                        p: 0
                    };
                    vm.file.selectFiles[index].upload = $qupload.upload({
                        key: '',
                        file: vm.file.selectFiles[index].file,
                        token: vm.file.token
                    });
                    vm.file.selectFiles[index].upload.then(function (response) {
                        var fileName = vm.file.selectFiles[index].file.name;
                        var dto = {
                            sort: index,
                            title: fileName,
                            url: "http://image.leftins.com/" + response.key,
                            isTitle: fileName.indexOf("title") >= 0,
                            isShare: fileName.indexOf("share") >= 0
                        };
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
                    //  vm.model.address = response.address;
                    vm.file.show = [];
                    vm.file.selectFiles = [];
                },
                onFileSelect: function ($files) {
                    vm.file.selectFiles = [];
                    var offsetx = vm.file.selectFiles.length;
                    for (var i = 0; i < $files.length; i++) {
                        vm.file.selectFiles[i + offsetx] = {
                            file: $files[i]
                        };
                        vm.file.start(i + offsetx);
                    }
                }
            }
            vm.file.init();
        }]);
})();

