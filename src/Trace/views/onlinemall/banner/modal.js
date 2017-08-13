angular.module('MetronicApp').controller('views.onlinemall.banner.modal',
    ['$scope', 'settings', '$uibModalInstance', 'model', 'dataFactory', '$qupload',
        function ($scope, settings, $uibModalInstance, model, dataFactory, $qupload) {
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();

            });
            var vm = this;
            vm.shu = { cate: 2 };
            vm.url = "api/shuffling/add";
            vm.save = function () {
                vm.shu.image = vm.file.model[1] ? vm.file.model[1].url : "";
                dataFactory.action(vm.url, "", null, vm.shu).then(function (res) {
                    if (res.success) {
                        $uibModalInstance.close();
                    } else {
                        abp.notify.error(res.error);
                    }
                });
            };
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            vm.init = function () {
                if (model.id) {
                    vm.url = "api/shuffling/update";
                    dataFactory.action("api/shuffling/get?id=" + model.id, "GET", null, {}).then(function (res) {
                        if (res.success) {
                            vm.shu = res.result;
                            if (vm.shu.image) {
                                vm.file.model[1] = { type: 1, url: vm.shu.image }
                            }
                        } else {
                            abp.notify.error(res.error);
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
                remove: function (type) {
                    vm.file.model[type] = null;
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
