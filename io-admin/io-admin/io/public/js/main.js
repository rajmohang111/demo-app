require.config({
    paths: {
        angular: 'lib/angular',
        ngResource: 'lib/angular-resource',
        bootstrap: 'lib/ui-bootstrap-tpls-0.5.0',
        jquery: 'lib/jquery-1.10.2.min',
        ngGrid: 'lib/ng-grid-2.0.7.min',
        gridLayout: 'lib/ng-grid-layout'
    },
    baseUrl: 'js/',
    shim: {
        angular: {
            deps: ['jquery'],
            exports: 'angular'
        },
        ngResource: {
            deps: ['angular'],
            exports: 'ngResource'
        },
        bootstrap: {
            deps: ['angular'],
            exports: 'bootstrap'
        },
        jquery: {
            'exports': 'window.jQuery'
        },
        ngGrid: {
            deps: ['jquery', 'angular'],
            'exports': 'ngGrid'
        },
        gridLayout: {
            deps: ['ngGrid'],
            'exports': 'gridLayout'
        }

    },
    priority: [
        'angular'
    ],
    locale: 'en-us',
    urlArgs: 'bust=' + io.VERSION,
    waitSeconds: 30
});

require([
    'angular',
    'domReady',
    'io/app'
], function (angular, domReady) {
    domReady(function () {
        angular.bootstrap(document, ['io']);
    })

});