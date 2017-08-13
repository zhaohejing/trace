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
                                    name: 'a',
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
            url: "/integral/modify.html/:id",
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
                                    name: 'b',
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
                                 name: 'c',
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
                                    name: 'd',
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
                                name: 'e',
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
                                name: 'f',
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
        url: "/onlinemall/product/modify.html/:id",
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
                                name: 'g',
                                insertBefore: '#ng_load_plugins_before',
                                files: [
                                    'views/onlinemall/product/modify.js',
                                    'views/onlinemall/product/choose.js'
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
                                name: 'h',
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
                                name: 'i',
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
                                name: 'j',
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
                                name: 'k',
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
        url: "/trace/modify.html:id",
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
                                name: 'l',
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
        data: { pageTitle: '成就管理' },
        resolve: {
            deps: [
                '$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load(
                        [
                            {
                                name: 'm',
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
    })
        .state("medalmodify",
    {
        url: "/medal/modify.html:id",
        templateUrl: "views/achievement/medal/modify.html",
        data: { pageTitle: '成就编辑' },
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
                                name: 'n',
                                insertBefore: '#ng_load_plugins_before',
                                files: [
                                    'views/achievement/medal/modify.js',
                                    'views/achievement/medal/choose.js'
                                ]
                            }
                        ]
                    );
                }
            ]
        }
    });

    //游迹成就管理
    $stateProvider.state("traceachi",
    {
        url: "/traceachi/index.html",
        templateUrl: "views/achievement/trace/index.html",
        data: { pageTitle: '成就管理' },
        resolve: {
            deps: [
                '$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load(
                        [
                            {
                                name: 'o',
                                insertBefore: '#ng_load_plugins_before',
                                files: [
                                    'views/achievement/trace/index.js',
                                     'views/common/choose.js'
                                ]
                            }
                        ]
                    );
                }
            ]
        }
    })
        .state("traceachimodify",
    {
        url: "/traceachi/modify.html:id",
        templateUrl: "views/achievement/trace/modify.html",
        data: { pageTitle: '成就编辑' },
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
                                name: 'p',
                                insertBefore: '#ng_load_plugins_before',
                                files: [
                                    'views/achievement/trace/modify.js',
                                     'views/achievement/trace/choose.js'
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
                                name: 'q',
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
                '$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load(
                        [
                            {
                                name: 'r',
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
    });
    //统计管理
    //概述
    $stateProvider.state("overview",
        {
            url: "/overview/index.html",
            templateUrl: "views/statistical/overview/index.html",
            data: { pageTitle: '概述' },
            resolve: {
                deps: [
                    '$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load(
                            [
                                {
                                    name: 's',
                                    insertBefore: '#ng_load_plugins_before',
                                    files: [
                                        'views/statistical/overview/index.js'
                                    ]
                                }
                            ]
                        );
                    }
                ]
            }
        })
        //购买记录
        .state("purchaserecords",
        {
            url: "/purchaserecords/index.html",
            templateUrl: "views/statistical/purchaserecords/index.html",
            data: { pageTitle: '购买记录' },
            resolve: {
                deps: [
                    '$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load(
                            [
                                {
                                    name: 't',
                                    insertBefore: '#ng_load_plugins_before',
                                    files: [
                                        'views/statistical/purchaserecords/index.js'
                                    ]
                                }
                            ]
                        );
                    }
                ]
            }
        })
        //购买记录-扫描
        .state("purchasescan",
        {
            url: "/purchasescan/index.html",
            templateUrl: "views/statistical/purchaserecords/index.html",
            data: { pageTitle: '购买记录-扫描' },
            resolve: {
                deps: [
                    '$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load(
                            [
                                {
                                    name: 'u',
                                    insertBefore: '#ng_load_plugins_before',
                                    files: [
                                        'views/statistical/purchasescan/index.js'
                                    ]
                                }
                            ]
                        );
                    }
                ]
            }
        })
        //购买记录-时段
        .state("purchasetime",
        {
            url: "/purchasetime/index.html",
            templateUrl: "views/statistical/purchasetime/index.html",
            data: { pageTitle: '购买记录-扫描' },
            resolve: {
                deps: [
                    '$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load(
                            [
                                {
                                    name: 'v',
                                    insertBefore: '#ng_load_plugins_before',
                                    files: [
                                        'views/statistical/purchasetime/index.js'
                                    ]
                                }
                            ]
                        );
                    }
                ]
            }
        })
        //游迹获取记录
        .state("gaintrace",
        {
            url: "/gaintrace/index.html",
            templateUrl: "views/statistical/gaintrace/index.html",
            data: { pageTitle: '游迹获取记录' },
            resolve: {
                deps: [
                    '$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load(
                            [
                                {
                                    name: 'w',
                                    insertBefore: '#ng_load_plugins_before',
                                    files: [
                                        'views/statistical/gaintrace/index.js'
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
