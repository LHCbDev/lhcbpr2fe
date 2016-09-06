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
			filterExecutables: '@',
    		filterVersions: '@',
			filterPlatforms: '@',
			selectedApp: '@',
			selectedOptions: '@'
    	},
		link: function(scope, element, attrs) {
			scope.versionsIds = [];
			scope.applicationIds = [];
			scope.platformsIds = [];
			scope.optionsIds = [];
			scope.executablesIds = [];
			scope.versionsFiltered = true;
			scope.optionsFiltered = true;
			scope.platformsFiltered = true;
			scope.executablesFiltered = true;
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
						scope.options = [];
						scope.optionsIds = []
						if (scope.selectedOptions) {
							var selectedOptionsArr = [];
							if (angular.isString(scope.selectedOptions)){
								selectedOptionsArr.push(scope.selectedOptions)
							}else{
								selectedOptionsArr = scope.selectedOptions;
							}

							options.forEach(function(opt){
								if (selectedOptionsArr.indexOf(opt.name) != -1) {
									scope.optionsIds.push(opt.id); 
									scope.options.push(opt);
								}
							});

						}else {
							scope.options = options;
						}
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
				if(scope.filterExecutables !== 'false'){
					scope.exectablesFiltered = false;
					lhcbprResources.all("active/applications/" + scope.app.id + "/executables").getList(
						{executables: scope.executablesIds.join()}
					).then(function(executables){
						scope.executables = executables;
						var paramsExecutables = $location.search().executables;
						if(paramsExecutables){
							if(typeof paramsExecutables === 'string')
								scope.executablesIds = [ parseInt(paramsExecutables) ];
							else
								scope.executablesIds = paramsExecutables.map(function(op){
									return parseInt(op);
								});
						} else {
							scope.allExecutablesIds = getAllIds(executables);
							scope.executablesIds = scope.executablesIds.filter(function(el){
								return scope.allExecutablesIds.indexOf(el) != -1;
							});
						}
						scope.executablesFiltered = true;
						scope.searchJobs();
					});
				}

				if(scope.filterPlatforms !== 'false'){
					scope.platformsFiltered = false;
					lhcbprResources.all("active/applications/" + scope.app.id + "/platforms").getList(
						{platforms: scope.platformsIds.join()}
					).then(function(platforms){
						scope.platforms = platforms;
						var paramsPlatforms = $location.search().platforms;
						if(paramsPlatforms){
							if(typeof paramsPlatforms === 'string')
								scope.platformsIds = [ parseInt(paramsPlatforms) ];
							else
								scope.platformsIds = paramsPlatforms.map(function(op){
									return parseInt(op);
								});
						} else {
							scope.allPlatformsIds = getAllIds(platforms);
							scope.platformsIds = scope.platformsIds.filter(function(el){
								return scope.allPlatformsIds.indexOf(el) != -1;
							});
						}
						scope.platformsFiltered = true;
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
				if(scope.optionsFiltered && scope.versionsFiltered && scope.platformsFiltered){

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
						executables: scope.executablesIds,
						versions: selectedVersions,
						platforms: scope.platformsIds
					}});

					$location.search('apps', scope.applicationIds);
					$location.search('options', scope.optionsIds);
					$location.search('executables', scope.executablesIds);
					$location.search('platforms', scope.platformsIds);
					$location.search('versions', scope.versionsIds);
					$location.search('withNightly', scope.withNightly);
					$location.search('nightlyVersionNumber', scope.nightlyVersionNumber);
				}
			};

			lhcbprResources.all("active/applications").getList().then(
				function(apps){
					console.log(scope.selectedApp);
					if (scope.selectedApp) {
						apps.forEach(function(a){
							if(a.name.toLowerCase() === scope.selectedApp.toLowerCase()){
								scope.apps = [a];
								scope.app = a;
							}
						});
						return;
					}else{
						scope.apps = apps;
					}

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
