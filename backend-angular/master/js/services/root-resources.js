App.service('rootResources', ['$http', 'BUILD_PARAMS', 'resourceParser', '$q', function($http, BUILD_PARAMS, resourceParser, $q) {

  var urlBase = BUILD_PARAMS.url_root;
  var that = this;

  this.lookupDirs = function ( params ) {
    var url = urlBase +
          '/?files=' + encodeURIComponent(params['files']) +
          '&folders=' + encodeURIComponent(params['folders']) +
          '&callback=JSON_CALLBACK';
    console.debug("Making request: "+url);
    return $http.jsonp(url)
      .then(function (response) {
        var trees = {};
        _.forEach(response.data['result'], function(file) {
          _.forEach(file['trees'], function(value, key) {
            trees[file['root']] = file['trees'];
          });
        });
        return trees;
      }, function (error) {
        console.error(error);
      });
  };

  this.lookupFileContents = function(files) {
    /**
     * Gets the contents of given files and returns an object with filenames as
     * keys, and objects in files as lists.
     *
     * e.g. lookupFileContents(['abc.root']) returns:
     * {'abc.root': ['/h1', '/dir1/h2']}
     */
    // If files is an array, make it a string just like jsroot likes.
    if(typeof files === "object") {
      files = files.join('__');
    }
    var url = urlBase + 
          '/?files=' + encodeURIComponent(files) +
          '&folders=' + encodeURIComponent(["/"]) +
          '&callback=JSON_CALLBACK';
    console.debug("Making request: "+url);
    return $http.jsonp(url)
      .then(function(response) {
        var files = {};
        _.forEach(response.data['result'], function(file) {
          files[file['root']] = [];
          _.forEach(file['trees']['/'], function(value, key) {
            _.forEach(value, function(title, path) {
              files[file['root']].push(path);
            });
          });
        });

        return files;
      });
  };

  // TODO find better function names
  this.lookupSingleFileContents = function(file) {
    if (typeof file !== "string") {
      console.error("lookupFileContents takes a string!");
      return undefined;
    }
    var url = urlBase +
          '/?files=' + encodeURIComponent(file) +
          '&folders=' + encodeURIComponent(["/"]) +
          '&callback=JSON_CALLBACK';
    console.debug("Making request: "+url);
    return $http.jsonp(url)
      .then(function(response) {
        var objectsInFile = [];
        _.forEach(response.data['result'], function(file) {
          _.forEach(file['trees']['/'], function(value, key) {
            _.forEach(value, function(title, path) {
              objectsInFile.push(path);
            });
          });
        });
        return objectsInFile;
      });

  };

  this.lookupSingleFileResourceContents = function(resource) {
    /**
     * This function takes a file resource and returns the objects found in it,
     * or errors and returns undefined.
     */
    if(resourceParser.getType(resource) !== "File") {
      console.error("Resource is no of type File!");
      return undefined;
    }
    var fileName = resourceParser.getCommonValue(resource);
    var jobIds = resourceParser.getJobIds(resource);

    var i;
    var fileLocations = _.map(jobIds, function(value) {
      return value + "/" + fileName;
    });

    // TODO find better name
    var filesRootObjects = _.mapValues(_.indexBy(fileLocations), function(value) {
      return that.lookupSingleFileContents(value);
    });

    return $q.all(filesRootObjects).then(function(response) {
      var arraysOfObjectsInFiles = _.reduce(_.values(response), function(a, b) {
        return _.union(a, b);
      });
      var objectsNotInAllFiles = _.reduce(_.values(response), function(a, b) {
        return _.xor(a, b);
      });
      debugger;
      if(objectsNotInAllFiles.length > 0) {
        console.error("The following objects not found in all files:");
        console.error(JSON.stringify(objectsNotInAllFiles, null, 2));
        console.error("Ignoring them and returning objects in common...");
      }
      var objectsInAllFiles = _.intersection(arraysOfObjectsInFiles);
      return objectsInAllFiles;
    });
  };

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



}]);

// Local Variables:
// js2-basic-offset: 2
// js-indent-level: 2
// indent-tabs-mode: nil
// End:
