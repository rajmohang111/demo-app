define([
    'angular',
    'io/controllers/controllers',
    'io/directives/directives'
], function (angular) {
    return angular
        .module('io', ['io.admin.home.controllers', 'io.admin.report.controllers',
            'io.admin.util.controllers', 'io.admin.directives'
        ])
        .config(['$routeProvider',
            function ($routeProvider) {
                $routeProvider
                    .when('/', {
                        controller: 'HomeController',
                        templateUrl: 'js/templates/main.html'
                    })
                    .when('/reports/:reportId', {
                        controller: 'ReportController',
                        templateUrl: 'js/templates/report-details-view.html'
                    })
                    .otherwise({
                        redirectTo: '/404'
                    });
            }
        ]);
});