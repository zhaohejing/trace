﻿angular.module('MetronicApp').controller('views.onlinemall.banner.modal',
    ['$scope', 'settings', '$uibModalInstance', 'model', 'dataFactory', '$qupload',
        function ($scope, settings, $uibModalInstance, model, dataFactory, $qupload) {
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();

            });
            var vm = this;
            vm.gift = {};
            vm.url = "api/gift/modify";
            vm.save = function () {
                if (!vm.gift.activityId||vm.gift.activityId<=0) {
                    abp.notify.warn("请先创建活动");
                    return;
                }
                if (vm.file.show.length != 1) {
                    abp.notify.warn("请先上传文件");
                    return;
                }
                vm.gift.imageName = vm.file.show[0].imageName;
                vm.gift.imageUrl = vm.file.show[0].imageUrl;
                dataFactory.action(vm.url, "", null, vm.gift).then(function (res) {
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
                if (model.id) {
                    dataFactory.action("api/gift/detail", "", null, { id: model.id }).then(function (res) {
                        if (res.success) {
                            vm.gift = res.result;
                        } else {
                            abp.notify.error("获取失败,请重试");
                        }
                    });
                }
            }
            vm.init();
            vm.file = {
                multiple: false,
                token: abp.qiniuToken,
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
                            url: abp.qiniuUrl + response.key,
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
        }]);
