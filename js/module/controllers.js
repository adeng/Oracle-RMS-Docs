angular.module('main.controllers', [])

.controller('GlobalCtrl', function($scope, $state, $rootScope) {
    Chart.defaults.global.responsive = true;
    Chart.defaults.global.maintainAspectRatio = false;

    $rootScope.nav = function(state, payload) {
        $state.go(state, payload);
    }
})

.controller('MainCtrl', function($scope, $rootScope) {
    $rootScope.loc = "main";
    
})

.controller('DocsAppCtrl', function($scope, $rootScope) {
    $rootScope.loc = "docs";

})

.controller('DocsProcessCtrl', function($scope, $stateParams, $rootScope, Networking) {
    $scope.processSearch = "";
    $rootScope.loc = "docs";
    $scope.app = $stateParams.app;
    Networking.getProcesses($scope.app).then(function(val) {
        $scope.processes = val;
    });

    $scope.search = function(item){
        if (!$scope.processSearch || (item.toLowerCase().indexOf($scope.processSearch) != -1)){
            return true;
        }
        return false;
    };
})

.controller('DocsControlCtrl', function($scope, $stateParams, $rootScope, Networking) {    $rootScope.loc = "docs";
    $scope.controlSearch;
    $scope.app = $stateParams.app;
    $scope.process = $stateParams.process;
    Networking.getControls($stateParams.app, $stateParams.process).then(function(val) {
        $scope.controls = val;
    });
    
    $scope.search = function(item){
        console.log($scope.controlSearch);
        if (!$scope.controlSearch || (item[1].toLowerCase().indexOf($scope.controlSearch) != -1) || (item[0].toLowerCase().indexOf($scope.controlSearch) != -1) ){
            return true;
        }
        return false;
    };
})

.controller('DocsControlSelectedCtrl', function($scope, $stateParams, $rootScope, Networking) {
    $rootScope.loc = "docs";
    $scope.app = $stateParams.app;
    $scope.process = $stateParams.process;
    $scope.controlid = $stateParams.controlid;
    Networking.getControl($stateParams.app, $stateParams.process, $stateParams.controlid).then(function(val) {
        $scope.control = val;
    });
});