Module.create('trend', 'Trends', 2)
  .addMenuItem({
    text: "Trends",
    sref: "app.trend",
    icon: "icon-grid"
  })
	.addState({
		name: 'trend',
    controller: "TrendController",
		title: 'Trends',
		templateUrl: 'trends.html',
		resolve: ['trend', 'chartjs', 'ngTable', 'ngDialog']
	})
	.start();
