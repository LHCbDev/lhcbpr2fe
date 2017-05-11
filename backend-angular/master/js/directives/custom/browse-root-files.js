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
      graphs: '=',
      defaultPlots: '='
    },
    controller: [
      '$scope', '$q', 'rootResources', 'resourceParser',
      function($scope, $q, rootResources, resourceParser) {
        var that = this;


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


        var createPayload = function(resources, locationInFile) {
          return angular.copy({
            locationInFile: locationInFile,
            resources: angular.copy(resources)
          });
        };

        var createMenuNode = function(name, resourceName, hasChildren, payload) {
          var retObj = {
            name: name,
            resourceName: resourceName,
            isExpanded: false
          };
          if(hasChildren) {
            retObj.children = [];
          }
          if(payload) {
            retObj.payload = payload;
          }
          return retObj;
        };

        this.setCurrentFolder = function(v) {
          $scope.currentFolder = v;
        };

        this.getCurrentFolder = function() {
          return $scope.currentFolder;
        };


        this.sortFileContentsToJSON = function(resources, filesObj, regexes) {
          /**
           * This is designed to take the output of this.lookupFileContents and output
           * it into something more reasonable to navigate in javascript.
           *
           * If it does not, this is a bug!
           *
           * filesObj is something like:
           * {
           *   "ROOT file": // the file structure in JSON
           * }
           *
           * Where "ROOT file" is the name of the resource (e.g. resourceParser.getName(resource))
           */

          var parsed = [];
          var i;
          var j;
          var resourceName;
          for(resourceName in filesObj){
            var paths = filesObj[resourceName];
            var resource = _.find(resources, function(value, ind) {
              return resourceParser.getName(value) === resourceName;
            });
            parsed.push(createMenuNode(resourceName, resourceName, true));

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
                var existingObjs = _.filter(
                  _.get(parsed, partialParsedPath),
                  function(val, key, coll) {
                    return typeof val === "object" && val.name === objName;
                  });

                if(existingObjs.length === 1) {
                  // Find it, add it
                  partialParsedPath.push(_.indexOf(_.get(parsed, partialParsedPath), existingObjs[0]));
                  if(_.includes(path, "/"+objName+"/")) {
                    partialParsedPath.push("children");
                  };
                } else if(existingObjs.length > 1) {
                  console.error("Something has gone wrong!");
                } else {
                  partialParsedPath.push(_.get(parsed, partialParsedPath).length);
                  var isDirectory = _.includes(path, "/"+objName+"/");
                  _.set(parsed, partialParsedPath, createMenuNode(
                    objName,
                    resourceName,
                    isDirectory,
                    createPayload(
                      [resource],
                      getPathUpToLevel(path, j)
                    )
                  ));
                  if(isDirectory) {
                    partialParsedPath.push("children");
                  }
                }
              };
            }};

          return parsed;
        };


        $scope.$watch('resources', function() {
          // Reset the browse-root-files directive
          that.fillItems();
          that.selectDefaults();

          // If resources is empty, don't bother processing it.
          if($scope.resources === undefined || $scope.resources.length === 0) {
            return;
          }

          // This directive can only present files. Therefore, if it gets passed
          // not-files, it should filter them out.
          var rootFileResources = _.filter($scope.resources, function(v) {
            return resourceParser.getType(v) === "File";
          });

          // Next, make an object of filenames
          //
          // This is where the problems start. The browser assumes that all
          // objects have the same filename. But they don't.
          var objectOfNames = _.indexBy(rootFileResources, function(value) {
            return resourceParser.getName(value);
          });
          var objectOfPromises = _.mapValues(objectOfNames, function(value, ind, coll) {
            return rootResources.lookupSingleFileResourceContents(value);
          });

          $q.all(objectOfPromises).then (function(response) {
            // OK, so, now we are using attribute names instead of filenames.

            // Before it goes in, figure out which plots/files exist in all tests
            // HACK strip the job number from the filename.
            // TODO remove this hack with proper logic!
            var regex = /^\d+?\//;
            // Problems.
            // TODO the key is now the name of the resource, not the filename
            var key;
            var newResponse = {};
            for(key in response) {
              var strippedKey = key.replace(regex, '');
              newResponse[strippedKey] = response[key];
            }
            var regexes = _.map(Object.keys(newResponse), function(v) { return new RegExp("^"+v+"$"); });
            // By this point newResponse is an object with keys of filenames,
            // and values of a list of objects in the file.
            $scope.folders = that.sortFileContentsToJSON($scope.resources, newResponse, regexes);
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

        this.getChildrenWithoutChildren = function(val) {
          return _.filter(val.children, function(v) { return that.hasNoChildren(v); });
        };

        this.hasChildrenWithChildren = function(val) {
          return _.filter(val.children, function(v) { return that.hasChildren(v); }).length > 0;
        };

        $scope.items = [];
        this.fillItems = function(items) {
          $scope.items = items || [];
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


        // Pushing plots out of the directive
        //
        // TODO consider making a separate controller for this section
        $scope.graphsChecklistModel = angular.copy($scope.graphs);

        this.pushPlotButton = function() {
          _.forEach($scope.graphs, function() {$scope.graphs.pop();});
          _.forEach($scope.graphsChecklistModel, function(val) {$scope.graphs.push(val);});
        };

        if($scope.graphsChecklistModel.length > 0) {
          // if $scope.graphs already has stuff inside, plot it now
          this.pushPlotButton();
        }

        this.numberOfPlotsSelected = function() {
          return $scope.graphsChecklistModel.length;
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

// Local Variables:
// js2-basic-offset: 2
// js-indent-level: 2
// indent-tabs-mode: nil
// End:
