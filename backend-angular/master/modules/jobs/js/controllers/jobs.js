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
	            if (!$scope.searchParams) {
	            	return;
	            }
	            lhcbprResources.all("search-jobs").getList(
				{
							application: $scope.searchParams.apps.join(),
							versions: $scope.searchParams.versions.join(),
							options: $scope.searchParams.options.join(),
							page: params.page(),
							page_size: params.count()
				}).then(function(jobs){
			            if(jobs._resultmeta) {
			    			params.total(jobs._resultmeta.count)
			    		}
			            // $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
		        		$defer.resolve(jobs)
        		});
    		}});

	// Fix bug in ng-table
	$scope.tableParams.settings().$scope = $scope;
 

	$scope.showResults = function(job) {
		console.log(job.resource_uri);
	};

	$scope.onJobsFound = function(params) {
		// console.log("AAA", params);
		$scope.searchParams = params;
		$scope.tableParams.page(1);
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

