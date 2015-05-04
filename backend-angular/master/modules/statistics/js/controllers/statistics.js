App.controller('StatisticsController', ['$scope', function($scope) {
    $scope.lineOptions = {
	    scaleBeginAtZero : true,
	    scaleShowGridLines : true,
	    scaleGridLineColor : "rgba(0,0,0,.05)",
	    scaleGridLineWidth : 1,
	    scaleShowHorizontalLines: true,
	    scaleShowVerticalLines: true,
	    barValueSpacing : 5,
	    barDatasetSpacing : 1,
	    legendTemplate : '<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<datasets.length; i++){%><li><span class="label label-default" style="background-color:<%=datasets[i].fillColor%>"><%if(datasets[i].label){%><%=datasets[i].label%><%}%></span></li><%}%></ul>'
	};

	$scope.attrs = [];

    $scope.requestStatistics = function(apps, options) {
        console.log('apps: ', apps);
        console.log('options: ', options);

        // Send request to the api
        // Assuming the result is
        var response = [{
            version: "v1",
            attrs: [
            	{ name: "time", ve: [5.3, 2.1] },
            	{ name: "speed", ve: [3, 0.81] }
            ]
        },{
        	version: "v2",
            attrs: [
            	{ name: "time", ve: [5.7, 2.8] },
            	{ name: "speed", ve: [3.8, 0.41] }
            ]
        },{
        	version: "v3",
            attrs: [
            	{ name: "time", ve: [7, 1] },
            	{ name: "speed", ve: [8, 0.2] }
            ]
        }];

        var versions = response.map(function(e){ return e.version; });

        $scope.attrs = response[0].attrs.map(function(a){
        	return {
        		name: a.name,
        		lineData: {
        			labels: versions,
        			datasets: [{
			            label: a.name + " Average",
			            fillColor: "#2E59C5",
			            highlightFill: "#5A9CDB",
			            data: []
			        },{
			            label: a.name + " Déviation",
			            fillColor: "#176C18",
			            highlightFill: "#44E238",
			            data: []
			        }]
        		}
        	};
        });

        response.forEach(function(item){
        	for(var i in item.attrs){
        		$scope.attrs[i].lineData.datasets[0].data.push(item.attrs[i].ve[0]);
        		$scope.attrs[i].lineData.datasets[1].data.push(item.attrs[i].ve[1]);
        	}
        });
	};
}]);
