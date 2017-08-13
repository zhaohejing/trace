(function () {
    angular.module('MetronicApp').controller('views.integralmall.modify',
        ['$scope', 'settings', '$uibModal', '$state', '$stateParams', 'dataFactory', '$qupload',
        function ($scope, settings, $uibModal, $state, $stateParams, dataFactory, $qupload) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                App.initAjax();
            });
            var vm = this;
            var aid = $stateParams.id;
            vm.cates = [{ id: 1, name: "实物" },{ id: 2, name: "虚拟" }];
            vm.product = {};
            var url = "api/integral/add";
            if (aid) {
                 url = "api/integral/update";
                dataFactory.action("api/integral/get?id=" + aid, "GET", null, null)
                  .then(function (res) {
                      if (res.success) {
                          vm.product = res.result;
                          if (vm.product.image1) {
                              vm.file.model[1] = { type: 1, url: vm.product.image1 }
                          }
                          if (vm.product.image2) {
                              vm.file.model[2] = { type: 2, url: vm.product.image2 }
                          }
                      } else {
                          abp.notify.error(res.error);
                      }
                  });
            }
            vm.cancel = function () {
                $state.go("integral");
            }
            //保存
            vm.save = function () {
                vm.product.image1 = vm.file.model[1] ? vm.file.model[1].url : "";
                vm.product.image2 = vm.file.model[2] ? vm.file.model[2].url : "";
                dataFactory.action(url, "", null, vm.product)
                    .then(function(res) {
                        if (res.success) {
                            abp.notify.success("成功");
                            $state.go("integral");
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
})();

