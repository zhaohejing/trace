(function () {
    angular.module('MetronicApp')
        .controller('views.achievement.medal.index',
        [
            '$scope', "$state", 'settings', "dataFactory", 'appSession',
            function ($scope, $state, settings, dataFactory, appSession) {
                // ajax初始化
                $scope.$on('$viewContentLoaded',
                    function () {
                        App.initAjax();
                    });
                var vm = this;

                vm.cates = [{ id: 1, name: "纪念章" }, { id: 0, name: "游迹" }];
                
                //页面属性
                vm.table = {
                    rows: [], //数据集
                    filter: { index: 1, size: 10, name: "", state: 1, cate: 1 }, //条件搜索
                    pageConfig: { //分页配置
                        currentPage: 1, //当前页
                        itemsPerPage: 10, //页容量
                        totalItems: 0 //总数据
                    }
                }

                //获取用户数据集，并且添加配置项
                vm.init = function () {
                    vm.filter.index = vm.table.pageConfig.currentPage;
                    vm.filter.size = vm.table.pageConfig.itemsPerPage;
                    dataFactory.action("api/activity/activitys", "", null, vm.table.filter)
                        .then(function (res) {
                            if (res.success) {
                                vm.table.pageConfig.totalItems = res.result.total;
                                vm.table.rows = res.result.data;
                                vm.table.pageConfig.onChange = function () {
                                    vm.init();
                                }
                            } else {
                                abp.notify.error(res.error);
                            }
                        });
                };
                // vm.init();
                vm.add = function () {
                    $state.go("medalmodify");
                }
                vm.edit = function (row) {
              
                    $state.go("medalmodify", { id:row.id });
                }
                vm.delete = function (row) {
                    abp.message.confirm(
                        '删除将导致数据无法显示', //确认提示
                        '确定要删除么?', //确认提示（可选参数）
                        function (isConfirmed) {
                            if (isConfirmed) {
                                //...delete user 点击确认后执行
                                //api/resource/delete
                                dataFactory.action("api/activity/delete", "", null, { list: [row.id] })
                                    .then(function (res) {
                                        abp.notify.success("删除成功");
                                        vm.init();
                                    });
                            }
                        });

                }
                vm.public = function (row) {
                    dataFactory.action("api/activity/public", "", null, { list: [row.id] })
                        .then(function (res) {
                            abp.notify.success("发布成功");
                            vm.init();
                        });
                }
            }
        ]);
})();

