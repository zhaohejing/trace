/***
Metronic AngularJS App Main Script
***/

/* Metronic App */
var MetronicApp = angular.module("MetronicApp", [
    "ui.router",//路由
    "ui.bootstrap",//样式
    "oc.lazyLoad",//懒加载
    "ngSanitize",//初始化
    'angularFileUpload',//文件上传
    'abp',
    'ngLocale',
    'smart-table',
    'ui.bootstrap.datetimepicker',
    'ui.dateTimeInput',
    'angular-baidu-map'
]);

//懒加载
MetronicApp.config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        // global configs go here
    });
}]);

//控制器全局设置
MetronicApp.config(['$controllerProvider', function ($controllerProvider) {
    // this option might be handy for migrating old apps, but please don't use it
    // in new ones!
    $controllerProvider.allowGlobals();
}]);
MetronicApp.factory('appSession', [
          function () {
              var session = null;
              var cookie = $.cookie("traceResult");
              if (cookie != "" && cookie != undefined) {
                  var temp = $.parseJSON(cookie);
                  session = temp;
              }
              else {
                  window.location.href = "/index.html";
              }
              return session;
          }
]);
//全局工厂设置
MetronicApp.factory('settings', ['$rootScope', function ($rootScope) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageContentWhite: false, // set page content layout
            pageBodySolid: false, // solid body color state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        assetsPath: 'assets',
        globalPath: 'assets/global',
        layoutPath: 'assets/layouts/layout'
    };
    $rootScope.settings = settings;
    return settings;
}]);

//app控制器
MetronicApp.controller('AppController', ['$scope', '$rootScope', function ($scope, $rootScope) {
    $scope.$on('$viewContentLoaded', function () {
        //App.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 
    });
}]);
/* Setup Layout Part - Header */
MetronicApp.controller('HeaderController', ['$scope', "appSession", function ($scope, appSession) {
    if (!appSession) {
        window.location.href = "index.html";
    }
    $scope.$on('$includeContentLoaded', function () {
        Layout.initHeader(); // init header
    });
    var vm = this;
    vm.user = appSession;
    vm.out = function () {
        $.cookie("traceResult", null, { path: "/" });
        location.href = "index.html";
    }
}]);

/* Setup Layout Part - Sidebar */
MetronicApp.controller('SidebarController', ['$state', '$scope', 'dataFactory', function ($state, $scope, dataFactory) {
    var vm = this;

    $scope.$on('$includeContentLoaded', function () {
        Layout.initSidebar($state); // init sidebar
    });
    vm.list = [];
    dataFactory.action('api/sysmenu/getMenuPerson', "", null, {}).then(function (res) {
        if (res.success) {
            vm.list = res.result;
        } else {
            abp.notify.error(res.error);
        }
    });
    //vm.list = [
    //  {
    //      url: "", title: "积分商城", icon: "fa fa-suitcase", child: [
    //           { url: "integral", title: "积分商城管理", icon: "fa fa-sticky-note" },
    //            { url: "integralrecord", title: "积分详情订单", icon: "fa fa-sticky-note" }
    //      ]
    //  },
    //     {
    //         url: "", title: "在线商城", icon: "fa fa-suitcase", child: [
    //              { url: "figure", title: "首页管理", icon: "fa fa-sticky-note" },
    //              { url: "banner", title: "Banner图", icon: "fa fa-bars" },
    //               { url: "product", title: "商品管理", icon: "fa fa-sticky-note" },
    //               { url: "order", title: "订单页", icon: "fa fa-sticky-note" }
    //         ]
    //     },
    //       {
    //           url: "", title: "用户管理", icon: "fa fa-suitcase", child: [
    //                { url: "users", title: "用户信息", icon: "fa fa-sticky-note" },
    //           { url: "roles", title: "角色信息", icon: "fa fa-sticky-note" }
    //           ]
    //       },
    //       {
    //           url: "", title: "成就系统", icon: "fa fa-suitcase", child: [
    //                { url: "trace", title: "游迹成就", icon: "fa fa-sticky-note" },
    //                { url: "medal", title: "纪念章成就", icon: "fa fa-bars" },
    //           ]
    //       },
    //       {
    //           url: "", title: "系列管理", icon: "fa fa-suitcase", child: [
    //                { url: "series", title: "系列管理", icon: "fa fa-sticky-note" }

    //           ]
    //       },
    //       {
    //           url: "", title: "统计管理", icon: "fa fa-suitcase", child: [
    //                { url: "statistical", title: "概览", icon: "fa fa-sticky-note" }

    //           ]
    //       }
    //];

}]);
/* Setup Layout Part - Footer */
MetronicApp.controller('FooterController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initFooter(); // init footer
    });
}]);

//路由设置
MetronicApp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    // Redirect any unmatched url
    $urlRouterProvider.otherwise("/integral.html");
     
    //积分商城管理
    $stateProvider
        .state("integral",
        {
            url: "/integral.html",
            templateUrl: "views/integralmall/index.html",
            data: { pageTitle: '积分商城管理' },
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load(
                            [
                                {
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before',
                                    files: [
                                        'views/integralmall/index.js'
                                    ]
                                }
                            ]
                        );
                    }
                ]
            }
        });
    //积分商品添加
    $stateProvider
        .state("integralmodify",
        {
            url: "/integral/modify.html",
            templateUrl: "views/integralmall/modify.html",
            data: { pageTitle: '积分商品管理' },
            resolve: {
                deps: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load(
                            [

                                {
                                    name: 'QiNiu',
                                    insertBefore: '#ng_load_plugins_before',
                                    files: [
                                        'assets/global/plugins/plupload/angular-local-storage.js',
                                        'assets/global/plugins/plupload/qupload.js'
                                    ]
                                },
                                {
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before',
                                    files: [
                                        'views/integralmall/modify.js'
                                    ]
                                }
                            ]
                        );
                    }
                ]
            }
        });
    $stateProvider
    //积分商品订单管理额
     .state("integralrecord",
     {
         url: "/integral/record.html",
         templateUrl: "views/integralmall/record.html",
         data: { pageTitle: '积分订单管理' },
         resolve: {
             deps: [
                 '$ocLazyLoad', function ($ocLazyLoad) {
                     return $ocLazyLoad.load(
                         [
                             {
                                 name: 'MetronicApp',
                                 insertBefore: '#ng_load_plugins_before',
                                 files: [
                                     'views/integralmall/record.js'
                                 ]
                             }
                         ]
                     );
                 }
             ]
         }
     });

    $stateProvider
        //轮播图管理
        .state("figure",
        {
            url: "/onlinemall/figure/index.html",
            templateUrl: "views/onlinemall/figure/index.html",
            data: { pageTitle: '轮播图管理' },
            resolve: {
                deps: [
                    '$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load(
                            [{
                                name: 'QiNiu',
                                insertBefore: '#ng_load_plugins_before',
                                files: [
                                    'assets/global/plugins/plupload/angular-local-storage.js',
                                    'assets/global/plugins/plupload/qupload.js'
                                ]
                            },
                                {
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before',
                                    files: [
                                        'views/onlinemall/figure/index.js',
                                        'views/onlinemall/figure/modal.js'

                                    ]
                                }
                            ]
                        );
                    }
                ]
            }
        });
   
    //bannar图管理
    $stateProvider.state("banner",
    {
        url: "/onlinemall/banner/index.html",
        templateUrl: "views/onlinemall/banner/index.html",
        data: { pageTitle: '轮播图管理' },
        resolve: {
            deps: [
                '$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load(
                        [{
                            name: 'QiNiu',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                'assets/global/plugins/plupload/angular-local-storage.js',
                                'assets/global/plugins/plupload/qupload.js'
                            ]
                        },
                            {
                                name: 'MetronicApp',
                                insertBefore: '#ng_load_plugins_before',
                                files: [
                                    'views/onlinemall/banner/index.js',
                                       'views/onlinemall/banner/modal.js'
                                ]
                            }
                        ]
                    );
                }
            ]
        }
    });


    //商品管理
    $stateProvider.state("product",
    {
        url: "/onlinemall/product/index.html",
        templateUrl: "views/onlinemall/product/index.html",
        data: { pageTitle: '轮播图管理' },
        resolve: {
            deps: [
                '$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load(
                        [
                            {
                                name: 'MetronicApp',
                                insertBefore: '#ng_load_plugins_before',
                                files: [
                                    'views/onlinemall/product/index.js'
                                ]
                            }
                        ]
                    );
                }
            ]
        }
    })
        .state("productmodify",
    {
        url: "/onlinemall/product/modify.html",
        templateUrl: "views/onlinemall/product/modify.html",
        data: { pageTitle: '商品管理' },
        resolve: {
            deps: [
                '$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load(
                        [{
                            name: 'QiNiu',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                'assets/global/plugins/plupload/angular-local-storage.js',
                                'assets/global/plugins/plupload/qupload.js'
                            ]
                        },
                            {
                                name: 'MetronicApp',
                                insertBefore: '#ng_load_plugins_before',
                                files: [
                                    'views/onlinemall/product/modify.js'
                                ]
                            }
                        ]
                    );
                }
            ]
        }
    });


    //order管理
    $stateProvider.state("order",
    {
        url: "/onlinemall/order/index.html",
        templateUrl: "views/onlinemall/order/index.html",
        data: { pageTitle: '轮播图管理' },
        resolve: {
            deps: [
                '$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load(
                        [
                            {
                                name: 'MetronicApp',
                                insertBefore: '#ng_load_plugins_before',
                                files: [
                                    'views/onlinemall/order/index.js'
                                ]
                            }
                        ]
                    );
                }
            ]
        }
    });
    //用户管理
    $stateProvider.state("users",
    {
        url: "/manager/users/index.html",
        templateUrl: "views/manager/users/index.html",
        data: { pageTitle: '轮播图管理' },
        resolve: {
            deps: [
                '$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load(
                        [
                            {
                                name: 'MetronicApp',
                                insertBefore: '#ng_load_plugins_before',
                                files: [
                                    'views/manager/users/index.js',
                                    'views/manager/users/modal.js',
                                      'views/common/allowrole.js'
                                ]
                            }
                        ]
                    );
                }
            ]
        }
    });


    //用户管理
    $stateProvider.state("roles",
    {
        url: "/manager/roles/index.html",
        templateUrl: "views/manager/roles/index.html",
        data: { pageTitle: '轮播图管理' },
        resolve: {
            deps: [
                '$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load(
                        [
                            {
                                name: 'MetronicApp',
                                insertBefore: '#ng_load_plugins_before',
                                files: [
                                    'views/manager/roles/index.js',
                                    'views/manager/roles/modal.js',
                                    'views/common/allowpermission.js',
                                    'js/directives/permissionTree.js'

                                ]
                            }
                        ]
                    );
                }
            ]
        }
    });

    //游迹管理
    $stateProvider.state("trace",
    {
        url: "/trace/index.html",
        templateUrl: "views/trace/index.html",
        data: { pageTitle: '游迹管理' },
        resolve: {
            deps: [
                '$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load(
                        [
                            {
                                name: 'MetronicApp',
                                insertBefore: '#ng_load_plugins_before',
                                files: [
                                    'views/trace/index.js'
                                ]
                            }
                        ]
                    );
                }
            ]
        }
    })
        //游记编辑
        .state("tracemodify",
    {
        url: "/trace/modify.html",
        templateUrl: "views/trace/modify.html",
        data: { pageTitle: '游迹管理' },
        resolve: {
            deps: [
                '$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load(
                        [{
                            name: 'QiNiu',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                'assets/global/plugins/plupload/angular-local-storage.js',
                                'assets/global/plugins/plupload/qupload.js'
                            ]
                        },
                            {
                                name: 'MetronicApp',
                                insertBefore: '#ng_load_plugins_before',
                                files: [
                                    'views/trace/modify.js'
                                ]
                            }
                        ]
                    );
                }
            ]
        }
    });

    //纪念章管理
    $stateProvider.state("medal",
    {
        url: "/medal/index.html",
        templateUrl: "views/achievement/medal/index.html",
        data: { pageTitle: '纪念章管理' },
        resolve: {
            deps: [
                '$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load(
                        [
                            {
                                name: 'MetronicApp',
                                insertBefore: '#ng_load_plugins_before',
                                files: [
                                    'views/achievement/medal/index.js'
                                ]
                            }
                        ]
                    );
                }
            ]
        }
    });
    //系列管理
    $stateProvider.state("series",
    {
        url: "/series/index.html",
        templateUrl: "views/series/index.html",
        data: { pageTitle: '系列管理' },
        resolve: {
            deps: [
                '$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load(
                        [
                            {
                                name: 'MetronicApp',
                                insertBefore: '#ng_load_plugins_before',
                                files: [
                                    'views/series/index.js',
                                    'views/series/modal.js'
                                ]
                            }
                        ]
                    );
                }
            ]
        }
    });

    //邮费管理
    $stateProvider.state("postage",
    {
        url: "/postage/index.html",
        templateUrl: "views/postage/index.html",
        data: { pageTitle: '邮费管理' },
        resolve: {
            deps: [
                '$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load(
                        [
                            {
                                name: 'MetronicApp',
                                insertBefore: '#ng_load_plugins_before',
                                files: [
                                    'views/postage/index.js',
                                    'views/postage/modal.js'
                                ]
                            }
                        ]
                    );
                }
            ]
        }
    })
    //统计管理
    $stateProvider.state("statistical",
    {
        url: "/statistical/index.html",
        templateUrl: "views/statistical/index.html",
        data: { pageTitle: '统计管理' },
        resolve: {
            deps: [
                '$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load(
                        [
                            {
                                name: 'MetronicApp',
                                insertBefore: '#ng_load_plugins_before',
                                files: [
                                    'views/statistical/index.js'
                                ]
                            }
                        ]
                    );
                }
            ]
        }
    });
}]);

//启动
MetronicApp.run(["$rootScope", "settings", "$state", function ($rootScope, settings, $state) {
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$settings = settings; // state to be accessed from view
    $rootScope.safeApply = function (fn) {
        var phase = this.$root.$$phase;
        if (phase == '$apply' || phase == '$digest') {
            if (fn && (typeof (fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };
    var token = $.parseJSON(abp.utils.getCookieValue("traceResult")).token;
    var options = {
        url: abp.baseUrl + 'api/qiniu/token',
        headers: { 'Content-Type': 'application/json', "authorization": "Bearer " + token }
    };

    abp.ajax(options).done(function (result) {
        abp.qiniuToken = result.data;
    });
}]);
