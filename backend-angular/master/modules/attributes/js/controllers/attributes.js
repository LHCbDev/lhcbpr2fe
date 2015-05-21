App.controller('AttributesController', 
	["$scope", function ($scope) {

		$scope.attrs = {}; // list of attributes of selected jobs
		$scope.selectedAttrIds = []; // list of ids of selected attributes

		$scope.showSelected = function(ids){
			console.log('ids: ', ids);
		}

		$scope.handleJobs = function(jobs){
			$scope.attrs = {}; // clearing attributes
			if(undefined === jobs || undefined === jobs.length || 0 === jobs.length)
				return;
			// console.log(jobs);
			jobs.forEach(function(job){
				if(undefined === job || undefined === job.results)
					return;
				job.results.forEach(function(result){
					if( 'string' === result.attr.dtype )
						return;
					if( undefined === $scope.attrs[result.attr.id])
						$scope.attrs[result.attr.id] = {
							id: result.attr.id,
							name: result.attr.name,
							dtype: result.attr.dtype,
							values: []
						};
					var a = $scope.attrs[result.attr.id];
					var value = {
						jobId: job.id,
						time: job.time_start,
						value: result[ 'val_' + a.dtype ],
						downValue: null,
						upValue: null
					};
					var i = result.attr.thresholds.length - 1;
					while( i >= 0 && result.attr.thresholds[i].start > job.time_start)
						i--;
					if( -1 == i )
						i = 0;
					value.downValue = result.attr.thresholds[i].down_value;
					value.upValue = result.attr.thresholds[i].up_value;
					a.values.push(value);
				});
			});
			// Sorting values of all attributes by job starting time
			for (var id in $scope.attrs){
				if ($scope.attrs.hasOwnProperty(id)){
					var attr = $scope.attrs[id];
					attr.values.sort(function(x, y){
						return x.time - y.time;
					});
				}
			}
			$scope.makeAttrsLineData();
			console.log('attrs:', $scope.attrs);
		};

		$scope.makeAttrsLineData = function(){
			for (var id in $scope.attrs){
				if ($scope.attrs.hasOwnProperty(id)){
					var attr = $scope.attrs[id];
					attr.lineData = {
						labels: attr.values.map(function(value) { return value.time; }),
						datasets: [
					        {
								label: 'value',
								fillColor : 'rgba(0,255,0,0)',
								strokeColor : 'green',
								pointColor : 'green',
								pointStrokeColor : '#fff',
								pointHighlightFill : '#fff',
								pointHighlightStroke : 'green',
								data : attr.values.map(function(value) { return value.value; })
					        },
					        {
								label: 'Upper threshold',
								fillColor : 'rgba(35,183,229,0)',
								strokeColor : 'red',
								pointColor : 'red',
								pointStrokeColor : '#fff',
								pointHighlightFill : '#fff',
								pointHighlightStroke : 'red',
								data : attr.values.map(function(value) { return value.upValue; })
							},
							{
								label: 'Down threshold',
								fillColor : 'rgba(35,183,229,0)',
								strokeColor : 'blue',
								pointColor : 'blue',
								pointStrokeColor : '#fff',
								pointHighlightFill : '#fff',
								pointHighlightStroke : 'blue',
								data : attr.values.map(function(value) { return value.downValue; })
							}
						]
					};
				}
			}
		};
}]);
