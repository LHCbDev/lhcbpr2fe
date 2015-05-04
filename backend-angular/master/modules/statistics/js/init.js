Module.create('statistics', 'Statistiques', 2)
	.addMenuItems({
		text: "Statistiques",
		sref: "app.statistics",
		icon: "icon-grid"
	})
	.addState({
		name: 'statistics',
		title: 'Statistiques',
		templateUrl: 'statistics.html',
		resolve: ['chartjs','statistics']
	})
	.start();
