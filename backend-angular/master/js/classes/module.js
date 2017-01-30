/**
 * Class representing a module
 * This class abstracts a group of menu items and routes
 * to add to the angular application
 */

/**
 * Module Constructor
 * @param {string} name      name of the module
 * @param {string} title     title to show in the sidebar
 * @param {int}    position  position of modules links in the sidebar menu
 * @param {Object} settings  Additional settings
 */
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
    console.log("Url for "+state.name+" automatically set to be "+state.url);
  }
  if(undefined === state.title){
    var parts = [];
    for(var i in words)
      parts.push(words[i].charAt(0).toUpperCase() + words[i].substr(1));
    state.title = parts.join(' ');
    console.log("Title for "+state.name+" automatically set to be "+state.title);
  }
  if(undefined === state.templateUrl && undefined === state.template){
    state.templateUrl = 'app/modules/' + this.folder + '/views/' + words.join('-') + '.html';
    console.log("TemplateUrl for "+state.name+" automatically set to be "+state.templateUrl);
  } else if(undefined !== state.templateUrl){
    state.templateUrl = 'app/modules/' + this.folder + '/views/' + state.templateUrl;
    console.log("TemplateUrl for "+state.name+" automatically set to be "+state.templateUrl);
  }
  if(undefined === state.controller){
    // TODO remove this logic. One should not have to guess what a controller is called!
    // state.controller = [];
    // var parts = state.name.split('.');
    // parts.forEach(function(part){
    //   part.split('_').forEach(function(word){
    //     state.controller.push(word.charAt(0).toUpperCase() + word.substr(1));
    //   });
    // });
    // state.controller = state.controller.join('') + 'Controller';
    // console.log("Controller for "+state.name+" automatically set to be "+state.controller);
    console.error("Controller is not defined for "+state.name+"! Expect breakages.");
  }

  if(undefined === state.resolve) {
    state.resolve = [];
  }
  Deps.commonModules.forEach(function(cm){
    state.resolve.push(cm);
  });
  console.log("Resolve for "+state.name+" automatically set to be "+JSON.stringify(state.resolve));
  state.resolve = this.makePromises(state.resolve);

  console.log("Final state for "+state.name+" is:");
  state.name = 'app.' + state.name;
  console.log(JSON.stringify(state, null, 2));
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
