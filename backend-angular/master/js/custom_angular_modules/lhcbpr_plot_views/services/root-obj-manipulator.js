lhcbprPlotModule.service('rootObjManipulator', function() {
  this.ratioOfHists = function(hist1, hist2) {
    // Take two histogram JSON objects, return one of the ratio of them.
    // TODO add same binning checks

    var rethist = _.cloneDeep(hist1);
    rethist = JSROOT.JSONR_unref(rethist);
    _.map(rethist.fArray, function(value, ind) {
      // If the divisor is 0, return 0. Else, return ratio.
      if(hist2.fArray[ind] === 0) {
        rethist.fArray[ind] = 0;
      } else {
        rethist.fArray[ind] = hist1.fArray[ind] / hist2.fArray[ind];
      }
    });

    rethist.fTitle = rethist.fTitle + " (Ratio)";

    return rethist;
  };
});
