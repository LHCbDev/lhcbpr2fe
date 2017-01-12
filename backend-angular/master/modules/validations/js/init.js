Module.create('validations', 'Gauss', 2)
  .addMenuItems([{
    text: "Validation analysis",
    sref: "app.validations",
    icon: "icon-grid"
  },
  {
    text: "Detailed timing",
    sref: "app.detime",
    icon: "icon-grid"
  },
  ])
  .addStates({
    name: 'validations',
    title: 'Validation',
    url: '/validations',
    templateUrl: 'validations.html',
    resolve: ['validations', 'chartjs', 'ngTable', 'ngDialog', 'jsroot']
  })
  .addState({
    name: 'detime',
    title: 'Detailed timing',
    url: '/detime',
    templateUrl: 'detime.html',
    resolve: ['validations', 'jsroot', 'ngTable', 'ngDialog']
  })
  .start();
