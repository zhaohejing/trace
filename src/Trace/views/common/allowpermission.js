angular.module('MetronicApp').controller('views.common.allowpermission',
    ['$scope', 'settings', '$uibModalInstance', 'model', 'dataFactory',
        function ($scope, settings, $uibModalInstance, model, dataFactory) {
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();

            });
            var vm = this;
            vm.role = {};
            vm.permissions = [];
            vm.url = "api/sysmenu/allot";
            vm.save = function () {
                var parms = { roles: [vm.role.id], menus: vm.permissions.allow };
                dataFactory.action(vm.url, "", null, parms).then(function (res) {
                    if (res.success) {
                        $uibModalInstance.close();
                    } else {
                        abp.notify.error(res.error);
                    }
                });
            };
            vm.change = function (row, temp) {
                row.check = temp;
            }
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            vm.init = function () {
                dataFactory.action("api/sysmenu/getAll", "", null, { }).then(function (res) {
                    if (res.success) {
                        vm.permissions = res.result;
                    } else {
                        abp.notify.error(res.error);
                    }
                });

                if (model.id) {
                    dataFactory.action("api/sysrole/getById", "", null, { id: model.id }).then(function (res) {
                        if (res.success) {
                            vm.role = res.result;
                        } else {
                            abp.notify.error(res.error);
                        }
                    });
                }
            }
            vm.init();
        }]);
