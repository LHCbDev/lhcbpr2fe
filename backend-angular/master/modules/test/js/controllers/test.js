App.controller('TestController', 
	["$scope", function ($scope) {

		$scope.attrs = []; // list of attributes of selected jobs
		$scope.selectedAttrIds = []; // list of ids of selected attributes

		$scope.handleJobs = function(jobs){
			// console.log(jobs);
			$scope.attrs = []; // clearing attributes
			jobs.forEach(function(job){
				job.results.forEach(function(result){
					if( undefined === $scope.attrs[result.attr.id])
						$scope.attrs[result.attr.id] = {
							name: result.attr.name,
							dtype: result.attr.dtype,
							values: []
						};
					var a = $scope.attrs[result.attr.id];
					var value = {
						jobId: job.id,
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
			console.log('attrs:', $scope.attrs);
		}
}]);
