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
    		filterVersions: '@'
    	},
		link: function(scope, element, attrs) {
			scope.versionsIds = [];
			scope.applicationIds = [];
			scope.optionsIds = [];
			scope.versionsFiltered = true;
			scope.optionsFiltered = true;

			scope.$watch("app", function(newApp) {
				if (newApp) {
					scope.applicationIds = [newApp.id];
					if(scope.filterVersions !== 'false'){
						scope.versionsFiltered = false;
						lhcbprResources.all(
							"active/applications/" + newApp.id +'/versions/'
						).getList().then(
							function(versions){
								scope.versionsIds = [];
								scope.versions = versions;
								scope.versionsFiltered = true;
								scope.searchJobs();
							}
						);
					}
					if(scope.filterOptions !== 'false'){
						scope.optionsFiltered = false;
						lhcbprResources.all("active/applications/" + scope.app.id + "/options").getList(
							{versions: scope.versionsIds.join()}
						).then(function(options){
							scope.options = options;
							scope.allOptionsIds = getAllIds(options);
							// console.log(scope.allOptionsIds, scope.optionsIds);
							scope.optionsIds = scope.optionsIds.filter(function(el){
								return scope.allOptionsIds.indexOf(el) != -1;
							});
							scope.optionsFiltered = true;
							scope.searchJobs();
						});
					}
				}
			});

			var getAllIds = function(objs) {
				return objs.map(function(obj) { 
					return obj.id;
				});
			};

			scope.searchJobs = function() {
				if(scope.optionsFiltered && scope.versionsFiltered){
					scope.onFound({'searchParams': {
						apps: scope.applicationIds,
						options: scope.optionsIds,
						versions: scope.versionsIds
					}});
				}
				console.log('scope.filterVersions: ', scope.filterVersions);
				console.log('scope.filterOptions: ', scope.filterOptions);
			};

			lhcbprResources.all("active/applications").getList().then(
				function(apps){
					scope.apps = apps;
					scope.searchJobs();
				}
			);
		}
	}
}]);
