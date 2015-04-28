/**=========================================================
 * Directive: Select jobs
 =========================================================*/

App.directive('selectJobs', ["lhcbprResources", function(lhcbprResources){
	return {
		templateUrl: 'app/views/directives/select-jobs.html',
    	scope: { 
    		onJobsSelected: '&' 
    	},
		link: function(scope, element, attrs){
			scope.jobs = {};
			scope.selectedIds = [];

			scope.handleJobs = function(foundJobs){
				console.log('handleJobs called with arg : ', foundJobs);
				if(undefined === foundJobs || undefined === foundJobs.length || 0 === foundJobs.length)
				return;
				scope.jobs = {};
				foundJobs.forEach(function(job){
					if(undefined !== job)
						scope.jobs[job.id] = job;
				});
				for(var i in scope.selectedIds){
					if(undefined === scope.jobs[scope.selectedIds[i]])
						scope.selectedIds.splice(i, 1);
				}
			}

			scope.selectionChanged = function(){
				var selectedJobs = scope.selectedIds.map(function(id){
					return scope.jobs[id];
				});
				scope.onJobsSelected({jobs: selectedJobs});
			}
		}
	}
}]);
