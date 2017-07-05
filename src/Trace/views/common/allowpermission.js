angular.module('MetronicApp').controller('views.common.allowpermission',
    ['$scope', 'settings', '$uibModalInstance', 'model', 'dataFactory',
        function ($scope, settings, $uibModalInstance, model, dataFactory) {
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();

            });
            var vm = this;
            vm.user = {};
            vm.roles = [];
            vm.url = "api/sysuser/allot";
            vm.save = function () {
                var parms = { users: [vm.user.id], roles: vm.roles };
          
                dataFactory.action(vm.url, "", null, parms).then(function (res) {
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
                dataFactory.action("api/sysrole/getAll", "", null, {
                    name: "",
                    pageNum: 1,
                    pageSize: 999
                }).then(function (res) {
                    if (res.success) {
                        vm.roles = res.result;
                    } else {
                        abp.notify.error(res.error);
                    }
                });

                if (model.id) {
                    dataFactory.action("api/sysuser/getById", "", null, { id: model.id }).then(function (res) {
                        if (res.success) {
                            vm.user = res.result;
                        } else {
                            abp.notify.error(res.error);
                        }
                    });
                } 
            }
            vm.init();

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
