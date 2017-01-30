Module.create('validations', 'Gauss', 2)
    .addMenuItem({
        text: "Validation analysis",
        sref: "app.validations",
        icon: "icon-grid"
    })
    .addMenuItem({
        text: "Detailed timing",
        sref: "app.detime",
        icon: "icon-grid"
    })
    .addState({
        name: 'validations',
        controller:"ValidationsController",
        title: 'Validation',
        url: '/validations',
        templateUrl: 'validations.html',
        resolve: ['validations', 'chartjs', 'ngTable', 'ngDialog', 'jsroot']
    })
    .addState({
        name: 'detime',
        controller:"DetimeController",
        title: 'Detailed timing',
        url: '/detime',
        templateUrl: 'detime.html',
        resolve: ['validations', 'jsroot', 'ngTable', 'ngDialog']
    })
    .start();
