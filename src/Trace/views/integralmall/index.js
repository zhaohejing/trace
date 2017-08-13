(function () {
    angular.module('MetronicApp')
        .controller('views.integralmall.index',
        [
            '$scope', "$state", 'settings', "dataFactory", 'appSession',
            function ($scope, $state, settings, dataFactory, appSession) {
                // ajax初始化
                $scope.$on('$viewContentLoaded',
                    function () {
                        App.initAjax();
                    });
                var vm = this;

                vm.filter = {
                    states: [{id:null,name:"全部"}, { id: 1, name: "上架" }, { id: 0, name: "下架" }],
                    cates: [{ id: null, name: "全部" }, { id: 1, name: "纪念章" }, { id: 2, name: "名片" }, { id: 3, name: "明信片" }, { id: 4, name: "周边" }]
                }
                //页面属性
                vm.table = {
                    rows: [], //数据集
                    filter: { pageNum: 1, pageSize: 10, status: null, cate: null }, //条件搜索
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
                    dataFactory.action("api/integral/list", "", null, vm.table.filter)
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
                // vm.init();
                vm.add = function () {
                    $state.go("integralmodify");
                }
                vm.edit = function (row) {
                    $state.go("integralmodify", { id: row.id });
                }
                vm.delete = function (row) {
                    abp.message.confirm(
                        '删除将导致数据无法显示', //确认提示
                        '确定要删除么?', //确认提示（可选参数）
                        function (isConfirmed) {
                            if (isConfirmed) {
                                //...delete user 点击确认后执行
                                //api/resource/delete
                                dataFactory.action("api/integral/delete", "", null, { list: [row.id] })
                                    .then(function (res) {
                                        abp.notify.success("删除成功");
                                        vm.init();
                                    });
                            }
                        });

                }
                vm.update = function (row,type) {
                    dataFactory.action("api/integral/updateStatus", "", null, { list: [row.id], status: type })
                        .then(function (res) {
                            abp.notify.success("成功");
                            vm.init();
                        });
                }
                vm.init();
            }
        ]);
})();

