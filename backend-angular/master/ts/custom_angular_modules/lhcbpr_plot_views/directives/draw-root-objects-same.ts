// TODO figure out how to not repeat code
lhcbprPlotModule.directive('drawRootObjectsSame', function() {
    JSROOT.source_dir = 'app/vendor/jsroot/';
    return {
        restrict: 'E',
        scope: {
            objectsToPlot: '&',
            width: '@',
            height: '@'
        },
        // TODO change if needed
        templateUrl: 'app/views/custom_angular_modules/lhcbpr_plot_views/drawRootObject.html',
        controllerAs: "ctrl",
        controller: ['BUILD_PARAMS', '$scope', function(BUILD_PARAMS, $scope) {
            $scope.BUILD_PARAMS = BUILD_PARAMS;
        }],
        link: function(scope, element) {
            var pad = element.children()[0];
            pad.innerHTML = "";
            pad.setAttribute('style', 'width: '+scope.width+'; height: '+scope.height+';');
            var obj_index = 1;
            // var plotColor = false;
            for(let object of scope.objectsToPlot()) {
                JSROOT.OpenFile("/api/media/jobs/"+object.fileLocation, function(file) {
                    console.debug("Opened file: "+JSON.stringify(file, null, 2))
                    file.ReadObject(object.objectLocation, function(obj) {
                      console.debug("Opened object: "+JSON.stringify(obj, null, 2))

                        // If the object is not of TH1 type, there are likely to
                        // be problems.
                        scope.problemWithPlotting = "Incompatible type "
                            +obj._typename+
                            "! This view currently only supports TH1* plots.";
                        debugger;
                        return undefined;

                        obj.fName = obj.fName + "__" + object.fileLocation.replace(/\//g, "__");
                        // TODO make a service/function to cycle through colors
                        obj.fLineColor = obj_index + 1;
                        obj.fSetMarkerColor = obj_index + 1;
                        obj = JSROOT.JSONR_unref(obj);
                        JSROOT.draw(pad, obj, "same");
                        obj_index++;
                    });
                });
            }
        }
    };
});
