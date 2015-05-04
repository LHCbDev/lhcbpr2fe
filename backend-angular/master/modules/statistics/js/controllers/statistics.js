App.controller('StatisticsController', ['$scope', function ($scope) {
	
	$scope.requestStatistics = function (apps, options, versions, jobs){
		console.log('requestStatistics called !');
		console.log('app: ', app); 
		console.log('options: ', options); 
		console.log('versions: ', versions); 
		console.log('jobs: ', jobs);
	};

}]);
