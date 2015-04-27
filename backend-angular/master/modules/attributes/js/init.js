Module.create('attributes', 'Attributes Module', 1)
	.addMenuItems({
		text: "Attributes",
		sref: "app.attributes",
		icon: "icon-grid"
	})
	.addState({
		name: 'attributes',
		resolve: ['chartjs', 'jobs', 'attributes']
	})
	.start();
