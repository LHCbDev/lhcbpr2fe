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

            this.sortFileContentsToJSON = function(filesJSON) {
                /**
                 * This is designed to take the output of this.lookupFileContents and output
                 * it into something more reasonable to navigate in javascript.
                 *
                 * If it does not, this is a bug!
                 */

                // TODO find a better name for this function
                var getPathUpToLevel = function(path, level) {
                    /**
                     * Takes a path and a level and returns the path up to that level.
                     *
                     * NOTE: the 0th level is the first level.
                     *
                     * e.g.
                     * getLocationFromLevel("/foo/bar/baz", 1); => "/foo/bar"
                     * 
                     */
                    var splitPath = path.split('/');
                    // Remove falsy values like "" from splitPath
                    splitPath = _.remove(splitPath);

                    return "/"+_.slice(splitPath, 0, Number(level)+1).join('/');
                };

                var createLocation = function(locationInFile, fileInJob) {
                    // return {
                    //   locationInFile: locationInFile,
                    //   fileInJob: fileInJob
                    // };
                    return locationInFile;
                };

                var parsePathArray = function(files) {
                    // var parsed = {
                    //   name: "/",
                    //   location: "/",
                    //   children: []
                    // };
                    var parsed = [];
                    var i;
                    var j;
                    var fileName;
                    for(fileName in files){
                        var paths = files[fileName];
                        // var partialParsedPath = [parsed.length];
                        parsed.push({
                            name: fileName,
                            fileName: fileName,
                            children: []
                        });

                        // partialParsedPath.push("children");

                        for(i in paths) {
                            var partialParsedPath = [parsed.length-1, "children"];
                            var path = paths[i];
                            var splitPath = path.split('/');

                            // Remove falsy values like "" from splitPath
                            splitPath = _.remove(splitPath);

                            for(j in splitPath) {
                                var objName = splitPath[j];
                                // Check if the obj is a directory
                                // If this parsedPath does not exist, create it
                                // TODO tidy up
                                var existingObjs = _.filter(
                                    _.get(parsed, partialParsedPath),
                                    function(val, key, coll) {
                                        return typeof val === "object" && val.name === objName;
                                    });

                                if(existingObjs.length === 1) {
                                    // Find it, add it
                                    partialParsedPath.push(_.indexOf(_.get(parsed, partialParsedPath), existingObjs[0]));
                                    // partialParsedPath.push(objName);
                                    if(_.includes(path, "/"+objName+"/")) {
                                        partialParsedPath.push("children");
                                    };
                                } else if(existingObjs.length > 1) {
                                    console.error("Something has gone wrong!");
                                } else {
                                    partialParsedPath.push(_.get(parsed, partialParsedPath).length);
                                    // partialParsedPath.push(objName);
                                    _.set(parsed, partialParsedPath, {
                                        name: objName,
                                        // If you pass this location to jsroot, it will fetch the object
                                        // with objName
                                        location: createLocation(
                                            getPathUpToLevel(path, j),
                                            fileName
                                        ),
                                        isExpanded: false
                                    });
                                    // If it's a directory, give it children.
                                    if(_.includes(path, "/"+objName+"/")) {
                                        partialParsedPath.push("children");
                                        _.set(parsed, partialParsedPath, []);
                                    };
                                }
                            };
                        }};
                    return parsed;
                };

                // var retObj = {};

                // _.forEach(filesJSON, function(value, key) {
                //   retObj[key] = parsePathArray(value);
                // });

                // console.debug(JSON.stringify(retObj, null, 2));

                var retObj = parsePathArray(filesJSON);

                return retObj;
            };


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
                    $scope.folders = that.sortFileContentsToJSON(newResponse);
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
