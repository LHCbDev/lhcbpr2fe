App.constant('LHCBPR_PARAMS', {
	"api1": "http://127.0.0.1:8000/",
	"api": "https://test-lhcb-pr2.web.cern.ch/test-lhcb-pr2/api/"
});

App.service('lhcbprResources', ["Restangular", "LHCBPR_PARAMS", '$rootScope', function(Restangular, lhcbpr_params, $rootScope) {
    var url = lhcbpr_params.api;
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
            response = newResponse;
        }
    	$rootScope.pendingRequests --;
    	if($rootScope.pendingRequests == 0)
    		$rootScope.loadingPercentage = 0;
    	else
	    	$rootScope.loadingPercentage = 100 / ($rootScope.pendingRequests + 1);
        return response;
    });

    Restangular.addRequestInterceptor(function(element, operation, what, url){
    	$rootScope.pendingRequests ++;
	    $rootScope.loadingPercentage = 100 / ($rootScope.pendingRequests + 1);
	    return element;
    });

    return Restangular;
}]
);
