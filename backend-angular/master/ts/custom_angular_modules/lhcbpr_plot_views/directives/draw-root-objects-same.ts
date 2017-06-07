// Promises, promises...

// So, the plan here is to make promises from the callback code that JSROOT
// uses. This will mean I can compare X plots instead of just 2 hard coded
// plots.
//
// I found this blog post which looks promising:
// http://derpturkey.com/promise-callback-pattern-for-javascript/
// Better link:
// https://docs.angularjs.org/api/ng/service/$q


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
            'BUILD_PARAMS', '$scope', '$element', '$q', '$timeout',
            function(BUILD_PARAMS: any, $scope: any, $element: any, $q: any, $timeout: any) {

                // TODO make that f a function proper, once I work out the signature for JSROOT
                // functions
                function makePromise(func: any, firstArg: string): any {
                    // Create a promise from a JSROOT callback function
                    //
                    // args are applied to the JSROOT function using _.apply
                    let deferred = $q.defer();
                    console.debug("Made a deferred promise...")

                    func(firstArg, function(x: any): any {
                        console.debug("Fulfilling the JSROOT callback.")
                        deferred.resolve(x);
                    })

                    return deferred.promise;
                }

                let length = $scope.objectsToPlot().length;
                if(length !== 2) {
                    $scope.problemWithPlotting = "Wrong number of plots given (2 expected, "+length+" given.)"
                }

                $scope.BUILD_PARAMS = BUILD_PARAMS;

                let pad = $element.children()[0];

                // Promises...
                let filePromise: any = makePromise(JSROOT.OpenFile, "/api/media/jobs/"+$scope.objectsToPlot()[0].fileLocation);
                // JSROOT.OpenFile("/api/media/jobs/"+$scope.objectsToPlot()[0].fileLocation, (f: any) => {
                filePromise.then( (f: any) => {
                    debugger;
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
