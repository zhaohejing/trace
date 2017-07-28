(function () {
    angular.module('MetronicApp')
        .controller('views.onlinemall.figure.index',
        [
            '$scope', "$state", 'settings', "dataFactory",'$uibModal',
            function ($scope, $state, settings, dataFactory, $uibModal) {
                // ajax初始化
                $scope.$on('$viewContentLoaded',
                    function () {
                        App.initAjax();
                    });
                var vm = this;
                //页面属性
                vm.table = {
                    rows: [], //数据集
                    filter: { pageNum: 1, pageSize: 10, name: "",cate:1 }, //条件搜索
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
                    dataFactory.action("api/shuffling/list", "", null, vm.table.filter)
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
                    var modal = $uibModal.open({
                        templateUrl: 'views/onlinemall/figure/modal.html',
                        controller: 'views.onlinemall.figure.modal as vm',
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
                        templateUrl: 'views/onlinemall/figure/modal.html',
                        controller: 'views.onlinemall.figure.modal as vm',
                        backdrop: 'static',
                        //   size: 'lg', //模态框的大小尺寸
                        resolve: {
                            model: function () { return { id: row.id } }
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
                                dataFactory.action("api/shuffling/delete", "", null, { list: [row.id] })
                                    .then(function (res) {
                                        abp.notify.success("删除成功");
                                        vm.init();
                                    });
                            }
                        });

                }
                vm.state=function(row, state) {
                    var title = state === 0 ? "确定要将此项下线么" : "确定要将此项上线么";
                    abp.message.confirm(
                      title, //确认提示（可选参数）
                      function (isConfirmed) {
                          if (isConfirmed) {
                              //...delete user 点击确认后执行
                              //api/resource/delete
                              dataFactory.action("api/shuffling/updateStatus", "", null, { list: [row.id], status: state })
                                  .then(function (res) {
                                      abp.notify.success("成功");
                                      vm.init();
                                  });
                          }
                      });
                }
                vm.init();
            }
        ]);
})();

