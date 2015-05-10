/**
 * Module: Admin Home Page
 * Developer: Rajmohan G
 * Date: 12-11-2013
 */
define([
    'angular',
    'bootstrap',
    'jquery',
    'ngGrid',
    'gridLayout',
    'io/services/services'

], function (angular) {

    var mainApp = angular.module('io.admin.home.controllers', ['io.admin.report.services', 'io.admin.input.services', 'io.admin.data.services',
        'ngGrid', 'ui.bootstrap'
    ]);

    //HomeController will display Report Grid and DB connection Grid.
    mainApp.controller('HomeController', ['$scope', '$timeout', 'ReportsFactory', 'ReportsExecuteFactory', 'DbTestFactory', 'FtpTestFactory', 'ScheduleFactory', 'AdvanceFilter', 'DbFactory', 'DataFactory', '$filter',

        function ($scope, $timeout, ReportsFactory, ReportsExecuteFactory, DbTestFactory, FtpTestFactory, ScheduleFactory, AdvanceFilter, DbFactory, DataFactory, $filter) {

            //modal style properties settings.
            $scope.modalOpts = {
                backdropFade: true,
                dialogFade: true
            };         

            //Clear messages.
            $scope.alerts = [];

            //Remove alert messages.
            $scope.closeAlert = function (index) {
                $scope.alerts.splice(index, 1);
            };

            //Remove alert messages from modal
            $scope.closeModalAlerts = function (index) {
                $scope.modalAlerts.splice(index, 1);
            };

            //Fix grid resize issue.
            $scope.parentResize = function () {
                $timeout(function () {
                    //broadcasting the resize message to the grid scope for resizing the grid in the container
                    // delay added as a fix for the grid alignment issue
                    $scope.$broadcast('parentResize');
                }, 5);
            };

            //ngGrid layout configuration for Reports.
            $scope.filterOptions = {
                filterText: "",
                useExternalFilter: true
            };

            //Initialize total items count for Report list grid.
            $scope.totalReports = 0;

            //Initialize total items count for DB connection grid.
            $scope.totalDBConnections = 0;

            //Initialize total items count for schedule grid.
            $scope.totalSchedules = 0;

            /**
             *Pagination configuration for ng-grid.
             *configure report, db and schedule grid.
             */
            $scope.pagingOptions = {
                report: {
                    pageSizes: [5, 10, 20],
                    pageSize: 5,
                    currentPage: 1
                },
                db: {
                    pageSizes: [5, 10, 20],
                    pageSize: 5,
                    currentPage: 1
                }
            }

            //PagingData for Report list grid.
            $scope.setPagingReportData = function (data, page, pageSize) {
                //save report data in reportListTmp variable for adavance search usage
                $scope.reportListTmp = data;
                var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
                $scope.reportList = pagedData;
                $scope.totalReports = data.length;
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            };

            //PaginData for DB connection grid.
            $scope.setPagingDBData = function (data, page, pageSize) {
                var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
                $scope.dbList = pagedData;
                $scope.totalDBConnections = data.length;
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            };

            //setPagingReportDataFilter function called when advance filter is active.
            $scope.setPagingReportDataFilter = function (data, page, pageSize) {
                var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
                $scope.reportList = pagedData;
                $scope.totalReports = data.length;
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            };

            //getPagedDataAsyncForFilter function called when advance filter is active.
            $scope.getPagedDataAsyncForFilter = function (pageSize, page) {
                setTimeout(function () {
                    var data;
                    data = $scope.reportFilterData;
                    $scope.setPagingReportDataFilter(data, page, pageSize);
                }, 10);
            };


            //Fetch Report data from server file server/reports
            $scope.getPagedDataAsync = function (pageSize, page, searchText) {
                setTimeout(function () {
                    var data;
                    if (searchText) {
                        var ft = searchText.toLowerCase();
                        // get the report list from server
                        ReportsFactory.query(function (successResponse) {
                            // success callback
                            DataFactory.setReportList(successResponse);
                            var largeLoad = DataFactory.getReportList();

                            data = largeLoad.filter(function (item) {
                                return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                            });

                            //call setPagingReportData to update the grid
                            $scope.setPagingReportData(data, page, pageSize);
                        }, function (errorResponse) {
                            // failure callback
                            if (errorResponse.status == "404" || errorResponse.status == "500")
                                $scope.alerts.push({
                                    type: 'error',
                                    msg: 'Error in getting the server response.'
                                });
                        });
                    } else {
                        // get the report list from server
                        ReportsFactory.query(function (successResponse) {
                            // success callback
                            DataFactory.setReportList(successResponse);
                            var largeLoad = DataFactory.getReportList();
                            //call setPagingReportData to update the grid
                            $scope.setPagingReportData(largeLoad, page, pageSize);
                        }, function (errorResponse) {
                            // failure callback
                            if (errorResponse.status == "404" || errorResponse.status == "500")
                                $scope.alerts.push({
                                    type: 'error',
                                    msg: 'Error in getting the server response.'
                                });
                        });
                    }
                }, 10);
            };

            //Fetch DB connection data from server file server/connections
            $scope.getPagedDBDataAsync = function (pageSize, page) {
                setTimeout(function () {
                    // getting the db list from server
                    DbFactory.query(function (successResponse) {
                        // success callback
                        DataFactory.setDbList(successResponse);
                        var largeLoad = DataFactory.getDbList();
                        $scope.setPagingDBData(largeLoad, page, pageSize);
                    }, function (errorResponse) {
                        // failure callback
                        if (errorResponse.status == "404" || errorResponse.status == "500") {
                            $scope.alerts.push({
                                type: 'error',
                                msg: 'Error in getting the server response.'
                            });
                        }

                    });
                }, 10);
            };

            //Fetch schedule data from server file server/schedules
            $scope.getScheduleData = function (reportId) {

                setTimeout(function () {
                    // get the schedule list from server
                    ScheduleFactory.query({
                            reportId: reportId
                        },
                        function (successResponse) {
                            // success callback
                            DataFactory.setScheduleList(successResponse);
                            var largeLoad = DataFactory.getScheduleList();
                            $scope.scheduleList = largeLoad;
                            $scope.scheduleListTmp = angular.copy(largeLoad);
                            $scope.scheduleListLoc = angular.copy(largeLoad);;
                            $scope.totalSchedules = largeLoad.length;
                            if (!$scope.$$phase) {
                                $scope.$apply();
                            }
                        },
                        function (errorResponse) {
                            // failure callback
                            if (errorResponse.status == "404" || errorResponse.status == "500")
                                $scope.alerts.push({
                                    type: 'error',
                                    msg: 'Error in getting the server response.'
                                });
                        });
                }, 10);
            };

            //Call getPagedDataAsync for Report grid.
            $scope.getPagedDataAsync($scope.pagingOptions.report.pageSize, $scope.pagingOptions.report.currentPage);

            //Call getPagedDBDataAsync for DB connection grid.
            $scope.getPagedDBDataAsync($scope.pagingOptions.db.pageSize, $scope.pagingOptions.db.currentPage);

            $scope.$watch('pagingOptions.report', function (newVal, oldVal) {
                if ((newVal !== oldVal || newVal.currentPage !== oldVal.currentPage)) {
                    //check if adavance search is enabled
                    if (!$scope.advSearchShow) {
                        $scope.getPagedDataAsync($scope.pagingOptions.report.pageSize, $scope.pagingOptions.report.currentPage, $scope.filterOptions.filterText);
                    } else {
                        $scope.getPagedDataAsyncForFilter($scope.pagingOptions.report.pageSize, $scope.pagingOptions.report.currentPage);
                    }

                }
            }, true);

            //check for changes in page size in report grid.
            $scope.$watch('pagingOptions.db', function (newVal, oldVal) {
                if (newVal !== oldVal || newVal.currentPage !== oldVal.currentPage) {
                    $scope.getPagedDBDataAsync($scope.pagingOptions.db.pageSize, $scope.pagingOptions.db.currentPage);
                }
            }, true);

            $scope.$watch('filterOptions', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    $scope.getPagedDataAsync($scope.pagingOptions.report.pageSize, $scope.pagingOptions.report.currentPage, $scope.filterOptions.filterText);
                }
            }, true);

            $scope.$watch('filterOptionsDB', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    $scope.getPagedDBDataAsync($scope.pagingOptions.db.pageSize, $scope.pagingOptions.db.currentPage);
                }
            }, true);

            window.ngGrid.i18n['en'] = {
                ngTotalItemsLabel: 'Total Reports:'
            };
            
            // ngGrid configuration for Report list
            $scope.reportOptions = {
                data: 'reportList',
                enablePaging: true,
                showFooter: true,
                showColumnMenu: true,
                enableRowSelection: false,
                totalServerItems: 'totalReports',
                pagingOptions: $scope.pagingOptions.report,
                filterOptions: $scope.filterOptions,
                plugins: [new ngGridLayoutPlugin()],
                columnDefs: [{
                    field: 'id',
                    displayName: 'ID',
                    width: 60
                }, {
                    field: 'community_name',
                    displayName: 'Community Name'
                }, {
                    field: 'name',
                    displayName: 'Name',
                    cellTemplate: '/js/templates/report-option-popup.html'
                }, {
                    field: 'sso_id',
                    displayName: 'SSO ID',
                    width: 90
                }, {
                    field: 'owner_name',
                    displayName: 'Created By'
                }, {
                    field: 'report_type',
                    displayName: 'Type',
                    width: 60
                }, {
                    field: 'input_type',
                    displayName: 'Input Type',
                    visible: false,
                     width: 90
                }, {
                    field: 'output_type',
                    displayName: 'Output Type',
                    visible: false,
                    width: 90
                }, {
                    field: 'status',
                    displayName: 'Status',
                    width: 90
                }, {
                    field: 'id',
                    displayName: 'Schedule',
                    enableCellEdit: false,
                    width: 80,
                    cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()"><a href="" ng-click="scheduleModalOpen({{row.entity[col.field]}})">View</a></div>'
                }, {
                    field: 'id',
                    displayName: 'Test Connection',
                    enableCellEdit: false,
                    width: 140,
                    cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()"><a href="" ng-click="testFTPConnection({{row.entity[col.field]}})">FTP</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="" ng-click="testDBConnection({{row.entity[col.field]}})">DB</a></div>'
                }, {
                    field: 'dt_created',
                    displayName: 'Date Created',
                    visible: false,
                    width: 120,
                    cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">{{row.entity[col.field] | date:"MM/dd/yy HH:mm"}}</div>'
                }, {
                    field: 'date_expire',
                    displayName: 'Expire Date',
                    visible: false,
                    width: 120,
                    cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">{{row.entity[col.field] | date:"MM/dd/yy HH:mm"}}</div>'
                }, {
                    field: 'dt_last_executed',
                    displayName: 'Last Executed',
                    visible: false,
                    width: 120,
                    cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">{{row.entity[col.field] | date:"MM/dd/yy HH:mm"}}</div>'
                }]
            };

            /**
             *Open schedule modal.
             *@Param reportId
             *Get schedule details of a particular report
             */
            $scope.scheduleModalOpen = function (reportId) {

                //Fetch schedule details
                $scope.getScheduleData(reportId);

                //All status of report              
                $scope.status = {
                    val: [{
                        id: 1,
                        name: "Executed",
                        selectable: false
                    }, {
                        id: 2,
                        name: "Queued",
                        selectable: false
                    }, {
                        id: 3,
                        name: "Null",
                        selectable: false
                    }, {
                        id: 4,
                        name: "In Progress",
                        selectable: true
                    }, ]
                };

                //selected recordId
                $scope.reportId = reportId;
                
                window.ngGrid.i18n['en'] = {
                 ngTotalItemsLabel: 'Total Schedules:'
                };

                //ngGrid configuration for Schedules
                $scope.scheduleOptions = {
                    data: 'scheduleList',
                    showFooter: true,
                    showColumnMenu: false,
                    enableRowSelection: false,
                    totalServerItems: 'totalSchedules',
                    plugins: [new ngGridLayoutPlugin()],
                    columnDefs: [{
                        field: 'job_id',
                        displayName: 'ID',
                        width: 40,
                        enableCellEdit: false
                    }, {
                        field: 'event_time',
                        displayName: 'Event Time',
                        width: 90,
                        enableCellEdit: false
                    }, {
                        field: 'dt_created',
                        displayName: 'Date Created',
                        width: 120,
                        cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">{{row.entity[col.field] | date:"MM/dd/yy HH:mm"}}</div>',
                        enableCellEdit: false
                    }, {
                        field: 'status',
                        displayName: 'Status',
                        width: '*',
                        cellTemplate: '/js/templates/schedule-status-template.html'
                    }]
                };

                $scope.scheduleModalShouldBeOpen = true;
                $scope.addFlag = true;
            };
            
            
            /**
             *Change status dropdown
             *open confirm modal
             *@params jobId, status
             */
            $scope.confirmStatusChange = function (jobId, status) {
                //Check if schedule status has been updated               
                if (!angular.equals($scope.scheduleList, $scope.scheduleListLoc)) {
                    //clear modal alerts
                    $scope.confirmModalShouldBeOpen = true;
                    $scope.scheduleData = {
                         "job_id": jobId,
                         "status": status
                    };
                }
            };
            
            //Close confirmation popup.
            $scope.confirmModalClose =  function() {
                $scope.confirmModalShouldBeOpen = false;
            }
            
            /**
             *update schedule status
             *@params $scope.scheduleData
             */
            $scope.updateScheduleStatus =  function() {
                               
                //Initialize schedule alert and clear previous alert message
                $scope.modalAlerts = [];
                
                //Need to change to PUT call
                    ReportsFactory.save({
                        reportId: $scope.reportId
                    }, $scope.scheduleData, function (successResponse) {
                        // success callback
                        if (successResponse.status == "200") {
                            $scope.modalAlerts.push({
                                type: 'success',
                                msg: 'Schedule status updated successfully.'
                            });
                            //Update scheduleListLoc for next comparison.
                            $scope.scheduleListLoc = angular.copy($scope.scheduleList);
                        }
                    }, function (errorResponse) {
                        // failure callback
                        if (errorResponse.status == "400") {
                            $scope.modalAlerts.push({
                                type: 'error',
                                msg: 'Schedule status update failed.'
                            });
                        }else if (errorResponse.status == "404" || errorResponse.status == "500") {
                            $scope.modalAlerts.push({
                                type: 'error',
                                msg: 'Error in getting the server response.'
                            });
                        }
                    });
                
                $scope.confirmModalShouldBeOpen = false;
            }

            /**
             * Function to test DB connection
             * @Params: reportId
             * @method POST
             */
            $scope.testDBConnection = function (reportId) {
                
                //clear message
                $scope.closeAlert();
                
                DbTestFactory.save({}, {
                    "reportId": reportId
                }, function (successResponse) {
                    // success callback
                    if (successResponse.status == "200") {
                        $scope.alerts.push({
                            type: 'success',
                            msg: 'Database connection successful.'
                        });
                    }
                }, function (errorResponse) {
                    // failure callback
                     if (errorResponse.status == "400") {
                        $scope.alerts.push({
                            type: 'error',
                            msg: 'Database connection failed.'
                        });
                    }else if (errorResponse.status == "404" || errorResponse.status == "500") {
                        $scope.alerts.push({
                            type: 'error',
                            msg: 'Error in getting the server response.'
                        });
                    }
                });
            };

            /**
             * Function to test FTP connection
             * @Params: reportId
             * @method POST
             */
            $scope.testFTPConnection = function (reportId) {
                //clear message
                $scope.closeAlert();
                
                //call webservice to test FTP connection
                FtpTestFactory.save({}, {
                    "reportId": reportId
                }, function (successResponse) {
                    // success callback
                    if (successResponse.status == "200") {
                        $scope.alerts.push({
                            type: 'success',
                            msg: 'FTP connection successful.'
                        });
                    }
                }, function (errorResponse) {
                    // failure callback
                     if (errorResponse.status == "400") {
                        $scope.alerts.push({
                            type: 'error',
                            msg: 'FTP connection failed.'
                        });
                    }else if (errorResponse.status == "404" || errorResponse.status == "500") {
                        $scope.alerts.push({
                            type: 'error',
                            msg: 'Error in getting the server response.'
                        });
                    }
                });
            };

            // cancel schedule details popup
            $scope.scheduleModalClose = function () {
                $scope.scheduleModalShouldBeOpen = false;
            };

            //validate status.Check status if 'Executed' disable selectbox
            $scope.validateStatus = function (status) {
                if (status == "Executed")
                    return "true";
            };

            // ngGrid configuration for DB connections
            $scope.dbOptions = {
                data: 'dbList',
                enablePaging: true,
                showFooter: true,
                showColumnMenu: true,
                enableRowSelection: false,
                totalServerItems: 'totalDBConnections',
                pagingOptions: $scope.pagingOptions.db,
                filterOptions: $scope.filterOptionsDB,
                plugins: [new ngGridLayoutPlugin()],
                columnDefs: [{
                    field: 'id',
                    displayName: 'ID'
                }, {
                    field: 'community_name',
                    displayName: 'Community Name'
                }, {
                    field: 'db_name',
                    displayName: 'Database Name',
                    cellTemplate: '/js/templates/db-option-popup.html'
                }, {
                    field: 'owner_name',
                    displayName: 'Created By'
                }, {
                    field: 'sso_id',
                    displayName: 'SSO ID'
                }, {
                    field: 'db_type',
                    displayName: 'Database Type'
                }]
            };

            // open the db connection modal
            $scope.dbModalOpen = function (dbId) {
                //clear previous alert message
                $scope.closeAlert();
                $scope.dbSaved = false;
                $scope.currentDbMaster = {};

                if (dbId) {
                    // get the db connection details from the list
                    if ($scope.currentDb = $filter('getDbConnection')($scope.dbList, dbId)) {
                        // backup the connection object for later rollback if required
                        $scope.currentDbMaster = angular.copy($scope.currentDb);
                        $scope.dbShouldBeOpen = true;
                    } else {
                        $scope.alerts.length = 0;
                        $scope.alerts.push({
                            type: 'error',
                            msg: 'Error in getting the server response.'
                        });
                    }
                } else {
                    // new db factory
                    $scope.currentDb = new DbFactory();
                    $scope.dbShouldBeOpen = true;
                }
            };

            // cancel the db connection modal
            $scope.dbModalClose = function () {
                //clear previous alert message
                $scope.closeAlert();
                $scope.dbShouldBeOpen = false;
            };

            // enable/disable the advance search option
            $scope.advanceSearch = function () {
                $scope.advSearchShow = !$scope.advSearchShow;
            };

            //advance search filter
            $scope.advanceFilter = function () {

                var reportFilterData = $scope.reportListTmp;

                //call dataFilter service in io.report.services module
                if ($scope.dateFilter && $scope.dateFilter.createdFrom != 'undefined')
                    reportFilterData = AdvanceFilter.filterReportsByCreateDate($scope.dateFilter.createdFrom, $scope.dateFilter.createdTo, reportFilterData);

                if ($scope.dateFilter && $scope.dateFilter.expireFrom != 'undefined')
                    reportFilterData = AdvanceFilter.filterReportsByExpireDate($scope.dateFilter.expireFrom, $scope.dateFilter.expireTo, reportFilterData);

                if ($scope.dataFilter && $scope.dataFilter.communityName != 'undefined')
                    reportFilterData = AdvanceFilter.filterReportsByCommunityName($scope.dataFilter.communityName, reportFilterData);

                if ($scope.dataFilter && $scope.dataFilter.createdBy != 'undefined' && $scope.dataFilter.createdBy)
                    reportFilterData = AdvanceFilter.filterReportsByCreatedBy($scope.dataFilter.createdBy, reportFilterData);

                //update report grid
                $scope.reportList = reportFilterData;

                //save adavance search data in reportFilterData variable for grid pagination usage
                $scope.reportFilterData = reportFilterData;

                $scope.setPagingReportDataFilter(reportFilterData, $scope.pagingOptions.report.currentPage, $scope.pagingOptions.report.pageSize);
            };

            //Reset grid view and advance serach filter
            $scope.advanceSearchCancel = function () {
                $scope.advSearchShow = !$scope.advSearchShow;
                $scope.dateFilter = {};
                $scope.getPagedDataAsync($scope.pagingOptions.report.pageSize, $scope.pagingOptions.report.currentPage);
            };

            // Function to test the DB connection.
            //webservice call needs to be changed
            $scope.chkDBConnection = function () {
                 // get status of DB connection
                 DbFactory.query(function (successResponse) {
                     //set DB connection status as 1. To be 
                     $scope.dbConnectionStatus = true;

                     //clear previous alert message
                     $scope.closeAlert();

                     if ($scope.dbConnectionStatus) {
                         $scope.alerts.push({
                             type: 'success',
                             msg: 'Database connection successful.'
                         });
                     } else {
                         $scope.alerts.push({
                             type: 'error',
                             msg: 'Database connection failed.'
                         });
                     }
                 }, function (errorResponse) {
                     // failure callback
                     if (errorResponse.status == "404" || errorResponse.status == "500")
                         $scope.alerts.push({
                             type: 'error',
                             msg: 'Error in getting the server response.'
                         });
                 });
             };

            /**
             * Exute report
             * @Params reportId
             * @method POST
             */
            $scope.reportExecute = function (reportId) {
                //clear previous alert message
                $scope.closeAlert();
                
                ReportsExecuteFactory.save({
                    "reportId": reportId
                }, {}, function (successResponse) {
                    // success callback
                    if (successResponse.status == "200") {
                        $scope.alerts.push({
                            type: 'success',
                            msg: 'Report executed successfully.'
                        });
                    }
                }, function (errorResponse) {
                    // failure callback
                    if (errorResponse.status == "400") {
                        $scope.alerts.push({
                            type: 'error',
                            msg: 'Report execution failed.'
                        });
                    }else if (errorResponse.status == "404" || errorResponse.status == "500") {
                        $scope.alerts.push({
                            type: 'error',
                            msg: 'Error in getting the server response.'
                        });
                    }
                });
            }
        }
    ]);
});