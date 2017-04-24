lhcbprPlotModule.service('rootObjGetterService', function() {
  // A simple service that defines getter functions for ROOT objects.
  //
  // (For the most part this is not needed as ROOT objects come with member function getters.)
  //
  // NOTE: This service should only return plain javascript objects (e.g. Array not TypedArray)

  var that = this;

  this.getArrayFromHist = function(hist) {
    // Gets underlying array from ROOT histogram.
    return Array.prototype.slice.call(hist.fArray);
  };

  this.getVisibleBinValuesFromHist = function(hist) {
    var x =  that.getArrayFromHist(hist);
    x.shift();
    x.pop();
    return x;
  };

  this.getNumOfVisibleBinsFromHist = function(hist) {
    return that.getVisibleBinValuesFromHist(hist).length;
  };

});
