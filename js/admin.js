
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
	
	$scope.promoStoreObj = {};
	$scope.promocodeResponse = {
		promocodeValid: '',
		promocodeErrorMessage: ''
	};

	$scope.aptPayment = {		
		currency : "INR",
		type : "Cash",
		amnt : "0",
		paymentModes: [],
		appointmentid : "",
		promocodeid: "",
		promocode: "",
		discount: "",
		finalcost: ""
	};
	$scope.spRequestType = {
		1 : "Cancel",
		2 : "Reschedule"
	};
	$scope.currencies = ["INR"];
	$scope.paymentModes = ["Cash", "Wallet"];
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
	$scope.arrayLocalities = [];
	$scope.customerLocality = '';
	$scope.adminNewAppointmentCust.zone = "";
	$scope.adminNewAppointmentCust.selectSp = false;

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

	$scope.spPrimaryZonesOptions = [];
	$scope.spPrimaryZones = [];
	$scope.customFilter1 = "";
	$scope.spPrimaryZonesSettings = {
		enableSearch: true,
		displayProp: 'zonename',
		idProp: 'zoneid'
	};

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
	$scope.wrkHrsAllSlots = [
		{
			"selected": false,
			"label": 	"07:30 - 09:00",
			"selectZoneIds": []
		},
		{
			"selected": false,
			"label": 	"09:00 - 10:30",
			"selectZoneIds": []
		},
		{
			"selected": false,
			"label": 	"10:30 - 12:00",
			"selectZoneIds": []
		},
		{
			"selected": false,
			"label": 	"12:00 - 13:30",
			"selectZoneIds": []
		},
		{
			"selected": false,
			"label": 	"15:00 - 16:30",
			"selectZoneIds": []
		},
		{
			"selected": false,
			"label": 	"16:30 - 18:00",
			"selectZoneIds": []
		},
		{
			"selected": false,
			"label": 	"18:00 - 19:30",
			"selectZoneIds": []
		},
		{
			"selected": false,
			"label": 	"19:30 - 21:00",
			"selectZoneIds": []
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
				"signMeUp": true
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
            "additionalchargedesc":$scope.adminNewAppointmentCust.addchargedesc
		}

		if($scope.users1.uuid != undefined && $scope.users1.uuid != "") {
			dataObjSubmitAptForm.callmeitemid = $scope.users1.uuid;
		}

		if($scope.adminNewAppointmentCust.selectSp == true && $scope.spNewAppointment.spNames && $scope.spNewAppointment.spNames != "") {
			dataObjSubmitAptForm.spid = $scope.spNewAppointment.spNames;
		}
        if ($scope.adminNewAppointmentCust.addcharges == null || $scope.adminNewAppointmentCust.addcharges == undefined){
            console.log("setting additional charge 0");
            dataObjSubmitAptForm.additionalcharge = 0;
        }
		adminApi.createNewAppointment(dataObjSubmitAptForm)
		.success(function(data, status, headers, config) {
			$scope.frm.submit = data.payload[0].refno;
			$scope.showNext('aptConfirmMsg');
		})
		.error(function(data, status, headers, config) {
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

	$scope.fncustSearch = function() {
		var items = $scope.custSearch;
		$scope.custSearchList = false;
		$scope.aptErrorMsg = false;

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
					appointmentHistory.push(data.payload.appointments[i].appointment);
				}
			} else {
				console.log("error");
			}
			$scope.custAptHistory = appointmentHistory;
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
				"signMeUp": true
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
			"promocode": $scope.applyPromoResponseFollowUp.promocode,
            "additionalcharge":$scope.spNewAppointment.addcharges,
            "additionalchargedesc":$scope.spNewAppointment.addchargedesc
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
				$scope.frm.submit = "Thank you for confirming appointment. Appointment reference number is " + refnos[0];
			} else {
				$scope.frm.submit = "Thank you for confirming appointments. Appointment reference numbers are " + refnos.join(", ");
			}
			$scope.spNewApptForCustErrorMsg = "";
			$scope.showDatepicker = false;
			$scope.showAddressComments = false;
		})
		.error(function(data, status, headers, config) {
			// $scope.showDatepicker = false;
			// $scope.showAddressComments = false;
			$scope.spNewApptForCustErrorMsg = data.error.message;
			$scope.checkSessionTimeout(data);
		});
	}

	$scope.getSpMonthlyAppointmentAvailability = function() {
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

			var url = "/healyos-pdt/hrest/v1/appt/calmon/" + yyyymmDate + "?apikey=" + apiKeyInst + "&sid=" + sidInst + "&role=" + roleInst + "&pincode=" + pincode + "&zoneid=" + zoneid + "&serviceid=" + serviceId + "&spid=" + $scope.obj.followupSpid; //b24abc5e-ac43-86d4-5a83-aa1807fde79b";

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
				$scope.costFollowUp = data.payload.appointment.cost;
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
		var yyyymmDate = "";
		var arrDateInst = [];
		var monthObj = "";
		var yr = 0;

		arrDateInst = $(".btn.btn-default.btn-sm").eq(1).text().split(' '); // November 2015
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
			var url = "/healyos-pdt/hrest/v1/appt/calmon/" + yyyymmDate + "?apikey=" + apiKeyInst + "&sid=" + sidInst + "&role=" + roleInst + "&pincode=" + pincode + "&zoneid=" + zoneid + "&serviceid=" + $scope.service;

			if($scope.activeTab == "New Appointment") {
				if($scope.adminNewAppointmentCust.selectSp == true && $scope.spNewAppointment.spNames != undefined && $scope.spNewAppointment.spNames != "") {
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

			var url = "/healyos-pdt/hrest/v1/appt/calmon/" + yyyymmDate + "?apikey=" + apiKeyInst + "&sid=" + sidInst + "&role=" + roleInst + "&pincode=" + pincode + "&zoneid=" + zoneid + "&serviceid=" + serviceid;

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
			console.log( $( this ).text() );
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
				if($scope.adminNewAppointmentCust.selectSp == true && $scope.spNewAppointment.spNames != undefined && $scope.spNewAppointment.spNames != "") {
					$scope.getSpInfo($scope.adminNewAppointmentCust.zone, $scope.service, pincodeid, $scope.spNewAppointment.spNames);
				} else {
					$scope.getSpInfo($scope.adminNewAppointmentCust.zone, $scope.service, pincodeid);
				}
			} else {
				$scope.getSpInfo($scope.adminNewAppointmentCust.zone, $scope.service, pincodeid, spid);
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

		adminApi.getZones(cityid)
		.success(function(data, status, headers, config) {
			myJsonString = JSON.stringify(data);
			var custpinobj = JSON.parse(myJsonString);
			
			for(var i = 0; i < custpinobj.payload.length; i++) {
				var result1 =  custpinobj.payload[i];
				zones.push(custpinobj.payload[i]);
				var zonId = result1.zoneid;
				var zoneObj = {};
				zoneObj[zonId] = [];

				for(var j = 0; j < result1.pincodes.length; j++){
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

		adminApi.getSpInfo(serviceDate, zoneid, servid, pin, spid)
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
	
	$scope.custDetails = true;
	$scope.showNext = function (item){
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
								}
							}
						}
					}
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

		if(($scope.adminNewAppointmentCust.pincode != $scope.pincodeSelectedAvailable) ||
			($scope.adminNewAppointmentCust.Problem != $scope.problemSelectedAvailable)) {
			$scope.pincodeSelectedAvailable = $scope.adminNewAppointmentCust.pincode;
			$scope.problemSelectedAvailable = $scope.adminNewAppointmentCust.Problem;
			pincode = cache.pincodeToPincodeIdMap[pincode];
			$scope.getMonthlyAppointmentAvailability(pincode, zoneid);
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
				}
			}
			catch(err) {
			}
			
		}
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
			$scope.zoneCountry.push({id: data.payload.id, name: data.payload.name});
			$scope.zoneCountry.id = data.payload.id;
			$scope.zoneCountry.name = data.payload.name;
			$scope.zoneCountrySelected = $scope.zoneCountry[0].id;

			data.payload.states.forEach(function(item) {
				$scope.zoneState.push({id: item.id, name: item.name});

				item.cities.forEach(function(item) {
					$scope.zoneCity.push({id: item.id, name: item.name});
				});
			});
			$scope.zoneState.id = data.payload.states[0].id;
			$scope.zoneState.name = data.payload.states[0].name;
			$scope.zoneStateSelected = $scope.zoneState[0].id;

			$scope.zoneCity.id = data.payload.states[0].cities[0].id;
			$scope.zoneCity.name = data.payload.states[0].cities[0].name;
			$scope.zoneCitySelected = $scope.zoneCity[0].id;

			cache.cityToIdMap = buildCitiesToIdMap(data.payload);
			cache.cityIdToNameMap = buildCitiesIdToNameMap(data.payload);
			cache.cityIdToStateMap = buildCityIdToStateMap(data.payload);

			adminApi.getZones(cache.cityToIdMap["Pune"])
			.success(function(data, status, headers, config){
				$rootScope.zonesList = buildZonesList(data.payload);
				cache.zoneIdToNameMap = buildZoneIdToNameMap(data.payload);
				cache.pincodeIdToPincodeNameMap = buildPincodeIdToPincodeNameMap(data.payload);
				cache.pincodeToPincodeIdMap = buildPincodeToPincodeIdMap(data.payload);
				$scope.initAddNewSp();
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
				$scope.actionableApptsList.push(obj);
			}
			$scope.actionableAppts.count = $scope.actionableApptsList.length;
		})
		.error(function(data, status, headers, config){
			$scope.aptErrorMsg = data.error.message;
			$scope.checkSessionTimeout(data);
		});
	}

	$scope.searchActionableAppts();

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

			if ($scope.adminNewAppointmentCust.payment != undefined && $scope.adminNewAppointmentCust.payment != "") {
				if ($scope.adminNewAppointmentCust.payment.amnt != undefined && $scope.adminNewAppointmentCust.payment.amnt != "") {
					$scope.costPaid = $scope.adminNewAppointmentCust.payment.amnt;
				} else {
					$scope.costPaid = 0;
				}
			} else {
				$scope.costPaid = 0;
			}
		})
		.error(function(data, status, headers, config){
			$scope.aptErrorMsg = data.error.message;
			$scope.checkSessionTimeout(data);
		});
		$scope.manageDocumentationCollapse();
		$scope.resetPaymentDetails();
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
            "additionalchargedesc":$scope.editAptModel.addchargedesc
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
		var res = confirm("This will cancel the appointment.\nDo you want to continue?");
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
		}
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
					amount: $scope.aptPayment.amnt
				});
			}

			$scope.aptPayment.amnt = 0;
		}
	}

	$scope.removePaymentMode = function() {		
		if($scope.aptPayment.selectedMode) {
			var index = -1;
			for(var i=0; i<$scope.aptPayment.paymentModes.length; i++) {
				var mode = $scope.aptPayment.paymentModes[i];
				if(mode.type === $scope.aptPayment.selectedMode.type) {
					index = i;
					break;
				}
			}
			if(index != -1) {
				$scope.aptPayment.paymentModes.splice(index, 1);
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

		var data = {
			appointmentid: $scope.aptPayment.appointmentid,
			promocodeid: $scope.aptPayment.promocodeid,
			promocode: $scope.aptPayment.promocode,
			paymentmodes: $scope.aptPayment.paymentModes
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
			$scope.aptPayment.amnt = "0";
			$scope.aptPayment.type = "Cash";
			$scope.aptPayment.paymentModes = [];
			$scope.aptPayment.selectedMode = null;
			$scope.aptPayment.selectedModeIndex = -1;

			$scope.fetchAppointment($scope.adminNewAppointmentCust.appointment._id);

			$scope.searchAppointments(true);
		})
		.error(function(data, status, headers, config){
			$scope.apptPaymentErrorMsg = data.error.message;
			$scope.checkSessionTimeout(data);
		})
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
		$scope.aptPayment.type = "Cash";
		$scope.aptPayment.paymentModes = [];
		$scope.aptPayment.selectedMode = null;
		$scope.aptPayment.selectedModeIndex = -1;
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
		if(selectedTab == "Add Edit Service Provider") {
			$scope.spManagementSelectedTab = "Add Edit Service Provider";
		} else if (selectedTab == "Set Working Hours") {
			$scope.spManagementSelectedTab = "Set Working Hours";
		} else if (selectedTab == "Mark Leaves") {
			$scope.spManagementSelectedTab = "Mark Leaves";
		}
	}

	$scope.initAddNewSp = function() {
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
	}

	$scope.populatePrimaryZones = function (item, eventName) {
		if (eventName == "onItemSelect" && item != undefined) {
			$scope.spPrimaryZonesOptions = angular.copy($rootScope.zonesList);

			// Remove secondary zone selected items from primary zones
			for(var i = 0 ; i < $scope.spPrimaryZonesOptions.length ; i++) {
				for(var j = 0 ; j < $scope.spSecondaryZones.length ; j++) {
					if($scope.spPrimaryZonesOptions[i].zoneid == $scope.spSecondaryZones[j].id) {
						$scope.spPrimaryZonesOptions.splice(i, 1);
					}
				}
			}
		} else if (eventName == "onItemDeselect" && item != undefined) {
			$scope.spPrimaryZonesOptions = angular.copy($rootScope.zonesList);

			for(var i = 0 ; i < $scope.spPrimaryZonesOptions.length ; i++) {
				for(var j = 0 ; j < $scope.spSecondaryZones.length ; j++) {
					if($scope.spPrimaryZonesOptions[i].zoneid == $scope.spSecondaryZones[j].id) {
						$scope.spPrimaryZonesOptions.splice(i, 1);
					}
				}
			}
		} else if (eventName == "onSelectAll" && item == undefined) {
			$scope.spPrimaryZonesOptions = angular.copy($rootScope.zonesList);

			// Remove secondary zone selected items from primary zones
			for(var i = 0 ; i < $scope.spPrimaryZonesOptions.length ; i++) {
				for(var j = 0 ; j < $scope.spSecondaryZones.length ; j++) {
					if($scope.spPrimaryZonesOptions[i].zoneid == $scope.spSecondaryZones[j].id) {
						$scope.spPrimaryZonesOptions.splice(i, 1);
					}
				}
			}
		} else if (eventName == "onDeselectAll" && item == undefined) {
			$scope.spPrimaryZonesOptions = angular.copy($rootScope.zonesList);
		}
	}

	$scope.populateSecondaryZones = function (item, eventName) {
		if (eventName == "onItemSelect" && item != undefined) {
			$scope.spSecondaryZonesOptions = angular.copy($rootScope.zonesList);

			// Remove primary zone selected items from secondary zones
			for(var i = 0 ; i < $scope.spSecondaryZonesOptions.length ; i++) {
				for(var j = 0 ; j < $scope.spPrimaryZones.length ; j++) {
					if($scope.spSecondaryZonesOptions[i].zoneid == $scope.spPrimaryZones[j].id) {
						$scope.spSecondaryZonesOptions.splice(i, 1);
					}
				}
			}
		} else if (eventName == "onItemDeselect" && item != undefined) {
			$scope.spSecondaryZonesOptions = angular.copy($rootScope.zonesList);

			// Remove primary zone selected items from secondary zones
			for(var i = 0 ; i < $scope.spSecondaryZonesOptions.length ; i++) {
				for(var j = 0 ; j < $scope.spPrimaryZones.length ; j++) {
					if($scope.spSecondaryZonesOptions[i].zoneid == $scope.spPrimaryZones[j].id) {
						$scope.spSecondaryZonesOptions.splice(i, 1);
					}
				}
			}
		} else if (eventName == "onSelectAll" && item == undefined) {
			$scope.spSecondaryZonesOptions = angular.copy($rootScope.zonesList);

			// Remove primary zone selected items from secondary zones
			for(var i = 0 ; i < $scope.spSecondaryZonesOptions.length ; i++) {
				for(var j = 0 ; j < $scope.spPrimaryZones.length ; j++) {
					if($scope.spSecondaryZonesOptions[i].zoneid == $scope.spPrimaryZones[j].id) {
						$scope.spSecondaryZonesOptions.splice(i, 1);
					}
				}
			}
		} else if (eventName == "onDeselectAll" && item == undefined) {
			$scope.spSecondaryZonesOptions = angular.copy($rootScope.zonesList);
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

		var spDetailsObj = {
			"sp_servingCityId": $scope.spDetails.workCity,
			"sp_name": $scope.spDetails.spName,
			"sp_qualification": $scope.spDetails.qualification,
			"sp_email": $scope.spDetails.spEmail,
			"sp_alternateEmail": sp_alternateEmail,
			"sp_address": $scope.spDetails.spAddress,
			"sp_pincode": $scope.spDetails.spPincode,
			"sp_city": $scope.spDetails.spCity,
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

		var spDetailsObj = {
			"sp_servingCityId": $scope.spDetails.workCity,
			"sp_name": $scope.spDetails.spName,
			"sp_qualification": $scope.spDetails.qualification,
			"sp_email": $scope.spDetails.spEmail,
			"sp_alternateEmail": sp_alternateEmail,
			"sp_address": $scope.spDetails.spAddress,
			"sp_pincode": $scope.spDetails.spPincode,
			"sp_city": $scope.spDetails.spCity,
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

			if((dateObjIndex.getDay() != 0) && (dateObjIndex.getDay() >= 1 && dateObjIndex.getDay() <= 6)) {
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

	$scope.selectAllDaysExceptSunday = function () {
		$('#datetimepicker9').multiDatesPicker('removeDates', arrayDates);

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
			if((dateObjIndex.getDay() != 0) && (dateObjIndex.getDay() >= 1 && dateObjIndex.getDay() <= 6)) {
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

		$('#datetimepicker9').multiDatesPicker('addDates', arrayDates);
	}

	$scope.initDatePicker = function () {
		$scope.initSelectAllDaysExceptSunday();

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
					}, 50);
				}
			});
		}, 100);
	}

	$scope.resetDatePicker9 = function () {
		$('#datetimepicker9').multiDatesPicker('destroy');
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

	$scope.spChangeAddSpWrkHoursResetValues = function (spId) {
		$timeout(function() {
			$scope.wrkHrsAllSlots = [
				{
					"selected": false,
					"label": 	"07:30 - 09:00",
					"selectZoneIds": []
				},
				{
					"selected": false,
					"label": 	"09:00 - 10:30",
					"selectZoneIds": []
				},
				{
					"selected": false,
					"label": 	"10:30 - 12:00",
					"selectZoneIds": []
				},
				{
					"selected": false,
					"label": 	"12:00 - 13:30",
					"selectZoneIds": []
				},
				{
					"selected": false,
					"label": 	"15:00 - 16:30",
					"selectZoneIds": []
				},
				{
					"selected": false,
					"label": 	"16:30 - 18:00",
					"selectZoneIds": []
				},
				{
					"selected": false,
					"label": 	"18:00 - 19:30",
					"selectZoneIds": []
				},
				{
					"selected": false,
					"label": 	"19:30 - 21:00",
					"selectZoneIds": []
				}
			];

			$scope.selectZoneIdsArr = [];
			for(var i = 0 ; i < $scope.arrSpRecords.length ; i++) {
				if ((spId != undefined) && (spId != null) && (spId.length > 0) && (spId == $scope.arrSpRecords[i]._id)) {
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
				}
			}

			$scope.wrkHrErrorSlot = false;
			$scope.SpWrkHrs = {};
			$scope.addSpWrkHrsForm.adminFormForSp.$setPristine();
			$scope.addSpWrkHrsForm.adminFormForSp.$setUntouched();

			$scope.SpWrkHrs.spNamesId = spId;
			$scope.addSpWrkHrsForm.adminFormForSp.spNamesId.$setDirty();
		}, 50);
	}

	$scope.resetAddSpWrkHrsForm = function () {
		$scope.SpWrkHrs = {};
		$scope.addSpWrkHrsForm.adminFormForSp.$setPristine();
		$scope.addSpWrkHrsForm.adminFormForSp.$setUntouched();

		$scope.wrkHrsAllSlots = [
			{
				"selected": false,
				"label": 	"07:30 - 09:00",
				"selectZoneIds": []
			},
			{
				"selected": false,
				"label": 	"09:00 - 10:30",
				"selectZoneIds": []
			},
			{
				"selected": false,
				"label": 	"10:30 - 12:00",
				"selectZoneIds": []
			},
			{
				"selected": false,
				"label": 	"12:00 - 13:30",
				"selectZoneIds": []
			},
			{
				"selected": false,
				"label": 	"15:00 - 16:30",
				"selectZoneIds": []
			},
			{
				"selected": false,
				"label": 	"16:30 - 18:00",
				"selectZoneIds": []
			},
			{
				"selected": false,
				"label": 	"18:00 - 19:30",
				"selectZoneIds": []
			},
			{
				"selected": false,
				"label": 	"19:30 - 21:00",
				"selectZoneIds": []
			}
		];

		$scope.wrkHrErrorSlot = false;
		$scope.arrWTime = [];
		$scope.dispArrWTime = [];
		$scope.showWTime = false;
	}

	$scope.resetAddSpWrkHrsWebPage = function() {
		$timeout(function() {
			$scope.resetAddSpWrkHrsForm();
			$scope.resetDatePicker9();
			$scope.dateErrorFlag = false;
			$scope.wrkHrErrorSlot = false;
		}, 50);
	}

	$scope.addSpWorkHours = function () {
		$scope.dateErrorFlag = false;
		var wrkDates = [];
		var selectedSlots = [];
		var zoneWorkingTime = [];

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

		if ($scope.wrkHrsAllSlots != undefined && $scope.wrkHrsAllSlots.length > 0) {
			for(var i = 0 ; i < $scope.wrkHrsAllSlots.length ; i++) {
				if($scope.wrkHrsAllSlots[i].selected == true) {
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
				}

			}
		} else if (selectedSlots != undefined && selectedSlots.length < 1) {
			$scope.wrkHrErrorSlot = true;
		}

		// removing duplicate zone ids
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

		if (!($scope.dateErrorFlag)) {
			var dataObj = {
				"sp_id": $scope.SpWrkHrs.spNamesId,
				"sp_workingDate": wrkDates,
				"sp_workTime": selectedSlots,
				"spZoneAllocatedWTime": finalZoneWorkingTime
			};

			adminApi.addSpWrkHrs(dataObj)
			.success(function(data, status, headers, config) {
				alert("Physio's work hours inserted successfully!");
				$scope.resetAddSpWrkHrsForm();
				$scope.resetDatePicker9();
				$scope.dateErrorFlag = false;
				$scope.wrkHrErrorSlot = false;
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
		var dateVal = $('#datePicker9Value').val();
		if(dateVal != undefined && dateVal != '') {
			var arrDates = $('#datePicker9Value').val().split(",");
			var arrayDt = [];
			for(var i = 0 ; i < arrDates.length ; i++) {
				var strDate = arrDates[i].trim();
				arrayDt.push(strDate);
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
			if((dateObjIndex.getDay() != 0) && (dateObjIndex.getDay() >= 1 && dateObjIndex.getDay() <= 6)) {
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
					} else {
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

	$scope.populateBusySlotsTable1 = function () {
		$scope.arrWTime = [];
		$scope.dispArrWTime = [];
		$scope.showWTime = false;

		var sp_Id = $scope.SpWrkHrs.spNamesId;
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

			var dataObj = {
				"sp_id" : sp_Id,
				"sp_workingDate": arrDates
			};

			adminApi.getSpMonthlyWtimeAndOffSlots(dataObj)
			.success(function(data, status, headers, config) {
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
					} else {
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
		}

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

		// total work time
		for(var i = 0 ; i < $scope.wrkHrsAllSlots.length ; i++) {
			var wrkSlot = {};
			wrkSlot.start_time = "0000";
			wrkSlot.end_time = "0000";
			selectedSlots.push(wrkSlot);
		}

		if (!($scope.dateErrorFlag)) {
			var dataObj = {
				"sp_id": $scope.SpWrkHrs.spNamesId,
				"sp_workingDate": wrkDates,
				"sp_workTime": selectedSlots,
				"spZoneAllocatedWTime": finalZoneWorkingTime
			};

			adminApi.addSpWrkHrs(dataObj)
			.success(function(data, status, headers, config) {
				$scope.populateBusySlotsTable1();
				$scope.deSelectAllWrkDates();
				alert("Physio's work hours cleared successfully!");
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
				"discount":	"",
				"disctype": "2",
				"noofappt": 1,
				action: "edit",
				"promoNameError": false,
				"promodescError": false,
				"validFromError": false,
				"validTillError": false,
				"discountError": false,
				"discTypeError": false,
				"isRecValid": false,
				"noofapptRequired": false,
				"isNewPromo": true
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
				"discount":	rec.discount,
				"disctype":	rec.disctype,
				"noofappt": rec.noofappt
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
				adminApi.updatePromoCode(obj, rec._id).
				success(function(data, status, headers, config) {
					console.log("Promo code updated successfully!");
					rec.createdon = data.payload.createdon;
					rec.isNewPromo = false;
					rec.validFromReadonly = data.payload.validfrom*1000;
					rec.validTillReadonly = data.payload.validtill*1000;
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

		if(rec.noofappt == undefined || rec.noofappt == "" || rec.noofappt == 0) {
			rec.noofapptRequired = true;
		} else {
			var num = -1;
			try {
				num = parseInt(rec.noofappt);
			} catch(err) {
				rec.noofapptRequired = true;
			}
			if(isNaN(rec.noofappt) || num < 1 || num > 90) {
				rec.noofapptRequired = true;
			}else {
				rec.noofapptRequired = false;
			}
		}

		if(rec.promoNameError == false && 
			rec.promodescError == false && 
			rec.validFromError == false &&
			rec.validTillError == false &&
			rec.discountError == false &&
			rec.noofapptRequired == false &&
			rec.discTypeError == false) {
			rec.isRecValid = true;
			return true;
		} else { rec.isRecValid = false; rec.action = 'edit'; return false; }
	};

	/* Function to edit promocode. It copies the value the existing obj. */
	$scope.editPromoCode = function(rec, index) {
		var obj = {};
		angular.copy(rec, obj);
		$scope.promoStoreObj[obj._id] = obj;
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
			"serviceid": $scope.service
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
        $scope.aptPayment.type = "Cash";
        $scope.aptPayment.amnt = "0";
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

		var dataObj = {
			"promocode": $scope.aptPayment.promocode,
			"apptid": "",
			"pincode": $scope.editAptModel.pincodeid,
			"cityid": $scope.adminNewAppointmentCust.appointment.cityid,
			"custname": $scope.adminNewAppointmentCust.customer.name,
			"problem": $scope.editAptModel.problem,
			"apptslots": [apptslot],
			"serviceid": $scope.editAptModel.service
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
		if(($scope.adminNewAppointmentCust.appointment != undefined) && ($scope.adminNewAppointmentCust.appointment.promocode != undefined) && ($scope.adminNewAppointmentCust.appointment.promocode.trim().length > 0)) {
			if(($scope.adminNewAppointmentCust.appointment.finalcost != undefined) && ($scope.adminNewAppointmentCust.appointment.finalcost >= 0)) {
				return true;
			}
		}

		return false;
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
		"action" : "edit",
		"isNewZone"	: true,
		"isZoneNameError" : false,
		"isZoneRecValid" : false
	};	
	/* Function to Add new Zone */
	$scope.zoneMgmt.addNewZone = function(action, rec, index) {
		$scope.zoneMgmt.zoneIndex;
		if(action == 'addnew') {
			$scope.zoneMgmt.temppojo = {};
			angular.copy($scope.zoneMgmt.emptyZoneArr, $scope.zoneMgmt.temppojo);
			$scope.zoneMgmt.addNewZoneSection = true;
			$scope.zoneMgmt.editZoneSection = false;
		}

		if(action == 'editZone') {
			$scope.zoneMgmt.temppojo = {};
			$scope.zoneMgmt.zoneIndex = index;
			$scope.zoneMgmt.zoneRecord = rec;
			/*copy the record to be editted to temppojo*/
			angular.copy(rec, $scope.zoneMgmt.temppojo);
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
	};

	/* Function to validate zone pin and area name */
	var validateZone = function(rec) {
		var isPinError = false; 
		var isLocalityError = false;
		if(!rec.zonename || !(/^[a-zA-Z-. ]*$/).test(rec.zonename)) {
			$scope.zoneMgmt.temppojo.isZoneNameError = true;
		} else { $scope.zoneMgmt.temppojo.isZoneNameError = false; }
		
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
			isLocalityError == false) {
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
					var pincodeObj = { "pin": item.pin, "localities": item.localities };
					if(item.pincodeid) {
						pincodeObj.pincodeid = item.pincodeid;
					}				
					pinarray.push(pincodeObj);
				}
			});
			var obj = {
			    "zonename": rec.zonename,
			    "countryid": $scope.zoneCountry.id,
			    "country": $scope.zoneCountry.name,
			    "stateid": $scope.zoneState.id,
			    "state": $scope.zoneState.name,
			    "cityid": $scope.zoneCity.id,
			    "city": $scope.zoneCity.name,
			    "pincodes": pinarray
			};
			if(rec._id == null || rec._id == "" || rec._id == undefined) {
				adminApi.addNewZone(obj).
				success(function (data, status, headers, config) {
					console.log("Successfully created new zone");
					data.payload.isNewZone = false;
					$scope.zoneMgmt.arrZone.push(data.payload);
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

					$scope.spDetails.spName = $scope.arrSpRecords[i].name;
					$scope.spDetails.qualification = $scope.arrSpRecords[i].qualification;
					$scope.spDetails.spEmail = $scope.arrSpRecords[i].email;
					$scope.spDetails.spAlternateEmail = $scope.arrSpRecords[i].alternateemail;
					$scope.spDetails.spAddress = $scope.arrSpRecords[i].address;
					$scope.spDetails.spPincode = $scope.arrSpRecords[i].pincode;
					$scope.spDetails.spCity = $scope.arrSpRecords[i].city;
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
			"currency":"INR"
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
			}
		}
	}

	$scope.removeTimeSlot = function() {
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

	$scope.initAdmin();
});