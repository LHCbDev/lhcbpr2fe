App.constant('LHCBPR_PARAMS', {
	"api1": "http://127.0.0.1:8000/",
	"api": "http://amazurov.web.cern.ch/amazurov/lhcbpr-api/"
});

App.service('lhcbprResources', ["Restangular", "LHCBPR_PARAMS", 
function(Restangular, lhcbpr_params) {
    var url = lhcbpr_params.api1;
    Restangular.setBaseUrl(url);
    Restangular.setJsonp(true)
    Restangular.setDefaultRequestParams('jsonp', {format: 'jsonp', callback: 'JSON_CALLBACK'});
    Restangular.setDefaultHttpFields({cache: true});

    Restangular.setResponseExtractor(function(response, operation, what, url) {
        if (operation === "getList" && response.hasOwnProperty("results")) {
            // Use results as the return type, and save the result metadata
            // in _resultmeta
            var newResponse = response.results;
            newResponse._resultmeta = {
                "count": response.count,
                "next": response.next,
                "previous": response.previous
            };
            return newResponse;
        }
        return response;
    });
 
    return Restangular;
}]
);
