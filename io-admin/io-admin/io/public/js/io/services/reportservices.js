/**
 * Report Data service
 * Developer: Rajmohan G
 * Date: 12-11-2013
 */
define([
    'angular',
    'ngResource',
    'io/services/configuration'
], function (angular) {
    var reportServiceApp = angular.module('io.admin.report.services', ['io.admin.configuration', 'ngResource']);

    /**
     * Service: ReportsFactory service
     * Param(s): reportId
     */
    reportServiceApp.factory('ReportsFactory', function ($resource, AppSettings) {
        return $resource(AppSettings.api_url + 'reports/:reportId', {
            reportId: '@reportId'
        }, {
            update: {
                method: 'PUT'
            }
        });
    });

    /**
     * Service: Advance Filter service
     * Description: service to filter reports data
     */
    reportServiceApp.factory('AdvanceFilter', function () {
        return {
            /**
             * Function to filter reports using created To and From date.
             * @Param(s): fromDate, toDate, reportList
             */
            filterReportsByCreateDate: function (fromDate, toDate, reportList) {

                var result = [];

                var start_date = (fromDate && !isNaN(Date.parse(fromDate))) ? Date.parse(fromDate) : 0;
                var end_date = (toDate && !isNaN(Date.parse(toDate))) ? Date.parse(toDate) : new Date().getTime();

                angular.forEach(reportList, function (report) {
                    var createdDate = report.dt_created;
                    if (createdDate >= start_date && createdDate <= end_date) {
                        result.push(report);
                    }
                });

                return result;

            },
            /**
             * Function to filter reports using expire To and From date.
             * @Param(s): fromDate, toDate, reportList
             */
            filterReportsByExpireDate: function (fromDate, toDate, reportList) {

                var result = [];

                var start_date = (fromDate && !isNaN(Date.parse(fromDate))) ? Date.parse(fromDate) : 0;
                var end_date = (toDate && !isNaN(Date.parse(toDate))) ? Date.parse(toDate) : new Date().getTime();

                angular.forEach(reportList, function (report) {
                    var expireDate = report.date_expire;
                    if (expireDate >= start_date && expireDate <= end_date) {
                        result.push(report);
                    }
                });

                return result;

            },
            /**
             * Function to filter reports using community name.
             * @Param(s): communityName, reportList
             */
            filterReportsByCommunityName: function (communityName, reportList) {

                communityName = communityName.toLowerCase();

                if (!communityName) communityName = '';

                var result = angular.copy(reportList, []);

                result = result.filter(function (item) {
                    return (item.community_name.toLowerCase().indexOf(communityName) > -1);
                });

                return result;

            },
            /**
             * Function to filter reports using created by.
             * @Param(s): createdBy, reportList
             */
            filterReportsByCreatedBy: function (createdBy, reportList) {

                createdBy = createdBy.toLowerCase();

                if (!createdBy) createdBy = '';

                var result = angular.copy(reportList, []);

                result = result.filter(function (item) {
                    return (item.owner_name.toLowerCase().indexOf(createdBy) > -1);
                });

                return result;

            }
        }
    });

    /**
     * Service: ScheduleFactory service
     * Description: webservice call to get report schedule details
     * Param(s): reportId
     */
    reportServiceApp.factory('ScheduleFactory', function ($resource, AppSettings) {
        return $resource(AppSettings.api_url + 'report/:reportId/schedules', {
            reportId: '@reportId'
        }, {
            update: {
                method: 'PUT'
            }
        });
    });
    
    /**
     * Service: ReportsExecuteFactory service
     * Description: Execute Report
     * Param(s): reportId
     */
    reportServiceApp.factory('ReportsExecuteFactory', function ($resource, AppSettings) {
        return $resource(AppSettings.api_url + 'reports/:reportId/execute', {
            reportId: '@reportId'
        }, {
            update: {
                method: 'PUT'
            }
        });
    });
});