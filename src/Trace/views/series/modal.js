angular.module('MetronicApp').controller('views.series.modal',
    ['$scope', 'settings', '$uibModalInstance', 'model', 'dataFactory',
        function ($scope, settings, $uibModalInstance, model, dataFactory) {
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();

            });
            var vm = this;
            vm.model = {};
            vm.url = "api/gift/modify";
            vm.save = function () {
                if (!vm.gift.activityId || vm.gift.activityId <= 0) {
                    abp.notify.warn("请先创建活动");
                    return;
                }
                if (vm.file.show.length != 1) {
                    abp.notify.warn("请先上传文件");
                    return;
                }
                vm.gift.imageName = vm.file.show[0].imageName;
                vm.gift.imageUrl = vm.file.show[0].imageUrl;
                dataFactory.action(vm.url, "", null, vm.gift).then(function (res) {
                    if (res.success) {
                        $uibModalInstance.close();
                    } else {
                        abp.notify.error("保存失败,请重试");
                    }
                });
            };
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
          
        
        }]);
