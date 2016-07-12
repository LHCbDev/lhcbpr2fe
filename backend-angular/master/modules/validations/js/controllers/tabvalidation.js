App.controller('TabvalidationController', ['$scope', 'ngTableParams', 'lhcbprResources', 'rootResources', 'ngDialog', 'BUILD_PARAMS', 
    function($scope, $tableParams, $api, $apiroot, $dialog, BUILD_PARAMS) {
   
  $scope.jobIds = [];
  $scope.tabgroups = [];
  $scope.noJobData = true;
  $scope.isShowSearchForm = true;
  $scope.cachedJobs = {};
  $scope.groupID = {}

  $scope.data = {
    repeatSelect: null,
    plotSelect: null,
    treedirs: {},
    treeplots: {},
    tree: {},  
    graphs: {}
  };
  
  getGroupIDs = function() {
    $api.all('groups').getList({
    }).then(function(attrs) {
      console.log("ALE GDB group result ", attrs);
      for (i = 0; i < attrs.length; i++) {
        if ( attrs[i].name.startsWith("Validation") )
          $scope.groupID[attrs[i].id] = attrs[i].name.slice(11);
      }
    })
    console.log("ALE g id: " , $scope.groupID)
  } 
  
  
  $scope.sizeOf = function(obj) {
    return Object.keys(obj).length;
  };

  $scope.showSearchForm = function() {
    $scope.isShowSearchForm = true;
  };

  $scope.getJobName = function(id) {
			var job = $scope.cachedJobs[id];
			if (job) {
				var av = job.job_description.application_version;
				var opt = job.job_description.option;
				return 'Job ID ' + job.id + ': ' + av.application.name + ' ' + av.version + ' - ' + job.platform.content + ' - ' + opt.content + ' ' +  opt.description;
			} else {
				return 'undefined';
			}
		};

    $scope.lookTables = function(ids) {
      var requestIds = [];
      $scope.isShowSearchForm = false;
      $scope.jobsIds = ids;

      for (var i = 0, l = ids.length; i < l; ++i) {
        $api.one('jobs', ids[i]).get().then(
          function(job) {
			      $scope.cachedJobs[job.id] = job;
			    }
			  )	
      }

      // Set the current page of the table to the first page
      $scope.attrsTableParams.page(1);
      // reloading data
      $scope.attrsTableParams.reload();

    };

	
   $scope.attrsTableParams = new $tableParams({
      page: 1, // show first page
      count: 10 // count per page
    }, {
      total: 0, // length of data
      getData: function($defer, params) {
        getGroupIDs();
        // use build-in angular filter
        if ($scope.jobsIds && $scope.jobsIds.length > 0) {
          $api.all('compare').getList({
            ids: $scope.jobsIds.join(),
            groups:  Object.keys($scope.groupID).join(),
            page: params.page(),
            page_size: params.count()
          }).then(function(attrs) {
            if (attrs._resultmeta) {
              params.total(attrs._resultmeta.count);
            }
            $defer.resolve(attrs);
            console.log("ALE GDB attrs: ", attrs);
            $scope.noJobData = false;
          });
        }
      }
    });

    // Fix bug in ng-table
    $scope.attrsTableParams.settings().$scope = $scope;

    $scope.showResults = function(job) {
      // console.log(job.resource_uri);
    };

    var reloadAttrsTable = function() {
      $scope.attrsTableParams.page(1);
      $scope.attrsTableParams.reload();

      console.log($scope.cachedJobs);
    };


	
	
	
	
	
}]);
