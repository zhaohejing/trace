angular.module('MetronicApp').controller('views.manager.customers.modal',
    ['$scope', 'settings', '$uibModalInstance', 'model', 'dataFactory',
        function ($scope, settings, $uibModalInstance, model, dataFactory) {
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();

            });
            var vm = this;
            vm.user = {};
            vm.url = "";
            vm.cates = [{ id: 1, name: "启用" }, { id: 0, name: "禁用" }];
            vm.save = function () {
                dataFactory.action(vm.url, "", null, vm.user).then(function (res) {
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
                    vm.url = "api/sysuser/update";
                    dataFactory.action("api/sysuser/getById", "", null, { id: model.id }).then(function (res) {
                        if (res.success) {
                            vm.user = res.result;
                        } else {
                            abp.notify.error(res.error);
                        }
                    });
                } else {
                    vm.url = "api/sysuser/add";

                }
            }
            vm.init();
          
        }]);
