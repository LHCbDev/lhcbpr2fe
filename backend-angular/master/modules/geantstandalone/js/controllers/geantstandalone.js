App.controller('GeantstandaloneController', function($scope, BUILD_PARAMS) {
	$scope.url = BUILD_PARAMS.url_root;
	$scope.graphs = "Total,Inelastic,Elastic";
	$scope.files_and_titles = {
		'roottest/FTFP_BERT_kaon+_Be.root':'GGG',
		'roottest/FTFP_BERT_proton_Si.root':'gcc49'
	};

	$scope.doSomething = function(ids) {
		alert(ids);
	};

});
