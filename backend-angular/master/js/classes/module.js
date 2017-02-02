/**
 * Class representing a module
 * This class abstracts a group of menu items and routes
 * to add to the angular application
 */

// TODO make registerTest function
// TODO make default resolve for default controller (found rootfileviewer addState)
// TODO Pass title and other info to default controller for customisation
// TODO add restrict keyword to registerTest function to pass to select-jobs directive
// TODO generally trim default controller

/**
 * Module Constructor
 * @param {string} name      name of the module
 * @param {string} title     title to show in the sidebar
 * @param {int}    position  position of modules links in the sidebar menu
 * @param {Object} settings  Additional settings
 */

var ModuleHelpers = new function() {
  var that = this;
  this.nameOfDefaultController = function(name) {
    // debugger;
    if("" === name) {
      console.error("No name provided to create default controller name!");
      return "";
    }
    controller_name = _.camelCase(name)+"DefaultController";
    return controller_name;
  };

  this.resolveOfDefaultController = function() {
    return ['jobs', 'chartjs', 'ngTable', 'ngDialog', 'jsroot'];
  };

  this.defaultControllerFactory = function(options) {
    // TODO farm most of the functionality of this controller out to custom
    // services so that they are loaded only once (and the code is not so
    // monolithic).
    var name = options.name || logger.error("No name provided for default controller.");
    var title = options.title || name;
    var restrict = options.restrict || {};
    var plotViewsFromArgs = options.plotViews; // or leave undefined

    var controller_name = that.nameOfDefaultController(name);
    App.controller(
      controller_name,
      ['$scope', 'lhcbprResources', 'rootResources', 'BUILD_PARAMS', 'plotViews',
       function($scope, $api, $apiroot, BUILD_PARAMS, plotViewsFromProvider) {

         $apiroot.lookupFileContents(["11/MuonMoniSim_histos.root"]).then( function(resp) {
           $scope.apiroot = resp;
         });


         $scope.plotViews = [];
         $scope.plotViewsFromProvider = plotViewsFromProvider;
         if(undefined !== plotViewsFromArgs) {
           let i;
           for(i in plotViewsFromProvider) {
             let index = _.findIndex(
               plotViewsFromArgs,
               function(o) {return o === plotViewsFromProvider[i].directiveName;});
             if(index > -1) {
               $scope.plotViews.push(plotViewsFromProvider[i]);
             }
           }
         } else {
           $scope.plotViews = plotViewsFromProvider;
         }
         // TODO check for plotViews requested but not found

         $scope.selectionLevels = {};
         $scope.addSelectionLevel = function(currentLevel, newLevelData) {
           // TODO remove lower levels
           $scope.data.treedirsStructure
           $scope.selectionLevels[currentLevel] = newLevelData;
         };

         $scope.selectedApp = restrict.selectedApp;
         $scope.selectedOptions = restrict.selectedOptions;

         $scope.color = {
           0: "white",
           1: "black",
           2: "red",
           3: "green",
           4: "blue",
           5: "yellow",
           6: "magenta",
           7: "cyan",
           8: "rgb(89,212,84)",
           9: "rgb(89,84,217)"
         };

         $scope.jobId = [];
         $scope.folders = ['/'];
         $scope.noJobData = true;
         $scope.isShowSearchForm = true;
         $scope.cachedJobs = {};

         $scope.data = {
           repeatSelect: null,
           plotSelect: null,
           treedirs: {},
           treeplots: {},
           tree: {},
           // graphs: {},
           graphs: [],
           optvalue: ""
         };

         $scope.panelJobs = {toggle: false};
         $scope.hidePanelDebug = true;

         // $scope.sizeOf = function(obj) {
         //   return Object.keys(obj).length;
         // };

         $scope.showSearchForm = function() {
           $scope.isShowSearchForm = true;
         };

         $scope.lookHistos = function(jids) {
           $scope.jobId = [];
           $scope.folders = ['/'];
           $scope.noJobData = true;
           $scope.isShowSearchForm = false;

           $scope.data = {
             repeatSelect: null,
             plotSelect: null,
             treedirs: {},
             treeplots: {},
             tree: {},
             graphs: {},
             optvalue: ""
           };

           var requestParams = {
             ids: jids.join(),
             type: "File"
           };
           for (var i = 0, l = jids.length; i < l; ++i) {
             $api.one('jobs', jids[i]).get().then(
               function(job) {
                 $scope.cachedJobs[job.id] = job;
               }
             );
           }

           var result = {};
           if (jids && jids.length > 0) {
             $api.all('compare')
               .getList(requestParams)
               .then(function(attr) { // When we receive the response
                 var res = [];
                 for (i = 0; i < attr.length; i++) {
                   let j;
                   for (j = 0; j < attr[i].jobvalues.length; j++) {
                     if ( attr[i].jobvalues[j].value.endsWith(".root") ) {
                       var file = attr[i].jobvalues[j].job.id + '/' + attr[i].jobvalues[j].value;
                       res.push(file);
                     }
                   }
                 }
                 // TODO look into whether it's really worth this jobId double
                 // underscore join thing or whether one should only use
                 // $scope.files for files, and $scope.jobId for showing pretty
                 // things (e.g. titles on the page).
                 $scope.files = res;
                 // TODO find the best place to initialise this
                 $scope.url = BUILD_PARAMS.url_root;
                 // debugger;
                 $scope.jobId = res.join("__");
                 $scope.folders = ['/'];
                 $scope.readFiles();
               });
           }
         };


         $scope.readFiles = function () {
           $scope.noJobData = ($scope.jobId.length < 1);
           if ($scope.jobId && $scope.jobId.length > 0) {
             var parameters = {
               files: $scope.jobId,
               folders: $scope.folders
             };
             $apiroot.lookupFileContents($scope.jobId).then (function(response) {
               var i;
               var retVal;
               // gets the last one in response
               for(i in response) {
                 retVal = response[i];
               }

               $scope.data.treedirs = retVal;
               $scope.data.treedirsStructure = $apiroot.sortFileContentsToJSON(response);
             });
           };
         };

         $scope.hasChildren = function(val, ind) {
           return val.children;
         };

       }]);
  };
};

var Module = function(name, title, position, settings){
  this.name = name;
  this.menu = {
    text: title,
    position: position,
    sref: "#",
    icon: "icon-doc",
    submenu: []
  };
  if(undefined !== settings && undefined !== settings.folder)
    this.folder = settings.folder;
  else
    this.folder = name;
  this.states = [];
  this.$app = App; // referencing the angular application
  Deps.addModules([{
    name: name,
    files: ['app/modules/' + name + '/all.js', 'app/modules/' + name + '/style.css']
  }]);
};

Module.create = function(name, title, position, settings){
  return new Module(name, title, position, settings);
};

Module.prototype.addMenuItem = function(item){
  /**
   * Adds submenu item to menu.
   */
  this.menu.submenu.push(item);
  return this;
};

Module.prototype.addState = function(state){
  /**
   * Expects a completed states.
   *
   * Tries to make intelligent decisions on how to fill in missing keys.
   */
  if(undefined === state.name){
    console.error('Cannot add a state without a name !');
    return;
  }
  // words in the last name (after last '.')
  // assuming that words are seperated with '_'
  //
  // ... assuming makes things very difficult to debug. Refactoring code.
  var words = state.name.split('.'); // Split name into Array
  words = words[words.length - 1];   // Get last element of Array
  words = words.split('_');          // Split on '_'
  if(undefined === state.url){
    state.url = '/' + words.join('-');
    console.debug("Url for "+state.name+" automatically set to be "+state.url);
  }

  if (undefined === state.controller) {
    console.error("No controller specified. Expect breakages!");
  }

  // TODO properly document what templateUrl and template do.
  if(undefined === state.templateUrl && undefined === state.template){
    state.templateUrl = 'app/modules/' + this.folder + '/views/' + words.join('-') + '.html';
    console.debug("TemplateUrl for "+state.name+" automatically set to be "+state.templateUrl);
  } else if(undefined !== state.templateUrl){
    state.templateUrl = 'app/modules/' + this.folder + '/views/' + state.templateUrl;
    console.debug("TemplateUrl for "+state.name+" automatically set to be "+state.templateUrl);
  }
  // NOTE: this overrides any templateUrl which has been given.
  //
  // TODO either phase out templateUrl, or make it not second guess the programmer.
  if(undefined !== state.fullTemplateUrl) {
    state.templateUrl = state.fullTemplateUrl;
    state.fullTemplateUrl = undefined;
  };

  if(undefined === state.resolve) {
    state.resolve = [];
  }
  Deps.commonModules.forEach(function(cm){
    state.resolve.push(cm);
  });
  console.debug("Resolve for "+state.name+" automatically set to be "+JSON.stringify(state.resolve));
  state.resolve = this.makePromises(state.resolve);

  console.debug("Final state for "+state.name+" is:");
  console.debug(JSON.stringify(state, null, 2));
  this.states.push(state);

  return this;
};

Module.prototype.makePromises = function(deps) {
  return {
    loadDeps: ['$ocLazyLoad', '$q', function($ll, $q){
      var promise = $q.when(1);
      deps.forEach(function(dep){
        if(typeof dep === 'function')
          promise = promise.then(dep);
        else
          promise = promise.then(function(){
            var files = Deps.get(dep);
            if(null === files)
              return $.error('Cannot find the dependency : "' + dep + '" !');
            return $ll.load(files);
          });
      });
      return promise;
    }]
  };
};

Module.prototype.registerTestView = function(options) {
  console.debug(
    "Options submitted to registerTestView:\n"+JSON.stringify(options, null, 2));
  var title = options.title || logger.error("No title defined! Expect breakages!");
  var name = options.name || (_.camelCase(title)).toLowerCase();
  var appName = options.appName || "app."+name;
  var icon = options.icon || "icon-speedometer";
  var alert = options.alert; // or keep undefined
  var url = options.url || "/"+name;

  var restrict = options.restrict || {};

  // TODO get the plotViews allowed into the default controller
  var plotViews = options.plotViews; // or keep undefined

  // TODO add more state options

  // TODO add the automatic default controller creation here, instead of in the
  // add state

  // Usually, physicists using registerTestView will be doing so in order to use
  // the default controller.
  //
  // TODO provide support for custom controllers
  if(undefined === options.controller && undefined === options.templateUrl) {
    ModuleHelpers.defaultControllerFactory({
      name: name,
      title:title,
      restrict: restrict,
      plotViews: plotViews
    });
    var controller = ModuleHelpers.nameOfDefaultController(name);
    var resolve = ModuleHelpers.resolveOfDefaultController();
    var fullTemplateUrl = "app/views/default_controller/default-controller.html";
  } else {
    console.error("registerTestView currently does not support custom controllers.");
    console.error("Aborting creation of test view.");
    return undefined;
  }


  menuItem = {
    text: title,
    sref: appName,
    icon: icon,
    alert: alert
  };
  state = {
    name: appName,
    url: url,
    resolve: resolve,
    controller: controller,
    fullTemplateUrl: fullTemplateUrl
  };

  this.addMenuItem(menuItem);
  this.addState(state);

  return this;
}


Module.prototype.start = function(){
  var self = this;
  // Adding menu items
  this.$app.run(['$rootScope', function($rootScope){
    $rootScope.menuItems.push(self.menu);
  }]);
  // Adding routes
  this.$app.config(['$stateProvider', function($stateProvider){
    self.states.forEach(function(state){
      $stateProvider.state(state.name, state);
    });
  }]);
};

// Local Variables:
// js2-basic-offset: 2
// js-indent-level: 2
// indent-tabs-mode: nil
// End:
