/**=========================================================
 * Module: lhcbpr/search-jobs.js
 * Search jobs
 =========================================================*/

App.directive('searchJobs', ["lhcbprResources", function(lhcbprResources){
	return {
		templateUrl: ('app/views/lhcbpr/search-jobs.html'),
    	scope: {onJobsFound: '&'},
		link: function(scope, element, attrs) {
			scope.versionsIds = [];
			scope.applicationIds = [];
			scope.optionsIds = []

			lhcbprResources.all("active/applications").getList().then(
				function(apps){
					scope.apps = apps;
				}
			);

			scope.$watch("app", function(newApp) {
				if (newApp) {
					scope.applicationIds = [newApp.id]
					lhcbprResources.all(
						"active/applications/" + newApp.id +'/versions/'
					).getList().then(
						function(versions){
							cleanVersionsIds();	
							scope.versions = versions;
							scope.versionChanged();
						}
					);
				}
			});

			scope.versionChanged = function(){
				lhcbprResources.all("active/applications/" + scope.app.id + "/options").getList(
					{versions: scope.versionsIds.join()}
				).then(function(options){
					scope.options = options;
					scope.allOptionsIds = getAllIds(options);
					console.log(scope.allOptionsIds, scope.optionsIds);
					scope.optionsIds = scope.optionsIds.filter(function(el){
						return scope.allOptionsIds.indexOf(el) != -1;
					});
					searchJobs();
				});
			};

			scope.optionChanged = function() {
				searchJobs();
			};

			var cleanVersionsIds = function() {
				scope.versionsIds = []
			};

			var getAllIds = function(objs) {
				return objs.map(function(obj) { return obj.id;})
			};

			var searchJobs = function() {
				lhcbprResources.all("search-jobs").getList(
					{
						application: scope.applicationIds.join(),
						versions: scope.versionsIds.join(),
						options: scope.optionsIds.join()
					}
					).then(function(jobs){
					scope.onJobsFound({jobs:jobs});
				});
			};
			searchJobs();
		}
	}
}]);
