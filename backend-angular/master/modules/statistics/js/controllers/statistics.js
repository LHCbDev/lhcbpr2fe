App.controller('StatisticsController', ['$scope', 'ngTableParams', 'ngDialog', 'lhcbprResources', function($scope, $tableParams, $dialog, $api) {
	$scope.lineOptions = {
		errorDir : "both",
		errorStrokeWidth : 3,
		datasetFill : false,
		scaleOverride : true,
        scaleSteps : 10,
        scaleStepWidth : 1,
        scaleStartValue : 0,
  		tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %><%if (errorBar){%> ± <%=errorBar.errorVal%><%}%>",
		legendTemplate : '<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<datasets.length; i++){%><li><span class="label label-default" style="background-color:<%=datasets[i].fillColor%>"><%if(datasets[i].label){%><%=datasets[i].label%><%}%></span></li><%}%></ul>'
	};

	$scope.appId = undefined;
	$scope.options = undefined;

	$scope.tableParams = new $tableParams(
		{ page: 1, count: 10 }, 
		{ total: 0, getData: function($defer, params) {
            if($scope.appId && $scope.options){
				// $api.all("compare").getList({
				// 		ids: $scope.jobsIds.join(),
				// 		contains: $scope.contains,
				// 		page: params.page(),
				// 		page_size: params.count()
				//  }).then(function(attrs){
				//  	if(attrs._resultmeta){
				// 			params.total(attrs._resultmeta.count)
				// 		}
				// 		$defer.resolve(attrs)
				// });
				response = [
					{
						attr_id: 1,
						attr_name: "time",
						values: [
							{
								version: "v1",
								average: 5.2,
								deviation: 1
							},
							{
								version: "v2",
								average: 2.4,
								deviation: 0.4
							},
							{
								version: "v3",
								average: 10,
								deviation: 0.8
							}
						]
					},
					{
						attr_id: 2,
						attr_name: "attr2",
						values: [
							{
								version: "v1",
								average: 2,
								deviation: 0.21
							},
							{
								version: "v2",
								average: 2.4,
								deviation: 0.4
							},
							{
								version: "v3",
								average: 1,
								deviation: 0.08
							}
						]
					},
					{
						attr_id: 3,
						attr_name: "attr3",
						values: [
							{
								version: "v1",
								average: 5.2,
								deviation: 1
							},
							{
								version: "v2",
								average: 4,
								deviation: 0.4
							},
							{
								version: "v3",
								average: 1,
								deviation: 0.1
							}
						]
					}
				];

				$defer.resolve(response);
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
		console.log('Show chart of ' + a.attr_name);
		var minValue = a.values[0].average - a.values[0].deviation, 
			maxValue = a.values[0].average + a.values[0].deviation,
			value = 0,
			versions = [],
			averages = [],
			deviations = [];
		a.values.forEach(function(v){
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
		$scope.lineData = {
			labels: versions,
			datasets: [{
				label: a.attr_name,
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
		$scope.name = a.attr_name;
		$dialog.open({
			template: 'chartTemplate',
			scope: $scope,
			controller: ['$scope', '$timeout', function(scope, $to){
				$to(function(){
					$('.ngdialog').css('padding', '50px');
					$('.ngdialog-content').css('width', '700px');
				}, 100);
			}]
		});
	}
}]);
