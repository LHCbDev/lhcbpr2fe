(function () {                  // Start of closure
  var module = Module.create('jobs', 'LHCbPR Jobs', 1);
  module.addMenuItem({
    text: "Job Descriptions",
    sref: "app.job_descriptions.list",
    icon: "icon-grid"
    // alert: "new"
  });
  module.addMenuItem({
    text: "Jobs",
    sref: "app.jobs.list",
    icon: "icon-grid"
    // alert: "new"
  })
    .addState({
      name: 'app.job_descriptions',
      controller: 'JobDescriptionsController',
      abstract: true,
      template: '<ui-view/>',
      resolve: ['jobs']
    })
    .addState({
      name: 'app.job_descriptions.list',
      controller: 'JobDescriptionsListController',
      title: 'Job Descriptions',
      templateUrl: 'job-descriptions.html'
    })
    .addState({
      name: 'app.job_descriptions.add',
      controller: 'JobDescriptionsAddController',
      title: 'Add Job Description',
      templateUrl: 'job-description.html'
    })
    .addState({
      name: 'app.jobs',
      controller: 'JobsController',
      abstract: true,
      template: '<ui-view/>',
      resolve: ['jobs']
    })
    .addState({
      name: 'app.jobs.list',
      controller: 'JobsListController',
      title: 'Jobs',
      templateUrl: 'jobs.html',
      resolve: ['chartjs','ngTable', 'ngDialog']
    })
    .addState({
      name: 'app.jobs.example',
      controller: 'JobsExampleController',
      templateUrl: 'jobs.example.html',
      resolve: ['ngTable']
    })
    .addState({
      name: 'app.jobs.detail',
      controller: 'JobsDetailController',
      url: '/detail/:job',
      title: 'Jobs',
      templateUrl: 'job.html',
      resolve: ['ngTable']
    })
    .addState({
      name: 'app.trends',
      abstract: true,
      template: '<ui-view/>',
      controller: 'NullController',
      resolve: ['jobs']
    })
    .addState({
      name: 'app.trends.chart',
      controller: 'TrendsChartController',
      url: '/option/:option/attribute/:attribute',
      templateUrl: 'trends.chart.html',
      resolve: ['chartjs']
    });

  // ROOT file viewer stuff
  module.registerTestView({
    title: "ROOT file viewer"
    // defaultPlots: ["/GenMonitorAlg/4", "/GenMonitorAlg/44"]
    // defaultPlotView: "plotSame",
    // restrict: {
    //   selectedOptions: "GEANT_TESTEM3"
    // }
  });

  module.start();
})();                           // End of closure

// Local Variables:
// js2-basic-offset: 2
// js-indent-level: 2
// indent-tabs-mode: nil
// End:
