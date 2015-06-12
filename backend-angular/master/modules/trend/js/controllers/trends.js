App.controller('TrendController', ['$scope', 'ngTableParams', 'ngDialog', 'lhcbprResources', function($scope, $tableParams, $dialog, $api) {
	$scope.lineOptions = {
		errorDir : "both",
		errorStrokeWidth : 3,
		datasetFill : false,
		scaleOverride : true,
        scaleSteps : 10,
        scaleStepWidth : 1,
        scaleStartValue : 0,
  		tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %><%if (errorBar){%> ± <%=errorBar.errorVal%><%}%>",
		legendTemplate : '<% for (var i=0; i<datasets.length; i++){%><span class="label label-default" style="background-color:<%=datasets[i].fillColor%>"><%if(datasets[i].label){%><%=datasets[i].label%><%}%></span> <%}%>'
	};

	$scope.appId = undefined;
	$scope.options = undefined;

	$scope.tableParams = new $tableParams(
		{ page: 1, count: 10 }, 
		{ total: 0, getData: function($defer, params) {
            if($scope.appId && $scope.options){
				$api.all('trends').getList({
					app: $scope.appId,
					options: $scope.options,
					page: params.page(),
					page_size: params.count()
				}).then(function(trends){
					if(trends._resultmeta){
						params.total(trends._resultmeta.count);
					}
					$defer.resolve(trends);
				});
            }
		} }
    );

	$scope.tableParams.settings().$scope = $scope;

	$scope.requestStatistics = function(params) {
		console.log('params: ', params);
		// Send request to the api		
		// Assuming the result is
		$scope.appId = params.apps[0];
		$scope.options = params.options;
		$scope.tableParams.page(1);
		$scope.tableParams.reload();
	};

	$scope.showChart = function(a){
		console.log('Show chart of ' + a.name);
		var minValue = a.values[0].average - a.values[0].deviation, 
			maxValue = a.values[0].average + a.values[0].deviation,
			value = 0,
			versions = [],
			averages = [],
			deviations = [];
		a.values.forEach(function(v){
			v.average = parseInt(100 * v.average) / 100.0;
			v.deviation = parseInt(100 * v.deviation) / 100.0;
			averages.push(v.average);
			versions.push(v.version);
			deviations.push(v.deviation);
			value = v.average - v.deviation;
			if(value < minValue)
				minValue = value;
			value = v.average + v.deviation;
			if(value > maxValue)
				maxValue = value;
		});
		minValue = Math.floor(minValue);
		maxValue = Math.floor(maxValue) + 1;
		$scope.lineOptions.scaleStartValue = minValue;
		$scope.lineOptions.scaleSteps = maxValue - minValue;
		$scope.lineOptions.scaleStepWidth = 1;
		while ( $scope.lineOptions.scaleSteps > 25 ){
			$scope.lineOptions.scaleSteps /= 2;
			$scope.lineOptions.scaleStepWidth *= 2;
		}

		$scope.lineData = {
			labels: versions,
			datasets: [{
				label: a.name,
				fillColor : "rgba(220,220,220,0.2)",
				strokeColor : "#2F49B1",
				pointColor : "#5E87D6",
				pointStrokeColor : "#fff",
				pointHighlightFill : "#fff",
				pointHighlightStroke : "#5E87D6",
				data: averages,
				error: deviations
			}]
		};
		$scope.name = a.name;
		$dialog.open({
			template: 'chartTemplate',
			className: 'chart-dialog',
			scope: $scope
		});
	}

	$scope.chartHeight = function() {
		return $(window).height() - 120;
	};

	$scope.chartWidth = function() {
		return $(window).width() - 60;
	};

}]);
