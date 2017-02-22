App.service('browseRootFilesService', ['$scope', function($scope) {

    $scope.activeTab = 1;
    $scope.setActiveTab = function(tab) {
        $scope.activeTab = tab;
    };

    var plotTabContentNew = false;

    $scope.isPlotTabContentNew = function() {
        return plotTabContentNew;
    };

    $scope.plotTabContentIsNew = function () {
        plotTabContentNew = true;
    };

    $scope.plotTabContentHasBeenViewed = function () {
        plotTabContentNew = false;
    };

}]);

