/*!
 *
 * Angle - Bootstrap Admin App + AngularJS
 *
 * Author: @themicon_co
 * Website: http://themicon.co
 * License: http://support.wrapbootstrap.com/knowledge_base/topics/usage-licenses
 *
 */

if (typeof $ === 'undefined') {
    throw new Error('This application\'s JavaScript requires jQuery');
}

// Services App (used for defining providers)
// ----------------------------------- 
var Services = angular.module('lhcbprServices', []);
Services.provider('plotViews', function () {
    var plotViews = [];
    this.registerPlotView = function(directiveName, displayName) {
        plotViews.push({
            directiveName: directiveName,
            displayName: displayName
        });
    };
    this.$get = function() {
        return plotViews;
    };
});

Services.config(['plotViewsProvider', function(plotViewsProvider) {
    plotViewsProvider.registerPlotView('plotSplit', "Split");
    plotViewsProvider.registerPlotView('plotSame', "Superimposed");
    plotViewsProvider.registerPlotView('plotDifference', "Difference");
    plotViewsProvider.registerPlotView('plotRatio', "Ratio");
    plotViewsProvider.registerPlotView('plotKolmogorov', "Kolmogorov");
}]);


// APP START
// ----------------------------------- 

var App = angular.module('angle', ['ngRoute',
        'ngAnimate',
        'ngStorage',
        'ngCookies',
        'pascalprecht.translate',
        'ui.bootstrap',
        'ui.router',
        'oc.lazyLoad',
        'cfp.loadingBar',
        'ngSanitize',
        'ngResource',
        'restangular',
        'checklist-model',
        'buildParams',
        'lhcbprServices'
    ])
    .run(["$rootScope", "$state", "$stateParams", '$window', '$templateCache',
        function($rootScope, $state, $stateParams, $window, $templateCache) {
            // Set reference to access them from any scope
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
            $rootScope.$storage = $window.localStorage;

            // Uncomment this to disables template cache
            /*$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
									if (typeof(toState) !== 'undefined'){
										$templateCache.remove(toState.templateUrl);
									}
							});*/

            // Scope Globals
            // ----------------------------------- 
            $rootScope.app = {
                name: 'LHCbPR',
                description: 'Some description here',
                year: ((new Date()).getFullYear()),
                layout: {
                    isFixed: true,
                    isCollapsed: false,
                    isBoxed: false,
                    isRTL: false
                },
                useFullLayout: false,
                hiddenFooter: false,
                viewAnimation: 'ng-fadeInUp'
            };
            $rootScope.user = {
                name: 'John',
                job: 'ng-Dev',
                picture: 'app/img/user/02.jpg'
            };
            $rootScope.menuItems = [];
            $rootScope.pendingRequests = 0;
            $rootScope.loadingPercentage = 100;
        }
    ]);
