App.run(["$rootScope", function($rootScope){
	var menu = [
		{
			text: "LHCbPR Test Module",
			heading: "true"
		},
		{
			text: "Test",
			sref: "app.test",
			icon: "icon-grid",
			alert: "new"
		}
	];
	menu.forEach(function(item){
		$rootScope.menuItems.push(item);
	});
}]);
