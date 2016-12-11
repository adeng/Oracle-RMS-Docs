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
        getControl: function(app, process, controlid) {
            var deferred = $q.defer();
            var obj = {
                app: app,
                process: process,
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