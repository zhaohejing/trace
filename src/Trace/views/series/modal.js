angular.module('MetronicApp').controller('views.series.modal',
    ['$scope', 'settings', '$uibModalInstance', 'org', 'dataFactory',
        function ($scope, settings, $uibModalInstance, org, dataFactory) {
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();

            });
            var vm = this;
            vm.org = org;
            vm.org.name = org.displayName;
            vm.org.pid = org.parentId;
            vm.url = vm.org.id ? "api/category/update" : "api/category/add";
            vm.save = function () {

                dataFactory.action(vm.url, "", null, vm.org).then(function (res) {
                    if (res.success) {
                        $uibModalInstance.close(res);
                    } else {
                        abp.notify.error(res.error);
                    }
                });
            };
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

        }]);
