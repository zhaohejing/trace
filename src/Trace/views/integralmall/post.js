angular.module('MetronicApp').controller('views.integralmall.post',
    ['$scope', 'settings', '$uibModalInstance', 'model', 'dataFactory',
        function ($scope, settings, $uibModalInstance, model, dataFactory) {
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            var vm = this;
            vm.post = model.post;
            vm.type = model.type;
            vm.save = function () {
                dataFactory.action("api/integral/updatecourier", "", null, vm.post).then(function (res) {
                    if (res.success) {
                        abp.notify.success("填写成功");
                        $uibModalInstance.close();
                    } else {
                        abp.notify.error(res.error);
                    }
                });
            };
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
         
          

        }]);
