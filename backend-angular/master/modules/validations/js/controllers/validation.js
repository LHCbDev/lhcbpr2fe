App.controller('ValidationsController', ['$scope', 'ngTableParams', 'lhcbprResources', 'rootResources', 'ngDialog', 'BUILD_PARAMS', 
    function($scope, $tableParams, $api, $apiroot, $dialog, BUILD_PARAMS) {

  $scope.jobId = [];
  $scope.folders = ['/'];
  $scope.noJobData = true;

  $scope.data = {
    repeatSelect: null,
    availableOptions: [
      {id: '1', name: 'Option A'},
      {id: '2', name: 'Option B'},
      {id: '3', name: 'Option C'}
    ],
   };


	$scope.lookHistos = function(jids) {
    var requestParams = {
      ids: jids.join(),
      type: "File",
    };	  	
    var result = {};
		// TODO: The filter code will be added here
		// We send the request to the '/attributes' url of the API
		if (jids && jids.length > 0) {
		  $api.all('compare')
				  .getList(requestParams)
				  .then(function(attr) { // When we receive the response
				    res = [];
				    for (i = 0; i < attr.length; i++) {
				      if ( attr[i].jobvalues[0].value.endsWith(".root") ) {
				        var file = 'jobs/' + attr[i].jobvalues[0].job.id + '/' + attr[i].jobvalues[0].value;
				        res.push(file);
				      }
				    }
				    $scope.jobId = res.join("__");
	          $scope.folders = ['/']; 	
	          $scope.update();
				  });
		}
	};	

	$scope.attrsTableParams = new $tableParams ( 
		{
     	page: 1, // the page to show initialy
    	count: 10 // number of rows on each page
    }, 
    { 
      total: 0, // total number of rows initialy
      getData: function($defer, params) {
        if ($scope.jobId && $scope.jobId.length > 0) {
          var parameters = {
            files: $scope.jobId,
            folders: $scope.folders
          };
          $apiroot.lookupDirs(parameters).then(function (response) {
            params.total(response.length);
            $scope.noJobData = (response.length < 1);
            $defer.resolve(response);      
          });
        } else {
          $scope.noJobData = ($scope.jobId.length < 1)
        } 
		  }
		});

	// We add this line of code to fix a bug in the ngTable service
	$scope.attrsTableParams.settings().$scope = $scope;
	
	$scope.update = function() {
  	// Set the current page of the table to the first page
    $scope.attrsTableParams.page(1);
    // reloading data
    $scope.attrsTableParams.reload();
	};

	$scope.showChart = function(file, title){
	  console.log("Show chart of ", file, title);
	  files={}
	  files[file] = '';
	  $scope.url = BUILD_PARAMS.url_root;
    $scope.files_and_titles = files;
    $scope.graphs = title;
    $dialog.open({
			template: 'histoGraph',
			className: 'chart-dialog custom-dim',
			scope: $scope,
			preCloseCallback: function() {
			  $scope.data.repeatSelect[file] = ""
				console.log("Done!");
			}
		});
	};
	
	$scope.showTree = function(file, path) {
	  console.log("Show tree of ", file, path);
	  $scope.jobId.push(file);
	  $scope.folders.push(path); 	
	  $scope.update();  
	};	
	
}]);
 
