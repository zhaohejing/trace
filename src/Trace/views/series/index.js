(function () {
    angular.module("MetronicApp")
        .controller("views.series.index",
        ["$scope", "$state", "settings", "dataFactory",
            function($scope, $state, settings, dataFactory) {
                // ajax初始化
                $scope.$on("$viewContentLoaded",
                    function() {
                        App.initAjax();
                    });
                var vm = this;
             
            }
        ]);
})();

