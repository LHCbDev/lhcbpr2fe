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
        controller: ['BUILD_PARAMS', '$scope', '$element', function(BUILD_PARAMS, $scope, $element) {
            $scope.BUILD_PARAMS = BUILD_PARAMS;
            $scope.plottablesToPlot = [];

            // TODO make interface for o
            for(let o of $scope.objectsToPlot()) {
                JSROOT.OpenFile("/api/media/jobs/"+o.fileLocation, function(file) {
                    file.ReadObject(o.objectLocation, function(plottable) {
                        $scope.plottablesToPlot.push(plottable);
                    })
                })
            };

            $scope.$watch(
                (scope) => scope.plottablesToPlot,
                function(newValue, oldValue) {
                    debugger;
                    if(newValue.length === $scope.objectsToPlot().length) {
                        let pad = $element.children()[0];
                        pad.setAttribute('style', 'width: '+$scope.width+'; height: '+$scope.height+';');

                        if(_.every(newValue, (v: string) => _.startsWith(v._typename, "TGraph"))) {
                            let mygraph = JSROOT.CreateTMultiGraph.apply(this, $scope.plottablesToPlot);
                            JSROOT.draw(pad, mygraph);
                        } else if(_.every(newValue, (v: string) => _.startsWith( v._typename, "TH1"))) {
                            let obj_index = 1;
                            for(let obj of $scope.plottablesToPlot) {
                                // obj.fName = obj.fName + "__" + object.fileLocation.replace(/\//g, "__");
                                // TODO make a service/function to cycle through colors
                                obj.fLineColor = obj_index + 1;
                                obj.fSetMarkerColor = obj_index + 1;
                                obj = JSROOT.JSONR_unref(obj);
                                JSROOT.draw(pad, obj, "same");
                                obj_index++;
                            }
                        } else {
                            // TODO make more informative
                            $scope.problemWithPlotting = "Incompatible types selected: "
                                +JSON.stringify(_.map($scope.plottablesToPlot, (v: string) => v._typename));
                        }
                    }
                    // else still loading...
                }
            )
        }],
    // link: function(scope, element) {
    //     var pad = element.children()[0];
    //     pad.innerHTML = "";
    //     pad.setAttribute('style', 'width: '+scope.width+'; height: '+scope.height+';');
    //     var obj_index = 1;
    //     // TODO figure out how to implement with promises
    //     for(let object of scope.objectsToPlot()) {
    //         JSROOT.OpenFile("/api/media/jobs/"+object.fileLocation, function(file) {
    //             console.debug("Opened file: "+JSON.stringify(file, null, 2))
    //             file.ReadObject(object.objectLocation, function(obj) {
    //                 console.debug("Opened object: "+JSON.stringify(obj, null, 2))
    //                 obj.fName = obj.fName + "__" + object.fileLocation.replace(/\//g, "__");
    //                 // TODO make a service/function to cycle through colors
    //                 obj.fLineColor = obj_index + 1;
    //                 obj.fSetMarkerColor = obj_index + 1;
    //                 obj = JSROOT.JSONR_unref(obj);
    //                 JSROOT.draw(pad, obj, "same");
    //                 obj_index++;
    //             });
    //         });
    //     }
    // };
    };
});
