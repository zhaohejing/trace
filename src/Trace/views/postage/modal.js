angular.module('MetronicApp').controller('views.onlinemall.figure.modal',
    ['$scope', 'settings', '$uibModalInstance', 'model', 'dataFactory',
        function ($scope, settings, $uibModalInstance, model, dataFactory) {
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();

            });
            var vm = this;
            vm.post = {};
            vm.url = "api/post/add";
            vm.save = function () {
                dataFactory.action(vm.url, "", null, vm.post).then(function (res) {
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
                    vm.url = "api/post/update";
                    dataFactory.action("api/post/get?id="+model.id, "GET", null, { }).then(function (res) {
                        if (res.success) {
                            vm.post = res.result;
                        } else {
                            abp.notify.error("获取失败,请重试");
                        }
                    });
                }
            }
            vm.init();
        }]);
