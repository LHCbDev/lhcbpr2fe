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
          files[file['root']] = {};
          _.forEach(file['trees']['/'], function(value, key) {
            _.forEach(value, function(title, path) {
              files[file['root']][path] = title;
            });
          });
        });

        return files;
      });
  };


}]);

// Local Variables:
// js2-basic-offset: 2
// js-indent-level: 2
// indent-tabs-mode: nil
// End:
