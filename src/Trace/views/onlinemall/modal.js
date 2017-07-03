angular.module('MetronicApp').controller('views.actor.modal',
    ['$scope', 'settings', '$uibModalInstance', 'model', 'dataFactory', '$qupload',
        function ($scope, settings, $uibModalInstance, model, dataFactory, $qupload) {
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();

            });
            var vm = this;
            vm.actor = { activityId: model.activityId, id: model.id, activityName: "", actorKey:new Date().valueOf() };
            vm.url = "api/actor/modify";
            vm.save = function () {
                if (!vm.actor.activityId || vm.actor.activityId <= 0) {
                    abp.notify.warn("活动不存在");
                    return;
                }
                if (vm.file.show.length != 1) {
                    abp.notify.warn("请先上传文件");
                    return;
                }
                vm.actor.actorImage = vm.file.show[0].imageUrl;
                dataFactory.action(vm.url, "", null, vm.actor).then(function (res) {
                    if (res.success) {
                        $uibModalInstance.close();
                    } else {
                        abp.notify.error("保存失败,请重试");
                    }
                });
            };
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.init = function () {
                dataFactory.action("api/activity/detail", "", null, {id:vm.actor.activityId }).then(function (res) {
                    if (res.success) {
                        vm.actor.activityName = res.result.title;
                    } else {
                        abp.notify.error("获取失败,请重试");
                    }
                });

                if (vm.actor.id) {
                    dataFactory.action("api/actor/detail", "", null, { id: model.id }).then(function (res) {
                        if (res.success) {
                            vm.actor = res.result;
                        } else {
                            abp.notify.error("获取失败,请重试");
                        }
                    });
                }
            }
            vm.init();
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
                        var dto = { imageName: vm.file.selectFiles[index].file.name, imageUrl: "http://image.leftins.com/" + response.key };
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
