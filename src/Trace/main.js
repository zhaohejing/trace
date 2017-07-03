/***
Metronic AngularJS App Main Script
***/

/* Metronic App */
var MetronicApp = angular.module("MetronicApp", [
    "ui.router",//路由
    "ui.bootstrap",//样式
    "oc.lazyLoad",//懒加载
    "ngSanitize",//初始化
   //   'objectTable',//table表格
   // 'objPagination',//分页
    'angularFileUpload',//文件上传
    'abp',
    'ngLocale',
 //   "isteven-multi-select",//下拉标签
    , "textAngular",
    'angularSpectrumColorpicker',
    'ui.bootstrap.dropdownToggle',
    'smart-table'
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
//富文本编辑设置
MetronicApp.config(function ($provide) {
    $provide.decorator('taOptions', ['taRegisterTool', '$delegate', function (taRegisterTool, taOptions) {
        // $delegate is the taOptions we are decorating
        // register the tool with textAngular

        taRegisterTool('backgroundColor', {
            display: "<div spectrum-colorpicker ng-model='color' on-change='!!color && action(color)' format='\"hex\"' options='options'></div>",
            action: function (color) {
                var me = this;
                if (!this.$editor().wrapSelection) {
                    setTimeout(function () {
                        me.action(color);
                    }, 100)
                } else {
                    return this.$editor().wrapSelection('backColor', color);
                }
            },
            options: {
                replacerClassName: 'fa fa-paint-brush', showButtons: false
            },
            color: "#fff"
        });
        taRegisterTool('fontColor', {
            display: "<spectrum-colorpicker trigger-id='{{trigger}}' ng-model='color' on-change='!!color && action(color)' format='\"hex\"' options='options'></spectrum-colorpicker>",
            action: function (color) {
                var me = this;
                if (!this.$editor().wrapSelection) {
                    setTimeout(function () {
                        me.action(color);
                    }, 100)
                } else {
                    return this.$editor().wrapSelection('foreColor', color);
                }
            },
            options: {
                replacerClassName: 'fa fa-font', showButtons: false
            },
            color: "#000"
        });





        taRegisterTool('fontSize', {
            display: "<span class='bar-btn-dropdown dropdown'>" +
            "<button class='btn btn-blue dropdown-toggle' type='button' ng-disabled='showHtml()' style='padding-top: 4px'><i class='fa fa-text-height'></i><i class='fa fa-caret-down'></i></button>" +
            "<ul class='dropdown-menu'><li ng-repeat='o in options'><button class='btn btn-blue checked-dropdown' style='font-size: {{o.css}}; width: 100%' type='button' ng-click='action($event, o.value)'><i ng-if='o.active' class='fa fa-check'></i> {{o.name}}</button></li></ul>" +
            "</span>",
            action: function (event, size) {
                //Ask if event is really an event.
                if (!!event.stopPropagation) {
                    //With this, you stop the event of textAngular.
                    event.stopPropagation();
                    //Then click in the body to close the dropdown.
                    $("body").trigger("click");
                }
                return this.$editor().wrapSelection('fontSize', parseInt(size));
            },
            options: [
                { name: '极小', css: 'xx-small', value: 1 },
                { name: '微小', css: 'x-small', value: 2 },
                { name: '小', css: 'small', value: 3 },
                { name: '中', css: 'medium', value: 4 },
                { name: '大', css: 'large', value: 5 },
                { name: '很大', css: 'x-large', value: 6 },
                { name: '极大', css: 'xx-large', value: 7 }

            ]
        });
        // add the button to the default toolbar definition
        taOptions.toolbar[1].push('backgroundColor', 'fontColor', 'fontName', 'fontSize');
        return taOptions;
    }]);
});