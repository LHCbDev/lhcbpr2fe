App.config([ '$stateProvider', 'RouteHelpersProvider',
function ($stateProvider, helper) {
  'use strict';

$stateProvider
	.state('app.attributes', {
		url: '/attributes',
		title: 'attributes',
		templateUrl: helper.basepath('attributes/views/attributes.html'),
		controller: 'AttributesController',
		resolve: {
			deps: (helper.resolveFor('chartjs')).deps,
			loadModule: ['$ocLazyLoad', function($ocLL) {
		        return $ocLL.load('app/modules/attributes.js');
		    }]
		}
	});
}]);
