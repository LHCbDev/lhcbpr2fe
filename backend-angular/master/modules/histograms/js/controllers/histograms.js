App.controller('HistogramsController', ['$scope', 'ngTableParams', 'ngDialog', 'lhcbprResources', function($scope, $tableParams, $dialog, $api) {

	$scope.lineOptions = {
		animation: false,
		barShowStroke : false,
	    barValueSpacing : 0,
	    barDatasetSpacing : 0,
	    tooltipHideZero: true,
	    barShowStroke : false,
	    barStrokeWidth : 0,
	    barValueSpacing : 0,
  		tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>",
		legendTemplate : '<% for (var i=0; i<datasets.length; i++){%><span class="label label-default" style="background-color:<%=datasets[i].fillColor%>"><%if(datasets[i].label){%><%=datasets[i].label%><%}%></span> <%}%>'
	};

	$scope.appId = undefined;
	$scope.options = undefined;
	$scope.versions = undefined;
	$scope.min = '';
	$scope.max = '';
	$scope.intervals = 10;

	$scope.tableParams = new $tableParams(
		{ page: 1, count: 10 }, 
		{ total: 0, getData: function($defer, params) {
            if($scope.appId && $scope.options && $scope.versions){
            	var requestParams = {
					app: $scope.appId,
					options: $scope.options,
					versions: $scope.versions,
					intervals: $scope.intervals,
					page: params.page(),
					page_size: params.count()
				};
				if(! isNaN(parseFloat($scope.min))){
					requestParams.min = parseFloat($scope.min);
				}
				if(! isNaN(parseFloat($scope.max))){
					requestParams.max = parseFloat($scope.max);
				}
				console.log('requestParams: ', requestParams);
				$api.all('histograms').getList(requestParams).then(function(response){
					if(response._resultmeta){
						params.total(response._resultmeta.count);
					}
					$defer.resolve(response);
				});
            }
        }
	});

	$scope.tableParams.settings().$scope = $scope;

	$scope.requestStatistics = function(params) {
		$scope.appId = params.apps[0];
		$scope.options = params.options;
		$scope.versions = params.versions;
		$scope.tableParams.page(1);
		$scope.tableParams.reload();
	};

	$scope.showChart = function(a){
		console.log('Show chart of ' + a.name);
		var labels = [];
		var datasets = [];
		// Fill labels
		var l = a.min_value + a.interval_width;
		while(l <= a.max_value){
			labels.push(l + '');
			l += a.interval_width;
		}
		labels.push(l + '');

		// Fill datasets
		var index = -1;
		datasets = a.values.map(function(value){
			index ++;
			return {
				label: value.version,
				fillColor: Colors.get(index),
				strokeColor: Colors.getDark(index),
				highlightFill: Colors.getLight(index),
				highlightStroke: Colors.get(index),
				data: value.jobs
			};
		});

		$scope.lineData = {
			labels: labels,
			datasets: datasets
		};
		$scope.name = a.name;
		$dialog.open({
			template: 'chartTemplate',
			className: 'chart-dialog',
			scope: $scope
		});
	}

	$scope.chartHeight = function() {
		return $(window).height() - 140;
	};

	$scope.chartWidth = function() {
		return $(window).width() - 80;
	};

}]);
