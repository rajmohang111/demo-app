/**
 * Created with JetBrains WebStorm.
 * User: Anoj
 * Date: 9/20/13
 * Time: 5:12 PM
 */
define([
    'angular',
    'bootstrap',
    'io/services/services',
    'io/filters/filters'
], function (angular) {
    var reportApp = angular.module('io.admin.report.controllers', ['io.admin.report.services','io.admin.input.services','io.admin.data.services',
        'ui.bootstrap']);


    /*
     *  Parent report controller for new reports. Handles form validation and form submission
     */
    reportApp.controller('ReportController', ['$scope','$routeParams','ReportsFactory','$location','DataFactory',
        function ($scope,$routeParams,ReportsFactory,$location,DataFactory) {

            // Clear messages if any
            $scope.alerts = [];

            // initializing the scope variables
            $scope.reportId = $routeParams.reportId;

            // Remove the message on click
            $scope.closeAlert = function(index){
                $scope.alerts.splice(index, 1);
            }


            // getting the report details from the server API
            if(!DataFactory.getReportData() || DataFactory.getReportId() != $routeParams.reportId){
                // if it's a new report then create a new resource object
                if(!$routeParams.reportId){
                  //  should throw an error msg for empty reportId
                }
                else{
                    $scope.reportId = 11953; //Need to be removed
                    DataFactory.setReportData($scope.reportDetail = ReportsFactory.get({reportId : $scope.reportId},
                        function(successResponse) {
                            // success callback
                            DataFactory.setReportId(DataFactory.getReportData().id);
                            DataFactory.getReportData().date_expire  = parseInt(DataFactory.getReportData().date_expire);
                            DataFactory.getReportData().start_date  = parseInt(DataFactory.getReportData().start_date);
                            DataFactory.getReportData().sftp  = Boolean(DataFactory.getReportData().sftp);
                            $scope.reportDetail = DataFactory.getReportData();
                        },
                        function(errorResponse){
                            // error callback
                            if(errorResponse.status=="404"){
                                $scope.alerts.length=0;
                                $scope.alerts.push({ type: 'error', msg: 'Error in getting the server response.' }) ;
                            }
                        }));
                }
            }

            // Cancel the create/update report details
            $scope.cancelReport = function(){
                DataFactory.setReportData(null);
                DataFactory.setReportId(null);
                $location.path('/') ;
            }
        }
    ]);
});