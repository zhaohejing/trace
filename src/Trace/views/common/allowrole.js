angular.module('MetronicApp').controller('views.common.allowrole',
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
                var temp = [];
                angular.forEach(vm.roles,
                    function(v, i) {
                        if (v.check) {
                            temp.push(v.id);
                        }
                    });
                var parms = { users: [vm.user.id], roles: temp };
          
                dataFactory.action(vm.url, "", null, parms).then(function (res) {
                    if (res.success) {
                        $uibModalInstance.close();
                    } else {
                        abp.notify.error(res.error);
                    }
                });
            };
            vm.change= function(row,temp) {
                row.check = temp;
            }
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
        }]);
