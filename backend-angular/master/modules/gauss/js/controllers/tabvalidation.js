App.controller('TabvalidationController', ['$scope', 'lhcbprResources', 
    function($scope, $api) {

  $scope.gval = {
    tableData: [],   // data for table 
    optvalue: "",    // select table (group id)
    jobIDs: [],      // list of selected jobs id
    groupID: [],     // available groups/tables
  };
  
  getGroupIDs = function(numpage) {
    if ( $scope.gval.groupID.length === 0 || numpage > 1) {
      $api.all('groups').getList({
            page: numpage   
      }).then(function(attrs) { 
        for (i = 0; i < attrs.length; i++) {
          if ( attrs[i].name.startsWith("Validation") ) {
            $scope.gval.groupID.push({id: attrs[i].id, value: attrs[i].name.slice(11)});
            if ( attrs[i].name === "Validation_Version" )
              // save default table
              $scope.gval.optvalue = attrs[i].id;
          }  
        } 
        // "recursive" call if there are more data
        if ( attrs._resultmeta.next != null ) return getGroupIDs(numpage+1);
        // sort groups/tables by name
        $scope.gval.groupID.sort(function(first, second) {
          var nameA = first.value.toUpperCase(); // ignore upper and lowercase
          var nameB = second.value.toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB)
            return -1;
          if (nameA > nameB)
            return 1;
          // names must be equal
            return 0;
        });
        // build default table
        $scope.reloadTables($scope.gval.optvalue);
      })

    } else {
      $scope.gval.tableData = [];
      $scope.reloadTables($scope.gval.optvalue);
    }
  } 

  // returns the label of the group with id: "id"
  $scope.groupName = function(id) {
    if ( $scope.gval.groupID.length == 0 )
      return "";
    for ( val in $scope.gval.groupID ) 
      if ( $scope.gval.groupID[val].id == id )
        return $scope.gval.groupID[val].value.replace(/_/g, ' ');
    return ""
  };
          
  $scope.lookTables = function(ids) {
    
    // save the jobIDs list
    $scope.gval.jobIDs = [];
    for ( var i = 0; i < ids.length; i++ ) 
      $scope.gval.jobIDs[i] = ids[i];
    // query dbase for the list of groups and then load data for default table
    getGroupIDs(1)
  };

	MuonTable = function() {
    if ( $scope.gval.jobIDs.length > 0 ) {
      $api.all('compare').getList({
        ids:    $scope.gval.jobIDs.join(),
        groups: $scope.gval.optvalue,
        lightJob: 1,  
        page_size: 20
      }).then(function(attrs) {
        var results = [];
        for (var i = 0; i < $scope.gval.jobIDs.length; ++i) {
          var sum = [0,0,0,0,0];
          var result = [];
          for (var attrid = 0; attrid < attrs.length; attrid++) {
            var attr = attrs[attrid];
            // attributes name are of type R1_M1 ... R4_M5
            var index = 5 * Number(attr.name.slice(1,2)-1) + Number(attr.name.slice(4,5))-1;
            var j = 0;
            var found = 0;
            // look for the right value associated to the jobid
            while ( !found && j < attr.jobvalues.length ) {
              if ( attr.jobvalues[j].job.id === $scope.gval.jobIDs[i] ) {
                result[index] = attr.jobvalues[j].value;
                found = 1;
              }
              j++;
            }
            if ( !found )
              // we haven't found a value associated with the job, set it to 0
              result[index] = 0.0;
            sum[Number(attr.name.slice(4,5))-1] += Number(result[index]);
          } 
          // save results: one dictionary for job,
          //               each entry of the dictionary is a row in the table. 
          results.push({jobid: $scope.gval.jobIDs[i], 
                        R1:    result.slice(0,5), 
                        R2:    result.slice(5,10),
                        R3:    result.slice(10,15),
                        R4:    result.slice(15,20),
                        SumR:  sum});
        }   
        $scope.gval.tableData = results;
      })
    }
  };

  // temporary global variable for recursive calls
  var attrs = [];
  GenericTable = function(pagenum) {	 
    if ( pagenum == 1 ) attrs = [];
    if ( $scope.gval.jobIDs.length > 0 ) {
      $api.all('compare').getList({
        ids:     $scope.gval.jobIDs.join(),
        groups:  $scope.gval.optvalue,
        lightJob: 1,
        page: pagenum,
        page_size: 10
      }).then(function(values) { 
        for (var attrid = 0; attrid < values.length; attrid++)
          attrs.push(values[attrid]);
        // "recursive" call if there are more data
        if ( values._resultmeta.next != null ) return GenericTable(pagenum+1);     
        var results=[];
        for (var attrid = 0; attrid < attrs.length; attrid++) {
          var attr = attrs[attrid];
          var result = {};
          result.id = attr.id;
          result.name = attr.name;
          result.description = attr.description;
          result.jobvalues = [];
          for (var i = 0; i < $scope.gval.jobIDs.length; ++i) {
            var j = 0;
            var found = 0;
            // save the values in the right order (given by the jobIDs list)
            while ( !found && j < attr.jobvalues.length ) {
              if ( attr.jobvalues[j].job.id === $scope.gval.jobIDs[i] ) {
                if ( attrid+1 < attrs.length && attrs[attrid+1].name === result.name.concat("Err") )
                  // pretty print: attrValue +/- attrValueErr  
                  result.jobvalues.push(attr.jobvalues[j].value + " +/- " + attrs[attrid+1].jobvalues[j].value)
                else
                  result.jobvalues.push(attr.jobvalues[j].value)
                found = 1;
              }
              j++;
            }
            if ( !found ) 
              // we haven't found a value associated with the job, set it to "N/A"
              result.jobvalues.push("N/A")
          }
          // save results: one dictionary for attribute {id:, name:, description:, jobvalues: []}
          results.push(result);
          if ( attrid+1 < attrs.length && attrs[attrid+1].name === result.name.concat("Err") )
            // next attribute is the "error", jump it
            attrid++;
        }
        $scope.gval.tableData = results;
        
      })
    }
  };

  // retrieves data for the table
  $scope.reloadTables = function(table) {
    $scope.gval.tableData = [];
    if ( $scope.groupName(table) === "Muon detectors" ) {
      MuonTable();
    } else {
      GenericTable(1);
    }
  };
	
}]);
