(function() {
  var CONTROLLER_NAME = 'MuonmonisimController';
  App.controller(
    CONTROLLER_NAME,
    ['$scope', 'lhcbprResources', 'rootResources', 'BUILD_PARAMS',
     function($scope, $api, $apiroot, BUILD_PARAMS) {


       // For the clock test
       $scope.format = 'M/d/yy h:mm:ss a';

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

       $scope.options = [
         {value: 'Difference', text: 'Plot difference'},
         {value: 'Ratio', text: 'Plot ratio'},
         {value: 'Kolmogorov', text: 'Apply Kolmogorv test'},
       ];

       $scope.commonoptions = [
         {value: '', text: 'Superimposed'},
         {value: 'Split', text: 'Separated'}
       ];

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
         graphs: {},
         optvalue: ""
       };

       // TODO remove
       // $scope.foobar = {bar: true};
       $scope.foobar = 'bar';

       $scope.panelJobs = {toggle: false};

       $scope.sizeOf = function(obj) {
         return Object.keys(obj).length;
       };


       $scope.showSearchForm = function() {
         $scope.isShowSearchForm = true;
       };

       $scope.getJobName = function(id) {
         var job = $scope.cachedJobs[id];
         if (job) {
           var av = job.job_description.application_version;
           var opt = job.job_description.option;
           return 'Job ID ' + job.id + ': ' + av.application.name + ' ' + av.version + ' - ' + job.platform.content + ' - ' + opt.description;
         } else {
           return 'undefined';
         }
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
               res = [];
               for (i = 0; i < attr.length; i++) {
                 for (j = 0; j < attr[i].jobvalues.length; j++) {
                   if ( attr[i].jobvalues[j].value.endsWith(".root") ) {
                     var file = attr[i].jobvalues[j].job.id + '/' + attr[i].jobvalues[j].value;
                     res.push(file);
                   }
                 }
               }
               $scope.jobId = res.join("__");
               $scope.folders = ['/'];
               $scope.readTree();
             });
         }
       };

       $scope.readTree = function() {
         if ($scope.jobId && $scope.jobId.length > 0) {
           var parameters = {
             files: $scope.jobId,
             folders: $scope.folders
           };
           $apiroot.lookupDirs(parameters).then(function (response) {
             $scope.noJobData = (response.length < 1);
             $scope.data.tree = response;
             listfn = Object.keys(response);
             var intersect = Object.keys(response[ listfn[0] ]['/']);
             for ( key = 1; key < listfn.length; key++ ) {
               var list = Object.keys(response[ listfn[key] ]['/']);
               intersect = $(list).filter(intersect)
             }
             $scope.data.treedirs[listfn.join(',')] = {};
             for ( key = 0; key < intersect.length; key++ ) {
               namecat = intersect[key].replace(/List_*/, "/").replace("__","/");
               $scope.data.treedirs[listfn.join(',')][intersect[key]] = namecat;
             }
           });
         } else {
           $scope.noJobData = ($scope.jobId.length < 1);
         }
       };

       $scope.showPlots = function(file, namecat) {
         if ( $scope.data.plotSelect != null ) $scope.data.plotSelect[file] = "";
         var listfn = file.split(',');
         var intersect = $scope.data.tree[listfn[0]]['/'][namecat];

         for ( key = 1; key < listfn.length; key++ ) {
           var keys = {};
           for (var i in intersect)
             if (i in $scope.data.tree[listfn[key]]['/'][namecat])
               keys[i] = $scope.data.tree[listfn[key]]['/'][namecat][i];
           intersect = keys;
         }
         $scope.data.treeplots[file] = intersect;
       };

       $scope.showChart = function(file, title) {
         files={}
         var listfn = file.split(',');
         for ( key in listfn ) {
           files[listfn[key]] = 'Job ID: ' + listfn[key].split('/')[0];
         }
         titles={}
         titles[title] = $scope.data.treeplots[file][title];
         $scope.url = BUILD_PARAMS.url_root;
         $scope.files_and_titles = files;
         if ( title == "ALL" )
           $scope.data.graphs = $scope.data.treeplots[file];
         else
           $scope.data.graphs = titles;

       };


     }]);

  App.directive('plotSplit', function($window) {
    console.log("Angular version is: "+JSON.stringify(angular.version));
    return {
      restrict: 'E',
      scope: {
        graphs: '=',
        filesAndTitles: '=',
        test: '=',
        url: '='
      },
      // TODO make this a less magic folder path, possibly by adding a method to
      // the App or something
      templateUrl: 'app/modules/gauss/views/muonmonisim_plots_split.html'
    };
  });

  // TODO find better name than 'plot view'. It's too easily confused with 'view'.
  App.directive('plotViewGenerator', function($window) {

    function link(scope, element, attrs) {
      // $window.alert(JSON.stringify(element));
      var plotView = "defaultplotview";

      function updateDOM() {
        // element.text(plotView);
        element.innerHTML = 'foo barrr';
      };

      scope.$watch(attrs.plotViewGenerator , function(value) {
        plotView = value;
        updateDOM();
      });

      // var generatedTemplate = '<pre><'+scope.plotView+' graphs="graphs" filesAndTitles="filesAndTitles" test="test" url="url"></'+scope.plotView+'></pre>';
      // var generatedTemplate = '<b>Foo <i>BAR and ... '+scope.plotView+'</i><b>';
      // element.parent().append($compile(generatedTemplate)(scope));
    }
    return {
      scope: {
        // plotView: '='              // Name of the plot view
        graphs: '=',            // the rest of these go into the plot view
        filesAndTitles: '=',
        test: '=',
        url: '='
      },
      // restrict: 'E',
      link: link
    };
  });
  // Example time directive! from https://docs.angularjs.org/guide/directive
  App.directive('myCurrentTime', ['$compile', function($compile) {

      function link(scope, element, attrs) {
        var format;

        function updateDOM() {
          var sanitisedFormat = format || "span";
          var generatedTemplate = '<' + sanitisedFormat + ' graphs="' 
                + attrs.graphs + '", files-and-titles="' + attrs.filesAndTitles
                + '", test="' + attrs.test + '", url="' + attrs.url 
                + '"></' + sanitisedFormat + '>';
          element.html($compile(generatedTemplate)(scope));
        }

        scope.$watch(attrs.myCurrentTime, function(value) {
          format = value;
          updateDOM();
        });
      }

      return {
        link: link,
        restrict: 'E'
      };
    }]);
})();

// Local Variables:
// js2-basic-offset: 2
// js-indent-level: 2
// indent-tabs-mode: nil
// End:
