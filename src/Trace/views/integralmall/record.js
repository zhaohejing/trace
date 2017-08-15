(function () {
    angular.module('MetronicApp')
        .controller('views.integralmall.record',
        [
            '$scope', "$state", 'settings', "dataFactory", '$uibModal',
            function ($scope, $state, settings, dataFactory, $uibModal) {
                // ajax初始化
                $scope.$on('$viewContentLoaded',
                    function () {
                        App.initAjax();
                    });
                var vm = this;

                vm.filter = {
                    states: [{ id: null, name: "全部" }, { id: 1, name: "上架" }, { id: 0, name: "下架" }],
                    cates: [{ id: null, name: "全部" }, { id: 1, name: "纪念章" }, { id: 2, name: "名片" }, { id: 3, name: "明信片" }, { id: 4, name: "周边" }]
                }
                //页面属性
                vm.table = {
                    rows: [], //数据集
                    filter: { index: 1, size: 10, name: "", state: null, cate: null }, //条件搜索
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
                    dataFactory.action("api/integral/orders", "", null, vm.table.filter)
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
             vm.detail=function(row) {
                 var modal = $uibModal.open({
                     templateUrl: 'views/integralmall/detail.html',
                     controller: 'views.integralmall.detail as vm',
                     backdrop: 'static',
                     size: 'lg', //模态框的大小尺寸
                     resolve: {
                         model: function () { return row }
                     }
                 });
                 modal.result.then(function (response) {
                     vm.init();
                 });
             }
                vm.postage=function(row) {
                    var modal = $uibModal.open({
                        templateUrl: 'views/integralmall/post.html',
                        controller: 'views.integralmall.post as vm',
                        backdrop: 'static',
                        size: 'sm', //模态框的大小尺寸
                        resolve: {
                            model: function () { return { type:1,post:row } }
                        }
                    });
                    modal.result.then(function (response) {
                        vm.init();
                    });
                }
                vm.post = function (row) {
                    var modal = $uibModal.open({
                        templateUrl: 'views/integralmall/post.html',
                        controller: 'views.integralmall.post as vm',
                        backdrop: 'static',
                        size: 'sm', //模态框的大小尺寸
                        resolve: {
                            model: function () { return { type: 2, post: row } }
                        }
                    });
                    modal.result.then(function (response) {
                        vm.init();
                    });
                }
                vm.init();
            }
        ]);
})();

