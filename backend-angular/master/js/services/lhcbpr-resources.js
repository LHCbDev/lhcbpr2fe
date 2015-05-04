App.constant('LHCBPR_PARAMS', {
	"api1": "/amazurov/lhcbpr-dev/api",
	"api": "http://127.0.0.1:8000"
});

App.service('lhcbprResources', ["Restangular", "LHCBPR_PARAMS", 
function(Restangular, lhcbpr_params) {
    var url = lhcbpr_params.api;
    Restangular.setBaseUrl(url);
    Restangular.setJsonp(true)
    Restangular.setDefaultRequestParams('jsonp', {format: 'jsonp', callback: 'JSON_CALLBACK'});
    Restangular.setDefaultHttpFields({cache: true});
 
    return Restangular;
}]
);
