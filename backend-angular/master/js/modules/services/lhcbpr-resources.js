App.service('lhcbprResources', ["$resource", "LHCBPR_PARAMS", 
function($resource, lhcbpr_params) {
    var url = lhcbpr_params.api;

    var options = { 
            method: 'JSONP', 
            params: {format: 'jsonp', callback: 'JSON_CALLBACK'}
    };

    var options_arr = angular.copy(options);
    options_arr.isArray = true;

    var Application = $resource(url + '/applications/:appId', 
        {appId:'@id'}, 
        {
          get: options,
          query: options_arr
        }
    );

    return {
        Application: Application
    };
}]
);