App.run(["$rootScope", function($rootScope){
	var menu = [
		{
			text: "LHCbPR",
			heading: "true"
		},
		{
			text: "Job Descriptions",
			sref: "app.job_descriptions.list",
			icon: "icon-grid",
			alert: "new"
		},
		{
			text: "Jobs",
			sref: "app.jobs.list",
			icon: "icon-grid",
			alert: "new"
		}
	];
	menu.forEach(function(item){
		$rootScope.menuItems.push(item);
	});
}]);
