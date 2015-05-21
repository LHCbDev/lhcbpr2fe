/**=========================================================
 * Module:lhcbpr-job-descriptions.js
 * Provides a simple demo for typeahead
 =========================================================*/

App.controller('JobsController', 
     ["$scope", function ($scope) {
 
 }]);


App.controller('JobsListController', 
     ["$scope", "$filter", "$q", "ngTableParams", "ngDialog", "lhcbprResources", "$timeout",
       function ($scope, $filter, $q, ngTableParams, ngDialog, lhcbprResources, $timeout) {
    
    $scope.jobsIds = [];
    $scope.isShowSearchForm = true;
	
	$scope.cachedJobs = {}

	$scope.jobsTableParams = new ngTableParams({
        	page: 1,            // show first page
        	count: 10          // count per page
    	}, {
        	total: 0, // length of data
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
    		}
    });

	$scope.attrsTableParams = new ngTableParams({
        	page: 1,            // show first page
        	count: 10          // count per page
    	}, {
        	total: 0, // length of data
        	getData: function($defer, params) {
	            // use build-in angular filter
	
	            lhcbprResources.all("compare").getList(
				{
					ids: $scope.jobsIds.join(),
					contains: $scope.contains,
					page: params.page(),
					page_size: params.count()
				}).then(function(attrs){
		            if(attrs._resultmeta) {
		    			params.total(attrs._resultmeta.count)
		    		}
	        		$defer.resolve(attrs)
        		});
    		}
    });

	// Fix bug in ng-table
	$scope.jobsTableParams.settings().$scope = $scope;
	$scope.attrsTableParams.settings().$scope = $scope;
 

	$scope.showResults = function(job) {
		// console.log(job.resource_uri);
	};

	$scope.onJobsFound = function(params) {
		// console.log("AAA", params);
		$scope.searchParams = params;
		$scope.jobsTableParams.page(1);
		$scope.jobsIds = [];
		$scope.jobsTableParams.reload();
	};

	$scope.isDisabledCompare = function() {
		return $scope.jobsIds && $scope.jobsIds.length == 0;
	}


	var showAttributes = function (attributes) {
		console.log(attributes)
	}

	var reloadAttrsTable = function() {
		$scope.attrsTableParams.page(1);
		$scope.attrsTableParams.reload();

		console.log($scope.cachedJobs);
	}

	$scope.$watch("attrFilter", function(val) {
		$scope.contains = val;
		reloadAttrsTable();
	});

	$scope.compare = function(ids) {
		var requestIds = [];
		$scope.isShowSearchForm  = false;
		$scope.jobsIds = ids;

		for (var i = 0, l = ids.length; i < l; ++i) {
			var promises = []
			promises.push(
				lhcbprResources.one('jobs', ids[i]).get().then(
					function (job) {
						$scope.cachedJobs[job.id] = job 
					}
				)
			);

			$q.all(promises).then(reloadAttrsTable);
		}
	}

	$scope.getJobName = function (id) {
		var job = $scope.cachedJobs[id]
		if (job) {
			var av = job.job_description.application_version;
			return av.application.name + " " + av.version + "(id=" + job.id + ")";
		} else {
			return "undefined";
		}
	}

	$scope.showCompareButton = function(dtype) {
		return dtype === "Integer" || dtype === "Float";
	}

	$scope.trend = function(attr) {
		$scope.isShowTrend = true;
		attr.jobvalues.reverse();
		$scope.attr = attr;
		var labels = attr.jobvalues.map(function(v) {return $scope.getJobName(v.job.id);});
		$scope.mean = attr.jobvalues.reduce(function(prev, curr){
		 return prev + parseFloat(curr.value)}, 0) / attr.jobvalues.length;
		$scope.err = Math.sqrt(attr.jobvalues.reduce(function(prev, curr){
		 return prev + Math.pow(parseFloat(curr.value) - $scope.mean, 2);}, 0) / (attr.jobvalues.length - 1));
		var datasets =  [
	        {
	          label: attr.name,
	          fillColor : 'rgba(0,255,0,0)',
	          strokeColor : 'blue',
	          pointColor : 'blue',
	          pointStrokeColor : '#fff',
	          pointHighlightFill : '#fff',
	          pointHighlightStroke : 'blue',
	          data : attr.jobvalues.map(function(v) {return parseFloat(v.value);})
	        }
		];
		if (attr.thresholds.length > 0) {
			datasets.push(
				{
		          label: 'Upper threshold',
		          fillColor : 'rgba(35,183,229,0)',
		          strokeColor : 'red',
		          pointColor : 'red',
		          pointStrokeColor : '#fff',
		          pointHighlightFill : '#fff',
		          pointHighlightStroke : 'red',
		          data : attr.jobvalues.map(function(v) { return attr.thresholds[0].up_value;})
        		}
        	);
        	datasets.push({
			          label: 'Down threshold',
			          fillColor : 'rgba(35,183,229,0)',
			          strokeColor : 'green',
			          pointColor : 'green',
			          pointStrokeColor : '#fff',
			          pointHighlightFill : '#fff',
			          pointHighlightStroke : 'green',
			          data : attr.jobvalues.map(function(v) { return attr.thresholds[0].down_value;})
        			}
        	);
		}
	 	var lineData = {
	 		"labels": labels,
	 		"datasets": datasets
	 	}
		$scope.lineData = lineData;
	}

}]);

App.controller('JobsDetailController', ["$scope", "$filter", "$stateParams", "ngTableParams", "lhcbprResources", 
	function($scope, $filter, $stateParams, ngTableParams, lhcbprResources) {

    var createTable = function(data) {
    	//console.log(data);
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

