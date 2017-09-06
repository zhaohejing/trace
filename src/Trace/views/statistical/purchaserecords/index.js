(function () {
    angular.module('MetronicApp')
        .controller('views.statistical.purchaserecords.index',
        [
            '$scope', "$state", 'settings', "dataFactory",
           function ($scope, $state, settings, dataFactory) {
               // ajax初始化
               $scope.$on('$viewContentLoaded',
                   function () {
                       App.initAjax();
                   });
               var vm = this;


               //页面属性
               vm.table = {
                   rows: [], //数据集
                   filter: { pageNum: 1, pageSize: 10, prov: null, city: null, category1: null, category2: null, category3: null, start: null, end: null }, //条件搜索
                   pageConfig: { //分页配置
                       currentPage: 1, //当前页
                       itemsPerPage: 10, //页容量
                       totalItems: 0 //总数据
                   }
               }
               vm.address = {
                   url: "sys/positions?id=",
                   prov: [{ id: null, name: "全部" }], city: [{ id: null, name: "全部" }],
                   init: function () {
                       dataFactory.action(vm.address.url + 0, "GET", null, {})
                  .then(function (res) {
                      if (res) {
                          vm.address.prov = [{ id: null, name: "全部" }];

                          vm.address.prov = vm.address.prov.concat(res);
                      } else {
                          abp.notify.error("获取失败");
                      }
                  });
                   }, change: function () {
                       dataFactory.action(vm.address.url + vm.table.filter.prov, "GET", null, {})
            .then(function (res) {
                if (res) {
                    vm.address.city = [{ id: null, name: "全部" }];

                    vm.address.city = vm.address.city.concat(res);
                } else {
                    abp.notify.error("获取失败");
                }
            });
                   }

               }
               vm.address.init();

               vm.time = {
                   now: new Date(Date.now()),
                   today: function () {
                       var left = format(-1);
                       vm.table.filter.start = left;
                       vm.table.filter.end = vm.time.now;
                       vm.init();
                   },
                   yesterday: function () {
                       var left = format(-1);
                       vm.table.filter.start = left;
                       vm.table.filter.end = vm.time.now;
                       vm.init();
                   },
                   less7: function () {
                       var left = format(-7);
                       vm.table.filter.start = left;
                       vm.table.filter.end = vm.time.now;
                       vm.init();
                   },
                   less30: function () {
                       var left = format(-30);
                       vm.table.filter.start = left;
                       vm.table.filter.end = vm.time.now;
                       vm.init();
                   },
               }
               function format(AddDayCount) {
                   var dd = new Date(Date.now());
                   dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期 
                   return dd;
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
               //获取用户数据集，并且添加配置项
               vm.init = function () {
                   vm.table.filter.pageNum = vm.table.pageConfig.currentPage;
                   vm.table.filter.pageSize = vm.table.pageConfig.itemsPerPage;
                   dataFactory.action("api/order/recordorder", "", null, vm.table.filter)
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
           }
        ]);
})();

