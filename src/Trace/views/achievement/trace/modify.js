(function () {
    angular.module('MetronicApp').controller('views.achievement.trace.modify',
        ['$scope', 'settings', '$uibModal', '$state', '$stateParams', 'dataFactory', 'appSession', '$qupload',
        function ($scope, settings, $uibModal, $state, $stateParams, dataFactory, appSession, $qupload) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                App.initAjax();
            });
            var vm = this;
            var aid = $stateParams.id;
            vm.templist = [];
            vm.tempachi = 0;
            vm.url = "api/achievement/add";
            vm.achi = { type: 2, is_group:0 };
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
                    var pid = type === 1 ? vm.achi.category1 : vm.achi.category2;
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
            if (aid) {
                vm.url = "api/achievement/update";
                dataFactory.action("api/achievement/get?id=" + aid, "GET", null, null)
                    .then(function (res) {
                        if (res.success) {
                            vm.achi = res.result;
                            vm.tempachi = vm.achi.list[0].id;
                            vm.templist = vm.achi.list;
                            vm.cate.init(vm.achi.category1, vm.achi.category2);

                            if (vm.achi.image) {
                                vm.file.model[2] = { type: 2, url: vm.achi.image };
                            }
                        } else {
                            abp.notify.error(res.error);
                        }
                    });
            } else {
                vm.cate.init();
            }
            vm.cancel = function () {
                $state.go("traceachi");
            }
            vm.achilist = {
                list: [],
                init: function () {
                    dataFactory.action("api/travels/list", "", null, {})
               .then(function (res) {
                   if (res.success) {
                       vm.achilist.list = res.result;
                   } else {
                       abp.notify.error(res.error);
                   }
               });
                }
            }
            vm.achilist.init();


            vm.choose = function () {
                var modal = $uibModal.open({
                    templateUrl: 'views/achievement/trace/choose.html',
                    controller: 'views.achievement.trace.choose as vm',
                    backdrop: 'static',
                     size: 'lg', //模态框的大小尺寸
                    resolve: {
                        model: function () { return { type: 1 } }
                    }
                });
                modal.result.then(function (response) {
                    vm.templist = response;
                });
            }
            //保存
            vm.save = function () {
                if (vm.achi.is_group === "0") {
                    vm.achi.list = [vm.tempachi];
                } else {
                    if (vm.templist.length > 0) {
                        var temp = [];
                        angular.forEach(vm.templist,
                            function (v, i) {
                                temp.push(v.id);
                            });
                        vm.achi.list = temp;
                    }
                }
                vm.achi.button_image = vm.file.model[1] ? vm.file.model[1].url : "";
                vm.achi.image = vm.file.model[2] ? vm.file.model[2].url : "";


                dataFactory.action(vm.url, "", null, vm.achi)
                    .then(function (res) {
                        if (res.success) {
                            abp.notify.success("成功");
                            $state.go("traceachi");
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
                remove: function (type) {
                    vm.file.model[type] = null;
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

