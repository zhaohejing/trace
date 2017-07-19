(function () {
    angular.module('MetronicApp')
        .controller('views.onlinemall.figure.index',
        [
            '$scope', "$state", 'settings', "dataFactory",
            function ($scope, $state, settings, dataFactory) {
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
                    filter: { pageNum: 1, pageSize: 10, name: "", state: 1 }, //条件搜索
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
                    dataFactory.action("api/product/list", "", null, vm.table.filter)
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
                    $state.go("productmodify");
                }
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
                vm.edit = function (row) {
                    $state.go("productmodify", { id: row.id });
                }
             
                vm.delete = function (row) {
                    abp.message.confirm(
                        '删除将导致数据无法显示', //确认提示
                        '确定要删除么?', //确认提示（可选参数）
                        function (isConfirmed) {
                            if (isConfirmed) {
                                //...delete user 点击确认后执行
                                //api/resource/delete
                                dataFactory.action("api/product/delete", "", null, { list: [row.id] })
                                    .then(function (res) {
                                        abp.notify.success("删除成功");
                                        vm.init();
                                    });
                            }
                        });

                }
                vm.outline=function(row) {
                    abp.message.confirm(
                      '下线将导致数据无法正常购买', //确认提示
                      '确定要将此商品下线么?', //确认提示（可选参数）
                      function (isConfirmed) {
                          if (isConfirmed) {
                              //...delete user 点击确认后执行
                              //api/resource/delete
                              dataFactory.action("api/product/outline", "", null, { list: [row.id] })
                                  .then(function (res) {
                                      abp.notify.success("下线成功");
                                      vm.init();
                                  });
                          }
                      });
                }
                //vm.public = function () {
                //    var ids = Object.getOwnPropertyNames(vm.table.checkModel);
                //    if (ids.length <= 0) {
                //        abp.notify.warn("请选择单个操作对象");
                //        return;
                //    }
                //    for (var i in vm.table.checkModel) {
                //        if (vm.table.checkModel[i].public) {
                //            abp.notify.warn("已发布对象不允许操作");
                //            return;
                //        }
                //    }
                //    dataFactory.action("api/activity/public", "", null, { list: ids })
                //        .then(function (res) {
                //            abp.notify.success("发布成功");
                //            vm.init();
                //        });
                //}
                vm.init();
            }
        ]);
})();

