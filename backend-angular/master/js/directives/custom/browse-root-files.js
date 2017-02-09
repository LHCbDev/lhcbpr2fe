/**
 * Directive browseRootFiles
 */

App.directive('browseRootFiles', [function () {
    return {
        templateUrl: 'app/views/directives/browse-root-files.html',
        restrict: 'E',
        scope: {
            resources: '=',
            // TODO change this name
            graphsChecklistModel: '=',
            defaultPlots: '='
        },
        controller: ['$scope', '$q', 'rootResources', function($scope, $q, rootResources) {
            var that = this;

            $scope.$watch('resources', function() {
                // If resources is empty, don't bother processing it.
                if($scope.resources && $scope.resources.length === 0) {
                    return;
                }

                var objectOfResources = _.indexBy($scope.resources, function(value) {
                    return value.id;
                });
                var objectOfPromises = _.mapValues(objectOfResources, function(value) {
                    return rootResources.lookupSingleFileResourceContents(value);
                });

                $q.all(objectOfPromises).then (function(response) {
                    // Before it goes in, figure out which plots/files exist in all tests
                    // HACK strip the job number from the filename.
                    // TODO remove this hack with proper logic!
                    var regex = /^\d+?\//;
                    var key;
                    var newResponse = {};
                    for(key in response) {
                        var strippedKey = key.replace(regex, '');
                        newResponse[strippedKey] = response[key];
                    }
                    $scope.folders = rootResources.sortFileContentsToJSON(newResponse);
                });
            });

            $scope.defaultPlots = angular.copy($scope.defaultPlots);
            this.hasChildren = function(val, ind) {
                return val.children;
            };

            this.hasNoChildren = function(val, ind) {
                /**
                 * Needed to get around jade/pug's fussiness around '!'s.
                 */
                return !that.hasChildren(val, ind);
            };

            this.toggleExpanded = function(val) {
                if(val.isExpanded) {
                    val.isExpanded = false;
                } else {
                    val.isExpanded = true;
                }

                return val;
            };

            this.chooseFolderIcon = function(val) {
                if(val.isExpanded) {
                    return "icon-folder-alt";
                } else {
                    return "icon-folder";
                }
            };

            this.clearAll = function() {
                _.forEach($scope.graphsChecklistModel, function() {$scope.graphsChecklistModel.pop();});
            };

            this.selectDefaults = function() {
                that.clearAll();
                _.forEach($scope.defaultPlots, function(val, ind) {$scope.graphsChecklistModel.push(val);});
            };

        }],
        controllerAs: "ctrl"
    };
}]);
