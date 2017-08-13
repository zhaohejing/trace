/***
GLobal Directives
***/
Date.prototype.format = function (format) {
    var date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1
               ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
}

// Route State Load Spinner(used on page or content load)
MetronicApp.directive('ngSpinnerBar',
[
    '$rootScope', '$state',
    function ($rootScope, $state) {
        return {
            link: function (scope, element, attrs) {
                // by defult hide the spinner bar
                element.addClass('hide'); // hide spinner bar by default

                // display the spinner bar whenever the route changes(the content part started loading)
                $rootScope.$on('$stateChangeStart',
                    function () {
                        element.removeClass('hide'); // show spinner bar
                    });

                // hide the spinner bar on rounte change success(after the content loaded)
                $rootScope.$on('$stateChangeSuccess',
                    function () {
                        element.addClass('hide'); // hide spinner bar
                        $('body').removeClass('page-on-load'); // remove page loading indicator
                        Layout
                            .setAngularJsSidebarMenuActiveLink('match', null, $state);
                        // activate selected link in the sidebar menu

                        // auto scorll to page top
                        setTimeout(function () {
                            App.scrollTop(); // scroll to the top on content load
                        },
                            $rootScope.settings.layout.pageAutoScrollOnLoad);
                    });

                // handle errors
                $rootScope.$on('$stateNotFound',
                    function () {
                        element.addClass('hide'); // hide spinner bar
                    });

                // handle errors
                $rootScope.$on('$stateChangeError',
                    function () {
                        element.addClass('hide'); // hide spinner bar
                    });
            }
        };
    }
]);

// Handle global LINK click
MetronicApp.directive('a', function () {
    return {
        restrict: 'E',
        link: function (scope, elem, attrs) {
            if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
                elem.on('click', function (e) {
                    e.preventDefault(); // prevent link click for above criteria
                });
            }
        }
    };
});

// Handle Dropdown Hover Plugin Integration
MetronicApp.directive('dropdownMenuHover', function () {
    return {
        link: function (scope, elem) {
            elem.dropdownHover();
        }
    };
});
//数组过滤
(function () {
    'use strict';
    MetronicApp.filter('arrayfilter', function () {
        return function (index, array) {
            for (var i = 0; i < array.length; i++) {
                if (array[i].id === index) {
                    return array[i].name;
                }
            }

        };
    });
})();
//时间转换
(function () {
    'use strict';
    MetronicApp.filter('timeChange', function () {
        return function (time) {
            var newDate = new Date();
            newDate.setTime(time);
            return newDate.format('yyyy-MM-dd h:m:s');
        };
    });
})();
MetronicApp.directive('datetimepickerNeutralTimezone', function () {
    return {
        restrict: 'A',
        priority: 1,
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {
            ctrl.$formatters.push(function (value) {
                var date = new Date(Date.parse(value));
                date = new Date(date.getTime() + (60000 * date.getTimezoneOffset()));
                return date;
            });

            ctrl.$parsers.push(function (value) {
                var date = new Date(value.getTime() - (60000 * value.getTimezoneOffset()));
                return date;
            });
        }
    }
});
