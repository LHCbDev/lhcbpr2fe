App.config([ '$stateProvider', 'RouteHelpersProvider',
function ($stateProvider, helper) {
  'use strict';

$stateProvider
	.state('app.test', {
		url: '/test',
		title: 'Test',
		templateUrl: helper.basepath('test/views/test.html'),
		controller: 'TestController',
		resolve: helper.resolveFor('chartjs')
	});
}]);
