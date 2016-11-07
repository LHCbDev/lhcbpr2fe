App.controller('Geanttestem3Controller',
function ($scope, $http, lhcbprResourcesHelper, BUILD_PARAMS) {
  $scope.url = BUILD_PARAMS.url_root;
  $scope.analyze = function (jobIds){
    lhcbprResourcesHelper.compare(jobIds, 'TESTEM3_TABLE').then(showPlots);
    lhcbprResourcesHelper.compare(jobIds, 'TESTEM3_FIT_RESOLUTION').then(showResolutionTrend);
  };
// =============================================================
  function showPlots (results) {
    var points = [];
    var titles = [];

    for (var i = 0; i < results[0].jobvalues.length; i++) {
      var job = results[0].jobvalues[i].job;
      var value = JSON.parse(results[0].jobvalues[i].value);

      points.push(JSON.stringify(value));

      titles.push('Job ' + job.id + ', ' +
                      job.job_description.application_version.version + ', ' +
                      job.platform.content);
    }

    $http.jsonp($scope.url + '/multigraph/?rate=1&points=' + points.join(';') +
      '&titles=' + titles.join(';') +
      '&xaxis=GeV&yaxis=Sampling fraction&callback=JSON_CALLBACK').then(loaded, error);

    if (results[0].jobvalues.length == 2){
      $http.jsonp($scope.url + '/multigraph/?points=' + points[0] +
        '&titles=' + titles[0] +
        '&xaxis=GeV&yaxis=Sampling fraction&callback=JSON_CALLBACK').then(loaded1, error);
      $http.jsonp($scope.url + '/multigraph/?points=' + points[1] +
        '&titles=' + titles[1] +
        '&xaxis=GeV&yaxis=Sampling fraction&callback=JSON_CALLBACK').then(loaded2, error);
    }
  }

  /// [["]]
  function showResolutionTrend(results){
    var versions = {};
    var values = [];
    var errors = [];

    for (var i = 0; i < results.length; i++) {
      var index = results[i].name === 'TESTEM3_FIT_RESOLUTION_ERROR'? 2: 1;

      for (var j = 0; j < results[i].jobvalues.length; j++) {
        var job = results[i].jobvalues[j].job;
        var vname = 'Job ' + job.id + ' version ' +
          job.job_description.application_version.version;

        if (!(vname in versions)){
          versions[vname] = [vname, 0, 0];
        }

        versions[vname][index] = parseFloat(results[i].jobvalues[j].value);
      }
    }


    console.log(Object.values(versions));
    var req = $scope.url + '/profile/?callback=JSON_CALLBACK&points=' + JSON.stringify(Object.values(versions));
    console.log(req);
    $http.jsonp(req)
        .then(loadedTrends, error);
  }

  function loaded (data) {
    console.log(data.data);
    var plot = JSROOT.JSONR_unref(data.data.result);
    JSROOT.redraw('pad', plot);

    if (!data.data.ratios) return;
    var ratios = document.getElementById('ratios');
    ratios.innerHTML = '';
    for (var i=0; i < data.data.ratios.length; i++){
      var ratioHolder = document.createElement("div");
      ratios.appendChild(ratioHolder);
      var ratio = JSROOT.JSONR_unref(data.data.ratios[i]);
      // debugger;
      JSROOT.redraw(ratioHolder, ratio);
    }
  }

  function loaded1 (data) {
    var plot = JSROOT.JSONR_unref(data.data.result);
    JSROOT.redraw('pad1', plot);
  }

  function loaded2 (data) {
    var plot = JSROOT.JSONR_unref(data.data.result);
    JSROOT.redraw('pad2', plot);
  }

  function loadedTrends(data){
    var plot = JSROOT.JSONR_unref(data.data.result);
    JSROOT.redraw('trends', plot);
  }

  function error (err) {
    console.error(err);
  }
});

