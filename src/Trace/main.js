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
  //  'ueditor'
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
MetronicApp.controller('SidebarController', ['$state', '$scope', function ($state, $scope) {
    var vm = this;

    $scope.$on('$includeContentLoaded', function () {
        Layout.initSidebar($state); // init sidebar
    });
    vm.list = [
      {
          url: "", title: "积分商城", icon: "fa fa-suitcase", child: [
               { url: "integral", title: "积分商城管理", icon: "fa fa-sticky-note" },
                { url: "plan", title: "积分详情订单", icon: "fa fa-sticky-note" }
          ]
      },
         {
             url: "", title: "在线商城", icon: "fa fa-suitcase", child: [
                  { url: "map", title: "首页管理", icon: "fa fa-sticky-note" },
                  { url: "record", title: "Banner图", icon: "fa fa-bars" },
                   { url: "plan", title: "商品管理", icon: "fa fa-sticky-note" },
                   { url: "plan", title: "订单页", icon: "fa fa-sticky-note" }
             ]
         },
           {
               url: "", title: "用户管理", icon: "fa fa-suitcase", child: [
                    { url: "plan", title: "用户管理", icon: "fa fa-sticky-note" }
               ]
           },
           {
               url: "", title: "成就系统", icon: "fa fa-suitcase", child: [
                    { url: "plan", title: "游迹成就", icon: "fa fa-sticky-note" },
                    { url: "record", title: "纪念章成就", icon: "fa fa-bars" },
               ]
           },
           {
               url: "", title: "系列管理", icon: "fa fa-suitcase", child: [
                    { url: "plan", title: "系列管理", icon: "fa fa-sticky-note" }

               ]
           },
           {
               url: "", title: "统计管理", icon: "fa fa-suitcase", child: [
                    { url: "plan", title: "概览", icon: "fa fa-sticky-note" }

               ]
           }
    ];

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


    $stateProvider
        //活动管理
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
    //方案管理

    $stateProvider
        //活动管理
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

}]);
