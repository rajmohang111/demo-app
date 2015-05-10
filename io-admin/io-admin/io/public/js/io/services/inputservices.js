/**
 * webservice call
 * Developer: Rajmohan
 * Date: 12-11-2013
 */
define([
    'angular',
    'ngResource',
    'io/services/configuration'

], function (angular) {
    var serviceApp = angular.module('io.admin.input.services', ['io.admin.configuration', 'ngResource']);

    /**
     * Webservice call to get db connection list.
     * @Param: @dbId Database ID
     */
    serviceApp.factory('DbFactory', function ($resource, AppSettings) {
        return $resource(AppSettings.api_url + 'connections/:dbId', {
            dbId: '@dbId'
        }, {
            update: {
                method: 'PUT'
            }
        });
    });

    /**
     * webservice call test report DB connection.
     * @Param: @reportId Report ID
     */
    serviceApp.factory('DbTestFactory', function ($resource, AppSettings) {
        return $resource(AppSettings.api_url + 'db/test/:reportId', {
            reportId: '@reportId'
        }, {
            update: {
                method: 'PUT'
            }
        });
    });

    /**
     * webservice call test report FTP connection.
     * @Param: @reportId Report ID
     */
    serviceApp.factory('FtpTestFactory', function ($resource, AppSettings) {
        return $resource(AppSettings.api_url + 'ftp/test/:reportId', {
            reportId: '@reportId'
        }, {
            update: {
                method: 'PUT'
            }
        });
    });

});