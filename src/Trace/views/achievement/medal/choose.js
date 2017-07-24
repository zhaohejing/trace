angular.module('MetronicApp').controller('views.achievement.medal.choose',
    ['$scope', 'settings', '$uibModalInstance', 'model', 'dataFactory',
        function ($scope, settings, $uibModalInstance, model, dataFactory) {
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            var vm = this;
            vm.selected = {};
            vm.save = function () {
                var temp = [];
                for (var a in vm.selected) {
                    if (vm.selected.hasOwnProperty(a)) {
                        temp.push(vm.selected[a]);
                    }
                }
                $uibModalInstance.close(temp);
            };
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            //页面属性
            vm.table = {
                rows: [], //数据集
                filter: { pageNum: 1, pageSize: 10, name: "", status: 1 }, //条件搜索
                pageConfig: { //分页配置
                    currentPage: 1, //当前页
                    itemsPerPage: 10, //页容量
                    totalItems: 0 //总数据
                }
            }
            //获取用户数据集，并且添加配置项
            vm.init = function () {
                vm.table.filter.pageNum = vm.table.pageConfig.currentPage;
                vm.table.filter.pageSize = vm.table.pageConfig.itemsPerPage;
                dataFactory.action("api/product/badgeList", "", null, vm.table.filter)
                    .then(function (res) {
                        if (res.success) {
                            vm.table.pageConfig.totalItems = res.total;
                            vm.table.rows = res.result;
                            vm.table.pageConfig.onChange = function () {
                                vm.init();
                            }
                        } else {
                            abp.notify.error(res.error);
                        }
                    });
            };
            vm.select=function(row, e) {
                if (e.target.checked) {
                    vm.selected[row.id] = row;
                } else {
                    delete vm.selected[row.id];
                }
            }

            vm.init();
            vm.cate = {
                a: [], b: [], c: [],
                init: function () {
                    dataFactory.action("api/category/getAllByPid?pid=0", "", null, {})
                 .then(function (res) {
                     if (res.success) {
                         vm.cate.a = res.result;
                     } else {
                         abp.notify.error(res.error);
                     }
                 });
                },
                change: function (type) {
                    var pid = type === 1 ? vm.table.filter.category1 : vm.table.filter.category2;
                    dataFactory.action("api/category/getAllByPid?pid=" + pid, "", null, {})
            .then(function (res) {
                if (res.success) {
                    if (type === 1) {
                        vm.cate.b = res.result;
                    } else {
                        vm.cate.c = res.result;
                    }
                } else {
                    abp.notify.error(res.error);
                }
            });
                }
            }
            vm.cate.init();
        }]);
