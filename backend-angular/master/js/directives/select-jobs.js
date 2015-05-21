/**=========================================================
 * Directive: Select jobs
 =========================================================*/

App.directive('selectJobs', ["ngTableParams", "ngDialog", "lhcbprResources", 
	function(ngTableParams, ngDialog, lhcbprResources){
	return {
		templateUrl: 'app/views/directives/select-jobs.html',
    	scope: { 
    		onJobsSelected: '&' 
    	},
		link: function(scope, element, attrs){

			scope.jobsIds = [];
			scope.searchParams = undefined;
			scope.jobsTableParams = new ngTableParams({
	        	page: 1,            // show first page
	        	count: 10          // count per page
	    	}, {
	        	total: 0, // length of data
	        	getData: function($defer, params) {
		            // use build-in angular filter
		            if (!scope.searchParams) {
		            	return;
		            }
		            lhcbprResources.all("search-jobs").getList({
						application: scope.searchParams.apps.join(),
						versions: scope.searchParams.versions.join(),
						options: scope.searchParams.options.join(),
						page: params.page(),
						page_size: params.count()
					}).then(function(jobs){
			            if(jobs._resultmeta) {
			    			params.total(jobs._resultmeta.count);
			    		}
			            // $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
		        		$defer.resolve(jobs);
	        		});
	    		}
		    });

			scope.onJobsFound = function(params){
				console.log('params: ', params);
				scope.searchParams = params;
				scope.jobsTableParams.page(1);
				scope.jobsIds = [];
				scope.jobsTableParams.reload();
			}

			scope.callback = function(){
				console.log('scope.jobsIds: ', scope.jobsIds);
				scope.onJobsSelected({ jobIds: scope.jobsIds });
			}
		}
	}
}]);
