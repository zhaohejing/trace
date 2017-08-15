angular.module('MetronicApp').controller('views.common.post',
    ['$scope', 'settings', '$uibModalInstance', 'model', 'dataFactory',
        function ($scope, settings, $uibModalInstance, model, dataFactory) {
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            var vm = this;
            vm.post = model.post;
            vm.type = model.type;
            vm.url = model.url;
            vm.save = function () {
                dataFactory.action(vm.url, "", null, vm.post).then(function (res) {
                    if (res.success) {
                        abp.notify.success("填写成功");
                        $uibModalInstance.close();
                    } else {
                        abp.notify.error(res.error);
                    }
                });
            };
            vm.cancel = function () {
                //model.post.courier_company = null;
                //model.post.courier_order = null;
                //model.post.courier_time = null;
                $uibModalInstance.close();
            };
         
          

        }]);
