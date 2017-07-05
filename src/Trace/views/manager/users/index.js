(function () {
    angular.module('MetronicApp')
        .controller('views.manager.users.index',
        [
            '$scope', 'settings', "dataFactory", '$uibModal',
            function($scope, settings, dataFactory, $uibModal) {
                // ajax初始化
                $scope.$on('$viewContentLoaded',
                    function() {
                        App.initAjax();
                    });
                var vm = this;
                vm.filter = { pageNum: 1, pageSize: 10, name: "" };

                //页面属性
                vm.table = {
                    data: [], //数据集
                    pageConfig: { //分页配置
                        currentPage: 1, //当前页
                        itemsPerPage: 10, //页容量
                        totalItems: 0 //总数据
                    }
                }
                //获取用户数据集，并且添加配置项
                vm.init = function() {
                    vm.filter.pageNum = vm.table.pageConfig.currentPage;
                    vm.filter.pageSize = vm.table.pageConfig.itemsPerPage;
                    dataFactory.action("api/sysuser/getAll", "", null, vm.filter)
                        .then(function(res) {
                            if (res.success) {
                                vm.table.pageConfig.totalItems = res.total;
                                vm.table.data = res.result;
                                vm.table.pageConfig.onChange = function () {
                                    vm.init();
                                }
                            } else {
                                abp.notify.error(res.error);
                            }
                        });
                };
                vm.init();
                vm.add = function() {
                    var modal = $uibModal.open({
                        templateUrl: 'views/manager/users/modal.html',
                        controller: 'views.manager.users.modal as vm',
                        backdrop: 'static',
                        size: 'lg', //模态框的大小尺寸
                        resolve: {
                            model: function() { return {} }
                        }
                    });
                    modal.result.then(function(response) {
                        vm.init();
                    });
                }
                vm.edit = function(row) {
                    var modal = $uibModal.open({
                        templateUrl: 'views/manager/users/modal.html',
                        controller: 'views.manager.users.modal as vm',
                        backdrop: 'static',
                        //  size: 'lg', //模态框的大小尺寸
                        resolve: {
                            model: function () { return { id: row.id } }
                        }
                    });
                    modal.result.then(function(response) {
                        vm.init();
                    });
                }
                vm.allow= function(row) {
                    var modal = $uibModal.open({
                        templateUrl: 'views/common/allowrole.html',
                        controller: 'views.common.allowrole as vm',
                        backdrop: 'static',
                        //  size: 'lg', //模态框的大小尺寸
                        resolve: {
                            model: function () { return { id: row.id } }
                        }
                    });
                    modal.result.then(function (response) {
                        vm.init();
                    });
                }
                vm.delete = function(row) {
                    abp.message.confirm(
                        '删除将导致数据无法显示', //确认提示
                        '确定要删除么?', //确认提示（可选参数）
                        function(isConfirmed) {
                            if (isConfirmed) {
                                dataFactory.action("api/sysuser/delete", "", null, { list: [row.id] })
                                    .then(function(res) {
                                        abp.notify.success("删除成功");
                                        vm.init();
                                    });
                            }
                        });

                }

            }
        ]);
})();

