App.config([ '$stateProvider', 'RouteHelpersProvider',
function ($stateProvider, helper) {
  'use strict';

$stateProvider
	  .state('app.job_descriptions', {
		url: '/job-descriptions',
		title: 'Job Descriptions',
		abstract: true,
		template: '<ui-view/>',
		controller: 'JobDescriptionsController',
		resolve: {
			loadModule: ['$ocLazyLoad', function($ocLL) {
		        return $ocLL.load('app/modules/jobs.js');
		    }]
		}
	})
	 .state('app.job_descriptions.list', {
		url: '/list',
		title: 'Job Descriptions',
		templateUrl: helper.basepath('jobs/views/job-descriptions.html'),
		controller: 'JobDescriptionsListController',
		resolve: {
			loadModule: ['$ocLazyLoad', function($ocLL) {
		        return $ocLL.load('app/modules/jobs.js');
		    }]
		}
	})
	.state('app.job_descriptions.add', {
		url: '/add',
		title: 'Add job Description',
		templateUrl: helper.basepath('jobs/views/job-description.html'),
		controller: 'JobDescriptionsAddController',
		resolve: {
			loadModule: ['$ocLazyLoad', function($ocLL) {
		        return $ocLL.load('app/modules/jobs.js');
		    }]
		}
	})
	.state('app.jobs', {
		url: '/jobs',
		title: 'Jobs',
		abstract: true,
		template: '<ui-view/>',
		controller: 'JobsController',
		resolve: {
			loadModule: ['$ocLazyLoad', function($ocLL) {
		        return $ocLL.load('app/modules/jobs.js');
		    }]
		}
	})
	.state('app.jobs.list', {
		url: '/list',
		title: 'Jobs',
		templateUrl: helper.basepath('jobs/views/jobs.html'),
		controller: 'JobsListController',
		resolve: {
			deps: (helper.resolveFor('ngTable')).deps,
			loadModule: ['$ocLazyLoad', function($ocLL) {
		        return $ocLL.load('app/modules/jobs.js');
		    }]
		}
	})
	.state('app.jobs.example', {
		url: '/example',
		title: 'Example',
		templateUrl: helper.basepath('jobs/views/jobs.example.html'),
		controller: 'JobsExampleController',
		resolve: {
			loadModule: ['$ocLazyLoad', function($ocLL) {
		        return $ocLL.load('app/modules/jobs.js');
		    }]
		}
	})
	.state('app.jobs.detail', {
		url: '/detail/:job',
		title: 'Jobs',
		templateUrl: helper.basepath('jobs/views/job.html'),
		controller: 'JobsDetailController',
		resolve: {
			deps: (helper.resolveFor('ngTable')).deps,
			loadModule: ['$ocLazyLoad', function($ocLL) {
		        return $ocLL.load('app/modules/jobs.js');
		    }]
		}
	})
	.state('app.trends', {
        url: '/trends',
        title: 'Trends',
		abstract: true,
        template: '<ui-view/>',
        controller: 'NullController',
        resolve: {
			loadModule: ['$ocLazyLoad', function($ocLL) {
		        return $ocLL.load('app/modules/jobs.js');
		    }]
		}
    })
    .state('app.trends.chart', {
        url: '/option/:option/attribute/:attribute',
        title: 'Trend',
        templateUrl: helper.basepath('jobs/views/trends.chart.html'),
        controller: 'TrendsChartController',
        resolve: {
			deps: (helper.resolveFor('chartjs')).deps,
			loadModule: ['$ocLazyLoad', function($ocLL) {
		        return $ocLL.load('app/modules/jobs.js');
		    }]
		}
    });
}]);
