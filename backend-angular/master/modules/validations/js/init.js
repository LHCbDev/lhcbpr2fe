Module.create('validations', 'Validation', 2)
  .addMenuItems({
    text: "Validation analysis",
    sref: "app.validations",
    icon: "icon-grid"
  })
  .addStates({
    name: 'validations',
    title: 'Validation',
    url: '/validations',
    templateUrl: 'validations.html',
    resolve: ['validations', 'chartjs', 'ngTable', 'ngDialog', 'jsroot']
  })
  .start();
        
    
    
