
angular.module('myApp.controllers')
.controller('AdminCtrl', function($scope, $http, $cookies, ngDialog, $rootScope, adminApi, $timeout, $location, $interval){
	$scope.users = [];
	$scope.callMeform = {};
	$scope.patientDetailsForAdmin = {};
	$scope.isEditAptMode = false;
	$scope.actionableAppt = { mode : "listing" };
	$scope.currentOpenView = "Listing";
	$scope.obj = {custid: "", dt: new Date(), followupSpid : ""};
	$scope.spNewAppointment = {};
	$scope.spNewAppointment.check = false;
	$scope.spNewAppointmentForm = {};
	$scope.spNewAppointment.aptstarttime = "";
	$scope.spNewAppointment.selectedTimeSlots = [];
	$scope.editAptEmptyApptMonth = false;
	$scope.editAptModel = {};
	$scope.editAptModel.zone = "";
	$scope.apptPayment = {};
	$scope.apptPayment.paymentForm = "";
	$scope.arrPromoCode = [];
	$scope.arrayClinic = [];
	$scope.clinicAction = {};
	$scope.clinicAction.password = "";
	$scope.promoStoreObj = {};
	$scope.promocodeResponse = {
		promocodeValid: '',
		promocodeErrorMessage: ''
	};
	$scope.adminNewAppointmentCust.selectSp = true;

	$scope.clinicArrList =[];
        $scope.clinicArrList.push({
			        _id : 0,
			        clinic_name : 'Home'
			    });
        $scope.adminNewAppointmentCust.serviceLocation = $scope.clinicArrList[0]._id;


	$scope.aptPayment = {		
		currency : "INR",
		type : "Wallet",
		sptype : "Wallet",
		amnt : "0",
		additionalSpAmnt : "",
		paymentModes: [],
		appointmentid : "",
		promocodeid: "",
		promocode: "",
		discount: "",
		finalcost: "",
		additionalSpAmntDesc:"",
	};

	
			
	$scope.cityMgmt = {};

	$scope.cancelActionableCount = 0;
	$scope.calculatedAptAmount = "";
	$scope.aptSlotCount = 0;
    $scope.aptSlotFlag = false;
	$scope.custPackageTotalAppt = 0;
	$scope.spRequestType = {
		1 : "Cancel",
		2 : "Reschedule"
	};
	$scope.currencies = ["INR"];
	$scope.paymentModes = ["Cash", "Cheque" , "Instamojo", "Paytm", "NEFT"];
	$scope.customerServiceLocationArr = ["At Home"];
	$scope.clinicBasePriceVal = 0;
	$scope.serviceLocation = "";
	$scope.serviceLocationLabel = "";
	$scope.paymentModesSp = ["Wallet"];
	$scope.appointmentCriteria = {
		fromDate : "",
		fromEpoch : "",
		tillDate : "",
		tillEpoch : "",
		zone : "",
		zoneId : "",
		service : "",
		serviceId : "",
		custemail : "",
		custid : "",
		custph : "",
		spemail : "",
		spname : "",
		spid : ""
	};
	$scope.show = {"documentRO" : true};
	$scope.acRefresh = false;
	var cache = {};
	$scope.aptSrcCriteria = "";
	$scope.adminInfoBarForm = {};
	$scope.adminEmail = "";
	$scope.adminName = "";
	$scope.listOfMoveToOptions = ['Yet To Call', 'Scheduled', 'Call Me Back', 'Do Not Disturb', 'Enquiry', 'Junk'];
	$scope.buttonClicked = "";
	$scope.showModal = false;
	$scope.callMeform1 = {};
	$scope.callMeBack = {};
	$scope.callMeBack.appointmentTime = "";
	
	$scope.form = {};
	$scope.patient = {};
	$scope.custZones = "";
	$scope.custPinLocalities = [];
	$scope.locationArr = [];
	$scope.cityBasedSps =[];
	$scope.arrayLocalities = [];
	$scope.customerLocality = '';
	$scope.adminNewAppointmentCust.zone = "";
	//$scope.adminNewAppointmentCust.selectSp = false;

	$scope.RequestedBy = ['Physio','Customer','Patient Transfer','Appointment Swap'];

	$scope.sorting = {
		by : "appointment.approvalDetails.requestedOn",
		reverse : false
	}
	var availableDate = [];
	var editAvailableDate = [];
	$scope.service;
	$scope.rootApptId;
	$scope.fetched.Appointment = false;
	$scope.costPaid = "0";
	$scope.appointmentCityId;
	$scope.spNamesArr = [];
	$scope.spManagementSelectedTab = "Add Edit Service Provider";
	$scope.spGender = [
		{ id:"male",  name:"Male"},
		{ id:"female",  name:"Female"}
	];

	$scope.addNewSpForm = {};
	$scope.spDetails = {};
	$scope.addSpWrkHrsForm = {};
	$scope.slotViewTableFlag = true;
	$scope.monthList = ["January", "February" , "March" , "April" , "May" , "June" , "July" , "August" ,"September" ,"October" , "November" , "December" ];
	$scope.weekDays = ["Select weekly off","Sunday" , "Monday" , "Tuesday" , "Wednesday" , "Thursday" , "Friday" , "Saturday"]

	$scope.spPrimaryZonesOptions = [];
	$scope.spPrimaryZones = [];
	$scope.customFilter1 = "";
	$scope.spPrimaryZonesSettings = {
		enableSearch: true,
		displayProp: 'zonename',
		idProp: 'zoneid'
	};

	
	$scope.markLeave = false;

	for(var i = 1 ; i<= 31 ; i++){
		for(var j= 1 ; j <= 8 ; j ++){
			var v = 'subTick'+j+i;
		    $scope[v] = false;
		}
		
	}


	$scope.slotChecked = false;
	$scope.saveBtn = true;
	$scope.locationArray = [];

	$scope.prbmName = "";
	$scope.prbmContact = "";
	$scope.prbmEmail = "";
	$scope.prbmAge = "";
	$scope.prbmProblem = "";
	$scope.prbmGender = "";
	$scope.prbmProblem = "";
	$scope.prbmCallback = false;
	$scope.prbmSatisfied = 'NA'; 

	$scope.eventObj1 = {
		onItemSelect: function(item) {
			$scope.populateSecondaryZones(item, "onItemSelect");
			$timeout(function(){
				$scope.populateDisplaySpPrimaryZones(item, "onItemSelect");
			}, 200);
		},
		onItemDeselect: function(item) {
			$scope.populateSecondaryZones(item, "onItemDeselect");
			$timeout(function(){
				$scope.populateDisplaySpPrimaryZones(item, "onItemDeselect");
			}, 200);
		},
		onSelectAll: function() {
			$scope.populateSecondaryZones(undefined, "onSelectAll");
			$timeout(function(){
				$scope.populateDisplaySpPrimaryZones(undefined, "onSelectAll");
			}, 200);
		},
		onDeselectAll: function() {
			$scope.populateSecondaryZones(undefined, "onDeselectAll");
			$timeout(function(){
				$scope.populateDisplaySpPrimaryZones(undefined, "onDeselectAll");
			}, 200);
		}
	};

	$scope.eventObj2 = {
		onItemSelect: function(item) {
			$scope.populatePrimaryZones(item, "onItemSelect");
			$timeout(function(){
				$scope.populateDisplaySpSecondaryZones(item, "onItemSelect");
			}, 200);
		},
		onItemDeselect: function(item) {
			$scope.populatePrimaryZones(item, "onItemDeselect");
			$timeout(function(){
				$scope.populateDisplaySpSecondaryZones(item, "onItemDeselect");
			}, 200);
		},
		onSelectAll: function() {
			$scope.populatePrimaryZones(undefined, "onSelectAll");
			$timeout(function(){
				$scope.populateDisplaySpSecondaryZones(undefined, "onSelectAll");
			}, 200);
		},
		onDeselectAll: function() {
			$scope.populatePrimaryZones(undefined, "onDeselectAll");
			$timeout(function(){
				$scope.populateDisplaySpSecondaryZones(undefined, "onDeselectAll");
			}, 200);
		}
	};

	$scope.spSecondaryZonesOptions = [];
	$scope.spSecondaryZones = [];
	$scope.customFilter2 = "";
	$scope.spSecondaryZonesSettings = {
		enableSearch: true,
		displayProp: 'zonename',
		idProp: 'zoneid'
	};

	$scope.selectedLocation = {
		"zoneid": "",
		"zonename": "",
		"pin": "",
		"localities": "",
		"val": ""
	};

	$scope.displaySpPrimaryZones = [];
	$scope.displaySpSecondaryZones = [];
	$scope.cityName = "Pune";
	$scope.SpWrkHrs = {};
	$scope.wrkHrSlots = {
		slot: []
	};

	$scope.markSpLeavesForm = {};
	var arrayDates = [];
	var arrayRemoveDates = [];
	var existingWorkTimeSlots = [];
	$scope.wrkHrsAllSlots = [
		{
			"selected": false,
			"label": 	"07:30 - 09:00",
			"selectZoneIds": [],
			"selectClinicIds": [],
			"disabled": false,
		},
		{
			"selected": false,
			"label": 	"09:00 - 10:30",
			"selectZoneIds": [],
			"selectClinicIds": [],
			"disabled": false,
		},
		{
			"selected": false,
			"label": 	"10:30 - 12:00",
			"selectZoneIds": [],
			"selectClinicIds": [],
			"disabled": false,
		},
		{
			"selected": false,
			"label": 	"12:00 - 13:30",
			"selectZoneIds": [],
			"selectClinicIds": [],
			"disabled": false,
		},
		{
			"selected": false,
			"label": 	"15:00 - 16:30",
			"selectZoneIds": [],
			"selectClinicIds": [],
			"disabled": false,
		},
		{
			"selected": false,
			"label": 	"16:30 - 18:00",
			"selectZoneIds": [],
			"selectClinicIds": [],
			"disabled": false,
		},
		{
			"selected": false,
			"label": 	"18:00 - 19:30",
			"selectZoneIds": [],
			"selectClinicIds": [],
			"disabled": false,
		},
		{
			"selected": false,
			"label": 	"19:30 - 21:00",
			"selectZoneIds": [],
			"selectClinicIds": [],
			"disabled": false,
		}
	];

	$scope.SpLeaves = {};
	var arrayLeaveDates = [];
	$scope.spLeaveAllSlots = [
		{
			"selected": false,
			"label": 	"07:30 - 09:00"
		},
		{
			"selected": false,
			"label": 	"09:00 - 10:30"
		},
		{
			"selected": false,
			"label": 	"10:30 - 12:00"
		},
		{
			"selected": false,
			"label": 	"12:00 - 13:30"
		},
		{
			"selected": false,
			"label": 	"15:00 - 16:30"
		},
		{
			"selected": false,
			"label": 	"16:30 - 18:00"
		},
		{
			"selected": false,
			"label": 	"18:00 - 19:30"
		},
		{
			"selected": false,
			"label": 	"19:30 - 21:00"
		}
	];

	$scope.spLeaveIsPaid = [
		{
			"id": "yes",
			"value": "YES"
		},
		{
			"id": "no",
			"value": "NO"
		}
	];
	$scope.empTypeArr = [
		{
			"id": "full_time",
			"val": "FULL TIME"
		},
		{
			"id": "part_time",
			"val": "PART TIME"
		},
		{
			"id": "sancheti_student",
			"val": "SANCHETI STUDENT"
		}
	];

	$scope.dateErrorFlag = false;
	$scope.wrkHrErrorSlot = false;
	$scope.leaveDateErrorFlag = false;
	$scope.leaveErrorSlot = false;

	$scope.promoSuccess = false;
	$scope.promoError = false;
	$scope.applyPromoResponse = {};

	$scope.promoSuccessFollowUp = false;
	$scope.promoErrorFollowUp = false;
	$scope.applyPromoResponseFollowUp = {};

	$scope.promoSuccessEditAppt = false;
	$scope.promoErrorEditAppt = false;
	$scope.applyPromoResponseEditAppt = {};

	$scope.applyPromoResponsePaymentSection = {};
	$scope.promoSuccessPaymentSection = false;
	$scope.promoErrorPaymentSection = false;

	$scope.zoneManagementSelectedTab = "Add New Zone";
	$scope.zoneMgmtForm = {};
	$scope.zoneDetails = {};

	$scope.zoneCountry = [
		{
			id: "",
			name: ""
		}
	];

	$scope.zoneState = [
		{
			id: "",
			name: ""
		}
	];

	$scope.zoneCity = [
		{
			id: "",
			name: ""
		}
	];


	$scope.clinicCountry = [
		{
			id: "",
			name: ""
		}
	];

	$scope.clinicState = [
		{
			id: "",
			name: ""
		}
	];

	$scope.clinicCity = [
		{
			id: "",
			name: ""
		}
	];

	$scope.clinicZone = [
		{
			id: "",
			name: ""
		}
	];

	$scope.manageSp = {};
	$scope.arrSpRecords = [];
	$scope.manageSp.showSpForm = false;
	$scope.manageSp.addNewSp = false;
	$scope.manageSp.updateSp = false;
	$scope.selectZoneIdsArr = [];


	$scope.getAllLocations = function (callback) {
		callback($scope.locationArr);
	};

	$scope.locationSelected = function (location) {
		$scope.locationInfo = location.val + " (" + location.pin + ")";
		$scope.locationDetails = location;
		$scope.adminNewAppointmentCust.pincode = location.pin;
		$scope.adminNewAppointmentCust.pincodeid = location.pincodeid;
		$scope.adminNewAppointmentCust.zone = location.zonename;
		$scope.adminNewAppointmentCust.locality = location.localities;
	}

	$scope.editAptLocationSelected = function (location) {
		$scope.locationInfo = location.val + " (" + location.pin + ")";
		$scope.locationDetails = location;
		$scope.editAptModel.pincode = location.pin;
		$scope.editAptModel.pincodeid = location.pincodeid;
		$scope.adminNewAppointmentCust.locality = location.localities;
		$scope.editAptModel.locality = location.localities;

		$scope.getEditMonthlyAppointmentAvailability($scope.editAptModel.pincodeid, $scope.editAptModel.zoneid, $scope.editAptModel.service);
		$scope.getSpInfo($scope.editAptModel.zoneid, $scope.editAptModel.service, $scope.editAptModel.pincodeid);
	}

	$scope.sort = function(keyname){
		$scope.sortKey = keyname;   //set the sortKey to the param passed
		$scope.reverse = !$scope.reverse; //if true make it false and vice versa
	}

	$scope.sort2 = function(keyname){
		$scope.sorting.by = keyname;   //set the sortBy to the param passed
		$scope.sorting.reverse = !$scope.sorting.reverse; //if true make it false and vice versa
	}

	$scope.initAdminInfo = function() {
		if(($cookies.get('u_email') != undefined)) {
			$scope.adminEmail = $cookies.get('u_email');
		} else {
		}
		
	   if(($cookies.get('u_name') != undefined)) {
			$scope.adminName = $cookies.get('u_name');
		} else {
		}
	}

	$timeout(function(){
		$('.dateTimePicker').datetimepicker({
			format: 'YYYY-MM-DD hh:mm A'
		});
		$('.datetimepicker2').datetimepicker({
			format: 'YYYY-MM-DD'
		});
		$('#datetimepicker4').datetimepicker({
			format: 'YYYY-MM-DD'
		});
		$('#datetimepicker5').datetimepicker({
			format: 'YYYY-MM-DD'
		});
		/*$('.dateTimePickerSlot').datetimepicker({
			format: 'YYYY-MMM-DD'
		});*/
		$('.dateTimePickerOnlyMonth').datetimepicker({			
			format: 'MMMM',
            viewMode: 'months', 
             // pickTime: false,
   			
		});
	}, 200);

	$scope.adminCallMeListReset = function() {
		$scope.patientDetailsForAdmin.fromDate = "";
		$scope.patientDetailsForAdmin.tillDate = "";

		$scope.callMeform.patientDetailsForm.$setPristine();
		$scope.callMeform.patientDetailsForm.$setUntouched();
	}

	$scope.initCallMeAdminList = function() {
		$scope.custZones = "";
		$scope.custPinLocalities = [];
		$scope.locationArr = [];
		$scope.arrayLocalities = [];
		$scope.callMeList = "";
		$scope.errorMsg = "";
		$scope.patientDetailsForAdmin.moveTo = "";

		var dateObj = new Date();
		var yrObj = dateObj.getFullYear();
		var monthObj = dateObj.getMonth() + 1; //Since January is 0

		if(monthObj.toString().length == 1) {
			monthObj = "0" + monthObj.toString();
		}

		var dayObj = dateObj.getDate();
		if(dayObj.toString().length == 1) {
			dayObj = "0" + dayObj.toString();
		}

		var curDate = yrObj.toString() + monthObj.toString() + dayObj.toString();
		var tempCurDate = yrObj.toString() + "-" + monthObj.toString() + "-" + dayObj.toString();

		$scope.patientDetailsForAdmin.fromDate = tempCurDate;
		$scope.patientDetailsForAdmin.tillDate = tempCurDate;

		adminApi.callMeList(curDate, curDate)
		.success(function(data, status, headers, config) {
			if(data.error == undefined) {
				var arrCallMeList = [];
				var myJsonString = JSON.stringify(data);
				var obj = JSON.parse(myJsonString);
				if(obj.payload != undefined) {
					for(var i = 0; i < obj.payload.length; i++) {
						 var data = {
							"callmebacktm": obj.payload[i].callmebacktm,
							"contactno": obj.payload[i].contactno,
							"createdOn": obj.payload[i].createdOn,
							"custname": obj.payload[i].custname,
							"customercity": obj.payload[i].customercity,
							"customeremail": obj.payload[i].customeremail,
							"id": obj.payload[i].id,
							"refno": obj.payload[i].refno,
							"type": obj.payload[i].type,
							"boolVal": false,
							"status" : angular.copy(obj.payload[i].type).split("_").join(" "),
							"sdate" : moment(new Date(obj.payload[i].callmebacktm * 1000)).format("YYYY-MM-DD hh:mm A")
						 };
						 arrCallMeList.push(data);
					}
					$scope.callMeList = arrCallMeList;
					$scope.sortKey = 'callmebacktm';
					$scope.reverse = true;
				} else {
					$scope.callMeList = "";
				}
				$scope.errorMsg = "";
			}
		})
		.error(function(data, status, headers, config) {
			$scope.callMeList = "";
			$scope.errorMsg = data.error.message;
			$scope.checkSessionTimeout(data);
		});
	}

	$scope.callMeAdminList = function() {
		$scope.patientDetailsForAdmin.moveTo = '';

		var fromDt = $('#datetimepicker4').val();
		var tillDt = $('#datetimepicker5').val();

		if(fromDt == "" && tillDt == "") {
			$scope.errorMsg = "Please enter valid \"From Date\" and \"To Date\"";
		} else if(fromDt == "" && tillDt != "") {
			$scope.errorMsg = "Please enter valid \"From Date\"";
		} else if(fromDt != "" && tillDt == "") {
			$scope.errorMsg = "Please enter valid \"To Date\"";
		} else {
			fromDt = fromDt.split('-').join('');
			tillDt = tillDt.split('-').join('');

			if($scope.allPendingCallsClicked) {
				fromDt = "";
				tillDt = "";
			}

			adminApi.callMeList(fromDt, tillDt)
			.success(function(data, status, headers, config) {
				if(data.error == undefined) {
					var arrCallMeList = [];
					var myJsonString = JSON.stringify(data);
					var obj = JSON.parse(myJsonString);
					if(obj.payload != undefined) {
						for(var i = 0; i < obj.payload.length; i++) {
							 var data = {
								"callmebacktm": obj.payload[i].callmebacktm,
								"contactno": obj.payload[i].contactno,
								"createdOn": obj.payload[i].createdOn,
								"custname": obj.payload[i].custname,
								"customercity": obj.payload[i].customercity,
								"customeremail": obj.payload[i].customeremail,
								"id": obj.payload[i].id,
								"refno": obj.payload[i].refno,
								"type": obj.payload[i].type,
								"boolVal": false,
								"status" : angular.copy(obj.payload[i].type).split("_").join(" "),
								"sdate" : moment(new Date(obj.payload[i].callmebacktm * 1000)).format("YYYY-MM-DD hh:mm A")
							 };
							 arrCallMeList.push(data);
						}
						$scope.callMeList = angular.copy(arrCallMeList);
						$scope.sortKey = 'callmebacktm';
						$scope.reverse = true;
					} else {
						$scope.callMeList = "";
					}
					$scope.errorMsg = "";
				}
			})
			.error(function(data, status, headers, config) {
				$scope.callMeList = "";
				$scope.errorMsg = data.error.message;
				$scope.checkSessionTimeout(data);
			});
		}
	}

	$scope.openPlain = function () {
		$scope.callMeBack.appointmentTime = "";
		ngDialog.openConfirm({
			template: 'firstDialogId',
			scope: $scope //Pass the scope object if you need to access in the template
		}).then(
			function(value) {
				var appTime = $('#datetimepicker6').val();

				if(appTime == undefined || appTime == "") {
					ngDialog.open({ template: '<div style = "color: red" class="ngdialog-message"> Please select a time.</div>',
									plain: 'true'
					});
					$scope.callMeList = "";
					$scope.errorMsg = "";
					$scope.callMeAdminList();
				} else {
					$scope.ngDialogErrorMsg = "";
					var myDate = new Date(appTime); // Your timezone!
					var myEpoch = myDate.getTime()/1000.0;

					var currentTime = new Date();
					var currentEpochTime = currentTime.getTime()/1000.0;

					if(myEpoch <= currentEpochTime) {
						ngDialog.open({ template: '<div style = "color: red" class="ngdialog-message"> Please select a valid call me back time.</div>',
										plain: 'true'
						});
						$scope.callMeList = "";
						$scope.errorMsg = "";
						$scope.callMeAdminList();
					} else {
						var typeObj = "call_me_back";

						var dataObj = {
							"callmeids": $rootScope.callMeBackRecords,
							"type": typeObj,
							"callmetime": myEpoch
						};

						var sidObj = $cookies.get('u_sid');
						var apiKeyObj = $cookies.get('u_apikey');

						var urlCallMe = "/healyos-pdt/hrest/v1/admin/callme?apikey=" + apiKeyObj + "&sid=" + sidObj;
						var resultCallMe = $http.put(urlCallMe, dataObj);

						resultCallMe.success(function(data, status, headers, config) {
							$scope.callMeList = "";
							$scope.errorMsg = "";
							$scope.callMeAdminList();
						});

						resultCallMe.error(function(data, status, headers, config) {
							$scope.errorMsg = data.error.message;
							$scope.patientDetailsForAdmin.moveTo = "";
							$scope.checkSessionTimeout(data);
						});
					}
				}
			},
			function(value) {
				ngDialog.open({template: '<div style = "color: red" class="ngdialog-message"> Status unchanged.</div>',
					plain: 'true'
				});
				$scope.callMeAdminList();
			}
		);
	};

	$scope.callMeSelected = function(patientRecord) {
		$scope.selectedCallMeRecord = patientRecord;
	}

	$scope.moveToRecords = function(arrRecords) {
		$scope.errorMsg = "";

		if(arrRecords == undefined) {
			$scope.errorMsg = "Please first select a record to \"Change Status To\" a particular type.";
			$scope.patientDetailsForAdmin.moveTo = '';
		} else {
			var arrValidRec = [];
			if($scope.selectedCallMeRecord != undefined && $scope.selectedCallMeRecord.hasOwnProperty("id")) {
				arrValidRec.push($scope.selectedCallMeRecord.id);
			}

			if(arrValidRec.length == 0) {
				$scope.errorMsg = "Please first select a record to \"Change Status To\" a particular type.";
				$scope.patientDetailsForAdmin.moveTo = '';
			} else {
				var typeObj = "";

				if($scope.patientDetailsForAdmin.moveTo == "Yet To Call") {
					typeObj = "yet_to_call";
				} else if($scope.patientDetailsForAdmin.moveTo == "Scheduled") {
					typeObj = "scheduled";
				} else if($scope.patientDetailsForAdmin.moveTo == "Call Me Back") {
					typeObj = "call_me_back";
				} else if($scope.patientDetailsForAdmin.moveTo == "Do Not Disturb") {
					typeObj = "do_not_disturb";
				} else if($scope.patientDetailsForAdmin.moveTo == "Enquiry") {
					typeObj = "enquiry";
				} else if($scope.patientDetailsForAdmin.moveTo == "Junk") {
					typeObj = "junk";
				}

				if(typeObj == "call_me_back") {
					$rootScope.callMeBackRecords = angular.copy(arrValidRec);
					$scope.openPlain();
				} else if(typeObj == "yet_to_call" || typeObj == "scheduled" || typeObj == "do_not_disturb" || typeObj == "enquiry" || typeObj == "junk") {
					var dataObj = {
						"callmeids": arrValidRec,
						"type": typeObj
					};

					var sidObj = $cookies.get('u_sid');
					var apiKeyObj = $cookies.get('u_apikey');

					var url = "/healyos-pdt/hrest/v1/admin/callme?apikey=" + apiKeyObj + "&sid=" + sidObj;
					var result = $http.put(url, dataObj);

					result.success(function(data, status, headers, config) {
						$scope.selectedCallMeRecord = undefined;
						$scope.callMeList = "";
						$scope.errorMsg = "";
						$scope.callMeAdminList();
					});

					result.error(function(data, status, headers, config) {
						$scope.patientDetailsForAdmin.moveTo = "";
						if(data.error.message != undefined) {
							$scope.errorMsg = data.error.message;
						}
						$scope.checkSessionTimeout(data);
					});
				}
			}
		}
	}

	$scope.custdetailsForAdmin = function(patientUuid, patientRefNo, patientName, patientCity, patientContactNo, patientEmail) {
		var sidObj = $cookies.get('u_sid');
		var apiKeyObj = $cookies.get('u_apikey');

		var url = "/healyos-pdt/hrest/v1/zone/cities?apikey=" + apiKeyObj + "&sid=" + sidObj +"&countrynm=India";
		var result = $http.get(url);
		var city = [];
		var city1 = [];

		result.success(function(data, status, headers, config) {
			myJsonString = JSON.stringify(data);
			obj = JSON.parse(myJsonString);
			for(var i = 0; i < obj.payload.states.length; i++) {
				 result1 =  obj.payload.states[i];
				 for(var j = 0; j < result1.cities.length; j++){
					 city1.push(result1.cities[j]);
					 city.push(result1.cities[j].name);
				 }
			}

			var custCityId = "";
			for(var j = 0; j < city1.length; j++){
				if(city1[j].name == patientCity) {
					$scope.users1.city = city1[j].id;
					custCityId = city1[j].id;
					break;
				}
			}

			var dataObj = {
				"refno": patientRefNo,
				"custname": patientName,
				"customercity": patientCity,
				"contactno": patientContactNo,
				"customeremail": patientEmail,
				"id":custCityId,
				"uuid": patientUuid
			};
			$scope.custPin(custCityId);
			$scope.$root.$broadcast("custDetailsForAdmin", dataObj);
			handleSelectedAccordionStyling();
		});
		result.error(function(data, status, headers, config) {
			$scope.checkSessionTimeout(data);
		});
	}

	$scope.logoutAdmin = function() {
		$scope.$root.$broadcast("logOutAdmin", {});
	}

	$scope.mytime = new Date();
	$scope.mytime1 = new Date();
	$scope.hstep = 1;
	$scope.mstep = 15;

	$scope.options = {
		hstep: [1, 2, 3],
		mstep: [1, 5, 10, 15, 25, 30]
	};

	$scope.ismeridian = true;
	$scope.toggleMode = function() {
	$scope.ismeridian = ! $scope.ismeridian;
	};

	$scope.changed = function () {
	};

	$scope.clear = function() {
		$scope.mytime = null;
	};
	
	$scope.custRecordEnqMsg = false;

	$scope.aptRecordEnquiry = function() {
		$scope.custRecordEnqMsg = true;
		var dataObjRecordEnquiry ={
			"cityid": $scope.users1.city,
			"name": $scope.users1.name,
			"contact": $scope.users1.contactNo,
			"email": $scope.users1.email,
			"pincode": $scope.adminNewAppointmentCust.pincode,
			"zoneid": $scope.adminNewAppointmentCust.zone,
			"callmeitemid": $scope.users1.uuid
		}

		$scope.enquiry = {Comments : ""};

		ngDialog.openConfirm({
			template: 'newAptComments',
			showClose: false,
			scope: $scope //Pass the scope object if you need to access in the template
		}).then(
			function(value) {
				dataObjRecordEnquiry.comments = $scope.enquiry.Comments;
				adminApi.createAptRecordEnquiry(dataObjRecordEnquiry)
				.success(function(data, status, headers, config) {
					$scope.clscolor = "green";
					$scope.custRecordEnqMsg1 = "Thank you for Recording Enquiry. Your reference number is " + data.payload.refno;
				})
				.error(function(data, status, headers, config) {
					$scope.clscolor = "red";
					$scope.custRecordEnqMsg1 = "error response: " + data.error.message;
					$scope.checkSessionTimeout(data);
				});
			},
			function(value) {
				console.log("Fail " + $scope.enquiry.Comments );
			}
		);
	}
	
	$scope.frm = {};
	
	$scope.divAptAddress = false;
	$scope.residenceAddressFlag = true;
	
	$('#checkboxAddress').click(function() {
		if( $(this).is(':checked')) {
			$scope.divAptAddress = false;
			$scope.adminNewAppointmentCust.check = true;
			$scope.residenceAddressFlag = true;
		} else {
			$scope.divAptAddress = true;
			$scope.adminNewAppointmentCust.check = false;
			$scope.residenceAddressFlag = false;
		}
	}); 
	
	$scope.aptSubmit = function() {
		var google_conversion_id = "";
        var google_conversion_language = "";
        var google_conversion_format = "";
        var google_conversion_color = "";
        var google_conversion_label = "";
        var google_conversion_value = "";
        var google_conversion_currency = "";
        var google_remarketing_only = "";
		
		$scope.aptSlotCount = 0;
        $scope.aptSlotFlag = false;
        $scope.custPackageTotalAppt = 0;

		var dateInst = $scope.obj.dt;
		var year = dateInst.getFullYear();
		var month = dateInst.getMonth();
		var day = dateInst.getDate();

		var aptst = $scope.adminNewAppointmentCust.aptstarttime;
		var apth = aptst.substring(0,2);
		var aptm = aptst.substring(2,4);
		var fromdate = new Date(year, month, day);
		fromdate.setHours(apth);
		fromdate.setMinutes(aptm);
		var apptstarttime = moment(fromdate).format("YYYY-MM-DD hh:mm A");
		
		var custproblem;
		if($scope.adminNewAppointmentCust.Problem == null || $scope.adminNewAppointmentCust.Problem == 'undefined'){
			custproblem = "";
		} else if (typeof $scope.adminNewAppointmentCust.Problem != 'undefined'){
			custproblem = $scope.adminNewAppointmentCust.Problem;
		}else {
			custproblem = "";
		}
		
		var resAddress;
		if ($scope.adminNewAppointmentCust.appointmentAddress == null || $scope.adminNewAppointmentCust.appointmentAddress == 'undefined') {
			resAddress = "";
		} else if (typeof $scope.adminNewAppointmentCust.appointmentAddress != 'undefined') {
			resAddress = $scope.adminNewAppointmentCust.appointmentAddress;
		} else {
			resAddress = "";
		}

		var serviceLocation;
		if ($scope.adminNewAppointmentCust.serviceLocation == null || $scope.adminNewAppointmentCust.serviceLocation == 'undefined' || $scope.adminNewAppointmentCust.serviceLocation == 0) {
			serviceLocation = null;
		} else if (typeof $scope.adminNewAppointmentCust.serviceLocation != 'undefined') {
			serviceLocation = $scope.adminNewAppointmentCust.serviceLocation;
		} else {
			serviceLocation = null;
		}

		var clinicBasePriceVal;
		if($scope.clinicBasePriceVal != 0 && $scope.clinicBasePriceVal != undefined){
			clinicBasePriceVal = $scope.clinicBasePriceVal;
		}else{
			clinicBasePriceVal = 0;
		}

		/*var package_created_on;
		if($scope.package_created_on != 0 && $scope.package_created_on != undefined){
			package_created_on = $scope.package_created_on
		}else{
			package_created_on = 0;
		}*/
		
		var idObj = $cookies.get('u_id');

		var locality = $scope.getLocalityNameFromPincode($scope.adminNewAppointmentCust.pincode);
		var pincodeid = cache.pincodeToPincodeIdMap[$scope.adminNewAppointmentCust.pincode];
		
		var dataObjSubmitAptForm = {
			"customer": {
				"cityid": $scope.users1.city,
				"name": $scope.users1.name,
				"phone": $scope.users1.contactNo,
				"email": $scope.users1.email,
				"pincode": pincodeid,
				"address": $scope.adminNewAppointmentCust.residenceAddress,
				"problem": custproblem,
				"gender": $scope.adminNewAppointmentCust.gender,
				"signMeUp": true,
				"no_of_sessions":0,
				"is_package_assign":false,
                "additional_amount":0,
        		"source": $scope.adminNewAppointmentCust.scource,
			},
			"apptslots": [apptstarttime],
			"adminid": idObj,
			"comments": $scope.adminNewAppointmentCust.comment,
			"zoneid": "",
			"serviceid": $scope.service,
			"address": $scope.adminNewAppointmentCust.residenceAddress, //resAddress, //Updation: Appointment address is set to residence address
			"usecustomeraddress": $scope.adminNewAppointmentCust.check,
			"locality": locality,
			"apptRootId": "",
			"promocode": $scope.applyPromoResponse.promocode,
            "additionalcharge": $scope.adminNewAppointmentCust.addcharges,
            "additionalchargedesc":$scope.adminNewAppointmentCust.addchargedesc,
            "clinic_id":serviceLocation,
            "clinicBasePrice":clinicBasePriceVal,
            "zoneBasePrice":$scope.zoneBasePrice
		}

		if($scope.users1.uuid != undefined && $scope.users1.uuid != "") {
			dataObjSubmitAptForm.callmeitemid = $scope.users1.uuid;
		}

		if($scope.spNewAppointment.spNames && $scope.spNewAppointment.spNames != "") {
			dataObjSubmitAptForm.spid = $scope.spNewAppointment.spNames;
		}
        if ($scope.adminNewAppointmentCust.addcharges == null || $scope.adminNewAppointmentCust.addcharges == undefined){
            console.log("setting additional charge 0");
            dataObjSubmitAptForm.additionalcharge = 0;
        }
		adminApi.createNewAppointment(dataObjSubmitAptForm)
		.success(function(data, status, headers, config) {
			var google_conversion_id = 845120495;
            var google_conversion_language = "en";
            var google_conversion_format = "3";
            var google_conversion_color = "ffffff";
            var google_conversion_label = "186DCO__snMQ74f-kgM";
            var google_conversion_value = 599.00;
            var google_conversion_currency = "INR";
            var google_remarketing_only = false;
			$scope.frm.submit = data.payload[0].refno;
			$scope.showNext('aptConfirmMsg');
		})
		.error(function(data, status, headers, config) {
			var google_conversion_id = "";
            var google_conversion_language = "";
            var google_conversion_format = "";
            var google_conversion_color = "";
            var google_conversion_label = "";
            var google_conversion_value = "";
            var google_conversion_currency = "";
            var google_remarketing_only = "";
			$('#errormsg').text("error response: " + data.error.message);
			$scope.checkSessionTimeout(data);
		});
	}

	$scope.initLocalities = function() {
		if(cache.hasOwnProperty("cityToIdMap")) {
			$scope.custPin(cache.cityToIdMap["Pune"]);
		} else {
			$timeout(function(){
				$scope.initLocalities();
			}, 200);
		}	    
	}
//changes from pincode to pincodeid
	$scope.getLocalityFromPincode = function(pincodeid) {
		if($scope.locationArr.length > 0 && pincodeid != undefined) {
			for(var i=0; i<$scope.locationArr.length; i++) {
				var location = $scope.locationArr[i];
				if(location.pincodeid == pincodeid) {
					$scope.customerLocality = location.localities;
					break;
				}
			}
		} else {
			$timeout(function() {
				$scope.getLocalityFromPincode(pincodeid);
			}, 100);
		}
	}
//changes from pincode to pincodeid
	$scope.getLocalityNameFromPincode = function(pincodeid) {
		if($scope.arrayLocalities.length > 0 && pincodeid != undefined) {
			for(var i=0; i< $scope.arrayLocalities.length; i++) {
				var location = $scope.arrayLocalities[i];
				if(location.pincodeid == pincodeid) {
					return location.localities;
				}
			}
		} else {
			$timeout(function() {
				$scope.getLocalityNameFromPincode(pincodeid);
			}, 100);
		}
	}

	$scope.getPendingApptCustList = function() {
		adminApi.getPendingApptCustList()
		.success(function(data, status, headers, config) {
			$scope.pendingApptCustList = [];
			$scope.pendingApptCustList = data.payload;
			//console.log($scope.pendingApptCustList);
		})
		.error(function(data, status, headers, config) {
			$scope.checkSessionTimeout(data);
		});
	}

	$scope.fncustSearch = function() {
		var items = $scope.custSearch;
		$scope.custSearchList = false;
		$scope.aptErrorMsg = false;

		console.log($scope.custSearch);

		adminApi.getCustSearch(items)
		.success(function(data, status, headers, config) {
			var custlist = [];
			myJsonString = JSON.stringify(data);
			var custSearchObj = JSON.parse(myJsonString);
			
			if (typeof data.payload[0] != 'undefined'){
				for(var i = 0; i < custSearchObj.payload.length; i++) {
					var result1 =  custSearchObj.payload[i];
					custlist.push(custSearchObj.payload[i]);
					
					if(result1.age == 0 && result1.birthdate == undefined){
						result1.age = "-"
						result1.birthdate = "-"
					}
				}

			$scope.custList = custlist;
			$scope.custSearchList = true;
			}else{
				$scope.custSearchList = false;
				$scope.aptErrorMsg = "No customer record found";
			}
		})
		.error(function(data, status, headers, config) {
			$scope.custSearchList = false;
			$scope.custErrorMsg = "Failed to fetch customers as part of init.";
			$scope.checkSessionTimeout(data);
		});
	}
	
	$scope.custReadListview = false;
	$scope.ratingFlag = true;
	$scope.fnFetchCust = function(cust) {
		$scope.aptSlotCount = 0;
        $scope.aptSlotFlag = false;
		$scope.custPackageTotalAppt = 0;
		$scope.apptClinicId = '';
		$scope.apptCityId = '';
		$scope.clinicBasePriceVal = 0;
		$scope.clinicArray = [];

		var custID = cust._id == undefined ? cust.custid : cust._id;
		$scope.obj.custid = custID;
		$scope.currentOpenView = "showCustomer";
		
		adminApi.getFetchCust(custID)
		.success(function(data, status, headers, config) {
			myJsonString = JSON.stringify(data);
			var fetchCustObj = JSON.parse(myJsonString);
			
			if (typeof data.payload.customer != 'undefined'){
				
				$scope.custReadList = data.payload.customer;
				if($scope.custReadList.age == 0 && $scope.custReadList.birthdate == undefined){
					$scope.custReadList.age = "-";
					$scope.custReadList.birthdate = "-";
				}
				$scope.getLocalityFromPincode($scope.custReadList.pincode);
				$scope.custReadListview = true;
				$scope.custReadList.custwallet.description='';
			}else{
				console.log("error");
			}
			var appointmentHistory = [];
			if(typeof data.payload.appointments[0] != 'undefined'){
				for(var i = 0; i < data.payload.appointments.length; i++) {
					data.payload.appointments[i].appointment.state = appointmentStateMap[data.payload.appointments[i].appointment.state];
					if(data.payload.appointments[i].appointment.amnt == 0){
						data.payload.appointments[i].appointment.amnt = "NA";
					}									
					
					if(data.payload.appointments[i].appointment.rating == 0){
						$scope.ratingFlag = false;
					}else{
						$scope.ratingFlag = true;
					}

					if(data.payload.appointments[i].appointment.package_id == data.payload.customer.package_id && data.payload.appointments[i].appointment.package_code == data.payload.customer.package_code && data.payload.appointments[i].appointment.current_session_no != "0"){
                        $scope.custPackageTotalAppt = data.payload.appointments[i].appointment.current_session_no;
                    }
					appointmentHistory.push(data.payload.appointments[i].appointment);

					if(data.payload.appointments[i].appointment.clinic_id != undefined){
				        $scope.apptClinicId = data.payload.appointments[i].appointment.clinic_id;
					}
					if(data.payload.appointments[i].appointment.clinic_id != undefined){
				        $scope.apptClinicId = data.payload.appointments[i].appointment.clinic_id;
					}

					if(data.payload.appointments[i].appointment.cityid != undefined){
				        $scope.apptCityId = data.payload.appointments[i].appointment.cityid;
					}
				}

	 			//api to fetch clinic data of given city:kalyani patil.
	           if($scope.apptCityId != undefined){

	           		var cityid = $scope.apptCityId;
	           		adminApi.getClinics(cityid)
				     .success(function(data, status, headers, config) {
						$scope.clinicArray = data.payload;

						//assign clinic base price by using its Id. 
						if($scope.apptClinicId != undefined || $scope.apptClinicId != ''){
			              
			                for(var i = 0;i < $scope.clinicArray.length; i++){
			                	if($scope.clinicArray[i]._id == $scope.apptClinicId){
			                		$scope.clinicBasePriceVal = $scope.clinicArray[i].clinic_base_price;
			                	}
			                }
			            }
					
					})
					.error(function(data, status, headers, config) {
						$scope.checkSessionTimeout(data);
					});
		      	}   


			} else {
				console.log("error");
			}
			$scope.custAptHistory = appointmentHistory;

			var curr_session;
            if(data.payload.customer.use_sessions){
                curr_session = parseFloat(data.payload.customer.use_sessions);
            }else{
                curr_session = 0;
            }
            
			if(curr_session >= data.payload.customer.no_of_sessions){
                $scope.custLeftPackageSeesion = 0
            }else{
                $scope.custLeftPackageSeesion = data.payload.customer.no_of_sessions - curr_session;
            }

		})
		.error(function(data, status, headers, config) {
			$scope.checkSessionTimeout(data);
		});
	}

	$scope.hideCustomerMode = function() {
		$scope.currentOpenView = "Listing";
	}

	$scope.hideFollowupAppt = function() {
		$scope.currentOpenView = "showCustomer";
	}

	$scope.spApptForCustSubmit = function() {
		var google_conversion_id = "";
        var google_conversion_language = "";
        var google_conversion_format = "";
        var google_conversion_color = "";
        var google_conversion_label = "";
        var google_conversion_value = "";
        var google_conversion_currency = "";
        var google_remarketing_only = "";

		$scope.aptSlotCount = 0;
        $scope.aptSlotFlag = false;

		var custproblem;
		if($scope.custProb == null || $scope.custProb == 'undefined'){
			custproblem = "";
		} else if (typeof $scope.custProb != 'undefined'){
			custproblem = $scope.custProb;
		}else {
			custproblem = "";
		}

		var resAddress;
		if($scope.custResAddr == null || $scope.custResAddr == 'undefined') {
			resAddress = "";
		} else if (typeof $scope.custResAddr != 'undefined'){
			resAddress = $scope.custResAddr;
		} else {
			resAddress = "";
		}

		var spCommentsForCust;
		if($scope.spNewAppointment.comment == null || $scope.spNewAppointment.comment == 'undefined') {
			spCommentsForCust = "";
		} else if (typeof $scope.spNewAppointment.comment != 'undefined') {
			spCommentsForCust = $scope.spNewAppointment.comment;
		} else {
			spCommentsForCust = "";
		}

		var package_code;
        if($scope.package_code == null || $scope.package_code == 'undefined' || $scope.package_code == "0"){
            package_code = null;
        }else{
            package_code = $scope.package_code;
        }

        var package_id;
        if($scope.package_id == null || $scope.package_id == 'undefined'){
            package_id = null;
        }else{
            package_id = $scope.package_id;
        }

        var no_of_sessions;
         if($scope.no_of_sessions == null || $scope.no_of_sessions == 'undefined'){
            no_of_sessions = "";
        }else{
            no_of_sessions = $scope.no_of_sessions;
        }

        var promocode;
        if($scope.applyPromoResponseFollowUp.promocode == null || $scope.applyPromoResponseFollowUp.promocode == "" || $scope.applyPromoResponseFollowUp.promocode == "0"){
            promocode = null;
        }else{
            promocode = $scope.applyPromoResponseFollowUp.promocode;
        }

        var additional_amount;
        if($scope.additional_amount < 0 || $scope.additional_amount == ""){
            $scope.additional_amount = 0;
        }else{
            $scope.additional_amount = $scope.additional_amount;
        }

        var use_sessions;
        if($scope.use_sessions <= 0 || $scope.use_sessions == ""){
            $scope.use_sessions = 0;
        }else{
            $scope.use_sessions = $scope.use_sessions;
        }

        var clinicPrice;
        if($scope.clinicBasePriceVal <= 0 || $scope.clinicBasePriceVal == undefined){
        	clinicPrice = 0;
        }else{
        	clinicPrice = $scope.clinicBasePriceVal;
        }

        var clinicId;
        if($scope.apptClinicId == undefined || $scope.apptClinicId == ''){
        	clinicId = null;
        }else{
        	clinicId = $scope.apptClinicId;
        }

        var package_created_on;
		if($scope.package_created_on != 0 && $scope.package_created_on != undefined){
			package_created_on = $scope.package_created_on
		}else{
			package_created_on = 0;
		}


		var approved_valid_days;
		if($scope.approved_valid_days != 0 && $scope.approved_valid_days != undefined){
			approved_valid_days = $scope.approved_valid_days
		}else{
			approved_valid_days = 0;
		}


		var idObj = $cookies.get('u_id');
		var dataObjSubmitAptForm = {
			"customer":{
				"cityid": $scope.custCityId, //
				"name": $scope.custName, //
				"phone": $scope.custPhone, //
				"email": $scope.custEmail, //
				"pincode": $scope.custPincode, //
				"address": resAddress, //
				"problem": custproblem, //
				"gender": $scope.custGender,
				"signMeUp": true,
				"no_of_sessions":no_of_sessions,
                "is_package_assign":$scope.is_package_assign,
                "additional_amount":$scope.additional_amount,
                "use_sessions":$scope.use_sessions,
                "package_created_on":package_created_on,
                "approved_valid_days":approved_valid_days
			},
			"apptslots": $scope.spNewAppointment.selectedTimeSlots,
			// "apptstarttime": apptstarttime,
			"adminid": idObj, //
			"comments": spCommentsForCust, //
			"zoneid": $scope.zoneId, //
			"serviceid": $scope.serviceIdInst, //
			"address": $scope.spNewAppointment.appointmentAddress, //
			"usecustomeraddress":$scope.spNewAppointment.check, //
			"locality": $scope.locality,
			"spid" : $scope.obj.followupSpid,
			"apptRootId": $scope.rootApptId,
			"promocode": promocode,
           // "additionalcharge":$scope.spNewAppointment.addcharges,
            "additionalcharge":$scope.additional_amount,
            "additionalchargedesc":$scope.spNewAppointment.addchargedesc,
            "package_code":package_code,
            "package_id":package_id,
            "patientid":$scope.patientid,
            "clinic_id":clinicId,
            "clinicBasePrice":clinicPrice,
            "zoneBasePrice":$scope.baseCost
		}

  		if ($scope.spNewAppointment.addcharges == null || $scope.spNewAppointment.addcharges == undefined){
            console.log("setting additional charge 0");
            dataObjSubmitAptForm.additionalcharge = 0;
        }
		adminApi.createNewAppointment(dataObjSubmitAptForm)
		.success(function(data, status, headers, config) {
			// $scope.frm.submit = data.payload.refno;
			var refnos = [];
			for(var i=0; i<data.payload.length; i++) {
				refnos.push(data.payload[i].refno);
			}
			if(refnos.length == 1) {
				var google_conversion_id = 845120495;
                var google_conversion_language = "en";
                var google_conversion_format = "3";
                var google_conversion_color = "ffffff";
                var google_conversion_label = "186DCO__snMQ74f-kgM";
                var google_conversion_value = 599.00;
                var google_conversion_currency = "INR";
                var google_remarketing_only = false;
				$scope.frm.submit = "Thank you for confirming appointment. Appointment reference number is " + refnos[0];
			} else {
				var google_conversion_id = 845120495;
                var google_conversion_language = "en";
                var google_conversion_format = "3";
                var google_conversion_color = "ffffff";
                var google_conversion_label = "186DCO__snMQ74f-kgM";
                var google_conversion_value = 599.00;
                var google_conversion_currency = "INR";
                var google_remarketing_only = false;
				$scope.frm.submit = "Thank you for confirming appointments. Appointment reference numbers are " + refnos.join(", ");
			}
			$scope.spNewApptForCustErrorMsg = "";
			$scope.showDatepicker = false;
			$scope.showAddressComments = false;
		})
		.error(function(data, status, headers, config) {
			var google_conversion_id = "";
            var google_conversion_language = "";
            var google_conversion_format = "";
            var google_conversion_color = "";
            var google_conversion_label = "";
            var google_conversion_value = "";
            var google_conversion_currency = "";
            var google_remarketing_only = "";
			// $scope.showDatepicker = false;
			// $scope.showAddressComments = false;
			$scope.spNewApptForCustErrorMsg = data.error.message;
			$scope.checkSessionTimeout(data);
		});
	}

	$scope.getSpMonthlyAppointmentAvailability = function() {

		//alert('sp'+$scope.apptClinicId);
       
		var pincode = null;
		var zoneid = null;
		if($scope.custReadList) {
			pincode = $scope.custReadList.pincode;
			zoneid = $scope.custReadList.zoneid;
		} else if($scope.adminNewAppointmentCust) {
			pincode = $scope.adminNewAppointmentCust.pincodeid;
			zoneid = $scope.adminNewAppointmentCust.zone;
		} else {
			console.log("Could not find pincode and zoneid in getSpMonthlyAppointmentAvailability()");
			return;
		}
		var serviceId = null;
		if($scope.serviceIdInst) {
			serviceId = $scope.serviceIdInst;
		} else if(cache && cache.servicesMap) {
			serviceId = cache.servicesMap["physiotherapy"];
		}

		var arrDateInst =  $("#datetimepicker3").find("[id^='datepicker'].btn-default").text().split(' '); // November 2015
		var monthObj = "";
		if (arrDateInst[0] == "January") {
			monthObj = "01";
		} else if(arrDateInst[0] == "February") {
			monthObj = "02";
		} else if(arrDateInst[0] == "March") {
			monthObj = "03";
		} else if(arrDateInst[0] == "April") {
			monthObj = "04";
		} else if(arrDateInst[0] == "May") {
			monthObj = "05";
		} else if(arrDateInst[0] == "June") {
			monthObj = "06";
		} else if(arrDateInst[0] == "July") {
			monthObj = "07";
		} else if(arrDateInst[0] == "August") {
			monthObj = "08";
		} else if(arrDateInst[0] == "September") {
			monthObj = "09";
		} else if(arrDateInst[0] == "October") {
			monthObj = "10";
		} else if(arrDateInst[0] == "November") {
			monthObj = "11";
		} else if(arrDateInst[0] == "December") {
			monthObj = "12";
		}

		var yyyymmDate = arrDateInst[1] + monthObj;
		var tDate = new Date();
		var tYear = tDate.getFullYear();
		var tMonth = tDate.getMonth() + 1;

		if((arrDateInst[1] == tYear && parseInt(monthObj) >= tMonth) || (arrDateInst[1] > tYear)) {
			var sidInst = $cookies.get('u_sid');
			var apiKeyInst = $cookies.get('u_apikey');
			var roleInst = $cookies.get('u_type');

            if($scope.apptClinicId == '' || $scope.apptClinicId == undefined || $scope.apptClinicId == 0){
				var url = "/healyos-pdt/hrest/v1/appt/calmon/" + yyyymmDate + "?apikey=" + apiKeyInst + "&sid=" + sidInst + "&role=" + roleInst + "&pincode=" + pincode + "&zoneid=" + zoneid + "&serviceid=" + serviceId + "&spid=" + $scope.obj.followupSpid; //b24abc5e-ac43-86d4-5a83-aa1807fde79b";
			}else{
				var url = "/healyos-pdt/hrest/v1/appt/calmon/" + yyyymmDate + "?apikey=" + apiKeyInst + "&sid=" + sidInst + "&role=" + roleInst + "&clinic_id=" + $scope.apptClinicId + "&serviceid=" + serviceId + "&spid=" + $scope.obj.followupSpid;
			}

			var result = $http.get(url);

			// Resetting the appt starttime model to disable time slot selection
			$scope.spNewAppointment.aptstarttime = "";

			result.success(function(data, status, headers, config) {
				if(data.error == undefined) {
					var jsonStringObj = JSON.stringify(data);
					var spMonthlyAppointmentAvailabilityObj = JSON.parse(jsonStringObj);
					var arrDates = [];
					var tempDates = data.payload.dates;
					for(i = 0 ; i < tempDates.length ; i++) {
						var txtDate = tempDates[i] + "";
						var year = txtDate.substring(0,4);
						var month = txtDate.substring(4,6);

						var tempMonth = parseInt(month, 10);
						tempMonth = tempMonth - 1;

						month = tempMonth + "";
						var lenMonth = month.length;
						if(lenMonth != 2 && lenMonth == 1) {
						  month = "0" + month;
						}

						var day = txtDate.substring(6,8);
						arrDates.push(year + "-" + month + "-" + day);
					}
					availableDate = arrDates;

					if($scope.boolFlag == true) {
						$scope.obj.dt = new Date();
						$scope.boolFlag = false;
					} else {
						var dayObj = "";
						var lenDay = 0;
						var temp = new Date();
						if(monthObj == (temp.getMonth() + 1) && arrDateInst[1] == temp.getFullYear()) {
							dayObj = temp.getDate() + "";
							lenDay = dayObj.length;
							if(lenDay != 2 && lenDay == 1) {
							  dayObj = "0" + dayObj;
							}
						} else {
							dayObj = "01";
						}
						var valMonth = (parseInt(monthObj) - 1);
						var valDay = parseInt(dayObj);
						var valYear = arrDateInst[1];
						$scope.obj.dt = new Date(valYear, valMonth, valDay);
					}
					$scope.spNewApptForCustErrorMsg = "";
				}
			});

			result.error(function(data, status, headers, config) {
				$scope.spNewApptForCustErrorMsg = data.error.message;
				$scope.scrollDiv('spNewApptForCustErrorMsg');
				$scope.checkSessionTimeout(data);
			});
		}
	}

	function callGetSpMonthlyAppointmentAvailability() {
		$scope.getSpMonthlyAppointmentAvailability();
	}

	$scope.custFollowupAppt = function() {

		$scope.rootApptId = "";
		$scope.currentOpenView = "followupAppt";
		$scope.obj.custid = "";
		$timeout(function() {
			$("#datetimepicker3").find("[id^='datepicker'].btn-default").attr("disabled", true);
			$("#datetimepicker3").find("[id^='datepicker'].btn-default").css({"color": "#333"});
			$(".btn.btn-default.btn-sm.pull-left").on( "click", function() {
				console.log( "left button click--->" + $( this ).text() );
				$scope.spInfo = false;
				$timeout(callGetSpMonthlyAppointmentAvailability, 100);
			});
			$(".btn.btn-default.btn-sm.pull-right").on( "click", function() {
				console.log( "right button click--->" + $( this ).text() );
				$scope.spInfo = false;
				callGetSpMonthlyAppointmentAvailability();
			});
		}, 500);
		$scope.boolFlag = true;
		$scope.clear();

		var sidInst = $cookies.get('u_sid');
		var apiKeyInst = $cookies.get('u_apikey');
		var roleInst = $cookies.get('u_type');
		var serviceId = "";
		var index = $scope.custAptHistory.length - 1;
		var spid = $scope.custAptHistory[index].spid;
		$scope.obj.followupSpid = spid;

		if (($scope.custAptHistory[index].apptRootId != "") && ($scope.custAptHistory[index].apptRootId != undefined) && ($scope.custAptHistory[index].apptRootId != null) && ($scope.custAptHistory[index].apptRootId.length > 0)) {
			$scope.rootApptId = $scope.custAptHistory[index].apptRootId;
		} else {
			$scope.rootApptId = $scope.custAptHistory[index]._id;
		}

		var url = "/healyos-pdt/hrest/v1/appt/" + $scope.custAptHistory[index]._id + "?apikey=" + apiKeyInst + "&sid=" + sidInst + "&role=" + roleInst;
		var result = $http.get(url);

		result.success(function(data, status, headers, config) {
			if(data.error == undefined) {
				var jsonStringObj = JSON.stringify(data);
				var spNewApptForCustObj = JSON.parse(jsonStringObj);
				var locality = $scope.getLocalityNameFromPincode(data.payload.appointment.pincode); // to get updated pincode from appoinment object

				adminApi.getCustomerDetails($scope.custAptHistory[index].custid)
        .success(function(data, status, headers, config){
        			if(data.payload.customer.package_created_on && data.payload.customer.approved_valid_days){
                var packageCreatedOn = data.payload.customer.package_created_on;
                var approvedValidDays = data.payload.customer.approved_valid_days;

                var packageCreatedOnDate = moment(new Date(packageCreatedOn * 1000)).format("YYYY-MM-DD hh:mm A");                

                //var result = new Date(packageCreatedOn);
                //var date = result.setDate(result.getDate() + parseInt(5));
                var myDate = new Date(new Date(packageCreatedOnDate).getTime()+(parseInt(approvedValidDays)*24*60*60*1000));
                var validTill = moment(myDate).format("YYYY-MM-DD");

                $scope.packageValidTillDate = validTill; 
                
            }
        		});

				$scope.obj.custid = $scope.custAptHistory[index].custid;
				$scope.spNewAppointment.aptstarttime = "";
				$scope.spInfo = false;
				$scope.frm.submit = false;
				$scope.currentOpenView = 'NEW_APPOINTMENT';
				$scope.showDatepicker = true;
				$scope.showAddressComments = true;
				$scope.spNewAppointment.appointmentAddress = data.payload.appointment.address;
				$scope.spNewAppointment.comment = data.payload.appointment.comments;
				$scope.spNewAppointment.selectedTimeSlots = [];
				$scope.serviceIdInst = data.payload.appointment.serviceid;
				$scope.custProb = data.payload.customer.problem;
				$scope.custResAddr = data.payload.customer.address;
				$scope.custPincode = data.payload.appointment.pincode; // to get updated pincode from appoinment object
				$scope.custEmail = data.payload.customer.email;
				$scope.custPhone = data.payload.customer.phone;
				$scope.custName = data.payload.customer.name;
				$scope.custCityId = $scope.custReadList.cityid;
				$scope.custGender = data.payload.customer.gender;
				$scope.zoneId = data.payload.appointment.zoneid;
				$scope.locality = locality;
				$scope.appointmentCityId = data.payload.appointment.cityid;
				$scope.original_costFollowUp = data.payload.appointment.cost;
				$scope.costFollowUp = data.payload.appointment.cost;
				$scope.baseCost = data.payload.appointment.cost;
				$scope.currFollowUp = data.payload.appointment.currency;
                if (data.payload.appointment.additionalcharge != null && data.payload.appointment.additionalcharge != undefined){
                $scope.spNewAppointment.addcharges = data.payload.appointment.additionalcharge;
                $scope.spNewAppointment.addchargedesc = data.payload.appointment.additionalchargedesc;
                    }
                else{
                     $scope.spNewAppointment.addcharges = 0;
                     $scope.spNewAppointment.addchargedesc="";
                }
				$timeout(function() {
					$scope.custReadList.pincode = $scope.custPincode;
					$scope.custReadList.zoneid = $scope.zoneId;
					$scope.serviceIdInst = $scope.serviceIdInst;
					$scope.getSpMonthlyAppointmentAvailability();
				}, 200);


                $scope.package_code = data.payload.customer.package_code;
                $scope.package_id = data.payload.customer.package_id;
                $scope.no_of_sessions = data.payload.customer.no_of_sessions;
                $scope.package_created_on = data.payload.customer.package_created_on;
                $scope.approved_valid_days = data.payload.customer.approved_valid_days;
                $scope.patientid = data.payload.appointment.patientid;
                temp_additional_amount = $scope.additional_amount;

                if(($scope.no_of_sessions+'.0' ==data.payload.customer.use_sessions) && data.payload.customer.is_package_assign==false){
                    temp_additional_amount = 0;
                }else{
                    temp_additional_amount = parseFloat(data.payload.customer.additional_amount);
                }

                if(temp_additional_amount){
                    $scope.additional_amount = temp_additional_amount;
                }else{
                    $scope.additional_amount = 0;
                }
                /*if(data.payload.customer.additional_amount){
                    $scope.additional_amount = parseFloat(data.payload.customer.additional_amount);
                }else{
                    $scope.additional_amount = 0;
                }*/
                   
                if(data.payload.customer.is_package_assign){
                    $scope.is_package_assign = data.payload.customer.is_package_assign;
                }else{
                    $scope.is_package_assign = false;
                }  

                if(data.payload.customer.use_sessions){
                    $scope.use_sessions = parseFloat(data.payload.customer.use_sessions);
                }else{
                    $scope.use_sessions = 0;
                }  
  
                $scope.discounted_costFollowUp = $scope.costFollowUp;
               //API to fetch discount of given package:kalyani patil
                if( $scope.package_id != null &&  $scope.package_id != undefined && $scope.is_package_assign == true){

	                adminApi.getCalculatePackageDiscount($scope.package_code,$scope.package_id, $scope.costFollowUp)
	                .success(function(data, status, headers, config){

	                        var jsonStringObj = JSON.stringify(data);
	                        var DiscountObj = JSON.parse(jsonStringObj);
	                        
	                        if(data.payload.discount != null && data.payload.discount != undefined){
	                            $scope.discount =  data.payload.discount;
	                        }

	                        if($scope.discount > 0 && $scope.discount != null){
	                             $scope.costFollowUp =  $scope.costFollowUp - $scope.discount;
	                             $scope.discounted_costFollowUp = $scope.costFollowUp;
	                         }

	                 })
	                .error(function(data, status, headers, config) {
	                        console.log("error msg" + data);
	                        $scope.calculateDiscount = data;
	                        $scope.checkSessionTimeout(data);
	                });

                }

				$scope.spNewApptForCustErrorMsg = "";
			}
		});

		result.error(function(data, status, headers, config) {
			$scope.rootApptId = "";
			$scope.spNewApptForCustErrorMsg = data.error.message;
			$scope.checkSessionTimeout(data);
		});
	}
	
	$scope.fnEditCust = function() {
		$scope.custReadListview = false;
		$scope.custEditListview = true;
		
		$scope.custEdit.name = $scope.custReadList.name;
		$scope.custEdit.phone = $scope.custReadList.phone;
		$scope.custEdit.email = $scope.custReadList.email;
		$scope.custEdit.residenceAddress = $scope.custReadList.address;
		
		if($scope.custReadList.birthdate == "-"){
			$scope.custEdit.dob = null;
		}else{
			$scope.custEdit.dob = $scope.custReadList.birthdate;
		}
		
		$scope.custEdit.altphno = $scope.custReadList.altphno;
	}
	
	var c = moment(new Date()).format('YYYY/MM/DD');
	
	$('#custdob').datetimepicker({
		format: 'YYYY-MM-DD',
		maxDate:c
	});
	
	$('#custdob').blur(function(){
		$scope.$apply(function() {
			$scope.custEdit.dob = $('#custdob').val();
		});
		$scope.fofo();
	});
	

	$scope.fofo = function() {
		var Disabled = true;
		
		try{
			if($scope.custEdit.name != $scope.custReadList.name)
				Disabled = false;
			if($scope.custEdit.phone != $scope.custReadList.phone)
				Disabled = false;
			if($scope.custEdit.altphno != $scope.custReadList.altphno)
				Disabled = false;
			if($scope.custEdit.email != $scope.custReadList.email)
				Disabled = false;
			if($scope.custEdit.residenceAddress != $scope.custReadList.address)
				Disabled = false;
			if($scope.custEdit.dob != null){
				if($scope.custEdit.dob != $scope.custReadList.birthdate)
				Disabled = false;
			}
		}catch(err){
			
		}
		return Disabled;
	}  
	
	$scope.fnEditCust1 = function() {
		
		var updateCustomerObj = {};
		
		if($scope.custEdit.name != $scope.custReadList.name){
			updateCustomerObj["name"] = $scope.custEdit.name;
		}
		if($scope.custEdit.phone != $scope.custReadList.phone){
			updateCustomerObj["phone"] = $scope.custEdit.phone;
		}
		if($scope.custEdit.email != $scope.custReadList.email){
			updateCustomerObj["email"] = $scope.custEdit.email;
		}
		if($scope.custEdit.residenceAddress != $scope.custReadList.address){
			updateCustomerObj["address"] = $scope.custEdit.residenceAddress;
		}

		if($scope.custEdit.dob != null && $scope.custEdit.dob != ""){
			if($scope.custEdit.dob != $scope.custReadList.birthdate){
				var dateText = $('#custdob').val();
				dateText = dateText.split('-').join('');
				year = dateText.substring(0,4);
				month = dateText.substring(4,6);
				month = parseInt(month)
				month = month - 1;
				day = dateText.substring(6,8);
				var fromdate = moment(new Date(year, month, day)).format('YYYYMMDD');
				updateCustomerObj["birthdate"] = fromdate;
			}
		}
		
		if($scope.custEdit.altphno != $scope.custReadList.altphno){
			updateCustomerObj["altphno"] = $scope.custEdit.altphno;
		}
	
		adminApi.updateCustomerDetails($scope.custReadList._id, updateCustomerObj)
		.success(function(data, status, headers, config) {
			$scope.custReadList = data.customer;
			
			$scope.custEditListview = false;
			$scope.custReadListview = true;
			
		})
		.error(function(data, status, headers, config) {
			$scope.checkSessionTimeout(data);
		});
	}
	
	$scope.today = function() {
		$scope.obj.dt = new Date();
	};
	$scope.today();

	$scope.clear = function () {
		$scope.obj.dt = null;
	};

	//API to get dates of given month:year have atleast one free slot for appointment.
	$scope.getMonthlyAppointmentAvailability = function(pincode, zoneid) {

		//alert('appt'+$scope.apptClinicId);
       
		var yyyymmDate = "";
		var arrDateInst = [];
		var monthObj = "";
		var yr = 0;

		arrDateInst = $(".btn.btn-default.btn-sm").eq(1).text().split(' '); // November 2015
		//console.log(arrDateInst);
		if (arrDateInst[0] == "January") {
			monthObj = "01";
		} else if(arrDateInst[0] == "February") {
			monthObj = "02";
		} else if(arrDateInst[0] == "March") {
			monthObj = "03";
		} else if(arrDateInst[0] == "April") {
			monthObj = "04";
		} else if(arrDateInst[0] == "May") {
			monthObj = "05";
		} else if(arrDateInst[0] == "June") {
			monthObj = "06";
		} else if(arrDateInst[0] == "July") {
			monthObj = "07";
		} else if(arrDateInst[0] == "August") {
			monthObj = "08";
		} else if(arrDateInst[0] == "September") {
			monthObj = "09";
		} else if(arrDateInst[0] == "October") {
			monthObj = "10";
		} else if(arrDateInst[0] == "November") {
			monthObj = "11";
		} else if(arrDateInst[0] == "December") {
			monthObj = "12";
		}

		yr = arrDateInst[1];
		yyyymmDate = arrDateInst[1] + monthObj;

		var tDate = new Date();
		var tYear = tDate.getFullYear();
		var tMonth = tDate.getMonth() + 1;

		if((yr == tYear && parseInt(monthObj) >= tMonth) || (yr > tYear)) {
			var sidInst = $cookies.get('u_sid');
			var apiKeyInst = $cookies.get('u_apikey');
			var roleInst = $cookies.get('u_type');

			if($scope.apptClinicId == 0 || $scope.apptClinicId == undefined || $scope.apptClinicId == ''){
				var url = "/healyos-pdt/hrest/v1/appt/calmon/" + yyyymmDate + "?apikey=" + apiKeyInst + "&sid=" + sidInst + "&role=" + roleInst + "&pincode=" + pincode + "&zoneid=" + zoneid + "&serviceid=" + $scope.service;
			}else{
				var url = "/healyos-pdt/hrest/v1/appt/calmon/" + yyyymmDate + "?apikey=" + apiKeyInst + "&sid=" + sidInst + "&role=" + roleInst + "&clinic_id=" + $scope.apptClinicId + "&serviceid=" + $scope.service;
			}
			

			if($scope.activeTab == "New Appointment") {
				if($scope.spNewAppointment.spNames != undefined && $scope.spNewAppointment.spNames != "") {
					url = url + "&spid=" + $scope.spNewAppointment.spNames;
				}
			}

			var result = $http.get(url);

			result.success(function(data, status, headers, config) {
				if(data.error == undefined) {
					jsonStringObj = JSON.stringify(data);
					var monthlyAppointmentAvailabilityObj = JSON.parse(myJsonString);
					var arrDates = [];
					var tempDates = data.payload.dates;
					for(i = 0 ; i < tempDates.length ; i++) {
						var txtDate = tempDates[i] + "";
						var year = txtDate.substring(0,4);
						var month = txtDate.substring(4,6);

						var tempMonth = parseInt(month, 10);
						tempMonth = tempMonth - 1;

						month = tempMonth + "";
						var lenMonth = month.length;
						if(lenMonth != 2 && lenMonth == 1) {
						  month = "0" + month;
						}
						var day = txtDate.substring(6,8);
						arrDates.push(year + "-" + month + "-" + day);
					}
					availableDate = arrDates;

					if($scope.boolFlag == true) {
						$scope.obj.dt = new Date();
						$scope.boolFlag = false;
					} else {
						var dayObj = "";
						var lenDay = 0;
						var temp = new Date();
						if(monthObj == (temp.getMonth() + 1) && arrDateInst[1] == temp.getFullYear()) {
							dayObj = temp.getDate() + "";
							lenDay = dayObj.length;
							if(lenDay != 2 && lenDay == 1) {
							  dayObj = "0" + dayObj;
							}
						} else {
							dayObj = "01";
						}
						var valMonth = (parseInt(monthObj) - 1);
						var valDay = parseInt(dayObj);
						var valYear = arrDateInst[1];
						$scope.obj.dt = new Date(valYear, valMonth, valDay);
					}
				}
			});

			result.error(function(data, status, headers, config) {
				$scope.checkSessionTimeout(data);
			});
		}
	}

	//API to get dates of given month:year have atleast one free slot for appointment.
	$scope.getEditMonthlyAppointmentAvailability = function(pincode, zoneid, serviceid) {
   
        //alert('edit'+$scope.apptClinicId);

		var yyyymmDate = "";
		var arrDateInst = "";
		var monthObj = "";
		var yr = 0;
		$scope.editAptEmptyApptMonth = false;
		arrDateInst = $("#datetimepicker7").find("[id^='datepicker'].btn-default").text().split(' ');
		if (arrDateInst[0] == "January") {
			monthObj = "01";
		} else if(arrDateInst[0] == "February") {
			monthObj = "02";
		} else if(arrDateInst[0] == "March") {
			monthObj = "03";
		} else if(arrDateInst[0] == "April") {
			monthObj = "04";
		} else if(arrDateInst[0] == "May") {
			monthObj = "05";
		} else if(arrDateInst[0] == "June") {
			monthObj = "06";
		} else if(arrDateInst[0] == "July") {
			monthObj = "07";
		} else if(arrDateInst[0] == "August") {
			monthObj = "08";
		} else if(arrDateInst[0] == "September") {
			monthObj = "09";
		} else if(arrDateInst[0] == "October") {
			monthObj = "10";
		} else if(arrDateInst[0] == "November") {
			monthObj = "11";
		} else if(arrDateInst[0] == "December") {
			monthObj = "12";
		}

		var strYr = arrDateInst[1];
		yr = parseInt(strYr);
		yyyymmDate = arrDateInst[1] + monthObj;

		var tDate = new Date();
		var tYear = tDate.getFullYear();
		var tMonth = tDate.getMonth() + 1;

		if((yr == tYear && parseInt(monthObj) >= tMonth) || (yr > tYear)) {
			var sidInst = $cookies.get('u_sid');
			var apiKeyInst = $cookies.get('u_apikey');
			var roleInst = $cookies.get('u_type');

            if($scope.apptClinicId == '' || $scope.apptClinicId == undefined || $scope.apptClinicId == 0){
            	var url = "/healyos-pdt/hrest/v1/appt/calmon/" + yyyymmDate + "?apikey=" + apiKeyInst + "&sid=" + sidInst + "&role=" + roleInst + "&pincode=" + pincode + "&zoneid=" + zoneid + "&serviceid=" + serviceid;
            }else{
            	var url = "/healyos-pdt/hrest/v1/appt/calmon/" + yyyymmDate + "?apikey=" + apiKeyInst + "&sid=" + sidInst + "&role=" + roleInst + "&clinic_id=" + $scope.apptClinicId + "&serviceid=" + serviceid;
            }
			

			var result = $http.get(url);

			result.success(function(data, status, headers, config) {
				if(data.error == undefined) {
					jsonStringObj = JSON.stringify(data);
					var monthlyAppointmentAvailabilityObj = JSON.parse(myJsonString);
					var arrDates = [];
					var tempDates = data.payload.dates;
					for(i = 0 ; i < tempDates.length ; i++) {
						var txtDate = tempDates[i] + "";
						var year = txtDate.substring(0,4);
						var month = txtDate.substring(4,6);

						var tempMonth = parseInt(month, 10);
						tempMonth = tempMonth - 1;

						month = tempMonth + "";
						var lenMonth = month.length;
						if(lenMonth != 2 && lenMonth == 1) {
						  month = "0" + month;
						}

						var day = txtDate.substring(6,8);
						arrDates.push(year + "-" + month + "-" + day);
					}
					editAvailableDate = arrDates;

					var dayObj = "";
					var lenDay = 0;
					var temp = new Date();
					if(monthObj == (temp.getMonth() + 1) && yr == temp.getFullYear()) {
						dayObj = temp.getDate() + "";
						lenDay = dayObj.length;
						if(lenDay != 2 && lenDay == 1) {
						  dayObj = "0" + dayObj;
						}
					} else {
						dayObj = "01";
					}
					var valMonth = (parseInt(monthObj) - 1);
					var valDay = parseInt(dayObj);
					var valYear = yr;
					
					$scope.editAptModel.date = new Date(valYear, valMonth, valDay);
				}

				if(editAvailableDate.length == 0) {
					$scope.editAptEmptyApptMonth = "No appointments available in current month.";
				}
			});

			result.error(function(data, status, headers, config) {
				$scope.checkSessionTimeout(data);
			});
		}
	}

	$scope.initEditCalendar = function () {
		$("#datetimepicker7").find("[id^='datepicker'].btn-default").attr("disabled", true);
		$("#datetimepicker7").find("[id^='datepicker'].btn-default").css({"color": "#333"});
		$(".btn.btn-default.btn-sm.pull-left").on( "click", function() {
			//console.log( $( this ).text() );
			$scope.spInfo = false;
			$timeout(invokeGetEditMonthlyAppointmentAvailability, 100);
		});
		$(".btn.btn-default.btn-sm.pull-right").on( "click", function() {
			console.log( $( this ).text() );
			$scope.spInfo = false;
			invokeGetEditMonthlyAppointmentAvailability();
		});
	}

	$scope.callSpInfo = function(spid) {
		if($scope.adminNewAppointmentCust.zone == undefined && $scope.service == undefined && $scope.adminNewAppointmentCust.pincode == undefined) {
			$scope.getSpInfo($scope.zoneId, $scope.serviceIdInst, $scope.custPincode, spid);
		}
		else {			
			var pincodeid = cache.pincodeToPincodeIdMap[$scope.adminNewAppointmentCust.pincode];
			if($scope.activeTab == "New Appointment") {
			
				if($scope.spNewAppointment.spNames != undefined && $scope.spNewAppointment.spNames != "") {
					$scope.getSpInfo($scope.adminNewAppointmentCust.zone, $scope.service, pincodeid, $scope.spNewAppointment.spNames);
				} else {
					$scope.getSpInfo($scope.adminNewAppointmentCust.zone, $scope.service, pincodeid);
				}
			} else {
				
				//$scope.getSpInfo($scope.adminNewAppointmentCust.zone, $scope.service, pincodeid, spid);
				$scope.getSpInfo($scope.zoneId, $scope.serviceIdInst, $scope.custPincode, spid);
			}
		}
	}

	function callGetMonthlyAppointmentAvailability() {
		var pincodeid = cache.pincodeToPincodeIdMap[$scope.adminNewAppointmentCust.pincode];
		$scope.getMonthlyAppointmentAvailability(pincodeid, $scope.adminNewAppointmentCust.zone);
	}

	$scope.callEditSpInfo = function() {
		$scope.getSpInfo($scope.editAptModel.zone, $scope.editAptModel.service, $scope.editAptModel.pincodeid);
	}

	function invokeGetEditMonthlyAppointmentAvailability() {
		$scope.getEditMonthlyAppointmentAvailability($scope.editAptModel.pincodeid, $scope.editAptModel.zone, $scope.editAptModel.service);
	}

	$scope.invokeGetEditMonthlyAppointmentAvailability = function() {
		$scope.getEditMonthlyAppointmentAvailability($scope.editAptModel.pincodeid, $scope.editAptModel.zone, $scope.editAptModel.service);
	}

	$scope.callEditGetMonthlyAppointmentAvailability = function() {
		$scope.getEditMonthlyAppointmentAvailability($scope.adminNewAppointmentCust.customer.pincode, $scope.adminNewAppointmentCust.appointment.zoneid, $scope.adminNewAppointmentCust.appointment.serviceid);
	}

	$scope.disabled = function(date, mode) {
		var monthObj = date.getMonth() + "";
		var lenMonth = monthObj.length;
		if(lenMonth != 2 && lenMonth == 1) {
		  monthObj = "0" + monthObj;
		}

		var dayObj = date.getDate() + "";
		var lenDay = dayObj.length;
		if(lenDay != 2 && lenDay == 1) {
		  dayObj = "0" + dayObj;
		}
		var dateInstance = date.getFullYear() + "-" + monthObj + "-" + dayObj;

		if(availableDate.indexOf(dateInstance) != -1 ) {
			return false;
		} else {
			return true;
		}
	};

	// Disable dates selection
	$scope.editDisabled = function(date, mode) {
		var monthObj = date.getMonth() + "";
		var lenMonth = monthObj.length;
		if(lenMonth != 2 && lenMonth == 1) {
		  monthObj = "0" + monthObj;
		}

		var dayObj = date.getDate() + "";
		var lenDay = dayObj.length;
		if(lenDay != 2 && lenDay == 1) {
		  dayObj = "0" + dayObj;
		}
		var dateInstance = date.getFullYear() + "-" + monthObj + "-" + dayObj;

		if(editAvailableDate.indexOf(dateInstance) != -1 ) {
			return false;
		} else {
			return true;
		}
	};

	$scope.toggleMin = function() {
		$scope.minDate = $scope.minDate ? null : new Date();
		$scope.minDateEdit = $scope.minDateEdit ? null : new Date();
	};
	$scope.toggleMin();

	$scope.maxDate = "";
	$scope.maxDateEdit = "";

	$scope.open = function($event) {
		$scope.status.opened = true;
	};

	$scope.setDate = function(year, month, day) {
		$scope.obj.dt = new Date(year, month, day);
		$scope.editAptModel.date = new Date(year, month, day);
	};

	$scope.status = {
		opened: false
	};

	var initgetServicesObj;
	
	$scope.initCustCities = function() {
		
		$scope.adminNewAppointmentCust = {};
		if(!$scope.users1.disableFlag){
			$scope.users1 = {};
		}
		
		$scope.adminNewAppointmentCust.check = false;
		var city = [];
		var city1 = [];
		
		var gender = [
			{ id:"male",  name:"Male"},
			{ id:"female",  name:"Female"}
		];
		
		var custProblem = [];
		adminApi.getServices()
		.success(function(data, status, headers, config) {
			var result1 = null;
			myJsonString = JSON.stringify(data);
			initgetServicesObj = JSON.parse(myJsonString);
			for(var i = 0; i < initgetServicesObj.payload.length; i++) {
				result1 =  initgetServicesObj.payload[i];
				for(var j = 0; j < result1.services.length; j++){
					for(k = 0; k < result1.services[j].problems.length; k++){
						custProblem.push(result1.services[j].problems[k]);
					}
				}
			}

			$scope.customerProblem = custProblem;
		})
		.error(function(data, status, headers, config) {
			$scope.checkSessionTimeout(data);
		});
		
		$scope.customerSource =[
			{id: "Sancheti IPD",name:"Sancheti IPD"},
			{id: "Sancheti OPD",name:"Sancheti OPD"},
			{id: "Just Dial",name:"Just Dial"},
			{id: "Quikr",name:"Quikr"},
			{id: "Sulekha",name:"Sulekha"},
			{id: "Practo",name:"Practo"},	
			{id: "Google",name:"Google"},
			{id: "Facebook",name:"Facebook"},
			{id:  "Clinic To Home",name:"Clinic To Home"},
			{id: "Management Referral",name:"Management Referral"},
			{id: "Patient Referral",name:"Patient Referral"},
			{id: "Physiotherapist Referral",name:"Physiotherapist Referral"},
			{id: "Other Referral",name:"Other Referral"},
			{id: "Other",name:"Other"}
		];

		adminApi.getCities("India")
		.success(function(data, status, headers, config) {
			myJsonString = JSON.stringify(data);
			var initCustCitiesObj = JSON.parse(myJsonString);
			for(var i = 0; i < initCustCitiesObj.payload.states.length; i++) {
				result1 =  initCustCitiesObj.payload.states[i];
				for(var j = 0; j < result1.cities.length; j++){
					city1.push(result1.cities[j]);
					city.push(result1.cities[j].name);
				}
			}
			$scope.custCities = city;
			$scope.custCities1 = city1;
			$scope.custGender = gender;
		})
		.error(function(data, status, headers, config) {
			$scope.checkSessionTimeout(data);
		});
	}

	$scope.custPin = function(cityid) {
		var zones = [];
		var pincode = [];
		var pincode1 = [];
		$scope.clinicZone = [
			{
				id: "",
				name: ""
			}
		];
		console.log('cityid');
		console.log(cityid);
		 //$scope.users1.city = $scope.arrayActiveCity[1]._id;
		 //console.log('Dcityid');
		// console.log($scope.arrayActiveCity[1]._id);

		adminApi.getZones(cityid)
		.success(function(data, status, headers, config) {
			myJsonString = JSON.stringify(data);
			var custpinobj = JSON.parse(myJsonString);

			data.payload.forEach(function(item) {
				item.pincodes.forEach(function(innerItem) {
					$scope.clinicZone.push({id: item.zoneid, name: item.zonename+" - "+innerItem.pin});
				});
			});
			cache.zoneIdToNameMap = buildZoneIdToNameMap(data.payload);
			cache.pincodeIdToPincodeNameMap = buildPincodeIdToPincodeNameMap(data.payload);
			cache.pincodeToPincodeIdMap = buildPincodeToPincodeIdMap(data.payload);
			
			for(var i = 0; i < custpinobj.payload.length; i++) {
				var result1 =  custpinobj.payload[i];
				zones.push(custpinobj.payload[i]);
				var zonId = result1.zoneid;
				var zoneObj = {};
				zoneObj[zonId] = [];

				for(var j = 0; j < result1.pincodes.length; j++){
					$scope.clinicZone.push({id: result1.zoneid, name: result1.zonename+" - "+result1.pincodes[j].pin});
					var result2 =  result1.pincodes[j];
					if(!hasInList(pincode, result1.pincodes[j], "pin")) {
						pincode.push(result1.pincodes[j]);
					}
				}
			}

			$scope.custZones = zones;
			$scope.custPinLocalities = pincode;

			$scope.flag = true;
			$scope.flag1 = true;

			$scope.filterPin = function(aa) {
				a1 = [];
				for(var i = 0; i < custpinobj.payload.length; i++) {
					var resulta =  custpinobj.payload[i];
					for(var j = 0; j < resulta.pincodes.length; j++){
						var resultb =  resulta.pincodes[j];
						if(resulta.zoneid == aa){
							a1.push(resulta.pincodes[j]);
						}
					}
				}
				$scope.custPinLocalities = a1;
			}

			$scope.filterArea = function(bb) {
				var b1 = [];
				for(var i = 0; i < custpinobj.payload.length; i++) {
					var resulta =  custpinobj.payload[i];
					for(var j = 0; j < resulta.pincodes.length; j++) {
						var resultb =  resulta.pincodes[j];
						if(resulta.pincodes[j].pin == bb) {
							b1.push(resulta);
						}
					}
				}
				$scope.custZones = b1;
			}

			$scope.locationArr = [];
			$scope.arrayLocalities = [];

			var dataArray = data.payload;
			for(var i = 0 ; i < dataArray.length ; i++) {
                //change to show only zones which are not deleted
               
            if(!dataArray[i].hasOwnProperty("deleted") || dataArray[i].deleted === false)    {
                    var zoneid = dataArray[i].zoneid;
                    var zonename = dataArray[i].zonename;
                    var pincodeArray = dataArray[i].pincodes;

                    for(var j = 0 ; j < pincodeArray.length ; j++) {
                        //change for bug 269 to show only non deleted pins and localities
                        var isdeleted = pincodeArray[j].isdeleted;
                        if (isdeleted === false){
                                var pincodeVal = pincodeArray[j].pin;
                                var pincodeid = pincodeArray[j].pincodeid;
                                var localitiesVal = pincodeArray[j].localities;
                                var locationObj = {
                                    "zoneid": zoneid,
                                    "zonename": zonename,
                                    "pin": pincodeVal,
                                    "pincodeid": pincodeid,
                                    "localities": localitiesVal,
                                    "locality": pincodeVal + ' - ' + localitiesVal,
                                    "val": pincodeVal + " " + localitiesVal
                                };
                                $scope.locationArr.push(locationObj);
                                $scope.arrayLocalities.push(locationObj);

                                $scope.locationArr.sort(compare);
                                $scope.arrayLocalities.sort(compare);
                            }
                    }
                }
			}
			$scope.acRefresh = false;
			$timeout(function() {
				$scope.acRefresh = true;
				$scope.$apply();
				if($scope.isEditAptMode == false) {
					$scope.selectedLocation = {
						"zoneid": "",
						"zonename": "",
						"pin": "",
						"localities": "",
						"val": ""
					};
				}
				if($scope.locationArr.length == 0) {
					$scope.adminNewAppointmentCust.pincode = "";
					$scope.adminNewAppointmentCust.zone = "";
				}
			}, 100);
		})
		.error(function(data, status, headers, config) {
			$scope.checkSessionTimeout(data);
		});
    }


    $scope.getServiceLocation = function(cityid){

        $scope.clinicArrList =[];
        $scope.clinicArrList.push({
			        _id : 0,
			        clinic_name : 'Home'
			    });
        $scope.adminNewAppointmentCust.serviceLocation = $scope.clinicArrList[0]._id;

    	/*adminApi.getClinics(cityid)
		.success(function(data, status, headers, config) {
			myJsonString = JSON.stringify(data);
			var clinicObj = JSON.parse(myJsonString);
			$scope.clinicArr = data.payload;

			for(var i = 0; i < clinicObj.payload.length; i++) {
				var result =  clinicObj.payload[i];
			
				var clinicId = result._id;
				var clinicName = result.clinic_name;


				$scope.clinicArrList.push({
			        _id : clinicId,
			        clinic_name : clinicName
			    });


			}

			$scope.clinicArrList.push({
			        _id : 0,
			        clinic_name : 'Home'
			    });
		
			
		})
		.error(function(data, status, headers, config) {
			$scope.checkSessionTimeout(data);
		})*/
    	
    }

	/* function to sort pincodes */
	function compare(a,b) {
		if (a.pin < b.pin)
			return -1;
		else if (a.pin > b.pin)
			return 1;
		else
			return 0;
	}
	
	$scope.spInfo = false;
	$scope.wtUndefined = false;

	$scope.getSpInfo = function(zoneid, servid, pin, spid) {

		//alert('getspinfo'+$scope.apptClinicId);

		var serviceDate = "";
		var dateInst = "";
		var intMonth = 0;
		var monthInst = "";
		var lenMonth = 0;
		var dayObj = "";
		var lenDay = 0;
		var yearObj = 0;

		if($scope.isEditAptMode == true) {
			dateInst = $scope.editAptModel.date;
		} else {
			dateInst = $scope.obj.dt;
		}

		intMonth = dateInst.getMonth() + 1;
		monthInst = intMonth + "";
		lenMonth = monthInst.length;
		if(lenMonth != 2 && lenMonth == 1) {
		  monthInst = "0" + monthInst;
		}

		dayObj = dateInst.getDate() + "";
		lenDay = dayObj.length;
		if(lenDay != 2 && lenDay == 1) {
		  dayObj = "0" + dayObj;
		}

		yearObj = dateInst.getFullYear();
		serviceDate = yearObj + monthInst + dayObj + "";

        
		if($scope.apptClinicId != 0 || $scope.apptClinicId != undefined || $scope.apptClinicId != ''){
           $scope.clinicId = $scope.apptClinicId;
		}else{
		   $scope.clinicId = 0;
		}

		adminApi.getSpInfo(serviceDate, zoneid, servid, pin, spid, $scope.clinicId)
		.success(function(data, status, headers, config) {
			myJsonString = JSON.stringify(data);
			var getSpInfoObj = JSON.parse(myJsonString);
			
			var aptFromTime = [];
			var aptToTime = [];
			var space = [];
			var aptst = [];
			
			if (typeof data.payload.appointmentslots[0] != 'undefined'){
				$scope.spInfo = true; 
				$scope.wtUndefined = false;

				for(var i = 0; i < data.payload.appointmentslots.length; i++){
					space.push("-");
				}
				
				for(var j = 0; j < data.payload.appointmentslots.length; j++){
					
					aptst.push(data.payload.appointmentslots[j].st);
					
					var mins = data.payload.appointmentslots[j].st;
					mins = mins.substring(2);
					var str = data.payload.appointmentslots[j].st;
					str = str.substring(0, str.length - 2);
					var hours = str > 12 ? "0"+(str - 12) : str;
					var am_pm = str >= 12 ? " PM" : " AM";
					from = hours + ":" + mins  + am_pm;
					aptFromTime.push(from);

					var mins1 = data.payload.appointmentslots[j].et;
					mins1 = mins1.substring(2);
					var str1 = data.payload.appointmentslots[j].et;
					str1 = str1.substring(0, str1.length - 2);
					var hours1 = str1 > 12 ? "0"+(str1 - 12) : str1;
					var am_pm1 = str1 >= 12 ? " PM" : " AM";
					to = hours1 + ":" + mins1 + am_pm1;
					aptToTime.push(to);
				}
				$scope.aptSlotTimeFrom = aptFromTime;
				$scope.aptSlotTimeTo = aptToTime;
				$scope.spaceDash = space;
				
				$scope.aptStartTime = aptst;
				
			} else {
				$scope.aptSlotTimeFrom = "";
				$scope.aptSlotTimeTo = "";
				$scope.spaceDash = "";
				$scope.spInfo = false; 
				$scope.wtUndefined = true;
				if($scope.isEditAptMode == true) {
					$scope.wtUndefinedErrorMsg = "Please select another time for appointment.";
				} else {
					$scope.wtUndefinedErrorMsg = "Appointment slots not available";
				}
				$scope.adminNewAppointmentCust.aptstarttime = false;
			}
		})
		.error(function(data, status, headers, config) {
			$scope.checkSessionTimeout(data);
		});
	}
	
	$scope.problemSelected;
	$scope.pincodeSelected;
	$scope.pincodeSelectedAvailable;
	$scope.problemSelectedAvailable;
	$scope.serviceLocationSelectedAvailable;
	
	$scope.custDetails = true;
	$scope.showNext = function (item){
		//console.log($scope.selectedLocation.zonename);
		//console.log($scope.selectedLocation.zoneid);
		//console.log($scope.users1.city);
		var zoneId = $scope.selectedLocation.zoneid;
		var cityId = $scope.users1.city;
		$scope.zoneBasePrice = 0;
		//console.log($scope.arrayAllZones);

		$scope.arrayAllZones.forEach(function(item) {
			if(item.zoneid == zoneId && item.cityid == cityId){
				if(item.price > 0 && item.price != undefined){
					$scope.zoneBasePrice = item.price;
				}				
			}
		});

		//console.log(zoneBasePrice);

		$(".btn.btn-default.btn-sm").eq(1).attr("disabled", true);
		$(".btn.btn-default.btn-sm").eq(1).css({"color": "#333"});
		$(".btn.btn-default.btn-sm.pull-left").on( "click", function() {
			$scope.spInfo = false;
			$timeout(callGetMonthlyAppointmentAvailability, 100);
		});
		$(".btn.btn-default.btn-sm.pull-right").on( "click", function() {
			$scope.spInfo = false;
			callGetMonthlyAppointmentAvailability();
		});
		switch (item) {
			case 'serviceProvider':
				$scope.boolFlag = true;
				$scope.custDetails = false;
				$scope.serviceProvider = true;
				$scope.custAddress = false;
				$scope.aptConfirmMsg = false;
				
				if($scope.adminNewAppointmentCust.pincode != $scope.pincodeSelected) {
					$scope.spInfo = false;
					$scope.wtUndefined = false;
					$scope.pincodeSelected = $scope.adminNewAppointmentCust.pincode;
				}
				
				if($scope.adminNewAppointmentCust.Problem != $scope.problemSelected){
					$('#datetimepicker3').val('');
					$scope.spInfo = false;
					$scope.wtUndefined = false;
				
					for(var i = 0; i < initgetServicesObj.payload.length; i++) {
						result1 =  initgetServicesObj.payload[i];
						for(var j = 0; j < result1.services.length; j++){
							for(k = 0; k < result1.services[j].problems.length; k++){
								if($scope.adminNewAppointmentCust.Problem == result1.services[j].problems[k]){
									$scope.originalCost = result1.rate;
									$scope.currency = result1.currency;
									$scope.service = result1.services[j].id;
									$scope.problemSelected = result1.services[j].problems[k]

									$scope.originalPrice = result1.rate;
								}
							}
						}
					}
				}

             
                $scope.clinicBasePriceVal = 0;
                $scope.clinicAddress = "";
                $scope.apptClinicId = '';
				if($scope.adminNewAppointmentCust.serviceLocation != 0 && $scope.adminNewAppointmentCust.serviceLocation != undefined){
					
					var clinicId = $scope.adminNewAppointmentCust.serviceLocation;

					$scope.apptClinicId = $scope.adminNewAppointmentCust.serviceLocation;
				
					for(var i = 0; i < $scope.clinicArr.length; i++) {
						
						var result = $scope.clinicArr[i];
						if(clinicId == result._id){
							var clinic_name = result.clinic_name;
							var clinicBasePrice = result.clinic_base_price;

							$scope.clinicName = clinic_name;
							$scope.clinicId = result._id;
							$scope.clinicBasePriceVal = result.clinic_base_price;
							$scope.clinicAddress = result.clinic_address;
						}
						
					}

					if(clinicBasePrice > 0 && clinicBasePrice != undefined){
						$scope.originalCost = clinicBasePrice;
					}
					
				}else{
					//$scope.originalCost = $scope.originalPrice;
					$scope.originalCost = $scope.zoneBasePrice;
					
				}

				if($scope.clinicAddress != ""){
					$scope.adminNewAppointmentCust.residenceAddress = $scope.clinicAddress;
				}else{
					$scope.adminNewAppointmentCust.residenceAddress = "" ;
				}

			
				break;
			case 'custAddress':
				$scope.boolFlag = false;
				$scope.custDetails = false;
				$scope.serviceProvider = false;
				$scope.custAddress = true;
				$scope.aptConfirmMsg = false;
				break;
			case 'aptConfirmMsg':
				$scope.boolFlag = false;
				$scope.custDetails = false;
				$scope.serviceProvider = false;
				$scope.custAddress = false;
				$scope.aptConfirmMsg = true;
				break;
		}

		//$scope.getServicesAndProducts();
	}

	$scope.getServicesAndProducts = function(){
		adminApi.getServiceAndProducts()
		.success(function(data, status, headers, config) {
			console.log(data.payload);

			$scope.products = [];
			$scope.services = [];

			$scope.ServicesAndProducts = data.payload;

			$scope.ServicesAndProducts.forEach(function(item) {
			if(item.category == 'product'){
				$scope.products.push(item);	
			}else if(item.category == 'service'){
				$scope.services.push(item);
			}
			});

		})
		.error(function(data, status, headers, config) {
			console.log('Failed to fetch services and products!');
		});
	}

	$scope.showBack = function (item){
		switch (item) {
			case 'custDetails':
				$scope.boolFlag = false;
				$scope.custDetails = true;
				$scope.custAddress = false;
				$scope.serviceProvider = false;
				break;
			case 'serviceProvider':
				$scope.boolFlag = true;
				$scope.custDetails = false;
				$scope.serviceProvider = true;
				$scope.custAddress = false;
				break;
		}
	}

	$scope.getMonthlyAppointmentAvailabilityCheck = function(pincode, zoneid) {

		if($scope.adminNewAppointmentCust.serviceLocation == 0){

			if(($scope.adminNewAppointmentCust.pincode != $scope.pincodeSelectedAvailable) ||
				($scope.adminNewAppointmentCust.Problem != $scope.problemSelectedAvailable)) {
				$scope.pincodeSelectedAvailable = $scope.adminNewAppointmentCust.pincode;
				$scope.problemSelectedAvailable = $scope.adminNewAppointmentCust.Problem;
				pincode = cache.pincodeToPincodeIdMap[pincode];
				$scope.getMonthlyAppointmentAvailability(pincode, zoneid);
			}

		}else{

			if(($scope.adminNewAppointmentCust.serviceLocation != $scope.serviceLocationSelectedAvailable)) {
				$scope.serviceLocationSelectedAvailable = $scope.adminNewAppointmentCust.serviceLocation;
				pincode = cache.pincodeToPincodeIdMap[pincode];
				$scope.getMonthlyAppointmentAvailability(pincode, zoneid);
			}

		}
	};	

	$scope.reset = function () {
		$scope.patient.name = "";
		$scope.patient.email = "";
		$scope.patient.password = "";
		$scope.patient.confirmPassword = "";
		$scope.patient.address = "";
		$scope.patient.state = "";
		$scope.patient.city = "";
		$scope.patient.pincode = "";
		$scope.patient.country = "";
		$scope.patient.phoneNumber = "";
		$scope.patient.residenceNumber = "";
		$scope.patient.birthDate = "";
		$scope.patient.imageFile = "";
		$scope.patient.problemType = "";
		$scope.form.signUpForm.$setPristine();
		$scope.form.signUpForm.$setUntouched();
	}

	$scope.readCache = function(type, value) {
		if(value != undefined) {
			try{
				switch(type) {
					case "zone":
						return cache.zoneIdToNameMap[value];
					case "cityName":
						return cache.cityIdToNameMap[value];
					case "state":
						return cache.cityIdToStateMap[value];
					case "clinic":
						return cache.clinicIdToNameMap[value];
				}
			}
			catch(err) {
			}
			
		}
	}

	$scope.calculateSpTimeSlots = function(spId, dateArray){
		$scope.SpWorkTime = null;
		var dataObj = {
				"sp_id" : spId,
				"service_location" : "",
				"sp_workingDate": dateArray
			};
		existingWorkTimeSlots = [];
		adminApi.getSpMonthlyWtimeAndOffSlots(dataObj)
		.success(function(data, status, headers, config) {
			$scope.SpWorkTime = data.payload.sp_monthlyWtimeAndOffSlots;
			var record_1 = null;
			record_1 = data.payload.sp_monthlyWtimeAndOffSlots;
			record_1.forEach(function(item_1) {
				var record_2 = null;
				if(item_1.wtime != undefined){
					record_2 = item_1.wtime;
					record_2.forEach(function(item_2) {
						if(existingWorkTimeSlots.length != 0){
							existingWorkTimeSlots.forEach(function(item_3) {
								if(item_3.st != item_2.st || item_3.et != item_2.et){
									existingWorkTimeSlots.push({"st" : item_2.st, "et" : item_2.et});
								}
							});
						}else{
							existingWorkTimeSlots.push({"st" : item_2.st, "et" : item_2.et});
						}
					});
				}
			});
		})
		.error(function(data, status, headers, config) {
			$scope.checkSessionTimeout(data);
			$scope.showWTime = false;
		});

		return existingWorkTimeSlots;
	}

	$scope.changeWorkTimeSlot = function(spId, clinic_id, clinics_array) {
		var tempDateArray = [];
		for (var d = 0; d < arrayDates.length; d++){
			var res = arrayDates[d].split("-").join("");
			tempDateArray.push(res);
		}

		$scope.SpWorkTime = null;
		var dataObj = {
				"sp_id" : spId,
				"service_location" : "",
				"sp_workingDate": tempDateArray
			};
		existingWorkTimeSlots = [];
		adminApi.getSpMonthlyWtimeAndOffSlots(dataObj)
		.success(function(data, status, headers, config) {
			$scope.SpWorkTime = data.payload.sp_monthlyWtimeAndOffSlots;
			var record_1 = null;
			record_1 = data.payload.sp_monthlyWtimeAndOffSlots;
			record_1.forEach(function(item_1) {
				var record_2 = null;
				if(item_1.wtime != undefined){
					record_2 = item_1.wtime;
					record_2.forEach(function(item_2) {
						if(existingWorkTimeSlots.length != 0){
							existingWorkTimeSlots.forEach(function(item_3) {
								if(item_3.st != item_2.st || item_3.et != item_2.et){
									existingWorkTimeSlots.push({"st" : item_2.st, "et" : item_2.et});
								}
							});
						}else{
							existingWorkTimeSlots.push({"st" : item_2.st, "et" : item_2.et});
						}
					});
				}
			});

			if(clinic_id != 0){
				$scope.wrkHrsAllSlots = [];
				var clinic_time_slot_duration = null;
				var clinic_start_time = null;
				var clinic_end_time = null;
				var slot_start_time = null;
				var slot_start_time_str = null;
				var slot_end_time = null;
				var newWorkTimeSlots = [];

				for (var i = 0; i < clinics_array.length; i++){
					if(clinics_array[i]._id == clinic_id){
						clinic_time_slot_duration = clinics_array[i].clinic_time_slot_duration;
						clinic_start_time = clinics_array[i].clinic_start_time;
						clinic_end_time = clinics_array[i].clinic_end_time;
						slot_start_time = clinic_start_time;
						slot_start_time_str = clinic_start_time;

						var st_arry = clinic_start_time.split(":");
						var st = st_arry[0]+""+st_arry[1];

						var et_arry = clinic_end_time.split(":");
						var et = et_arry[0]+""+et_arry[1];

						while(st < et){
							var slot_end_time = null;
							var newSt = null; var newEt = null;

							var slot_end_time = $scope.claculateEndTimeOfSlot(clinic_time_slot_duration, slot_start_time, clinic_end_time);
							newSt = slot_start_time_str.split(":").join("");
							newEt = slot_end_time.split(":").join("");
							newWorkTimeSlots.push({"st" : newSt, "et" : newEt});
							$scope.wrkHrsAllSlots.push({"selected": false, "label":slot_start_time_str+" - "+slot_end_time, "selectZoneIds": [], "selectClinicIds": []});

							slot_start_time_str = $scope.addMinutes(slot_end_time, 1000);

							slot_start_time = slot_end_time;
							var new_st_arry = null;
							var new_st = null;
							new_st_arry = slot_end_time.split(":");
							new_st = new_st_arry[0]+""+new_st_arry[1];
							st = new_st;
						}
					}
				}

				if(existingWorkTimeSlots.length != 0){
					existingWorkTimeSlots.forEach(function(item_4) {
						newWorkTimeSlots.forEach(function(item_5) {
							if(item_5.st >= item_4.st && item_5.st <= item_4.et){
								var first = item_5.st.slice(0,2);
								var middle = item_5.st.slice(2,4);
								var delimeter = ":";
								var result = first+delimeter+middle;
								$scope.wrkHrsAllSlots.forEach(function(item_6) {
									if(item_6.label != ""){
										var label_split = item_6.label.split(" - ");
										if(label_split[0] == result){
											var d = null;
											d = $scope.wrkHrsAllSlots.indexOf(item_6);
											if(d != -1) {
												//$scope.wrkHrsAllSlots.splice(d, 1);
												item_6.selected = true;
											}
										}
									}
								});
							}
						});
					});
				}
			}else{
				$scope.wrkHrsAllSlots = [
					{
						"selected": false,
						"label": 	"07:30 - 09:00",
						"selectZoneIds": [],
						"selectClinicIds": [],
						"disabled": false,
					},
					{
						"selected": false,
						"label": 	"09:00 - 10:30",
						"selectZoneIds": [],
						"selectClinicIds": [],
						"disabled": false,
					},
					{
						"selected": false,
						"label": 	"10:30 - 12:00",
						"selectZoneIds": [],
						"selectClinicIds": [],
						"disabled": false,
					},
					{
						"selected": false,
						"label": 	"12:00 - 13:30",
						"selectZoneIds": [],
						"selectClinicIds": [],
						"disabled": false,
					},
					{
						"selected": false,
						"label": 	"15:00 - 16:30",
						"selectZoneIds": [],
						"selectClinicIds": [],
						"disabled": false,
					},
					{
						"selected": false,
						"label": 	"16:30 - 18:00",
						"selectZoneIds": [],
						"selectClinicIds": [],
						"disabled": false,
					},
					{
						"selected": false,
						"label": 	"18:00 - 19:30",
						"selectZoneIds": [],
						"selectClinicIds": [],
						"disabled": false,
					},
					{
						"selected": false,
						"label": 	"19:30 - 21:00",
						"selectZoneIds": [],
						"selectClinicIds": [],
						"disabled": false,
					}
				];
			}
		})
		.error(function(data, status, headers, config) {
			$scope.checkSessionTimeout(data);
			$scope.showWTime = false;
		});

		return $scope.wrkHrsAllSlots;
	}

	$scope.addMinutes = function(timeString, minAdd){
		var time_array = null;
		time_array = timeString.split(":");
		var full_time = new Date();
		full_time.setHours(time_array[0]);
		full_time.setMinutes(time_array[1]);

		full_time.setTime(full_time.getTime() + minAdd * 60);

		var time = null;
		time = (full_time.getHours()<10?'0'+full_time.getHours():full_time.getHours())+":"+(full_time.getMinutes()<10?'0'+full_time.getMinutes():full_time.getMinutes());

		return time;
	}

	$scope.claculateEndTimeOfSlot = function(duration, slot_start_time, end_time) {

		if(duration != "" && slot_start_time != "" && end_time != ""){
			duration = parseInt(duration * 1000);

			var slot_end_time = null;
			slot_end_time = $scope.addMinutes(slot_start_time, duration);

			var compare = null;
			compare = $scope.dateCompare(slot_end_time+":00", end_time+":00");

			if (compare===0) return end_time;
			if (compare===1) return end_time;
			if (compare===-1) return slot_end_time;
		}
	}

	$scope.dateCompare = function (time1,time2) {
		var t1 = new Date();
		var parts = time1.split(":");
		t1.setHours(parts[0],parts[1],parts[2],0);
		var t2 = new Date();
		parts = time2.split(":");
		t2.setHours(parts[0],parts[1],parts[2],0);

		if (t1.getTime()>t2.getTime()) return 1;
		if (t1.getTime()<t2.getTime()) return -1;
		return 0;
	}

	$scope.initCache = function() {
		adminApi.getServices()
		.success(function(data, status, headers, config){
			$scope.servicesList = buildServicesList(data.payload);
			cache.servicesMap = buildServicesMap(data.payload);
		})
		.error(function(data, status, headers, config){
			$scope.aptErrorMsg = "Failed to fetch services as part of init.";
			$scope.checkSessionTimeout(data);
		});

		adminApi.getCities("India")
		.success(function(data, status, headers, config){
			$scope.zoneCountry = [];
			$scope.zoneState = [];
			$scope.zoneCity = [];
			$scope.clinicCountry = [];
			$scope.clinicState = [];
			$scope.clinicCity = [];
			$scope.zoneCountry.push({id: data.payload.id, name: data.payload.name});
			$scope.zoneCountry.id = data.payload.id;
			$scope.zoneCountry.name = data.payload.name;
			$scope.zoneCountrySelected = $scope.zoneCountry[0].id;
			$scope.clinicCountry.push({id: data.payload.id, name: data.payload.name});
			$scope.clinicCountry.id = data.payload.id;
			$scope.clinicCountry.name = data.payload.name;
			$scope.clinicCountrySelected = $scope.clinicCountry[0].id;

			data.payload.states.forEach(function(item) {
				$scope.zoneState.push({id: item.id, name: item.name});
				$scope.clinicState.push({id: item.id, name: item.name});

				item.cities.forEach(function(item) {
					$scope.zoneCity.push({id: item.id, name: item.name});
					$scope.clinicCity.push({id: item.id, name: item.name});
				});
			});
			$scope.zoneState.id = data.payload.states[0].id;
			$scope.zoneState.name = data.payload.states[0].name;
			$scope.zoneStateSelected = $scope.zoneState[0].id;

			$scope.zoneCity.id = data.payload.states[0].cities[0].id;
			$scope.zoneCity.name = data.payload.states[0].cities[0].name;
			$scope.zoneCitySelected = $scope.zoneCity[0].id;

			$scope.clinicState.id = data.payload.states[0].id;
			$scope.clinicState.name = data.payload.states[0].name;
			$scope.clinicStateSelected = $scope.clinicState[0].id;

			$scope.clinicCity.id = data.payload.states[0].cities[0].id;
			$scope.clinicCity.name = data.payload.states[0].cities[0].name;
			$scope.clinicCitySelected = $scope.clinicCity[0].id;

			cache.cityToIdMap = buildCitiesToIdMap(data.payload);
			cache.cityIdToNameMap = buildCitiesIdToNameMap(data.payload);
			cache.cityIdToStateMap = buildCityIdToStateMap(data.payload);

			adminApi.getZones(cache.cityToIdMap["Pune"])
			.success(function(data, status, headers, config){
				//$rootScope.zonesList = buildZonesList(data.payload);
				data.payload.forEach(function(item) {
					item.pincodes.forEach(function(innerItem) {
						$scope.clinicZone.push({id: item.zoneid, name: item.zonename+" - "+innerItem.pin});
					});
				});
				cache.zoneIdToNameMap = buildZoneIdToNameMap(data.payload);
				cache.pincodeIdToPincodeNameMap = buildPincodeIdToPincodeNameMap(data.payload);
				cache.pincodeToPincodeIdMap = buildPincodeToPincodeIdMap(data.payload);
				//$scope.initAddNewSp();
			})
			.error(function(data, status, headers, config){
				$scope.aptErrorMsg = "Failed to fetch services as part of init.";
				$scope.checkSessionTimeout(data);
			});
		})
		.error(function(data, status, headers, config){
			$scope.aptErrorMsg = "Failed to fetch services as part of init.";
			$scope.checkSessionTimeout(data);
		});

		$scope.arrayActiveCity = [];
		adminApi.getCity(true).
		success(function (data, status, headers, config) {
			var arrStoreTrue = [];
			var arrStoreTrue = data.payload;
			console.log("successfully received cities");
			arrStoreTrue.forEach(function(item) {
				$scope.arrayActiveCity.push(item);

				if(item.city_name == 'pune'){
					$scope.cityIdForSlot = item._id;
					$scope.SpWrkHrs.spSlotCity = $scope.cityIdForSlot;
					$scope.populateCityBasedSps(item._id);
					$scope.populateCityBasedZonesForSlot(item._id);
					$scope.SpWrkHrs.spServiceLocationSlot = '0';
					$scope.SpWrkHrs.spNamesIdSlot = 'All';

	                $scope.SpWrkHrs.spZones = "All";
	              	             

				}
			});
			 $scope.users1.city = $scope.arrayActiveCity[1]._id;
			//$scope.custPin(cache.cityToIdMap["Pune"]);			 

		}).
		error(function (data, status, headers, config) {
			console.log("Error in receiving cities");
		});


		$scope.arrayAllZones = [];
		adminApi.getAllActiveZones().
		success(function (data, status, headers, config) {
			var arrZones = [];
			var arrZones = data.payload;
			$scope.zoneIdToNameMap = "";
			$rootScope.zonesList = buildZonesList(data.payload);
			$scope.zoneIdToNameMap = buildZoneIdToNameMap(data.payload);
			console.log("successfully received zones");
			//console.log(cache.zoneIdToNameMap);
			arrZones.forEach(function(item) {
				$scope.arrayAllZones.push(item);
			});
		}).
		error(function (data, status, headers, config) {
			console.log("Error in receiving zones");
		});

		$scope.arrayAllSps = [];
		adminApi.getAllSps().
		success(function (data, status, headers, config) {
			$scope.spNamesArr = data.payload.spList;
			$scope.arrayAllSps = angular.copy(data.payload.spList);
			$scope.arrayAllSps.cityId = data.payload.cityId;

			for(var i = 0 ; i < $scope.arrayAllSps.length ; i++) {
				$scope.arrayAllSps[i].primaryZones = [];
				$scope.arrayAllSps[i].secondaryZones = [];

				for(var j = 0 ; j < $scope.arrayAllSps[i].zones.length ; j++) {
					if ($scope.arrayAllSps[i].zones[j].zonerole == 1) {
						$scope.arrayAllSps[i].primaryZones.push($scope.arrayAllSps[i].zones[j].name);
					} else if ($scope.arrayAllSps[i].zones[j].zonerole == 2) {
						$scope.arrayAllSps[i].secondaryZones.push($scope.arrayAllSps[i].zones[j].name);
					}
				}
			}

			for(var i = 0 ; i < $scope.spNamesArr.length ; i++) {
				if($scope.obj.followupSpid == $scope.spNamesArr[i]._id) {
					$scope.spNewAppointment.spNames = $scope.spNamesArr[i]._id;
					break;
				}
			}
		}).
		error(function (data, status, headers, config) {
			console.log("Error in receiving Sps");
		});

		$scope.arrayAllActiveClinics = [];
		adminApi.getClinic(true).
		success(function (data, status, headers, config) {
			var arrStoreTrue = [];
			var arrStoreTrue = data.payload;
			console.log("successfully received clinics");
			$scope.arrayAllActiveClinics.push({"_id":"0", "clinic_name":"Home"});
			arrStoreTrue.forEach(function(item) {
				$scope.arrayAllActiveClinics.push(item);
			});
		}).
		error(function (data, status, headers, config) {
			console.log("Error in receiving clinics");
		});


		//$scope.curdate = moment().format("YYYY-MMM-DD");
		$scope.curdate = moment().format("DD-MMM-YYYY");
		$scope.day = moment().format("dddd");
		$scope.month = moment().format("MMMM");
		$scope.SpWrkHrs.slotDate = $scope.curdate;
		$scope.SpWrkHrs.spMonth = $scope.month;
		$scope.SpWrkHrs.spWeeklyOff = "Select weekly off";	

		if($scope.SpWrkHrs.spMonth != undefined){
			var daysNo = moment($scope.SpWrkHrs.spMonth , "MMMM").daysInMonth();
		}else{
			var daysNo = moment().daysInMonth();			
		}
		//var dayName = moment("2017-09-30").format('dddd');
		var year = moment().format('YYYY');
		var month = moment($scope.SpWrkHrs.spMonth , "MMMM").format('MM');

		$scope.slotDateList = [];
    	for(var i = 1 ; i <= daysNo ; i++){
    		var obj = {'dateNo':0,'dayOfWeek':''};
    		var date = year+'-'+month+'-'+i;
    		var dayOfWeek = moment(date).format('ddd');
    		obj.dateNo = i;
    		obj.dayOfWeek = dayOfWeek;
    		$scope.slotDateList.push(obj);
    	}      


		$scope.wrkHrsSlotsForHome = [
							{							
								"label" : 	"07:30 AM - 09:00 AM",
								"slotNo": "1", 
								"startTime": "07:30AM",
								"endTime": "09:00AM"
							},
							{
								"label": 	"09:00 AM - 10:30 AM",
								"slotNo": "2", 
								"startTime": "09:00AM",
								"endTime": "10:30AM"
							},
							{
								"label": 	"10:30 AM - 12:00 PM",	
								"slotNo": "3", 
								"startTime": "10:30AM",
								"endTime": "12:00PM"					
							},
							{
								"label": 	"12:00 PM - 13:30 PM",
								"slotNo": "4", 
								"startTime": "12:00PM",
								"endTime": "13:30PM"
							},
							{
								"label": 	"15:00 PM - 16:30 PM",	
								"slotNo": "5", 	
								"startTime": "15:00PM",
								"endTime": "16:30PM"
							},
							{
								"label": 	"16:30 PM - 18:00 PM",
								"slotNo": "6", 
								"startTime": "16:30PM",
								"endTime": "18:00PM"
							},
							{
								"label": 	"18:00 PM - 19:30 PM",	
								"slotNo": "7", 
								"startTime": "18:00PM",
								"endTime": "19:30PM"					
							},
							{
								"label": 	"19:30 PM - 21:00 PM",
								"slotNo": "8", 
								"startTime": "19:30PM",
								"endTime": "21:00PM"							
							}
						];

		//set veiw table as per current date
		setTimeout(function() {
			$scope.todaysDate = moment().format("D-MM-YYYY");
			$scope.loadSlotViewTable($scope.todaysDate);
		}, 300);


		$scope.getServicesAndProducts();


	}

	$scope.loadSlotViewTable = function(dateString){
		setTimeout(function() {

			//var cityId = $scope.SpWrkHrs.spSlotCity;
			//$scope.populateCityBasedSps(cityId);

			adminApi.getAllSlot(dateString)
			.success(function(data, status, headers, config){

				$scope.allSpSLots = data.payload;

				for(var m = 0;m< $scope.cityBasedSpsForViewSlot.length;m++){
					for(var n = 0 ; n < $scope.wrkHrsSlotsForHome.length; n++){
						var tdId1 = $scope.wrkHrsSlotsForHome[n].startTime+"_"+$scope.cityBasedSpsForViewSlot[m]._id;
						document.getElementById(tdId1).style.backgroundColor = "";
					}
				}

				for(var i = 0;i< $scope.cityBasedSpsForViewSlot.length;i++){
					for(var j = 0 ; j < $scope.wrkHrsSlotsForHome.length; j++){
						var tdId = $scope.wrkHrsSlotsForHome[j].startTime+"_"+$scope.cityBasedSpsForViewSlot[i]._id;
						for(var k = 0; k< $scope.allSpSLots.length; k++){

							var start = (($scope.wrkHrsSlotsForHome[j].startTime).substring(0, 5)).replace(":","");
							if($scope.cityBasedSpsForViewSlot[i]._id == $scope.allSpSLots[k].service_provider_id && start == $scope.allSpSLots[k].startTime){
								
								if($scope.allSpSLots[k].is_weeklyOff == true){
									document.getElementById(tdId).style.backgroundColor = 'yellow';
								}

								if( $scope.allSpSLots[k].is_leave == true){
									document.getElementById(tdId).style.backgroundColor = 'red';
								}

								if( $scope.allSpSLots[k].is_leave == false && $scope.allSpSLots[k].is_allocated == true){
									document.getElementById(tdId).style.backgroundColor = '#2fca2c'; //green
								}

								/*if($scope.allSpSLots[k].appointment_id != null && $scope.allSpSLots[k].appointment_id != undefined){
									document.getElementById(tdId).style.backgroundColor = '#c1bfbb'; //grey
								}*/

								if($scope.allSpSLots[k].is_blocked && $scope.allSpSLots[k].is_blocked == true){
									document.getElementById(tdId).style.backgroundColor = '#c1bfbb'; //grey
								}	


							}

						}						
					}
				}

			})
			.error(function(data, status, headers, config){
				console.log("Error While Opening Slots!");
			});

		},300);

	}

	/*$scope.loadSlotViewTableByDate = function(){
		//alert($("#slotDate").val());
		var date = $("#slotDate").val();

		var dateString = (moment(date).format("D-MM-YYYY")).toString();

		alert(dateString);

		$scope.loadSlotViewTable(dateString);
	}*/


	$scope.setHorizontalChecked = function(row) {
		var dayNo = moment().format('D');

		var currentMonthNo = moment().format("M");
    	var selectedMonthNO = moment($scope.SpWrkHrs.spMonth , "MMMM").format('M');
    	var year = moment().format('YYYY');



    	if(parseInt(currentMonthNo) == parseInt(selectedMonthNO) && (year == $scope.spYear)){
    		dayNo = dayNo - 1;
    	}else if (parseInt(currentMonthNo) > parseInt(selectedMonthNO) && (year >= $scope.spYear)){
    		dayNo = $scope.slotDateList.length;
    	}else{
    		dayNo = 0;
    	}

		for(var i = 0 ; i < $scope.wrkHrsSlotsForHome.length; i++){
			//console.log($scope.wrkHrsSlotsForHome[i].label);
			//console.log($scope.wrkHrsSlotsForHome[i].slotNo);
			if(row.slotNo == $scope.wrkHrsSlotsForHome[i].slotNo){		
				for(var j = dayNo ; j < $scope.slotDateList.length; j++){				
					if($scope.wrkHrsSlotsForHome[i].slotNo==(i+1).toString()){
						var tdCellID = $scope.wrkHrsSlotsForHome[i].startTime+"_"+$scope.slotDateList[j].dateNo;

						if($('#tick-1').is(':checked') && row.slotNo == "1"){	
							//var tdSlotId = $scope.wrkHrsSlotsForHome[i].label+'-'+$scope.slotDateList[i].dateNo+'-tick';
							var v = 'subTick1'+(j+1);
							if((document.getElementById(tdCellID).style.pointerEvents != "none") && (document.getElementById(tdCellID).style.backgroundColor != 'yellow') && (document.getElementById(tdCellID).style.backgroundColor != 'red')){
								$scope[v] = true;
							}							
							
						}else if(row.slotNo == "1"){
							var v = 'subTick1'+(j+1);	
							if(document.getElementById(tdCellID).style.pointerEvents != "none"){				
								$scope[v] = false;
							}						
						}

						if($('#tick-2').is(':checked') && row.slotNo == "2"){	
							//var tdSlotId = $scope.wrkHrsSlotsForHome[i].label+'-'+$scope.slotDateList[i].dateNo+'-tick';
							var v = 'subTick2'+(j+1);
							if((document.getElementById(tdCellID).style.pointerEvents != "none") && (document.getElementById(tdCellID).style.backgroundColor != 'yellow') && (document.getElementById(tdCellID).style.backgroundColor != 'red')){
								$scope[v] = true;
							}
						}else if(row.slotNo == "2"){
							var v = 'subTick2'+(j+1);
							if(document.getElementById(tdCellID).style.pointerEvents != "none"){		
								$scope[v] = false;
							}
						}

						if($('#tick-3').is(':checked') && row.slotNo == "3"){	
							//var tdSlotId = $scope.wrkHrsSlotsForHome[i].label+'-'+$scope.slotDateList[i].dateNo+'-tick';
							var v = 'subTick3'+(j+1);
							if((document.getElementById(tdCellID).style.pointerEvents != "none") && (document.getElementById(tdCellID).style.backgroundColor != 'yellow') && (document.getElementById(tdCellID).style.backgroundColor != 'red')){
								$scope[v] = true;
							}
						}else if(row.slotNo == "3"){
							var v = 'subTick3'+(j+1);
							if(document.getElementById(tdCellID).style.pointerEvents != "none"){				
								$scope[v] = false;
							}
						}

						if($('#tick-4').is(':checked') && row.slotNo == "4"){	
							//var tdSlotId = $scope.wrkHrsSlotsForHome[i].label+'-'+$scope.slotDateList[i].dateNo+'-tick';
							var v = 'subTick4'+(j+1);
							if((document.getElementById(tdCellID).style.pointerEvents != "none") && (document.getElementById(tdCellID).style.backgroundColor != 'yellow') && (document.getElementById(tdCellID).style.backgroundColor != 'red')){
								$scope[v] = true;
							}
						}else if(row.slotNo == "4"){
							var v = 'subTick4'+(j+1);
							if(document.getElementById(tdCellID).style.pointerEvents != "none"){				
								$scope[v] = false;
							}
						}

						if($('#tick-5').is(':checked') && row.slotNo == "5"){	
							//var tdSlotId = $scope.wrkHrsSlotsForHome[i].label+'-'+$scope.slotDateList[i].dateNo+'-tick';
							var v = 'subTick5'+(j+1);
							if((document.getElementById(tdCellID).style.pointerEvents != "none") && (document.getElementById(tdCellID).style.backgroundColor != 'yellow') && (document.getElementById(tdCellID).style.backgroundColor != 'red')){
								$scope[v] = true;
							}
						}else if(row.slotNo == "5"){
							var v = 'subTick5'+(j+1);
							if(document.getElementById(tdCellID).style.pointerEvents != "none"){				
								$scope[v] = false;
							}
						}

						if($('#tick-6').is(':checked') && row.slotNo == "6"){	
							//var tdSlotId = $scope.wrkHrsSlotsForHome[i].label+'-'+$scope.slotDateList[i].dateNo+'-tick';
							var v = 'subTick6'+(j+1);
							if((document.getElementById(tdCellID).style.pointerEvents != "none") && (document.getElementById(tdCellID).style.backgroundColor != 'yellow') && (document.getElementById(tdCellID).style.backgroundColor != 'red')){
								$scope[v] = true;
							}
						}else if(row.slotNo == "6"){
							var v = 'subTick6'+(j+1);
							if(document.getElementById(tdCellID).style.pointerEvents != "none"){				
								$scope[v] = false;
							}
						}

						if($('#tick-7').is(':checked') && row.slotNo == "7"){	
							//var tdSlotId = $scope.wrkHrsSlotsForHome[i].label+'-'+$scope.slotDateList[i].dateNo+'-tick';
							var v = 'subTick7'+(j+1);
							if((document.getElementById(tdCellID).style.pointerEvents != "none") && (document.getElementById(tdCellID).style.backgroundColor != 'yellow') && (document.getElementById(tdCellID).style.backgroundColor != 'red')){
								$scope[v] = true;
							}
						}else if(row.slotNo == "7"){
							var v = 'subTick7'+(j+1);
							if(document.getElementById(tdCellID).style.pointerEvents != "none"){				
								$scope[v] = false;
							}
						}

						if($('#tick-8').is(':checked') && row.slotNo == "8"){	
							//var tdSlotId = $scope.wrkHrsSlotsForHome[i].label+'-'+$scope.slotDateList[i].dateNo+'-tick';
							var v = 'subTick8'+(j+1);
							if((document.getElementById(tdCellID).style.pointerEvents != "none") && (document.getElementById(tdCellID).style.backgroundColor != 'yellow') && (document.getElementById(tdCellID).style.backgroundColor != 'red')){
								$scope[v] = true;
							}
						}else if(row.slotNo == "8"){
							var v = 'subTick8'+(j+1);
							if(document.getElementById(tdCellID).style.pointerEvents != "none"){				
								$scope[v] = false;
							}
						}


					}
				}

			}

		}

	}

	$scope.resetGlobalSlotTick = function() {
		
		//alert($scope.spYear)
		var dayNo = 0;
		var currentMonthNo = moment().format("M");
    	var selectedMonthNO = moment($scope.SpWrkHrs.spMonth , "MMMM").format('M');
    	var year = moment().format('YYYY');

    	if(parseInt(currentMonthNo) == parseInt(selectedMonthNO) && (year == $scope.spYear)){
            dayNo = moment().format('D');
    	}else if (parseInt(currentMonthNo) > parseInt(selectedMonthNO) && (year >= $scope.spYear)){
    		dayNo = 32;
    	}else{
    		dayNo = 1;
    	}

		if($scope.slotChecked == false){
			/*$scope.subTick1 = false;
			$scope.subTick2 = false;
			$scope.subTick3 = false;
			$scope.subTick4 = false;
			$scope.subTick5 = false;
			$scope.subTick6 = false;
			$scope.subTick7 = false;
			$scope.subTick8 = false;*/

			for(var i = dayNo ; i<= $scope.slotDateList.length ; i++){
				for(var j= 1 ; j <= $scope.wrkHrsSlotsForHome.length ; j ++){
					var tdCellID = $scope.wrkHrsSlotsForHome[j-1].startTime+"_"+$scope.slotDateList[i-1].dateNo;
					var v = 'subTick'+j+i;
					if(document.getElementById(tdCellID).style.pointerEvents != "none"){
				   	 	$scope[v] = false;
				   	}
				}
		
			}
		}else{
			/*$scope.subTick1 = true;
			$scope.subTick2 = true;
			$scope.subTick3 = true;
			$scope.subTick4 = true;
			$scope.subTick5 = true;
			$scope.subTick6 = true;
			$scope.subTick7 = true;
			$scope.subTick8 = true;*/
			for(var i = dayNo ; i<= $scope.slotDateList.length ; i++){
				for(var j= 1 ; j <= $scope.wrkHrsSlotsForHome.length ; j ++){
					var tdCellID = $scope.wrkHrsSlotsForHome[j-1].startTime+"_"+$scope.slotDateList[i-1].dateNo;
					var v = 'subTick'+j+i;
				    if((document.getElementById(tdCellID).style.pointerEvents) != "none" && (document.getElementById(tdCellID).style.backgroundColor != 'yellow') && (document.getElementById(tdCellID).style.backgroundColor != 'red')){
				   		 $scope[v] = true;
				   	}
				}
				
			}
		}
	}

	$scope.getTdSlot = function(slot,date) {

		if($scope.markLeave == false){
			var tdId= ('subTick'+slot.slotNo+""+date.dateNo);		
			if($scope[tdId] == false){
				$scope[tdId] = true;
			}else{
				$scope[tdId] = false;
			}
		}else{
			var td = slot.startTime+'_'+date.dateNo;
			var tickSlot = 'subTick'+slot.slotNo+""+date.dateNo;
			//alert(td);
			if(document.getElementById(td).style.backgroundColor != "yellow"){
				if(document.getElementById(td).style.backgroundColor == 'red'){

					document.getElementById(td).style.backgroundColor = 'white';
				}else{
					document.getElementById(td).style.backgroundColor = 'red';
					
					if($scope[tickSlot] == true && document.getElementById(td).style.pointerEvents != "none"){
						$scope[tickSlot] = false;
						document.getElementById(td).style.backgroundColor = 'red';
					}else{
						if($scope[tickSlot] == true){
							document.getElementById(td).style.backgroundColor = '#c1bfbb';
						}
					}
				}
			}	
		}

	}

	$scope.markLeaves = function(dateNO) {
		if($scope.markLeave == true){
			for(var i = 0; i< $scope.wrkHrsSlotsForHome.length; i++){
				var td = $scope.wrkHrsSlotsForHome[i].startTime +"_"+dateNO;
				var tickSlot = 'subTick'+$scope.wrkHrsSlotsForHome[i].slotNo+""+dateNO;
				if((document.getElementById(td).style.backgroundColor != "yellow") && (document.getElementById(td).style.pointerEvents != "none")){
					if(document.getElementById(td).style.backgroundColor == 'red'){
						document.getElementById(td).style.backgroundColor = 'white';
					}else{
						document.getElementById(td).style.backgroundColor = 'red';

						if($scope[tickSlot] == true && document.getElementById(td).style.pointerEvents != "none"){
							$scope[tickSlot] = false;
							document.getElementById(td).style.backgroundColor = 'red';
						}else{
							if($scope[tickSlot] == true){
								document.getElementById(td).style.backgroundColor = '#c1bfbb';
							}
						}
					}
				}
			}
		}
	}

	$scope.redirectToSlotAllocation = function() {
		$scope.month = moment().format("MMMM");
		//$('.dateTimePickerSlot').val(moment().format("YYYY-MMM-DD"));
		$('.dateTimePickerSlot').val(moment().format("DD-MMM-YYYY"));
		$('.dateTimePickerYearMonth').val(moment().format("MMMM-YYYY"));
		

		$scope.SpWrkHrs.spMonth = $scope.month;
		$scope.slotChecked = false;
		for(var i = 1 ; i<= 31 ; i++){
			for(var j= 1 ; j <= 8 ; j ++){
				var v = 'subTick'+j+i;
			    $scope[v] = false;
			}
	
		}
		for(var tick = 1 ; tick <= 8 ; tick ++){
			document.getElementById('tick-'+tick).checked = false;
		}

		if($scope.SpWrkHrs.spNamesIdSlot != "All" && $scope.SpWrkHrs.spNamesIdSlot != undefined){
			$scope.slotViewTableFlag = false;
		}else{
			$scope.slotViewTableFlag = true;
			$scope.todaysDate = moment().format("D-MM-YYYY");
			$scope.loadSlotViewTable($scope.todaysDate);
		}

		if($scope.SpWrkHrs.spMonth != undefined){
			var daysNo = moment($scope.SpWrkHrs.spMonth , "MMMM").daysInMonth();
		}else{
			var daysNo = moment().daysInMonth();			
		}
		//var dayName = moment("2017-09-30").format('dddd');
		var year = moment().format('YYYY');
		var month = moment($scope.SpWrkHrs.spMonth , "MMMM").format('MM');

		$scope.slotDateList = [];
    	for(var i = 1 ; i <= daysNo ; i++){
    		var obj = {'dateNo':0,'dayOfWeek':''};
    		var date = year+'-'+month+'-'+i;
    		var dayOfWeek = moment(date).format('ddd');
    		obj.dateNo = i;
    		obj.dayOfWeek = dayOfWeek;
    		$scope.slotDateList.push(obj);
    	}     

    	//set weekly off as sunday by default for current month

    	setTimeout(function() {
			/*for(var i = 0; i< $scope.wrkHrsSlotsForHome.length; i++){
				for(var j = 0 ; j < $scope.slotDateList.length; j++){
					if($scope.slotDateList[j].dayOfWeek == "Sun"){			
						var td = $scope.wrkHrsSlotsForHome[i].startTime +"_"+ $scope.slotDateList[j].dateNo;			
					    document.getElementById(td).style.backgroundColor = 'yellow';	
									
					}	
				}
			}*/

			//freeze grid for past dates
			var dayNo = moment().format('D');
			for(var i = 0; i< $scope.wrkHrsSlotsForHome.length; i++){
				for(var j = 0 ; j < (dayNo-1) ; j++){
								
						var td = $scope.wrkHrsSlotsForHome[i].startTime +"_"+ $scope.slotDateList[j].dateNo;
						var th1 = $scope.slotDateList[j].dateNo;
						var th2 = $scope.slotDateList[j].dateNo+"_"+ $scope.slotDateList[j].dayOfWeek;
								
					    document.getElementById(td).style.opacity = "0.2";
					    document.getElementById(td).style.pointerEvents = "none";
					    document.getElementById(td).style.backgroundColor = '#d4d4b4';

					
					    document.getElementById(th1).style.backgroundColor = '#d4d4b4';
					    document.getElementById(th1).style.pointerEvents = "none";

					    document.getElementById(th2).style.backgroundColor = '#d4d4b4';
					    document.getElementById(th2).style.pointerEvents = "none";
										
				}
			}


			var spid = $scope.SpWrkHrs.spNamesIdSlot;
			var month = $scope.SpWrkHrs.spMonth;
			$scope.spYear = moment().format('YYYY');

			$scope.loadSlotTickTable(spid,month,$scope.spYear);
		

		}, 200);		

	}


     /*$("#spMonthId").datetimepicker({			
			format: 'MMMM',
            viewMode: 'months', 
             // pickTime: false, 			
		  }).on("dp.change", function (data) {

    	 setTimeout(function() {
          $scope.monthString = document.getElementById(".dateTimePickerOnlyMonth").value; 

     	 }, 50);

          var arrayMonthString =  $scope.monthString.split('-');

          $scope.SpWrkHrs.spMonth = arrayMonthString[0];
          $scope.SpWrkHrs.spYear = arrayMonthString[1];

          $scope.resetSlotDate();

    });*/

	$(".dateTimePickerYearMonth").datepicker({ 
        dateFormat: 'MM-yy',
        changeMonth: true,
        changeYear: true,
        //showButtonPanel: true,

        onClose: function(dateText, inst) {  
            var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val(); 
            var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val(); 
            $(this).val($.datepicker.formatDate('MM-yy', new Date(year, month, 1)));

            $scope.SpWrkHrs.spMonth = $.datepicker.formatDate('MM', new Date(year, month, 1));
            $scope.spYear = $.datepicker.formatDate('yy', new Date(year, month, 1));

			$scope.resetSlotDate();

        }
    });

    $(".dateTimePickerYearMonth").focus(function () {
        $(".ui-datepicker-calendar").hide();
        $("#ui-datepicker-div").position({
            my: "center top",
            at: "center bottom",
            of: $(this)
        });    
    });


	$scope.resetSlotDate = function(){

		$scope.month = $scope.SpWrkHrs.spMonth;
		$scope.saveBtn = true;
	
		//to deselect all cells according to month
		$scope.slotChecked = false;		
		for(var i = 1 ; i<= 31 ; i++){
			for(var j= 1 ; j <= 8 ; j ++){
				var v = 'subTick'+j+i;
			    $scope[v] = false;
			}
	
		}

		for(var tick = 1 ; tick <= 8 ; tick ++){
			document.getElementById('tick-'+tick).checked = false;
		}

		//to populate $scope.slotDateList according to month selection
		if($scope.SpWrkHrs.spMonth != undefined){
			var daysNo = moment($scope.SpWrkHrs.spMonth , "MMMM").daysInMonth();
		}else{
			var daysNo = moment().daysInMonth();			
		}

		//var year = moment().format('YYYY');
		var year = $scope.spYear;
		var month = moment($scope.SpWrkHrs.spMonth , "MMMM").format('MM');

		var curYear = moment().format('YYYY');

		$scope.slotDateList = [];
    	for(var i = 1 ; i <= daysNo ; i++){
    		var obj = {'dateNo':0,'dayOfWeek':''};
    		var date = year+'-'+month+'-'+i;
    		var dayOfWeek = moment(date).format('ddd');
    		obj.dateNo = i;
    		obj.dayOfWeek = dayOfWeek;
    		$scope.slotDateList.push(obj);
    	}   


    	$scope.SpWrkHrs.spWeeklyOff = "Select weekly off";

    	var currentMonthNo = moment().format("M");
    	var selectedMonthNO = moment($scope.SpWrkHrs.spMonth , "MMMM").format('M');
    	

    	console.log(year);
		console.log($scope.month);
		console.log(daysNo);

		/*console.log($scope.slotDateList);

		console.log(currentMonthNo);
    	console.log(selectedMonthNO);*/
    	
    	var spid = $scope.SpWrkHrs.spNamesIdSlot;
		var month = $scope.SpWrkHrs.spMonth;

		$scope.loadSlotTickTable(spid,month,year);	

    	setTimeout(function() {

    		if(selectedMonthNO == currentMonthNo && year == curYear){
    			console.log('equal');
	    		var dayNo = moment().format('D');
				for(var i = 0; i< $scope.wrkHrsSlotsForHome.length; i++){
					for(var j = 0 ; j < (dayNo-1) ; j++){
									
							var td = $scope.wrkHrsSlotsForHome[i].startTime +"_"+ $scope.slotDateList[j].dateNo;
							var th1 = $scope.slotDateList[j].dateNo;
							var th2 = $scope.slotDateList[j].dateNo+"_"+ $scope.slotDateList[j].dayOfWeek;
									
						    document.getElementById(td).style.opacity = "0.2";
						    document.getElementById(td).style.pointerEvents = "none";
						    document.getElementById(td).style.backgroundColor = '#d4d4b4';
						
						    document.getElementById(th1).style.backgroundColor = '#d4d4b4';
						    document.getElementById(th1).style.pointerEvents = "none";

						    document.getElementById(th2).style.backgroundColor = '#d4d4b4';
						    document.getElementById(th2).style.pointerEvents = "none";
			
						    //$scope.slotChecked = true;
											
					}
				}

	    	}else if(parseInt(selectedMonthNO) <= parseInt(currentMonthNo) && (year <= curYear)){
		    	console.log('less');
		    	for(var i = 0; i< $scope.wrkHrsSlotsForHome.length; i++){	    		
					for(var j = 0 ; j < $scope.slotDateList.length; j++){			
							var td1 =$scope.wrkHrsSlotsForHome[i].startTime +"_"+ $scope.slotDateList[j].dateNo;
							var th1 = $scope.slotDateList[j].dateNo;
							var th2 = $scope.slotDateList[j].dateNo+"_"+ $scope.slotDateList[j].dayOfWeek;

							document.getElementById(td1).style.opacity = "0.2";
						    document.getElementById(td1).style.pointerEvents = "none";
						    document.getElementById(td1).style.backgroundColor = '#d4d4b4';

						    document.getElementById(th1).style.backgroundColor = '#d4d4b4';
						    document.getElementById(th1).style.pointerEvents = "none";

						    document.getElementById(th2).style.backgroundColor = '#d4d4b4';
						    document.getElementById(th2).style.pointerEvents = "none";


						    //console.log(td1);

						   // $scope.slotChecked = false;
					}
				}

				$scope.saveBtn = false;

			}

		}, 300);	

		var spid = $scope.SpWrkHrs.spNamesIdSlot;
		var month = $scope.SpWrkHrs.spMonth;

		$scope.loadSlotTickTable(spid,month,year);		

	}


	$scope.loadSlotTickTable = function(spid,month,year){
		adminApi.getSpSlot(spid,month,year)
			.success(function(data, status, headers, config){

				$scope.spSlotList = data.payload;
				//console.log(data.payload);

				var dateStringArray = [];

				$scope.spUniqueSlot = [];
				for(var i=0;i<$scope.spSlotList.length;i++){
					if(dateStringArray.indexOf($scope.spSlotList[i].dateString+"_"+$scope.spSlotList[i].startTime) == -1){
						$scope.spUniqueSlot.push($scope.spSlotList[i]);
						dateStringArray.push($scope.spSlotList[i].dateString+"_"+$scope.spSlotList[i].startTime);
					}
				}

				$scope.SpWrkHrs.spWeeklyOff = "Select weekly off";

				for(var i = 0; i< $scope.wrkHrsSlotsForHome.length; i++){
					for(var j = 0 ; j < $scope.slotDateList.length; j++){
						var tdSlot = $scope.wrkHrsSlotsForHome[i].startTime +"_"+ $scope.slotDateList[j].dateNo;
						var tickSlot = 'subTick'+$scope.wrkHrsSlotsForHome[i].slotNo+""+$scope.slotDateList[j].dateNo;

						var startTime = (($scope.wrkHrsSlotsForHome[i].startTime).substring(0, 5)).replace(":","");
						var DateNo = $scope.slotDateList[j].dateNo;
						for(var k =0;k < $scope.spUniqueSlot.length; k++){
							var slotStart = $scope.spUniqueSlot[k].startTime;
							//console.log($scope.spUniqueSlot[k].dateString);
							var date = ($scope.spUniqueSlot[k].dateString).split('-');
							var slotDateNO = date[0];

							if($scope.spUniqueSlot[k].weekly_off != undefined){
								$scope.SpWrkHrs.spWeeklyOff = $scope.spUniqueSlot[k].weekly_off;
							}else{
								$scope.SpWrkHrs.spWeeklyOff = "Select weekly off";
							}
							

							if((startTime == slotStart) && (DateNo == slotDateNO) && ($scope.SpWrkHrs.spMonth == $scope.spUniqueSlot[k].month) && ($scope.spUniqueSlot[k].is_allocated == true)){
								$scope[tickSlot] = true;
								//$scope.setWeeklyOff();

								if($scope.spUniqueSlot[k].is_weeklyOff == true){
										document.getElementById(tdSlot).style.backgroundColor = 'yellow';
								}
								
								if($scope.spUniqueSlot[k].is_leave == true){
									document.getElementById(tdSlot).style.backgroundColor = 'red';
								}

								/*if($scope.spUniqueSlot[k].appointment_id != null && $scope.spUniqueSlot[k].appointment_id != undefined){
									document.getElementById(tdSlot).style.backgroundColor = '#d8d7d5';
									document.getElementById(tdSlot).style.pointerEvents = "none";
									//alert("Hi");
								}*/
								if($scope.spUniqueSlot[k].is_blocked && $scope.spUniqueSlot[k].is_blocked == true){
									document.getElementById(tdSlot).style.backgroundColor = '#d8d7d5';
									document.getElementById(tdSlot).style.pointerEvents = "none";
									//console.log("Hi");
								}
							}else{
								if((startTime == slotStart) && (DateNo == slotDateNO) && ($scope.SpWrkHrs.spMonth == $scope.spUniqueSlot[k].month) && ($scope.spUniqueSlot[k].is_allocated == false)){
									
									if($scope.spUniqueSlot[k].is_weeklyOff == true){
										document.getElementById(tdSlot).style.backgroundColor = 'yellow';
									}

									if($scope.spUniqueSlot[k].is_leave == true){
										document.getElementById(tdSlot).style.backgroundColor = 'red';
									}
								}
							}
						}
					}
				}

			})
			.error(function(data, status, headers, config){
				console.log("Error while recieving sp slot...");
			});

	}

	$scope.setWeeklyOff = function(){

		var dayNo = 0;
		var currentMonthNo = moment().format("M");
    	var selectedMonthNO = moment($scope.SpWrkHrs.spMonth , "MMMM").format('M');
    	var year = moment().format('YYYY');

    	//alert($scope.SpWrkHrs.spMonth);

    	if(parseInt(currentMonthNo) == parseInt(selectedMonthNO) && (year == $scope.spYear)){
            dayNo = (moment().format('D')) - 1;
    	}else if (parseInt(currentMonthNo) > parseInt(selectedMonthNO) && (year >= $scope.spYear)){
    		dayNo = 32;
    	}else{
    		dayNo = 0;
    	}


		for(var i = 0; i< $scope.wrkHrsSlotsForHome.length; i++){
			for(var j = dayNo ; j < $scope.slotDateList.length; j++){			
				var tdCell = $scope.wrkHrsSlotsForHome[i].startTime +"_"+ $scope.slotDateList[j].dateNo;					
				    if(document.getElementById(tdCell).style.backgroundColor == 'yellow'){
				    	//document.getElementById(tdCell).style.backgroundColor = 'white';
				    	document.getElementById(tdCell).style.backgroundColor = null;
				    	//console.log(tdCell)
				    }											
			}
		}

	    var day = "";

		if($scope.SpWrkHrs.spWeeklyOff == "Sunday"){
			day = "Sun";
		}else if($scope.SpWrkHrs.spWeeklyOff == "Monday"){
			day = "Mon";
		}else if($scope.SpWrkHrs.spWeeklyOff == "Tuesday"){
			day = "Tue";			
		}else if($scope.SpWrkHrs.spWeeklyOff == "Wednesday"){
			day = "Wed";
		}else if($scope.SpWrkHrs.spWeeklyOff == "Thursday"){
			day = "Thu";
		}else if($scope.SpWrkHrs.spWeeklyOff == "Friday"){
			day = "Fri";
		}else if($scope.SpWrkHrs.spWeeklyOff == "Saturday"){
			day = "Sat";
		}


    	for(var i = 0; i< $scope.wrkHrsSlotsForHome.length; i++){
			for(var j = dayNo ; j < $scope.slotDateList.length; j++){
				if($scope.slotDateList[j].dayOfWeek == day){			
					var td = $scope.wrkHrsSlotsForHome[i].startTime +"_"+ $scope.slotDateList[j].dateNo;

					var tickSlot = 'subTick'+$scope.wrkHrsSlotsForHome[i].slotNo+""+$scope.slotDateList[j].dateNo;
					//console.log(td);
					if(document.getElementById(td).style.backgroundColor != 'red'){
						document.getElementById(td).style.backgroundColor = 'yellow';

						if($scope[tickSlot] == true && document.getElementById(td).style.pointerEvents != "none"){
							$scope[tickSlot] = false;
							document.getElementById(td).style.backgroundColor = 'yellow';
						}else{
							if($scope[tickSlot] == true){
								document.getElementById(td).style.backgroundColor = '#c1bfbb';
							}
						}	
					}						    
								
				}	
			}
		}

		
	}

	$scope.saveSlotData = function() {

		$scope.slotInfo = [];
		$scope.serviceLocation = "";
		
        if($scope.SpWrkHrs.spServiceLocationSlot == '0'){
        	$scope.serviceLocation = "Home";
        } 

	   	$scope.cityId = $scope.SpWrkHrs.spSlotCity;
		$scope.serviceProvider = $scope.SpWrkHrs.spNamesIdSlot;

        if($scope.SpWrkHrs.spWeeklyOff != 'Select weekly off'){
        	$scope.weekly_off = $scope.SpWrkHrs.spWeeklyOff;
        }else{
        	$scope.weekly_off = null;
        }

        $scope.flag='true';

     	for(var i = 0; i< $scope.wrkHrsSlotsForHome.length; i++){
			for(var j = 0 ; j < $scope.slotDateList.length; j++){
				var tdSlot = $scope.wrkHrsSlotsForHome[i].startTime +"_"+ $scope.slotDateList[j].dateNo;
				var tickSlot = 'subTick'+$scope.wrkHrsSlotsForHome[i].slotNo+""+$scope.slotDateList[j].dateNo;
				//console.log("tdSlot");
				if(document.getElementById(tdSlot).style.pointerEvents != "none" || document.getElementById(tdSlot).style.opacity != "0.2"){
					//var year1 = moment().format('YYYY');
					var year1 = $scope.spYear;
					var month1 = moment($scope.SpWrkHrs.spMonth , "MMMM").format('MM');
					var day1 = $scope.slotDateList[j].dateNo;
					$scope.dateString1 = day1+"-"+month1+"-"+year1;
   				
	   				if($scope.flag=='true'){
	   					$scope.initdate = (moment($scope.dateString1, "DD-MM-YYYY").valueOf())/1000;
	   					$scope.flag='false';
	   				}
				}
				    


				if(($scope[tickSlot] == true && document.getElementById(tdSlot).style.pointerEvents != "none") || 
				   (document.getElementById(tdSlot).style.backgroundColor == 'red' && document.getElementById(tdSlot).style.pointerEvents != "none") ||
				   (document.getElementById(tdSlot).style.backgroundColor == 'yellow' && document.getElementById(tdSlot).style.pointerEvents != "none")){

					var start = (($scope.wrkHrsSlotsForHome[i].startTime).substring(0, 5)).replace(":","");
					var end = (($scope.wrkHrsSlotsForHome[i].endTime).substring(0, 5)).replace(":","");

					if(document.getElementById(tdSlot).style.backgroundColor == 'red'){
						$scope.isLeave = true;
					}else{
						$scope.isLeave = false;
					}

					//var year = moment().format('YYYY');
					var year = $scope.spYear;
					var month = moment($scope.SpWrkHrs.spMonth , "MMMM").format('MM');
					var day = $scope.slotDateList[j].dateNo;
					$scope.dateString = day+"-"+month+"-"+year;
	   				$scope.date = (moment($scope.dateString, "DD-MM-YYYY").valueOf())/1000;

	   				if($scope[tickSlot] == true){
	   					$scope.isAllocated = true;
	   				}else{
	   					$scope.isAllocated = false;
	   				}

	   				if(document.getElementById(tdSlot).style.backgroundColor == 'yellow'){
   						$scope.isWeekend = true;
   					}else{
   						$scope.isWeekend = false;
   					}

					var obj = {		
						"service_provider_id":$scope.SpWrkHrs.spNamesIdSlot,
						"service_location":$scope.serviceLocation,
						"dateString":$scope.dateString,
						"date":$scope.date,
						"startTime":start,
						"endTime":end,	
						"weekly_off":$scope.weekly_off,
						"is_leave":$scope.isLeave,
						"city_id":$scope.SpWrkHrs.spSlotCity,
						"month":$scope.SpWrkHrs.spMonth,
						"is_allocated":$scope.isAllocated,
						"is_weeklyOff":$scope.isWeekend

					};
					
					$scope.slotInfo.push(obj);
				}
      				
			}
		}

		//console.log($scope.slotInfo);
		//alert($scope.initdate);

		var result = confirm("Do you want to update the slot?");
		if(result == true) {
			adminApi.addSlotInfo($scope.slotInfo,$scope.initdate,$scope.SpWrkHrs.spNamesIdSlot,$scope.SpWrkHrs.spMonth)
			.success(function(data, status, headers, config){
				alert("Your slot request is processed successfully!")
				$scope.resetSlotDate();

			})
			.error(function(data, status, headers, config){
				console.log("Error While Opening Slots!");
			});

		}

	}

	$scope.cancelSlotData = function() {
		var result = confirm("Do you want to discard changes?");
		if(result == true) {
			$scope.resetSlotDate();
		}		
	}


	$('.dateTimePickerSlot').datepicker({
			//dateFormat: 'yy-M-dd'
			dateFormat: 'dd-M-yy'
		})
	    .on("change", function (e) {
	    //console.log("Date changed: ", e.target.value);
	    //alert($(this).val())
	    $scope.SpWrkHrs.slotDate = $(this).val();
	    var date = $(this).val();
		var dateString = (moment(date).format("D-MM-YYYY")).toString();

		//$scope.curdate = moment(date).format("YYYY-MMM-DD");
		$scope.curdate = moment(date).format("DD-MMM-YYYY");
		$scope.day = (moment(date).format("dddd")).toString();
		$scope.loadSlotViewTable(dateString);

		//alert($scope.SpWrkHrs.slotDate);
	});


	$scope.setSlotViewTableByZone = function() {
		$scope.zoneid = $scope.SpWrkHrs.spZones;
		$scope.zoneBasedSp =[];
		$scope.allsp = [];

		var date = $scope.SpWrkHrs.slotDate;
		var dateString = (moment(date).format("D-MM-YYYY")).toString();
		$scope.loadSlotViewTable(dateString);

		if($scope.zoneid != "All"){
			for(var i=0;i < $scope.cityBasedSps.length; i++){
				$scope.zoneList =[];
				if($scope.cityBasedSps[i].zones){
					for(var j = 0;j< $scope.cityBasedSps[i].zones.length;j++){
						$scope.zoneList.push($scope.cityBasedSps[i].zones[j].id);
					}
					
					if($scope.zoneList.indexOf($scope.zoneid) !== -1){
						$scope.zoneBasedSp.push($scope.cityBasedSps[i]);		
					}
				}		
			}
			$scope.cityBasedSpsForViewSlot = $scope.zoneBasedSp;	
		}else{
			for(var i=0;i < $scope.cityBasedSps.length; i++){
				if($scope.cityBasedSps[i]._id != 'All'){
					$scope.allsp.push($scope.cityBasedSps[i]);
				}
			}
			$scope.cityBasedSpsForViewSlot = $scope.allsp;	
		}			

	}

	$scope.spawnNotification = function(record) {
		var customer = record.appointment.apptpatientname;
		var physio = record.appointment.spname;
		var scheduledOn = moment(new Date(record.appointment.starttime * 1000)).format("DD MMM YYYY hh:mm A");
		var zone = record.appointment.zone;

		var title = "HealYos New Appointment";
		var options = {
			body: "Customer : " + customer + "\nPhysio Allotted : " + physio + "\nScheduled On : " + scheduledOn + "\nZone : " + zone,
			icon: "https://healyos.com/images/customer_portal/logo.png"
		}
		try {
			var noti = new Notification(title, options);
			setTimeout(noti.close.bind(noti), $scope.notification.timeout);
		} catch(error) {
			console.error("Error while showing notification. " + error);
		}
	}

	$scope.fetchApptsForNotification = function() {
		var appointmentCriteria = {
			fromEpoch : parseInt($scope.notification.servertime / 1000),
			tillEpoch : parseInt(($scope.notification.servertime + $scope.notification.interval) / 1000)
		}

		$scope.notification.servertime = ($scope.notification.servertime + $scope.notification.interval); // Updating servertime field for further use
		adminApi.searchCreateTimeBasedAppointments(appointmentCriteria)
		.success(function(data, status, headers, config){
			if(data.payload.length > 0) {
				for(var i=0; i < data.payload.length; i++) {
					$scope.spawnNotification(data.payload[i]);
				}
			}
		})
		.error(function(data, status, headers, config){
			console.error("Error in fetchApptsForNotification...");
			if(data) {
				console.error(data);
			}
		});
	}

	$scope.setupNotifications = function() {
		if($scope.notification.isSetupDone) {
			return;
		} else {
			$scope.notification.isSetupDone = true;
		}
		if($scope.notification.servertime == 0) {
			console.error("servertime not set for the notifications, cannot setup notifications.");
			return;
		}
		if(!window.Notification) {
			alert("This browser does not support desktop notification, cannot setup notifications.");
			return;
		}
		if (Notification.permission === "granted") {
		    $interval($scope.fetchApptsForNotification, $scope.notification.interval);
		} else if (Notification.permission === 'denied') {
			alert("The notification permission is denied, cannot setup notifications.");
			return;
		} else {
			Notification.requestPermission(function (permission) {
		    	if (permission === "granted") {
		        	$interval($scope.fetchApptsForNotification, $scope.notification.interval);
		    	}
		    });
		}
	}

	$scope.searchAppointments = function(isAdvancedSearch) {
		if(!isAdvancedSearch && $("#advSrcBox").css('display') != "none") {
			$scope.toggleAdvSrcBox();
		}
		var fromDt = getEpochDate($('#aptFromDate').val());
		var tillDt = getEpochDate($('#aptTillDate').val());
		$scope.aptErrorMsg = "";
		if(fromDt > tillDt) {
			$scope.aptErrorMsg = "From date cannot be greater than To Date";
			return;
		}
		$scope.appointmentCriteria.fromEpoch = fromDt;
		$scope.appointmentCriteria.tillEpoch = tillDt;
		if(!isAdvancedSearch) {
			$scope.aptSrcCriteria = "";
		}
		else {
			$scope.aptSrcCriteria = buildAptSrcCriteria($scope.appointmentCriteria);
		}
		adminApi.searchAppointments($scope.appointmentCriteria, isAdvancedSearch)
		.success(function(data, status, headers, config){
			$scope.appointmentsList = buildAppointmentsList(data.payload);
			$scope.sortKey = 'start';
			$scope.reverse = true;
		})
		.error(function(data, status, headers, config){
			$scope.aptErrorMsg = data.error.message;
			$scope.checkSessionTimeout(data);
		});
	}

	$scope.searchActionableAppts = function() {
		adminApi.searchActionableAppts()
		.success(function(data, status, headers, config){
			$scope.actionableApptsList = [];
			var temp_date = null;
			for(var i = 0; i < data.payload.length; i++) {
				var obj = data.payload[i];
				if(obj.appointment.approvalDetails.length == 1) {
					obj.appointment.approvalDetails = obj.appointment.approvalDetails[0];
				}
				else {
					var tmpApprovalDetails = obj.appointment.approvalDetails[0];
					for(var j = 1; j < obj.appointment.approvalDetails.length; j++) {
						if(obj.appointment.approvalDetails[j].requestedOn > tmpApprovalDetails.requestedOn) {
							tmpApprovalDetails = obj.appointment.approvalDetails[j];
						}
					}
					obj.appointment.approvalDetails = tmpApprovalDetails;
				}
				if(obj.appointment.approvalDetails.reason == 'Package Cancellation'){
					$scope.actionableApptsList.push(obj);
				}else if(obj.appointment.approvalDetails.reason != 'Package Cancellation '){
					$scope.actionableApptsList.push(obj);
				}

				//$scope.actionableApptsList.push(obj);
			}
			$scope.actionableAppts.count = $scope.actionableApptsList.length;
		})
		.error(function(data, status, headers, config){
			$scope.aptErrorMsg = data.error.message;
			$scope.checkSessionTimeout(data);
		});
	}

	$scope.searchActionableAppts();

    $scope.searchCancelActionableRecords = function() {
		adminApi.searchCancelActionableRecords()
		.success(function(data, status, headers, config){
			$scope.cancelActionableRecordsList = [];
			for(var i = 0; i < data.payload.length; i++) {
				var obj = data.payload[i];
				$scope.cancelActionableRecordsList.push(obj);
			}
			$scope.cancelActionableAppts.count = $scope.cancelActionableRecordsList.length;
			
		})
		.error(function(data, status, headers, config){
			$scope.aptErrorMsg = data.error.message;
			$scope.checkSessionTimeout(data);
		});
	}

	$scope.searchCancelActionableRecords();

	$scope.approveActionable = function(appt) {
		var data = appt.appointment.approvalDetails;
		data.requestedByIdString = data.requestedById;
		data.isApproved = true;

		adminApi.setActionable(appt.appointment._id, data)
		.success(function(data, status, headers, config) {
			$scope.searchActionableAppts();
			alert("Action performed successfully!");
		})
		.error(function(data, status, headers, config) {
			alert("Failed to perform action! " + data.error.message);
			$scope.checkSessionTimeout(data);
		})
	}

	$scope.approveCancelActionable = function(rec) {

		var data = {
			"_id": rec._id,
			"customer_name": rec.customer_name,
			"customer_id": rec.customer_id,
			"service_provider_name": rec.service_provider_name,
			"service_provider_id": rec.service_provider_id,
			"package_id": rec.package_id,
			"package_code": rec.package_code,
			"approved_on":Math.floor(Date.now() / 1000),
			"status":"approved",
			"approved_free_cancellation_days":rec.propose_free_cancellation_days,
			"approved_valid_days":rec.propose_valid_days,
			"created_on":rec.created_on,
			
		};

		adminApi.setCancelActionable(data)
		.success(function(data, status, headers, config) {
			$scope.searchCancelActionableRecords();
			alert("Action performed successfully!");
		})
		.error(function(data, status, headers, config) {
			alert("Failed to perform action! " + data.error.message);
			$scope.checkSessionTimeout(data);
		})
	}

	$scope.rejectActionable = function(appt) {
		var data = appt.appointment.approvalDetails;
		data.requestedByIdString = data.requestedById;
		data.isApproved = false;

		adminApi.setActionable(appt.appointment._id, data)
		.success(function(data, status, headers, config) {
			$scope.searchActionableAppts();
			alert("Action performed successfully!");
		})
		.error(function(data, status, headers, config) {
			alert("Failed to perform action! " + data.error.message);
			$scope.checkSessionTimeout(data);
		})
	}

	$scope.editAppointment = function(appointment) {

		$scope.custPackageTotalAppt = 0;
        $scope.applypromocost= '';
        $scope.apptClinicId = '';
        $scope.productServiceAddlTotal = 0;

		hideDiv('#aptEditable');
		var id,ref;
		id = appointment.id == undefined ? appointment._id : appointment.id;
		ref = appointment.ref == undefined ? appointment.refno : appointment.ref;
		$scope.editAptId = ref;
		adminApi.getAppointmentDetails(id)
		.success(function(data, status, headers, config){
			$scope.isEditAptMode = true;
			$scope.actionableAppt.mode = "edit";
			$scope.users1 = {};
			$scope.adminNewAppointmentCust = data.payload;
			$scope.adminNewAppointmentCust.appointment.state = appointmentStateMap[$scope.adminNewAppointmentCust.appointment.state];
			$scope.adminNewAppointmentCust.appointment.pincodeid = $scope.adminNewAppointmentCust.appointment.pincode;
			$scope.adminNewAppointmentCust.appointment.pincode = cache.pincodeIdToPincodeNameMap[$scope.adminNewAppointmentCust.appointment.pincode];
						
			$scope.resetEditAptModel();

			$scope.aptPayment.appointmentid = id;

			// If root appointment documentation exists
			$scope.adminNewAppointmentCust.isEnabledRootApptDocumentation = false;
			if($scope.adminNewAppointmentCust.hasOwnProperty("rootApptDocumentation") && $scope.adminNewAppointmentCust.rootApptDocumentation != undefined) {
				$scope.adminNewAppointmentCust.rootApptDocumentRO = angular.copy($scope.adminNewAppointmentCust.rootApptDocumentation);

				if($scope.adminNewAppointmentCust.rootApptDocumentRO.hasOwnProperty("assessment") || $scope.adminNewAppointmentCust.rootApptDocumentRO.hasOwnProperty("goalsettings")
				|| $scope.adminNewAppointmentCust.rootApptDocumentRO.hasOwnProperty("history") || $scope.adminNewAppointmentCust.rootApptDocumentRO.hasOwnProperty("outcomemeasures")
				|| $scope.adminNewAppointmentCust.rootApptDocumentRO.hasOwnProperty("painevaluation") || $scope.adminNewAppointmentCust.rootApptDocumentRO.hasOwnProperty("treatment")
				|| $scope.adminNewAppointmentCust.rootApptDocumentRO.hasOwnProperty("type")) {
					$scope.adminNewAppointmentCust.isEnabledRootApptDocumentation = true;
				}
			}

			$scope.adminNewAppointmentCust.hasDocument = false;
			if($scope.adminNewAppointmentCust.appointment.hasOwnProperty("document")) {
				$scope.adminNewAppointmentCust.documentRO = angular.copy($scope.adminNewAppointmentCust.appointment.document);
				$scope.adminNewAppointmentCust.hasDocument = true;
			}

		    if($scope.adminNewAppointmentCust.appointment.promocode == undefined || $scope.adminNewAppointmentCust.appointment.promocode == ''){
                $scope.adminNewAppointmentCust.appointment.promocode = '';
            }
            if($scope.adminNewAppointmentCust.appointment.package_code == undefined || $scope.adminNewAppointmentCust.appointment.package_code == ''){
                $scope.adminNewAppointmentCust.appointment.package_code = '';
            }

            //api to fetch clinic data of given city:kalyani patil.
 		   $scope.clinicArrData = [];
 		   $scope.clinicBasePriceVal = 0;
           if($scope.adminNewAppointmentCust.appointment.cityid){

           		var cityid = $scope.adminNewAppointmentCust.appointment.cityid;
           		adminApi.getClinics(cityid)
			     .success(function(data, status, headers, config) {
					$scope.clinicArrData = data.payload;

					//assign servicelocation name by using its Id. 
					if($scope.adminNewAppointmentCust.appointment.clinic_id){
		                $scope.serviceLocationId = $scope.adminNewAppointmentCust.appointment.clinic_id;
		                $scope.apptClinicId = $scope.adminNewAppointmentCust.appointment.clinic_id;

		                for(var i = 0;i < $scope.clinicArrData.length; i++){
		                	if($scope.clinicArrData[i]._id == $scope.serviceLocationId){
		                		$scope.serviceLocation = $scope.clinicArrData[i].clinic_name;
		                		$scope.serviceLocationLabel = $scope.clinicArrData[i].clinic_name;
		                		$scope.clinicBasePriceVal = $scope.clinicArrData[i].clinic_base_price;
		                	}
		                }

		            }else{
		                $scope.serviceLocationLabel = 'At Home';
		            }
				
				})
				.error(function(data, status, headers, config) {
					$scope.checkSessionTimeout(data);
				});
	      	}else{

	      		$scope.serviceLocationLabel = 'At Home';
	      	}
            
			/*if ($scope.adminNewAppointmentCust.payment != undefined && $scope.adminNewAppointmentCust.payment != "") {
				if ($scope.adminNewAppointmentCust.payment.amnt != undefined && $scope.adminNewAppointmentCust.payment.amnt != "") {
					$scope.costPaid = $scope.adminNewAppointmentCust.payment.amnt;
				} else {
					$scope.costPaid = 0;
				}
			} else {
				$scope.costPaid = 0;
			}*/
        
            if($scope.adminNewAppointmentCust.appointment.finalcost > 0){
                $scope.costPaid = $scope.adminNewAppointmentCust.appointment.finalcost;
                if($scope.adminNewAppointmentCust.appointment.additionalcharge > 0 && $scope.adminNewAppointmentCust.appointment.additionalcharge != undefined){
                    $scope.costPaid = $scope.costPaid + $scope.adminNewAppointmentCust.appointment.additionalcharge;
                }
                if($scope.adminNewAppointmentCust.appointment.additionalchargesp > 0 && $scope.adminNewAppointmentCust.appointment.additionalchargesp != undefined){
                    $scope.costPaid = $scope.costPaid + $scope.adminNewAppointmentCust.appointment.additionalchargesp;
                }
            }

            if($scope.adminNewAppointmentCust.appointment.finalcost > 0 && $scope.adminNewAppointmentCust.appointment.additionalcharge > 0){
                var total;
                total = $scope.adminNewAppointmentCust.appointment.finalcost + $scope.adminNewAppointmentCust.appointment.additionalcharge;
                $scope.calculatedAptAmount = $scope.adminNewAppointmentCust.appointment.finalcost +" + "+ $scope.adminNewAppointmentCust.appointment.additionalcharge +" = "+ total;
                //alert($scope.calculatedAptAmount);

                $scope.AptAmount = $scope.adminNewAppointmentCust.appointment.finalcost + $scope.adminNewAppointmentCust.appointment.additionalcharge;

            }else{
                $scope.calculatedAptAmount =  $scope.adminNewAppointmentCust.appointment.finalcost;
                $scope.AptAmount = $scope.adminNewAppointmentCust.appointment.finalcost;
                //alert($scope.calculatedAptAmount);
            }


            $scope.setCancelledBy($scope.adminNewAppointmentCust.appointment.starttime);
            
		})
		.error(function(data, status, headers, config){
			$scope.aptErrorMsg = data.error.message;
			$scope.checkSessionTimeout(data);
		});
		$scope.manageDocumentationCollapse();
		$scope.resetPaymentDetails();
	}

	//for past confirmed appointments,cancellation request should go with 'physio' option only. Kalyani patil  
    $scope.setCancelledBy = function(appt_starttime) {
        
        $scope.RequestedBy = ['Physio','Customer','Patient Transfer','Appointment Swap'];
        var curdate = new Date();
        var myEpochtotime = Math.round(curdate.getTime()/1000);
        //console.log(myEpochtotime);
        if(myEpochtotime > appt_starttime){
            $scope.RequestedBy = ['Physio']; 
        }
    }

	$scope.resetPaymentDetails = function() {
		$scope.apptPaymentErrorMsg = false;
		$scope.aptPayment.amnt = "0";
		
	}
	
	$scope.resetEditAptModel = function() {
		$scope.custPin(cache.cityToIdMap["Pune"]);
		$scope.editAptModel.id = $scope.adminNewAppointmentCust.appointment._id;
		$scope.editAptModel.ref = $scope.adminNewAppointmentCust.appointment.refno;
		$scope.editAptModel.starttime = $scope.adminNewAppointmentCust.appointment.starttime;
		$scope.editAptModel.date = moment($scope.editAptModel.starttime * 1000).format("YYYY-MM-DD");
		$('#datetimepicker7').val($scope.editAptModel.date);
		$scope.editAptModel.slot = moment($scope.editAptModel.starttime * 1000).format("hh:mm a");
		$scope.editAptModel.comments = $scope.adminNewAppointmentCust.appointment.comments;
		$scope.editAptModel.usecustomeraddress = $scope.adminNewAppointmentCust.appointment.usecustomeraddress;
		$scope.editAptModel.aptaddress = $scope.adminNewAppointmentCust.appointment.address;
		$scope.editAptModel.custaddress = $scope.adminNewAppointmentCust.customer.address;
		$scope.editAptModel.problem = $scope.adminNewAppointmentCust.customer.problem;
		$scope.editAptModel.pincodeid = $scope.adminNewAppointmentCust.appointment.pincodeid;
		$scope.editAptModel.pincode = $scope.adminNewAppointmentCust.appointment.pincode;
		$scope.editAptModel.locality = $scope.adminNewAppointmentCust.appointment.locality;
		$scope.editAptModel.zone = $scope.adminNewAppointmentCust.appointment.zoneid;
		$scope.editAptModel.zoneid = $scope.adminNewAppointmentCust.appointment.zoneid;
		$scope.editAptModel.service = $scope.adminNewAppointmentCust.appointment.serviceid;
		$scope.editAptModel.serviceid = $scope.adminNewAppointmentCust.appointment.serviceid;
		$scope.editAptModel.rating = $scope.adminNewAppointmentCust.appointment.rating;
        $scope.editAptModel.appointmentproperties = $scope.adminNewAppointmentCust.appointment.appointmentproperties;
        $scope.editAptModel.addcharges=$scope.adminNewAppointmentCust.appointment.additionalcharge;
        $scope.editAptModel.addchargedesc=$scope.adminNewAppointmentCust.appointment.additionalchargedesc;
		$scope.spInfo = false;
		$scope.wtUndefinedErrorMsg = "";
		$scope.wtUndefined = false;
		$scope.editAptEmptyApptMonth = false;
		$scope.aptStartTime = [];
		$scope.aptSlotTimeFrom = [];
		$scope.spaceDash = [];
		$scope.aptSlotTimeTo = [];
		$scope.adminNewAppointmentCust.aptstarttime = "";
		$scope.resetPromoCodeEditAppt();

		$timeout(function(){
			$scope.selectLocationString($scope.editAptModel.pincode);
		}, 1000);
	}

	$scope.selectLocationString = function(pincode) {
		if($scope.locationArr.length > 0) {
			for(var i=0; i<$scope.locationArr.length; i++) {
				var location = $scope.locationArr[i];
				if(location.pin == pincode) {
					$scope.selectedLocation = location;
					$timeout(function(){$scope.$apply();}, 200);
					break;
				}
			}
		}
	}

	$scope.isEditSaveBtnDisabled = function() {
		var isEnabled = false;
		if(Object.keys($scope.editAptModel).length > 0 && $scope.adminNewAppointmentCust.appointment != undefined) {
			if($scope.editAptModel.usecustomeraddress != $scope.adminNewAppointmentCust.appointment.usecustomeraddress)
				isEnabled = true;
			if($scope.editAptModel.comments != $scope.adminNewAppointmentCust.appointment.comments)
				isEnabled = true;
			if($scope.editAptModel.aptaddress != $scope.adminNewAppointmentCust.appointment.address)
				isEnabled = true;
			if($scope.editAptModel.problem != $scope.adminNewAppointmentCust.customer.problem)
				isEnabled = true;
			// if($scope.editAptModel.pincode != parseInt($scope.adminNewAppointmentCust.customer.pincode))
			if($scope.editAptModel.pincode != parseInt($scope.adminNewAppointmentCust.appointment.pincode))
				isEnabled = true;
			if($scope.editAptModel.service != $scope.adminNewAppointmentCust.appointment.serviceid)
				isEnabled = true;
			if($scope.editAptModel.rating != $scope.adminNewAppointmentCust.appointment.rating)
				isEnabled = true;
            if ($scope.editAptModel.addcharges != $scope.adminNewAppointmentCust.appointment.additionalcharge)
                isEnabled = true;
			if ($scope.editAptModel.addchargedesc != $scope.adminNewAppointmentCust.appointment.additionalchargedesc)
                isEnabled = true;
			
            if($scope.adminNewAppointmentCust.aptstarttime != undefined && $scope.adminNewAppointmentCust.aptstarttime != "") {
				var time = [];
				time = getAptEditTime($scope.adminNewAppointmentCust.aptstarttime, $scope.editAptModel.date);
				// if(time[0] != $scope.adminNewAppointmentCust.appointment.starttime)
					isEnabled = true;
			}
			if($scope.wtUndefined)
				isEnabled = false;
		}
		return !isEnabled;
	}

	$scope.saveEditedApt = function() {
		var time = [];
		if($scope.adminNewAppointmentCust.aptstarttime == undefined || $scope.adminNewAppointmentCust.aptstarttime == "" || $scope.adminNewAppointmentCust.aptstarttime == false) {
			time = [$scope.adminNewAppointmentCust.appointment.starttime, $scope.adminNewAppointmentCust.appointment.endtime];
		}
		else {
			time = getAptEditTime($scope.adminNewAppointmentCust.aptstarttime, $scope.editAptModel.date);
		}
		var apptstarttime = moment(new Date(time[0] * 1000)).format("YYYY-MM-DD hh:mm A");

		var locality = $scope.getLocalityNameFromPincode($scope.editAptModel.pincode);

        var clinicPrice;
        if($scope.clinicBasePriceVal <= 0 || $scope.clinicBasePriceVal == undefined){
        	clinicPrice = 0;
        }else{
        	clinicPrice = $scope.clinicBasePriceVal;
        }

        var clinicId;
        if($scope.apptClinicId == undefined || $scope.apptClinicId == ''){
        	clinicId = null;
        }else{
        	clinicId = $scope.apptClinicId;
        }


		var data = {
			"customer": {
			  "problem": $scope.editAptModel.problem,
			  "pincode": $scope.editAptModel.pincodeid
			},
			"apptslots": [apptstarttime],
			// "apptstarttime": apptstarttime,
			"adminid": adminApi.getAdminid(),
			"comments": $scope.editAptModel.comments,
			"zoneid": "", //$scope.editAptModel.zone,
			"serviceid": $scope.editAptModel.service,
			"address": $scope.editAptModel.aptaddress,
			"usecustomeraddress": $scope.editAptModel.usecustomeraddress,
			"rating": $scope.editAptModel.rating,
			"locality" : locality,
			"apptRootId": "",
			"promocode": $scope.applyPromoResponseEditAppt.promocode,
            "additionalcharge":$scope.editAptModel.addcharges,
            "additionalchargedesc":$scope.editAptModel.addchargedesc,
            "clinic_id":clinicId,
            "clinicBasePrice":clinicPrice

		};
          if ($scope.editAptModel.addcharges == null || $scope.editAptModel.addcharges == undefined){
            console.log("setting additional charge 0");
            data.additionalcharge = 0;
        }
		adminApi.updateAppointmentDetails($scope.adminNewAppointmentCust.appointment._id, data)
		.success(function(data, status, headers, config){
			alert("Saved edited appointment successfully");
			$scope.searchAppointments(true);
			$scope.editAppointment({
				id : $scope.editAptModel.id,
				ref : $scope.editAptModel.ref
			});
		})
		.error(function(data, status, headers, config){
			alert(data.error.message);
			$scope.checkSessionTimeout(data);
		});
	}

	$scope.cancelAppointment = function(id) {

		var cancelRequestInfo ={"reason":"","changerequestby":""};
        $scope.CancelRequest = { reason : "",changerequestby : ""};

        ngDialog.openConfirm({
            template: 'AptReason',
            showClose:false,
			scope: $scope 
        }).then(function(value)
        {
            cancelRequestInfo.reason=$scope.CancelRequest.reason;
            cancelRequestInfo.changerequestby=$scope.CancelRequest.changerequestby;
           // console.log(cancelRequestInfo);
            adminApi.deleteAppointmentDetails(id ,  cancelRequestInfo.changerequestby)
			.success(function(data, status, headers, config){
				alert("Appointment cancelled successfully");
				$scope.hideEditAptMode();
				$scope.searchAppointments(true);
			})
			.error(function(data, status, headers, config){
				alert(data.error.message);
				$scope.checkSessionTimeout(data);
			});

          
        },
        function(value) {
        	console.log("Fail " + $scope.CancelRequest.reason );
        });


        /*var res = confirm("This will cancel the appointment.\nDo you want to continue?");
		if(res == true) {
			adminApi.deleteAppointmentDetails(id)
			.success(function(data, status, headers, config){
				alert("Appointment cancelled successfully");
				$scope.hideEditAptMode();
				$scope.searchAppointments(true);
			})
			.error(function(data, status, headers, config){
				alert(data.error.message);
				$scope.checkSessionTimeout(data);
			});
		}*/


	}

	$scope.resetSelectedLocation = function() {
		$scope.selectedLocation = {};
	}

	$scope.hideEditAptMode = function() {
		$scope.isEditAptMode = false;
		$scope.actionableAppt.mode = 'listing';
	}
	
	$scope.cancelEditApt = function() {
		slideUp('#aptEditable', function(){
			$scope.resetEditAptModel();
		});
	}

	$scope.initAppointments = function() {
		$scope.sortKey = 'starttime';
		$scope.reverse = false;
		$(".dateTimePicker").on('blur', function(ev){
			if(ev.target.id == "aptFromDate") {
				$scope.appointmentCriteria.fromDate = ev.target.value;
			}
			else if(ev.target.id == "aptTillDate") {
				$scope.appointmentCriteria.tillDate = ev.target.value;
			}
		});
		$scope.appointmentCriteria.fromDate = getFormattedDate();
		$scope.appointmentCriteria.tillDate = getFormattedDate(undefined, true);
		$('#aptFromDate').val($scope.appointmentCriteria.fromDate);
		$('#aptTillDate').val($scope.appointmentCriteria.tillDate);

		$timeout(function() {
			$scope.searchAppointments(false);
		}, 500);
	}

	$scope.toggleAdvSrcBox = function() {
		$("#advSrcBox").slideToggle(function() {
			$timeout(function() {
				if($("#advSrcBox").css('display') == "block") {
					document.getElementById("firstFocus").focus();
				}
			}, 100);
		});
	}

	$scope.clearSearchCriteria = function() {
		$scope.appointmentCriteria.fromEpoch = "";
		$scope.appointmentCriteria.tillEpoch = "";
		$scope.appointmentCriteria.zoneId = "";
		$scope.appointmentCriteria.zone = "";
		$scope.appointmentCriteria.service = "";
		$scope.appointmentCriteria.serviceId = "";
		$scope.appointmentCriteria.custemail = "";
		$scope.appointmentCriteria.custid = "";
		$scope.appointmentCriteria.custph = "";
		$scope.appointmentCriteria.spemail = "";
		$scope.appointmentCriteria.spname = "";
		$scope.appointmentCriteria.spid = "";
	}

	$scope.advSrcChange = function(type) {
		var value = "";
		switch(type) {
			case "service":
				value = cache.servicesMap[$scope.appointmentCriteria.serviceId];
				$scope.appointmentCriteria.service = value == undefined ? "" : value;
			break;
			case "zone":
				$scope.appointmentCriteria.zone = cache.zoneIdToNameMap[$scope.appointmentCriteria.zoneId];
			break;
			case "problem":
				for(var i = 0; i < initgetServicesObj.payload.length; i++) {
					result1 =  initgetServicesObj.payload[i];
					for(var j = 0; j < result1.services.length; j++) {
						for(k = 0; k < result1.services[j].problems.length; k++){
							if($scope.editAptModel.problem == result1.services[j].problems[k]){
								$scope.editAptModel.service = result1.services[j].id;
							}
						}
					}
				}
				$scope.getEditMonthlyAppointmentAvailability($scope.editAptModel.pincodeid, $scope.editAptModel.zoneid, $scope.editAptModel.service);
				$scope.getSpInfo($scope.editAptModel.zoneid, $scope.editAptModel.service, $scope.editAptModel.pincodeid);
			break;
		}
	}

	$scope.fetchAppointment = function(appointmentRef) {
		adminApi.getAppointmentDetails(appointmentRef)
		.success(function(data, status, headers, config){
			$scope.costPaid = "0";
			$scope.adminNewAppointmentCust = {};
			$scope.adminNewAppointmentCust = data.payload;
			$scope.adminNewAppointmentCust.appointment.state = appointmentStateMap[$scope.adminNewAppointmentCust.appointment.state];
			$scope.adminNewAppointmentCust.appointment.pincodeid = $scope.adminNewAppointmentCust.appointment.pincode;
			$scope.adminNewAppointmentCust.appointment.pincode = cache.pincodeIdToPincodeNameMap[$scope.adminNewAppointmentCust.appointment.pincode];
			$scope.fetched.Appointment = true;
			$scope.fetchAptErrorMsg = "";
			$scope.aptPayment.appointmentid = $scope.adminNewAppointmentCust.appointment._id;

			if ($scope.adminNewAppointmentCust.payment != undefined && $scope.adminNewAppointmentCust.payment != "") {
				if ($scope.adminNewAppointmentCust.payment.amnt != undefined && $scope.adminNewAppointmentCust.payment.amnt != "") {
					$scope.costPaid = $scope.adminNewAppointmentCust.payment.amnt;
				} else {
					$scope.costPaid = 0;
				}
			} else {
				$scope.costPaid = 0;
			}

			$scope.$apply();
		})
		.error(function(data, status, headers, config){
			$scope.fetchAptErrorMsg = data.error.message;
			$scope.fetched.Appointment = false;
			$scope.adminNewAppointmentCust = {};
			$scope.checkSessionTimeout(data);
		})
	}

	$scope.addPaymentMode = function() {

		$scope.totalPayment = $scope.apptWalletAmnt + $scope.apptPayAsGoAmnt + $scope.productServiceAddlTotal;

		if($scope.fromWallet == false && $scope.fromPayAsGo == true){
           $scope.aptPayment.type = $scope.aptPayment.payAsGoType; 
           $scope.aptPayment.amnt = $scope.apptPayAsGoAmnt ;
        }

        if($scope.fromWallet == true && $scope.productServiceAddlTotal >= 0){
           $scope.aptPayment.amnt =   $scope.apptWalletAmnt;
        }

        if($scope.fromWallet == true && $scope.fromPayAsGo == false && $scope.productServiceAddlTotal > 0){
           $scope.aptPayment.amnt =   $scope.apptWalletAmnt + $scope.productServiceAddlTotal;

        }

        $scope.checkPaymentType = $scope.aptPayment.type;
        if($scope.fromWallet == true && $scope.fromPayAsGo == true){
            $scope.checkPaymentType = $scope.aptPayment.payAsGoType;
        }

		if($scope.checkPaymentType != null && $scope.checkPaymentType != undefined){

			if($scope.aptPayment.currency &&
	            $scope.aptPayment.type &&
	            $scope.aptPayment.amnt != undefined) {
	            
	            var modeSet = false;
	            for(var i=0; i<$scope.aptPayment.paymentModes.length; i++) {
	                var mode = $scope.aptPayment.paymentModes[i];
	                if(mode.type === $scope.aptPayment.type) {
	                    mode.amount = $scope.aptPayment.amnt;
	                    modeSet = true;
	                    break;
	                }
	            }
	            
	            if(!modeSet) {
	                $scope.aptPayment.paymentModes.push({
	                    currency: $scope.aptPayment.currency,
	                    type: $scope.aptPayment.type,
	                    chequeOrTransNo: $scope.aptPayment.ChequeTransNO,
	                    amount: $scope.aptPayment.amnt,
	                    description: "appointment amount",
	                });
	            }

	           // $scope.aptPayment.amnt = 0;
	        }

	       
	      if($scope.fromWallet == true && $scope.fromPayAsGo == true && $scope.productServiceAddlTotal >= 0){

                $scope.aptPayment.sptype = $scope.aptPayment.payAsGoType;
                $scope.aptPayment.additionalSpAmnt = $scope.apptPayAsGoAmnt;
                var modeAddSpSet = false;

                for(var i=1; i<$scope.aptPayment.paymentModes.length; i++) {
                    var modeaddsp = $scope.aptPayment.paymentModes[i];
                    if(modeaddsp.sptype === $scope.aptPayment.sptype) {
                        modeaddsp.amount = $scope.aptPayment.additionalSpAmnt;
                        modeAddSpSet = true;
                        break;
                    }
                }

                if(!modeAddSpSet) {
                    if($scope.aptPayment.additionalSpAmnt > 0){
                        $scope.aptPayment.paymentModes.push({
                            currency: $scope.aptPayment.currency,
                            type: $scope.aptPayment.sptype,
                            amount: $scope.aptPayment.additionalSpAmnt,
                            description:"Pay as you go amount"
                        });
                    }
                     
                }

            }


        }else{
            alert('Please select mode of payment.')
        }

	}

	$scope.removePaymentMode = function() {		
		  if($scope.aptPayment.selectedMode) {
            var selectedIndex = $scope.aptPayment.selectedModeIndex;

            /*for(var i=0; i<$scope.aptPayment.paymentModes.length; i++) {
                var mode = $scope.aptPayment.paymentModes[i];
                if(mode.type === $scope.aptPayment.selectedMode.type) {
                    index = i;
                    //break;
                }
            }*/

            if(selectedIndex != -1) {
                $scope.aptPayment.paymentModes.splice(selectedIndex, 1);
                $scope.aptPayment.selectedMode = null;
                $scope.aptPayment.selectedModeIndex = -1;
            }
        }
	}

	$scope.submitAptPayment = function() {
		$scope.apptPaymentErrorMsg = "";

		if (($scope.applyPromoResponsePaymentSection != undefined) && 
			($scope.applyPromoResponsePaymentSection.promocodeid != undefined) && 
			($scope.applyPromoResponsePaymentSection.promocode != undefined) && 
			($scope.applyPromoResponsePaymentSection.finalcost != undefined)) {

			$scope.aptPayment.promocodeid = $scope.applyPromoResponsePaymentSection.promocodeid;
			$scope.aptPayment.promocode = $scope.applyPromoResponsePaymentSection.promocode;
			$scope.aptPayment.finalcost = $scope.applyPromoResponsePaymentSection.finalcost;
		}

		if($scope.productServiceAddlTotal > 0 && $scope.productServiceAddlTotal != undefined){
            $scope.aptPayment.additionalSpAmntDesc = "Services/Products Additional Amount";
        }

        /*if($scope.fromWallet == true && $scope.fromPayAsGo == true){
                var dataWallet = {
                    "walletAmount": $scope.apptPayAsGoAmnt,
                    "walletTransType": "credit",
                    "currency":"INR",
                    "description":"Wallet Regularization",
                    "createdById":spApi.getSpid(),
                    "createdByName":spApi.getSpname(),
                    "apptId":$scope.aptPayment.appointmentid,
                    "city":$scope.adminNewAppointmentCust.customer.city,
                    "cityId":$scope.adminNewAppointmentCust.customer.cityid,
                    "trans_mode":$scope.aptPayment.payAsGoType,
                    "checkOrTransNo":$scope.aptPayment.ChequeTransNO

                }

                spApi.walletTransact($scope.adminNewAppointmentCust.appointment.patientid, dataWallet)
                .success(function(data, status, headers, config) {
                    if(data.error == undefined && data.payload != undefined) {
                       console.log("Wallet regularization done successfully!");
                    }

                    var data = {
						appointmentid: $scope.aptPayment.appointmentid,
						promocodeid: $scope.aptPayment.promocodeid,
						promocode: $scope.aptPayment.promocode,
						paymentmodes: $scope.aptPayment.paymentModes,
						promocost:$scope.applypromocost,
						additionalchargespdesc:$scope.aptPayment.additionalSpAmntDesc,
						city:$scope.adminNewAppointmentCust.customer.city,
			            cityId:$scope.adminNewAppointmentCust.customer.cityid,
			            serviceProductList:$scope.aptPayment.productServicesToBeUsed

					}

					adminApi.markAppointmentComplete(data)
					.success(function(data, status, headers, config){
						// As this payment API do not return payment data, setting payment object from the request payment object
						$scope.adminNewAppointmentCust.payment = {
							curr : $scope.aptPayment.currency,
							amnt : $scope.aptPayment.amnt,
							type : $scope.aptPayment.type
						};

						alert("Appointment marked complete successfully");

						hidePaymentDialog();

						try {
			                $scope.apptPayment.paymentForm.$setPristine();
			                $scope.apptPayment.paymentForm.$setUntouched();
			            } catch(err) {}
						$scope.visitedpaymentAmt = false;
						 //added for SP additional amount;
			            $scope.visitedaddsppaymentAmt = false;

						var totalCostPaid = 0;
			            for(var i=0; i<$scope.aptPayment.paymentModes.length; i++) {
			                var mode = $scope.aptPayment.paymentModes[i];
			                totalCostPaid += parseInt(mode.amount);
			            }
			            // $scope.costPaid = $scope.aptPayment.amnt;
			            //$scope.costPaid = totalCostPaid;
			             if(totalCostPaid!=0){
			                $scope.costPaid = totalCostPaid;
			            }

						$scope.paymentType = $scope.aptPayment.type;
						$scope.adminNewAppointmentCust.appointment.state = "Completed";
						$scope.applyPromoResponsePaymentSection = {};
						$scope.aptPayment.additionalSpAmnt = "0";
						$scope.aptPayment.additionalSpAmntDesc = "";
						//$scope.aptPayment.amnt = "0";

					    if($scope.adminNewAppointmentCust.appointment.additionalcharge>0){
			                $scope.aptPayment.amnt = $scope.adminNewAppointmentCust.appointment.finalcost + $scope.adminNewAppointmentCust.appointment.additionalcharge;
			            }else{
			                $scope.aptPayment.amnt = $scope.adminNewAppointmentCust.appointment.finalcost;
			            }
			         
						$scope.aptPayment.type = "Wallet";
			            $scope.aptPayment.sptype = "Wallet";
						$scope.aptPayment.paymentModes = [];
						$scope.aptPayment.selectedMode = null;
						$scope.aptPayment.selectedModeIndex = -1;
						$scope.applypromocost= '';

						$scope.fetchAppointment($scope.adminNewAppointmentCust.appointment._id);

						$scope.searchAppointments(true);
					})
					.error(function(data, status, headers, config){
						$scope.apptPaymentErrorMsg = data.error.message;
						$scope.checkSessionTimeout(data);
					})
                })
                .error(function(data, status, headers, config) {
                    console.log("Wallet regularization failed!");
                });
        }else{*/



        	if($scope.aptPayment.isConverted == null){
                $scope.aptPayment.isConverted = false;
            }

        	var data = {
					appointmentid: $scope.aptPayment.appointmentid,
					promocodeid: $scope.aptPayment.promocodeid,
					promocode: $scope.aptPayment.promocode,
					paymentmodes: $scope.aptPayment.paymentModes,
					promocost:$scope.applypromocost,
					additionalchargespdesc:$scope.aptPayment.additionalSpAmntDesc,
					city:$scope.adminNewAppointmentCust.customer.city,
		            cityId:$scope.adminNewAppointmentCust.customer.cityid,
		            serviceProductList:$scope.aptPayment.productServicesToBeUsed,
		            isconverted:$scope.aptPayment.isConverted

				}

			/*ngDialog.openConfirm({
                template: 'AptCompleteTemplate',
                showClose:false,
                scope: $scope 
            }).then(function(value)
            {*/

				adminApi.markAppointmentComplete(data)
				.success(function(data, status, headers, config){
					// As this payment API do not return payment data, setting payment object from the request payment object
					$scope.adminNewAppointmentCust.payment = {
						curr : $scope.aptPayment.currency,
						amnt : $scope.aptPayment.amnt,
						type : $scope.aptPayment.type
					};

					alert("Appointment marked complete successfully");

					hidePaymentDialog();

					try {
		                $scope.apptPayment.paymentForm.$setPristine();
		                $scope.apptPayment.paymentForm.$setUntouched();
		            } catch(err) {}
					$scope.visitedpaymentAmt = false;
					 //added for SP additional amount;
		            $scope.visitedaddsppaymentAmt = false;

					var totalCostPaid = 0;
		            for(var i=0; i<$scope.aptPayment.paymentModes.length; i++) {
		                var mode = $scope.aptPayment.paymentModes[i];
		                totalCostPaid += parseInt(mode.amount);
		            }
		            // $scope.costPaid = $scope.aptPayment.amnt;
		            //$scope.costPaid = totalCostPaid;
		             if(totalCostPaid!=0){
		                $scope.costPaid = totalCostPaid;
		            }

					$scope.paymentType = $scope.aptPayment.type;
					$scope.adminNewAppointmentCust.appointment.state = "Completed";
					$scope.applyPromoResponsePaymentSection = {};
					$scope.aptPayment.additionalSpAmnt = "0";
					$scope.aptPayment.additionalSpAmntDesc = "";
					//$scope.aptPayment.amnt = "0";

				    if($scope.adminNewAppointmentCust.appointment.additionalcharge>0){
		                $scope.aptPayment.amnt = $scope.adminNewAppointmentCust.appointment.finalcost + $scope.adminNewAppointmentCust.appointment.additionalcharge;
		            }else{
		                $scope.aptPayment.amnt = $scope.adminNewAppointmentCust.appointment.finalcost;
		            }
		         
					$scope.aptPayment.type = "Wallet";
		            $scope.aptPayment.sptype = "Wallet";
					$scope.aptPayment.paymentModes = [];
					$scope.aptPayment.selectedMode = null;
					$scope.aptPayment.selectedModeIndex = -1;
					$scope.applypromocost= '';

					$scope.fetchAppointment($scope.adminNewAppointmentCust.appointment._id);

					$scope.searchAppointments(true);
				})
				.error(function(data, status, headers, config){
					$scope.apptPaymentErrorMsg = data.error.message;
					$scope.checkSessionTimeout(data);
				})

			/*},
            function(value) {
                console.log("Fail To Complete Appointment!");
            });*/


        //}
	}

	$scope.cancelAptPayment = function() {
		hidePaymentDialog();
		$scope.apptPaymentErrorMsg = "";
		try {
            $scope.apptPayment.paymentForm.$setPristine();
            $scope.apptPayment.paymentForm.$setUntouched();
        } catch(err) {}
		$scope.visitedpaymentAmt = false;
		$scope.aptPayment.amnt = "0";
		$scope.aptPayment.type = "Wallet";
		$scope.aptPayment.paymentModes = [];
		$scope.aptPayment.selectedMode = null;
		$scope.aptPayment.selectedModeIndex = -1;

		//added for SP additional amount;
        $scope.visitedaddsppaymentAmt = false;
        $scope.aptPayment.additionalSpAmnt = "0";
        $scope.aptPayment.additionalSpAmntDesc = "";
        $scope.applypromocost= '';
	}

	$scope.makeAptPayment = function(appointmentRefNo) {
		var dataObj = {
			refno : appointmentRefNo
		};
		$scope.$root.$broadcast("moveToPaymentScreen", dataObj);
	}

	$scope.$on('loadPaymentScreen', function(event, args) {
		$timeout(function() {
			$("#fetchDetailsButton").click();
		}, 500);
	});

	$scope.initRefNo = function() {
		if($scope.refBoolFlag) {
			$scope.refBoolFlag = false;
		} else {
			$scope.adminAptPayment.refno = "";
		}
	}

	$scope.scrollDiv = function(element) {
		try {
			$timeout(function() {
				var selector = document.getElementById(element);
				selector.scrollIntoView();
				$(document).scrollTop(($(document).scrollTop()) - 100 + 30);
			}, 500);
		} catch(err) {}
	}

	toggleContainer = function(className) {
		var index = 0;
		if($scope.currentOpenView == 'APPOINTMENT') {
			index = 0;
		}else if($scope.currentOpenView == 'CUSTOMER_APPOINTMENT') {
			index = 1;
		}
		var elementObj = $("." + className+":eq("+index+")");
		elementObj.slideToggle();
	}

	$scope.manageDocumentationCollapse = function() {
		$('.historyRO').hide();
		$('.painEvalRO').hide();
		$('.assessmentRO').hide();
		$('.omRO').hide();
		$('.goalRO').hide();
		$('.treatmentRO').hide();
		$('.historyRO1').hide();
		$('.painEvalRO1').hide();
		$('.assessmentRO1').hide();
		$('.omRO1').hide();
		$('.goalRO1').hide();
		$('.treatmentRO1').hide();
	}

	$scope.editAptClicked = function() {
		if(!$scope.adminNewAppointmentCust.appointment.hasOwnProperty("document")) {
			$scope.adminNewAppointmentCust.appointment.document = {type : ""};
		}
		$scope.scrollDiv("aptDocumentation");
	}

	showDocumentation = function() {
		slideDownByIndex('.aptDocumentation', 0);
	}

	hideDocumentation = function() {
		slideUpByIndex('.aptDocumentation', 0);
	}

	showPaymentDialog = function() {
		slideDownByIndex('.spApptPayment', 0);
		$scope.scrollDiv('spApptPayment');


		$scope.fromWallet = false;
        $scope.fromPayAsGo = false;
        $scope.aptPayment.type = null;
        $scope.aptPayment.payAsGotype = null;
        $scope.aptPayment.ChequeTransNO = "";
        $scope.aptPayment.isConverted = null;
        $scope.apptPayAsGoAmnt = 0;
        $scope.apptWalletAmnt = 0;
        $scope.totalPayment = 0;

        if($scope.adminNewAppointmentCust.customer.custwallet.walletbalance > 0){
            $scope.fromWallet = true;
            $scope.aptPayment.type = "Wallet";   
            $scope.apptWalletAmnt = $scope.AptAmount; 

            if($scope.adminNewAppointmentCust.customer.custwallet.walletbalance < ($scope.apptWalletAmnt + $scope.productServiceAddlTotal)){
                $scope.apptPayAsGoAmnt = $scope.AptAmount - ($scope.adminNewAppointmentCust.customer.custwallet.walletbalance - $scope.productServiceAddlTotal);
            }        
        }

        if($scope.adminNewAppointmentCust.customer.custwallet.walletbalance <= 0 || $scope.adminNewAppointmentCust.customer.custwallet.walletbalance < $scope.AptAmount){
            $scope.fromPayAsGo = true;
            $scope.apptPayAsGoAmnt = $scope.AptAmount - $scope.adminNewAppointmentCust.customer.custwallet.walletbalance + $scope.productServiceAddlTotal; 
            $scope.apptWalletAmnt = $scope.adminNewAppointmentCust.customer.custwallet.walletbalance;
        }

        if($scope.fromWallet == true && $scope.fromPayAsGo == false && ($scope.apptWalletAmnt + $scope.productServiceAddlTotal > $scope.adminNewAppointmentCust.customer.custwallet.walletbalance)){
            $scope.fromPayAsGo = true;
            $scope.apptPayAsGoAmnt = ($scope.apptWalletAmnt + $scope.productServiceAddlTotal) - $scope.adminNewAppointmentCust.customer.custwallet.walletbalance; 
        }

        if($scope.adminNewAppointmentCust.customer.custwallet.walletbalance >= ($scope.AptAmount+$scope.productServiceAddlTotal)){
            $scope.productServiceCost = $scope.productServiceAddlTotal;
        }

        adminApi.getCustomerDetails($scope.adminNewAppointmentCust.appointment.patientid)
        .success(function(data, status, headers, config){
            $scope.custApptList = [];
            $scope.custApptList = data.payload.appointments;
            $scope.isConvertedFlag = false;
            var arrayStarttime = [];
            for(var i = 0; i< $scope.custApptList.length; i++){
               // console.log($scope.custApptList[i].appointment);
                if($scope.custApptList[i].appointment.state != 3){
                    arrayStarttime.push($scope.custApptList[i].appointment.starttime)
                }
            }
            //console.log(arrayStarttime);
            var minimum = Math.min.apply( Math, arrayStarttime);
            //console.log(minimum);
            if($scope.adminNewAppointmentCust.appointment.starttime == minimum){
                $scope.isConvertedFlag = true;
            }
            //console.log($scope.isConvertedFlag);

            var arrayConfirmApptStarttime = [];
            var nextApptAmnt = 0;
            var package_id;
            $scope.insufficientWallet = false;
            if($scope.custReadList.package_id != undefined){
                var starttime = $scope.adminNewAppointmentCust.appointment.starttime;
                for(var i = 0; i< $scope.custApptList.length; i++){
                    if($scope.custApptList[i].appointment.state == 2 && starttime < $scope.custApptList[i].appointment.starttime){
                        arrayConfirmApptStarttime.push($scope.custApptList[i].appointment.starttime)
                    }
                }

                if(arrayConfirmApptStarttime.length > 0){
                    var nextApptStarttime = Math.min.apply( Math, arrayConfirmApptStarttime);
                    //console.log(arrayConfirmApptStarttime);
                    //console.log(nextApptStarttime);
                    for(var i = 0; i< $scope.custApptList.length; i++){
                        if($scope.custApptList[i].appointment.starttime == nextApptStarttime){
                            //console.log($scope.custApptList[i].appointment);
                            nextApptAmnt = $scope.custApptList[i].appointment.finalcost + $scope.custApptList[i].appointment.additionalchargesp;
                            package_id = $scope.custApptList[i].appointment.package_id;
                        }
                    }
                    var balanceRemain = $scope.adminNewAppointmentCust.customer.custwallet.walletbalance - ($scope.adminNewAppointmentCust.appointment.finalcost + $scope.adminNewAppointmentCust.appointment.additionalchargesp + $scope.productServiceAddlTotal);
                    if(nextApptAmnt > 0 && nextApptAmnt != NaN && package_id != "" && package_id != undefined){
                        if(nextApptAmnt > balanceRemain){
                            $scope.insufficientWallet = true;
                        }
                    }

                    //console.log(nextApptAmnt);
                    //console.log(balanceRemain);
                    //console.log($scope.insufficientWallet);

                }

            }

        })
        .error(function(data, status, headers, config){
           console.log("Failed to fetch customer appointment list!");
        })


	}



	$scope.addInAccountService = function(service) {

       if(service != undefined){
            $scope.aptPayment.productServicesToBeUsed.push(service)
       }

       //console.log($scope.aptPayment.productServicesToBeUsed);

       var index = -1;
       for(var i = 0;i< $scope.serviceInAccount.length;i++){
            if(service._id == $scope.serviceInAccount[i]._id){
                index = i;
            }
       }
       $scope.serviceInAccount.splice(index,1);

       $scope.productServiceAddlTotal = $scope.productServiceAddlTotal + service.price;
       $scope.aptPayment.additionalSpAmnt = $scope.productServiceAddlTotal;
       $scope.aptPayment.sptype = 'Wallet';

    }

    $scope.addInAccountProduct = function(product) {

        if(product != undefined){
            $scope.aptPayment.productServicesToBeUsed.push(product)
        }

        //console.log($scope.aptPayment.productServicesToBeUsed);

        var index = -1;
        for(var i = 0;i< $scope.productsInAccount.length;i++){
            if(product._id == $scope.productsInAccount[i]._id){
                index = i;
            }
        }
       $scope.productsInAccount.splice(index,1);

       $scope.productServiceAddlTotal = $scope.productServiceAddlTotal + product.price;
       $scope.aptPayment.additionalSpAmnt = $scope.productServiceAddlTotal;
       $scope.aptPayment.sptype = 'Wallet';
    }


    $scope.removeServiceProduct = function(item) {
        console.log(item);
        var index = -1;
        for(var i = 0; i < $scope.aptPayment.productServicesToBeUsed.length; i++) {
           if($scope.aptPayment.productServicesToBeUsed[i]._id == item._id) {
             index = i;
           }
        }

        $scope.aptPayment.productServicesToBeUsed.splice(index,1);

         if(item.category == 'Product'){
             $scope.productsInAccount.push(item);
         }else{
             $scope.serviceInAccount.push(item);
         }

         $scope.productServiceAddlTotal = $scope.productServiceAddlTotal - (item.price * item.selectedQty);
         $scope.aptPayment.additionalSpAmnt = $scope.productServiceAddlTotal;

          showPaymentDialog();
    }

    getPatientProductService = function() {
        //alert('Hi');
        console.log($scope.adminNewAppointmentCust.customer);
        adminApi.getServiceProductTrans($scope.adminNewAppointmentCust.appointment.patientid)
        .success(function(data, status, headers, config) { 
        	$scope.aptPayment.productServicesToBeUsed = [];

            $scope.productsServices = [];
            $scope.serviceInAccount = [];
            $scope.productsInAccount = [];
            $scope.serviceName = [];
            $scope.productName = [];
            $scope.productsServices = data.payload;
            $scope.productServiceAddlTotal = 0;
            $scope.aptPayment.additionalSpAmnt = $scope.productServiceAddlTotal;

            $scope.productsServices.forEach(function(item){
                if(item.is_used == false){
                    if(item.category == 'Service'){
                        $scope.serviceInAccount.push(item);
                        $scope.serviceName.push(item.name);
                    }
                    if(item.category == 'Product'){
                        $scope.productsInAccount.push(item);
                        $scope.productName.push(item.name);
                    }
                }

            });

            var  serviceQty = [];
            $scope.serviceName.forEach(function(i) { 
                serviceQty[i] = (serviceQty[i]||0) + 1;            
            }); 
            console.log(serviceQty);   
            $scope.servicesWithQty = [];        
            $scope.serviceInAccount.forEach(function(item1) {
                item1.qty = serviceQty[item1.name];
                $scope.servicesWithQty.push(item1);
            });

            console.log('In account services');
            console.log($scope.servicesWithQty);

            $scope.uniqueServices = [];
            var flagService = false;             
            $scope.serviceInAccount.forEach(function(rec){             
                if($scope.uniqueServices.length === 0){
                    $scope.uniqueServices.push(rec);                              
                }else{ 
                    flagService = false;  
                    $scope.uniqueServices.forEach(function(i){ 
                       if( i.hasOwnProperty('name') && i['name'] === rec.name ){
                            flagService = true;
                        }
                    });
                    if(flagService == false){
                        $scope.uniqueServices.push(rec);
                    }
                }
            });
            console.log($scope.uniqueServices);

            var  productQty = [];
            $scope.productName.forEach(function(i) { 
                productQty[i] = (productQty[i]||0) + 1;            
            }); 
            console.log(productQty);   
            $scope.productsWithQty = [];        
            $scope.productsInAccount.forEach(function(item1) {
                item1.qty = productQty[item1.name];
                $scope.productsWithQty.push(item1);
            });

            console.log('In account services');
            console.log($scope.productsWithQty);

            $scope.uniqueProducts = [];
            var flagProduct = false;             
            $scope.productsInAccount.forEach(function(rec){             
                if($scope.uniqueProducts.length === 0){
                    $scope.uniqueProducts.push(rec);                              
                }else{ 
                    flagProduct = false;  
                    $scope.uniqueProducts.forEach(function(i){ 
                       if( i.hasOwnProperty('name') && i['name'] === rec.name ){
                            flagProduct = true;
                        }
                    });
                    if(flagProduct == false){
                        $scope.uniqueProducts.push(rec);
                    }
                }
            });
            console.log($scope.uniqueProducts);
        })
        .error(function(data, status, headers, config) {
            console.log('Failed to fetch Patient services and products transactions!');
        });

    }

    $scope.showServiceProductPupup = function(){
        //alert('Hi');
        $scope.selectedItems = [];
        $scope.serviceProductQty = 1;
        ngDialog.openConfirm({
            template: 'AptServiceProduct',
            showClose:false,
            scope: $scope 
        }).then(function(value)
        {
        	$scope.selectedItems.forEach(function(item){
                if(item.category == 'Service'){
                	if(document.getElementById(item.name+'_service').value != '' && document.getElementById(item.name+'_service').value != undefined){
                    	item.selectedQty =  document.getElementById(item.name+'_service').value;
                    }else{
                    	item.selectedQty = 1;
                    }

                }else{
                    if(document.getElementById(item.name+'_product').value != '' && document.getElementById(item.name+'_product').value != undefined){
                    	item.selectedQty =  document.getElementById(item.name+'_product').value;
                    }else{
                    	item.selectedQty = 1;
                    }
                }
                $scope.productServiceAddlTotal = $scope.productServiceAddlTotal + (item.price * item.selectedQty);
               
            });

            $scope.aptPayment.additionalSpAmnt = $scope.productServiceAddlTotal;       	
            $scope.aptPayment.productServicesToBeUsed = $scope.selectedItems;
                     
            showPaymentDialog();
            //alert('After confirm');

        },
        function(value) {
            console.log("Fail Service Product Addition.");
        });
    }

    $scope.getSelectedServiceProduct = function(rec,checked,seletedQty){
        //alert(rec.name);
        //alert(checked);
        //console.log(document.getElementById(rec.name+'_service').value);

        if(rec.category == 'Service'){
            var sQty = document.getElementById(rec.name+'_service').value;
        }else{
            var sQty = document.getElementById(rec.name+'_product').value;
        }
    
        var qauntity = parseInt(sQty);

        if(checked == true){
            if(sQty != undefined){
                rec.selectedQty = qauntity;
            }else{
                rec.selectedQty = 1;
            }
            
            $scope.selectedItems.push(rec);

        }else{

            for(var i = 0; i < $scope.selectedItems.length; i++) {
               if($scope.selectedItems[i].name == rec.name) {
                 index = i;
               }
            }
            $scope.selectedItems.splice(index,1);

        }

        console.log($scope.selectedItems);
    }

    $scope.validateQty = function(selectedQty,rec){
        $scope.validateQuantity = false;
        console.log('selected:'+selectedQty);
        console.log('availed:'+rec.qty);
        if(selectedQty > rec.qty || selectedQty == undefined){
            //alert('true');
            //$scope.validateQuantity = true;
            if(rec.category == 'Service'){
                document.getElementById(rec.name+'_service').value = 1;
            }else{
                document.getElementById(rec.name+'_product').value = 1;
            }
            
        }
    }






	hidePaymentDialog = function() {
		slideUpByIndex('.spApptPayment', 0);
		$scope.scrollDiv('editAptContainer');
	}

	$scope.saveEditedDocumentation = function() {
		var locality = $scope.getLocalityNameFromPincode($scope.adminNewAppointmentCust.appointment.pincode);
		var apptstarttime = moment(new Date($scope.adminNewAppointmentCust.appointment.starttime * 1000)).format("YYYY-MM-DD hh:mm A");

		var data = {
			"customer": {
			  "problem": $scope.adminNewAppointmentCust.customer.problem,
			  "pincode": $scope.adminNewAppointmentCust.appointment.pincodeid
			},			
			"apptslots": [apptstarttime],
			// "apptstarttime": apptstarttime,
			"adminid": $scope.adminNewAppointmentCust.appointment.adminid,
			"comments": $scope.adminNewAppointmentCust.appointment.comments,
			"zoneid": $scope.adminNewAppointmentCust.appointment.zoneid,
			"serviceid": $scope.adminNewAppointmentCust.appointment.serviceid,
			"address": $scope.adminNewAppointmentCust.customer.address,
			"usecustomeraddress": $scope.adminNewAppointmentCust.appointment.usecustomeraddress,
			"rating": $scope.adminNewAppointmentCust.appointment.rating,
			"document": $scope.adminNewAppointmentCust.appointment.document,
			"locality": locality,
			"apptRootId": "",
			"promocode": "",
            "additionalcharge":$scope.adminNewAppointmentCust.appointment.additionalcharge,
            "additionalchargedesc":$scope.adminNewAppointmentCust.appointment.additionalchargedesc
		};
          if ($scope.adminNewAppointmentCust.appointment.additionalcharge == null || $scope.adminNewAppointmentCust.appointment.additionalcharge == undefined){
            console.log("setting additional charge 0");
            data.additionalcharge = 0;
        }
		adminApi.updateAppointmentDetails($scope.adminNewAppointmentCust.appointment._id, data)
		.success(function(data, status, headers, config){
			alert("Documentation saved successfully");
			$scope.adminNewAppointmentCust.documentRO = data.payload[0].document;
			$scope.adminNewAppointmentCust.hasDocument = true;
		})
		.error(function(data, status, headers, config){
			alert(data.error.message);
			$scope.checkSessionTimeout(data);
		});
	}

	$scope.imagesSelected = function(files) {
		var filesList = files.files;
		for(var i=0; i<filesList.length; i++) {
			var FR= new FileReader();
			FR.filename = filesList[i].name;
			FR.onload = function(e) {
				var investigation = {
					fname : e.target.filename,
					base64data : e.target.result,
					action : "new"
				};
				$scope.setSelectedImages(investigation);
			};
			FR.readAsDataURL( filesList[i] );
		}
	}

	$scope.setSelectedImages = function(investigation) {
		if($scope.adminNewAppointmentCust.appointment.document.assessment == undefined) {
			$scope.adminNewAppointmentCust.appointment.document.assessment = {};
		}
		if($scope.adminNewAppointmentCust.appointment.document.assessment.investigations == undefined) {
			$scope.adminNewAppointmentCust.appointment.document.assessment.investigations = [];
		}
		$scope.adminNewAppointmentCust.appointment.document.assessment.investigations.push(investigation);
		$scope.$apply();
	}

	$scope.nextImage = function(currentIndex) {
		if(currentIndex + 1 == $scope.adminNewAppointmentCust.documentRO.assessment.investigations.length) {
			$scope.imgIndex = 0;
		}
		else {
			$scope.imgIndex = currentIndex + 1;
		}
	}

	$scope.prevImage = function(currentIndex) {
		if(currentIndex - 1 == -1) {
			$scope.imgIndex = $scope.adminNewAppointmentCust.documentRO.assessment.investigations.length - 1;
		}
		else {
			$scope.imgIndex = currentIndex - 1;
		}
	}

	$scope.emailLifeStyleInfo = function() {
		var shorttermgoals = null;
		if($scope.adminNewAppointmentCust.appointment.document.goalsettings == undefined || $scope.adminNewAppointmentCust.appointment.document.goalsettings.shorttermgoals == undefined || $scope.adminNewAppointmentCust.appointment.document.goalsettings.shorttermgoals.length == 0) {
			shorttermgoals = "";
		} else {
			shorttermgoals = $scope.adminNewAppointmentCust.appointment.document.goalsettings.shorttermgoals;
		}

		var longtermgoals = null;
		if($scope.adminNewAppointmentCust.appointment.document.goalsettings == undefined || $scope.adminNewAppointmentCust.appointment.document.goalsettings.longtermgoals == undefined || $scope.adminNewAppointmentCust.appointment.document.goalsettings.longtermgoals.length == 0) {
			longtermgoals = "";
		} else {
			longtermgoals = $scope.adminNewAppointmentCust.appointment.document.goalsettings.longtermgoals;
		}

		var dosages = null;
		if($scope.adminNewAppointmentCust.appointment.document.treatment == undefined || $scope.adminNewAppointmentCust.appointment.document.treatment.dosages == undefined || $scope.adminNewAppointmentCust.appointment.document.treatment.dosages.length == 0) {
			dosages = "";
		} else {
			dosages = $scope.adminNewAppointmentCust.appointment.document.treatment.dosages;
		}

		var proposedprogression = null;
		if($scope.adminNewAppointmentCust.appointment.document.treatment == undefined || $scope.adminNewAppointmentCust.appointment.document.treatment.proposedprogression == undefined || $scope.adminNewAppointmentCust.appointment.document.treatment.proposedprogression.length == 0) {
			proposedprogression = "";
		} else {
			proposedprogression = $scope.adminNewAppointmentCust.appointment.document.treatment.proposedprogression;
		}

		var lifestylechanges = null;
		if($scope.adminNewAppointmentCust.appointment.document.treatment == undefined || $scope.adminNewAppointmentCust.appointment.document.treatment.lifestylechanges == undefined || $scope.adminNewAppointmentCust.appointment.document.treatment.lifestylechanges.length == 0) {
			lifestylechanges = "";
		} else {
			lifestylechanges = $scope.adminNewAppointmentCust.appointment.document.treatment.lifestylechanges;
		}

		var nosessionswithfrequency = null;
		if($scope.adminNewAppointmentCust.appointment.document.treatment == undefined || $scope.adminNewAppointmentCust.appointment.document.treatment.nosessionswithfrequency == undefined || $scope.adminNewAppointmentCust.appointment.document.treatment.nosessionswithfrequency.length == 0) {
			nosessionswithfrequency = "";
		} else {
			nosessionswithfrequency = $scope.adminNewAppointmentCust.appointment.document.treatment.nosessionswithfrequency;
		}

		var data = {
			"cust_name": $scope.adminNewAppointmentCust.customer.name,
			"cust_email": $scope.adminNewAppointmentCust.customer.email,
			"sp_name": $scope.adminNewAppointmentCust.sp.name,
			"short_term_goals": shorttermgoals,
			"long_term_goals": longtermgoals,
			"treatment_dosages": dosages,
			"treatment_progression_proposed": proposedprogression,
			"treatment_HEP_lifestyle_modifications": lifestylechanges,
			"treatment_number_of_sessions": nosessionswithfrequency
		};

		adminApi.emailLifeStyleInformation($scope.adminNewAppointmentCust.customer.healyoscustid, data)
		.success(function(data, status, headers, config) {
			alert("Lifestyle Information sent successfully!");
		})
		.error(function(data, status, headers, config) {
			alert(data.error.message);
			$scope.checkSessionTimeout(data);
		});
	}

	$scope.getSps = function (value) {
		
		var cityId = "";
		$scope.arrSpRecords.cityId = "";

		if(value == undefined || value == "" || value.length < 1) {
			cityId = $scope.appointmentCityId;
		} else if (value != undefined && value == 'addSpWrkHrs') {
			cityId = cache.cityToIdMap[$scope.cityName];
		} else if (value != undefined && value == 'markSpLeaves') {
			cityId = cache.cityToIdMap[$scope.cityName];
		} else if (value != undefined && value.length > 1) {
			cityId = value;
		}

		if(cityId != undefined && cityId != "" && cityId.length > 0) {
			adminApi.getSps(cityId)
			.success(function(data, status, headers, config) {
				if(data.payload.spList != undefined && data.payload.spList != ""){
					$scope.spNamesArr = data.payload.spList;
					$scope.arrSpRecords = angular.copy(data.payload.spList);
				}
				
				if(data.payload.cityId != "" && data.payload.cityId != undefined){
					$scope.arrSpRecords.cityId = data.payload.cityId;
				}

				for(var i = 0 ; i < $scope.arrSpRecords.length ; i++) {
					$scope.arrSpRecords[i].primaryZones = [];
					$scope.arrSpRecords[i].secondaryZones = [];

					for(var j = 0 ; j < $scope.arrSpRecords[i].zones.length ; j++) {
						if ($scope.arrSpRecords[i].zones[j].zonerole == 1) {
							$scope.arrSpRecords[i].primaryZones.push($scope.arrSpRecords[i].zones[j].name);
						} else if ($scope.arrSpRecords[i].zones[j].zonerole == 2) {
							$scope.arrSpRecords[i].secondaryZones.push($scope.arrSpRecords[i].zones[j].name);
						}
					}
				}

				for(var i = 0 ; i < $scope.spNamesArr.length ; i++) {
					if($scope.obj.followupSpid == $scope.spNamesArr[i]._id) {
						$scope.spNewAppointment.spNames = $scope.spNamesArr[i]._id;
						break;
					}
				}
				if(data.payload.spList==undefined){
					$scope.arrSpRecords = [];	
				}
				
			})
			.error(function(data, status, headers, config) {
				$scope.checkSessionTimeout(data);
			});

			adminApi.getCityClinic(cityId)
			.success(function(data, status, headers, config) {
				var arrClinic = [];
				var arrClinic = data.payload;
				console.log("successfully received city wise clinics");
				$scope.arrayClinic.push({"_id":"0", "clinic_name":"Home"});
				arrClinic.forEach(function(item) {
					$scope.arrayClinic.push(item);
				});
				cache.clinicIdToNameMap = buildClinicIdToNameMap(data.payload);
			})
			.error(function(data, status, headers, config) {
				$scope.checkSessionTimeout(data);
			});
		}
	}
    

    $scope.getClinicSps = function (clinic_id) {

		var cityId = $scope.users1.city;

		if(clinic_id != undefined && clinic_id != 0){

			adminApi.getClinicSps(clinic_id)
			.success(function(data, status, headers, config) {

				$scope.spNamesArr = data.payload.spList;
				$scope.arrSpRecords = angular.copy(data.payload.spList);
				$scope.arrSpRecords.cityId = data.payload.cityId;

				for(var i = 0 ; i < $scope.arrSpRecords.length ; i++) {
					$scope.arrSpRecords[i].primaryZones = [];
					$scope.arrSpRecords[i].secondaryZones = [];

					for(var j = 0 ; j < $scope.arrSpRecords[i].zones.length ; j++) {
						if ($scope.arrSpRecords[i].zones[j].zonerole == 1) {
							$scope.arrSpRecords[i].primaryZones.push($scope.arrSpRecords[i].zones[j].name);
						} else if ($scope.arrSpRecords[i].zones[j].zonerole == 2) {
							$scope.arrSpRecords[i].secondaryZones.push($scope.arrSpRecords[i].zones[j].name);
						}
					}
				}

				for(var i = 0 ; i < $scope.spNamesArr.length ; i++) {
					if($scope.obj.followupSpid == $scope.spNamesArr[i]._id) {
						$scope.spNewAppointment.spNames = $scope.spNamesArr[i]._id;
						break;
					}
				}
				
			})
			.error(function(data, status, headers, config) {
				$scope.checkSessionTimeout(data);
			});

		}else{

			if(cityId != undefined && cityId != "" && cityId.length > 0) {
				adminApi.getSps(cityId)
				.success(function(data, status, headers, config) {
					$scope.spNamesArr = data.payload.spList;
					$scope.arrSpRecords = angular.copy(data.payload.spList);
					$scope.arrSpRecords.cityId = data.payload.cityId;

					for(var i = 0 ; i < $scope.arrSpRecords.length ; i++) {
						$scope.arrSpRecords[i].primaryZones = [];
						$scope.arrSpRecords[i].secondaryZones = [];

						for(var j = 0 ; j < $scope.arrSpRecords[i].zones.length ; j++) {
							if ($scope.arrSpRecords[i].zones[j].zonerole == 1) {
								$scope.arrSpRecords[i].primaryZones.push($scope.arrSpRecords[i].zones[j].name);
							} else if ($scope.arrSpRecords[i].zones[j].zonerole == 2) {
								$scope.arrSpRecords[i].secondaryZones.push($scope.arrSpRecords[i].zones[j].name);
							}
						}
					}

					for(var i = 0 ; i < $scope.spNamesArr.length ; i++) {
						if($scope.obj.followupSpid == $scope.spNamesArr[i]._id) {
							$scope.spNewAppointment.spNames = $scope.spNamesArr[i]._id;
							break;
						}
					}
				})
				.error(function(data, status, headers, config) {
					$scope.checkSessionTimeout(data);
				});
			}

	   }
	}


	$scope.reAssignCityId = function () {
		$timeout(function(){
			$scope.spDetails.workCity = $scope.arrSpRecords.cityId;
		}, 100);
	}

	$scope.setChangedSpId = function () {
		if($scope.obj.followupSpid != $scope.spNewAppointment.spNames) {
			$scope.obj.followupSpid = $scope.spNewAppointment.spNames;
			$scope.spInfo = false;
			$scope.wtUndefined = false;
			$scope.getSpMonthlyAppointmentAvailability();
		}
	}

	$scope.showSpManagementWebPage = function(selectedTab) {
		$scope.spDetails.workCity = "";
		if(selectedTab == "Add Edit Service Provider") {
			$scope.spManagementSelectedTab = "Add Edit Service Provider";
		} else if (selectedTab == "Set Working Hours") {
			$scope.spManagementSelectedTab = "Set Working Hours";
		} else if (selectedTab == "Mark Leaves") {
			$scope.spManagementSelectedTab = "Mark Leaves";
		}
	}

	/*$scope.initAddNewSp = function() {
		$timeout(function(){
            spAllZonesOptions = angular.copy($rootScope.zonesList);
            spNonDeletedZones = [];
            for (var i = 0 ; i < spAllZonesOptions.length ;i++){
                if (spAllZonesOptions[i].deleted == false){
                    spNonDeletedZones.push(spAllZonesOptions[i]);
                }
            }
			$scope.spPrimaryZonesOptions = angular.copy(spNonDeletedZones);
			$scope.spSecondaryZonesOptions = angular.copy(spNonDeletedZones);
		}, 900);
	}*/

	$scope.populateCityBasedZones = function() {
		$scope.spPrimaryZonesOptions = [];
		$scope.spSecondaryZonesOptions = [];
		$scope.displaySpPrimaryZones = [];
		$scope.displaySpSecondaryZones = [];
		$scope.spPrimaryZones = [];
		$scope.spSecondaryZones = [];
		$scope.spCityBasedLocations = [];

		$timeout(function(){
            spAllZonesOptions = angular.copy($rootScope.zonesList);
            spNonDeletedZones = [];
           
            for (var i = 0 ; i < spAllZonesOptions.length ;i++){
                if ((spAllZonesOptions[i].deleted == false) && (spAllZonesOptions[i].cityid == $scope.spDetails.spCity)){
                    spNonDeletedZones.push(spAllZonesOptions[i]);
                    //console.log("zonelist id" + spAllZonesOptions[i].cityid);
                   // console.log("selected id" + $scope.spDetails.spCity);
                   // console.log(spAllZonesOptions[i]);
                }
            }

			$scope.spPrimaryZonesOptions = angular.copy(spNonDeletedZones);
			$scope.spSecondaryZonesOptions = angular.copy(spNonDeletedZones);
			
		}, 900);


	}

	$scope.populateCityBasedSps = function(cityId) {
		$scope.cityIdValue = cityId;
		$scope.cityBasedSps =[];
		$scope.cityBasedSpsForViewSlot =[];
		$scope.locationArray =[];

		$scope.populateCityBasedZonesForSlot(cityId);

		//$scope.curdate = moment().format("YYYY-MMM-DD");
		$scope.curdate = moment().format("DD-MMM-YYYY");
		$scope.curdate1 = moment().format("MMMM");
		$('.dateTimePickerSlot').val($scope.curdate);
		$('.dateTimePickerOnlyMonth').val($scope.curdate1);

		adminApi.getAllSps().
		success(function (data, status, headers, config) {
			$scope.spNamesArr = data.payload.spList;
			$scope.arrayAllSps = angular.copy(data.payload.spList);
			$scope.arrayAllSps.cityId = data.payload.cityId;

			for(var i = 0 ; i < $scope.arrayAllSps.length ; i++) {
				$scope.arrayAllSps[i].primaryZones = [];
				$scope.arrayAllSps[i].secondaryZones = [];

				for(var j = 0 ; j < $scope.arrayAllSps[i].zones.length ; j++) {
					if ($scope.arrayAllSps[i].zones[j].zonerole == 1) {
						$scope.arrayAllSps[i].primaryZones.push($scope.arrayAllSps[i].zones[j].name);
					} else if ($scope.arrayAllSps[i].zones[j].zonerole == 2) {
						$scope.arrayAllSps[i].secondaryZones.push($scope.arrayAllSps[i].zones[j].name);
					}
				}

				if($scope.arrayAllSps[i].cityId == cityId){
					$scope.cityBasedSps.push($scope.arrayAllSps[i]);
					$scope.cityBasedSpsForViewSlot.push($scope.arrayAllSps[i]);
				}
			}

			for(var i = 0 ; i < $scope.spNamesArr.length ; i++) {
				if($scope.obj.followupSpid == $scope.spNamesArr[i]._id) {
					$scope.spNewAppointment.spNames = $scope.spNamesArr[i]._id;
					break;
				}
			}

			var obj = {"_id":"All","name":"All"};
			$scope.cityBasedSps.push(obj);

			//console.log('city based sps');
			//console.log($scope.cityBasedSps);

			$scope.SpWrkHrs.spNamesIdSlot = 'All';
			$scope.SpWrkHrs.spZones = "All";


		}).
		error(function (data, status, headers, config) {
			console.log("Error in receiving Sps");
		});

		/*$scope.arrayAllSps.forEach(function(item) {
			if(item.cityId == cityId){
				$scope.cityBasedSps.push(item);
			}
		});*/

		$scope.cityBasedLocations =[];
		$scope.cityBasedLocations.push({"_id":"0", "clinic_name":"Home"});
		/*$scope.arrayAllActiveClinics.forEach(function(item) {
			if(item.clinic_city == cityId){
				$scope.cityBasedLocations.push(item);
			}
		});*/

		$scope.getSps($scope.SpWrkHrs.spCity);

		//set veiw table as per current date
		setTimeout(function() {
			$scope.todaysDate = moment().format("D-MM-YYYY");
			$scope.loadSlotViewTable($scope.todaysDate);
		}, 300);


	}

    $scope.populateCityBasedZonesForSlot = function(cityId) {	
			//alert('Hi');
			adminApi.getZones(cityId)
			.success(function(data, status, headers, config){
				var dataArray = [];
				dataArray = data.payload;
				$scope.locationArray = [];
				//console.log(dataArray);
				for(var i = 0 ; i < dataArray.length ; i++) {                                       
                if(!dataArray[i].hasOwnProperty("deleted") || dataArray[i].deleted === false) {
					var zoneid = dataArray[i].zoneid;
					var zonename = dataArray[i].zonename;
					var price = dataArray[i].price;
					var pincodeArray = dataArray[i].pincodes;
					for(var j = 0 ; j < pincodeArray.length ; j++) {
                          var isdeleted = pincodeArray[j].isdeleted;
                        if (isdeleted === false){
                            var pincodeVal = pincodeArray[j].pin;
                            var pincodeid = pincodeArray[j].pincodeid;
                            var localitiesVal = pincodeArray[j].localities;
                            var locationObj = {
                                "zoneid": zoneid,
                                "zonename": zonename,
                                "pin": pincodeVal,
                                "pincodeid": pincodeid,
                                "localities": localitiesVal,
                                "val": pincodeVal + " " + localitiesVal,
                                "price": price,
                                "cityId": cityId
                            };                       
                            $scope.locationArray.push(locationObj);                      
                        }
					}
                  }
				}

				var obj ={  "zoneid": "All",
	                "zonename": "All",	         	       
	                "val":"All",
	                "cityId": cityId
	            };
				$scope.locationArray.push(obj);

				//console.log("HHHHHHHHH");
				//console.log($scope.locationArray);

			
			})
			.error(function(data, status, headers, config){
				console.log("Error in getting Zones");
			});


	}


	$scope.resetCity = function() {
		$scope.SpWrkHrs.spCity = $scope.cityIdValue;
	}


	$scope.populatePrimaryZones = function (item, eventName) {
		if (eventName == "onItemSelect" && item != undefined) {
			//$scope.spPrimaryZonesOptions = angular.copy($rootScope.zonesList);

			// Remove secondary zone selected items from primary zones
			for(var i = 0 ; i < $scope.spPrimaryZonesOptions.length ; i++) {
				for(var j = 0 ; j < $scope.spSecondaryZones.length ; j++) {
					if($scope.spPrimaryZonesOptions[i].zoneid == $scope.spSecondaryZones[j].id) {
						$scope.spPrimaryZonesOptions.splice(i, 1);
					}
				}
			}
		} else if (eventName == "onItemDeselect" && item != undefined) {
			//$scope.spPrimaryZonesOptions = angular.copy($rootScope.zonesList);

			for(var i = 0 ; i < $scope.spPrimaryZonesOptions.length ; i++) {
				for(var j = 0 ; j < $scope.spSecondaryZones.length ; j++) {
					if($scope.spPrimaryZonesOptions[i].zoneid == $scope.spSecondaryZones[j].id) {
						$scope.spPrimaryZonesOptions.splice(i, 1);
					}
				}
			}
		} else if (eventName == "onSelectAll" && item == undefined) {
			//$scope.spPrimaryZonesOptions = angular.copy($rootScope.zonesList);

			// Remove secondary zone selected items from primary zones
			for(var i = 0 ; i < $scope.spPrimaryZonesOptions.length ; i++) {
				for(var j = 0 ; j < $scope.spSecondaryZones.length ; j++) {
					if($scope.spPrimaryZonesOptions[i].zoneid == $scope.spSecondaryZones[j].id) {
						$scope.spPrimaryZonesOptions.splice(i, 1);
					}
				}
			}
		} else if (eventName == "onDeselectAll" && item == undefined) {
			//$scope.spPrimaryZonesOptions = angular.copy($rootScope.zonesList);
		}
	}

	$scope.populateSecondaryZones = function (item, eventName) {
		if (eventName == "onItemSelect" && item != undefined) {
			//$scope.spSecondaryZonesOptions = angular.copy($rootScope.zonesList);

			// Remove primary zone selected items from secondary zones
			for(var i = 0 ; i < $scope.spSecondaryZonesOptions.length ; i++) {
				for(var j = 0 ; j < $scope.spPrimaryZones.length ; j++) {
					if($scope.spSecondaryZonesOptions[i].zoneid == $scope.spPrimaryZones[j].id) {
						$scope.spSecondaryZonesOptions.splice(i, 1);
					}
				}
			}
		} else if (eventName == "onItemDeselect" && item != undefined) {
			//$scope.spSecondaryZonesOptions = angular.copy($rootScope.zonesList);

			// Remove primary zone selected items from secondary zones
			for(var i = 0 ; i < $scope.spSecondaryZonesOptions.length ; i++) {
				for(var j = 0 ; j < $scope.spPrimaryZones.length ; j++) {
					if($scope.spSecondaryZonesOptions[i].zoneid == $scope.spPrimaryZones[j].id) {
						$scope.spSecondaryZonesOptions.splice(i, 1);
					}
				}
			}
		} else if (eventName == "onSelectAll" && item == undefined) {
			//$scope.spSecondaryZonesOptions = angular.copy($rootScope.zonesList);

			// Remove primary zone selected items from secondary zones
			for(var i = 0 ; i < $scope.spSecondaryZonesOptions.length ; i++) {
				for(var j = 0 ; j < $scope.spPrimaryZones.length ; j++) {
					if($scope.spSecondaryZonesOptions[i].zoneid == $scope.spPrimaryZones[j].id) {
						$scope.spSecondaryZonesOptions.splice(i, 1);
					}
				}
			}
		} else if (eventName == "onDeselectAll" && item == undefined) {
			//$scope.spSecondaryZonesOptions = angular.copy($rootScope.zonesList);
		}
	}

	$scope.registerDatePicker = function () {
		var d = moment(new Date()).format('YYYY/MM/DD');
		$('#datetimepicker8').datetimepicker({
			format: 'YYYY-MM-DD',
			maxDate: d
		});

		$('#datetimepicker8').blur(function () {
			$scope.$apply(function() {
				var tempDate = angular.copy($('#datetimepicker8').val());
				var boolFlag = moment(tempDate, "YYYY-MM-DD", true).isValid();
				if(boolFlag) {
					$scope.spDob = $('#datetimepicker8').val();
				} else {
					var d = moment(new Date()).format('YYYY-MM-DD');
					$('#datetimepicker8').val(d);
					$scope.spDob = d;
				}
			});
		});
		$('#datetimepicker8').val('');
	}

	$scope.adminCallMeListReset = function() {
		$scope.patientDetailsForAdmin.fromDate = "";
		$scope.patientDetailsForAdmin.tillDate = "";

		$scope.callMeform.patientDetailsForm.$setPristine();
		$scope.callMeform.patientDetailsForm.$setUntouched();
	}

	$scope.resetAddNewSpForm = function () {
		$scope.spDetails = {};
		$scope.addNewSpForm.adminFormForNewSp.$setPristine();
		$scope.addNewSpForm.adminFormForNewSp.$setUntouched();

		$scope.spDob = "";
		$('#datetimepicker8').val('');
		$scope.spPrimaryZones = [];
		$scope.spSecondaryZones = [];

		$scope.displaySpPrimaryZones = [];
		$scope.displaySpSecondaryZones = [];
	}

	$scope.addNewSpRecord = function () {
		if ($scope.spDetails.spGender == "male") {
			$scope.spDetails.spGender = "Male";
		} else if ($scope.spDetails.spGender == "female") {
			$scope.spDetails.spGender = "Female";
		}

		var sp_alternateEmail = null;
		if($scope.spDetails == undefined || $scope.spDetails.spAlternateEmail == undefined || $scope.spDetails.spAlternateEmail.length == 0) {
			sp_alternateEmail = "";
		} else {
			sp_alternateEmail = $scope.spDetails.spAlternateEmail;
		}

		var sp_alternateContact = null;
		if($scope.spDetails == undefined || $scope.spDetails.spAlternateContact == undefined || $scope.spDetails.spAlternateContact.length == 0) {
			sp_alternateContact = "";
		} else {
			sp_alternateContact = $scope.spDetails.spAlternateContact;
		}

		var sp_dob = null;
		if($scope.spDob == undefined || $scope.spDob.length == 0) {
			sp_dob = "";
		} else {
			sp_dob = $scope.spDob;
		}

		var cityName= '';
		$scope.arrayActiveCity.forEach(function(item) {
			if(item._id == $scope.spDetails.spCity){
				cityName = item.city_name;
			}
		});

		var spDetailsObj = {
			//"sp_servingCityId": $scope.spDetails.workCity,
			"sp_servingCityId": $scope.spDetails.spCity,
			"sp_name": $scope.spDetails.spName,
			"sp_qualification": $scope.spDetails.qualification,
			"sp_email": $scope.spDetails.spEmail,
			"sp_alternateEmail": sp_alternateEmail,
			"sp_address": $scope.spDetails.spAddress,
			"sp_pincode": $scope.spDetails.spPincode,
			"sp_city": cityName,
			"sp_cityid": $scope.spDetails.spCity,
			"sp_state": $scope.spDetails.spState,
			"sp_country": $scope.spDetails.spCountry,
			"sp_mobile": $scope.spDetails.spMobile,
			"sp_alternateContact": sp_alternateContact,
			"sp_gender": $scope.spDetails.spGender,
			"sp_dob": sp_dob,
			"sp_primaryZones": $scope.spPrimaryZones,
			"sp_secondaryZones": $scope.spSecondaryZones
		};

		adminApi.addNewSpRecord(spDetailsObj)
		.success(function(data, status, headers, config) {
			alert("New service provider record inserted successfully!");
			$scope.visitedSpDob = false;
			$scope.resetAddNewSpForm();
			$scope.manageSp.showSpForm = false;
			$scope.manageSp.addNewSp = false;
			$scope.manageSp.updateSp = false;
			$scope.getSps($scope.arrSpRecords.cityId);
			$scope.spDetails.workCity = $scope.arrSpRecords.cityId;
		})
		.error(function(data, status, headers, config) {
			if ((data.payload != undefined) && (data.payload.email != undefined) && (data.payload.mobile != undefined) && (data.error.message != undefined)) {
					var strError = "Error: " + data.error.message + "\n";
					if(data.error.errorCode == 3238134002) {
						strError = strError + "Below is the service provider details which has same email address: \n";

						strError = strError + "Name: ";
						strError = strError + data.payload.spname;
						strError = strError + "\n";

						strError = strError + "Email: ";
						strError = strError + data.payload.email;
						strError = strError + "\n";

						strError = strError + "\nSubmit different email address and then try again.";
					}
					else if(data.error.errorCode == 3238134003) {
						strError = strError + "Below is the service provider details which has same mobile number: \n";

						strError = strError + "Name: ";
						strError = strError + data.payload.spname;
						strError = strError + "\n";

						strError = strError + "Mobile: ";
						strError = strError + data.payload.mobile;
						strError = strError + "\n";

						strError = strError + "\nSubmit different mobile number and then try again.";
					}

					alert(strError);
			} else {
				alert(data.error.message);
			}
			$scope.checkSessionTimeout(data);
		});
	}

	$scope.updateSpRecord = function () {
		if ($scope.spDetails.spGender == "male") {
			$scope.spDetails.spGender = "Male";
		} else if ($scope.spDetails.spGender == "female") {
			$scope.spDetails.spGender = "Female";
		}

		var sp_alternateEmail = null;
		if($scope.spDetails == undefined || $scope.spDetails.spAlternateEmail == undefined || $scope.spDetails.spAlternateEmail.length == 0) {
			sp_alternateEmail = "";
		} else {
			sp_alternateEmail = $scope.spDetails.spAlternateEmail;
		}

		var sp_alternateContact = null;
		if($scope.spDetails == undefined || $scope.spDetails.spAlternateContact == undefined || $scope.spDetails.spAlternateContact.length == 0) {
			sp_alternateContact = "";
		} else {
			sp_alternateContact = $scope.spDetails.spAlternateContact;
		}

		var sp_dob = null;
		if($scope.spDob == undefined || $scope.spDob.length == 0) {
			sp_dob = "";
		} else {
			sp_dob = $scope.spDob;
		}

		var cityName= '';
		$scope.arrayActiveCity.forEach(function(item) {
			if(item._id == $scope.spDetails.spCity){
				cityName = item.city_name;
			}
		});

		var spDetailsObj = {
			//"sp_servingCityId": $scope.spDetails.workCity,
			"sp_servingCityId": $scope.spDetails.spCity,
			"sp_name": $scope.spDetails.spName,
			"sp_qualification": $scope.spDetails.qualification,
			"sp_email": $scope.spDetails.spEmail,
			"sp_alternateEmail": sp_alternateEmail,
			"sp_address": $scope.spDetails.spAddress,
			"sp_pincode": $scope.spDetails.spPincode,
			"sp_city": cityName,
			"sp_cityid": $scope.spDetails.spCity,
			"sp_state": $scope.spDetails.spState,
			"sp_country": $scope.spDetails.spCountry,
			"sp_mobile": $scope.spDetails.spMobile,
			"sp_alternateContact": sp_alternateContact,
			"sp_gender": $scope.spDetails.spGender,
			"sp_dob": sp_dob,
			"sp_primaryZones": $scope.spPrimaryZones,
			"sp_secondaryZones": $scope.spSecondaryZones
		};

		adminApi.updateSpRecord(spDetailsObj, $scope.selectedSpId)
		.success(function(data, status, headers, config) {
			alert("Service provider record updated successfully!");
			$scope.visitedSpDob = false;
			$scope.resetAddNewSpForm();
			$scope.manageSp.showSpForm = false;
			$scope.manageSp.addNewSp = false;
			$scope.manageSp.updateSp = false;
			$scope.selectedSpId = "";
			$scope.getSps($scope.arrSpRecords.cityId);
			$scope.spDetails.workCity = $scope.arrSpRecords.cityId;
		})
		.error(function(data, status, headers, config) {
			if ((data.payload != undefined) && (data.payload.email != undefined) && (data.payload.mobile != undefined) && (data.error.message != undefined)) {
				var strError = "Error: " + data.error.message + "\n";
				if(data.error.errorCode == 3238134002) {
					strError = strError + "Below is the service provider details which has same email address: \n";

					strError = strError + "Name: ";
					strError = strError + data.payload.spname;
					strError = strError + "\n";

					strError = strError + "Email: ";
					strError = strError + data.payload.email;
					strError = strError + "\n";

					strError = strError + "\nSubmit different email address and then try again.";
				}
				else if(data.error.errorCode == 3238134003) {
					strError = strError + "Below is the service provider details which has same mobile number: \n";

					strError = strError + "Name: ";
					strError = strError + data.payload.spname;
					strError = strError + "\n";

					strError = strError + "Mobile: ";
					strError = strError + data.payload.mobile;
					strError = strError + "\n";

					strError = strError + "\nSubmit different mobile number and then try again.";
				}

				alert(strError);
			} else {
				alert(data.error.message);
			}
			$scope.checkSessionTimeout(data);
		});
	}

	$scope.deleteSpRecord = function(rec, index) {
		var result = confirm("Do you want to delete the record?");
		if(result == true) {
			adminApi.deleteSpRecord(rec._id).
			success(function (data, status, headers, config) {
				console.log("Service provider record deleted successfully!");
				$scope.getSps($scope.arrSpRecords.cityId);
			}).
			error(function (data, status, headers, config) {
				if ((data.payload != undefined) && (data.payload.arrErrResponse != undefined) && (data.payload.arrErrResponse.length > 0) && (data.error.message != undefined)) {
					var strError = "Error: " + data.error.message + "\n";
					if(data.error.errorCode == 3238133998) {
						strError = strError + "Below are the appointment details which are yet to be served by this service provider: \n";
					}
					else if(data.error.errorCode == 3238134001) {
						strError = strError + "Below are the appointment details which are in \"waiting for approval\" state which if approved are to be served by this service provider: \n";
					}

					for(var i = 0 ; i < data.payload.arrErrResponse.length ; i++) {
						var index = i + 1;
						strError = strError + index;
						strError = strError + ") ";
						strError = strError + "Appt. refno: ";
						strError = strError + data.payload.arrErrResponse[i].refno;
						strError = strError + "\n";

						strError = strError + "Appt. start time: ";
						var starttime = moment(data.payload.arrErrResponse[i].starttime * 1000).format("YYYY-MM-DD hh:mm a");
						strError = strError + starttime;
						strError = strError + "\n";

						strError = strError + "Patient name: ";
						strError = strError + data.payload.arrErrResponse[i].patientname;
						strError = strError + "\n";
					}

					if(data.error.errorCode == 3238133998) {
						strError = strError + "\nEither cancel these appointments or assign other service providers for these appointments and then try again.";
					}
					else if(data.error.errorCode == 3238134001) {
						strError = strError + "\nIf feasible then reject these appointments and then try again.";
					}

					alert(strError);
				} else {
					console.log("Failed to delete service provider record.");
				}
			});
		}
	};

	$scope.populateDisplaySpPrimaryZones = function (item, eventName) {
		if (eventName == "onItemSelect" && item != undefined) {
			$scope.displaySpPrimaryZones = [];
			$scope.tempAllZonesArr = angular.copy($rootScope.zonesList);

			for(var i = 0 ; i < $scope.tempAllZonesArr.length ; i++) {
				for(var j = 0 ; j < $scope.spPrimaryZones.length ; j++) {
					if($scope.tempAllZonesArr[i].zoneid == $scope.spPrimaryZones[j].id) {
						$scope.displaySpPrimaryZones.push($scope.tempAllZonesArr[i]);
					}
				}
			}
		} else if (eventName == "onItemDeselect" && item != undefined) {
			$scope.displaySpPrimaryZones = [];
			$scope.tempAllZonesArr = angular.copy($rootScope.zonesList);

			for(var i = 0 ; i < $scope.tempAllZonesArr.length ; i++) {
				for(var j = 0 ; j < $scope.spPrimaryZones.length ; j++) {
					if($scope.tempAllZonesArr[i].zoneid == $scope.spPrimaryZones[j].id) {
						$scope.displaySpPrimaryZones.push($scope.tempAllZonesArr[i]);
					}
				}
			}
		} else if (eventName == "onSelectAll" && item == undefined) {
			$scope.displaySpPrimaryZones = [];
			$scope.tempAllZonesArr = angular.copy($rootScope.zonesList);

			for(var i = 0 ; i < $scope.tempAllZonesArr.length ; i++) {
				for(var j = 0 ; j < $scope.spPrimaryZones.length ; j++) {
					if($scope.tempAllZonesArr[i].zoneid == $scope.spPrimaryZones[j].id) {
						$scope.displaySpPrimaryZones.push($scope.tempAllZonesArr[i]);
					}
				}
			}
		} else if (eventName == "onDeselectAll" && item == undefined) {
			$scope.displaySpPrimaryZones = [];
		}
	}

	$scope.populateDisplaySpSecondaryZones = function (item, eventName) {
		if (eventName == "onItemSelect" && item != undefined) {
			$scope.displaySpSecondaryZones = [];
			$scope.tempAllZonesArr = angular.copy($rootScope.zonesList);

			for(var i = 0 ; i < $scope.tempAllZonesArr.length ; i++) {
				for(var j = 0 ; j < $scope.spSecondaryZones.length ; j++) {
					if($scope.tempAllZonesArr[i].zoneid == $scope.spSecondaryZones[j].id) {
						$scope.displaySpSecondaryZones.push($scope.tempAllZonesArr[i]);
					}
				}
			}
		} else if (eventName == "onItemDeselect" && item != undefined) {
			$scope.displaySpSecondaryZones = [];
			$scope.tempAllZonesArr = angular.copy($rootScope.zonesList);

			for(var i = 0 ; i < $scope.tempAllZonesArr.length ; i++) {
				for(var j = 0 ; j < $scope.spSecondaryZones.length ; j++) {
					if($scope.tempAllZonesArr[i].zoneid == $scope.spSecondaryZones[j].id) {
						$scope.displaySpSecondaryZones.push($scope.tempAllZonesArr[i]);
					}
				}
			}
		} else if (eventName == "onSelectAll" && item == undefined) {
			$scope.displaySpSecondaryZones = [];
			$scope.tempAllZonesArr = angular.copy($rootScope.zonesList);

			for(var i = 0 ; i < $scope.tempAllZonesArr.length ; i++) {
				for(var j = 0 ; j < $scope.spSecondaryZones.length ; j++) {
					if($scope.tempAllZonesArr[i].zoneid == $scope.spSecondaryZones[j].id) {
						$scope.displaySpSecondaryZones.push($scope.tempAllZonesArr[i]);
					}
				}
			}
		} else if (eventName == "onDeselectAll" && item == undefined) {
			$scope.displaySpSecondaryZones = [];
		}
	}

	$scope.initSelectAllDaysExceptSunday = function () {
		var dateObject = new Date(); // current date
		var currentDay = null;
		var lastDay = null;

		// currentDay = new Date(dateObject.getFullYear(), dateObject.getMonth(), dateObject.getDate());
		/* There will be no restriction to disable past days. So starting from day 1 */
		currentDay = new Date(dateObject.getFullYear(), dateObject.getMonth(), 1);
		lastDay = new Date(dateObject.getFullYear(), dateObject.getMonth() + 1, 0);

		arrayDates = [];
		for(var dateObjIndex = currentDay ; dateObjIndex <= lastDay ; dateObjIndex.setDate(dateObjIndex.getDate() + 1)) {

			if(dateObjIndex.getDay() >= 0 && dateObjIndex.getDay() <= 6) {
				var year = dateObjIndex.getFullYear();

				var intMonth = dateObjIndex.getMonth() + 1;
				var strMonth = intMonth + "";
				var lenStrMonth = strMonth.length;
				if(lenStrMonth != 2 && lenStrMonth == 1) {
					strMonth = "0" + strMonth;
				}

				var dayObj = dateObjIndex.getDate() + "";
				var lenDay = dayObj.length;
				if(lenDay != 2 && lenDay == 1) {
				  dayObj = "0" + dayObj;
				}

				var dateVal = year + "-" + strMonth + "-" + dayObj;
				arrayDates.push(dateVal);
			} else {
			}
		}
	}

	$scope.selectAllDaysExceptSunday = function (selectedDate) {
		$('#datetimepicker9').multiDatesPicker('removeDates', arrayDates);

		var arrDateInst = [];
		arrDateInst.push($(".ui-datepicker-month").text()); // March
		arrDateInst.push($(".ui-datepicker-year").text()); // 2016
		//alert(selectedDate);
		var monthObj = "";
		var dateObject = new Date(); // current date
		var currentDay = null;
		var lastDay = null;

		if(arrDateInst[0] != "") {
			if (arrDateInst[0] == "January") {
				monthObj = "01";
			} else if(arrDateInst[0] == "February") {
				monthObj = "02";
			} else if(arrDateInst[0] == "March") {
				monthObj = "03";
			} else if(arrDateInst[0] == "April") {
				monthObj = "04";
			} else if(arrDateInst[0] == "May") {
				monthObj = "05";
			} else if(arrDateInst[0] == "June") {
				monthObj = "06";
			} else if(arrDateInst[0] == "July") {
				monthObj = "07";
			} else if(arrDateInst[0] == "August") {
				monthObj = "08";
			} else if(arrDateInst[0] == "September") {
				monthObj = "09";
			} else if(arrDateInst[0] == "October") {
				monthObj = "10";
			} else if(arrDateInst[0] == "November") {
				monthObj = "11";
			} else if(arrDateInst[0] == "December") {
				monthObj = "12";
			}

			// current month
			var intMonth1 = dateObject.getMonth() + 1;
			var strMonth1 = intMonth1 + "";
			var lenStrMonth1 = strMonth1.length;
			if(lenStrMonth1 != 2 && lenStrMonth1 == 1) {
				strMonth1 = "0" + strMonth1;
			}

			// current year
			var currStrYear1 = dateObject.getFullYear() + "";

			if(currStrYear1 == arrDateInst[1] && strMonth1 == monthObj) {
				// currentDay = new Date(dateObject.getFullYear(), dateObject.getMonth(), dateObject.getDate());
				currentDay = new Date(dateObject.getFullYear(), dateObject.getMonth(), 1);
				lastDay = new Date(dateObject.getFullYear(), dateObject.getMonth() + 1, 0);
			} else {
				var intYear = parseInt(arrDateInst[1], 10);
				var intMonth = parseInt(monthObj, 10);
				intMonth = intMonth - 1;

				currentDay = new Date(intYear, intMonth, 1);
				lastDay = new Date(intYear, intMonth + 1, 0);
			}
		} else {
			currentDay = new Date(dateObject.getFullYear(), dateObject.getMonth(), dateObject.getDate());
			lastDay = new Date(dateObject.getFullYear(), dateObject.getMonth() + 1, 0);
		}

		arrayDates = [];
		for(var dateObjIndex = currentDay ; dateObjIndex <= lastDay ; dateObjIndex.setDate(dateObjIndex.getDate() + 1)) {
			if((dateObjIndex.getDay() >= 0 && dateObjIndex.getDay() <= 6)) {
				var year = dateObjIndex.getFullYear();

				var intMonth = dateObjIndex.getMonth() + 1;
				var strMonth = intMonth + "";
				var lenStrMonth = strMonth.length;
				if(lenStrMonth != 2 && lenStrMonth == 1) {
					strMonth = "0" + strMonth;
				}

				var dayObj = dateObjIndex.getDate() + "";
				var lenDay = dayObj.length;
				if(lenDay != 2 && lenDay == 1) {
				  dayObj = "0" + dayObj;
				}

				var dateVal = year + "-" + strMonth + "-" + dayObj;
				arrayDates.push(dateVal);
			} else {
			}
		}

		var e = arrayRemoveDates.indexOf(selectedDate);
		if(e != -1) {
			arrayRemoveDates.splice(e, 1);
		}else{
			arrayRemoveDates.push(selectedDate);
		}
		for(var j=0; j<arrayRemoveDates.length; j++){
			var d = arrayDates.indexOf(arrayRemoveDates[j]);
			if(d != -1) {
				arrayDates.splice(d, 1);
			}
		}

		$('#datetimepicker9').multiDatesPicker('addDates', arrayDates);
	}

	$scope.initDatePicker = function () {
		$scope.initSelectAllDaysExceptSunday();
		//$scope.spChangeAddSpWrkHoursResetValues($scope.SpWrkHrs.spNamesId, $scope.SpWrkHrs.spServiceLocationId, $scope.arrayClinic);
		$scope.spChangeAddSpWrkHoursResetValues($scope.SpWrkHrs.spNamesId, $scope.SpWrkHrs.spServiceLocationId, $scope.arrayAllActiveClinics);
		$timeout(function () {
			var d = moment(new Date()).format('YYYY-MM-DD');
			$('#datetimepicker9').multiDatesPicker({
				dateFormat: "yy-mm-dd",
				//minDate: d,
				addDates: arrayDates,
				altField: '#datePicker9Value',
				onChangeMonthYear: function (year, month, inst) {
					$timeout(function () {
						$scope.selectAllDaysExceptSunday();
						$scope.populateBusySlotsTable1();
						//$scope.spChangeAddSpWrkHoursResetValues($scope.SpWrkHrs.spNamesId, $scope.SpWrkHrs.spServiceLocationId, $scope.arrayClinic);
						$scope.spChangeAddSpWrkHoursResetValues($scope.SpWrkHrs.spNamesId, $scope.SpWrkHrs.spServiceLocationId, $scope.arrayAllActiveClinics);
					}, 50);
				},
				onSelect: function (date, obj) {
					$timeout(function () {
						$scope.selectAllDaysExceptSunday(date);
						$scope.populateBusySlotsTable1();
						//$scope.spChangeAddSpWrkHoursResetValues($scope.SpWrkHrs.spNamesId, $scope.SpWrkHrs.spServiceLocationId, $scope.arrayClinic);
						$scope.spChangeAddSpWrkHoursResetValues($scope.SpWrkHrs.spNamesId, $scope.SpWrkHrs.spServiceLocationId, $scope.arrayAllActiveClinics);
					}, 50);
				}
			});
		}, 100);
	}

	$scope.resetDatePicker9 = function () {
		$('#datetimepicker9').multiDatesPicker('destroy');

		arrayRemoveDates = [];
		$timeout(function(){
			$('#datetimepicker9').val('');
			$scope.initDatePicker();
			$scope.initPopulateBusySlotsTable1();
		}, 100);
	}

	$scope.checkSpWrkHrsButton = function () {
		var isButtonDisabled = true;

		if (!($scope.addSpWrkHrsForm.adminFormForSp.$pristine) && $scope.addSpWrkHrsForm.adminFormForSp.$valid ) {
			if ($scope.wrkHrsAllSlots != undefined && $scope.wrkHrsAllSlots.length > 0) {
				for(var i = 0 ; i < $scope.wrkHrsAllSlots.length ; i++) {
					if($scope.wrkHrsAllSlots[i].selected == true) {
						isButtonDisabled = false;
						break;
					} else {
						isButtonDisabled = true;
					}
				}
			}
		}
		return isButtonDisabled;
	}

	$scope.spChangeAddSpWrkHoursResetValues = function (spId, serviceLocation, clinic_rec) {
		if(spId != undefined && spId != ""){
			$timeout(function() {
				/*if(serviceLocation != undefined){
					$scope.changeWorkTimeSlot(spId, serviceLocation, clinic_rec);
				}else{
					$scope.changeWorkTimeSlot(spId, "0", clinic_rec);
				}*/
				$scope.clinicid = "";
				var tempDateArray = [];
				for (var d = 0; d < arrayDates.length; d++){
					var res = arrayDates[d].split("-").join("");
					tempDateArray.push(res);
				}

				$scope.SpWorkTime = null;
				var dataObj = {
						"sp_id" : spId,
						"service_location" : "",
						"sp_workingDate": tempDateArray
					};

				existingWorkTimeSlots = [];
				existingWorkTimeSlotsForClinic = [];
				existingWorkTimeSlotsForZone = [];
				$scope.clinicNameStr = '';
				$scope.zoneName = '';
				$scope.zoneNameList = [];
				adminApi.getSpMonthlyWtimeAndOffSlots(dataObj)
				.success(function(data, status, headers, config) {
					$scope.SpWorkTime = data.payload.sp_monthlyWtimeAndOffSlots;

					var record_1 = null;
					record_1 = data.payload.sp_monthlyWtimeAndOffSlots;
					 record_1.forEach(function(item_1) {
						var record_2 = null;
						if(item_1.wtime != undefined){
							record_2 = item_1.wtime;
							record_2.forEach(function(item_2) {
								existingWorkTimeSlots.push({"st" : item_2.st, "et" : item_2.et});
							});
						}

						//taking clinic specific existing time slots.
						if(item_1.sp_clinicSpecificWtimeDetail != undefined){
							record_3 = item_1.sp_clinicSpecificWtimeDetail;
							record_3.forEach(function(item_3) {
								record_4 = item_3.sp_cwtime;
								clinicId = item_3.sp_clinicid;

								for (var i = 0; i < clinic_rec.length; i++){
									if(clinic_rec[i]._id == clinicId){
										if(serviceLocation == "0" || serviceLocation == undefined){
											$scope.clinicNameStr=clinic_rec[i].clinic_name;
										}			
									}
								}
								record_4.forEach(function(item_4) {
									existingWorkTimeSlotsForClinic.push({"st" : item_4.st, "et" : item_4.et, "clinicId":clinicId, "clinicName":$scope.clinicNameStr});
								});

							});
						}

						//taking zone specific existing time slots.
						if(item_1.sp_zoneSpecificWtimeDetail != undefined){
							record_5 = item_1.sp_zoneSpecificWtimeDetail;
							record_5.forEach(function(item_5) {
								record_6 = item_5.sp_zwtime;
								zoneId = item_5.sp_zoneid;
								for(var i = 0 ; i < $scope.arrSpRecords.length ; i++) {
									for(var j = 0 ; j < $scope.arrSpRecords[i].zones.length ; j++) {
										if($scope.arrSpRecords[i].zones[j].id == zoneId){
											if(serviceLocation != "0" && serviceLocation != undefined){
												$scope.zoneName = $scope.arrSpRecords[i].zones[j].name;

												if(!$scope.zoneNameList.includes($scope.zoneName)){
													$scope.zoneNameList.push($scope.zoneName);
												}
												
											}	
										}

									}
								}
								record_6.forEach(function(item_6) {
									existingWorkTimeSlotsForZone.push({"st" : item_6.st, "et" : item_6.et, "zoneId":zoneId});
								});

							});
						}

						
					});

					var flags = [], output = [], l = existingWorkTimeSlots.length, i;
					for( i=0; i<l; i++) {
					    if(flags[existingWorkTimeSlots[i].st, existingWorkTimeSlots[i].et]) continue;
					    flags[existingWorkTimeSlots[i].st, existingWorkTimeSlots[i].et] = true;
					    output.push({"st": existingWorkTimeSlots[i].st,"et": existingWorkTimeSlots[i].et});
					}

					existingWorkTimeSlots = output;

					var flags1 = [], output1 = [], l1 = existingWorkTimeSlotsForClinic.length, i1;
					for( i1=0; i1<l1; i1++) {
					    if(flags1[existingWorkTimeSlotsForClinic[i1].st, existingWorkTimeSlotsForClinic[i1].et]) continue;
					    flags1[existingWorkTimeSlotsForClinic[i1].st, existingWorkTimeSlotsForClinic[i1].et] = true;
					    output1.push({"st": existingWorkTimeSlotsForClinic[i1].st,"et": existingWorkTimeSlotsForClinic[i1].et,"clinicId":existingWorkTimeSlotsForClinic[i1].clinicId,"clinicName":existingWorkTimeSlotsForClinic[i1].clinicName});
					}

					existingWorkTimeSlotsForClinic = output1;


					var flags2 = [], output2 = [], l2 = existingWorkTimeSlotsForZone.length, i2;
					for( i2=0; i2<l2; i2++) {
					    if(flags2[existingWorkTimeSlotsForZone[i2].st, existingWorkTimeSlotsForZone[i2].et]) continue;
					    flags2[existingWorkTimeSlotsForZone[i2].st, existingWorkTimeSlotsForZone[i2].et] = true;
					    output2.push({"st": existingWorkTimeSlotsForZone[i2].st,"et": existingWorkTimeSlotsForZone[i2].et,"zoneId":existingWorkTimeSlotsForZone[i2].zoneId});
					}

					existingWorkTimeSlotsForZone = output2;

					if(serviceLocation != undefined && serviceLocation != 0){
						$scope.wrkHrsAllSlots = [];
						var clinic_time_slot_duration = null;
						var clinic_start_time = null;
						var clinic_end_time = null;
						var slot_start_time = null;
						var slot_start_time_str = null;
						var slot_end_time = null;
						var newWorkTimeSlots = [];
						for (var i = 0; i < clinic_rec.length; i++){
							if(clinic_rec[i]._id == serviceLocation){
								clinic_time_slot_duration = clinic_rec[i].clinic_time_slot_duration;
								clinic_start_time = clinic_rec[i].clinic_start_time;
								clinic_end_time = clinic_rec[i].clinic_end_time;
								slot_start_time = clinic_start_time;
								slot_start_time_str = clinic_start_time;

								var st_arry = clinic_start_time.split(":");
								var st = st_arry[0]+""+st_arry[1];

								var et_arry = clinic_end_time.split(":");
								var et = et_arry[0]+""+et_arry[1];

								while(st < et){
									var slot_end_time = null;
									var newSt = null; var newEt = null;

									var slot_end_time = $scope.claculateEndTimeOfSlot(clinic_time_slot_duration, slot_start_time, clinic_end_time);
									//newSt = slot_start_time_str.split(":").join("");
									newSt = slot_start_time.split(":").join("");
									newEt = slot_end_time.split(":").join("");
									newWorkTimeSlots.push({"st" : newSt, "et" : newEt});
									$scope.wrkHrsAllSlots.push({"selected": false, "label":slot_start_time+" - "+slot_end_time, "selectZoneIds": [], "selectClinicIds": [], "disabled": false});

									//slot_start_time_str = $scope.addMinutes(slot_end_time, 1000);

									slot_start_time = slot_end_time;
									var new_st_arry = null;
									var new_st = null;
									new_st_arry = slot_end_time.split(":");
									new_st = new_st_arry[0]+""+new_st_arry[1];
									st = new_st;
								}
							}
						}

					}else{
						$scope.wrkHrsAllSlots = [
							{
								"selected": false,
								"label": 	"07:30 - 09:00",
								"selectZoneIds": [],
								"selectClinicIds": [],
								"disabled": false,

							},
							{
								"selected": false,
								"label": 	"09:00 - 10:30",
								"selectZoneIds": [],
								"selectClinicIds": [],
								"disabled": false,
							},
							{
								"selected": false,
								"label": 	"10:30 - 12:00",
								"selectZoneIds": [],
								"selectClinicIds": [],
								"disabled": false,
							},
							{
								"selected": false,
								"label": 	"12:00 - 13:30",
								"selectZoneIds": [],
								"selectClinicIds": [],
								"disabled": false,
							},
							{
								"selected": false,
								"label": 	"15:00 - 16:30",
								"selectZoneIds": [],
								"selectClinicIds": [],
								"disabled": false,
							},
							{
								"selected": false,
								"label": 	"16:30 - 18:00",
								"selectZoneIds": [],
								"selectClinicIds": [],
								"disabled": false,
							},
							{
								"selected": false,
								"label": 	"18:00 - 19:30",
								"selectZoneIds": [],
								"selectClinicIds": [],
								"disabled": false,
							},
							{
								"selected": false,
								"label": 	"19:30 - 21:00",
								"selectZoneIds": [],
								"selectClinicIds": [],
								"disabled": false,
							}
						];

						var newWorkTimeSlots = [];
						$scope.wrkHrsAllSlots.forEach(function(item_1) {
							var temp_arr = null;
							var st = null;
							var et = null;
							temp_arr = item_1.label.split(" - ");
							st = temp_arr[0].split(":").join("");
							et = temp_arr[1].split(":").join("");

							newWorkTimeSlots.push({"st" : st, "et" : et});
						});
					}
					
					if(serviceLocation!=undefined && serviceLocation != 0){
						/*console.log($scope.wrkHrsAllSlots);
					    console.log(existingWorkTimeSlots);
					    console.log(newWorkTimeSlots);
					    console.log(existingWorkTimeSlotsForClinic);
					    console.log(existingWorkTimeSlotsForZone);*/
					}

					if(existingWorkTimeSlots.length != 0){
						existingWorkTimeSlots.forEach(function(item_4) {
							newWorkTimeSlots.forEach(function(item_5) {

								if(item_4.st != undefined && item_4.et != undefined){
									if((item_5.st >= item_4.st && item_5.st < item_4.et) || (item_5.et > item_4.st && item_5.et < item_4.et)){
										var first = item_5.st.slice(0,2);
										var middle = item_5.st.slice(2,4);
										var delimeter = ":";
										var result = first+delimeter+middle;
										$scope.wrkHrsAllSlots.forEach(function(item_6) {
											if(item_6.label != ""){
												var label_split = item_6.label.split(" - ");
												if(label_split[0] == result){
													var d = null;
													d = $scope.wrkHrsAllSlots.indexOf(item_6);
													if(d != -1) {
														//$scope.wrkHrsAllSlots.splice(d, 1);
														item_6.selected = true;

														if(serviceLocation == "0" || serviceLocation == undefined){
															if(existingWorkTimeSlotsForClinic.length != 0){
																existingWorkTimeSlotsForClinic.forEach(function(item_7){
																	if((item_5.st >= item_7.st && item_5.st < item_7.et) || (item_5.et > item_7.st && item_5.et < item_7.et)){
																		var first1 = item_5.st.slice(0,2);
																		var middle1 = item_5.st.slice(2,4);
																		var delimeter1 = ":";
																		var result1 = first1+delimeter1+middle1;
																		if(label_split[0] == result1){																		
																		
																			//console.log(result1+':=>'+item_7.clinicName);
																			item_6.selected = true;
																			item_6.disabled = true;

																			var clinicObj1 = {
																				"sp_clinicid": "",
																				"sp_clinicname": "",
																				"sp_cwtime": {
																					"start_time": "",
																					"end_time": ""
																				}
																			};

																			clinicObj1.sp_clinicid = item_7.clinicId;
																			clinicObj1.sp_clinicname = item_7.clinicName;
																			item_6.selectClinicIds.push(clinicObj1);

																		}

																	}
																
																});
															}
														}
														
														if(serviceLocation != "0" && serviceLocation != undefined){
															if(existingWorkTimeSlotsForZone.length != 0){
																existingWorkTimeSlotsForZone.forEach(function(item_8){
																	//console.log(item_5.st+':=>:'+item_5.et+' item_8 '+item_8.st+':=>'+item_8.et);
																	if((item_5.st >= item_8.st && item_5.st < item_8.et) || (item_5.et > item_8.st && item_5.et < item_8.et)){
																		var first2 = item_5.st.slice(0,2);
																		var middle2 = item_5.st.slice(2,4);
																		var delimeter2 = ":";
																		var result2 = first2+delimeter2+middle2;
																		if(label_split[0] == result2){																		
																		
																			//console.log(result2);
																			item_6.selected = true;
																			item_6.disabled = true;
																			
																		}

																	}
																
																});
															 }
														}

													}
												}
											}
										});
									}
								}
							});
						});
					}
					
					//alert(spId+""+$scope.arrSpRecords[i]._id);

					$scope.selectZoneIdsArr = [];
					for(var i = 0 ; i < $scope.arrSpRecords.length ; i++) {
						if ((spId != undefined) && (spId != null) && (spId.length > 0) && (spId == $scope.arrSpRecords[i]._id)) {
							if(serviceLocation == undefined || serviceLocation == 0){
								if (($scope.arrSpRecords[i].zones != undefined) && ($scope.arrSpRecords[i].zones.length > 0)) {
									for(var j = 0 ; j < $scope.arrSpRecords[i].zones.length ; j++) {
										var zoneObj1 = {
											"sp_zoneid": "",
											"sp_zonename": "",
											"sp_zwtime": {
												"start_time": "",
												"end_time": ""
											}
										};

										zoneObj1.sp_zoneid = $scope.arrSpRecords[i].zones[j].id;
										zoneObj1.sp_zonename = $scope.arrSpRecords[i].zones[j].name;
										zoneObj1.sp_zwtime.start_time = "";
										zoneObj1.sp_zwtime.end_time = "";
										$scope.selectZoneIdsArr.push(zoneObj1);

										for (var k = 0 ; k < $scope.wrkHrsAllSlots.length ; k++) {
											var strSlot = $scope.wrkHrsAllSlots[k].label;
											strSlot = strSlot.replace(/:/g, "");
											var arrSlots = strSlot.split("-");

											var start_time = arrSlots[0].trim();
											var end_time = arrSlots[1].trim();
											var intSt = parseInt(start_time);
											var intEt = parseInt(end_time);

											var zoneObj = {
												"sp_zoneid": "",
												"sp_zonename": "",
												"sp_zwtime": {
													"start_time": "",
													"end_time": ""
												}
											};

											zoneObj.sp_zoneid = $scope.arrSpRecords[i].zones[j].id;
											zoneObj.sp_zonename = $scope.arrSpRecords[i].zones[j].name;
											zoneObj.sp_zwtime.start_time = start_time;
											zoneObj.sp_zwtime.end_time = end_time;

											$scope.wrkHrsAllSlots[k].selectZoneIds.push(zoneObj);
										}
									}
								}
							}else{

								for (var k = 0 ; k < $scope.wrkHrsAllSlots.length ; k++) {
									var strSlot = $scope.wrkHrsAllSlots[k].label;
									strSlot = strSlot.replace(/:/g, "");
									var arrSlots = strSlot.split("-");

									var start_time = arrSlots[0].trim();
									var end_time = arrSlots[1].trim();
									var intSt = parseInt(start_time);
									var intEt = parseInt(end_time);
									for (var c = 0; c < clinic_rec.length; c++){
										if(clinic_rec[c]._id == serviceLocation && $scope.wrkHrsAllSlots[k].disabled==false){
											var clinicObj = {
												"sp_clinicid": "",
												"sp_clinicname": "",
												"sp_cwtime": {
													"start_time": "",
													"end_time": ""
												}
											};
											console.log(clinic_rec[c].clinic_name+':~:'+serviceLocation);
											clinicObj.sp_clinicid = serviceLocation;
											clinicObj.sp_clinicname = clinic_rec[c].clinic_name;
											clinicObj.sp_cwtime.start_time = start_time;
											clinicObj.sp_cwtime.end_time = end_time;
											$scope.wrkHrsAllSlots[k].selectClinicIds.push(clinicObj);
										}
									}
									
								}
							}
						}
					}

					$scope.wrkHrErrorSlot = false;
					//$scope.SpWrkHrs = {};
					$scope.addSpWrkHrsForm.adminFormForSp.$setPristine();
					$scope.addSpWrkHrsForm.adminFormForSp.$setUntouched();

					$scope.SpWrkHrs.spNamesId = spId;
					$scope.addSpWrkHrsForm.adminFormForSp.spNamesId.$setDirty();

					if(serviceLocation != undefined && serviceLocation != 0){
						$scope.SpWrkHrs.spServiceLocationId = serviceLocation;
					}else{
						$scope.SpWrkHrs.spServiceLocationId = "0";
					}
					// $scope.SpWrkHrs.spCity = $scope.cityIdValue;
				})
				.error(function(data, status, headers, config) {
					$scope.checkSessionTimeout(data);
					$scope.showWTime = false;
				});
			}, 50);
		}
	}

	$scope.resetAddSpWrkHrsForm = function () {
		$scope.SpWrkHrs = {};
		$scope.addSpWrkHrsForm.adminFormForSp.$setPristine();
		$scope.addSpWrkHrsForm.adminFormForSp.$setUntouched();

		$scope.wrkHrsAllSlots = [
			{
				"selected": false,
				"label": 	"07:30 - 09:00",
				"selectZoneIds": [],
				"selectClinicIds": [],
				"disabled": false,
			},
			{
				"selected": false,
				"label": 	"09:00 - 10:30",
				"selectZoneIds": [],
				"selectClinicIds": [],
				"disabled": false,
			},
			{
				"selected": false,
				"label": 	"10:30 - 12:00",
				"selectZoneIds": [],
				"selectClinicIds": [],
				"disabled": false,
			},
			{
				"selected": false,
				"label": 	"12:00 - 13:30",
				"selectZoneIds": [],
				"selectClinicIds": [],
				"disabled": false,
			},
			{
				"selected": false,
				"label": 	"15:00 - 16:30",
				"selectZoneIds": [],
				"selectClinicIds": [],
				"disabled": false,
			},
			{
				"selected": false,
				"label": 	"16:30 - 18:00",
				"selectZoneIds": [],
				"selectClinicIds": [],
				"disabled": false,
			},
			{
				"selected": false,
				"label": 	"18:00 - 19:30",
				"selectZoneIds": [],
				"selectClinicIds": [],
				"disabled": false,
			},
			{
				"selected": false,
				"label": 	"19:30 - 21:00",
				"selectZoneIds": [],
				"selectClinicIds": [],
				"disabled": false,
			}
		];

		$scope.wrkHrErrorSlot = false;
		$scope.arrWTime = [];
		$scope.dispArrWTime = [];
		$scope.showWTime = false;
		$scope.resetDatePicker9();
	}

	$scope.resetAddSpWrkHrsWebPage = function() {
		$timeout(function() {
			$scope.resetAddSpWrkHrsForm();
			$scope.resetDatePicker9();
			$scope.dateErrorFlag = false;
			$scope.wrkHrErrorSlot = false;
			$scope.SpWrkHrs.spCity = "";
		}, 50);
	}

	$scope.addSpWorkHours = function () {
		$scope.dateErrorFlag = false;
		var wrkDates = [];
		var selectedSlots = [];
		var zoneWorkingTime = [];
		var clinicWorkingTime = [];

		if ($scope.SpWrkHrs.spNamesId != undefined) {
		} else {
			$scope.SpWrkHrs.spNamesId = "";
		}

		if ($('#datePicker9Value').val() != undefined && $('#datePicker9Value').val() != '') {
			var arrWorkingDates = $('#datePicker9Value').val().split(",");
			for(var i = 0 ; i < arrWorkingDates.length ; i++) {
				var wrkDate = {};
				var strDate = arrWorkingDates[i].replace(/-/g, "");
				wrkDate.sp_workDate = strDate.trim();
				wrkDates.push(wrkDate);
			}
		} else if (wrkDates != undefined && wrkDates.length < 1) {
			$scope.dateErrorFlag = true;
		}

		
		console.log($scope.wrkHrsAllSlots);

		if ($scope.wrkHrsAllSlots != undefined && $scope.wrkHrsAllSlots.length > 0) {
			for(var i = 0 ; i < $scope.wrkHrsAllSlots.length ; i++) {
				console.log($scope.wrkHrsAllSlots[i]);
				if($scope.wrkHrsAllSlots[i].selected == true && $scope.wrkHrsAllSlots[i].disabled == false) {
					var strSlot = $scope.wrkHrsAllSlots[i].label;
					strSlot = strSlot.replace(/:/g, "");
					var arrSlots = strSlot.split("-");
					var wrkSlot = {};
					wrkSlot.start_time = arrSlots[0].trim();
					wrkSlot.end_time = arrSlots[1].trim();
					selectedSlots.push(wrkSlot);

					if (($scope.wrkHrsAllSlots[i].selectZoneIds != undefined) && ($scope.wrkHrsAllSlots[i].selectZoneIds.length > 0)) {
						for (var j = 0 ; j < $scope.wrkHrsAllSlots[i].selectZoneIds.length ; j++) {
							zoneWorkingTime.push($scope.wrkHrsAllSlots[i].selectZoneIds[j]);
						}
					}

					if (($scope.wrkHrsAllSlots[i].selectClinicIds != undefined) && ($scope.wrkHrsAllSlots[i].selectClinicIds.length > 0)) {
						for (var j = 0 ; j < $scope.wrkHrsAllSlots[i].selectClinicIds.length ; j++) {
							clinicWorkingTime.push($scope.wrkHrsAllSlots[i].selectClinicIds[j]);
						}
					}
				}

			}
		} else if (selectedSlots != undefined && selectedSlots.length < 1) {
			$scope.wrkHrErrorSlot = true;
		}

		//==================================================================FOR ZONE=================================================================================

		var finalZoneWorkingTime = [];
		for(var index = 0 ; index < zoneWorkingTime.length ; index++) {
			var obj = {
				"sp_zoneid": "",
				"sp_zwtime": [{}]
			};
			obj.sp_zoneid = zoneWorkingTime[index].sp_zoneid;
			obj.sp_zwtime[0] = angular.copy(zoneWorkingTime[index].sp_zwtime);

			if ((finalZoneWorkingTime != undefined) && (finalZoneWorkingTime.length > 0)) {
				var zoneFound = false;
				for(var cnt = 0 ; cnt < finalZoneWorkingTime.length ; cnt++) {
					if (obj.sp_zoneid == finalZoneWorkingTime[cnt].sp_zoneid) {
						zoneFound = true;
						finalZoneWorkingTime[cnt].sp_zwtime.push(obj.sp_zwtime[0]);
					}
				}

				if (!zoneFound) {
					var arrZwtime = [{}];

					arrZwtime = angular.copy(obj.sp_zwtime);

					var finalObj = {};
					finalObj.sp_zoneid = obj.sp_zoneid;
					finalObj.sp_zwtime = angular.copy(arrZwtime);
					finalZoneWorkingTime.push(finalObj);
				}
				
			} else if ((finalZoneWorkingTime != undefined) && (finalZoneWorkingTime.length == 0)){
				var arrZwtime = [{}];

				arrZwtime = angular.copy(obj.sp_zwtime);

				var finalObj = {};
				finalObj.sp_zoneid = obj.sp_zoneid;
				finalObj.sp_zwtime = angular.copy(arrZwtime);
				finalZoneWorkingTime.push(finalObj);
			}
		}

		/*for(var cnt1 = 0 ; cnt1 < finalZoneWorkingTime.length ; cnt1++) {
			var obj1 = null;
			obj1 = $scope.AllData.sp_monthlyWtimeAndOffSlots;
			for(var cnt2 = 0 ; cnt2 < obj1.length; cnt2++) {
				if($scope.AllData.sp_monthlyWtimeAndOffSlots[cnt2].sp_zoneSpecificWtimeDetail != undefined){
					var obj2 = null;
					obj2 = $scope.AllData.sp_monthlyWtimeAndOffSlots[cnt2].sp_zoneSpecificWtimeDetail;
					for(var cnt3 = 0 ; cnt3 < obj2.length; cnt3++) {
						if($scope.AllData.sp_monthlyWtimeAndOffSlots[cnt2].sp_zoneSpecificWtimeDetail[cnt3].sp_zwtime != undefined){
							var db_zone_id = null;
							var db_zone_id = obj2[cnt3].sp_zoneid;
							if (db_zone_id == finalZoneWorkingTime[cnt1].sp_zoneid) {
								var obj3 = null;
								obj3 = $scope.AllData.sp_monthlyWtimeAndOffSlots[cnt2].sp_zoneSpecificWtimeDetail[cnt3].sp_zwtime;
								for(var cnt4 = 0 ; cnt4 < obj3.length; cnt4++) {
									if(obj3[cnt4].st != "0000" && obj3[cnt4].et != "0000"){
										var db_zone_st = null;
										var db_zone_et = null;
										var db_zone_st = obj3[cnt4].st;
										var db_zone_et = obj3[cnt4].et;

										var time_st = db_zone_st;
										var hours_st = Number(time_st.match(/^(\d+)/)[1]);
										var minutes_st = Number(time_st.match(/:(\d+)/)[1]);
										var AMPM_st = time_st.match(/\s(.*)$/)[1];
										if(AMPM_st == "PM" && hours_st<12) hours_st = hours_st+12;
										if(AMPM_st == "AM" && hours_st==12) hours_st = hours_st-12;
										var sHours_st = hours_st.toString();
										var sMinutes_st = minutes_st.toString();
										if(hours_st<10) sHours_st = "0" + sHours_st;
										if(minutes_st<10) sMinutes_st = "0" + sMinutes_st;
										db_zone_st = sHours_st+sMinutes_st;

										var time_et = db_zone_et;
										var hours_et = Number(time_et.match(/^(\d+)/)[1]);
										var minutes_et = Number(time_et.match(/:(\d+)/)[1]);
										var AMPM_et = time_et.match(/\s(.*)$/)[1];
										if(AMPM_et == "PM" && hours_et<12) hours_et = hours_et+12;
										if(AMPM_et == "AM" && hours_et==12) hours_et = hours_et-12;
										var sHours_et = hours_et.toString();
										var sMinutes_et = minutes_et.toString();
										if(hours_et<10) sHours_et = "0" + sHours_et;
										if(minutes_et<10) sMinutes_et = "0" + sMinutes_et;
										db_zone_et = sHours_et+sMinutes_et;

										finalZoneWorkingTime[cnt1].sp_zwtime.push({
											"start_time": db_zone_st,
											"end_time": db_zone_et
										});
									}
								}
							}
						}
					}
				}
			}
		}

		var flags = [], output = [], newoutput = [], l = finalZoneWorkingTime.length, i, j, selectedSlots = [];
		for( i=0; i<l; i++) {
			var l1 = finalZoneWorkingTime[i].sp_zwtime.length;
			for( j=0; j<l1; j++) {
			    if(flags[finalZoneWorkingTime[i].sp_zwtime[j].start_time, finalZoneWorkingTime[i].sp_zwtime[j].end_time]) continue;
			    flags[finalZoneWorkingTime[i].sp_zwtime[j].start_time, finalZoneWorkingTime[i].sp_zwtime[j].end_time] = true;
			    output.push({"start_time": finalZoneWorkingTime[i].sp_zwtime[j].start_time, "end_time": finalZoneWorkingTime[i].sp_zwtime[j].end_time});
			    var dbWrkSlot = {};
				dbWrkSlot.start_time = finalZoneWorkingTime[i].sp_zwtime[j].start_time;
				dbWrkSlot.end_time = finalZoneWorkingTime[i].sp_zwtime[j].end_time;
				selectedSlots.push(dbWrkSlot);
			}
			newoutput.push({"sp_zoneid":finalZoneWorkingTime[i].sp_zoneid, "sp_zwtime":output});
		}

		finalZoneWorkingTime = newoutput;*/

		//==================================================================FOR CLINIC=================================================================================
		
		var finalClinicWorkingTime = [];
		for(var index = 0 ; index < clinicWorkingTime.length ; index++) {
			var obj = {
				"sp_clinicid": "",
				"sp_cwtime": [{}]
			};
			obj.sp_clinicid = clinicWorkingTime[index].sp_clinicid;
			obj.sp_cwtime[0] = angular.copy(clinicWorkingTime[index].sp_cwtime);

			if ((finalClinicWorkingTime != undefined) && (finalClinicWorkingTime.length > 0)) {
				var clinicFound = false;
				for(var cnt = 0 ; cnt < finalClinicWorkingTime.length ; cnt++) {
					if (obj.sp_clinicid == finalClinicWorkingTime[cnt].sp_clinicid) {
						clinicFound = true;
						finalClinicWorkingTime[cnt].sp_cwtime.push(obj.sp_cwtime[0]);
					}
				}

				if (!clinicFound) {
					var arrCwtime = [{}];

					arrCwtime = angular.copy(obj.sp_cwtime);

					var finalObj = {};
					finalObj.sp_clinicid = obj.sp_clinicid;
					finalObj.sp_cwtime = angular.copy(arrCwtime);
					finalClinicWorkingTime.push(finalObj);
				}
			} else if ((finalClinicWorkingTime != undefined) && (finalClinicWorkingTime.length == 0)){
				var arrCwtime = [{}];

				arrCwtime = angular.copy(obj.sp_cwtime);

				var finalObj = {};
				finalObj.sp_clinicid = obj.sp_clinicid;
				finalObj.sp_cwtime = angular.copy(arrCwtime);
				finalClinicWorkingTime.push(finalObj);
			}
		}

		/*for(var cnt1 = 0 ; cnt1 < finalClinicWorkingTime.length ; cnt1++) {
			var obj1 = null;
			obj1 = $scope.AllData.sp_monthlyWtimeAndOffSlots;
			for(var cnt2 = 0 ; cnt2 < obj1.length; cnt2++) {
				if($scope.AllData.sp_monthlyWtimeAndOffSlots[cnt2].sp_clinicSpecificWtimeDetail != undefined){
					var obj2 = null;
					obj2 = $scope.AllData.sp_monthlyWtimeAndOffSlots[cnt2].sp_clinicSpecificWtimeDetail;
					for(var cnt3 = 0 ; cnt3 < obj2.length; cnt3++) {
						if($scope.AllData.sp_monthlyWtimeAndOffSlots[cnt2].sp_clinicSpecificWtimeDetail[cnt3].sp_cwtime != undefined){
							var db_clinic_id = null;
							var db_clinic_id = obj2[cnt3].sp_clinicid;
							if (db_clinic_id == finalClinicWorkingTime[cnt1].sp_clinicid) {
								var obj3 = null;
								obj3 = $scope.AllData.sp_monthlyWtimeAndOffSlots[cnt2].sp_clinicSpecificWtimeDetail[cnt3].sp_cwtime;
								for(var cnt4 = 0 ; cnt4 < obj3.length; cnt4++) {
									if(obj3[cnt4].st != "0000" && obj3[cnt4].et != "0000"){
										var db_clinic_st = null;
										var db_clinic_et = null;
										var db_clinic_st = obj3[cnt4].st;
										var db_clinic_et = obj3[cnt4].et;

										var time_clinic_st = db_clinic_st;
										var hours_clinic_st = Number(time_clinic_st.match(/^(\d+)/)[1]);
										var minutes_clinic_st = Number(time_clinic_st.match(/:(\d+)/)[1]);
										var AMPM_clinic_st = time_clinic_st.match(/\s(.*)$/)[1];
										if(AMPM_clinic_st == "PM" && hours_clinic_st<12) hours_clinic_st = hours_clinic_st+12;
										if(AMPM_clinic_st == "AM" && hours_clinic_st==12) hours_clinic_st = hours_clinic_st-12;
										var sHours_clinic_st = hours_clinic_st.toString();
										var sMinutes_clinic_st = minutes_clinic_st.toString();
										if(hours_clinic_st<10) sHours_clinic_st = "0" + sHours_clinic_st;
										if(minutes_clinic_st<10) sMinutes_clinic_st = "0" + sMinutes_clinic_st;
										db_clinic_st = sHours_clinic_st+sMinutes_clinic_st;

										var time_clinic_et = db_clinic_et;
										var hours_clinic_et = Number(time_clinic_et.match(/^(\d+)/)[1]);
										var minutes_clinic_et = Number(time_clinic_et.match(/:(\d+)/)[1]);
										var AMPM_clinic_et = time_clinic_et.match(/\s(.*)$/)[1];
										if(AMPM_clinic_et == "PM" && hours_clinic_et<12) hours_clinic_et = hours_clinic_et+12;
										if(AMPM_clinic_et == "AM" && hours_clinic_et==12) hours_clinic_et = hours_clinic_et-12;
										var sHours_clinic_et = hours_clinic_et.toString();
										var sMinutes_clinic_et = minutes_clinic_et.toString();
										if(hours_clinic_et<10) sHours_clinic_et = "0" + sHours_clinic_et;
										if(minutes_clinic_et<10) sMinutes_clinic_et = "0" + sMinutes_clinic_et;
										db_clinic_et = sHours_clinic_et+sMinutes_clinic_et;

										finalClinicWorkingTime[cnt1].sp_cwtime.push({
											"start_time": db_clinic_st,
											"end_time": db_clinic_et
										});
									}
								}
							}
						}
					}
				}
			}
		}

		var flags = [], output = [], newoutput = [], l = finalClinicWorkingTime.length, i, j;
		for( i=0; i<l; i++) {
			var l1 = finalClinicWorkingTime[i].sp_cwtime.length;
			for( j=0; j<l1; j++) {
			    if(flags[finalClinicWorkingTime[i].sp_cwtime[j].start_time, finalClinicWorkingTime[i].sp_cwtime[j].end_time]) continue;
			    flags[finalClinicWorkingTime[i].sp_cwtime[j].start_time, finalClinicWorkingTime[i].sp_cwtime[j].end_time] = true;
			    output.push({"start_time": finalClinicWorkingTime[i].sp_cwtime[j].start_time, "end_time": finalClinicWorkingTime[i].sp_cwtime[j].end_time});
			    var dbWrkSlot = {};
				dbWrkSlot.start_time = finalClinicWorkingTime[i].sp_cwtime[j].start_time;
				dbWrkSlot.end_time = finalClinicWorkingTime[i].sp_cwtime[j].end_time;
				selectedSlots.push(dbWrkSlot);
			}
			newoutput.push({"sp_clinicid":finalClinicWorkingTime[i].sp_clinicid, "sp_cwtime":output});
		}

		finalClinicWorkingTime = newoutput;*/

		console.log(selectedSlots);
		console.log(finalZoneWorkingTime);
		console.log(finalClinicWorkingTime);

		//alert($scope.SpWrkHrs.spCity);
		//alert("Hi"+$scope.cityIdValue);

		if (!($scope.dateErrorFlag)) {
			var dataObj = {
				"sp_id": $scope.SpWrkHrs.spNamesId,
				"sp_workingDate": wrkDates,
				"sp_workTime": selectedSlots,
				"spZoneAllocatedWTime": finalZoneWorkingTime,
				"spClinicAllocatedWTime": finalClinicWorkingTime,
				"cityId": $scope.cityIdValue
			};

			adminApi.addSpWrkHrs(dataObj)
			.success(function(data, status, headers, config) {
				alert("Physio's work hours inserted successfully!");
				$scope.showSpManagementWebPage('Set Working Hours');
				$scope.resetAddSpWrkHrsWebPage();
				//$scope.resetAddSpWrkHrsForm();
				//$scope.resetDatePicker9();
				//$scope.dateErrorFlag = false;
				//$scope.wrkHrErrorSlot = false;
			})
			.error(function(data, status, headers, config) {
				$scope.checkSessionTimeout(data);
				if(data && data.error && data.error.message) {
					alert("Error: " + data.error.message);
				} else {
					alert("Some unknown error has occurred.");
				}
			});
		} else if ($scope.dateErrorFlag == true) {
			$scope.scrollDiv('dateErrorFlagId');
		}
	}

	$scope.deSelectAllWrkDates = function () {
		$('#datetimepicker9').val('').multiDatesPicker('removeDates', arrayDates);
		
		for(var j=0; j<arrayDates.length; j++){
			arrayRemoveDates.push(arrayDates[j]);
		}

		var dateVal = $('#datePicker9Value').val();
		if(dateVal != undefined && dateVal != '') {
			var arrDates = $('#datePicker9Value').val().split(",");
			var arrayDt = [];
			for(var i = 0 ; i < arrDates.length ; i++) {
				var strDate = arrDates[i].trim();
				arrayDt.push(strDate);
				arrayRemoveDates.push(strDate);
			}
			$('#datetimepicker9').val('').multiDatesPicker('removeDates', arrayDt);
		}
	}

	$scope.initSpLeavesDatePicker = function () {
		$timeout(function () {
			var d = moment(new Date(new Date().setDate(1))).format('YYYY-MM-DD');
			$('#datetimepicker10').multiDatesPicker({
				dateFormat: "yy-mm-dd",
				altField: '#datePicker10Value',
				onChangeMonthYear: function (year, month, inst) {
					$timeout(function () {
						$scope.populateOffSlotsTable2();
					}, 50);
				}
			});
		}, 100);
	}

	$scope.spChangeMarkLeavesResetValues = function (spId) {
		$timeout(function() {
			$scope.spLeaveAllSlots = [
				{
					"selected": false,
					"label": 	"07:30 - 09:00"
				},
				{
					"selected": false,
					"label": 	"09:00 - 10:30"
				},
				{
					"selected": false,
					"label": 	"10:30 - 12:00"
				},
				{
					"selected": false,
					"label": 	"12:00 - 13:30"
				},
				{
					"selected": false,
					"label": 	"15:00 - 16:30"
				},
				{
					"selected": false,
					"label": 	"16:30 - 18:00"
				},
				{
					"selected": false,
					"label": 	"18:00 - 19:30"
				},
				{
					"selected": false,
					"label": 	"19:30 - 21:00"
				}
			];
			$scope.leaveErrorSlot = false;
			$scope.SpLeaves = {};
			$scope.markSpLeavesForm.adminFormForSp.$setPristine();
			$scope.markSpLeavesForm.adminFormForSp.$setUntouched();

			$scope.SpLeaves.spNamesId = spId;
			$scope.markSpLeavesForm.adminFormForSp.spNamesId.$setDirty();
		}, 50);
	}

	$scope.resetMarkSpLeavesForm = function () {
		$scope.SpLeaves = {};
		$scope.SpWrkHrs.spCity = "";
		$scope.markSpLeavesForm.adminFormForSp.$setPristine();
		$scope.markSpLeavesForm.adminFormForSp.$setUntouched();

		$scope.spLeaveAllSlots = [
			{
				"selected": false,
				"label": 	"07:30 - 09:00"
			},
			{
				"selected": false,
				"label": 	"09:00 - 10:30"
			},
			{
				"selected": false,
				"label": 	"10:30 - 12:00"
			},
			{
				"selected": false,
				"label": 	"12:00 - 13:30"
			},
			{
				"selected": false,
				"label": 	"15:00 - 16:30"
			},
			{
				"selected": false,
				"label": 	"16:30 - 18:00"
			},
			{
				"selected": false,
				"label": 	"18:00 - 19:30"
			},
			{
				"selected": false,
				"label": 	"19:30 - 21:00"
			}
		];

		$scope.leaveErrorSlot = false;

		$scope.showOffTime = false;
		$scope.arrOffTime = [];
		$scope.dispArrOffTime = [];
		$scope.resetDatePicker10();
	}

	$scope.resetDatePicker10 = function () {
		$('#datetimepicker10').multiDatesPicker('destroy');
		$timeout(function() {
			$('#datetimepicker10').val('');
			$scope.initSpLeavesDatePicker();
			$scope.initPopulateOffSlotsTable2();
		}, 100);
	}

	$scope.resetMarkSpLeavesWebPage = function() {
		$timeout(function() {
			$scope.resetMarkSpLeavesForm();
			$scope.resetDatePicker10();
			$scope.leaveDateErrorFlag = false;
			$scope.leaveErrorSlot = false;
			$scope.SpWrkHrs.spCity = "";
		}, 50);
	}

	$scope.selAllLeaveDates = function () {
		var arrDateInst = [];
		arrDateInst.push($(".ui-datepicker-month").text()); // March
		arrDateInst.push($(".ui-datepicker-year").text()); // 2016

		var monthObj = "";
		var dateObject = new Date(); // current date
		var currentDay = null;
		var lastDay = null;

		if(arrDateInst[0] != "") {
			if (arrDateInst[0] == "January") {
				monthObj = "01";
			} else if(arrDateInst[0] == "February") {
				monthObj = "02";
			} else if(arrDateInst[0] == "March") {
				monthObj = "03";
			} else if(arrDateInst[0] == "April") {
				monthObj = "04";
			} else if(arrDateInst[0] == "May") {
				monthObj = "05";
			} else if(arrDateInst[0] == "June") {
				monthObj = "06";
			} else if(arrDateInst[0] == "July") {
				monthObj = "07";
			} else if(arrDateInst[0] == "August") {
				monthObj = "08";
			} else if(arrDateInst[0] == "September") {
				monthObj = "09";
			} else if(arrDateInst[0] == "October") {
				monthObj = "10";
			} else if(arrDateInst[0] == "November") {
				monthObj = "11";
			} else if(arrDateInst[0] == "December") {
				monthObj = "12";
			}

			var intMonth1 = dateObject.getMonth() + 1;
			var strMonth1 = intMonth1 + "";
			var lenStrMonth1 = strMonth1.length;
			if(lenStrMonth1 != 2 && lenStrMonth1 == 1) {
				strMonth1 = "0" + strMonth1;
			}

			var currStrYear1 = dateObject.getFullYear() + "";

			if(currStrYear1 == arrDateInst[1] && strMonth1 == monthObj) {
				currentDay = new Date(dateObject.getFullYear(), dateObject.getMonth(), dateObject.getDate());
				lastDay = new Date(dateObject.getFullYear(), dateObject.getMonth() + 1, 0);
			} else {
				var intYear = parseInt(arrDateInst[1], 10);
				var intMonth = parseInt(monthObj, 10);
				intMonth = intMonth - 1;

				currentDay = new Date(intYear, intMonth, 1);
				lastDay = new Date(intYear, intMonth + 1, 0);
			}
		} else {
			currentDay = new Date(dateObject.getFullYear(), dateObject.getMonth(), dateObject.getDate());
			lastDay = new Date(dateObject.getFullYear(), dateObject.getMonth() + 1, 0);
		}

		arrayLeaveDates = [];
		for(var dateObjIndex = currentDay ; dateObjIndex <= lastDay ; dateObjIndex.setDate(dateObjIndex.getDate() + 1)) {
			if((dateObjIndex.getDay() >= 0 && dateObjIndex.getDay() <= 6)) {
				var year = dateObjIndex.getFullYear();

				var intMonth = dateObjIndex.getMonth() + 1;
				var strMonth = intMonth + "";
				var lenStrMonth = strMonth.length;
				if(lenStrMonth != 2 && lenStrMonth == 1) {
					strMonth = "0" + strMonth;
				}

				var dayObj = dateObjIndex.getDate() + "";
				var lenDay = dayObj.length;
				if(lenDay != 2 && lenDay == 1) {
				  dayObj = "0" + dayObj;
				}

				var dateVal = year + "-" + strMonth + "-" + dayObj;
				arrayLeaveDates.push(dateVal);
			} else {
			}
		}
		$('#datetimepicker10').multiDatesPicker('addDates', arrayLeaveDates);
	}

	$scope.checkSpLeavesButton = function () {
		var isButtonDisabled = true;

		if (!($scope.markSpLeavesForm.adminFormForSp.$pristine) && $scope.markSpLeavesForm.adminFormForSp.$valid ) {
			if ($scope.spLeaveAllSlots != undefined && $scope.spLeaveAllSlots.length > 0) {
				for(var i = 0 ; i < $scope.spLeaveAllSlots.length ; i++) {
					if($scope.spLeaveAllSlots[i].selected == true) {
						isButtonDisabled = false;
						break;
					} else {
						isButtonDisabled = true;
					}
				}
			}
		}

		return isButtonDisabled;
	}

	$scope.markSpLeaves = function () {
		$scope.leaveDateErrorFlag = false;
		var leaveDates = [];
		var selectedLeaveSlots = [];

		if ($scope.SpLeaves.spNamesId != undefined) {
		} else {
			$scope.SpLeaves.spNamesId = "";
		}

		if ($scope.SpLeaves.comment != undefined) {
		} else {
			$scope.SpLeaves.comment = "";
		}

		if ($scope.SpLeaves.isPaidLeave != undefined) {
			if($scope.SpLeaves.isPaidLeave == "yes") {
				$scope.SpLeaves.isPaidLeave = true;
			} else if ($scope.SpLeaves.isPaidLeave == "no") {
				$scope.SpLeaves.isPaidLeave = false;
			}
		} else {
			$scope.SpLeaves.isPaidLeave = true;
		}

		if ($('#datePicker10Value').val() != undefined && $('#datePicker10Value').val() != '') {
			var arrLeaveDate = $('#datePicker10Value').val().split(",");
			for(var i = 0 ; i < arrLeaveDate.length ; i++) {
				var leaveDate = {};
				var strDate = arrLeaveDate[i].replace(/-/g, "");
				leaveDate.sp_leaveDate = strDate.trim();
				leaveDates.push(leaveDate);
			}
		} else if (leaveDates != undefined && leaveDates.length < 1) {
			$scope.leaveDateErrorFlag = true;
		}

		if ($scope.spLeaveAllSlots != undefined && $scope.spLeaveAllSlots.length > 0) {
			for(var i = 0 ; i < $scope.spLeaveAllSlots.length ; i++) {
				if($scope.spLeaveAllSlots[i].selected == true) {
					var strSlot = $scope.spLeaveAllSlots[i].label;
					strSlot = strSlot.replace(/:/g, "");
					var arrSlots = strSlot.split("-");

					var offSlot = {};
					offSlot.start_time = arrSlots[0].trim();
					offSlot.end_time = arrSlots[1].trim();
					selectedLeaveSlots.push(offSlot);
				}
			}
		} else if (selectedLeaveSlots != undefined && selectedLeaveSlots.length < 1) {
			$scope.leaveErrorSlot = true;
		}

		if(!($scope.leaveDateErrorFlag)) {
			var dataObj = {
				"sp_id": $scope.SpLeaves.spNamesId,
				"sp_leaveDates": leaveDates,
				"sp_offSlots": selectedLeaveSlots,
				"sp_ispaid": $scope.SpLeaves.isPaidLeave,
				"sp_comment": $scope.SpLeaves.comment
			};

			adminApi.addSpLeaves(dataObj)
			.success(function(data, status, headers, config) {
				alert("Service provider leave slots inserted successfully!");
				$scope.resetMarkSpLeavesForm();
				$scope.resetDatePicker10();
				$scope.leaveDateErrorFlag = false;
				$scope.leaveErrorSlot = false;
			})
			.error(function(data, status, headers, config) {
				$scope.checkSessionTimeout(data);
				var strResponseDate = data.payload.leave_date;
				var strYear = strResponseDate.substring(0,4);
				var strMonth = strResponseDate.substring(4,6);
				var strDay = strResponseDate.substring(6,8);
				alert("Error: Physio is already having appointment on date: " + strDay + "-" + strMonth + "-" + strYear + ".\nAppointment start time: " + data.payload.busy_startTime + "\nAppointment end time: " + data.payload.busy_endTime + "\nSo either cancel the appointment or set different offtime time.");
				console.log("Error: " + data.error.message);
			});
		} else if ($scope.leaveDateErrorFlag == true) {
			$scope.scrollDiv('leaveDateErrorFlagId');
		}
	};

	$scope.checkSessionTimeout = function(obj) {
		if(obj.error.errorCode == 3238133787 ) {
			var cookies = $cookies.getAll();
			angular.forEach(cookies, function (v, k) {
				$cookies.remove(k);
			});
			$scope.$root.$broadcast('navigatetoHomeAdmin');
		}
	};

	$scope.arrWTime = [];
	$scope.arrWTimeObj = {
		"sp_workDate": "",
		"sp_zoneid": "",
		"sp_zoneName": "",
		"sp_zwtime": [],
		"flag": ""
	};
	$scope.dispArrWTime = [];
	$scope.showWTime = false;
	$scope.table1ItemsPerPage = 5;
	$scope.table2ItemsPerPage = 5;

	$scope.initPopulateBusySlotsTable1 = function () {
		$scope.dateErrorFlag = false;
		$scope.arrWTime = [];
		$scope.dispArrWTime = [];
		$scope.showWTime = false;
		var sp_Id = $scope.SpWrkHrs.spNamesId;
		var service_location_Id = $scope.SpWrkHrs.spServiceLocationId;

		if((sp_Id != null) && (sp_Id != undefined) && (sp_Id.length > 0)) {
			var dateObject = new Date(); // current date
			var currentDay = null;
			var lastDay = null;

			// currentDay = new Date(dateObject.getFullYear(), dateObject.getMonth(), dateObject.getDate());
			currentDay = new Date(dateObject.getFullYear(), dateObject.getMonth(), 1);
			lastDay = new Date(dateObject.getFullYear(), dateObject.getMonth() + 1, 0);

			var arrDates = [];
			for(var dateObjIndex = currentDay ; dateObjIndex <= lastDay ; dateObjIndex.setDate(dateObjIndex.getDate() + 1)) {
				var year = dateObjIndex.getFullYear();

				var intMonth = dateObjIndex.getMonth() + 1;
				var strMonth = intMonth + "";
				var lenStrMonth = strMonth.length;
				if(lenStrMonth != 2 && lenStrMonth == 1) {
					strMonth = "0" + strMonth;
				}

				var dayObj = dateObjIndex.getDate() + "";
				var lenDay = dayObj.length;
				if(lenDay != 2 && lenDay == 1) {
				  dayObj = "0" + dayObj;
				}

				var dateVal = year + strMonth + dayObj;
				arrDates.push(dateVal);
			}

			if(service_location_Id == undefined){
				service_location_Id = "0";
			}

			var dataObj = {
				"sp_id" : sp_Id,
				"service_location" : service_location_Id,
				"sp_workingDate": arrDates
			};

			adminApi.getSpMonthlyWtimeAndOffSlots(dataObj)
			.success(function(data, status, headers, config) {
				$scope.AllData = data.payload;
				$scope.arrWTime = data.payload.sp_monthlyWtimeAndOffSlots;
				$scope.table1ItemsPerPage = 5;
				for(var i = 0 ; i < $scope.arrWTime.length ; i++) {
					var strResponseDate = $scope.arrWTime[i].sp_workDate;
					var strYear = strResponseDate.substring(0,4);
					var strMonth = strResponseDate.substring(4,6);
					var strDay = strResponseDate.substring(6,8);
					$scope.arrWTime[i].sp_workDate = strDay + "-" + strMonth + "-" + strYear;

					if (($scope.arrWTime[i].sp_zoneSpecificWtimeDetail != undefined) && ($scope.arrWTime[i].sp_zoneSpecificWtimeDetail.length > 0)) {

						for (var k = 0 ; k < $scope.arrWTime[i].sp_zoneSpecificWtimeDetail.length ; k++) {
							if (($scope.arrWTime[i].sp_zoneSpecificWtimeDetail[k].sp_zwtime[0].st != 0) && ($scope.arrWTime[i].sp_zoneSpecificWtimeDetail[k].sp_zwtime[0].et != 0)) {
								$scope.showWTime = true;
								$scope.arrWTime[i].flag = true;

								if (($scope.arrWTime[i].sp_zoneSpecificWtimeDetail.length == 2) && ($scope.arrWTime[i].sp_zoneSpecificWtimeDetail[k].sp_zwtime.length == 1)) {
									if ($scope.table1ItemsPerPage > 3) {
										$scope.table1ItemsPerPage = 3;
									}
								} else if ((($scope.arrWTime[i].sp_zoneSpecificWtimeDetail.length >= 2) && ($scope.arrWTime[i].sp_zoneSpecificWtimeDetail.length <= 3)) && (($scope.arrWTime[i].sp_zoneSpecificWtimeDetail[k].sp_zwtime.length >= 1) && (($scope.arrWTime[i].sp_zoneSpecificWtimeDetail[k].sp_zwtime.length <= 2)))) {
									if ($scope.table1ItemsPerPage > 2) {
										$scope.table1ItemsPerPage = 2;
									}
								} else if ((($scope.arrWTime[i].sp_zoneSpecificWtimeDetail.length >= 2) && ($scope.arrWTime[i].sp_zoneSpecificWtimeDetail.length <= 3)) && ($scope.arrWTime[i].sp_zoneSpecificWtimeDetail[k].sp_zwtime.length >= 1)) {
									if ($scope.table1ItemsPerPage > 1) {
										$scope.table1ItemsPerPage = 1;
									}
								} else if ($scope.arrWTime[i].sp_zoneSpecificWtimeDetail.length > 3) {
									if ($scope.table1ItemsPerPage > 1) {
										$scope.table1ItemsPerPage = 1;
									}
								}

								var sp_zoneName = $scope.zoneIdToNameMap[$scope.arrWTime[i].sp_zoneSpecificWtimeDetail[k].sp_zoneid];
								console.log(cache.zoneIdToNameMap);	
								console.log($scope.arrWTime[i].sp_zoneSpecificWtimeDetail[k].sp_zoneid);

								$scope.arrWTime[i].sp_zoneSpecificWtimeDetail[k].sp_zoneName = sp_zoneName;

								for(var j = 0 ; j < $scope.arrWTime[i].sp_zoneSpecificWtimeDetail[k].sp_zwtime.length ; j++) {
									// start time
									var strTime1 = $scope.arrWTime[i].sp_zoneSpecificWtimeDetail[k].sp_zwtime[j].st;
									strTime1 = $scope.getTimeInAmPmFormat(strTime1);
									$scope.arrWTime[i].sp_zoneSpecificWtimeDetail[k].sp_zwtime[j].st = strTime1;

									// end time
									var strTime2 = $scope.arrWTime[i].sp_zoneSpecificWtimeDetail[k].sp_zwtime[j].et;
									strTime2 = $scope.getTimeInAmPmFormat(strTime2);
									$scope.arrWTime[i].sp_zoneSpecificWtimeDetail[k].sp_zwtime[j].et = strTime2;
								}
							}
						}
					}

					if (($scope.arrWTime[i].sp_clinicSpecificWtimeDetail != undefined) && ($scope.arrWTime[i].sp_clinicSpecificWtimeDetail.length > 0)) {
						for (var k = 0 ; k < $scope.arrWTime[i].sp_clinicSpecificWtimeDetail.length ; k++) {
							if (($scope.arrWTime[i].sp_clinicSpecificWtimeDetail[k].sp_cwtime[0].st != 0) && ($scope.arrWTime[i].sp_clinicSpecificWtimeDetail[k].sp_cwtime[0].et != 0)) {
								$scope.showWTime = true;
								$scope.arrWTime[i].flag = true;

								if (($scope.arrWTime[i].sp_clinicSpecificWtimeDetail.length == 2) && ($scope.arrWTime[i].sp_clinicSpecificWtimeDetail[k].sp_cwtime.length == 1)) {
									if ($scope.table1ItemsPerPage > 3) {
										$scope.table1ItemsPerPage = 3;
									}
								} else if ((($scope.arrWTime[i].sp_clinicSpecificWtimeDetail.length >= 2) && ($scope.arrWTime[i].sp_clinicSpecificWtimeDetail.length <= 3)) && (($scope.arrWTime[i].sp_clinicSpecificWtimeDetail[k].sp_cwtime.length >= 1) && (($scope.arrWTime[i].sp_clinicSpecificWtimeDetail[k].sp_cwtime.length <= 2)))) {
									if ($scope.table1ItemsPerPage > 2) {
										$scope.table1ItemsPerPage = 2;
									}
								} else if ((($scope.arrWTime[i].sp_clinicSpecificWtimeDetail.length >= 2) && ($scope.arrWTime[i].sp_clinicSpecificWtimeDetail.length <= 3)) && ($scope.arrWTime[i].sp_clinicSpecificWtimeDetail[k].sp_cwtime.length >= 1)) {
									if ($scope.table1ItemsPerPage > 1) {
										$scope.table1ItemsPerPage = 1;
									}
								} else if ($scope.arrWTime[i].sp_clinicSpecificWtimeDetail.length > 3) {
									if ($scope.table1ItemsPerPage > 1) {
										$scope.table1ItemsPerPage = 1;
									}
								}

								var sp_clinicName = cache.clinicIdToNameMap[$scope.arrWTime[i].sp_clinicSpecificWtimeDetail[k].sp_clinicid];
								$scope.arrWTime[i].sp_clinicSpecificWtimeDetail[k].sp_clinicName = sp_clinicName;

								for(var j = 0 ; j < $scope.arrWTime[i].sp_clinicSpecificWtimeDetail[k].sp_cwtime.length ; j++) {
									var strTime1 = $scope.arrWTime[i].sp_clinicSpecificWtimeDetail[k].sp_cwtime[j].st;
									strTime1 = $scope.getTimeInAmPmFormat(strTime1);
									$scope.arrWTime[i].sp_clinicSpecificWtimeDetail[k].sp_cwtime[j].st = strTime1;

									var strTime2 = $scope.arrWTime[i].sp_clinicSpecificWtimeDetail[k].sp_cwtime[j].et;
									strTime2 = $scope.getTimeInAmPmFormat(strTime2);
									$scope.arrWTime[i].sp_clinicSpecificWtimeDetail[k].sp_cwtime[j].et = strTime2;
								}
							}
						}
					}

					if ((($scope.arrWTime[i].sp_zoneSpecificWtimeDetail == undefined) || ($scope.arrWTime[i].sp_zoneSpecificWtimeDetail.length <= 0)) && (($scope.arrWTime[i].sp_clinicSpecificWtimeDetail == undefined) || ($scope.arrWTime[i].sp_clinicSpecificWtimeDetail.length <= 0))) {
						$scope.arrWTime[i].flag = false;
					}
				}

				for(var k = 0 ; k < $scope.arrWTime.length ; k++) {
					if ($scope.arrWTime[k].flag == true) {
						$scope.dispArrWTime.push($scope.arrWTime[k]);
					}
				}
				$scope.sort3("sp_workDate", false);
				console.log('dispArrWTime');
				console.log($scope.dispArrWTime);
			})
			.error(function(data, status, headers, config) {
				$scope.checkSessionTimeout(data);
				$scope.showWTime = false;
			});
		}
	}

	$scope.populateBusySlotsTable1 = function () {
		$scope.arrWTime = [];
		$scope.dispArrWTime = [];
		$scope.showWTime = false;

		var sp_Id = $scope.SpWrkHrs.spNamesId;
		var service_location_Id = $scope.SpWrkHrs.spServiceLocationId;
		if((sp_Id != null) && (sp_Id != undefined) && (sp_Id.length > 0)) {
			var arrDateInst = [];
			arrDateInst.push($(".ui-datepicker-month").text()); // March
			arrDateInst.push($(".ui-datepicker-year").text()); // 2016

			var monthObj = "";
			var dateObject = new Date(); // current date
			var currentDay = null;
			var lastDay = null;

			if(arrDateInst[0] != "") {
				if (arrDateInst[0] == "January") {
					monthObj = "01";
				} else if(arrDateInst[0] == "February") {
					monthObj = "02";
				} else if(arrDateInst[0] == "March") {
					monthObj = "03";
				} else if(arrDateInst[0] == "April") {
					monthObj = "04";
				} else if(arrDateInst[0] == "May") {
					monthObj = "05";
				} else if(arrDateInst[0] == "June") {
					monthObj = "06";
				} else if(arrDateInst[0] == "July") {
					monthObj = "07";
				} else if(arrDateInst[0] == "August") {
					monthObj = "08";
				} else if(arrDateInst[0] == "September") {
					monthObj = "09";
				} else if(arrDateInst[0] == "October") {
					monthObj = "10";
				} else if(arrDateInst[0] == "November") {
					monthObj = "11";
				} else if(arrDateInst[0] == "December") {
					monthObj = "12";
				}

				var intMonth1 = dateObject.getMonth() + 1;
				var strMonth1 = intMonth1 + "";
				var lenStrMonth1 = strMonth1.length;
				if(lenStrMonth1 != 2 && lenStrMonth1 == 1) {
					strMonth1 = "0" + strMonth1;
				}

				var currStrYear1 = dateObject.getFullYear() + "";
				if(currStrYear1 == arrDateInst[1] && strMonth1 == monthObj) {
					// currentDay = new Date(dateObject.getFullYear(), dateObject.getMonth(), dateObject.getDate());
					currentDay = new Date(dateObject.getFullYear(), dateObject.getMonth(), 1);
					lastDay = new Date(dateObject.getFullYear(), dateObject.getMonth() + 1, 0);
				} else {
					var intYear = parseInt(arrDateInst[1], 10);
					var intMonth = parseInt(monthObj, 10);
					intMonth = intMonth - 1;

					currentDay = new Date(intYear, intMonth, 1);
					lastDay = new Date(intYear, intMonth + 1, 0);
				}
			} else {
				currentDay = new Date(dateObject.getFullYear(), dateObject.getMonth(), 1);
				lastDay = new Date(dateObject.getFullYear(), dateObject.getMonth() + 1, 0);
			}

			arrDates = [];
			for(var dateObjIndex = currentDay ; dateObjIndex <= lastDay ; dateObjIndex.setDate(dateObjIndex.getDate() + 1)) {
				var year = dateObjIndex.getFullYear();

				var intMonth = dateObjIndex.getMonth() + 1;
				var strMonth = intMonth + "";
				var lenStrMonth = strMonth.length;
				if(lenStrMonth != 2 && lenStrMonth == 1) {
					strMonth = "0" + strMonth;
				}

				var dayObj = dateObjIndex.getDate() + "";
				var lenDay = dayObj.length;
				if(lenDay != 2 && lenDay == 1) {
				  dayObj = "0" + dayObj;
				}

				var dateVal = year + strMonth + dayObj;
				arrDates.push(dateVal);
			}

			for(var j=0; j<arrayRemoveDates.length; j++){
				var sDate = null;
				if(arrayRemoveDates[j] != undefined){
					sDate = arrayRemoveDates[j].split("-");
					var d = arrDates.indexOf(sDate[0] + sDate[1] + sDate[2]);
					if(d != -1) {
						arrDates.splice(d, 1);
					}
				}
			}

			if(service_location_Id == undefined){
				service_location_Id = "0";
			}

			var dataObj = {
				"sp_id" : sp_Id,
				"service_location" : service_location_Id,
				"sp_workingDate": arrDates
			};

			adminApi.getSpMonthlyWtimeAndOffSlots(dataObj)
			.success(function(data, status, headers, config) {
				$scope.AllData = data.payload;
				$scope.arrWTime = data.payload.sp_monthlyWtimeAndOffSlots;

				$scope.table1ItemsPerPage = 5;
				for(var i = 0 ; i < $scope.arrWTime.length ; i++) {
					var strResponseDate = $scope.arrWTime[i].sp_workDate;
					var strYear = strResponseDate.substring(0,4);
					var strMonth = strResponseDate.substring(4,6);
					var strDay = strResponseDate.substring(6,8);
					$scope.arrWTime[i].sp_workDate = strDay + "-" + strMonth + "-" + strYear;

					if (($scope.arrWTime[i].sp_zoneSpecificWtimeDetail != undefined) && ($scope.arrWTime[i].sp_zoneSpecificWtimeDetail.length > 0)) {
						for (var k = 0 ; k < $scope.arrWTime[i].sp_zoneSpecificWtimeDetail.length ; k++) {
							if (($scope.arrWTime[i].sp_zoneSpecificWtimeDetail[k].sp_zwtime[0].st != 0) && ($scope.arrWTime[i].sp_zoneSpecificWtimeDetail[k].sp_zwtime[0].et != 0)) {
								$scope.showWTime = true;
								$scope.arrWTime[i].flag = true;

								if (($scope.arrWTime[i].sp_zoneSpecificWtimeDetail.length == 2) && ($scope.arrWTime[i].sp_zoneSpecificWtimeDetail[k].sp_zwtime.length == 1)) {
									if ($scope.table1ItemsPerPage > 3) {
										$scope.table1ItemsPerPage = 3;
									}
								} else if ((($scope.arrWTime[i].sp_zoneSpecificWtimeDetail.length >= 2) && ($scope.arrWTime[i].sp_zoneSpecificWtimeDetail.length <= 3)) && (($scope.arrWTime[i].sp_zoneSpecificWtimeDetail[k].sp_zwtime.length >= 1) && (($scope.arrWTime[i].sp_zoneSpecificWtimeDetail[k].sp_zwtime.length <= 2)))) {
									if ($scope.table1ItemsPerPage > 2) {
										$scope.table1ItemsPerPage = 2;
									}
								} else if ((($scope.arrWTime[i].sp_zoneSpecificWtimeDetail.length >= 2) && ($scope.arrWTime[i].sp_zoneSpecificWtimeDetail.length <= 3)) && ($scope.arrWTime[i].sp_zoneSpecificWtimeDetail[k].sp_zwtime.length >= 1)) {
									if ($scope.table1ItemsPerPage > 1) {
										$scope.table1ItemsPerPage = 1;
									}
								} else if ($scope.arrWTime[i].sp_zoneSpecificWtimeDetail.length > 3) {
									if ($scope.table1ItemsPerPage > 1) {
										$scope.table1ItemsPerPage = 1;
									}
								}

								var sp_zoneName = cache.zoneIdToNameMap[$scope.arrWTime[i].sp_zoneSpecificWtimeDetail[k].sp_zoneid];
								$scope.arrWTime[i].sp_zoneSpecificWtimeDetail[k].sp_zoneName = sp_zoneName;

								for(var j = 0 ; j < $scope.arrWTime[i].sp_zoneSpecificWtimeDetail[k].sp_zwtime.length ; j++) {
									var strTime1 = $scope.arrWTime[i].sp_zoneSpecificWtimeDetail[k].sp_zwtime[j].st;
									strTime1 = $scope.getTimeInAmPmFormat(strTime1);
									$scope.arrWTime[i].sp_zoneSpecificWtimeDetail[k].sp_zwtime[j].st = strTime1;

									var strTime2 = $scope.arrWTime[i].sp_zoneSpecificWtimeDetail[k].sp_zwtime[j].et;
									strTime2 = $scope.getTimeInAmPmFormat(strTime2);
									$scope.arrWTime[i].sp_zoneSpecificWtimeDetail[k].sp_zwtime[j].et = strTime2;
								}
							}
						}
					}

					if (($scope.arrWTime[i].sp_clinicSpecificWtimeDetail != undefined) && ($scope.arrWTime[i].sp_clinicSpecificWtimeDetail.length > 0)) {
						for (var k = 0 ; k < $scope.arrWTime[i].sp_clinicSpecificWtimeDetail.length ; k++) {
							if (($scope.arrWTime[i].sp_clinicSpecificWtimeDetail[k].sp_cwtime[0].st != 0) && ($scope.arrWTime[i].sp_clinicSpecificWtimeDetail[k].sp_cwtime[0].et != 0)) {
								$scope.showWTime = true;
								$scope.arrWTime[i].flag = true;

								if (($scope.arrWTime[i].sp_clinicSpecificWtimeDetail.length == 2) && ($scope.arrWTime[i].sp_clinicSpecificWtimeDetail[k].sp_cwtime.length == 1)) {
									if ($scope.table1ItemsPerPage > 3) {
										$scope.table1ItemsPerPage = 3;
									}
								} else if ((($scope.arrWTime[i].sp_clinicSpecificWtimeDetail.length >= 2) && ($scope.arrWTime[i].sp_clinicSpecificWtimeDetail.length <= 3)) && (($scope.arrWTime[i].sp_clinicSpecificWtimeDetail[k].sp_cwtime.length >= 1) && (($scope.arrWTime[i].sp_clinicSpecificWtimeDetail[k].sp_cwtime.length <= 2)))) {
									if ($scope.table1ItemsPerPage > 2) {
										$scope.table1ItemsPerPage = 2;
									}
								} else if ((($scope.arrWTime[i].sp_clinicSpecificWtimeDetail.length >= 2) && ($scope.arrWTime[i].sp_clinicSpecificWtimeDetail.length <= 3)) && ($scope.arrWTime[i].sp_clinicSpecificWtimeDetail[k].sp_cwtime.length >= 1)) {
									if ($scope.table1ItemsPerPage > 1) {
										$scope.table1ItemsPerPage = 1;
									}
								} else if ($scope.arrWTime[i].sp_clinicSpecificWtimeDetail.length > 3) {
									if ($scope.table1ItemsPerPage > 1) {
										$scope.table1ItemsPerPage = 1;
									}
								}

								var sp_clinicName = cache.clinicIdToNameMap[$scope.arrWTime[i].sp_clinicSpecificWtimeDetail[k].sp_clinicid];
								$scope.arrWTime[i].sp_clinicSpecificWtimeDetail[k].sp_clinicName = sp_clinicName;

								for(var j = 0 ; j < $scope.arrWTime[i].sp_clinicSpecificWtimeDetail[k].sp_cwtime.length ; j++) {
									var strTime1 = $scope.arrWTime[i].sp_clinicSpecificWtimeDetail[k].sp_cwtime[j].st;
									strTime1 = $scope.getTimeInAmPmFormat(strTime1);
									$scope.arrWTime[i].sp_clinicSpecificWtimeDetail[k].sp_cwtime[j].st = strTime1;

									var strTime2 = $scope.arrWTime[i].sp_clinicSpecificWtimeDetail[k].sp_cwtime[j].et;
									strTime2 = $scope.getTimeInAmPmFormat(strTime2);
									$scope.arrWTime[i].sp_clinicSpecificWtimeDetail[k].sp_cwtime[j].et = strTime2;
								}
							}
						}
					}

					if ((($scope.arrWTime[i].sp_zoneSpecificWtimeDetail == undefined) || ($scope.arrWTime[i].sp_zoneSpecificWtimeDetail.length <= 0)) && (($scope.arrWTime[i].sp_clinicSpecificWtimeDetail == undefined) || ($scope.arrWTime[i].sp_clinicSpecificWtimeDetail.length <= 0))) {
						$scope.arrWTime[i].flag = false;
					}
				}

				for(var k = 0 ; k < $scope.arrWTime.length ; k++) {
					if ($scope.arrWTime[k].flag == true) {
						$scope.dispArrWTime.push($scope.arrWTime[k]);
					}
				}
				$scope.sort3("sp_workDate", false);
			})
			.error(function(data, status, headers, config) {
				$scope.checkSessionTimeout(data);
				$scope.showWTime = false;
			});
		}
	}

	$scope.sort3 = function(keyname, boolVal) {
		$scope.sortingKey = keyname;
		if (boolVal == true || boolVal == false) {
			$scope.sortingReverse = boolVal;
		} else if ((boolVal == undefined) || (boolVal == null) || (boolVal.length == 0) || (boolVal == "")) {
			$scope.sortingReverse = !$scope.sortingReverse;
		}
	}

	$scope.showOffTime = false;
	$scope.arrOffTime = [];
	$scope.dispArrOffTime = [];

	$scope.sort4 = function(keyname, boolVal) {
		$scope.sortingKey2 = keyname;

		if (boolVal == true || boolVal == false) {
			$scope.sortingReverse2 = boolVal;
		} else if((boolVal == undefined) || (boolVal == null) || (boolVal.length == 0) || (boolVal == "")) {
			$scope.sortingReverse2 = !$scope.sortingReverse2;
		}
	}

	$scope.initPopulateOffSlotsTable2 = function () {
		$scope.leaveDateErrorFlag = false;
		$scope.arrOffTime = [];
		$scope.dispArrOffTime = [];
		$scope.showOffTime = false;
		var sp_Id = $scope.SpLeaves.spNamesId;

		if((sp_Id != null) && (sp_Id != undefined) && (sp_Id.length > 0)) {
			var dateObject = new Date(); // current date
			var currentDay = null;
			var lastDay = null;

			// currentDay = new Date(dateObject.getFullYear(), dateObject.getMonth(), dateObject.getDate());
			currentDay = new Date(dateObject.getFullYear(), dateObject.getMonth(), 1);
			lastDay = new Date(dateObject.getFullYear(), dateObject.getMonth() + 1, 0);

			var arrDates = [];
			for(var dateObjIndex = currentDay ; dateObjIndex <= lastDay ; dateObjIndex.setDate(dateObjIndex.getDate() + 1)) {
				var year = dateObjIndex.getFullYear();

				var intMonth = dateObjIndex.getMonth() + 1;
				var strMonth = intMonth + "";
				var lenStrMonth = strMonth.length;
				if(lenStrMonth != 2 && lenStrMonth == 1) {
					strMonth = "0" + strMonth;
				}

				var dayObj = dateObjIndex.getDate() + "";
				var lenDay = dayObj.length;
				if(lenDay != 2 && lenDay == 1) {
				  dayObj = "0" + dayObj;
				}

				var dateVal = year + strMonth + dayObj;
				arrDates.push(dateVal);
			}

			var dataObj = {
				"sp_id" : sp_Id,
				"sp_workingDate": arrDates
			};

			adminApi.getSpMonthlyWtimeAndOffSlots(dataObj)
			.success(function(data, status, headers, config) {
				$scope.arrOffTime = data.payload.sp_monthlyWtimeAndOffSlots;
				for(var i = 0 ; i < $scope.arrOffTime.length ; i++) {
					var strResponseDate = $scope.arrOffTime[i].sp_workDate;
					var strYear = strResponseDate.substring(0,4);
					var strMonth = strResponseDate.substring(4,6);
					var strDay = strResponseDate.substring(6,8);
					$scope.arrOffTime[i].sp_workDate = strDay + "-" + strMonth + "-" + strYear;

					if(($scope.arrOffTime[i].offtime != undefined) && ($scope.arrOffTime[i].offtime.hasOwnProperty("offslots")) && ($scope.arrOffTime[i].offtime.offslots.length > 0) && (($scope.arrOffTime[i].offtime.offslots[0].st != 0) && ($scope.arrOffTime[i].offtime.offslots[0].et != 0))) {
						$scope.showOffTime = true;
						$scope.arrOffTime[i].flag = true;
						$scope.table2ItemsPerPage = 5;
						if ($scope.arrOffTime[i].offtime.offslots.length == 2) {
							$scope.table2ItemsPerPage = 3
						}

						for(var j = 0 ; j < $scope.arrOffTime[i].offtime.offslots.length ; j++) {
							var strTime1 = $scope.arrOffTime[i].offtime.offslots[j].st;
							strTime1 = $scope.getTimeInAmPmFormat(strTime1);
							$scope.arrOffTime[i].offtime.offslots[j].st = strTime1;
							var strTime2 = $scope.arrOffTime[i].offtime.offslots[j].et;
							strTime2 = $scope.getTimeInAmPmFormat(strTime2);
							$scope.arrOffTime[i].offtime.offslots[j].et = strTime2;
						}
					} else {
						$scope.arrOffTime[i].flag = false;
					}
				}

				for(var k = 0 ; k < $scope.arrOffTime.length ; k++) {
					if ($scope.arrOffTime[k].flag == true) {
						$scope.dispArrOffTime.push($scope.arrOffTime[k]);
					}
				}
				$scope.sort4("sp_workDate", false);
			})
			.error(function(data, status, headers, config) {
				$scope.checkSessionTimeout(data);
				$scope.showOffTime = false;
			});
		}
	}

	$scope.populateOffSlotsTable2 = function () {
		$scope.arrOffTime = [];
		$scope.dispArrOffTime = [];
		$scope.showOffTime = false;

		var sp_Id = $scope.SpLeaves.spNamesId;
		if((sp_Id != null) && (sp_Id != undefined) && (sp_Id.length > 0)) {
			var arrDateInst = [];
			arrDateInst.push($(".ui-datepicker-month").text()); // March
			arrDateInst.push($(".ui-datepicker-year").text()); // 2016

			var monthObj = "";
			var dateObject = new Date(); // current date
			var currentDay = null;
			var lastDay = null;

			if(arrDateInst[0] != "") {
				if (arrDateInst[0] == "January") {
					monthObj = "01";
				} else if(arrDateInst[0] == "February") {
					monthObj = "02";
				} else if(arrDateInst[0] == "March") {
					monthObj = "03";
				} else if(arrDateInst[0] == "April") {
					monthObj = "04";
				} else if(arrDateInst[0] == "May") {
					monthObj = "05";
				} else if(arrDateInst[0] == "June") {
					monthObj = "06";
				} else if(arrDateInst[0] == "July") {
					monthObj = "07";
				} else if(arrDateInst[0] == "August") {
					monthObj = "08";
				} else if(arrDateInst[0] == "September") {
					monthObj = "09";
				} else if(arrDateInst[0] == "October") {
					monthObj = "10";
				} else if(arrDateInst[0] == "November") {
					monthObj = "11";
				} else if(arrDateInst[0] == "December") {
					monthObj = "12";
				}

				var intMonth1 = dateObject.getMonth() + 1;
				var strMonth1 = intMonth1 + "";
				var lenStrMonth1 = strMonth1.length;
				if(lenStrMonth1 != 2 && lenStrMonth1 == 1) {
					strMonth1 = "0" + strMonth1;
				}

				var currStrYear1 = dateObject.getFullYear() + "";
				if(currStrYear1 == arrDateInst[1] && strMonth1 == monthObj) {
					// currentDay = new Date(dateObject.getFullYear(), dateObject.getMonth(), dateObject.getDate());
					currentDay = new Date(dateObject.getFullYear(), dateObject.getMonth(), 1);
					lastDay = new Date(dateObject.getFullYear(), dateObject.getMonth() + 1, 0);
				} else {
					var intYear = parseInt(arrDateInst[1], 10);
					var intMonth = parseInt(monthObj, 10);
					intMonth = intMonth - 1;

					currentDay = new Date(intYear, intMonth, 1);
					lastDay = new Date(intYear, intMonth + 1, 0);
				}
			} else {
				// currentDay = new Date(dateObject.getFullYear(), dateObject.getMonth(), dateObject.getDate());
				currentDay = new Date(dateObject.getFullYear(), dateObject.getMonth(), 1);
				lastDay = new Date(dateObject.getFullYear(), dateObject.getMonth() + 1, 0);
			}

			arrDates = [];
			for(var dateObjIndex = currentDay ; dateObjIndex <= lastDay ; dateObjIndex.setDate(dateObjIndex.getDate() + 1)) {
				var year = dateObjIndex.getFullYear();

				var intMonth = dateObjIndex.getMonth() + 1;
				var strMonth = intMonth + "";
				var lenStrMonth = strMonth.length;
				if(lenStrMonth != 2 && lenStrMonth == 1) {
					strMonth = "0" + strMonth;
				}

				var dayObj = dateObjIndex.getDate() + "";
				var lenDay = dayObj.length;
				if(lenDay != 2 && lenDay == 1) {
				  dayObj = "0" + dayObj;
				}

				var dateVal = year + strMonth + dayObj;
				arrDates.push(dateVal);
			}

			var dataObj = {
				"sp_id" : sp_Id,
				"sp_workingDate": arrDates
			};

			adminApi.getSpMonthlyWtimeAndOffSlots(dataObj)
			.success(function(data, status, headers, config) {
				$scope.arrOffTime = data.payload.sp_monthlyWtimeAndOffSlots;

				for(var i = 0 ; i < $scope.arrOffTime.length ; i++) {
					var strResponseDate = $scope.arrOffTime[i].sp_workDate;
					var strYear = strResponseDate.substring(0,4);
					var strMonth = strResponseDate.substring(4,6);
					var strDay = strResponseDate.substring(6,8);
					$scope.arrOffTime[i].sp_workDate = strDay + "-" + strMonth + "-" + strYear;

					if(($scope.arrOffTime[i].offtime != undefined) && ($scope.arrOffTime[i].offtime.hasOwnProperty("offslots")) && ($scope.arrOffTime[i].offtime.offslots.length > 0) && (($scope.arrOffTime[i].offtime.offslots[0].st != 0) && ($scope.arrOffTime[i].offtime.offslots[0].et != 0))) {
						$scope.showOffTime = true;
						$scope.arrOffTime[i].flag = true;
						$scope.table2ItemsPerPage = 5;
						if ($scope.arrOffTime[i].offtime.offslots.length == 2) {
							$scope.table2ItemsPerPage = 3
						}

						for(var j = 0 ; j < $scope.arrOffTime[i].offtime.offslots.length ; j++) {
							var strTime1 = $scope.arrOffTime[i].offtime.offslots[j].st;
							strTime1 = $scope.getTimeInAmPmFormat(strTime1);
							$scope.arrOffTime[i].offtime.offslots[j].st = strTime1;

							var strTime2 = $scope.arrOffTime[i].offtime.offslots[j].et;
							strTime2 = $scope.getTimeInAmPmFormat(strTime2);
							$scope.arrOffTime[i].offtime.offslots[j].et = strTime2;
						}
					} else {
						$scope.arrOffTime[i].flag = false;
					}
				}

				for(var k = 0 ; k < $scope.arrOffTime.length ; k++) {
					if ($scope.arrOffTime[k].flag == true) {
						$scope.dispArrOffTime.push($scope.arrOffTime[k]);
					}
				}
				$scope.sort4("sp_workDate", false);
			})
			.error(function(data, status, headers, config) {
				$scope.checkSessionTimeout(data);
				$scope.showOffTime = false;
			});
		}
	}

	$scope.getTimeInAmPmFormat = function (strHrsMins) {
		var strFormattedTime = "";

		strHrsMins = strHrsMins.trim();

		var strHrs = strHrsMins.substring(0,2);
		var strMins = strHrsMins.substring(2,4);

		var intHrs = parseInt(strHrs);
		var hours = intHrs > 12 ? (intHrs - 12) : intHrs;
		var strHours = hours + "";
		if((strHours.length != 2) && (strHours.length == 1)) {
			strHours = "0"+strHours;
		}

		var am_pm = intHrs >= 12 ? "PM" : "AM";

		strFormattedTime = strHours + ":" + strMins + " " + am_pm;

		return strFormattedTime;
	}

	$scope.clearSpWorkHours = function () {
		$scope.dateErrorFlag = false;
		var wrkDates = [];
		var selectedSlots = [];
		var zoneWorkingTime = [];
		var clinicWorkingTime = [];

		if ($scope.SpWrkHrs.spNamesId != undefined) {
		} else {
			$scope.SpWrkHrs.spNamesId = "";
		}

		if ($('#datePicker9Value').val() != undefined && $('#datePicker9Value').val() != '') {
			var arrWorkingDates = $('#datePicker9Value').val().split(",");

			for(var i = 0 ; i < arrWorkingDates.length ; i++) {
				var wrkDate = {};
				var strDate = arrWorkingDates[i].replace(/-/g, "");
				wrkDate.sp_workDate = strDate.trim();
				wrkDates.push(wrkDate);
			}
		} else if (wrkDates != undefined && wrkDates.length < 1) {
			$scope.dateErrorFlag = true;
		}

		for(var i = 0 ; i < $scope.wrkHrsAllSlots.length ; i++) {
			if (($scope.wrkHrsAllSlots[i].selectZoneIds != undefined) && ($scope.wrkHrsAllSlots[i].selectZoneIds.length > 0)) {
				for (var j = 0 ; j < $scope.wrkHrsAllSlots[i].selectZoneIds.length ; j++) {
					zoneWorkingTime.push($scope.wrkHrsAllSlots[i].selectZoneIds[j]);
				}
			}
			if (($scope.wrkHrsAllSlots[i].selectClinicIds != undefined) && ($scope.wrkHrsAllSlots[i].selectClinicIds.length > 0)) {
				for (var j = 0 ; j < $scope.wrkHrsAllSlots[i].selectClinicIds.length ; j++) {
					clinicWorkingTime.push($scope.wrkHrsAllSlots[i].selectClinicIds[j]);
				}
			}
		}
		//console.log($scope.wrkHrsAllSlots);
		
		// removing duplicate zone ids
		var finalZoneWorkingTime = [];
		for(var index = 0 ; index < zoneWorkingTime.length ; index++) {
			var obj = {
				"sp_zoneid": "",
				"sp_zwtime": [{
					"start_time": "0000",
					"end_time": "0000"
				}]
			};
			obj.sp_zoneid = zoneWorkingTime[index].sp_zoneid;

			if ((finalZoneWorkingTime != undefined) && (finalZoneWorkingTime.length > 0)) {
				var zoneFound = false;
				for(var cnt = 0 ; cnt < finalZoneWorkingTime.length ; cnt++) {
					if (obj.sp_zoneid == finalZoneWorkingTime[cnt].sp_zoneid) {
						zoneFound = true;
						finalZoneWorkingTime[cnt].sp_zwtime = angular.copy(obj.sp_zwtime[0]);
					}
				}

				if (!zoneFound) {
					var arrZwtime = [{}];

					arrZwtime = angular.copy(obj.sp_zwtime);

					var finalObj = {};
					finalObj.sp_zoneid = obj.sp_zoneid;
					finalObj.sp_zwtime = angular.copy(arrZwtime);
					finalZoneWorkingTime.push(finalObj);
				}
			} else if ((finalZoneWorkingTime != undefined) && (finalZoneWorkingTime.length == 0)){
				var arrZwtime = [{}];

				arrZwtime = angular.copy(obj.sp_zwtime);

				var finalObj = {};
				finalObj.sp_zoneid = obj.sp_zoneid;
				finalObj.sp_zwtime = angular.copy(arrZwtime);
				finalZoneWorkingTime.push(finalObj);
			}
		}

		var finalClinicWorkingTime = [];
		for(var index = 0 ; index < clinicWorkingTime.length ; index++) {
			var obj = {
				"sp_clinicid": "",
				"sp_cwtime": [{
					"start_time": "0000",
					"end_time": "0000"
				}]
			};
			obj.sp_clinicid = clinicWorkingTime[index].sp_clinicid;

			if ((finalClinicWorkingTime != undefined) && (finalClinicWorkingTime.length > 0)) {
				var clinicFound = false;
				for(var cnt = 0 ; cnt < finalClinicWorkingTime.length ; cnt++) {
					if (obj.sp_clinicid == finalClinicWorkingTime[cnt].sp_clinicid) {
						clinicFound = true;
						finalClinicWorkingTime[cnt].sp_cwtime = angular.copy(obj.sp_cwtime[0]);
					}
				}

				if (!clinicFound) {
					var arrCwtime = [{}];

					arrCwtime = angular.copy(obj.sp_cwtime);

					var finalObj = {};
					finalObj.sp_clinicid = obj.sp_clinicid;
					finalObj.sp_cwtime = angular.copy(arrCwtime);
					finalClinicWorkingTime.push(finalObj);
				}
			} else if ((finalClinicWorkingTime != undefined) && (finalClinicWorkingTime.length == 0)){
				var arrCwtime = [{}];

				arrCwtime = angular.copy(obj.sp_cwtime);

				var finalObj = {};
				finalObj.sp_clinicid = obj.sp_clinicid;
				finalObj.sp_cwtime = angular.copy(arrCwtime);
				finalClinicWorkingTime.push(finalObj);
			}
		}
		console.log(finalClinicWorkingTime);
		// total work time

		for(var i = 0 ; i < $scope.wrkHrsAllSlots.length ; i++) {
			var wrkSlot = {};
			wrkSlot.start_time = "0000";
			wrkSlot.end_time = "0000";
			selectedSlots.push(wrkSlot);
		}
		//alert($scope.SpWrkHrs.spCity);
		if (!($scope.dateErrorFlag)) {
			var dataObj = {
				"sp_id": $scope.SpWrkHrs.spNamesId,
				"sp_workingDate": wrkDates,
				"sp_workTime": selectedSlots,
				"spZoneAllocatedWTime": finalZoneWorkingTime,
				"spClinicAllocatedWTime": finalClinicWorkingTime,
				"cityId":$scope.SpWrkHrs.spCity
			};

			adminApi.addSpWrkHrs(dataObj)
			.success(function(data, status, headers, config) {
				//$scope.resetAddSpWrkHrsForm();
				//$scope.resetDatePicker9();
				//$scope.dateErrorFlag = false;
				//$scope.wrkHrErrorSlot = false;
				//$scope.populateBusySlotsTable1();
				//$scope.deSelectAllWrkDates();
				alert("Physio's work hours cleared successfully!");

				$scope.showSpManagementWebPage('Set Working Hours');
				$scope.resetAddSpWrkHrsWebPage();
			})
			.error(function(data, status, headers, config) {
				$scope.checkSessionTimeout(data);
				if(data && data.error && data.error.message) {
					alert("Error: " + data.error.message);
				} else {
					alert("Some unknown error has occurred.");
				}
			});
		}
	}

	$scope.clearSpLeaves = function () {
		$scope.leaveDateErrorFlag = false;
		var leaveDates = [];
		var selectedLeaveSlots = [];

		if ($scope.SpLeaves.spNamesId != undefined) {
		} else {
			$scope.SpLeaves.spNamesId = "";
		}

		if ($scope.SpLeaves.comment != undefined) {
		} else {
			$scope.SpLeaves.comment = "";
		}

		if ($scope.SpLeaves.isPaidLeave != undefined) {
			if($scope.SpLeaves.isPaidLeave == "yes") {
				$scope.SpLeaves.isPaidLeave = true;
			} else if ($scope.SpLeaves.isPaidLeave == "no") {
				$scope.SpLeaves.isPaidLeave = false;
			}
		} else {
			$scope.SpLeaves.isPaidLeave = true;
		}

		if ($('#datePicker10Value').val() != undefined && $('#datePicker10Value').val() != '') {
			var arrLeaveDate = $('#datePicker10Value').val().split(",");

			for(var i = 0 ; i < arrLeaveDate.length ; i++) {
				var leaveDate = {};
				var strDate = arrLeaveDate[i].replace(/-/g, "");
				leaveDate.sp_leaveDate = strDate.trim();
				leaveDates.push(leaveDate);
			}
		} else if (leaveDates != undefined && leaveDates.length < 1) {
			$scope.leaveDateErrorFlag = true;
		}

		for(var i = 0 ; i < $scope.spLeaveAllSlots.length ; i++) {
			var offSlot = {};
			offSlot.start_time = "0000";
			offSlot.end_time = "0000";
			selectedLeaveSlots.push(offSlot);
		}

		if (!($scope.leaveDateErrorFlag)) {
			var dataObj = {
				"sp_id": $scope.SpLeaves.spNamesId,
				"sp_leaveDates": leaveDates,
				"sp_offSlots": selectedLeaveSlots,
				"sp_ispaid": $scope.SpLeaves.isPaidLeave,
				"sp_comment": $scope.SpLeaves.comment
			};

			adminApi.addSpLeaves(dataObj)
			.success(function(data, status, headers, config) {
				$scope.populateOffSlotsTable2();
				$scope.deSelectAllLeaveDates();
				alert("Physio's offtime cleared successfully!");
			})
			.error(function(data, status, headers, config) {
				$scope.checkSessionTimeout(data);
			});
		}
	};

	$scope.deSelectAllLeaveDates = function () {
		$('#datetimepicker10').val('').multiDatesPicker('removeDates', arrayLeaveDates);
		var dateVal = $('#datePicker10Value').val();
		if(dateVal != undefined && dateVal != '') {
			var arrDates = $('#datePicker10Value').val().split(",");
			var arrayDt = [];
			for(var i = 0 ; i < arrDates.length ; i++) {
				var strDate = arrDates[i].trim();
				arrayDt.push(strDate);
			}
			$('#datetimepicker10').val('').multiDatesPicker('removeDates', arrayDt);
		}
	}

	$scope.checkClearLeavesButton = function () {
		var isButtonDisabled = true;

		if (!($scope.markSpLeavesForm.adminFormForSp.$pristine) && ($scope.SpLeaves.spNamesId != undefined) && ($scope.SpLeaves.spNamesId != '') && ($scope.SpLeaves.spNamesId.length > 0)) {
				isButtonDisabled = false;
		}

		return isButtonDisabled;
	}

	$scope.checkClearWTimeButton = function () {
		var isButtonDisabled = true;

		if (!($scope.addSpWrkHrsForm.adminFormForSp.$pristine) && ($scope.SpWrkHrs.spNamesId != undefined) && ($scope.SpWrkHrs.spNamesId != '') && ($scope.SpWrkHrs.spNamesId.length > 0)) {
				isButtonDisabled = false;
		}

		return isButtonDisabled;
	}

	/* **********PROMOCODE********************** */

	$scope.getPromoCodes = function() {
		adminApi.getPromo().
		success(function (data, status, headers, config) {
			$scope.arrPromoCode = [];
			var tempArr = data.payload
			console.log("successfully received promo codes");
			angular.copy(tempArr, $scope.arrPromoCode);
			$scope.arrPromoCode.forEach(function(item) {
				item.validFromReadonly = item.validfrom*1000;
				item.validTillReadonly = item.validtill*1000;
				item.validfrom = moment(new Date(item.validfrom*1000).toString());
				item.validtill = moment(new Date(item.validtill*1000).toString());
				item.disctype = item.disctype.toString();
				item.isNewPromo = false;
				item.noofappt = item.noofappt;
				item.max_sessions = item.max_sessions;
				item.min_sessions = item.min_sessions;
				item.free_cancellation_percent = item.free_cancellation_ratio;
                item.before_cancellation_time = item.before_cancellation_time;
                item.valid_days = item.valid_days;
                item.cancellation_fee = item.cancellation_fee;
                item.no_show_fee = item.no_show_fee;

			});
		}).
		error(function (data, status, headers, config) {
			console.log("Error in receiving promo codes");
		});
	};

	$scope.beforeRenderStartDate = function($view, $dates, $leftDate, $upDate, $rightDate, rec) {
		if (rec.validtill) {
			var activeDate = moment(rec.validtill);
			for (var i = 0; i < $dates.length; i++) {
			  if ($dates[i].localDateValue() >= activeDate.valueOf()) $dates[i].selectable = false;
			}
		}
	};

	$scope.beforeRenderEndDate = function($view, $dates, $leftDate, $upDate, $rightDate, rec) {
		if (rec.validfrom) {
			var activeDate = moment(rec.validfrom).subtract(1, $view).add(1, 'minute');
			for (var i = 0; i < $dates.length; i++) {
				if ($dates[i].localDateValue() <= activeDate.valueOf()) {
					$dates[i].selectable = false;            
				}
			}
		}
	};

	$scope.promoCodeReverse = false;

	$scope.sortPromoCode = function(keyname) {
		$scope.promoCodeSortKey = keyname;
		$scope.promoCodeReverse = !$scope.promoCodeReverse;
	}

	$scope.sortPromoCode('createdon');

	/* Function to add a new promotional code */
	$scope.addNewPromoCode = function () {
		var d1 = new Date();
		var d1t0 = d1.getTime()/1000;
		var d1t1 = (d1.getTime()-d1.getMilliseconds())/1000;
		var d1t2 = parseInt(d1.getTime()/1000);
		$scope.arrPromoCode.push(
			{
				"createdon": "",
				"promocode": "",
				"promodesc": "",
				"validfrom": "",
				"validtill": "",
				"active":	false,
				"is_promocode":false,
				"discount":	"",
				"disctype": "2",
				"noofappt": 0,
				action: "edit",
				"promoCityError":false,
				"promoNameError": false,
				"promodescError": false,
				"validFromError": false,
				"validTillError": false,
				"discountError": false,
				"discTypeError": false,
				"freecancellationpercentError":false,
				"isRecValid": false,
				"noofapptRequired": false,
				"isNewPromo": true,
				"max_sessions":1,
				"min_sessions":1,
				"free_cancellation_percent:":0,
				"before_cancellation_time":0,
				"valid_days":0,
				"cancellation_fee":0,
				"no_show_fee":0
			
			}
		);
	}

	$scope.removePromoCodeRecord = function(rec, index){
		var result = confirm("Do you want to delete the record?");
		if(result == true) {
			adminApi.deletePromoCode(rec._id).
			success(function (data, status, headers, config) {
				console.log("Promo code deleted successfully!");
				$scope.getPromoCodes();
			}).
			error(function (data, status, headers, config) {
				console.log("Failed to delete promo code");
			});

		}		
	};

	$scope.savePromoCodeRecord = function(rec, index) {
		//setting min and max values while saving promocode.-kalyani patil
		rec.min_val=rec.min_sessions;
		rec.max_val=rec.max_sessions;
		rec.appt_val=rec.noofappt;
		$scope.promoCityName = "";

		$scope.arrayActiveCity.forEach(function(item) {
			console.log(item);
			if(item._id == rec.promoCity){
				$scope.promoCityName = item.city_name;
			}
		});

		rec.city = $scope.promoCityName;
		
		var isRecordValid = $scope.validatePromoCode(rec);
		if(isRecordValid == true) {
			var fromEpoch = convertToEpoch(rec.validfrom);
			var toEpoch = convertToEpoch(rec.validtill);
			var obj = {
				"promocode": rec.promocode,
				"promodesc": rec.promodesc,
				"validfrom": fromEpoch,
				"validtill": toEpoch,
				"active":	rec.active,
				"is_promocode": rec.is_promocode,
				"discount":	rec.discount,
				"disctype":	rec.disctype,
				"max_sessions":rec.max_sessions,
				"min_sessions":rec.min_sessions,
				"noofappt": rec.noofappt,
				"free_cancellation_ratio":rec.free_cancellation_percent,
				"before_cancellation_time":rec.before_cancellation_time,
				"valid_days":rec.valid_days,
				"cancellation_fee":rec.cancellation_fee,
				"no_show_fee":rec.no_show_fee,
				"cityId":rec.promoCity,
				"city":$scope.promoCityName
				
			};
			if(rec.isNewPromo == true) {
				adminApi.addPromoCode(obj).
				success(function (data, status, headers, config) {
					console.log("Promo code added successfully!");
					rec.createdon = data.payload.createdon;
					rec._id = data.payload._id;
					rec.isNewPromo = false;
					rec.validFromReadonly = data.payload.validfrom*1000;
					rec.validTillReadonly = data.payload.validtill*1000;
					rec.city = $scope.promoCityName;
					var obj1 = {};
					angular.copy(rec, obj1);
					$scope.promoStoreObj[obj1._id] = obj1;
				}).
				error(function(data, status, headers, config) {
					console.log("Failed to add promo code");
					$scope.promocodeResponse.promocodeValid = 'invalid';
					$scope.promocodeResponse.promocodeErrorMessage = data.error.message;
					$timeout(function () { $scope.promocodeResponse.promocodeValid = '' }, 8000);
					rec.action = 'edit';
					$timeout(function () { $scope.scrollDiv("promoErrorBox");}, 100);
				});
			} else {
				console.log(obj);
				adminApi.updatePromoCode(obj, rec._id).
				success(function(data, status, headers, config) {
					console.log("Promo code updated successfully!");
					rec.createdon = data.payload.createdon;
					rec.isNewPromo = false;
					rec.validFromReadonly = data.payload.validfrom*1000;
					rec.validTillReadonly = data.payload.validtill*1000;
					rec.city = $scope.promoCityName;
					var obj1 = {};
					angular.copy(rec, obj1);
					$scope.promoStoreObj[obj1._id] = obj1;
				}).
				error(function(data, status, headers, config) {
					console.log("Failed to update promo code");
					$scope.promocodeResponse.promocodeValid = 'invalid';
					$scope.promocodeResponse.promocodeErrorMessage = data.error.message;
					$timeout(function () { $scope.promocodeResponse.promocodeValid = '' }, 8000);
					rec.action = 'edit';
					$timeout(function () { $scope.scrollDiv("promoErrorBox");}, 100);
				});
			}			
		}
	};

	var convertToEpoch = function(promodate) {
		var fromyear = moment(promodate).format('YYYY');
		var frommonth = moment(promodate).format('MM') - 1;
		var fromday = moment(promodate).format('DD');
		var fromperiod = moment(promodate).format('DD-MM-YYYY h:mm A').split(" ")[2];
		var fromdateMoment = moment(promodate).format('DD-MM-YYYY h:mm A');
		if(fromperiod == "PM"){
			if(parseInt(fromdateMoment.split(" ")[1].split(":")[0]) < 12) {
				var fromHrs = parseInt(fromdateMoment.split(" ")[1].split(":")[0]) + 12;
			} else {
				var fromHrs = fromdateMoment.split(" ")[1].split(":")[0];
			}
		}
		else {
			var fromHrs = fromdateMoment.split(" ")[1].split(":")[0];
		}    		
		var fromMins = fromdateMoment.split(" ")[1].split(":")[1];

		var currentDate = new Date(fromyear, frommonth, fromday);
		currentDate.setHours(fromHrs);
		currentDate.setMinutes(fromMins);
		var epochTime = currentDate.getTime()/1000.0;
		return epochTime;
	};

	/* Function to validate promocode */
	$scope.validatePromoCode = function(rec) {
		
		if(!rec.city){
			rec.promoCityError = true;
		}else{ rec.promoCityError = false;}

		if(!rec.promocode) {
			rec.promoNameError = true;
		} else { rec.promoNameError = false;}
		
		if(!rec.promodesc) {
			rec.promodescError = true;
		} else {rec.promodescError = false; }
		
		if(!rec.validfrom) {
			rec.validFromError = true;
		} else { rec.validFromError = false; }
		
		if(!rec.validtill) {
			rec.validTillError = true;
		} else { rec.validTillError = false; }
		
		if(!rec.discount || !(/^[0-9]*\.[0-9]+|[0-9]+$/).test(rec.discount)) {
			rec.discountError = true;
		} else { rec.discountError = false; }
		
		if(rec.disctype == '' || rec.disctype == null) {
			rec.discTypeError = true;
		} else { rec.discTypeError = false; }

		if((rec.noofappt == undefined || rec.noofappt == "" || rec.noofappt == 0) && rec.is_promocode == true) {
			rec.noofapptRequired = true;
		} else {
			var num = -1;
			try {
				num = parseInt(rec.noofappt);
			} catch(err) {
				rec.noofapptRequired = true;
			}
			if((isNaN(rec.noofappt) || num < 1 || num > 90) && rec.is_promocode == true) {
				rec.noofapptRequired = true;
			}else {
				rec.noofapptRequired = false;
			}
		}


		if((rec.max_sessions == undefined || rec.max_sessions == "" || rec.max_sessions == 0) && rec.is_promocode == false) {
			rec.maxsessionsError = true;
		}
		else{
			rec.maxsessionsError = false;
		}

		if((rec.min_sessions == undefined || rec.min_sessions == "" || rec.min_sessions == 0) && rec.is_promocode == false) {
			rec.minsessionsError = true;
		}
		else{
			rec.minsessionsError = false;
		}

		if(rec.min_sessions > rec.max_sessions){
            rec.minmaxcompareError = true;
		}else{
			rec.minmaxcompareError = false;
		}

		if((rec.free_cancellation_percent < 0)) {
			rec.freecancellationpercentError = true;
		}
		else{
			rec.freecancellationpercentError = false;
		}

		if((rec.before_cancellation_time < 0)) {
			rec.beforecancellationtimeError = true;
		}
		else{
			rec.beforecancellationtimeError = false;
		}

		if((rec.valid_days < 0)) {
			rec.validdaysError = true;
		}
		else{
			rec.validdaysError = false;
		}

		if((rec.cancellation_fee < 0)) {
			rec.cancellationfeeError = true;
		}
		else{
			rec.cancellationfeeError = false;
		}

		if((rec.no_show_fee < 0)) {
			rec.noshowfeeError = true;
		}
		else{
			rec.noshowfeeError = false;
		}

		if(rec.promoNameError == false && 
			rec.promoCityError == false &&
			rec.promodescError == false && 
			rec.validFromError == false &&
			rec.validTillError == false &&
			rec.discountError == false &&
			rec.noofapptRequired == false &&
			rec.discTypeError == false &&
			rec.maxsessionsError == false &&
			rec.minsessionsError == false &&
			rec.freecancellationpercentError == false &&
			rec.beforecancellationtimeError == false &&
			rec.validdaysError == false &&
			rec.cancellationfeeError == false &&
			rec.noshowfeeError == false) {
			rec.isRecValid = true;
			return true;
		} else { rec.isRecValid = false; rec.action = 'edit'; return false; }
	};

	$scope.onCheckSetValue = function(rec) {
		//function to set default value while check is promo? checkbox.-Kalyani Patil
		if(rec.is_promocode == true){
			rec.min_sessions = 0;
			rec.max_sessions = 0;
			
			if(rec.appt_val>1){
				rec.noofappt=rec.appt_val;
			}else{
				rec.noofappt=1;
			}
		}else{
			
			if(rec.min_val != 0 || rec.max_val != 0){
				rec.min_sessions = rec.min_val;
				rec.max_sessions = rec.max_val;
				rec.noofappt=0;
			}else{
				rec.min_sessions = 1;
				rec.max_sessions = 1;
				rec.noofappt=0;
			}
		}
	};

	/* Function to edit promocode. It copies the value the existing obj. */
	$scope.editPromoCode = function(rec, index) {
		var obj = {};
		if(rec.cityId!="" && rec.cityId!=undefined){
	    	rec.promoCity = rec.cityId;
	    }
	    
		angular.copy(rec, obj);
		$scope.promoStoreObj[obj._id] = obj;

        //set default value for is promo? checkbox.-Kalyani Patil
		if(rec.is_promocode == false){
			rec.noofappt=0;
			if(rec.min_val>1 || rec.max_val>1){
				rec.min_sessions = rec.min_val;
				rec.max_sessions = rec.max_val;

			}else{
				rec.min_sessions = 1;
				rec.max_sessions = 1;
			}
		}

	};

	$scope.cancelPromoCodeEdit = function(rec, index) {
		if(rec.isNewPromo == true) {
				$timeout(function(){
					var newPromoCodeList = [];
					angular.forEach($scope.arrPromoCode, function(selectedPromoCodeRecord){
						if(selectedPromoCodeRecord.isNewPromo == false){
							newPromoCodeList.push(selectedPromoCodeRecord);
						}
					});
					$scope.arrPromoCode = newPromoCodeList;
				}, 60);
		} else {
			angular.copy($scope.promoStoreObj[rec._id], rec);
			delete $scope.promoStoreObj[rec._id];
			rec.action = 'cancel'
		}		
	};

	$scope.applyPromocode = function () {
		$scope.applyPromoResponse = {};
		$scope.promoSuccess = false;
		$scope.promoError = false;
		var dateInst = $scope.obj.dt;
		var year = dateInst.getFullYear();
		var month = dateInst.getMonth();
		var day = dateInst.getDate();

		//get selected apt start time  - hour and minute
		var aptst = $scope.adminNewAppointmentCust.aptstarttime;
		var apth = aptst.substring(0,2);
		var aptm = aptst.substring(2,4);

		//From epoch time
		var fromdate = new Date(year, month, day);
		fromdate.setHours(apth);
		fromdate.setMinutes(aptm);
		var myEpochfromtime = fromdate.getTime()/1000.0;

		//To epoch time
		var todate = new Date(year, month, day);
		todate.setTime(fromdate.getTime() + 90*60*1000);
		var myEpochtotime = todate.getTime()/1000.0;

		var apptslot = moment(new Date(fromdate.getTime())).format("YYYY-MM-DD hh:mm A");
		var pincodeid = cache.pincodeToPincodeIdMap[$scope.adminNewAppointmentCust.pincode];

		var clinicBasePriceVal;
		if($scope.clinicBasePriceVal != 0 && $scope.clinicBasePriceVal != undefined){
			clinicBasePriceVal = $scope.clinicBasePriceVal;
		}else{
			clinicBasePriceVal = 0;
		}

		var dataObj = {
			"promocode": $scope.adminNewAppointmentCust.promocode,
			"apptid": "",
			"pincode": pincodeid,
			"cityid": $scope.users1.city,
			"custname": $scope.users1.name,
			"problem": $scope.adminNewAppointmentCust.Problem,
			"apptslots": [apptslot],
			// "apptstarttime": myEpochfromtime,
			// "apptendtime": myEpochtotime,
			"serviceid": $scope.service,
			"clinicBasePrice":clinicBasePriceVal,
			"zoneBasePrice":$scope.zoneBasePrice
		};

		adminApi.applyPromocode(dataObj).
		success(function (data, status, headers, config) {
			var currency1 = data.payload.currency;
			var finalcost1 = data.payload.finalcost;
			var originalcost1 = data.payload.originalcost;
			var promocode1 = data.payload.promocode;
			var promocodeId1 = data.payload.promocodeid;

			$scope.applyPromoResponse = {
				"currency": currency1,
				"finalcost": finalcost1,
				"originalcost": originalcost1,
                "promocode": promocode1,
                "promocodeid": promocodeId1
			};

			//$scope.promoSuccess = "Promotional code: " + promocode1 + " applied successfully! \nOriginal treatment cost: " + originalcost1 + " " + currency1 + "\nFinal treatment cost: " + finalcost1 + " " + currency1;
			$scope.promoSuccess = "Promotional code accepted. \nDiscounted charges are: " + finalcost1 + " " + currency1;

			$scope.promoError = false;
		}).
		error(function (data, status, headers, config) {
			$scope.promoSuccess = false;
			$scope.promoError = data.error.message;
			$scope.applyPromoResponse = {
				"currency": "",
				"finalcost": "",
				"originalcost": "",
				"promocode": "",
				"promocodeid": ""
			};
		});
	}

	$scope.applyPromocodeFollowUpAppt = function () {
		$scope.applyPromoResponseFollowUp = {};
		$scope.promoSuccessFollowUp = false;
		$scope.promoErrorFollowUp = false;

		var dateInst = $scope.obj.dt;
		var year = dateInst.getFullYear();
		var month = dateInst.getMonth();
		var day = dateInst.getDate();

		//get selected apt start time  - hour and minute
		var aptst = $scope.spNewAppointment.aptstarttime;
		var apth = aptst.substring(0,2);
		var aptm = aptst.substring(2,4);

		//From epoch time
		var fromdate = new Date(year, month, day);
		fromdate.setHours(apth);
		fromdate.setMinutes(aptm);
		var myEpochfromtime = fromdate.getTime()/1000.0;

		//To epoch time
		var todate = new Date(year, month, day);
		todate.setTime(fromdate.getTime() + 90*60*1000);
		var myEpochtotime = todate.getTime()/1000.0;

		var dataObj = {
			"promocode": $scope.spNewAppointment.promocode,
			"apptid": "",
			"pincode": $scope.custPincode,
			"cityid": $scope.custCityId,
			"custname": $scope.custName,
			"problem": $scope.custProb,
			"apptslots" : $scope.spNewAppointment.selectedTimeSlots,
			// "apptstarttime": myEpochfromtime,
			// "apptendtime": myEpochtotime,
			"serviceid": $scope.serviceIdInst
		};

		adminApi.applyPromocode(dataObj).
		success(function (data, status, headers, config) {
			var currency1 = data.payload.currency;
			var finalcost1 = data.payload.finalcost;
			var originalcost1 = data.payload.originalcost;
			var promocode1 = data.payload.promocode;
			var promocodeId1 = data.payload.promocodeid;

			$scope.applyPromoResponseFollowUp = {
				"currency": currency1,
				"finalcost": finalcost1,
				"originalcost": originalcost1,
				"promocode": promocode1,
				"promocodeid": promocodeId1
			};

			$scope.promoSuccessFollowUp = "Promotional code accepted. Discounted total charges are: " + currency1 + " " + data.payload.totalCharges + ". Per appointment charges are: " + currency1 + " " + data.payload.finalcost + ".";
			$scope.promoErrorFollowUp = false;
		}).
		error(function (data, status, headers, config) {
			$scope.promoSuccessFollowUp = false;
			$scope.promoErrorFollowUp = data.error.message;
			$scope.applyPromoResponseFollowUp = {
				"currency": "",
				"finalcost": "",
				"originalcost": "",
				"promocode": "",
				"promocodeid": ""
			};
		});
	}

	$scope.resetPromoCodeFollowUp = function () {
		$scope.spNewAppointment.promocode = "";

		$scope.applyPromoResponseFollowUp = {
			"currency": "",
			"finalcost": "",
			"originalcost": "",
			"promocode": "",
			"promocodeid": ""
		};
		$scope.promoSuccessFollowUp = false;
		$scope.promoErrorFollowUp = false;
	}

	$scope.resetPromoCodeEditAppt = function () {
		$scope.editAptModel.promocode = "";

		$scope.applyPromoResponseEditAppt = {
			"currency": "",
			"finalcost": "",
			"originalcost": "",
			"promocode": "",
			"promocodeid": ""
		};
		$scope.promoSuccessEditAppt = false;
		$scope.promoErrorEditAppt = false;
	}

	$scope.resetPromoCodePaymentSection = function () {
		$scope.aptPayment.currency = "INR";
        $scope.aptPayment.type = "Wallet";
        $scope.aptPayment.sptype = "Wallet";
       // $scope.aptPayment.amnt = "0";

        if($scope.adminNewAppointmentCust.appointment.additionalcharge>0){
            $scope.aptPayment.amnt = $scope.adminNewAppointmentCust.appointment.finalcost + $scope.adminNewAppointmentCust.appointment.additionalcharge;
        }else{
            $scope.aptPayment.amnt = $scope.adminNewAppointmentCust.appointment.finalcost;
        }

        $scope.aptPayment.additionalSpAmnt = "0";
        $scope.aptPayment.additionalSpAmntDesc = "";
        $scope.aptPayment.paymentModes = [];
        $scope.aptPayment.promocodeid = "";
        $scope.aptPayment.promocode = "";

		$scope.applyPromoResponsePaymentSection = {
			"currency": "",
			"finalcost": "",
			"originalcost": "",
			"promocode": "",
			"promocodeid": ""
		};
		$scope.promoSuccessPaymentSection = false;
		$scope.promoErrorPaymentSection = false;
	}

	$scope.applyPromocodePaymentSection = function () {
		$scope.applyPromoResponsePaymentSection = {};
		$scope.promoSuccessPaymentSection = false;
		$scope.promoErrorPaymentSection = false;

		var time = [];
		if($scope.adminNewAppointmentCust.aptstarttime == undefined || $scope.adminNewAppointmentCust.aptstarttime == "" || $scope.adminNewAppointmentCust.aptstarttime == false) {
			time = [$scope.adminNewAppointmentCust.appointment.starttime, $scope.adminNewAppointmentCust.appointment.endtime];
		}
		else {
			time = getAptEditTime($scope.adminNewAppointmentCust.aptstarttime, $scope.editAptModel.date);
		}

		var apptslot = moment(new Date(time[0] * 1000)).format("YYYY-MM-DD hh:mm A");

		var clinicBasePriceVal;
		if($scope.clinicBasePriceVal != 0 && $scope.clinicBasePriceVal != undefined){
			clinicBasePriceVal = $scope.clinicBasePriceVal;
		}else{
			clinicBasePriceVal = 0;
		}

		var zoneBasePrice;
		if($scope.adminNewAppointmentCust.appointment.cost != 0 && $scope.adminNewAppointmentCust.appointment.cost != undefined){
			zoneBasePrice = $scope.adminNewAppointmentCust.appointment.cost;
		}else{
			zoneBasePrice = 0;
		}

		var dataObj = {
			"promocode": $scope.aptPayment.promocode,
			"apptid": "",
			"pincode": $scope.editAptModel.pincodeid,
			"cityid": $scope.adminNewAppointmentCust.appointment.cityid,
			"custname": $scope.adminNewAppointmentCust.customer.name,
			"problem": $scope.editAptModel.problem,
			"patientid": $scope.adminNewAppointmentCust.appointment.patientid,
			"apptslots": [apptslot],
			"serviceid": $scope.editAptModel.service,
			"clinicBasePrice": clinicBasePriceVal,
			"zoneBasePrice" : zoneBasePrice
		};

		adminApi.applyPromocode(dataObj).
		success(function (data, status, headers, config) {
			var currency1 = data.payload.currency;
			var finalcost1 = data.payload.finalcost;
			var originalcost1 = data.payload.originalcost;
			var promocode1 = data.payload.promocode;
			var promocodeId1 = data.payload.promocodeid;

			$scope.applyPromoResponsePaymentSection = {
				"currency": currency1,
				"finalcost": finalcost1,
				"originalcost": originalcost1,
				"promocode": promocode1,
				"promocodeid": promocodeId1
			};

            var addtionalchargeMsg = "";
            if ($scope.adminNewAppointmentCust.appointment.additionalcharge > 0){
                var totalincludingAdditionalCharge = $scope.adminNewAppointmentCust.appointment.additionalcharge + finalcost1;
                addtionalchargeMsg = "\n Total cost including additional charges: "+totalincludingAdditionalCharge+ " " + currency1;
            }
			$scope.promoSuccessPaymentSection = "Promotional code accepted. \nDiscounted charges: " + finalcost1 + " " + currency1+addtionalchargeMsg;
			$scope.promoErrorPaymentSection = false;

			if(finalcost1 > 0){
                $scope.applypromocost=finalcost1;
            }else{
                 $scope.applypromocost='';
            }

            if($scope.applypromocost != 'undefined'){

               /* if($scope.applypromocost != 'undefined' && $scope.adminNewAppointmentCust.appointment.additionalcharge >0){
                    $scope.aptPayment.amnt = $scope.applypromocost + $scope.adminNewAppointmentCust.appointment.additionalcharge;

                    var addition;
                    addition =$scope.applypromocost + $scope.adminNewAppointmentCust.appointment.additionalcharge;
                    $scope.calculatedAptAmount = $scope.applypromocost +" + "+ $scope.adminNewAppointmentCust.appointment.additionalcharge +" = "+ addition;
                }else{
                    $scope.aptPayment.amnt = $scope.applypromocost;
                    $scope.calculatedAptAmount = $scope.applypromocost;
                }*/

                $scope.aptPayment.amnt = $scope.applypromocost;
                $scope.calculatedAptAmount = $scope.applypromocost;
                $scope.AptAmount = $scope.applypromocost;
                
            }else{
                if($scope.adminNewAppointmentCust.appointment.additionalcharge>0){
                    $scope.aptPayment.amnt = $scope.adminNewAppointmentCust.appointment.finalcost + $scope.adminNewAppointmentCust.appointment.additionalcharge;

                    var tot;
                    tot = $scope.adminNewAppointmentCust.appointment.finalcost + $scope.adminNewAppointmentCust.appointment.additionalcharge;
                    $scope.calculatedAptAmount = $scope.adminNewAppointmentCust.appointment.finalcost +" + "+ $scope.adminNewAppointmentCust.appointment.additionalcharge +" = "+ tot;
                    $scope.AptAmount = tot;
                }else{
                    $scope.aptPayment.amnt = $scope.adminNewAppointmentCust.appointment.finalcost;
                    $scope.calculatedAptAmount = $scope.adminNewAppointmentCust.appointment.finalcost;
                    $scope.AptAmount = $scope.adminNewAppointmentCust.appointment.finalcost;
                }
            }

            //initilize values of wallet and payAsGo while applying promocode.
            showPaymentDialog();

		}).
		error(function (data, status, headers, config) {
			$scope.promoSuccessPaymentSection = false;
			$scope.promoErrorPaymentSection = data.error.message;
			$scope.applyPromoResponsePaymentSection = {
				"currency": "",
				"finalcost": "",
				"originalcost": "",
				"promocode": "",
				"promocodeid": ""
			};
		});
	}

	$scope.showPromocodeInfoInAdmin = function() {
		/*if(($scope.adminNewAppointmentCust.appointment != undefined) && ($scope.adminNewAppointmentCust.appointment.promocode != undefined) && ($scope.adminNewAppointmentCust.appointment.promocode.trim().length > 0)) {
			if(($scope.adminNewAppointmentCust.appointment.finalcost != undefined) && ($scope.adminNewAppointmentCust.appointment.finalcost >= 0)) {
				return true;
			}
		}*/

		return false;
	}

	/************POLICY************************/

 	$('#summernote').summernote();
	$scope.policyMgmt = {};
	$scope.policyMgmt.arrayPolicy = [];

	$scope.policyMgmt.getPolicy = function() {
		$scope.policyMgmt.count = 0;

		adminApi.getPolicy().
		success(function (data, status, headers, config) {
			var dataarray = [];
			var dataarray = data.payload;
			console.log("successfully received policy");
			dataarray.forEach(function(item) {
				$scope.policyMgmt.arrayPolicy.push(item);
			});
			$('.note-editable').html($scope.policyMgmt.arrayPolicy[0].policy_description);
		}).
		error(function (data, status, headers, config) {
			console.log("Error in receiving clinics");
		});
	}

	$scope.policyMgmt.savePolicy = function() {
		var htmlString = $('.note-editable').html();

		if(htmlString != '' && htmlString != undefined){
			var obj = { "policy_html": htmlString };
			adminApi.addPolicy(obj).
			success(function (data, status, headers, config) {
				//$scope.policyMgmt.getPolicy();
				$scope.policyMgmt.policySuccessMsg = "You have successfully updated cancellation policy.";
				$scope.policyMgmt.policyErrorMsg = "";
				$('.note-editable').html(htmlString);
				$(document).scrollTop(0,0);
			}).
			error(function (data, status, headers, config) {
				$scope.policyMgmt.policySuccessMsg = "";
				$scope.policyMgmt.policyErrorMsg = "Error while saving the cancellation policy.";
			});
		}
	}

	/* **********CLINIC********************** */

	$scope.clinicMgmt = {};
	$scope.clinicMgmt.arrayClinic = [];

	$scope.clinicMgmt.getClinic = function() {
		$scope.clinicMgmt.editMode = false;
		$scope.clinicMgmt.InitClinicParams();
		$scope.clinicMgmt.arrayClinic = [];

		adminApi.getClinic(true).
		success(function (data, status, headers, config) {
			var arrStoreTrue = [];
			var arrStoreTrue = data.payload;
			console.log("successfully received clinics");
			arrStoreTrue.forEach(function(item) {
				$scope.clinicMgmt.arrayClinic.push(item);
			});
		}).
		error(function (data, status, headers, config) {
			console.log("Error in receiving clinics");
		});

		adminApi.getClinic(false).
		success(function (data, status, headers, config) {
			var arrStoreFalse = [];
			var arrStoreFalse = data.payload;
			console.log("successfully received clinics");
			arrStoreFalse.forEach(function(item) {
				$scope.clinicMgmt.arrayClinic.push(item);
			});
		}).
		error(function (data, status, headers, config) {
			console.log("Error in receiving clinics");
		});
	};

	$scope.clinicReverse = false;

	$scope.clinicMgmt.sortClinic = function(keyname) {
		$scope.clinicSortKey = keyname;
		$scope.clinicReverse = !$scope.clinicReverse;
	}

	$scope.clinicMgmt.sortClinic('created_on');

	$scope.clinicHours = 1;
	$scope.clinicMinutes = 15;

	$scope.options = {
		clinicHours: [1, 2, 3],
		clinicMinutes: [1, 5, 10, 15, 25, 30]
	};

	$scope.ismeridianstarttime = false;
	$scope.toggleModeClinicStartTime = function() {
		$scope.ismeridianstarttime = ! $scope.ismeridianstarttime;
	};

	$scope.updateClinicStartTime = function() {
		var d = new Date();
		d.setHours( 14 );
		d.setMinutes( 0 );
		$scope.clinicMgmt.temppojo.clinic_start_time = d;
	};

	$scope.changedClinicStartTime = function () {
		console.log('Start Time changed to: ' + $scope.clinicMgmt.temppojo.clinic_start_time);
	};

	$scope.clearClinicStartTime = function() {
		$scope.clinicMgmt.temppojo.clinic_start_time = null;
	};


	$scope.ismeridianendtime = false;
	$scope.toggleModeClinicEndTime = function() {
		$scope.ismeridianendtime = ! $scope.ismeridianendtime;
	};

	$scope.updateClinicEndTime = function() {
		var d = new Date();
		d.setHours( 14 );
		d.setMinutes( 0 );
		$scope.clinicMgmt.temppojo.clinic_end_time = d;
	};

	$scope.changedClinicEndTime = function () {
		console.log('End Time changed to: ' + $scope.clinicMgmt.temppojo.clinic_end_time);
	};

	$scope.clearClinicEndTime = function() {
		$scope.clinicMgmt.temppojo.clinic_end_time = null;
	};

	$scope.clinicMgmt.saveClinic = function(rec, index) {
		console.log(rec);
		$scope.clinicMgmt.InitClinicParams();
		var validClinic = true;
		validClinic = $scope.clinicMgmt.validateClinic(rec, validClinic);
		if(validClinic){
			if(rec._id == null || rec._id == "" || rec._id == undefined) {
				adminApi.addClinic(rec).
				success(function (data, status, headers, config) {
					$scope.clinicMgmt.InitClinicParams();
					$scope.clinicMgmt.editMode = false;
					$scope.clinicMgmt.clinicAddEditSection = false;
					$scope.clinicMgmt.getClinic();
					$scope.clinicMgmt.clinicSuccessMsg = "You have successfully added new clinic.";
					$scope.clinicMgmt.clinicErrorMsg = "";
				}).
				error(function (data, status, headers, config) {
					$scope.clinicMgmt.clinicSuccessMsg = "";
					$scope.clinicMgmt.clinicErrorMsg = "Error while saving the new clinic setting.";
				});
			}else{
				adminApi.updateClinic(rec._id, rec).
				success(function (data, status, headers, config) {
					$scope.clinicMgmt.InitClinicParams();
					$scope.clinicMgmt.editMode = false;
					$scope.clinicMgmt.clinicAddEditSection = false;
					$scope.clinicMgmt.getClinic();
					$scope.clinicMgmt.clinicSuccessMsg = "You have successfully updated the clinic setting.";
					$scope.clinicMgmt.clinicErrorMsg = "";
				}).
				error(function (data, status, headers, config) {
					$scope.clinicMgmt.clinicSuccessMsg = "";
					$scope.clinicMgmt.clinicErrorMsg = "Error while updating the clinic setting.";
				});
			}
		}
	}


	/* **********CITY********************** */

	$scope.clinicMgmt.arrayCity = [];

	$scope.cityMgmt.getCity = function() {
		$scope.cityMgmt.editMode = false;
		$scope.cityMgmt.InitCityParams();
		$scope.cityMgmt.arrayCity = [];

		adminApi.getCity(true).
		success(function (data, status, headers, config) {
			var arrStoreTrue = [];
			var arrStoreTrue = data.payload;
			console.log("successfully received cities");
			arrStoreTrue.forEach(function(item) {
				$scope.cityMgmt.arrayCity.push(item);
			});
		}).
		error(function (data, status, headers, config) {
			console.log("Error in receiving cities");
		});

		adminApi.getCity(false).
		success(function (data, status, headers, config) {
			var arrStoreTrue = [];
			var arrStoreTrue = data.payload;
			console.log("successfully received cities");
			arrStoreTrue.forEach(function(item) {
				$scope.cityMgmt.arrayCity.push(item);
			});
		}).
		error(function (data, status, headers, config) {
			console.log("Error in receiving cities");
		});

	};



	$scope.cityMgmt.saveCity = function(rec, index) {
		console.log(rec);
		$scope.cityMgmt.InitCityParams();
		var validCity = true;
		validCity = $scope.cityMgmt.validateCity(rec, validCity);
		if(validCity){
			if(rec._id == null || rec._id == "" || rec._id == undefined) {
				adminApi.addCity(rec).
				success(function (data, status, headers, config) {
					$scope.cityMgmt.InitCityParams();
					$scope.cityMgmt.editMode = false;
					$scope.clinicMgmt.clinicAddEditSection = false;
					$scope.clinicMgmt.getClinic();
					$scope.clinicMgmt.clinicSuccessMsg = "You have successfully added new city.";
					$scope.clinicMgmt.clinicErrorMsg = "";
				}).
				error(function (data, status, headers, config) {
					$scope.clinicMgmt.clinicSuccessMsg = "";
					$scope.clinicMgmt.clinicErrorMsg = "Error while saving the new city setting.";
				});
			}else{
				adminApi.updateCity(rec._id, rec).
				success(function (data, status, headers, config) {
					$scope.cityMgmt.InitCityParams();
					$scope.cityMgmt.editMode = false;
					$scope.clinicMgmt.clinicAddEditSection = false;
					$scope.clinicMgmt.getClinic();
					$scope.clinicMgmt.clinicSuccessMsg = "You have successfully updated the city setting.";
					$scope.clinicMgmt.clinicErrorMsg = "";
				}).
				error(function (data, status, headers, config) {
					$scope.clinicMgmt.clinicSuccessMsg = "";
					$scope.clinicMgmt.clinicErrorMsg = "Error while updating the city setting.";
				});
			}
		}
	}

	$scope.clinicMgmt.InitClinicParams = function(){
		$scope.clinicMgmt.clinic_id_error = null;
		$scope.clinicMgmt.clinic_name_error = null;
		$scope.clinicMgmt.clinic_description_error = null;
		$scope.clinicMgmt.clinic_country_error = null;
		$scope.clinicMgmt.clinic_state_error = null;
		$scope.clinicMgmt.clinic_state_error = null;
		$scope.clinicMgmt.clinic_city_error = null;
		$scope.clinicMgmt.clinic_zone_error = null;
		$scope.clinicMgmt.clinic_address_error = null;
		$scope.clinicMgmt.clinic_base_price_error = null;
		$scope.clinicMgmt.clinic_capacity_error = null;
		$scope.clinicMgmt.clinic_time_slot_duration_error = null;
		$scope.clinicMgmt.clinic_start_time_error = null;
		$scope.clinicMgmt.clinic_end_time_error = null;
		$scope.clinicMgmt.clinicSuccessMsg = "";
		$scope.clinicMgmt.clinicErrorMsg = "";
	}


	$scope.cityMgmt.InitCityParams = function(){
		$scope.clinicMgmt.city_id_error = null;
		$scope.clinicMgmt.city_name_error = null;
		$scope.clinicMgmt.city_country_error = null;
		$scope.clinicMgmt.city_state_error = null;
		
		$scope.clinicMgmt.citySuccessMsg = "";
		$scope.clinicMgmt.cityErrorMsg = "";
	}


	$scope.clinicMgmt.validateClinic = function(rec, validClinic){
		
		if(rec.clinic_id == ""){
			validClinic = false;
			$scope.clinicMgmt.clinic_id_error = "Registration ID cannot be blank.";
		}
		
		if(rec.clinic_name == ""){
			validClinic = false;
			$scope.clinicMgmt.clinic_name_error = "Clinic name cannot be blank.";
		}
		
		if(rec.clinic_description == ""){
			validClinic = false;
			$scope.clinicMgmt.clinic_description_error = "Clinic description cannot be blank.";
		}
		
		if(rec.clinic_country == "" || rec.clinic_country == undefined){
			validClinic = false;
			$scope.clinicMgmt.clinic_country_error = "Country cannot be blank.";
		}
		
		if(rec.clinic_state == "" || rec.clinic_state == undefined){
			validClinic = false;
			$scope.clinicMgmt.clinic_state_error = "State cannot be blank.";
		}
		
		if(rec.clinic_city == "" || rec.clinic_city == undefined){
			validClinic = false;
			$scope.clinicMgmt.clinic_city_error = "City cannot be blank.";
		}
		
		if(rec.clinic_zone == "" || rec.clinic_zone == undefined){
			validClinic = false;
			$scope.clinicMgmt.clinic_zone_error = "Zone cannot be blank.";
		}
		
		if(rec.clinic_address == ""){
			validClinic = false;
			$scope.clinicMgmt.clinic_address_error = "Address cannot be blank.";
		}
		
		if(rec.clinic_base_price == ""){
			validClinic = false;
			$scope.clinicMgmt.clinic_base_price_error = "Base price cannot be blank.";
		}
		
		if(rec.clinic_capacity == ""){
			validClinic = false;
			$scope.clinicMgmt.clinic_capacity_error = "Capacity cannot be blank.";
		}
		
		if(rec.clinic_time_slot_duration == ""){
			validClinic = false;
			$scope.clinicMgmt.clinic_time_slot_duration_error = "Time slot duration cannot be blank.";
		}
		
		if(rec.clinic_start_time == ""){
			validClinic = false;
			$scope.clinicMgmt.clinic_start_time_error = "Start time cannot be blank.";
		}
		
		if(rec.clinic_end_time == ""){
			validClinic = false;
			$scope.clinicMgmt.clinic_end_time_error = "End time cannot be blank.";
		}
		return validClinic;
	}


	$scope.cityMgmt.validateCity = function(rec, validCity){
		
		if(rec.city_id == ""){
			validCity = false;
			$scope.cityMgmt.city_id_error = "Registration ID cannot be blank.";
		}
		
		if(rec.city_name == ""){
			validCity = false;
			$scope.cityMgmt.city_name_error = "Clinic name cannot be blank.";
		}
		
		if(rec.country == "" || rec.country == undefined){
			validCity = false;
			$scope.cityMgmt.city_country_error = "Country cannot be blank.";
		}
		
		if(rec.state == "" || rec.state == undefined){
			validCity = false;
			$scope.cityMgmt.city_state_error = "State cannot be blank.";
		}
		
		return validCity;
	}

	$scope.clinicMgmt.emptyClinicArr = {
		"clinic_id" : "",
		"clinic_name" : "",
		"clinic_description" : "",
		"clinic_country" : $scope.clinicCountrySelected,
		"clinic_state" : $scope.clinicStateSelected,
		"clinic_city" : $scope.clinicCitySelected,
		"clinic_zone" : "",
		"clinic_address" : "",
		"clinic_base_price" : 0,
		"clinic_capacity" : 0,
		"clinic_time_slot_duration" : 0,
		"clinic_start_time" : "",
		"clinic_end_time" : "",
		"is_active" : true
	};

	$scope.cityMgmt.emptyClinicArr = {
		"city_id" : "",
		"city_name" : "",		
		"country" : $scope.clinicCountrySelected,
		"state" : $scope.clinicStateSelected,
		"price" : 0,
		"is_active" : true
	};

	$scope.clinicMgmt.addNewClinic = function(action, rec, index) {
		$scope.clinicMgmt.InitClinicParams();
		$scope.clinicMgmt.clinicIndex;
		if(action == 'add') {
			$scope.clinicMgmt.temppojo = {};
			angular.copy($scope.clinicMgmt.emptyClinicArr, $scope.clinicMgmt.temppojo);
			$scope.clinicMgmt.clinicAddEditSection = true;
			$scope.clinicMgmt.editMode = false;
		}

		if(action == 'edit') {
			$scope.clinicMgmt.temppojo = {};
			$scope.clinicMgmt.clinicIndex = index;
			$scope.clinicMgmt.clinicRecord = rec;
			/*copy the record to be editted to temppojo*/
			angular.copy(rec, $scope.clinicMgmt.temppojo);
			var start_time_array = null;
			start_time_array = rec.clinic_start_time.split(":");
			var start_time = new Date();
			start_time.setHours(start_time_array[0]);
			start_time.setMinutes(start_time_array[1]);
			$scope.clinicMgmt.temppojo.clinic_start_time = start_time;

			var end_time_array = null;
			end_time_array = rec.clinic_end_time.split(":");
			var end_time = new Date();
			end_time.setHours(end_time_array[0]);
			end_time.setMinutes(end_time_array[1]);
			$scope.clinicMgmt.temppojo.clinic_end_time = end_time;

			$scope.clinicMgmt.clinicAddEditSection = true;
			$scope.clinicMgmt.editMode = true;
		}
	};

	$scope.cityMgmt.addNewCity = function(action, rec, index) {
		$scope.clinicMgmt.InitCityParams();
		$scope.clinicMgmt.clinicIndex;
		if(action == 'add') {
			$scope.cityMgmt.temppojo = {};
			angular.copy($scope.cityMgmt.emptyClinicArr, $scope.cityMgmt.temppojo);
			$scope.clinicMgmt.clinicAddEditSection = true;
			$scope.cityMgmt.editMode = false;
		}

		/*if(action == 'edit') {
			$scope.clinicMgmt.temppojo = {};
			$scope.clinicMgmt.clinicIndex = index;
			$scope.clinicMgmt.clinicRecord = rec;
			
			angular.copy(rec, $scope.clinicMgmt.temppojo);
			var start_time_array = null;
			start_time_array = rec.clinic_start_time.split(":");
			var start_time = new Date();
			start_time.setHours(start_time_array[0]);
			start_time.setMinutes(start_time_array[1]);
			$scope.clinicMgmt.temppojo.clinic_start_time = start_time;

			var end_time_array = null;
			end_time_array = rec.clinic_end_time.split(":");
			var end_time = new Date();
			end_time.setHours(end_time_array[0]);
			end_time.setMinutes(end_time_array[1]);
			$scope.clinicMgmt.temppojo.clinic_end_time = end_time;

			$scope.clinicMgmt.clinicAddEditSection = true;
			$scope.clinicMgmt.editMode = true;
		}*/
	};

	/* Function to cancel clinic editing */
	$scope.clinicMgmt.cancelClinicEdit = function() {
		$scope.clinicMgmt.InitClinicParams();
		$scope.clinicMgmt.editMode = false;
		$scope.clinicMgmt.clinicAddEditSection = false;
	};

	$scope.clinicMgmt.actionClinic = function(is_active, rec, index) {

		ngDialog.openConfirm({
            template: 'ClinicAction',
            showClose:false,
            scope: $scope 
        }).then(function(value)
        {
			/*if(is_active)
				var con = confirm("Are you sure you want to activate this clinic.");
			else
				var con = confirm("Are you sure you want to deactivate this clinic.");
			*/

			if($scope.clinicAction.password == 'paradox123'){
				$scope.clinicAction.password = "";
				rec.is_active = is_active;

				var start_time_array = null;
				start_time_array = rec.clinic_start_time.split(":");
				var start_time = new Date();
				start_time.setHours(start_time_array[0]);
				start_time.setMinutes(start_time_array[1]);
				rec.clinic_start_time = start_time;

				var end_time_array = null;
				end_time_array = rec.clinic_end_time.split(":");
				var end_time = new Date();
				end_time.setHours(end_time_array[0]);
				end_time.setMinutes(end_time_array[1]);
				rec.clinic_end_time = end_time;

				console.log(rec);

				adminApi.updateClinic(rec._id, rec).
				success(function (data, status, headers, config) {
					$scope.clinicMgmt.InitClinicParams();
					$scope.clinicMgmt.editMode = false;
					$scope.clinicMgmt.clinicAddEditSection = false;
					$scope.clinicMgmt.getClinic();
					if(is_active)
						$scope.clinicMgmt.clinicSuccessMsg = "You have successfully activated the clinic setting.";
					else
						$scope.clinicMgmt.clinicSuccessMsg = "You have successfully deactivated the clinic setting.";
					$scope.clinicMgmt.clinicErrorMsg = "";
				}).
				error(function (data, status, headers, config) {
					$scope.clinicMgmt.clinicSuccessMsg = "";
					if(is_active)
						$scope.clinicMgmt.clinicErrorMsg = "Error while activating the clinic setting.";
					else
						$scope.clinicMgmt.clinicErrorMsg = "Error while deactivating the clinic setting.";
				});
			}else{
				$scope.clinicAction.password = "";
				$scope.clinicMgmt.clinicErrorMsg = "Invalid password.";
			}
		},
		function(value) {
			$scope.clinicAction.password = "";
            console.log("Fail clinic transaction.");
        });
	}

	/**************ZONE MAGANEMENT*******************/

	$scope.zoneMgmt = {};
	$scope.zoneMgmt.zoneStoreObj = {};
	$scope.zoneMgmt.zoneResponse = {};

	$scope.zoneMgmt.zoneReverse = false;
	$scope.zoneMgmt.zoneSortKey = 'zonename';
	$scope.zoneMgmt.addNewZoneSection = false;

	$scope.zoneMgmt.sortZone = function(keyname) {
		$scope.zoneMgmt.zoneSortKey = keyname;
		$scope.zoneMgmt.zoneReverse = !$scope.zoneMgmt.zoneReverse;
	}

	
	$scope.zoneMgmt.arrZone = [];
	
	/* Function to Get all zones */
	$scope.zoneMgmt.getAllZones = function() {
		adminApi.getAllZones().
		success(function (data, status, headers, config) {
			var arrStore = [];
			$scope.zoneMgmt.arrZone = [];
			
			var arrStore = data.payload;
			console.log("successfully retrieved all zones!");
			arrStore.forEach(function(item) {
				item.isNewZone = false;
				$scope.zoneMgmt.arrZone.push(item);
				
				angular.forEach(item.pincodes,function(pincodeEntites,pincodekeys){
				  item.pincodes[pincodekeys].locality = pincodeEntites.pin+' - '+pincodeEntites.localities ;
				});
			
			});
		}).
		error(function (data, status, headers, config) {
			console.log("Failed to retrieve zones!");
		});
		
	};

	$scope.zoneMgmt.emptyZoneArr = {
		"city": $scope.zoneCity.name,
		"cityid": $scope.zoneCity.id,
		"country": $scope.zoneCountry.name,
		"countryid": $scope.zoneCountry.id,
		"state": $scope.zoneState.name,
		"stateid": $scope.zoneState.id,
		"zonename"	: "",
		"pincodes" : [
			{
				"pin" : "",
				"localities" : "",
				"isPinError" : false,
				"isLocalityError": false
			}
		],	
		"price": "",			
		"action" : "edit",
		"isNewZone"	: true,
		"isZoneNameError" : false,
		"isZoneRecValid" : false,
		"isZonePriceError" : false
	};	

	$scope.setZonePrice = function(){
		if($scope.zoneMgmt.temppojo==undefined){
			$scope.zoneMgmt.temppojo = {};	
		}
		angular.forEach($scope.arrayActiveCity,function(item,key){
			if(item._id==$scope.zoneCitySelected){
				$scope.zoneMgmt.temppojo.zoneprice = item.price;	
			}
		});
	}

	/* Function to Add new Zone */
	$scope.zoneMgmt.addNewZone = function(action, rec, index) {
		console.log(rec);
		$scope.zoneMgmt.zoneIndex;
		if(action == 'addnew') {
			$scope.zoneMgmt.temppojo = {};
			angular.copy($scope.zoneMgmt.emptyZoneArr, $scope.zoneMgmt.temppojo);
			if($scope.zoneCitySelected!=undefined){
				angular.forEach($scope.arrayActiveCity,function(item,key){
					if(item._id==$scope.zoneCitySelected){
						$scope.zoneMgmt.temppojo.zoneprice = item.price;	
					}
				});
			}
			$scope.zoneMgmt.addNewZoneSection = true;
			$scope.zoneMgmt.editZoneSection = false;
		}

		if(action == 'editZone') {
			$scope.zoneMgmt.temppojo = {};
			$scope.zoneMgmt.zoneIndex = index;
			$scope.zoneMgmt.zoneRecord = rec;
			/*copy the record to be editted to temppojo*/
			angular.copy(rec, $scope.zoneMgmt.temppojo);
			$scope.zoneMgmt.temppojo.zoneprice = $scope.zoneMgmt.temppojo.price;
            $scope.zoneCitySelected = $scope.zoneMgmt.temppojo.cityid;
			$scope.zoneMgmt.editZoneSection = true;
			$scope.zoneMgmt.addNewZoneSection = false;
		}
	};

	/* Function to delete Zone */
	$scope.zoneMgmt.removeZone = function(rec, index) {
		var result = confirm("Do you want to delete the record?");
		if(result == true) {
			adminApi.deleteZone(rec._id).
			success(function (data, status, headers, config) {
				console.log("Zone deleted successfully!");
				$scope.zoneMgmt.getAllZones();
				$scope.custPin(rec.cityid);
			}).
			error(function (data, status, headers, config) {
				if(data && data.error && data.error.message) {
					alert(data.error.message);
				} else {
					alert("Some unknown error has occurred");
				}
				$scope.checkSessionTimeout(data);
			});
		}
	};

	/* Function to cancel zone editing */
	$scope.zoneMgmt.cancelZoneEdit = function(rec, index) {
		$scope.zoneMgmt.editZoneSection = false;
		$scope.zoneMgmt.addNewZoneSection = false;
		$scope.zoneCitySelected = "";
	};

	/* Function to validate zone pin and area name */
	var validateZone = function(rec) {
		var isPinError = false; 
		var isLocalityError = false;
		if(!rec.zonename || !(/^[a-zA-Z-. ]*$/).test(rec.zonename)) {
			$scope.zoneMgmt.temppojo.isZoneNameError = true;
		} else { $scope.zoneMgmt.temppojo.isZoneNameError = false; }

		if(!rec.zoneprice || rec.zoneprice < 0) {
			$scope.zoneMgmt.temppojo.isZonePriceError = true;
		} else { $scope.zoneMgmt.temppojo.isZonePriceError = false; }
		
		rec.pincodes.forEach(function (i) {
			if(!i.pin) {
				i.isPinError = true;
				isPinError = true;
			} else { i.isPinError = false; isPinError = false; }
			/*locality should allow comma and digits*/
			if(!i.localities || !(/^[a-zA-Z0-9\,\.\/\s]*$/).test(i.localities)) {
				i.isLocalityError = true;
				isLocalityError = true;
			} else { i.isLocalityError = false; isLocalityError = false; }
		});

		if($scope.zoneMgmt.temppojo.isZoneNameError == false &&
			isPinError == false &&
			isLocalityError == false && $scope.zoneMgmt.temppojo.isZonePriceError == false) {
			rec.isZoneRecValid = true;
			return true;
		} else {
			rec.isZoneRecValid = false; rec.action = 'edit'; return false;
		}
	};

	$scope.zoneMgmt.saveZone = function(rec, index) {
		var isZoneValid = validateZone(rec);
		if(isZoneValid) {
			var pinarray = [];
			rec.pincodes.forEach(function(item) {
				if(!item.hasOwnProperty("isdeleted") || item.isdeleted == false) {
					var pincodeObj = { "pin": item.pin, "localities": item.localities,"locality": item.pin+' - '+item.localities };
					if(item.pincodeid) {
						pincodeObj.pincodeid = item.pincodeid;
					}				
					pinarray.push(pincodeObj);
				}
			});

			var cityName = "";
			$scope.arrayActiveCity.forEach(function(itemCity) {
				if(itemCity._id == $scope.zoneCitySelected){
					cityName = itemCity.city_name;
				}
			});
			
			var obj = {
			    "zonename": rec.zonename,
			    "countryid": $scope.zoneCountry.id,
			    "country": $scope.zoneCountry.name,
			    "stateid": $scope.zoneState.id,
			    "state": $scope.zoneState.name,
			    "cityid": $scope.zoneCitySelected,
			    "city": cityName,
			    "pincodes": pinarray,
			    "price": $scope.zoneMgmt.temppojo.zoneprice
			};
			if(rec._id == null || rec._id == "" || rec._id == undefined) {
				adminApi.addNewZone(obj).
				success(function (data, status, headers, config) {
					console.log("Successfully created new zone");
					data.payload.isNewZone = false;
					//$scope.zoneMgmt.arrZone.push(data.payload);
					console.log($scope.zoneMgmt.arrZone);
					var arrStore = [];
					arrStore.push(data.payload);
					console.log("successfully retrieved all zones!");
					angular.forEach(arrStore,function(item) {
						item.isNewZone = false;
						$scope.zoneMgmt.arrZone.push(item);
							
						angular.forEach(item.pincodes,function(pincodeEntites,pincodekeys){
							item.pincodes[pincodekeys].locality = pincodeEntites.pin+' - '+pincodeEntites.localities ;
						});
						
					});
					alert("Zone added successfully!");
					$scope.zoneMgmt.editZoneSection = false;
					$scope.zoneMgmt.addNewZoneSection = false;
					$scope.custPin($scope.zoneCity.id);
				}).
				error(function (data, status, headers, config) {
					console.log("Error in creating new zone");
					$scope.zoneMgmt.zoneResponse.zoneValid = 'invalid';
					if(data && data.error && data.error.message) {
						$scope.zoneMgmt.zoneResponse.zoneErrorMessage = data.error.message;
					} else {
						$scope.zoneMgmt.zoneResponse.zoneErrorMessage = "Some unknown error has occurred";
					}
					$timeout(function () { $scope.zoneMgmt.zoneResponse.zoneValid = '' }, 10000);
				});
			} else {
				adminApi.editZone(rec._id, obj).
				success(function (data, status, headers, config) {
					console.log("Successfully edited new zone");
					angular.copy(data.payload, $scope.zoneMgmt.zoneRecord);
					angular.forEach($scope.zoneMgmt.zoneRecord.pincodes,function(pincodeEntites,pincodekeys){
						$scope.zoneMgmt.zoneRecord.pincodes[pincodekeys].locality = pincodeEntites.pin+' - '+pincodeEntites.localities ;
					});
					//console.log($scope.zoneMgmt.zoneRecord.pincodes);
					$scope.zoneMgmt.editZoneSection = false;
					$scope.zoneMgmt.addNewZoneSection = false;

					$scope.custPin($scope.zoneCity.id);
				}).
				error(function (data, status, headers, config) {
					console.log("Error in editing new zone");
					$scope.zoneMgmt.zoneResponse.zoneValid = 'invalid';
					if(data && data.error && data.error.message) {
						$scope.zoneMgmt.zoneResponse.zoneErrorMessage = data.error.message;
					} else {
						$scope.zoneMgmt.zoneResponse.zoneErrorMessage = "Some unknown error has occurred";
					}
					$timeout(function () { $scope.zoneMgmt.zoneResponse.zoneValid = '' }, 10000);
				});
			}
			
		} /*if END*/
	};

	/* Function to add multiple Pincode and Area name for a zone*/
	$scope.zoneMgmt.addPinAndArea = function(rec, index) {
		rec.pincodes.push(
			{
				"pin" : "",
				"localities" : ""
			}
		);
	};

	/* Function to remove set of pin and area */
	$scope.zoneMgmt.removePinAndAreaRow = function(pincodeArr, index) {
		var undeletedPincodes = [];
		for(var i=0; i<pincodeArr.length; i++) {
			if(!pincodeArr[i].isdeleted) {
				undeletedPincodes.push(pincodeArr[i]);
			}
		}
		if(undeletedPincodes.length > 1) {
			pincodeArr.splice(index, 1);
		} else {
			alert("Fill atleast 1 pincode and area name detail for the zone");
		}		
	}

	$scope.manageSp.spReverse = true;

	$scope.manageSp.sortSP = function(keyname) {
		$scope.manageSp.spSortKey = keyname;
		$scope.manageSp.spReverse = !$scope.manageSp.spReverse;
	}

	$scope.editSpRecord = function(rec, index) {
		$scope.manageSp.addNewSp = false;
		$scope.manageSp.updateSp = true;
		$scope.manageSp.showSpForm = true;

		$scope.selectedSpId = rec._id;
		if ((rec._id != undefined) && (rec._id.length > 0) && ($scope.arrSpRecords.length > 0)) {
			for(var i = 0 ; i < $scope.arrSpRecords.length ; i++) {
				if(rec._id == $scope.arrSpRecords[i]._id) {
					$scope.selectedSpId = $scope.arrSpRecords[i]._id;
					//console.log($scope.arrSpRecords[i].cityid);
					$scope.spDetails.spName = $scope.arrSpRecords[i].name;
					$scope.spDetails.qualification = $scope.arrSpRecords[i].qualification;
					$scope.spDetails.spEmail = $scope.arrSpRecords[i].email;
					$scope.spDetails.spAlternateEmail = $scope.arrSpRecords[i].alternateemail;
					$scope.spDetails.spAddress = $scope.arrSpRecords[i].address;
					$scope.spDetails.spPincode = $scope.arrSpRecords[i].pincode;
					$scope.spDetails.spCity = $scope.arrSpRecords[i].cityId;
					$scope.spDetails.spState = $scope.arrSpRecords[i].state;
					$scope.spDetails.spCountry = $scope.arrSpRecords[i].country;
					$scope.spDetails.spMobile = $scope.arrSpRecords[i].phonemobile;
					$scope.spDetails.spAlternateContact = $scope.arrSpRecords[i].phonealternate;

					if ($scope.arrSpRecords[i].gender == "Male") {
						$scope.spDetails.spGender = "male";
					} else if ($scope.arrSpRecords[i].gender == "Female") {
						$scope.spDetails.spGender = "female";
					}

					var d = $scope.arrSpRecords[i].dateofbirth + "";
					var year = d.substring(0,4);
					var month = d.substring(4,6);
					var day = d.substring(6,8);
					var dob = year + "-" + month + "-" + day;

					$('#datetimepicker8').val(dob);
					$scope.spDob = dob;

					$scope.spPrimaryZones = [];
					$scope.displaySpPrimaryZones = [];
					$scope.spSecondaryZones = [];
					$scope.displaySpSecondaryZones = [];

					var primaryZoneId = [];
					var secondaryZoneId = [];
					for (var j = 0 ; j < $scope.arrSpRecords[i].zones.length ; j++) {
						if($scope.arrSpRecords[i].zones[j].zonerole == 1) {
							$scope.spPrimaryZones.push({"id":$scope.arrSpRecords[i].zones[j].id});
							$scope.populateSecondaryZones($scope.arrSpRecords[i].zones[j].id, "onItemSelect");
							primaryZoneId.push($scope.arrSpRecords[i].zones[j].id);
						} else if($scope.arrSpRecords[i].zones[j].zonerole == 2) {
							$scope.spSecondaryZones.push({"id":$scope.arrSpRecords[i].zones[j].id});
							$scope.populatePrimaryZones($scope.arrSpRecords[i].zones[j].id, "onItemSelect");
							secondaryZoneId.push($scope.arrSpRecords[i].zones[j].id);
						}
					}

					for (var k = 0 ; k < primaryZoneId.length ; k++) {
						$scope.populateDisplaySpPrimaryZones(primaryZoneId[k], "onItemSelect");
					}

					for (var k = 0 ; k < secondaryZoneId.length ; k++) {
						$scope.populateDisplaySpSecondaryZones(secondaryZoneId[k], "onItemSelect");
					}

					break;
				}
			}
		}
	};

	$scope.cancelSpRecord = function() {
		$scope.visitedSpDob = false;
		$scope.resetAddNewSpForm();
		$scope.manageSp.showSpForm = false;
		$scope.manageSp.addNewSp = false;
		$scope.manageSp.updateSp = false;
		$scope.spDetails.workCity = $scope.arrSpRecords.cityId;
	};

	$scope.removeZone = function (zone, $index) {
		var errorOccured = false;
		var zoneRemoved = false;
		var temporaryArray = angular.copy($scope.wrkHrsAllSlots);
		var zoneIds = {};

		if (temporaryArray != undefined && temporaryArray.length > 0) {
			for(var i = 0 ; i < temporaryArray.length ; i++) {
				if((temporaryArray[i].selected == true) && (temporaryArray[i].selectZoneIds != undefined) && (temporaryArray[i].selectZoneIds.length > 0)) {
					zoneIds = {};

					for(var j = 0 ; j < temporaryArray[i].selectZoneIds.length ; j++) {
						if ((temporaryArray[i].selectZoneIds[j].sp_zoneid == zone.sp_zoneid) && (temporaryArray[i].selectZoneIds[j].sp_zwtime.start_time == zone.sp_zwtime.start_time) && (temporaryArray[i].selectZoneIds[j].sp_zwtime.end_time == zone.sp_zwtime.end_time)) {
							if ((temporaryArray[i].selected == true) && (temporaryArray[i].selectZoneIds != undefined) && (temporaryArray[i].selectZoneIds.length == 1)) {
								errorOccured = true;
								break;
							} else {
								zoneIds = angular.copy(temporaryArray[i].selectZoneIds);
								zoneIds.splice($index, 1);
								temporaryArray[i].selectZoneIds = angular.copy(zoneIds);
							}
						}
					}
				}
			}
		}

		if (errorOccured) {
			alert("Warning: Cannot remove zone! Selected slot must contain atleast one zone.");
		} else if (!(errorOccured)) {
			$scope.wrkHrsAllSlots = angular.copy(temporaryArray);
		}
	}

	$scope.checkBoxSelected = function (wrkHrSlot, $index) {
		
		if ((wrkHrSlot.selected == true) && (wrkHrSlot.selectZoneIds != undefined) && (wrkHrSlot.selectZoneIds.length > 0) && ($scope.selectZoneIdsArr != undefined) && ($scope.selectZoneIdsArr.length > 0)) {
				
			var temporaryArray = angular.copy($scope.wrkHrsAllSlots);

			var strSlot = temporaryArray[$index].label;
			strSlot = strSlot.replace(/:/g, "");
			var arrSlots = strSlot.split("-");

			var start_time = arrSlots[0].trim();
			var end_time = arrSlots[1].trim();

			for(var index1 = 0 ; index1 < $scope.selectZoneIdsArr.length ; index1++) {
				$scope.selectZoneIdsArr[index1].sp_zwtime.start_time = start_time;
				$scope.selectZoneIdsArr[index1].sp_zwtime.end_time = end_time;
			}

			temporaryArray[$index].selectZoneIds = angular.copy($scope.selectZoneIdsArr);
			$scope.wrkHrsAllSlots = angular.copy(temporaryArray);
		}
	}

	$scope.selectSpChanged = function(spSelected) {
		if(spSelected) {
			$scope.getSpMonthlyAppointmentAvailability();
		} else {
			$scope.getMonthlyAppointmentAvailability($scope.adminNewAppointmentCust.pincodeid, $scope.adminNewAppointmentCust.zone);
			$scope.spInfo = false;
		}
		$scope.adminNewAppointmentCust.aptstarttime = "";
	}

	$scope.isSpNotSet = function() {
		if(($scope.adminNewAppointmentCust.selectSp != undefined && $scope.adminNewAppointmentCust.selectSp == true)) { 
			if(($scope.spNewAppointment.spNames == undefined || $scope.spNewAppointment.spNames == "")) {
				return true;
			}
		}
		return false;
	}

	$scope.initAdminNewAppt = function() {
		if(cache == undefined || cache.cityToIdMap == undefined) {
			$timeout(function() {
				$scope.initAdminNewAppt();
			}, 500);
		} else {
			$scope.getSps(cache.cityToIdMap[$scope.cityName]);
		}
	}

	$scope.setupDashboard = function() {
		$scope.dashboard.today = new Date();
		$scope.dashboard.appointments.total = 0;
		$scope.dashboard.appointments.booked = 0;
		$scope.dashboard.appointments.cancelled = 0;
		$scope.dashboard.appointments.rescheduled = 0;
		$scope.dashboard.unhandledCallMeList = 0;

		var fromDate = new Date();
		fromDate.setHours(0);
	    fromDate.setMinutes(0);
	    fromDate.setSeconds(0);

	    var tillDate = new Date();
		tillDate.setHours(23);
	    tillDate.setMinutes(59);
	    tillDate.setSeconds(59);
		var appointmentCriteria = {
			fromEpoch : parseInt(fromDate.getTime() / 1000),
			tillEpoch : parseInt(tillDate.getTime() / 1000)
		}

		// Fetching the appointments booked today
		adminApi.searchCreateTimeBasedAppointments(appointmentCriteria).
		success(function (data, status, headers, config) {
			$scope.dashboard.appointments.booked = data.payload.length;
		}).
		error(function (data, status, headers, config) {
			console.log("Failed to fetch today's booked appointments!");
		});

		// Fetching the appointments scheduled for today
		adminApi.searchAppointments(appointmentCriteria).
		success(function (data, status, headers, config) {			
			var cancelledAppts = 0;
			var confirmed = 0;
			for(var i=0; i<data.payload.length; i++) {
				if(data.payload[i].appointment.state == "3") {
					cancelledAppts++;
				} else if(data.payload[i].appointment.state == "2" || data.payload[i].appointment.state == "8") {
					confirmed++;
				}
			}
			$scope.dashboard.appointments.cancelled = cancelledAppts;
			$scope.dashboard.appointments.total = confirmed;
		}).
		error(function (data, status, headers, config) {
			console.log("Failed to fetch today's all appointments!");
		});

		// Fetching the appointments Re-scheduled today
		adminApi.searchRescheduledAppointments(appointmentCriteria).
		success(function (data, status, headers, config) {
			$scope.dashboard.appointments.rescheduled = data.payload.length;
		}).
		error(function (data, status, headers, config) {
			console.log("Failed to fetch rescheduled appointments!");
		});

		var curDate = moment(new Date()).format("YYYYMMDD");

		adminApi.callMeList(curDate, curDate)
		.success(function(data, status, headers, config) {
			if(data.error == undefined && data.payload != undefined) {
				var callmeList = 0;
				for(var i=0; i<data.payload.length; i++) {
					if(data.payload[i].type == "yet_to_call") {
						callmeList++;
					}
				}
				$scope.dashboard.unhandledCallMeList = callmeList;
			}
		})
		.error(function(data, status, headers, config) {
			console.log("Failed to fetch Call me list!");
		});
	}

	$scope.initAdmin = function() {
		$scope.setupNotifications();
		$scope.setupDashboard();
	}

	$scope.onWalletTransact = function(transType) {
		if(transType == "debit" && $scope.custReadList.custwallet.amount > $scope.custReadList.custwallet.walletbalance) {
			$scope.custReadList.custwallet.response = {
				status: "error",
				message: "Insufficient balance to withdraw!"
			}
			$timeout(function() {
				delete $scope.custReadList.custwallet.response;
			}, 5000);
			return;
		}

		var data = {
			"walletAmount": $scope.custReadList.custwallet.amount,
			"walletTransType": transType,
			"currency":"INR",
			"description":$scope.custReadList.custwallet.description,
			"createdById":adminApi.getAdminid(),
			"createdByName":adminApi.getAdminname(),
			"apptId":"",
			"city":$scope.custReadList.city,
			"cityId":$scope.custReadList.cityid
		}

		adminApi.walletTransact($scope.custReadList._id, data)
		.success(function(data, status, headers, config) {
			if(data.error == undefined && data.payload != undefined) {
				$scope.custReadList.custwallet = data.payload.custwallet;
				$scope.custReadList.custwallet.response = {
					status: "success",
					message: "Wallet updated successfully!"
				}
				$timeout(function() {
					delete $scope.custReadList.custwallet.response;
				}, 5000);
			}
		})
		.error(function(data, status, headers, config) {
			console.log("Failed to update the wallet transaction!");
			$scope.custReadList.custwallet.response = {
				status: "error",
				message: "Wallet updation failed!"
			}
			$timeout(function() {
				delete $scope.custReadList.custwallet.response;
			}, 5000);
			console.log(data.error);
		});
	}

	$scope.addTimeSlot = function() {
		
		$scope.aptSlotCount = $scope.aptSlotCount + 1;

		if($scope.obj.dt && $scope.spNewAppointment.aptstarttime && $scope.spInfo) {
			var date = moment($scope.obj.dt).format("YYYY-MM-DD");
			var time = "";
			var hr = parseInt($scope.spNewAppointment.aptstarttime.substring(0, 2));
			var aa = "PM";
			if(hr < 12) {
				aa = "AM";
				time = $scope.spNewAppointment.aptstarttime.substring(0, 2) + ":" + 
					$scope.spNewAppointment.aptstarttime.substring(2, 4) + " " + aa;
			} else {
				hr = (hr == 12) ? 12 : (hr - 12);
				if(hr < 10) {
					hr = "0" + hr;
				}
				time = hr + ":" + $scope.spNewAppointment.aptstarttime.substring(2, 4) + " " + aa;
			}
			var slot = date + " " + time;
			if($scope.spNewAppointment.selectedTimeSlots.indexOf(slot) == -1) {
				$scope.spNewAppointment.selectedTimeSlots.push(slot);
			} else {
				alert("Selected Appointment Slot is already added in the list.");
				$scope.aptSlotCount = $scope.aptSlotCount - 1;
			}
		}

		var selectedatetimeslot = moment(new Date($scope.spNewAppointment.selectedTimeSlots)).format("YYYY-MM-DD");
        var selecteddateslot =  moment(selectedatetimeslot, 'YYYY-MM-DD').unix();
        var validtilltimeslot =  moment($scope.packageValidTillDate, 'YYYY-MM-DD').unix();
        
        if(selecteddateslot>validtilltimeslot){
           $scope.costFollowUp = $scope.original_costFollowUp;
        }else{
          	$scope.costFollowUp = $scope.discounted_costFollowUp;
        }

		if($scope.aptSlotCount > 0 && $scope.custLeftPackageSeesion > 0 && $scope.aptSlotCount == $scope.custLeftPackageSeesion){
            $scope.aptSlotFlag = true;
        }else{
            $scope.aptSlotFlag = false;
        }
	}

	$scope.removeTimeSlot = function() {

		$scope.aptSlotCount = $scope.aptSlotCount - 1;
        if($scope.aptSlotCount > 0 && $scope.custLeftPackageSeesion > 0 && $scope.aptSlotCount == $scope.custLeftPackageSeesion){
            $scope.aptSlotFlag = true;
        }else{
            $scope.aptSlotFlag = false;
        }

		var index = -1;
		if($scope.spNewAppointment.selectedSlot) {
			for(var i=0; i<$scope.spNewAppointment.selectedTimeSlots.length; i++) {
				var slot = $scope.spNewAppointment.selectedTimeSlots[i];
				if(slot.date === $scope.spNewAppointment.selectedSlot.date && 
					slot.time === $scope.spNewAppointment.selectedSlot.time) {
					index = i;
					break;
				}
			}
		}
		if(index != -1) {
			$scope.spNewAppointment.selectedTimeSlots.splice(index, 1);
			$scope.spNewAppointment.selectedSlotIndex = -1;
			$scope.spNewAppointment.selectedSlot = null;
		}
	}

	$scope.onPhysioChange = function() {
		$scope.spNewAppointment.selectedTimeSlots = [];
		$scope.spNewAppointment.selectedSlotIndex = -1;
		$scope.spNewAppointment.selectedSlot = null;
	}

	$scope.cancelPrbmData = function() {
		//alert('Hi');
		$scope.prbmName = "";
		$scope.prbmContact = "";
		$scope.prbmEmail = "";
		$scope.prbmAge = "";
		$scope.prbmProblem = "";
		$scope.prbmGender = "";
		$scope.prbmProblem = "";
		$scope.prbmCallback = false;
		$scope.prbmSatisfied = 'NA'; 
		$scope.prmbName_error = undefined;
		$scope.prbmContact_error = undefined;
		$scope.prbmGender_error = undefined;


	}

	$scope.savePrbmData = function() {
		//alert($scope.prbmName);
		//alert($scope.prbmContact);
		//alert($scope.prbmEmail);
		//alert($scope.prbmAge);
		//alert($scope.prbmProblem);
		var name = "";
		var contact = "";
		var email = "";
		var age = "";
		var problem = "";
		var satisfied = 'no';
		var callback = false;
		var gender = "";

		if($scope.prbmName != undefined){
			name = $scope.prbmName;
		}

		if($scope.prbmContact != undefined){
			contact = $scope.prbmContact;
		}	

		if($scope.prbmEmail != undefined){
			email = $scope.prbmEmail;
		}

		if($scope.prbmAge != undefined){
			age = $scope.prbmAge;
		}

		if($scope.prbmProblem != undefined){
			problem = $scope.prbmProblem;
		}

		if($scope.prbmSatisfied != undefined){
			satisfied = $scope.prbmSatisfied;
		}

		if($scope.prbmCallback != undefined){
			if($scope.prbmCallback == true){
				callback = true;
			}else{
				callback = false;
			}
		}else{
			callback = false;
		}

		if($scope.prbmGender != undefined){
			gender = $scope.prbmGender;
		}

		console.log(name);
		console.log(contact);
		console.log(email);
		console.log(age);
		console.log(gender);
		console.log(satisfied);
		console.log(callback);
		console.log(problem);

		var prmbObj = {
			"name": name,
			"contact": contact,
			"email":email,
			"age":age,
			"gender":gender,
			"satisfied":satisfied,
			"callback":callback,
			"problem":problem,
		};

		$scope.validatePRMB();

		if($scope.validPRMB == true){
			adminApi.addPrmbData(prmbObj)
			.success(function(data, status, headers, config) {
				if(data.error == undefined && data.payload != undefined) {
					alert('Record Saved Successfully!');
					$scope.cancelPrbmData();	
				}
			})
			.error(function(data, status, headers, config) {
				console.log("Failed to insert PRMB Record!");
				console.log(data.error);
			});
		}
		

	}

	$scope.validatePRMB = function(){
		$scope.validPRMB = true;
		$scope.prmbName_error = null;
		$scope.prbmContact_error = null;
		$scope.prbmGender_error = null;
		
		if($scope.prbmName == "" || $scope.prbmName == undefined){
			$scope.validPRMB = false;
			$scope.prmbName_error = "Registration name cannot be blank.";
		}

		if($scope.prbmContact == "" || $scope.prbmContact == undefined){
			$scope.validPRMB = false;
			$scope.prbmContact_error = "Registration contact cannot be blank.";
		}

		/*if($scope.prbmEmail == "" && $scope.prbmEmail != undefined){
			$scope.validPRMB = false;
			$scope.prbmEmail = "Registration email cannot be blank.";
		}*/

		if($scope.prbmGender == "" || $scope.prbmGender == undefined){
			$scope.validPRMB = false;
			$scope.prbmGender_error = "Please select gender.";
		}

	}


	$scope.saveServiceProductData = function() {
		/*alert('Hi');
		alert($scope.serviecProductName);
		alert($scope.category);
		alert($scope.serviceProductPrice);*/
		var cityname = "";
		$scope.arrayActiveCity.forEach( function(item){
			if(item._id == $scope.serviceProductCity){
				console.log(item);
				cityname=item.city_name;
			}

		});

		var Obj = {
			"name": $scope.serviecProductName,
			"category": $scope.category,
			"price":$scope.serviceProductPrice,
			"active":true,
			"cityid":$scope.serviceProductCity,
			"city":cityname
		};

		console.log(cityname);

		console.log($scope.serviceProductCity);

		$scope.validateProductsServices();

		if($scope.validServicesProducts == true){
			adminApi.addServicesProducts(Obj)
			.success(function(data, status, headers, config) {
				if(data.error == undefined && data.payload != undefined) {
					alert('Record Saved Successfully!');
					$scope.cancelServiceProductData();	
					$scope.getServicesAndProducts();
				}
			})
			.error(function(data, status, headers, config) {
				console.log("Failed to insert ServiceProduct Record!");
				console.log(data.error);
			});
		}

	}

	$scope.cancelServiceProductData = function() {
		//alert('Hi');
		$scope.serviecProductName = "";
		$scope.category = "";
		$scope.serviceProductPrice = "";
		
		$scope.serviecProductName_error = undefined;
		$scope.category_error = undefined;
		$scope.serviceProductPrice_error = undefined;
		$scope.serviceProductCity_error = undefined;

	}



	$scope.validateProductsServices = function(){
		$scope.validServicesProducts = true;
		$scope.serviecProductName_error = null;
		$scope.prbmContact_error = null;
		$scope.prbmGender_error = null;
		$scope.category_error = null;
		$scope.serviceProductCity_error = null;
		
		if($scope.serviecProductName == "" || $scope.serviecProductName == undefined){
			$scope.validServicesProducts = false;
			$scope.serviecProductName_error = "Name can not be blank.";
		}

		if($scope.category == "" || $scope.category == undefined){
			$scope.validServicesProducts = false;
			$scope.category_error = "Please select category.";
		}

		if($scope.serviceProductCity == "" || $scope.serviceProductCity == undefined){
			$scope.validServicesProducts = false;
			$scope.serviceProductCity_error = "Please select city.";
		}

		if($scope.serviceProductPrice == "" || $scope.serviceProductPrice == undefined){
			$scope.validServicesProducts = false;
			$scope.serviceProductPrice_error = "Price can not be blank.";
		}

	}

	$scope.initAdmin();
});