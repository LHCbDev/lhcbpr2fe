App.run(["$rootScope", function($rootScope){
	var menu = [
		{
			text: "LHCbPR Attributes Module",
			heading: "true"
		},
		{
			text: "Attributes",
			sref: "app.attributes",
			icon: "icon-grid"
		}
	];
	menu.forEach(function(item){
		$rootScope.menuItems.push(item);
	});
}]);
