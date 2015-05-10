var tests = [];
for (var file in window.__karma__.files) {
    if (window.__karma__.files.hasOwnProperty(file)) {
        if (/spec\.js$/.test(file)) {
            tests.push(file);
        }
    }
}

require.config({
    baseUrl: '/base/io/public/js',
    paths: {
        angular:'lib/angular',
        ngResource:'lib/angular-resource',
        bootstrap: 'lib/ui-bootstrap-tpls-0.5.0',
        angularMocks:'/base/test-runner/lib/angular-mocks',
        angularScenario:'/base/test-runner/lib/angular-scenario'
    },
    shim: {
        angular : {
            deps:['jquery'],
            exports : 'angular'
        },
        bootstrap: {
            deps:['angular'],
            exports: 'angular.module'
        },
        angularMocks:{
            deps:['angular'],
            exports: 'angular.mocks'
        },
        angularScenario:{
            deps:['angular'],
            exports: 'angular.scenario'
        } ,
        ngResource: {deps:['angular'], exports:'ngResource'},
    },
    urlArgs: "bust=" + (new Date()).getTime(),
    // ask Require.js to load these files (all our tests)
    deps: tests,
    // start test run, once Require.js is done
    callback: window.__karma__.start
})
;
