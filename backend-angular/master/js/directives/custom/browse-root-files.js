/**
 * Directive browseRootFiles
 */

App.directive('browseRootFiles', [function () {
    return {
        templateUrl: 'app/views/directives/browse-root-files.html',
        restrict: 'E',
        scope: {
            folder: '=',
            // TODO change this name
            graphsChecklistModel: '='
        },
        controller: function() {
            var that = this;
            this.hasChildren = function(val, ind) {
                return val.children;
            };

            this.hasNoChildren = function(val, ind) {
                /**
                 * Needed to get around jade/pug's fussiness around '!'s.
                 */
                return !that.hasChildren(val, ind);
            };
        },
        controllerAs: "ctrl"
    };
}]);
