angular.module('MetronicApp').controller('views.manager.roles.modal',
    ['$scope', 'settings', '$uibModalInstance', 'model', 'dataFactory',
        function ($scope, settings, $uibModalInstance, model, dataFactory) {
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();

            });
            var vm = this;
            vm.role = {};
            vm.url = "";
            vm.save = function () {
                dataFactory.action(vm.url, "", null, vm.role).then(function (res) {
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
                    vm.url = "api/sysrole/update";
                    dataFactory.action("api/sysrole/getById", "", null, { id: model.id }).then(function (res) {
                        if (res.success) {
                            vm.role = res.result;
                            vm.role.create_time = null;
                        } else {
                            abp.notify.error(res.error);
                        }
                    });
                } else {
                    vm.url = "api/sysrole/add";

                }
            }
            vm.init();
        }]);
