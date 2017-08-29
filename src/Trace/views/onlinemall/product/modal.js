angular.module('MetronicApp').controller('views.onlinemall.product.modal',
    ['$scope', 'settings', '$uibModalInstance', 'model', 'dataFactory',
        function ($scope, settings, $uibModalInstance, model, dataFactory) {
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();

            });
            var vm = this;
            vm.row = model;
            vm.count = 0;
            vm.url = "/product/createCode";
            vm.save = function () {
                vm.url =abp.baseUrl+ vm.url + "?product_id=" + vm.row.id + "&numbers=" + vm.count;
                window.open(vm.url);
            
                $uibModalInstance.close();

            };
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
        }]);
