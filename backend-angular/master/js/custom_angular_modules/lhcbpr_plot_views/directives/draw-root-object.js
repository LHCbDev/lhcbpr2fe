lhcbprPlotModule.directive('drawRootObject', function() {
  JSROOT.source_dir = 'app/vendor/jsroot/';
  return {
    restrict: 'E',
    scope: {
      fileLocation: '=',
      objectLocation: '='
    },
    templateUrl: 'app/views/custom_angular_modules/lhcbpr_plot_views/drawRootObject.html',
    controllerAs: "ctrl",
    controller: [
      'BUILD_PARAMS', '$scope', 'randomString',
      function(BUILD_PARAMS, $scope, randomString) {
        $scope.BUILD_PARAMS = BUILD_PARAMS;
        $scope.divid = "plotid"+randomString(64);
      }],
    link: function(scope, element) {
      // TODO figure out why the loading thing doesn't work. Maybe it's because
      // it's in the link and not in a controller?
      scope.loading = true;
      var pad = element.children()[0];
      pad.id = scope.divid;
      pad.innerHTML = "";
      JSROOT.OpenFile("/api/media/jobs/"+scope.fileLocation, function(file) {
        file.ReadObject(scope.objectLocation, function(obj) {
          obj = JSROOT.JSONR_unref(obj);
          // JSROOT.draw(pad, obj);
          JSROOT.draw(scope.divid, obj);
          // debugger;
          scope.loading = false;
        });
      });
    }
  };
});
