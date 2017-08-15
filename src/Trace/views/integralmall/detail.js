angular.module('MetronicApp').controller('views.integralmall.detail',
    ['$scope', 'settings', '$uibModalInstance', 'model',
        function ($scope, settings, $uibModalInstance, model) {
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();

            });
            var vm = this;
            vm.order = model;
            vm.cates = [{ id: 1, name: "启用" }, { id: 0, name: "禁用" }];
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
         

        }]);
