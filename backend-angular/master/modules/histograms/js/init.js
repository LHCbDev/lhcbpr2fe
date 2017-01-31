Module.create('histograms', 'Histograms', 2)
  .addMenuItem({
    text: "Histograms",
    sref: "app.histograms",
    icon: "icon-grid"
  })
	.addState({
		name: 'histograms',
    controller: 'HistogramsController',
		url: '/histograms',
		templateUrl: 'histograms.html',
		resolve: ['histograms', 'chartjs', 'slider', 'ngTable', 'ngDialog']
	})
	.start();
