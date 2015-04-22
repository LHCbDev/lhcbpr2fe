App.config([ '$stateProvider', 'RouteHelpersProvider',
function ($stateProvider, helper) {
  'use strict';

$stateProvider
	  .state('app.job_descriptions', {
		url: '/job-descriptions',
		title: 'Job Descriptions',
		abstract: true,
		template: '<ui-view/>',
		controller: 'JobDescriptionsController'
	})
	 .state('app.job_descriptions.list', {
		url: '/list',
		title: 'Job Descriptions',
		templateUrl: helper.basepath('jobs/views/job-descriptions.html'),
		controller: 'JobDescriptionsListController'
	})
	.state('app.job_descriptions.add', {
		url: '/add',
		title: 'Add job Description',
		templateUrl: helper.basepath('jobs/views/job-description.html'),
		controller: 'JobDescriptionsAddController'
	})
	.state('app.jobs', {
		url: '/jobs',
		title: 'Jobs',
		abstract: true,
		template: '<ui-view/>',
		controller: 'JobsController'
	})
	.state('app.jobs.list', {
		url: '/list',
		title: 'Jobs',
		templateUrl: helper.basepath('jobs/views/jobs.html'),
		controller: 'JobsListController',
		resolve: helper.resolveFor('ngTable')
	})
	.state('app.jobs.example', {
		url: '/example',
		title: 'Example',
		templateUrl: helper.basepath('jobs/views/jobs.example.html'),
		controller: 'JobsExampleController'
	})
	.state('app.jobs.detail', {
		url: '/detail/:job',
		title: 'Jobs',
		templateUrl: helper.basepath('jobs/views/job.html'),
		controller: 'JobsDetailController',
		resolve: helper.resolveFor('ngTable')
	})
	.state('app.trends', {
        url: '/trends',
        title: 'Trends',
		abstract: true,
        template: '<ui-view/>',
        controller: 'NullController'
    })
    .state('app.trends.chart', {
        url: '/option/:option/attribute/:attribute',
        title: 'Trend',
        templateUrl: helper.basepath('jobs/views/trends.chart.html'),
        controller: 'TrendsChartController',
        resolve: helper.resolveFor('chartjs')
    });
}]);
