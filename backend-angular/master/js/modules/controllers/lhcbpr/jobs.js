/**=========================================================
 * Module:lhcbpr-job-descriptions.js
 * Provides a simple demo for typeahead
 =========================================================*/

App.controller('JobsController', 
     ["$scope", function ($scope) {
 
 }]);


App.controller('JobsListController', 
     ["$scope", "$filter", "$q", "ngTableParams", "lhcbprResources", function ($scope, $filter, $q, ngTableParams, lhcbprResources) {
    var createTable = function(data) {
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

	lhcbprResources.all('jobs').getList()
	.then(function(jobs) {
		createTable(jobs);
 	});

	$scope.showResults = function(job) {
		console.log(job.resource_uri);
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

