/**
 * Data Factory for webservice
 * Developer: Rajmohan
 * Date: 12-11-2013
 */
define([
    'angular'
], function (angular) {
    var dataServiceApp = angular.module('io.admin.data.services', []);
    /**
     * service to hold the global data across multiple controllers.
     * Param(s):
     */
    dataServiceApp.factory('DataFactory', function () {
        var data = {};
        var services = {};

        services.getReportData = function () {
            return data.reportDetail;
        }
        services.setReportData = function (reportDetail) {
            data.reportDetail = reportDetail;
        }

        services.getReportId = function () {
            return data.currentReportId;
        }
        services.setReportId = function (id) {
            data.currentReportId = id;
        }

        services.getDbList = function () {
            return data.dbList;
        }
        services.setDbList = function (dbList) {
            data.dbList = dbList;
        }

        services.getReportList = function () {
            return data.reportList;
        }
        services.setReportList = function (reportList) {
            data.reportList = reportList;
        }

        services.setScheduleList = function (scheduleList) {
            data.scheduleList = scheduleList;
        }

        services.getScheduleList = function () {
            return data.scheduleList;
        }

        services.clearData = function () {
            data = {};
        }

        return services;

    });

});