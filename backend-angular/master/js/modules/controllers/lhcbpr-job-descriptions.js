/**=========================================================
 * Module:lhcbpr-job-descriptions.js
 * Provides a simple demo for typeahead
 =========================================================*/
App.controller('LHCbPRJobDescriptionsController', 
     ["$scope", "$q", "lhcbprResources", function ($scope, $q, lhcbprResources) {
    $scope.is_loading = true;
    lhcbprResources.Application.query().$promise.then(
        function(apps) {
            $scope.apps = apps;
        }
    )
}]);