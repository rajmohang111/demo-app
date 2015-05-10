/**
 * Module: utilcontrollers
 * CreatedBy: Rajmohan
 * Date: 12/06/2013
 */
define([
    'angular',
    'bootstrap',
    'jquery'
], function (angular) {
    var utilApp = angular.module('io.admin.util.controllers', []);


    /*
     *  controller for managing the date picker properties.
     *  Date: 12-06-2013
     */
    utilApp.controller('DatepickerCtrl', function ($scope, $timeout) {
        $scope.showWeeks = false;
        $scope.open = function() {
            $timeout(function() {
                $scope.opened = true;
            });
        };
    });

    /*
     *  controller for managing the Modal properties.
     */
    utilApp.controller('ModalCtrl', function ($scope) {
        $scope.modalOpen = function () {
            $scope.shouldBeOpen = true;
        };
        $scope.modalClose = function () {
            $scope.shouldBeOpen = false;
        };
        $scope.opts = {
            backdropFade: true,
            dialogFade:true
        };
    });



});