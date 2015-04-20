/**=========================================================
 * Module:lhcbpr-job-descriptions.js
 * Provides a simple demo for typeahead
 =========================================================*/

App.controller('JobsController', 
     ["$scope", function ($scope) {
 
 }]);


App.controller('JobsListController', 
     ["$scope", "$filter", "$q", "ngTableParams", "lhcbprResources", function ($scope, $filter, $q, ngTableParams, lhcbprResources) {
    
    $scope.jobs = [];
	$scope.tableParams = new ngTableParams({
        	page: 1,            // show first page
        	count: 10          // count per page
    	}, {
        	total: $scope.jobs.length, // length of data
        	getData: function($defer, params) {
	            // use build-in angular filter
	            var orderedData = params.sorting() ?
	                    $filter('orderBy')($scope.jobs, params.orderBy()) :
	                    $scope.jobs;
	    
	            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        	}
    	});

	// Fix bug in ng-table
	$scope.tableParams.settings().$scope = $scope;
 

	$scope.showResults = function(job) {
		console.log(job.resource_uri);
	};

	$scope.onJobsFound = function(jobs) {
		console.log("IN", jobs);
		$scope.jobs = jobs;	
		$scope.tableParams.reload();
	};

}]);

App.controller('JobsDetailController', ["$scope", "$filter", "$stateParams", "ngTableParams", "lhcbprResources", 
	function($scope, $filter, $stateParams, ngTableParams, lhcbprResources) {

    var createTable = function(data) {
    	console.log(data);
		$scope.tableParams = new ngTableParams({
        	page: 1,            // show first page
        	count: 10          // count per page
    	}, {
        	total: data.length, // length of data
        	getData: function($defer, params) {
	            // use build-in angular filter
	            var orderedData = params.sorting() ?
	                    $filter('orderBy')(data, params.orderBy()) :
	                    data;
	    
	            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        	}
    	});
    }

	lhcbprResources.one("jobs", $stateParams.job).get().then(function(job){
		$scope.job = job;
		createTable(job.results);
	});
}]);

