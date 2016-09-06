App.controller('Geanttestem3Controller',
               function($scope, $log, lhcbprResourcesHelper, ngDialog,
                        APP_CHART_COLORS, BUILD_PARAMS) {
  $scope.url = BUILD_PARAMS.url_root;
  console.log(Chart.defaults.global.colours);

  $scope.analyze = function(ids) {
    lhcbprResourcesHelper.compare(ids, "TESTEM3_TABLE").then(showPlots);
  };


  $scope.chartHeight = function() { return $(window).height() - 160; };
  $scope.chartWidth = function() { return $(window).width() - 60; };
  $scope.datasets = [];
  // ==========================================================================
  $scope.$on('ngDialog.opened', function(e, $dialog) {
    var ctx = $("#attrChart");
    $scope.chart = new Chart(ctx, {
      type: 'line',
      data: {datasets: $scope.datasets},
      options: {
        title: {
                 display: true,
                 text: "Energy deposition in a sampling calorimeter."
               },
        responsive: true,
        scales: {
          xAxes: [{
                   type: 'linear',
                   position: 'bottom',
                   scaleLabel: {display: true, labelString: "Energy (GeV)"}
                 }],
          yAxes: [{
            type: 'linear',
            position: 'left',
            scaleLabel: {display: true, labelString: "Deposition"}
          }]
        }
      }
    });
  });

  function showPlots(results) {
    console.log(results);
    $scope.datasets.length = 0;
    for (var i = 0; i < results[0].jobvalues.length; i++) {
      var job = results[0].jobvalues[i].job;
      var value = JSON.parse(results[0].jobvalues[i].value);

      //   console.log(job, value);
      var dataset = APP_CHART_COLORS[i % APP_CHART_COLORS.length];
      dataset.label = "Job #" + job.id + ", " +
                      job.job_description.application_version.version + ", " +
                      job.platform.content;
      dataset.data = [];
      dataset.fill = false;

      for (var j = 0; j < value.length; j++) {
        dataset.data.push({x: value[j][0], y: value[j][1]});
      }
      $scope.datasets.push(dataset);
    }

    ngDialog.open({template: 'chartTemplate', className: 'chart-dialog'});
  }
});
