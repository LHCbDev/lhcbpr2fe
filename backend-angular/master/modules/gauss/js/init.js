Module.create('gauss', 'Gauss (Birmingham)', 2)
  .addMenuItems([{
    text: "MuonMoniSim",
    sref: "app.muonmonisim",
    icon: "icon-grid"
  },
  ])
  .addStates({
    name: 'muonmonisim',
    // controller: "MuonMoniSimController",
    // title: 'MuonMoniSim',
    url: '/muonmonisim',
    templateUrl: 'muonmonisim_full.html',
      resolve: ['gauss', 'chartjs', 'ngTable', 'ngDialog', 'jsroot']
  })
  .start();


