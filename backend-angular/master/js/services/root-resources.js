App.service('rootResources', ['$http', 'BUILD_PARAMS', function($http, BUILD_PARAMS) {

  var urlBase = BUILD_PARAMS.url_root;

  this.lookupDirs = function ( params ) {
    var url = urlBase + 
            '/?files=' + encodeURIComponent(params['files']) +
            '&folders=' + encodeURIComponent(params['folders']) +
            '&callback=JSON_CALLBACK';    
    return $http.jsonp(url)
        .then(function (response) {
          var trees = {}
          _.forEach(response.data['result'], function(file) {
            _.forEach(file['trees'], function(value, key) {
              trees[file['root']] = file['trees'];
            });
          });
          return trees;
        }, function (error) {
          console.error(error)
        });
  };
}]);



