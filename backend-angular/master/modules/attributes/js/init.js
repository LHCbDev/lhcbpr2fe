Module.create('attributes', 'Attributes Module', 2)
	.addMenuItems({
		text: "Attributes",
		sref: "app.attributes",
		icon: "icon-grid"
	})
	.addState({
		name: 'attributes',
		resolve: ['chartjs', 'ngTable', 'ngDialog', 'attributes']
	})
	.start();
