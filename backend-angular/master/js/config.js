/**=========================================================
 * Module: config.js
 * App routes and resources configuration
 =========================================================*/

App.config(['$stateProvider','$urlRouterProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$ocLazyLoadProvider', 'APP_REQUIRES', 'RouteHelpersProvider',
function ($stateProvider, $urlRouterProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $ocLazyLoadProvider, appRequires, helper) {
  'use strict';

  App.controller = $controllerProvider.register;
  App.directive  = $compileProvider.directive;
  App.filter     = $filterProvider.register;
  App.factory    = $provide.factory;
  App.service    = $provide.service;
  App.constant   = $provide.constant;
  App.value      = $provide.value;

  // LAZY MODULES
  // ----------------------------------- 

  $ocLazyLoadProvider.config({
    debug: false,
    events: true,
    modules: appRequires.modules
  });

  Deps.all.libraries = appRequires.scripts;
  Deps.all.angularModules = appRequires.modules.map(function(m){
  	return m.name;
  });

  // defaults to dashboard
  $urlRouterProvider.otherwise('/app/jobs/list');

  // 
  // Application Routes
  // -----------------------------------   
  $stateProvider
    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: helper.basepath('app.html'),
        controller: 'AppController',
        resolve: helper.resolveFor('fastclick', 'modernizr', 'icons', 'screenfull', 'animo', 'sparklines', 'slimscroll', 'classyloader', 'toaster', 'whirl')
    })
/*    .state('app.dashboard', {
        url: '/dashboard',
        title: 'Dashboard',
        templateUrl: helper.basepath('dashboard.html'),
        resolve: helper.resolveFor('flot-chart','flot-chart-plugins')
    })
    .state('app.dashboard_v2', {
        url: '/dashboard_v2',
        title: 'Dashboard v2',
        templateUrl: helper.basepath('dashboard_v2.html'),
        controller: function($rootScope) { $rootScope.app.layout.isCollapsed = true; },
        resolve: helper.resolveFor('flot-chart','flot-chart-plugins')
    })
    .state('app.dashboard_v3', {
        url: '/dashboard_v3',
        title: 'Dashboard v3',
        templateUrl: helper.basepath('dashboard_v3.html'),
        resolve: helper.resolveFor('flot-chart','flot-chart-plugins', 'vector-map')
    })
    .state('app.widgets', {
        url: '/widgets',
        title: 'Widgets',
        templateUrl: helper.basepath('widgets.html'),
        controller: 'NullController',
        resolve: helper.resolveFor('loadGoogleMapsJS', function() { return loadGoogleMaps(); }, 'google-map')
    })

    .state('app.buttons', {
        url: '/buttons',
        title: 'Buttons',
        templateUrl: helper.basepath('buttons.html'),
        controller: 'NullController'
    })
    .state('app.colors', {
        url: '/colors',
        title: 'Colors',
        templateUrl: helper.basepath('colors.html'),
        controller: 'NullController'
    })
    .state('app.navtree', {
        url: '/navtree',
        title: 'Nav Tree',
        templateUrl: helper.basepath('nav-tree.html'),
        controller: 'NullController',
        resolve: helper.resolveFor('angularBootstrapNavTree')
    })
    .state('app.nestable', {
        url: '/nestable',
        title: 'Nestable',
        templateUrl: helper.basepath('nestable.html'),
        controller: 'NullController',
        resolve: helper.resolveFor('nestable')
    })
    .state('app.sortable', {
        url: '/sortable',
        title: 'Sortable',
        templateUrl: helper.basepath('sortable.html'),
        controller: 'NullController',
        resolve: helper.resolveFor('htmlSortable')
    })
    .state('app.notifications', {
        url: '/notifications',
        title: 'Notifications',
        templateUrl: helper.basepath('notifications.html'),
        controller: 'NotificationController'
    })
    .state('app.ngdialog', {
        url: '/ngdialog',
        title: 'ngDialog',
        templateUrl: helper.basepath('ngdialog.html'),
        resolve: angular.extend(helper.resolveFor('ngDialog'),{
          tpl: function() { return { path: helper.basepath('ngdialog-template.html') }; }
        }),
        controller: 'DialogIntroCtrl'
    })
    .state('app.interaction', {
        url: '/interaction',
        title: 'Interaction',
        templateUrl: helper.basepath('interaction.html'),
        controller: 'NullController'
    })
    .state('app.spinners', {
        url: '/spinners',
        title: 'Spinners',
        templateUrl: helper.basepath('spinners.html'),
        controller: 'NullController'
    })
    .state('app.animations', {
        url: '/animations',
        title: 'Animations',
        templateUrl: helper.basepath('animations.html'),
        controller: 'NullController'
    })
    .state('app.dropdown-animations', {
        url: '/dropdown-animations',
        title: 'Dropdown Animations',
        templateUrl: helper.basepath('dropdown-animations.html'),
        controller: 'NullController'
    })
    .state('app.panels', {
        url: '/panels',
        title: 'Panels',
        templateUrl: helper.basepath('panels.html'),
        controller: 'NullController'
    })
    .state('app.portlets', {
        url: '/portlets',
        title: 'Portlets',
        templateUrl: helper.basepath('portlets.html'),
        controller: 'NullController',
        resolve: helper.resolveFor('jquery-ui', 'jquery-ui-widgets')
    })
    .state('app.maps-google', {
        url: '/maps-google',
        title: 'Maps Google',
        templateUrl: helper.basepath('maps-google.html'),
        controller: 'NullController',
        resolve: helper.resolveFor('loadGoogleMapsJS', function() { return loadGoogleMaps(); }, 'google-map')
    })
    .state('app.maps-vector', {
        url: '/maps-vector',
        title: 'Maps Vector',
        templateUrl: helper.basepath('maps-vector.html'),
        controller: 'VectorMapController',
        resolve: helper.resolveFor('vector-map')
    })
    .state('app.grid', {
        url: '/grid',
        title: 'Grid',
        templateUrl: helper.basepath('grid.html'),
        controller: 'NullController'
    })
    .state('app.grid-masonry', {
        url: '/grid-masonry',
        title: 'Grid Masonry',
        templateUrl: helper.basepath('grid-masonry.html'),
        controller: 'NullController'
    })
    .state('app.typo', {
        url: '/typo',
        title: 'Typo',
        templateUrl: helper.basepath('typo.html'),
        controller: 'NullController'
    })
    .state('app.icons-font', {
        url: '/icons-font',
        title: 'Icons Font',
        templateUrl: helper.basepath('icons-font.html'),
        controller: 'NullController'
    })
    .state('app.icons-weather', {
        url: '/icons-weather',
        title: 'Icons Weather',
        templateUrl: helper.basepath('icons-weather.html'),
        controller: 'NullController'
    })
    .state('app.form-standard', {
        url: '/form-standard',
        title: 'Form Standard',
        templateUrl: helper.basepath('form-standard.html'),
        controller: 'NullController'
    })
    .state('app.form-extended', {
        url: '/form-extended',
        title: 'Form Extended',
        templateUrl: helper.basepath('form-extended.html'),
        controller: 'NullController',
        resolve: helper.resolveFor('codemirror', 'codemirror-plugins', 'moment', 'taginput','inputmask','localytics.directives', 'slider', 'ngWig', 'filestyle')
    })
    .state('app.form-validation', {
        url: '/form-validation',
        title: 'Form Validation',
        templateUrl: helper.basepath('form-validation.html'),
        controller: 'NullController',
        resolve: helper.resolveFor('parsley')
    })
    .state('app.form-wizard', {
        url: '/form-wizard',
        title: 'Form Wizard',
        templateUrl: helper.basepath('form-wizard.html'),
        controller: 'NullController',
        resolve: helper.resolveFor('parsley')
    })
    .state('app.form-upload', {
        url: '/form-upload',
        title: 'Form upload',
        templateUrl: helper.basepath('form-upload.html'),
        controller: 'NullController',
        resolve: helper.resolveFor('angularFileUpload', 'filestyle')
    })
    .state('app.form-xeditable', {
        url: '/form-xeditable',
        templateUrl: helper.basepath('form-xeditable.html'),
        controller: 'NullController',
        resolve: helper.resolveFor('xeditable')
    })
    .state('app.form-imagecrop', {
        url: '/form-imagecrop',
        templateUrl: helper.basepath('form-imagecrop.html'),
        controller: 'NullController',
        resolve: helper.resolveFor('ngImgCrop', 'filestyle')
    })
    .state('app.form-uiselect', {
        url: '/form-uiselect',
        templateUrl: helper.basepath('form-uiselect.html'),
        controller: 'uiSelectController',
        resolve: helper.resolveFor('ui.select')
    })
    .state('app.chart-flot', {
        url: '/chart-flot',
        title: 'Chart Flot',
        templateUrl: helper.basepath('chart-flot.html'),
        controller: 'NullController',
        resolve: helper.resolveFor('flot-chart','flot-chart-plugins')
    })
    .state('app.chart-radial', {
        url: '/chart-radial',
        title: 'Chart Radial',
        templateUrl: helper.basepath('chart-radial.html'),
        controller: 'NullController',
        resolve: helper.resolveFor('classyloader')
    })
    .state('app.table-standard', {
        url: '/table-standard',
        title: 'Table Standard',
        templateUrl: helper.basepath('table-standard.html'),
        controller: 'NullController'
    })
    .state('app.table-extended', {
        url: '/table-extended',
        title: 'Table Extended',
        templateUrl: helper.basepath('table-extended.html'),
        controller: 'NullController'
    })
    .state('app.table-datatable', {
        url: '/table-datatable',
        title: 'Table Datatable',
        templateUrl: helper.basepath('table-datatable.html'),
        controller: 'NullController',
        resolve: helper.resolveFor('datatables', 'datatables-pugins')
    })
    .state('app.table-xeditable', {
        url: '/table-xeditable',
        templateUrl: helper.basepath('table-xeditable.html'),
        controller: 'NullController',
        resolve: helper.resolveFor('xeditable')
    })
    .state('app.table-ngtable', {
        url: '/table-ngtable',
        templateUrl: helper.basepath('table-ngtable.html'),
        controller: 'NullController',
        resolve: helper.resolveFor('ngTable', 'ngTableExport')
    })
    .state('app.timeline', {
        url: '/timeline',
        title: 'Timeline',
        templateUrl: helper.basepath('timeline.html'),
        controller: 'NullController'
    })
    .state('app.calendar', {
        url: '/calendar',
        title: 'Calendar',
        templateUrl: helper.basepath('calendar.html'),
        controller: 'NullController',
        resolve: helper.resolveFor('jquery-ui', 'jquery-ui-widgets', 'moment', 'fullcalendar')
    })
    .state('app.invoice', {
        url: '/invoice',
        title: 'Invoice',
        templateUrl: helper.basepath('invoice.html'),
        controller: 'NullController'
    })
    .state('app.search', {
        url: '/search',
        title: 'Search',
        templateUrl: helper.basepath('search.html'),
        controller: 'NullController',
        resolve: helper.resolveFor('moment', 'localytics.directives', 'slider')
    })
    .state('app.todo', {
        url: '/todo',
        title: 'Todo List',
        templateUrl: helper.basepath('todo.html'),
        controller: 'TodoController'
    })
    .state('app.profile', {
        url: '/profile',
        title: 'Profile',
        templateUrl: helper.basepath('profile.html'),
        controller: 'NullController',
        resolve: helper.resolveFor('loadGoogleMapsJS', function() { return loadGoogleMaps(); }, 'google-map')
    })
    .state('app.code-editor', {
        url: '/code-editor',
        templateUrl: helper.basepath('code-editor.html'),
        resolve: {
            deps: helper.resolveFor('codemirror', 'ui.codemirror', 'codemirror-modes-web', 'angularBootstrapNavTree').deps,
            filetree: function (LoadTreeService) {
                return LoadTreeService.get().$promise.then(function (res) {
                    return res.data;
                });
            }
        },
        controller: function($rootScope, $scope, filetree) {
            // Set the tree data into the scope
            $scope.filetree_data = filetree;
            // Setup the layout mode 
            $rootScope.app.useFullLayout = true;
            $rootScope.app.hiddenFooter = true;
            $rootScope.app.layout.isCollapsed = true;
            // Restore layout
            $scope.$on('$destroy', function(){
                $rootScope.app.useFullLayout = false;
                $rootScope.app.hiddenFooter = false;
            });
        }
    })
    .state('app.template', {
        url: '/template',
        title: 'Blank Template',
        templateUrl: helper.basepath('template.html'),
        controller: 'NullController'
    })
    .state('app.documentation', {
        url: '/documentation',
        title: 'Documentation',
        templateUrl: helper.basepath('documentation.html'),
        controller: 'NullController',
        resolve: helper.resolveFor('flatdoc')
    })
    // Mailbox
    // ----------------------------------- 
    .state('app.mailbox', {
        url: '/mailbox',
        title: 'Mailbox',
        abstract: true,
        templateUrl: helper.basepath('mailbox.html'),
        controller: 'MailboxController'
    })
    .state('app.mailbox.folder', {
        url: '/folder/:folder',
        title: 'Mailbox',
        templateUrl: helper.basepath('mailbox-inbox.html'),
        controller: 'NullController'
    })
    .state('app.mailbox.view', {
        url : "/{mid:[0-9]{1,4}}",
        title: 'View mail',
        templateUrl: helper.basepath('mailbox-view.html'),
        controller: 'NullController',
        resolve: helper.resolveFor('ngWig')
    })
    .state('app.mailbox.compose', {
        url: '/compose',
        title: 'Mailbox',
        templateUrl: helper.basepath('mailbox-compose.html'),
        controller: 'NullController',
        resolve: helper.resolveFor('ngWig')
    })
    // 
    // Multiple level example
    // ----------------------------------- 
    .state('app.multilevel', {
        url: '/multilevel',
        title: 'Multilevel',
        template: '<h3>Multilevel Views</h3>' + '<div class="lead ba p">View @ Top Level ' + '<div ui-view=""></div> </div>'
    })
    .state('app.multilevel.level1', {
        url: '/level1',
        title: 'Multilevel - Level1',
        template: '<div class="lead ba p">View @ Level 1' + '<div ui-view=""></div> </div>'
    })
    .state('app.multilevel.level1.item', {
        url: '/item',
        title: 'Multilevel - Level1',
        template: '<div class="lead ba p"> Menu item @ Level 1</div>'
    })
    .state('app.multilevel.level1.level2', {
        url: '/level2',
        title: 'Multilevel - Level2',
        template: '<div class="lead ba p">View @ Level 2'  + '<div ui-view=""></div> </div>'
    })
    .state('app.multilevel.level1.level2.level3', {
        url: '/level3',
        title: 'Multilevel - Level3',
        template: '<div class="lead ba p">View @ Level 3' + '<div ui-view=""></div> </div>'
    })
    .state('app.multilevel.level1.level2.level3.item', {
        url: '/item',
        title: 'Multilevel - Level3 Item',
        template: '<div class="lead ba p"> Menu item @ Level 3</div>'
    })
    // 
    // Single Page Routes
    // ----------------------------------- 
    .state('page', {
        url: '/page',
        templateUrl: 'app/pages/page.html',
        resolve: helper.resolveFor('modernizr', 'icons', 'parsley')
    })
    .state('page.login', {
        url: '/login',
        title: "Login",
        templateUrl: 'app/pages/login.html'
    })
    .state('page.register', {
        url: '/register',
        title: "Register",
        templateUrl: 'app/pages/register.html'
    })
    .state('page.recover', {
        url: '/recover',
        title: "Recover",
        templateUrl: 'app/pages/recover.html'
    })
    .state('page.lock', {
        url: '/lock',
        title: "Lock",
        templateUrl: 'app/pages/lock.html'
    })
    .state('page.404', {
        url: '/404',
        title: "Not Found",
        templateUrl: 'app/pages/404.html'
    })
    // 
    // CUSTOM RESOLVES
    //   Add your own resolves properties
    //   following this object extend
    //   method
    // ----------------------------------- 
    // .state('app.someroute', {
    //   url: '/some_url',
    //   templateUrl: 'path_to_template.html',
    //   controller: 'someController',
    //   resolve: angular.extend(
    //     helper.resolveFor(), {
    //     // YOUR RESOLVES GO HERE
    //     }
    //   )
    // })
    ;
*/

}]).config(['$translateProvider', function ($translateProvider) {

    $translateProvider.useStaticFilesLoader({
        prefix : 'app/i18n/',
        suffix : '.json'
    });
    $translateProvider.preferredLanguage('en');
    $translateProvider.useLocalStorage();

}]).config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeBar = true;
    cfpLoadingBarProvider.includeSpinner = false;
    cfpLoadingBarProvider.latencyThreshold = 500;
    cfpLoadingBarProvider.parentSelector = '.wrapper > section';
  }])
.controller('NullController', function() {});
