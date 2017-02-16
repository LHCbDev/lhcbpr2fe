Module.create('gauss', 'Gauss', 2)
    .addMenuItem({
        text: "Validation analysis",
        sref: "app.gauss",
        icon: "icon-grid"
    })
    .addMenuItem({
        text: "Detailed timing",
        sref: "app.detime",
        icon: "icon-grid"
    })
    .addState({
        name: 'app.gauss',
        controller:"ValidationsController",
        url: '/gauss',
        templateUrl: 'validations.html',
        resolve: ['gauss', 'chartjs', 'ngTable', 'ngDialog', 'jsroot']
    })
    .addState({
        name: 'app.detime',
        controller:"DetimeController",
        url: '/detime',
        templateUrl: 'detime.html',
        resolve: ['gauss', 'jsroot', 'ngTable', 'ngDialog']
    })
    .start();
