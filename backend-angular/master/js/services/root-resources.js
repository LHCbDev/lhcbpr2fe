App.service('rootResources', ['$http', 'BUILD_PARAMS', function($http, BUILD_PARAMS) {

  var urlBase = BUILD_PARAMS.url_root;

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

  this.sortFileContentsToJSON = function(filesJSON) {
    /**
     * This is designed to take the output of this.lookupFileContents and output
     * it into somehthing more reasonable to navigate in javascript.
     *
     * If it does not, this is a bug!
     */

    var parsePathArray = function(paths) {
      var parsed = {
        name: "/",
        location: "/",
        children: []
      };
      var i;
      var j;
      for(i in paths) {
        var path = paths[i];
        var splitPath = path.split('/');

        // Remove falsy values like "" from splitPath
        splitPath = _.remove(splitPath);

        var partialParsedPath = ["children"];

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
            debugger;
          } else {
            partialParsedPath.push(_.get(parsed, partialParsedPath).length);
            // partialParsedPath.push(objName);
            _.set(parsed, partialParsedPath, {
              name: objName,
              location: "/"+_.slice(splitPath, 0, Number(j)+1).join('/'), // If you pass this location to jsroot, it will fetch the object with objName
              isExpanded: false
            });
            // If it's a directory, give it children.
            if(_.includes(path, "/"+objName+"/")) {
              partialParsedPath.push("children");
              _.set(parsed, partialParsedPath, []);
            };
          }
          // So, it does exist. What now?
          //
          // If it's a directory, then this loop will continue and needs a
          // reference to the last element in children of this object. If not,
          // do nothing and the loop should discontinue

          // if(_.includes(path, "/"+objName+"/")) {
          //   // TODO assert that partialParsedPath ends in children at this point!

          //   // Add a reference to the last+1th element.
          //   // debugger;
          //   partialParsedPath.push(""+_.get(parsed, partialParsedPath).length);
          // };
        };
      };
      // var parsed = {};
      // for(var i = 0; i < paths.length; i++) {
      //   var position = parsed;
      //   var split = paths[i].split('/');
      //   for(var j = 0; j < split.length; j++) {
      //     if(split[j] !== "") {
      //       if(typeof position[split[j]] === 'undefined')
      //         position[split[j]] = {};
      //       position = position[split[j]];
      //     }
      //   }
      // }
      return parsed;
    };

    var retObj = {};

    _.forEach(filesJSON, function(value, key) {
      retObj[key] = parsePathArray(value);
    });

    // console.debug(JSON.stringify(retObj, null, 2));

    return retObj;
  };



}]);

// Local Variables:
// js2-basic-offset: 2
// js-indent-level: 2
// indent-tabs-mode: nil
// End:
