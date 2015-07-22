/**=========================================================
 * Module: lhcbpr/search-jobs.js
 * Search jobs
 =========================================================*/

App.directive('searchJobs', ["lhcbprResources", '$location', function(lhcbprResources, $location){
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
			scope.app = undefined;

			scope.withNightly = ( $location.search().withNightly === true );
			scope.nightlyVersionNumber = parseInt($location.search().nightlyVersionNumber);
			if(isNaN(scope.nightlyVersionNumber))
				scope.nightlyVersionNumber = 1;

			scope.$watch("app", function(newApp) {
				if (newApp !== undefined) {
					scope.update();
				}
			});

			scope.update = function(){
				scope.applicationIds = [scope.app.id];
				if(scope.filterVersions !== 'false'){
					scope.versionsFiltered = false;
					lhcbprResources.all(
						"active/applications/" + scope.app.id +'/versions/'
					).getList({
						withNightly: scope.withNightly,
						nightlyVersionNumber: scope.nightlyVersionNumber
					}).then(
						function(versions){
							scope.versionsIds = [];
							scope.versions = versions;
							var paramsVersions = $location.search().versions;
							if(paramsVersions){
								if(typeof paramsVersions === 'string')
									paramsVersions = [ parseInt(paramsVersions) ];
								else
									paramsVersions = paramsVersions.map(function(v){
										return parseInt(v);
									});
								var allVersionsIds = [];
								versions.forEach(function(version){
									version.values.forEach(function(value){
										allVersionsIds.push(value.id);
									});
								});
								scope.versionsIds = paramsVersions.filter(function(v){
									return allVersionsIds.indexOf(v) != -1;
								});
								console.log('paramsVersions: ', paramsVersions);
								console.log('scope.versionsIds: ', scope.versionsIds);
							}
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
						var paramsOptions = $location.search().options;
						if(paramsOptions){
							if(typeof paramsOptions === 'string')
								scope.optionsIds = [ parseInt(paramsOptions) ];
							else
								scope.optionsIds = paramsOptions.map(function(op){
									return parseInt(op);
								});
						} else {
							scope.allOptionsIds = getAllIds(options);
							scope.optionsIds = scope.optionsIds.filter(function(el){
								return scope.allOptionsIds.indexOf(el) != -1;
							});
						}
						scope.optionsFiltered = true;
						scope.searchJobs();
					});
				}
			}

			var getAllIds = function(objs) {
				return objs.map(function(obj) { 
					return obj.id;
				});
			};

			scope.searchJobs = function() {
				console.log('Search Jobs Called !');
				if(scope.optionsFiltered && scope.versionsFiltered){
					var selectedVersions = scope.versionsIds;
					if(selectedVersions.length < 1){
						selectedVersions = [];
						scope.versions.forEach(function(v){
							selectedVersions = selectedVersions.concat(getAllIds(v.values));
						});
					}
					scope.onFound({'searchParams': {
						apps: scope.applicationIds,
						options: scope.optionsIds,
						versions: selectedVersions
					}});
					$location.search('apps', scope.applicationIds);
					$location.search('options', scope.optionsIds);
					$location.search('versions', scope.versionsIds);
					$location.search('withNightly', scope.withNightly);
					$location.search('nightlyVersionNumber', scope.nightlyVersionNumber);
				}
			};

			lhcbprResources.all("active/applications").getList().then(
				function(apps){
					scope.apps = apps;
					if($location.search().apps){
						var id = $location.search().apps;
						apps.forEach(function(a){
							if(id == a.id)
								scope.app = a;
						});
					}
				}
			);

		}
	}
}]);
