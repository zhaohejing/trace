(function () {
    angular.module('MetronicApp').controller('views.achievement.medal.modify',
        ['$scope', 'settings', '$uibModal', '$state', '$stateParams', 'dataFactory', 'appSession', '$qupload',
        function ($scope, settings, $uibModal, $state, $stateParams, dataFactory, appSession, $qupload) {
            $scope.$on('$viewContentLoaded', function () {
                // initialize core components
                App.initAjax();
            });
            var vm = this;
            var aid = $stateParams.id;
          
            vm.achi = { type:1};
            if (aid) {
                dataFactory.action("api/achievement/get?id=" + aid, "GET", null, null)
                  .then(function (res) {
                      if (res.success) {
                          vm.achi = res.result;
                      } else {
                          abp.notify.error(res.error);
                      }
                  });
            }
         
            vm.cate = {
                a: [], b: [], c: [],
                init: function () {
                    dataFactory.action("api/category/getAllByPid?pid=0", "", null, {})
                 .then(function (res) {
                     if (res.success) {
                         vm.cate.a = res.result;
                     } else {
                         abp.notify.error(res.error);
                     }
                 });
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
            vm.cate.init();
            vm.achilist= {
                list: [],
                init: function() {
                    dataFactory.action("api/achievement/list", "", null, {})
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

            vm.cancel = function () {
                $state.go("medal");
            }
            vm.choose= function() {
                var modal = $uibModal.open({
                    templateUrl: 'views/common/choose.html',
                    controller: 'views.common.choose as vm',
                    backdrop: 'static',
                   // size: 'lg', //模态框的大小尺寸
                    resolve: {
                        model: function () { return { type:1 } }
                    }
                });
                modal.result.then(function (response) {
                    vm.init();
                });
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

