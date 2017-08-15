angular.module('MetronicApp').controller('views.common.detail',
    ['$scope', 'settings', '$uibModalInstance', 'model', 'dataFactory',
        function ($scope, settings, $uibModalInstance, model, dataFactory) {
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();

            });
            var vm = this;
            vm.orderNum = model;
            vm.order = {};
            if (vm.orderNum) {
                dataFactory.action("api/product/order?orderNum=" + vm.orderNum, "GET", "", {})
                    .then(c => {
                        vm.order = c.result[0];
                        vm.order.list = [];
                        vm.order.all = 0;

                        angular.forEach(c.result,
                            function (v, i) {
                                vm.order.list.push({ name: v.product_name, price: v.price, total: v.number });
                                vm.order.all += v.price * v.number;
                            });
                    });
            }
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
         

        }]);
