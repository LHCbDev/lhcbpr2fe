/**=========================================================
 * Module: lhcbpr/search-jobs.js
 * Search jobs
 =========================================================*/

App.directive('searchJobs', ["lhcbprResources", function(lhcbprResources){
	return {
		templateUrl: 'app/views/directives/search-jobs.html',
    	scope: {
    		onFound: '&',
    		filterOptions: '@',
    		filterVersions: '@',
    		filterJobs: '@'
    	},
		link: function(scope, element, attrs) {
			scope.versionsIds = [];
			scope.applicationIds = [];
			scope.optionsIds = [];

			scope.$watch("app", function(newApp) {
				if (newApp) {
					scope.applicationIds = [newApp.id];
					if(scope.filterVersions !== 'false'){
						lhcbprResources.all(
							"active/applications/" + newApp.id +'/versions/'
						).getList().then(
							function(versions){
								cleanVersionsIds();	
								scope.versions = versions;
								scope.done = ! scope.done;
								searchJobs();
							}
						);
					}
					if(scope.filterOptions !== 'false'){
						lhcbprResources.all("active/applications/" + scope.app.id + "/options").getList(
							{versions: scope.versionsIds.join()}
						).then(function(options){
							scope.options = options;
							scope.allOptionsIds = getAllIds(options);
							// console.log(scope.allOptionsIds, scope.optionsIds);
							scope.optionsIds = scope.optionsIds.filter(function(el){
								return scope.allOptionsIds.indexOf(el) != -1;
							});
							scope.done = ! scope.done;
							searchJobs();
						});
					}
				}
			});

			scope.versionChanged = function(){
				scope.done = true;
				searchJobs();
			};

			scope.optionChanged = function() {
				scope.done = true;
				searchJobs();
			};

			var cleanVersionsIds = function() {
				scope.versionsIds = [];
			};

			var getAllIds = function(objs) {
				return objs.map(function(obj) { return obj.id;});
			};

			var searchJobs = function() {
				if(scope.done){
					scope.onFound({'searchParams': {
							apps: scope.applicationIds,
							options: scope.optionsIds,
							versions: scope.versionsIds,
						}});
  				};
			};

			lhcbprResources.all("active/applications").getList().then(
				function(apps){
					scope.apps = apps;
					scope.done = true;
					searchJobs();
				}
			);
		}
	}
}]);
