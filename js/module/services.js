angular.module('main.services', [])

.factory('Networking', function($http, $q) {
    return {
        getProcesses: function(app) {
            var deferred = $q.defer();
            var obj = {
                app: app
            };
            $http.post("/scripts/getProcesses.php", obj)
            .success(function(data, status, headers, config) {
                deferred.resolve(data);
            });
            return deferred.promise;
        },
        getControls: function(app, process) {
            var deferred = $q.defer();
            var obj = {
                app: app,
                process: process
            };
            $http.post("/scripts/getControls.php", obj)
            .success(function(data, status, headers, config) {
                deferred.resolve(data);
            });
            return deferred.promise;
        },
        getAllControls: function(app) {
            var deferred = $q.defer();
            var obj = {
                app: app
            };
            $http.post("/scripts/getAllControls.php", obj)
            .success(function(data, status, headers, config) {
                deferred.resolve(data);
            });
            return deferred.promise;
        },
        getAllRisks: function(app) {
            var module_map = {
                'Retail Invoice Matching': 'ReIM'
            };

            var deferred = $q.defer();
            var obj = {
                app: module_map[app]
            };
            $http.post("/scripts/getAllRisks.php", obj)
            .success(function(data, status, headers, config) {
                deferred.resolve(data);
            });
            return deferred.promise;
        },
        getRisk: function(risk_no) {
            var deferred = $q.defer();
            var obj = {
                risk_no: risk_no
            };
            $http.post("/scripts/getRisk.php", obj)
            .success(function(data, status, headers, config) {
                deferred.resolve(data);
            });
            return deferred.promise;
        },
        getControl: function(app, process, controlid) {
            var deferred = $q.defer();
            var obj = {
                controlid: controlid
            };
            $http.post("/scripts/getControl.php", obj)
            .success(function(data, status, headers, config) {
                deferred.resolve(data);
            });
            return deferred.promise;
        }
    }
});