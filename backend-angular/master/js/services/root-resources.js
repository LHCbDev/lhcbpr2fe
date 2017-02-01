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

    // Taken straight out of SO:
    // https://stackoverflow.com/questions/36248245/how-to-convert-an-array-of-paths-into-json-structure
    var parsePathArray = function(paths) {
      var parsed = {};
      for(var i = 0; i < paths.length; i++) {
        var position = parsed;
        var split = paths[i].split('/');
        for(var j = 0; j < split.length; j++) {
          if(split[j] !== "") {
            if(typeof position[split[j]] === 'undefined')
              position[split[j]] = {};
            position = position[split[j]];
          }
        }
      }
      return parsed;
    };

    var retObj = {};

    _.forEach(filesJSON, function(value, key) {
      retObj[key] = parsePathArray(value);
    });

    return retObj;
  }



}]);

// Local Variables:
// js2-basic-offset: 2
// js-indent-level: 2
// indent-tabs-mode: nil
// End:
