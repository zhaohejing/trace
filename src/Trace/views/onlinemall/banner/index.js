(function () {
    angular.module('MetronicApp')
        .controller('views.onlinemall.figure.index',
        [
            '$scope', "$state", 'settings', "dataFactory", 'appSession','$uibModal',
            function ($scope, $state, settings, dataFactory, appSession, $uibModal) {
                // ajax初始化
                $scope.$on('$viewContentLoaded',
                    function () {
                        App.initAjax();
                    });
                var vm = this;

                vm.states = [{ id: 1, name: "有效" }, { id: 0, name: "失效" }];
                
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
                    var modal = $uibModal.open({
                        templateUrl: 'views/onlinemall/banner/modal.html',
                        controller: 'views.onlinemall.banner.modal as vm',
                        backdrop: 'static',
                     //   size: 'lg', //模态框的大小尺寸
                        resolve: {
                            model: function () { return {} }
                        }
                    });
                    modal.result.then(function (response) {
                        vm.init();
                    });
                }

                vm.edit = function (row) {
                    var modal = $uibModal.open({
                        templateUrl: 'views/onlinemall/banner/modal.html',
                        controller: 'views.onlinemall.banner.modal as vm',
                        backdrop: 'static',
                        //   size: 'lg', //模态框的大小尺寸
                        resolve: {
                            model: function () { return { id:row.id} }
                        }
                    });
                    modal.result.then(function (response) {
                        vm.init();
                    });
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
           
            }
        ]);
})();

