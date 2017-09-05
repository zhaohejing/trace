(function () {
    angular.module('MetronicApp').controller('views.integralmall.product.modify',
        ['$scope', 'settings', '$uibModal', '$state', '$stateParams', 'dataFactory', '$qupload',
        function ($scope, settings, $uibModal, $state, $stateParams, dataFactory, $qupload) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                App.initAjax();
            });
            var vm = this;
            var aid = $stateParams.id;

            vm.product = {};
            vm.products = [];

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
                    var pid = type === 1 ? vm.product.badge_category1 : vm.product.badge_category2;
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
            vm.url = "api/product/add";
            if (aid) {
                vm.url = "api/product/update";
                dataFactory.action("api/product/get?id=" + aid, "GET", null, {})
                    .then(function(res) {
                        if (res.success) {
                            vm.product = res.result;
                            vm.products = vm.product.list;
                            vm.product.is_badge = vm.product.is_badge === 1;
                            vm.product.is_perfect = vm.product.is_perfect ===1;
                            vm.cate.init(vm.product.badge_category1, vm.product.badge_category2);

                            if (vm.product.badge_image) {
                                vm.file.model[1] = { type: 1, url: vm.product.badge_image };
                            }
                            if (vm.product.image1) {
                                vm.file.model[4] = { type: 4, url: vm.product.image1 };
                            }
                            if (vm.product.image2) {
                                vm.file.model[3] = { type: 3, url: vm.product.image2 };
                            }
                      

                        } else {
                            abp.notify.error(res.error);
                        }
                    });
            } else {
                vm.cate.init();
            }
         
            vm.cancel = function () {
                $state.go("product");
            }
            //保存
            vm.save = function () {
                if (vm.product.id <= 0 && vm.file.show.length <= 0) {
                    abp.notify.warn("请先上传文件");
                    return;
                }
                if (vm.product.is_badge) {
                    vm.product.badge_image = vm.file.model[1]?vm.file.model[1].url:"";
                }
                vm.product.is_badge = vm.product.is_badge ? 1 : 0;
                vm.product.is_perfect = vm.product.is_perfect ? 1 : 0;
                vm.product.image1 = vm.file.model[4]? vm.file.model[4].url:"";
                vm.product.image2 = vm.file.model[3]? vm.file.model[3].url:"";
                vm.product.tag = vm.file.model[2] ? vm.file.model[2].url : "";

                if (vm.products.length > 0) {
                    var temp = [];
                    angular.forEach(vm.products,
                        function(v, i) {
                            temp.push(v.id);
                        });
                    vm.product.list = temp;
                }

                //  vm.product.type = vm.product.type === "1" ? 1 : 0;
                dataFactory.action(vm.url, "", null, vm.product)
                    .then(function (res) {
                        if (res.success) {
                            abp.notify.success("成功");
                            $state.go("product");
                        } else {
                            abp.notify.error(res.error);
                        }
                    });
            }
            vm.choose= function() {
                if (vm.product.is_badge) {
                    vm.product.type = 0;
                    return;
                }
                var modal = $uibModal.open({
                    templateUrl: 'views/onlinemall/product/choose.html',
                    controller: 'views.onlinemall.product.choose as vm',
                    backdrop: 'static',
                     size: 'lg', //模态框的大小尺寸
                    resolve: {
                        model: function () { return  vm.products  }
                    }
                });
                modal.result.then(function (response) {
                    vm.products = response;
                });
            }
            vm.remove= function(row) {
                vm.products.splice($.inArray(row, vm.products), 1);
            }
            vm.file = {
                multiple: false,
                token: abp.qiniuToken,
                uploadstate: false,
                show: [],
                model: {},
                selectFiles: [],
                
                start: function (index,type) {
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
                onFileSelect: function ($files,type) {
                    vm.file.selectFiles = [];
                    var offsetx = vm.file.selectFiles.length;
                    for (var i = 0; i < $files.length; i++) {
                        vm.file.selectFiles[i + offsetx] = {
                            file: $files[i]
                        };
                        vm.file.start(i + offsetx,type);
                    }
                }
            }
         
        }]);
})();

