/**
 * Created with JetBrains WebStorm.
 * User: Anoj
 * Date: 9/9/13
 * Time: 7:00 PM
 * App Configurations
 */
define([
    'angular'
], function (angular) {
    var configApp = angular.module('io.admin.configuration', []);
    configApp.factory('AppSettings', function() {
        if(typeof io !== 'undefined'){
            return {
                api_url: io.api_url
            }
        }
        else{
            return {
                api_url: "server/"
            }
        }


    });

});

