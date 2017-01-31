Module.create('geantstandalone', 'GEANT', 2)
	.addMenuItem({
		text: "Hadronic",
		sref: "app.geantstandalone",
		icon: "icon-grid"
	})
	.addMenuItem({
		text: 'TestEm3',
		sref: 'app.geanttestem3',
		icon: "icon-grid"
	})
	.addMenuItem({
	text: 'TestEm5',
	sref: 'app.geanttestem5',
	icon: "icon-grid"
  })
	.addState({
		name: 'app.geantstandalone',
    controller:'GeantstandaloneController',
		url: '/geantstandalone',
		templateUrl: 'geantstandalone.html',
		resolve: ['geantstandalone', 'jsroot','ngTable', 'ngDialog']
	})
	.addState({
		name: 'app.geanttestem3',
		controller: 'Geanttestem3Controller',
		url: '/geanttestem3',
		templateUrl: 'geanttestem3.html',
		resolve: ['geantstandalone','jsroot','ngTable', 'ngDialog', 'chartjs']
	})
	.addState({
		name: 'app.geanttestem5',
		controller: 'Geanttestem5Controller',
		url: '/geanttestem5',
		templateUrl: 'geanttestem5.html',
		resolve: ['geantstandalone','jsroot','ngTable', 'ngDialog']
	})
	.start();

// Local Variables:
// js2-basic-offset: 2
// js-indent-level: 2
// indent-tabs-mode: nil
// End:
