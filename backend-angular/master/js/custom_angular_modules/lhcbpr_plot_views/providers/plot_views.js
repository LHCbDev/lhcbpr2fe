lhcbprPlotModule.provider('plotViews', function () {
    var plotViews = [];
    this.registerPlotView = function(directiveName, displayName) {
        plotViews.push({
            directiveName: directiveName,
            displayName: displayName
        });
    };
    this.$get = function() {
        return plotViews;
    };
});
