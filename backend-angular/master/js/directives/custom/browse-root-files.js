/**
 * Directive browseRootFiles
 */

App.directive('browseRootFiles', [function () {
    return {
        templateUrl: 'app/views/directives/browse-root-files.html',
        restrict: 'E',
        scope: {
            folders: '=',
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

            this.toggleExpanded = function(val) {
                if(val.isExpanded) {
                    val.isExpanded = false;
                } else {
                    val.isExpanded = true;
                }

                return val;
            };

            this.chooseFolderIcon = function(val) {
                if(val.isExpanded) {
                    return "icon-folder-alt";
                } else {
                    return "icon-folder";
                }
            }
        },
        controllerAs: "ctrl"
    };
}]);
