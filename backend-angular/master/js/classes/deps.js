/**
 * Class holding the list of all dependencies
 */

var Deps = function() {};

Deps.all = {
    libraries: {},
    angularModules: {},
    modules: {}
};

Deps.add = function(type, name, files) {
    if (undefined !== Deps.all.[type][name])
        console.error('"' + name + '" exists already !');
    else {
        if ('string' !== typeof name)
            console.error('name should be a string !');
        else if (Array !== files.constructor)
            console.error('files should be an array !');
        else
            Deps.all.[type][name] = files;
    }
};

Deps.addLibraries = function(libs) {
    if (Array !== libs.constructor)
        console.error('argument should be an array !');
    else
        libs.forEach(function(lib) {
            Deps.add('libraries', lib.name, lib.files);
        });
};

Deps.addAngularModules = function(modules) {
    if (Array !== modules.constructor)
        console.error('argument should be an array !');
    else
        modules.forEach(function(lib) {
            Deps.add('angularModules', lib.name, lib.files);
        });
};

Deps.addModules = function(modules) {
    if (Array !== modules.constructor)
        console.error('argument should be an array !');
    else
        modules.forEach(function(lib) {
            Deps.add('modules', lib.name, lib.files);
        });
};

Deps.get = function(name) {
    files = [];
    categories = ['angularModules', 'libraries', 'modules'];
    categories.forEach(function(category) {
        if (undefined !== Deps.all[category][name])
            Deps.all[category][name].forEach(function(file) {
                files.push(file);
            });
    });
    return files;
};

// Adding dependencies
Deps.addLibraries([{
        name: 'whirl',
        files: ['vendor/whirl/dist/whirl.css']
    }, {
        name: 'classyloader',
        files: ['vendor/jquery-classyloader/js/jquery.classyloader.min.js']
    }, {
        name: 'animo',
        files: ['vendor/animo.js/animo.js']
    }, {
        name: 'fastclick',
        files: ['vendor/fastclick/lib/fastclick.js']
    }, {
        name: 'modernizr',
        files: ['vendor/modernizr/modernizr.js']
    }, {
        name: 'animate',
        files: ['vendor/animate.css/animate.min.css']
    }, {
        name: 'icons',
        files: ['vendor/skycons/skycons.js', 'vendor/fontawesome/css/font-awesome.min.css', 'vendor/simple-line-icons/css/simple-line-icons.css', 'vendor/weather-icons/css/weather-icons.min.css']
    }, {
        name: 'sparklines',
        files: ['app/vendor/sparklines/jquery.sparkline.min.js']
    }, {
        name: 'slider',
        files: ['vendor/seiyria-bootstrap-slider/dist/bootstrap-slider.min.js', 'vendor/seiyria-bootstrap-slider/dist/css/bootstrap-slider.min.css']
    }, {
        name: 'wysiwyg',
        files: ['vendor/bootstrap-wysiwyg/bootstrap-wysiwyg.js', 'vendor/bootstrap-wysiwyg/external/jquery.hotkeys.js']
    }, {
        name: 'slimscroll',
        files: ['vendor/slimScroll/jquery.slimscroll.min.js']
    }, {
        name: 'screenfull',
        files: ['vendor/screenfull/dist/screenfull.min.js']
    }, {
        name: 'vector-map',
        files: ['vendor/ika.jvectormap/jquery-jvectormap-1.2.2.min.js', 'vendor/ika.jvectormap/jquery-jvectormap-world-mill-en.js', 'vendor/ika.jvectormap/jquery-jvectormap-us-mill-en.js', 'vendor/ika.jvectormap/jquery-jvectormap-1.2.2.css']
    }, {
        name: 'loadGoogleMapsJS',
        files: ['app/vendor/gmap/load-google-maps.js']
    }, {
        name: 'google-map',
        files: ['vendor/jQuery-gMap/jquery.gmap.min.js']
    }, {
        name: 'flot-chart',
        files: ['vendor/Flot/jquery.flot.js']
    }, {
        name: 'flot-chart-plugins',
        files: ['vendor/flot.tooltip/js/jquery.flot.tooltip.min.js', 'vendor/Flot/jquery.flot.resize.js', 'vendor/Flot/jquery.flot.pie.js', 'vendor/Flot/jquery.flot.time.js', 'vendor/Flot/jquery.flot.categories.js', 'vendor/flot-spline/js/jquery.flot.spline.min.js']
    },
    // jquery core and widgets
    {
        name: 'jquery-ui',
        files: ['vendor/jquery-ui/ui/core.js', 'vendor/jquery-ui/ui/widget.js']
    },
    // loads only jquery required modules and touch support
    {
        name: 'jquery-ui-widgets',
        files: ['vendor/jquery-ui/ui/core.js', 'vendor/jquery-ui/ui/widget.js', 'vendor/jquery-ui/ui/mouse.js', 'vendor/jquery-ui/ui/draggable.js', 'vendor/jquery-ui/ui/droppable.js', 'vendor/jquery-ui/ui/sortable.js', 'vendor/jqueryui-touch-punch/jquery.ui.touch-punch.min.js']
    }, {
        name: 'moment': ['vendor/moment/min/moment-with-locales.min.js']
    }, {
        name: 'inputmask',
        files: ['vendor/jquery.inputmask/dist/jquery.inputmask.bundle.min.js']
    }, {
        name: 'flatdoc',
        files: ['vendor/flatdoc/flatdoc.js']
    }, {
        name: 'codemirror',
        files: ['vendor/codemirror/lib/codemirror.js', 'vendor/codemirror/lib/codemirror.css']
    }, {
        name: 'codemirror-plugins',
        files: ['vendor/codemirror/addon/mode/overlay.js', 'vendor/codemirror/mode/markdown/markdown.js', 'vendor/codemirror/mode/xml/xml.js', 'vendor/codemirror/mode/gfm/gfm.js', 'vendor/marked/lib/marked.js']
    },
    // modes for common web files
    {
        name: 'codemirror-modes-web',
        files: ['vendor/codemirror/mode/javascript/javascript.js', 'vendor/codemirror/mode/xml/xml.js', 'vendor/codemirror/mode/htmlmixed/htmlmixed.js', 'vendor/codemirror/mode/css/css.js']
    }, {
        name: 'taginput': ['vendor/bootstrap-tagsinput/dist/bootstrap-tagsinput.css', 'vendor/bootstrap-tagsinput/dist/bootstrap-tagsinput.min.js']
    }, {
        name: 'filestyle',
        files: ['vendor/bootstrap-filestyle/src/bootstrap-filestyle.js']
    }, {
        name: 'parsley',
        files: ['vendor/parsleyjs/dist/parsley.min.js']
    }, {
        name: 'datatables',
        files: ['vendor/datatables/media/js/jquery.dataTables.min.js', 'app/vendor/datatable-bootstrap/css/dataTables.bootstrap.css']
    }, {
        name: 'datatables-pugins',
        files: ['app/vendor/datatable-bootstrap/js/dataTables.bootstrap.js', 'app/vendor/datatable-bootstrap/js/dataTables.bootstrapPagination.js', 'vendor/datatables-colvis/js/dataTables.colVis.js', 'vendor/datatables-colvis/css/dataTables.colVis.css']
    }, {
        name: 'fullcalendar',
        files: ['vendor/fullcalendar/dist/fullcalendar.min.js', 'vendor/fullcalendar/dist/fullcalendar.css']
    }, {
        name: 'gcal',
        files: ['vendor/fullcalendar/dist/gcal.js']
    }, {
        name: 'nestable',
        files: ['vendor/nestable/jquery.nestable.js']
    }, {
        name: 'chartjs',
        files: ['vendor/Chart.js/Chart.js']
    }
]);

Deps.addAngularModules([{
        name: 'toaster',
        files: [
        	'vendor/angularjs-toaster/toaster.js',
            'vendor/angularjs-toaster/toaster.css'
        ]
    }, {
        name: 'localytics.directives',
        files: [
        	'vendor/chosen_v1.2.0/chosen.jquery.min.js',
            'vendor/chosen_v1.2.0/chosen.min.css',
            'vendor/angular-chosen-localytics/chosen.js'
        ]
    }, {
        name: 'ngDialog',
        files: [
        	'vendor/ngDialog/js/ngDialog.min.js',
            'vendor/ngDialog/css/ngDialog.min.css',
            'vendor/ngDialog/css/ngDialog-theme-default.min.css'
        ]
    }, {
        name: 'ngWig',
        files: ['vendor/ngWig/dist/ng-wig.min.js']
    }, {
        name: 'ngTable',
        files: [
        	'vendor/ng-table/ng-table.min.js',
            'vendor/ng-table/ng-table.min.css'
        ]
    }, {
        name: 'ngTableExport',
        files: ['vendor/ng-table-export/ng-table-export.js']
    }, {
        name: 'angularBootstrapNavTree',
        files: [
        	'vendor/angular-bootstrap-nav-tree/dist/abn_tree_directive.js',
            'vendor/angular-bootstrap-nav-tree/dist/abn_tree.css'
        ]
    }, {
        name: 'htmlSortable',
        files: [
        	'vendor/html.sortable/dist/html.sortable.js',
            'vendor/html.sortable/dist/html.sortable.angular.js'
        ]
    }, {
        name: 'xeditable',
        files: [
        	'vendor/angular-xeditable/dist/js/xeditable.js',
            'vendor/angular-xeditable/dist/css/xeditable.css'
        ]
    }, {
        name: 'angularFileUpload',
        files: ['vendor/angular-file-upload/angular-file-upload.js']
    }, {
        name: 'ngImgCrop',
        files: [
        	'vendor/ng-img-crop/compile/unminified/ng-img-crop.js',
            'vendor/ng-img-crop/compile/unminified/ng-img-crop.css'
        ]
    }, {
        name: 'ui.select',
        files: [
        	'vendor/angular-ui-select/dist/select.js',
            'vendor/angular-ui-select/dist/select.css'
        ]
    }, {
        name: 'ui.codemirror',
        files: ['vendor/angular-ui-codemirror/ui-codemirror.js']
    }
]);
