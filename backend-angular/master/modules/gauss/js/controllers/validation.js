App.controller('ValidationsController', ['$scope', 'lhcbprResources', 'rootResources', 'BUILD_PARAMS', 
    function($scope, $api, $apiroot, BUILD_PARAMS) {
    
  $scope.color = {
    0: "white",
    1: "black", 
    2: "red",
    3: "green",
    4: "blue",
    5: "yellow",
    6: "magenta",
    7: "cyan",
    8: "rgb(89,212,84)",
    9: "rgb(89,84,217)"
  };  

  $scope.options = [
  	{value: 'Difference', text: 'Plot difference'},
    {value: 'Ratio',      text: 'Plot ratio'},
  	{value: 'Kolmogorov', text: 'Apply Kolmogorv test'},
  ];
  
  $scope.commonoptions = [
  	{value: '',      text: 'Superimposed'},  
  	{value: 'Split', text: 'Split'}
  ];  
 
  
  $scope.defaultPlots = [
    {value: 'MCTruth', text: 'MC Truth'},
    {value: 'Velo',    text: 'Velo'},
    {value: 'TT',      text: 'TT'},
    {value: 'OT',      text: 'OT'},
    {value: 'IT',      text: 'IT'},
    {value: 'ECAL',    text: 'ECAL'},
    {value: 'HCAL',    text: 'HCAL'},
    {value: 'PRS',     text: 'PRS'},
    {value: 'SPD',     text: 'SPD'},
    {value: 'RICH',    text: 'RICH'},
    {value: 'MUON',    text: 'MUON'}
  ];
  
  defaults = {
    MCTruth: {'/MainMCTruthMonitor/102': "Z origin of all particles",
              '/MainMCTruthMonitor/103': "Momentum of all particles",
              '/MainMCTruthMonitor/104': "Momentum of primary particles",
              '/MainMCTruthMonitor/105': "Momentum of protons particles",
              '/MainMCTruthMonitor/201': "Vertex type",
              '/MainMCTruthMonitor/202': "Z position of all vertices (mm) ",
              '/MainMCTruthMonitor/203': "Z position of all vertices Zoomed (mm)",
              '/MainMCTruthMonitor/204': "Time of all vertices (ns)" },
    Velo:    {'/Velo/VeloGaussMoni/TOF': "Time of Flight",
              '/Velo/VeloGaussMoni/TOFPU': "PileUP: Time of Flight",
              '/Velo/VeloGaussMoni/eDepSi': "Energy Deposited in Si", 
              '/Velo/VeloGaussMoni/eDepSiPU': "PileUp: Energy Deposited in Si",
              '/Velo/VeloGaussMoni/nMCPUHits': "Pile Up:Number of Hits in Velo per event",
              '/Velo/VeloGaussMoni/entryZX': "Particle Entry Point in Si(cm) - ZX Plane",
              '/Velo/VeloGaussMoni/entryXY': "Particle Entry Point in Si(cm) - XY Plane" },
    TT:      {'/TTHitMonitor/100': "Time of Flight100 TT",
              '/TTHitMonitor/1': "Num Hits TT",
              '/TTHitMonitor/4': "P Mag TT",
              '/TTHitMonitor/300': "lossHisto300 TT",
              '/TTHitMonitor/path length': "path length TT",
              '/TTHitMonitor/200': "X vs Y 200 TT" },
    OT:      {'/OTHitMonitor/100': "Time of Flight100 OT",
              '/OTHitMonitor/1': "Num Hits OT",
              '/OTHitMonitor/4': "P Mag OT",
              '/OTHitMonitor/300': "lossHisto300 OT",
              '/OTHitMonitor/path length': "path length OT",
              '/OTHitMonitor/200': "X vs Y 200 OT" },  
    IT:      {'/ITHitMonitor/100': "Time of Flight100 IT",
              '/ITHitMonitor/1': "Num Hits IT",
              '/ITHitMonitor/4': "P Mag IT",
              '/ITHitMonitor/300': "lossHisto300 IT",
              '/ITHitMonitor/path length': "path length IT",
              '/ITHitMonitor/200': "X vs Y 200 IT" },
    ECAL:    {'/EcalMonitor/11': "Subhits in the ECAL",
              '/EcalMonitor/111': "Subhits in the Inner ECAL",
              '/EcalMonitor/112': "Subhits in the Middle ECAL",
              '/EcalMonitor/113': "Subhits in the Outer ECAL",                  
              '/EcalMonitor/12': "Energy Weighted Subhits in the ECAL",
              '/EcalMonitor/121': "Energy Weighted Subhits in the Inner ECAL",
              '/EcalMonitor/122': "Energy Weighted Subhits in the Middle ECAL",
              '/EcalMonitor/123': "Energy Weighted Subhits in the Outer ECAL",
              '/EcalMonitor/13': "Accumulated Energy in the ECAL",
              '/EcalMonitor/131': "Accumulated Energy in the Inner ECAL",
              '/EcalMonitor/132': "Accumulated Energy in the Middle ECAL ",
              '/EcalMonitor/133': "Accumulated Energy in the Outer ECAL ",
              '/EcalMonitor/14': "Number of Subhits in the ECAL",
              '/EcalMonitor/140': "Number of Subhits in the ECAL (BC=-1)",
              '/EcalMonitor/141': "Number of Subhits in the ECAL (BC=0)",
              '/EcalMonitor/142': "Number of Subhits in the ECAL (BC=+1)" },
    HCAL:    {'/HcalMonitor/14': "Subhits in the HCAL",
              '/HcalMonitor/111': "Subhits in the Inner HCAL",
              '/HcalMonitor/12': "Energy Weighted Subhits in the HCAL",
              '/HcalMonitor/121': "Energy Weighted Subhits in the Inner HCAL",
              '/HcalMonitor/13': "Accumulated Energy in the HCAL",
              '/HcalMonitor/131': "Accumulated Energy in the Inner HCAL",
              '/HcalMonitor/14': "Number of Subhits in the HCAL",
              '/HcalMonitor/140': "Number of Subhits in the HCAL (BC=-1)",
              '/HcalMonitor/141': "Number of Subhits in the HCAL (BC=0)",
              '/HcalMonitor/142': "Number of Subhits in the HCAL (BC=+1)" },                               
    PRS:     {'/PrsMonitor/11': "Subhits in the PRS",
              '/PrsMonitor/111': "Subhits in the Inner PRS",
              '/PrsMonitor/112': "Subhits in the Middle PRS",
              '/PrsMonitor/113': "Subhits in the Outer PRS",                  
              '/PrsMonitor/12': "Energy Weighted Subhits in the PRS",
              '/PrsMonitor/121': "Energy Weighted Subhits in the Inner PRS",
              '/PrsMonitor/122': "Energy Weighted Subhits in the Middle PRS",
              '/PrsMonitor/123': "Energy Weighted Subhits in the Outer PRS",
              '/PrsMonitor/13': "Accumulated Energy in the PRS",
              '/PrsMonitor/131': "Accumulated Energy in the Inner PRS",
              '/PrsMonitor/132': "Accumulated Energy in the Middle PRS ",
              '/PrsMonitor/133': "Accumulated Energy in the Outer PRS ",
              '/PrsMonitor/14': "Number of Subhits in the PRS",
              '/PrsMonitor/140': "Number of Subhits in the PRS (BC=-1)",
              '/PrsMonitor/141': "Number of Subhits in the PRS (BC=0)",
              '/PrsMonitor/142': "Number of Subhits in the PRS (BC=+1)" },    
    SPD:     {'/SpdMonitor/11': "Subhits in the SPD",
              '/SpdMonitor/111': "Subhits in the Inner SPD",
              '/SpdMonitor/112': "Subhits in the Middle SPD",
              '/SpdMonitor/113': "Subhits in the Outer SPD",                  
              '/SpdMonitor/12': "Energy Weighted Subhits in the SPD",
              '/SpdMonitor/121': "Energy Weighted Subhits in the Inner SPD",
              '/SpdMonitor/122': "Energy Weighted Subhits in the Middle SPD",
              '/SpdMonitor/123': "Energy Weighted Subhits in the Outer SPD",
              '/SpdMonitor/13': "Accumulated Energy in the SPD",
              '/SpdMonitor/131': "Accumulated Energy in the Inner SPD",
              '/SpdMonitor/132': "Accumulated Energy in the Middle SPD ",
              '/SpdMonitor/133': "Accumulated Energy in the Outer SPD ",
              '/SpdMonitor/14': "Number of Subhits in the SPD",
              '/SpdMonitor/140': "Number of Subhits in the SPD (BC=-1)",
              '/SpdMonitor/141': "Number of Subhits in the SPD (BC=0)",
              '/SpdMonitor/142': "Number of Subhits in the SPD (BC=+1)" }, 
    RICH:    {'/RICHG4HISTOSET2/129': "Number of Saturated (beta gt 0.999) Rich1 Hits in Aerogel per track",
              '/RICHG4HISTOSET2/159': "Number of Saturated (beta gt 0.999) Rich1 Hits in C4F10 per track",
              '/RICHG4HISTOSET2/179': "Number of Saturated (beta gt 0.999) Rich2 Hits in CF4 per track",
              '/RICHG4HISTOSET2/501': "Momentum of Charged particles creating hits in Rich1",
              '/RICHG4HISTOSET2/511': "Momentum of Charged particles creating hits in Rich2",
              '/RICHG4HISTOSET2/600': "Cherenkov Theta Angle at Proton Production in Aerogel vs Track Momentum",
              '/RICHG4HISTOSET2/610': "Cherenkov Theta Angle at Proton Production in C4F10gel vs Track Momentum",
              '/RICHG4HISTOSET2/620': "Cherenkov Theta Angle at Proton Production in CF4gel vs Track Momentum" },
    MUON:    {'/MuonHitChecker/1000': "Time Multiplicity M1",
              '/MuonHitChecker/1004': "Time Multiplicity M2",  
              '/MuonHitChecker/1008': "Time Multiplicity M3",
              '/MuonHitChecker/1012': "Time Multiplicity M4",
              '/MuonHitChecker/1016': "Time Multiplicity M5",
              '/MuonHitChecker/2000': "Radial Multiplicity M1",
              '/MuonHitChecker/2004': "Radial Multiplicity M2",
              '/MuonHitChecker/2008': "Radial Multiplicity M3",
              '/MuonHitChecker/2012': "Radial Multiplicity M4",
              '/MuonHitChecker/2016': "Radial Multiplicity M5" }
  }
  
  $scope.jobId = [];
  $scope.folders = ['/'];
  $scope.noJobData = true;
  $scope.isShowSearchForm = true;
  $scope.cachedJobs = {};

  $scope.data = {
    repeatSelect: null,
    plotSelect: null,
    treedirs: {},
    treeplots: {},
    tree: {},  
    graphs: {},
    optvalue: "",
    defaultplots: ""
  };
  
  $scope.panelJobs = {toggle: false};
  
  $scope.sizeOf = function(obj) {
    return Object.keys(obj).length;
  };

  $scope.defplotname = function(val) {
    for ( item in $scope.defaultPlots)
      if ( $scope.defaultPlots[item].value == val ) 
        return $scope.defaultPlots[item].text;
  }  

  $scope.showSearchForm = function() {
    $scope.isShowSearchForm = true;
  };

  $scope.getJobName = function(id) {
			var job = $scope.cachedJobs[id];
			if (job) {
				var av = job.job_description.application_version;
				var opt = job.job_description.option;
				return 'Job ID ' + job.id + ': ' + av.application.name + ' ' + av.version + ' - ' + job.platform.content + ' - ' + opt.description;
			} else {
				return 'undefined';
			}
		};

	$scope.lookHistos = function(jids) {
    $scope.jobId = [];
    $scope.folders = ['/'];
    $scope.noJobData = true;
    $scope.isShowSearchForm = false;

    $scope.data = {
      repeatSelect: null,
      plotSelect: null,
      treedirs: {},
      treeplots: {},
      tree: {},
      graphs: {}, 
      optvalue: "",
      defaultplots: ""
    };	

    var requestParams = {
      ids: jids.join(),
      type: "File",
    };
    for (var i = 0, l = jids.length; i < l; ++i) {
      $api.one('jobs', jids[i]).get().then(
        function(job) {
			    $scope.cachedJobs[job.id] = job;
			  }
			)	
    }

    var result = {};
		if (jids && jids.length > 0) {
		  $api.all('compare')
				  .getList(requestParams)
				  .then(function(attr) { // When we receive the response
				    res = [];
				    for (i = 0; i < attr.length; i++) {
				      for (j = 0; j < attr[i].jobvalues.length; j++) {
				        if ( attr[i].jobvalues[j].value.endsWith(".root") ) {
				          var file = attr[i].jobvalues[j].job.id + '/' + attr[i].jobvalues[j].value;
				          res.push(file);
				        }
				      }
				    }
				    $scope.jobId = res.join("__");
	          $scope.folders = ['/']; 	
	          $scope.readTree();
				  });
		}
	};	

  $scope.readTree = function() {
    if ($scope.jobId && $scope.jobId.length > 0) {
      var parameters = {
        files: $scope.jobId,
        folders: $scope.folders
      };
      $apiroot.lookupDirs(parameters).then(function (response) {
        $scope.noJobData = (response.length < 1);
        $scope.data.tree = response;
        listfn = Object.keys(response);
        var intersect = Object.keys(response[ listfn[0] ]['/']);
        for ( key = 1; key < listfn.length; key++ ) { 
          var list = Object.keys(response[ listfn[key] ]['/']);
          intersect = $(list).filter(intersect)
        }     
        $scope.data.treedirs[listfn.join(',')] = {};
        for ( key = 0; key < intersect.length; key++ ) {
          namecat = intersect[key].replace(/List_*/, "/").replace("__","/");
          $scope.data.treedirs[listfn.join(',')][intersect[key]] = namecat;
        }
      });
    } else {
      $scope.noJobData = ($scope.jobId.length < 1)
    } 
  }

  $scope.showPlots = function(file, namecat) {
    if ( $scope.data.plotSelect != null ) $scope.data.plotSelect[file] = "";
    var listfn = file.split(',');
    var intersect = $scope.data.tree[listfn[0]]['/'][namecat];
   
    for ( key = 1; key < listfn.length; key++ ) { 
      var keys = {};
      for (var i in intersect) 
        if (i in $scope.data.tree[listfn[key]]['/'][namecat]) 
          keys[i] = $scope.data.tree[listfn[key]]['/'][namecat][i];
      intersect = keys;
    }
    $scope.data.treeplots[file] = intersect; 
  }
  
	$scope.showChart = function(file, title) {
	  $scope.data.defaultplots = "";
	  var listfn = file.split(',');
	  titles={}
	  titles[title] = $scope.data.treeplots[file][title];
	  $scope.url = BUILD_PARAMS.url_root;
    $scope.files = listfn;
    if ( title == "ALL" ) 
      $scope.data.graphs = $scope.data.treeplots[file];
    else 
      $scope.data.graphs = titles;  
    
	}

  $scope.plotDefaults = function(defaultopt) {
    $scope.files = $scope.jobId.split("__");
    $scope.url = BUILD_PARAMS.url_root;
    $scope.data.graphs = defaults[defaultopt];
    
  }


}]);
 
