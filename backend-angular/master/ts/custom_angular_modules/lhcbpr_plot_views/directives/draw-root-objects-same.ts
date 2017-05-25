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
        controller: [
            'BUILD_PARAMS', '$scope', '$element',
            function(BUILD_PARAMS: any, $scope: any, $element: any) {

                let length = $scope.objectsToPlot().length;
                if(length !== 2) {
                    $scope.problemWithPlotting = "Wrong number of plots given (2 expected, "+length+" given.)"
                }

                $scope.BUILD_PARAMS = BUILD_PARAMS;

                let pad = $element.children()[0];

                JSROOT.OpenFile("/api/media/jobs/"+$scope.objectsToPlot()[0].fileLocation, (f: any) => {
                    f.ReadObject($scope.objectsToPlot()[0].objectLocation, (plotOne: any) => {
                        JSROOT.OpenFile("/api/media/jobs/"+$scope.objectsToPlot()[1].fileLocation, (f: any) => {
                            f.ReadObject($scope.objectsToPlot()[1].objectLocation, (plotTwo: any) => {
                                let plots = [plotOne, plotTwo];

                                if(_.every(plots, (v: any) => _.startsWith(v._typename, "TGraph"))) {
                                    let multiGraph = JSROOT.CreateTMultiGraph.apply(this, plots);
                                    JSROOT.draw(pad, multiGraph);
                                } else if(_.every(plots, (v: any) => _.startsWith( v._typename, "TH1"))) {
                                    let plot_index: string;
                                    for(plot_index in plots) {
                                        // plot.fName = plot.fName + "__" + plotect.fileLocation.replace(/\//g, "__");
                                        // TODO make a service/function to cycle through colors
                                        plots[plot_index].fLineColor = parseInt(plot_index) + 1;
                                        plots[plot_index].fSetMarkerColor = parseInt(plot_index) + 1;
                                        plots[plot_index] = JSROOT.JSONR_unref(plots[plot_index]);
                                        JSROOT.draw(pad, plots[plot_index], "same");
                                    }
                                } else {
                                    // TODO make more informative
                                    $scope.problemWithPlotting = "Incompatible types selected: "
                                        +JSON.stringify(_.map($scope.plottablesToPlot, (v: any) => v._typename));
                                }
                            })
                        })
                    })
                })
            }],
    };
});
