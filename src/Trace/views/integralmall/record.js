(function () {
    angular.module('MetronicApp')
        .controller('views.integralmall.record',
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
                    states: [{ id: 1, name: "上架" }, { id: 0, name: "下架" }],
                    cates: [{ id: 1, name: "纪念章" }, { id: 2, name: "名片" }, { id: 3, name: "明信片" }, { id: 4, name: "周边" }]
                }
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

                vm.edit = function () {
                    var id = Object.getOwnPropertyNames(vm.table.checkModel);
                    if (id.length != 1) {
                        abp.notify.warn("请选择一个操作对象");
                        return;
                    }
                    $state.go("modify", { id: id[0] });
                }
                vm.actors = function () {
                    var id = Object.getOwnPropertyNames(vm.table.checkModel);
                    if (id.length != 1) {
                        abp.notify.warn("请选择一个操作对象");
                        return;
                    }
                    $state.go("actor", { id: id[0] });
                }
                vm.delete = function () {
                    var ids = Object.getOwnPropertyNames(vm.table.checkModel);
                    if (ids.length <= 0) {
                        abp.notify.warn("请选择要删除的对象");
                        return;
                    }
                    for (var i in vm.table.checkModel) {
                        if (vm.table.checkModel.hasOwnProperty(i)) {
                            if (vm.table.checkModel[i].public) {
                                abp.notify.warn("已发布对象不允许操作");
                                return;
                            }
                        }
                    };
                    abp.message.confirm(
                        '删除将导致数据无法显示', //确认提示
                        '确定要删除么?', //确认提示（可选参数）
                        function (isConfirmed) {
                            if (isConfirmed) {
                                //...delete user 点击确认后执行
                                //api/resource/delete
                                dataFactory.action("api/activity/delete", "", null, { list: ids })
                                    .then(function (res) {
                                        abp.notify.success("删除成功");
                                        vm.init();
                                    });
                            }
                        });

                }
                vm.public = function () {
                    var ids = Object.getOwnPropertyNames(vm.table.checkModel);
                    if (ids.length <= 0) {
                        abp.notify.warn("请选择单个操作对象");
                        return;
                    }
                    for (var i in vm.table.checkModel) {
                        if (vm.table.checkModel[i].public) {
                            abp.notify.warn("已发布对象不允许操作");
                            return;
                        }
                    }
                    dataFactory.action("api/activity/public", "", null, { list: ids })
                        .then(function (res) {
                            abp.notify.success("发布成功");
                            vm.init();
                        });
                }

            }
        ]);
})();

