angular.module('main.services', [])

.factory('Networking', function($http, $q) {
    return {
        getProcesses: function(app) {
            var deferred = $q.defer();
            $http.post("/scripts/getProcesses.php", {app: app})
            .success(function(data, status, headers, config) {
                deferred.resolve(data);
            });
            return deferred.promise;
        },
        getControls: function(app, process) {
            var deferred = $q.defer();
            deferred.resolve([
                ["ReIM.IM.01","The system is configured to use the receipt of goods date when determining the terms during invoice matching."],
                ["ReIM.IM.02","The system is configured to use the receipt of goods date when determining the terms during invoice matching."],
                ["ReIM.IM.03","The system is configured to use the receipt of goods date when determining the terms during invoice matching."],
                ["ReIM.IM.04","The system is configured to use the receipt of goods date when determining the terms during invoice matching."]
            ]);
            return deferred.promise;
        },
        getControl: function(app, process, controlid) {
            var deferred = $q.defer();
            deferred.resolve({
                control_id: "ReIM.IM.01",
                module: "Retail Invoice Matching",
                sub_process: "Invoice Matching",
                f_o_ind: "Financial",
                control_description: "The system is configured to use the receipt of goods date when determining the terms during invoice matching.",
                c: "X",
                a: "X",
                v: null,
                r: null,
                control_method: "Automated",
                control_type: "Preventative",
                navigation_path: "1. Administration / Supplier Options",
                test_procedures: "1) Review report ReIM.IM.01.\n2) Follow up with management on any supplier that is configured to use the invoice terms only.",
                expected_result: "1) All suppliers are configured with 'USE_INVOICE_TERMS_IND' as 'N'\n2) All suppliers are configured with 'ROG_DATE_ALLOWED_IND' as 'Y'.",
                control_activity_narratives: "CAN_ReIM.IM.01",
                retail_report: "ReIM.IM.01"
            });
            return deferred.promise;
        }
    }
});