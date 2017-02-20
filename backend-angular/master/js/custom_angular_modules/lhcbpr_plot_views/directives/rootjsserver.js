lhcbprPlotModule.directive('rootjsserver', function($http) {
  return {
    restrict: 'E',
    scope: {
      entrypoint: '=',
      files: '=',
      items: '=',
      compute: '=',
      width: '@',
      height: '@'
    },
    template: '<rootjs data="data" kstest="kstest" width="{{width}}" height="{{height}}"></rootjs>',
    link: function(scope) {
      // Watching here causes an infinite loop, not sure why but probably due to
      // changing scope variables by accident.
      //
      // TODO figure out if this is a problem. If it is, fix it!
      //
      scope.$watchGroup(['files', 'items', 'compute'], function(values) {
        if(values[0] && values[1]) {
          console.debug("The values going into rootjsserver have changed: "+values);
            if(typeof values[0] === "object") {
              // Use old style call
              //
              // TODO phase this style of call out.
              activate(_.keys(values[0]), values[1], values[2]);
            } else {
              // Use new style called
              activate(values[0], values[1], values[2]);
            }
        }
      });

      // activate(scope.files(), scope.items(), scope.compute());

      ///
      function activate(files, items, option) {
        if(typeof files === "object") {
          var strFiles = _.map(files, encodeURIComponent).join('__');
        } else if(typeof files === "string") {
          var strFiles = files;
        }

        var url = scope.entrypoint + '/?files=' +
              strFiles +
              '&items=' + encodeURIComponent(items) +
              (option ? '&compute=' +  encodeURIComponent(option) : "") +
              '&callback=JSON_CALLBACK';
        console.debug("Making request: "+url);
        $http.jsonp(url).then(loaded, error);

      }

      function loaded(data) {
        var graph, mg, color, notGraph;
        var graphs = [];
        var notGraphs = [];
        color = 1;
        _.forEach(data.data['result'], function(file) {
          if ( file['computed_result'] ) {
            notGraph = JSROOT.JSONR_unref(file['computed_result']);
            notGraph.fLineColor = color++;
            notGraphs.push(notGraph);
          }

          _.forEach(file['items'], function(value, key) {
            if(value['_typename'] == 'TGraph' || value['_typename'] == 'TGraphErrors'){
              graph = JSROOT.JSONR_unref(value);
              graph.fLineColor = color++;
              // graph.fTitle = scope.files[file.root] + ' ' + graph.fTitle;
              graphs.push(graph);
            } else {
              notGraph = JSROOT.JSONR_unref(value);
              notGraph.fLineColor = color++;
              notGraph.fName = "JobID: " + file.root.split("/")[0]; // used in ToolTips
              notGraphs.push(notGraph);
            }
          });
          // TODO figure out what this condition is for
          if ( file['KSTest'] ) {
            scope.kstest = file['KSTest'];
          }

        });


        if (notGraphs.length > 0) {
          scope.data = notGraphs;
        } else {
          scope.data = JSROOT.CreateTMultiGraph.apply(this, graphs);
        }
      }

      function error(err) {
        console.error(err);
      }
    }
  };
});


// Local Variables:
// js2-basic-offset: 2
// js-indent-level: 2
// indent-tabs-mode: nil
// End:
