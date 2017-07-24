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
                        var pid = type === 1 ? vm.product.badge_category1 : vm.product.badge_category2;
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
                //页面属性
                vm.table = {
                    rows: [], //数据集
                    filter: { pageNum: 1, pageSize: 10, name: "",type:1  }, //条件搜索
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
                    dataFactory.action("api/achievement/list", "", null, vm.table.filter)
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
                 vm.init();
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
                                dataFactory.action("api/achievement/delete", "", null, { list: [row.id] })
                                    .then(function (res) {
                                        abp.notify.success("删除成功");
                                        vm.init();
                                    });
                            }
                        });

                }
                vm.public = function (row) {
                    dataFactory.action("api/achievement/updateStatus", "", null, { list: [row.id], status: 1 })
                                    .then(function (res) {
                                        abp.notify.success("发布成功");
                                        vm.init();
                                    });
                }
            }
        ]);
})();

