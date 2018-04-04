angular.module('myApp.controllers')
.controller('ReportCtrl', function($scope, $http, $cookies, ngDialog, $animate, uiGridConstants, uiGridSelectionService, uiGridExporterService, uiGridPinningService, $rootScope, adminApi, $timeout, $location, $interval){
	//$scope.adminInfoBarForm = {};
	$scope.adminEmail = "";
	$scope.adminName = "";

	$scope.fromDate = "";
	$scope.tillDate = "";
	$scope.validDateRange = true;
	$scope.dateValid = true;

	$scope.from_date="";
	$scope.till_date="";
	$scope.periodMonth="";
	$scope.periodYesterday="";
	$scope.periodWeek="week";

	$scope.monthList = ["January", "February" , "March" , "April" , "May" , "June" , "July" , "August" ,"September" ,"October" , "November" , "December" ];

	$scope.initReportInfo = function() {
		if(($cookies.get('u_email') != undefined)) {
			$scope.adminEmail = $cookies.get('u_email');
		} else {
		}
		
	   if(($cookies.get('u_name') != undefined)) {
			$scope.adminName = $cookies.get('u_name');
		} else {
		}
	}



	$scope.checkSessionTimeout = function(obj) {
		if(obj.error.errorCode == 3238133787 ) {
			var cookies = $cookies.getAll();
			angular.forEach(cookies, function (v, k) {
				$cookies.remove(k);
			});
			$scope.$root.$broadcast('navigatetoHomeFinance');
		}
	};

	$scope.initReport = function() {
		  
	}

	$timeout(function(){
		$('.dateTimePicker').datetimepicker({
			format: 'YYYY-MM-DD hh:mm A'
		});
		$('.datetimepicker2').datetimepicker({
			format: 'YYYY-MM-DD hh:mm A'
		});
		$('#datetimepicker4').datetimepicker({
			format: 'YYYY-MM-DD hh:mm A'
		});
		$('#datetimepicker5').datetimepicker({
			format: 'YYYY-MM-DD hh:mm A'
		});
	}, 200);


	$scope.initReports = function() {
		//alert("initReports");
		$scope.sortKey = 'starttime';
		$scope.reverse = false;

		var current_date = moment().unix();
		var formatted_cur_date = moment(new Date(current_date * 1000)).format("YYYY-MM-DD hh:mm A");

		var days = 7;
		var date = new Date();
		var weekly_date_before = Math.round((date.setTime(date.getTime() - (days * 24 * 60 * 60 * 1000)))/1000);
		var formatted_weekly_date_before = moment(new Date(weekly_date_before * 1000)).format("YYYY-MM-DD hh:mm A");
		
		$scope.fromDate = formatted_weekly_date_before; 
		$scope.tillDate = formatted_cur_date;

		$('#aptFromDate').val($scope.fromDate);
		$('#aptTillDate').val($scope.tillDate);	

		$scope.arrayAppointmnetReport = [];	
		/*adminApi.getAppointmentAnalysisReport(weekly_date_before,current_date).
		success(function (data, status, headers, config) {
			//alert("getAppointmentAnalysisReport");
			var arrStoreTrue = [];
			var arrStoreTrue = data.payload;

			console.log("successfully received appointment analysis request.");
			arrStoreTrue.forEach(function(item) {
				
				item.healyos_receipt_number = item.healyos_receipt_number;
				$scope.arrayAppointmnetReport.push(item);
			});
			
			
			$scope.initGrigOptionsAppointmentAnalysis(formatted_weekly_date_before,formatted_cur_date);
			$scope.gridOptions1.data = $scope.arrayAppointmnetReport;


		}).
		error(function (data, status, headers, config) {
			console.log("Error in receiving appointment analysis request.");
		});

	*/

		$scope.arraycancellationReport = [];	
	/*	adminApi.getCancellationReport(weekly_date_before,current_date).
		success(function (data, status, headers, config) {
			var arrStoreTrue = [];
			var arrStoreTrue = data.payload;

			console.log("successfully received cancellation report request.");
			arrStoreTrue.forEach(function(item) {
				
				//item.healyos_receipt_number = item.healyos_receipt_number;
				item.cancelledApptDate = moment(new Date(item.cancelledApptDate * 1000)).format("DD-MM-YYYY hh:mm A");
				item.cancelledRequestDate = moment(new Date(item.cancelledRequestDate * 1000)).format("DD-MM-YYYY hh:mm A");
				$scope.arraycancellationReport.push(item);
			});
			
			
			$scope.initGrigOptionsCancellation(formatted_weekly_date_before,formatted_cur_date);
			$scope.gridOptionsCancellationReport.data = $scope.arraycancellationReport;

		}).
		error(function (data, status, headers, config) {
			console.log("Error in receiving cancellation report request.");
		});

	*/
		$scope.arrayNewPatientConversionReport = [];	
		/*adminApi.getNewPatientConversionReport(weekly_date_before,current_date).
		success(function (data, status, headers, config) {
			//alert("getNewPatientConversionReport");
			var arrStoreTrue = [];
			var arrStoreTrue = data.payload;

			console.log("successfully received new patient conversion report request.");
			arrStoreTrue.forEach(function(item) {
				
				//item.healyos_receipt_number = item.healyos_receipt_number;
				item.bookingDateOfFirstAppt = moment(new Date(item.bookingDateOfFirstAppt * 1000)).format("DD-MM-YYYY hh:mm A");
				item.dateOfFirstAppt = moment(new Date(item.dateOfFirstAppt * 1000)).format("DD-MM-YYYY hh:mm A");
				$scope.arrayNewPatientConversionReport.push(item);
			});
			
			
			$scope.initGrigOptionsNewPatientConversion(formatted_weekly_date_before,formatted_cur_date);
			$scope.gridOptionsNewPatientConversion.data = $scope.arrayNewPatientConversionReport;

		}).
		error(function (data, status, headers, config) {
			console.log("Error in receiving cancellation report request.");
		});*/

		$scope.arrayAttendenceReport = [];
	}


	$scope.initGrigOptionsAppointmentAnalysis = function(fromdate,tilldate) {
		//alert("initGrigOptionsAppointmentAnalysis");
		var from_date=fromdate;
		var till_date=tilldate;

		//alert(from_date);
		//alert(till_date);

	    $scope.gridOptions1 = {
		    columnDefs: [		     
		      { field: 'physioLocation' },
		      { field: 'physioName' },
		      { field: 'noOfCompletedAppointments',name:'Completed Appointments'},
		      { field: 'totalNoOfPatientSeen' ,name:'Total Patient Seen'},
		      { field: 'noOfContinuingPatientseen',name:'Continuing Patient Seen' },
		      { field: 'noOfNewPatientseen', name: 'New Patient Seen' },
		      { field: 'averageVisitPatient', name: 'Average Patients' },
		    ],
		    enableGridMenu: true,
		    enableSelectAll: true,
		    exporterCsvFilename: 'AppointmentAnalysis_Report.csv',
		    exporterPdfDefaultStyle: {fontSize: 9},
		    exporterPdfTableStyle: {margin: [ 0, 0, 0, 0 ]},
		    exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},
		    exporterPdfHeader: { text: "Appointment Analysis Report", style: 'headerStyle' },
		    exporterPdfFooter: function ( currentPage, pageCount ) {
		      return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
		    },
		    exporterPdfCustomFormatter: function ( docDefinition ) {
		      docDefinition.styles.headerStyle = { fontSize: 22, bold: true, alignment: 'center' };
		      docDefinition.styles.footerStyle = { fontSize: 10, bold: true, alignment: 'right' };
		      return docDefinition;
		    },
		    exporterPdfOrientation: 'landscape',
		    exporterPdfPageSize: 'LETTER',
		    exporterPdfMaxGridWidth: 600,
		    exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
		    onRegisterApi: function(gridApi){
		      $scope.gridApi = gridApi;
		    }
	  	};

  	}


  	$scope.initGrigOptionsCancellation = function(fromdate,tilldate) {
		var from_date=fromdate;
		var till_date=tilldate;

		//alert(from_date);
		//alert(till_date);

	    $scope.gridOptionsCancellationReport = {
		    columnDefs: [
		      { field: 'patientName',width:'15%' },
		      { field: 'physioName',width:'15%' },
		      { field: 'cancelledRequestDate',name:'Date of Cancelled Request',width:'15%' },
		      { field: 'cancelledApptDate',name:'Date Of Cancelled Appointment',width:'15%' },
		      { field: 'reasonOfCancellation',name:'Reason For Cancellation',width:'20%' }, 
		      { field: 'requestedBy',name:'Requested By',width:'10%' }, 
		      { field: 'currentPackageName',name:'Current Package',width:'15%' },         
		      { field: 'noOfCancellationInCurPkg',name:'Cancellations In Current Package',width:'10%' },
		      { field: 'freeCancellationRemainCurPkg',name:'Free Cancellations Remain',width:'10%' },		      
		      { field: 'cancellationFeeDeducted',width:'10%' },
		      { field: 'totalCancellation',width:'10%' },		      
		    ],

		    enableGridMenu: true,
		    enableSelectAll: true,
		    exporterCsvFilename: 'Cancellation_Report.csv',
		    exporterPdfDefaultStyle: {fontSize: 9},
		    exporterPdfTableStyle: {margin: [ 0, 0, 0, 0 ]},
		    exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},
		    exporterPdfHeader: { text: "Appointment Cancellation Report", style: 'headerStyle' },
		    exporterPdfFooter: function ( currentPage, pageCount ) {
		      return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
		    },
		    exporterPdfCustomFormatter: function ( docDefinition ) {
		      docDefinition.styles.headerStyle = { fontSize: 22, bold: true, alignment: 'center' };
		      docDefinition.styles.footerStyle = { fontSize: 10, bold: true, alignment: 'right' };
		      return docDefinition;
		    },
		    exporterPdfOrientation: 'landscape',
		    exporterPdfPageSize: 'LETTER',
		    exporterPdfMaxGridWidth: 600,
		    exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
		    onRegisterApi: function(gridApi){
		      $scope.gridApi = gridApi;
		    }
	  	};

  	}

  	$scope.initGrigOptionsNewPatientConversion = function(fromdate,tilldate) {
		//alert("initGrigOptionsNewPatientConversion");
		var from_date=fromdate;
		var till_date=tilldate;

		//alert(from_date);
		//alert(till_date);

	    $scope.gridOptionsNewPatientConversion = {
		    columnDefs: [
		      { field: 'city',width:'10%',pinnedLeft: true},
		      { field: 'patientName',width:'18%',pinnedLeft: true},
		      { field: 'treatingPhysioName',width:'20%',pinnedLeft: true},
		      { field: 'patientSource',width:'15%' },
		      { field: 'bookingDateOfFirstAppt',width:'15%'},
		      { field: 'dateOfFirstAppt',width:'15%'},
		      { field: 'statusOfFirstAppt',width:'15%'},
		      { field: 'physioOfFirstAppt',width:'18%'},
		      { field: 'totalCompleted',width:'13%'},
		      { field: 'totalCancelled',width:'13%'},
		      { field: 'totalComfirmed', name:'Total Confirmed',width:'13%'},
		      { field: 'packageTaken',width:'20%'},
		      

		    ],

		    enableGridMenu: true,
		    enableSelectAll: true,
		   // enableFiltering: true,
		    exporterCsvFilename: 'NewPatientConversion_Report.csv',
		    exporterPdfDefaultStyle: {fontSize: 9},
		    exporterPdfTableStyle: {margin: [ 0, 0, 0, 0 ]},
		    exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},
		    exporterPdfHeader: { text: "New Patient Conversion Report", style: 'headerStyle' },
		    exporterPdfFooter: function ( currentPage, pageCount ) {
		      return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
		    },
		    exporterPdfCustomFormatter: function ( docDefinition ) {
		      docDefinition.styles.headerStyle = { fontSize: 22, bold: true, alignment: 'center' };
		      docDefinition.styles.footerStyle = { fontSize: 10, bold: true, alignment: 'right' };
		      return docDefinition;
		    },
		    exporterPdfOrientation: 'landscape',
		    exporterPdfPageSize: 'LETTER',
		    exporterPdfMaxGridWidth: 600,
		    exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
		    onRegisterApi: function(gridApi){
		      $scope.gridApi = gridApi;
		    }
	  	};

  	}


  	$scope.initGridAttendence = function(fromdate,tilldate) {
		//alert("initGrigOptionsNewPatientConversion");
		var from_date=fromdate;
		var till_date=tilldate;

		//alert(from_date);
		//alert(till_date);

	    $scope.gridOptionsAttendence = {
		    columnDefs: [

		      { field: 'physioName',width:'18%'},
		      { field: 'physioLocation',width:'15%' },
		      { field: 'noOfDaysOff',width:'15%',name:'Days Off'},
		      { field: 'noOfWorkingSlotsForHome',width:'15%',name:'Working Slots'},
		     // { field: 'noOfWorkingSlotsForClinic',width:'15%'},
		      { field: 'noOfCompletedAppts',width:'15%',name:'Completed Appts.'},
		      { field: 'noOfConfirmedAppts',width:'15%',name:'Confirmed Appts.'},
		      { field: 'noOfCancelledAppts',width:'15%',name:'Cancelled Appts.'},

		    ],

		    enableGridMenu: true,
		    enableSelectAll: true,
		   // enableFiltering: true,
		    exporterCsvFilename: 'Attendence_Report.csv',
		    exporterPdfDefaultStyle: {fontSize: 9},
		    exporterPdfTableStyle: {margin: [ 0, 0, 0, 0 ]},
		    exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},
		    exporterPdfHeader: { text: "New Patient Conversion Report", style: 'headerStyle' },
		    exporterPdfFooter: function ( currentPage, pageCount ) {
		      return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
		    },
		    exporterPdfCustomFormatter: function ( docDefinition ) {
		      docDefinition.styles.headerStyle = { fontSize: 22, bold: true, alignment: 'center' };
		      docDefinition.styles.footerStyle = { fontSize: 10, bold: true, alignment: 'right' };
		      return docDefinition;
		    },
		    exporterPdfOrientation: 'landscape',
		    exporterPdfPageSize: 'LETTER',
		    exporterPdfMaxGridWidth: 600,
		    exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
		    onRegisterApi: function(gridApi){
		      $scope.gridApi = gridApi;
		    }
	  	};

  	}



	$scope.generateReportAppointmentAnalysis = function() {		
		//alert("generateReportAppointmentAnalysis");
		$scope.arrayAppointmnetReport = [];
		var fromDt = getEpochDate($('#aptFromDate').val());
		var tillDt = getEpochDate($('#aptTillDate').val());
	  	var from_date = moment(new Date(fromDt * 1000)).format("DD-MM-YYYY hh:mm A");
		var to_date = moment(new Date(tillDt * 1000)).format("DD-MM-YYYY hh:mm A");

    	var date1 = new Date(fromDt * 1000);
    	var date2 = new Date(tillDt * 1000);
    	var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds    
    	var diffDays = Math.round(Math.abs((date1.getTime() - date2.getTime())/(oneDay)));

    	$scope.validDateRange = true;
		$scope.dateValid = true;

    	if(date1.getTime() > date2.getTime()){
    		$scope.dateValid = false;
    	}

    	if(diffDays <= 31){
    		
			$scope.arrayAppointmnetReport = [];

		    adminApi.getAppointmentAnalysisReport(fromDt,tillDt).
			success(function (data, status, headers, config) {
				var arrStoreTrue = [];
				var arrStoreTrue = data.payload;

				console.log("successfully received collected request.");
				arrStoreTrue.forEach(function(item) {
	
					$scope.arrayAppointmnetReport.push(item);
				});
		
				$scope.initGrigOptionsAppointmentAnalysis(from_date,to_date);
				$scope.gridOptions1.data = $scope.arrayAppointmnetReport;

			}).
			error(function (data, status, headers, config) {
				console.log("Error in receiving appointment analysis report request.");
			});
		}else{
	
			$scope.validDateRange = false;
		}
			
    };


    $scope.generateReportCancellation = function() {

    	//alert("Hiiii");
    	$scope.arraycancellationReport = [];
		var fromDt = getEpochDate($('#aptFromDate').val());
		var tillDt = getEpochDate($('#aptTillDate').val());
	  	var from_date = moment(new Date(fromDt * 1000)).format("DD-MM-YYYY hh:mm A");
		var to_date = moment(new Date(tillDt * 1000)).format("DD-MM-YYYY hh:mm A");

    	var date1 = new Date(fromDt * 1000);
    	var date2 = new Date(tillDt * 1000);
    	var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds    
    	var diffDays = Math.round(Math.abs((date1.getTime() - date2.getTime())/(oneDay)));

    	$scope.validDateRange = true;
		$scope.dateValid = true;

    	if(date1.getTime() > date2.getTime()){
    		$scope.dateValid = false;
    	}

    	if(diffDays <= 31){
    		
			$scope.arraycancellationReport = [];

		    adminApi.getCancellationReport(fromDt,tillDt).
			success(function (data, status, headers, config) {
				var arrStoreTrue = [];
				var arrStoreTrue = data.payload;

				console.log("successfully received collected request.");
				arrStoreTrue.forEach(function(item) {
	
					item.cancelledApptDate = moment(new Date(item.cancelledApptDate * 1000)).format("DD-MM-YYYY hh:mm A");
					item.cancelledRequestDate = moment(new Date(item.cancelledRequestDate * 1000)).format("DD-MM-YYYY hh:mm A");
					$scope.arraycancellationReport.push(item);
				});
		
				$scope.initGrigOptionsCancellation(from_date,to_date);
				$scope.gridOptionsCancellationReport.data = $scope.arraycancellationReport;

			}).
			error(function (data, status, headers, config) {
				console.log("Error in receiving cancellation report request.");
			});
		}else{
	
			$scope.validDateRange = false;
		}
			
    };


    $scope.generateNewPatientConversion = function() {		
		//alert("generateNewPatientConversion");
		$scope.arrayNewPatientConversionReport = [];
		var fromDt = getEpochDate($('#aptFromDate').val());
		var tillDt = getEpochDate($('#aptTillDate').val());
	  	var from_date = moment(new Date(fromDt * 1000)).format("DD-MM-YYYY hh:mm A");
		var to_date = moment(new Date(tillDt * 1000)).format("DD-MM-YYYY hh:mm A");

    	var date1 = new Date(fromDt * 1000);
    	var date2 = new Date(tillDt * 1000);
    	var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds    
    	var diffDays = Math.round(Math.abs((date1.getTime() - date2.getTime())/(oneDay)));

    	$scope.validDateRange = true;
		$scope.dateValid = true;

    	if(date1.getTime() > date2.getTime()){
    		$scope.dateValid = false;
    	}

    	if(diffDays <= 31){
    		
			$scope.arrayNewPatientConversionReport = [];

		    adminApi.getNewPatientConversionReport(fromDt,tillDt).
			success(function (data, status, headers, config) {
				var arrStoreTrue = [];
				var arrStoreTrue = data.payload;

				console.log("successfully received collected request.");
				arrStoreTrue.forEach(function(item) {
	
					item.bookingDateOfFirstAppt = moment(new Date(item.bookingDateOfFirstAppt * 1000)).format("DD-MM-YYYY hh:mm A");
					item.dateOfFirstAppt = moment(new Date(item.dateOfFirstAppt * 1000)).format("DD-MM-YYYY hh:mm A");
					$scope.arrayNewPatientConversionReport.push(item);
				});
		
				$scope.initGrigOptionsNewPatientConversion(from_date,to_date);
				$scope.gridOptionsNewPatientConversion.data = $scope.arrayNewPatientConversionReport;

			}).
			error(function (data, status, headers, config) {
				console.log("Error in receiving new patient conversion report request.");
			});
		}else{
	
			$scope.validDateRange = false;
		}
			
    };


    $scope.generateAttendence = function() {		
		//alert("generateNewPatientConversion");
		//alert("Hi");
		$scope.arrayAttendenceReport = [];
		var fromDt = getEpochDate($('#aptFromDate').val());
		var tillDt = getEpochDate($('#aptTillDate').val());
	  	var from_date = moment(new Date(fromDt * 1000)).format("DD-MM-YYYY hh:mm A");
		var to_date = moment(new Date(tillDt * 1000)).format("DD-MM-YYYY hh:mm A");

    	var date1 = new Date(fromDt * 1000);
    	var date2 = new Date(tillDt * 1000);
    	var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds    
    	var diffDays = Math.round(Math.abs((date1.getTime() - date2.getTime())/(oneDay)));

    	$scope.validDateRange = true;
		$scope.dateValid = true;

    	if(date1.getTime() > date2.getTime()){
    		$scope.dateValid = false;
    	}

    	if(diffDays <= 31){
    		
			$scope.arrayAttendenceReport = [];

		    adminApi.getAttendenceReport(fromDt,tillDt).
			success(function (data, status, headers, config) {
				var arrStoreTrue = [];
				var arrStoreTrue = data.payload;

				console.log("successfully received collected request.");
				arrStoreTrue.forEach(function(item) {
	
					item.bookingDateOfFirstAppt = moment(new Date(item.bookingDateOfFirstAppt * 1000)).format("DD-MM-YYYY hh:mm A");
					item.dateOfFirstAppt = moment(new Date(item.dateOfFirstAppt * 1000)).format("DD-MM-YYYY hh:mm A");
					$scope.arrayAttendenceReport.push(item);
				});
		
				$scope.initGridAttendence(from_date,to_date);
				$scope.gridOptionsAttendence.data = $scope.arrayAttendenceReport;

			}).
			error(function (data, status, headers, config) {
				console.log("Error in receiving attendence report request.");
			});
		}else{
	
			$scope.validDateRange = false;
		}
			
    };


    $scope.setMonthDateRange = function() {
    	var monthNo;
    	if($scope.monthName != undefined){

    		if($scope.monthName == "January"){
    			monthNo = 0;
    		}else if($scope.monthName == "February"){
    			monthNo = 1;
    		}else if($scope.monthName == "March"){
    			monthNo = 2;
    		}else if($scope.monthName == "April"){
    			monthNo = 3;
    		}else if($scope.monthName == "May"){
    			monthNo = 4;
    		}else if($scope.monthName == "June"){
    			monthNo = 5;
    		}else if($scope.monthName == "July"){
    			monthNo = 6;
    		}else if($scope.monthName == "August"){
    			monthNo = 7;
    		}else if($scope.monthName == "September"){
    			monthNo = 8;
    		}else if($scope.monthName == "October"){
    			monthNo = 9;
    		}else if($scope.monthName == "November"){
    			monthNo = 10;
    		}else if($scope.monthName == "December"){
    			monthNo = 11;
    		}

    		var date = new Date();
    		var firstDay = new Date(date.getFullYear(), monthNo, 1);
    		var lastDay = new Date(date.getFullYear(), monthNo + 1, 0);

    		var firstDate = firstDay.getTime()/1000;
    		var lastDate = lastDay.getTime()/1000;

    		var from = moment(new Date(firstDate * 1000)).format("YYYY-MM-DD hh:mm A");
			var to = moment(new Date(lastDate * 1000)).format("YYYY-MM-DD 11:59") + " PM";
			
			if(from != "Invalid" && to != "Invalid"){
				$scope.fromDate = from; 
				$scope.tillDate = to;
				$('#aptFromDate').val($scope.fromDate);
				$('#aptTillDate').val($scope.tillDate);	
			}
		         
    	}

    }

    $scope.setWeekDateRange = function() {
    	//alert($scope.weekName);

    	var weekstr = $scope.weekName.split(' ');
    	var subweekstr = weekstr[0].split('-');
    	var weekNo = parseInt(subweekstr[1]);

    	var beginningOfWeek = moment().week(weekNo).startOf('isoweek');
		var endOfWeek = moment().week(weekNo).startOf('week').add(7, 'days');

		//alert(beginningOfWeek);

		var weekFrom = beginningOfWeek.format('YYYY-MM-DD hh:mm A');
		var weekTo =  endOfWeek.format('YYYY-MM-DD 11:59')+ " PM";;
		
		if(weekFrom != "Invalid" && weekTo != "Invalid"){
			$scope.fromDate = weekFrom; 
			$scope.tillDate = weekTo;
			$('#aptFromDate').val($scope.fromDate);
			$('#aptTillDate').val($scope.tillDate);	
		} 

    }

    $scope.resetWeek = function() {    	
    	$scope.periodWeek="";
    	$scope.periodMonth="month";
    	$scope.periodYesterday="";
    	$('#aptFromDate').val('');
		$('#aptTillDate').val('');	
    }


    $scope.resetMonth = function() {    	
    	$scope.periodMonth="";
    	$scope.periodWeek="week";
    	$scope.periodYesterday="";
    	$('#aptFromDate').val('');
		$('#aptTillDate').val('');	

    }

    $scope.resetYesterday = function() {
    	
    	$scope.periodYesterday="yesterday";
    	$scope.periodMonth="";
    	$scope.periodWeek="";

    	var today = new Date();
        var dayBeforeYesterday = new Date(today);
        dayBeforeYesterday.setDate(today.getDate() - 2);
     
        dayBeforeYesterdate = moment(dayBeforeYesterday).format("YYYY-MM-DD 11:59") + " PM";
        todaysDate = moment(today).format("YYYY-MM-DD 12:01") + " AM";
        //alert(dayBeforeYesterdate);
        //alert(todaysDate);

		if(dayBeforeYesterdate != "Invalid" && todaysDate != "Invalid"){
			$scope.fromDate = dayBeforeYesterdate; 
			$scope.tillDate = todaysDate;
			$('#aptFromDate').val($scope.fromDate);
			$('#aptTillDate').val($scope.tillDate);	
		}

      
    }

    $scope.initGrigOptionsAppointmentAnalysis($scope.from_date,$scope.till_date);
    $scope.initGrigOptionsCancellation($scope.from_date,$scope.till_date);
    $scope.initGrigOptionsNewPatientConversion($scope.from_date,$scope.till_date);
    $scope.initGridAttendence($scope.from_date,$scope.till_date);

    $scope.weekArray = [];
    for(var i = 1 ; i < 53 ; i++){
    	var beginningOfWeek = moment().week(i).startOf('isoweek');
		var endOfWeek = moment().week(i).startOf('week').add(7, 'days');
		var weekStr = "W-"+i +" ("+beginningOfWeek.format('DD MMM YYYY')+" to "+endOfWeek.format('DD MMM YYYY') + ")"
		$scope.weekArray.push(weekStr)
    }
	  


});