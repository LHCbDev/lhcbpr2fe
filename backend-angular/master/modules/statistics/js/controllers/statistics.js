App.controller('StatisticsController', ['$scope', function($scope) {
	$scope.lineOptions = {
		errorDir : "both",
		errorStrokeWidth : 3,
		datasetFill : false,
		scaleOverride : true,
        scaleSteps : 10,
        scaleStepWidth : 1,
        scaleStartValue : 0,
        tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %><%if (errorBar){%> , <%=errorBar.errorVal%><%}%>",
		legendTemplate : '<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<datasets.length; i++){%><li><span class="label label-default" style="background-color:<%=datasets[i].fillColor%>"><%if(datasets[i].label){%><%=datasets[i].label%><%}%></span></li><%}%></ul>'
	};

	$scope.attrs = [];

	$scope.requestStatistics = function(params) {
		console.log('params: ', params);
		// Send request to the api
		// Assuming the result is
		var response = [{
			version: "v1",
			attrs: [
				{ name: "time", ve: [5.3, 1] },
				{ name: "speed", ve: [3, 0.64] }
			]
		},{
			version: "v2",
			attrs: [
				{ name: "time", ve: [5.7, 0.65] },
				{ name: "speed", ve: [3.8, 0.51] }
			]
		},{
			version: "v3",
			attrs: [
				{ name: "time", ve: [7, 0.64] },
				{ name: "speed", ve: [8, 0.85] }
			]
		}];

		var versions = response.map(function(e){ return e.version; });

		$scope.attrs = response[0].attrs.map(function(a){
			return {
				name: a.name,
				lineData: {
					labels: versions,
					datasets: [{
						label: a.name,
						fillColor : "rgba(220,220,220,0.2)",
						strokeColor : "#2F49B1",
						pointColor : "#5E87D6",
						pointStrokeColor : "#fff",
						pointHighlightFill : "#fff",
						pointHighlightStroke : "#5E87D6",
						data: [],
						error: []
					}]
				}
			};
		});

		response.forEach(function(item){
			for(var i in item.attrs){
				$scope.attrs[i].lineData.datasets[0].error.push(item.attrs[i].ve[1]);
				$scope.attrs[i].lineData.datasets[0].data.push(item.attrs[i].ve[0]);
				// if($scope.lineOptions.scaleStartValue < item.attrs[i].ve[0] - item.attrs[i].ve[1])
				// 	$scope.lineOptions.scaleStartValue = item.attrs[i].ve[0] - item.attrs[i].ve[1];
				// if($scope.lineOptions.scaleSteps < item.attrs[i].ve[0] + item.attrs[i].ve[1])
				// 	$scope.lineOptions.scaleSteps = parseInt(item.attrs[i].ve[0] + item.attrs[i].ve[1]) + 1;
			}
		});
	};
}]);
