
angular.module('myApp.controllers')
.controller('CustCtrl', function ($scope, $http, $cookies, ngDialog, $rootScope, $timeout, custApi, Facebook) {
	
	$scope.quickAppointmentForm = {};
	$scope.quickAppointmentPatient = {};
	$scope.appointmentCriteria = {};
	$scope.signUpFbForm = {};
	$scope.signUpFbForm.fbRegistration = "";
	$scope.patientFbSignUp = {};
	$scope.costPaid = "0";

	var availableDate = [];
	$scope.service;
	
	$scope.sort = function(keyname){
		$scope.sortKey = keyname;   //set the sortKey to the param passed
		$scope.reverse = !$scope.reverse; //if true make it false and vice versa
	}

	$scope.quickAppointmentReset = function () {
		$scope.quickAppointmentPatient.city = "";
		$scope.quickAppointmentPatient.name = "";
		$scope.quickAppointmentPatient.email = "";
		$scope.quickAppointmentPatient.phoneNumber = "";
		$scope.quickAppointmentPatient.errorResult = "";
		$scope.quickAppointmentPatient.successResult = "";

		$scope.quickAppointmentForm.patientSignUpForm.$setPristine();
		$scope.quickAppointmentForm.patientSignUpForm.$setUntouched();
	}

	$scope.quickAppointmentSubmit = function() {
		if($scope.quickAppointmentForm.patientSignUpForm.$valid) {
			var dataObj = {
				"custname": $scope.quickAppointmentPatient.name,
				"contactno": $scope.quickAppointmentPatient.phoneNumber,
				"customeremail": $scope.quickAppointmentPatient.email,
				"customercity": $scope.quickAppointmentPatient.city,
			};

			var url = "/healyos-pdt/hrest/v1/cust/callme?apikey=f4205eb9-d441-499d-a045-734c34ccbf7a";
			//var url = "http://localhost:8080/healyos-pdt/hrest/cust/callme?apikey=f4205eb9-d441-499d-a045-734c34ccbf7a";
			//var url = "/api/hrest/cust/callme?apikey=f4205eb9-d441-499d-a045-734c34ccbf7a";

			var result = $http.post(url, dataObj);

			result.success(function(data, status, headers, config) {
				if(data.error == undefined) {
					$scope.quickAppointmentPatient.errorResult = "";
					$scope.quickAppointmentPatient.successResult = data.payload.refno;
				}
			});

			result.error(function(data, status, headers, config) {
				$scope.quickAppointmentPatient.errorResult = data.error.message;
				$scope.quickAppointmentPatient.successResult = "";
			});
		}
	}
	
	$scope.initCustInfo = function() {
		if(($cookies.get('u_email') != undefined)/* && ($cookies.get('u_type') == 1)*/) {
			$scope.custEmail = $cookies.get('u_email');
		} else {
			console.log("Customer email is undefined!");
		}
        
        if(($cookies.get('u_name') != undefined)) {
			$scope.custName = $cookies.get('u_name');
		} else {
			console.log("Customer name is undefined!");
		}
	}
	
	$scope.toggleAdvSrcBox = function() {
		$("#advSrcBox").slideToggle(function() {
			$timeout(function() {
				if($("#advSrcBox").css('display') == "block") {
                    //document.getElementById("firstFocus").focus();
                }
			}, 100);
		});
	}
	
	$('.dateTimePicker').datetimepicker({
		format: 'YYYY-MM-DD hh:mm A'
	});
	
	$scope.clearSearchCriteria = function() {
        $scope.appointmentCriteria.service = "";
	}
	
	
	$scope.initAppointments = function() {
		console.log("initAppointments");
		$scope.sortKey = 'start';
        $scope.reverse = false;
		$(".dateTimePicker").blur(function(ev){
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
        $scope.custSearchAppointments(false);
	}
	
	$scope.ratingFlag = true;
	$scope.custSearchAppointments = function(isAdvancedSearch) {
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
		$scope.appointmentCriteria.customerid = custApi.getCustid();
        if(!isAdvancedSearch) {
            $scope.aptSrcCriteria = "";
        }
        else {
            $scope.aptSrcCriteria = buildCustomerAptSrcCriteria($scope.appointmentCriteria);
        }
		
		var aptList = [];
		custApi.searchAppointments($scope.appointmentCriteria, isAdvancedSearch)
		.success(function(data, status, headers, config) {
			myJsonString = JSON.stringify(data);
			var custSearchApts = JSON.parse(myJsonString);
			console.log("searchAppointments API");
			console.log(custSearchApts);
			//console.log(data.payload.length);
			if (typeof data.payload[0] != 'undefined'){
				for(var i = 0; i < custSearchApts.payload.length; i++) {
					if(custSearchApts.payload[i].appointment.amnt == 0){
						custSearchApts.payload[i].appointment.amnt = "NA";
					}
					
					if(custSearchApts.payload[i].appointment.rating == 0){
						$scope.ratingFlag = false;
						//data.payload.appointments[i].appointment.rating ="-" ;
					}else{
						$scope.ratingFlag = true;
					}
					
					custSearchApts.payload[i].appointment.state = appointmentStateMap[custSearchApts.payload[i].appointment.state];
					var record = angular.copy(custSearchApts.payload[i].appointment);
					record.sdate = moment(new Date(record.starttime * 1000)).format("YYYY-MM-DD hh:mm A")
					aptList.push(record);
				}
				$scope.appointmentsList = aptList;
			}else {
				console.log("payload blank");
				$scope.appointmentsList = "";
			}
		})
		.error(function(data, status, headers, config) {
			$scope.aptErrorMsg = data.error.message;
		});
		
	}
	
	$scope.frm = {};
	
	$scope.divAptAddress = false;
	//$scope.custNewAppointment.check = true;
	$scope.residenceAddressFlag = true;
	
	$('#checkboxAddress').click(function() {
		if( $(this).is(':checked')) {
			$scope.divAptAddress = false;
			$scope.custNewAppointment.check = true;
			$scope.residenceAddressFlag = true;
		} else {
			$scope.divAptAddress = true;
			$scope.custNewAppointment.check = false;
			$scope.residenceAddressFlag = false;
		}
	}); 
	
	$scope.aptSubmit = function() {
		//Get select date textbox value and substring year, month, day
		/*var dateText = $('#datetimepicker3').val();
		dateText = dateText.split('-').join('');
		year = dateText.substring(0,4);
		month = dateText.substring(4,6);
		month = parseInt(month)
		month = month - 1;
		day = dateText.substring(6,8);*/
		var google_conversion_id = "";
        var google_conversion_language = "";
        var google_conversion_format = "";
        var google_conversion_color = "";
        var google_conversion_label = "";
        var google_conversion_value = "";
        var google_conversion_currency = "";
        var google_remarketing_only = "";
		var dateInst = $scope.dt;
		var year = dateInst.getFullYear();
		var month = dateInst.getMonth();
		var day = dateInst.getDate();

		//get selected apt start time  - hour and minute
		var aptst = $scope.custNewAppointment.aptstarttime;
		var apth = aptst.substring(0,2);
		var aptm = aptst.substring(2,4);
		//console.log(apth + " " + aptm);

		//From epoch time
		var fromdate = new Date(year, month, day);
		//fromdate.setHours($scope.mytime.getHours());
		//fromdate.setMinutes($scope.mytime.getMinutes());
		fromdate.setHours(apth);
		fromdate.setMinutes(aptm);
		var myEpochfromtime = fromdate.getTime()/1000.0;
		console.log('From epoch time:' + myEpochfromtime);
		
		//To epoch time
		var todate = new Date(year, month, day);
		//todate.setHours($scope.mytime1.getHours());
		//todate.setMinutes($scope.mytime1.getMinutes());
		todate.setTime(fromdate.getTime() + 90*60*1000);
		var myEpochtotime = todate.getTime()/1000.0;
		console.log('To epoch time:' + myEpochtotime);
		
		var custproblem;
		if($scope.custNewAppointment.Problem == null || $scope.custNewAppointment.Problem == 'undefined'){
			custproblem = "";
		} else if (typeof $scope.custNewAppointment.Problem != 'undefined'){
			custproblem = $scope.custNewAppointment.Problem;
		}else {
			custproblem = "";
		}
		
		var resAddress;
		if($scope.custNewAppointment.appointmentAddress == null || $scope.custNewAppointment.appointmentAddress == 'undefined'){
			resAddress = "";
		} else if (typeof $scope.custNewAppointment.appointmentAddress != 'undefined'){
			resAddress = $scope.custNewAppointment.appointmentAddress;
		} else {
			resAddress = "";
		}
		
		var idObj = $cookies.get('u_id');

		var dataObjSubmitAptForm = {
			"customer":{
				"cityid": $scope.users2.city,
				"name": $scope.users2.name,
				"phone": $scope.users2.contactNo,
				"email": $scope.users2.email,
				"pincode": $scope.custNewAppointment.pincode,
				"address": $scope.custNewAppointment.residenceAddress,
				"problem": custproblem,
				"gender": $scope.custNewAppointment.gender,
				"signMeUp": true
			},
			"starttime": myEpochfromtime,
			"endtime": myEpochtotime,
			"adminid": idObj,
			"comments": $scope.custNewAppointment.comment,
			"zoneid": $scope.custNewAppointment.zone,
			"serviceid": $scope.service,
			"address": $scope.custNewAppointment.residenceAddress, //resAddress, //Updation: Appointment address is set to residence address
			"usecustomeraddress":$scope.custNewAppointment.check,
			"promocodeid": "",
			"promocode": "",
			"disctype": "",
			"discount": "",
			"finalcost": ""
		}

		console.log(dataObjSubmitAptForm);
		custApi.createNewAppointment(dataObjSubmitAptForm)
		.success(function(data, status, headers, config) {
			console.log("createNewAppointment");
			console.log("success");
			var google_conversion_id = 845120495;
            var google_conversion_language = "en";
            var google_conversion_format = "3";
            var google_conversion_color = "ffffff";
            var google_conversion_label = "186DCO__snMQ74f-kgM";
            var google_conversion_value = 599.00;
            var google_conversion_currency = "INR";
            var google_remarketing_only = false;
			$scope.frm.submit = data.payload.refno;
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
			console.log("error response: " + data.error.message);
			$('#errormsg').text("error response: " + data.error.message);
		});
	}
	
	
	/*var d = moment(new Date()).format('YYYY/MM/DD');

	$('#datetimepicker3').datetimepicker({
		format: 'YYYY-MM-DD',
		minDate:d
	});
	
	$('#datetimepicker3').blur(function(){
		$scope.getSpInfo($scope.custNewAppointment.zone, $scope.service, $scope.custNewAppointment.pincode);
	});*/
	
	var initgetServicesObj;
	
	$scope.initCustCities = function() {
		
		$scope.custNewAppointment = {};
		$scope.users2 = {};
		
		$scope.custNewAppointment.check = false;
		var custID = custApi.getCustid();
		var cityx = [];
		/* var problem = [
			{ id:"Knee severe pain",  name:"Knee severe pain"},
			{ id:"spondylosis pain",  name:"spondylosis pain"},
			{ id:"cardiac pain",  name:"cardiac pain"}
		]; */
		var gender = [	
			{ id:"male",  name:"Male"},
			{ id:"female",  name:"Female"}
		];
		
		var custProblem = [];
		custApi.getServices()
		.success(function(data, status, headers, config) {
			console.log("getServices");
			myJsonString = JSON.stringify(data);
			initgetServicesObj = JSON.parse(myJsonString);
			console.log(initgetServicesObj);
			for(var i = 0; i < initgetServicesObj.payload.length; i++) {
				result1 =  initgetServicesObj.payload[i];
				for(var j = 0; j < result1.services.length; j++){
					for(k = 0; k < result1.services[j].problems.length; k++){
						custProblem.push(result1.services[j].problems[k]);
					}
				}
			}
			$scope.customerProblem = custProblem;
			console.log($scope.customerProblem);
		})
		.error(function(data, status, headers, config) {
			console.log("error msg" + data);
		});
		
		
        //initialize default cities dropdown
        var city = [];
        var city1 = [];
        custApi.getCities("India")
        .success(function(data, status, headers, config) {
            console.log("getCities");
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
            console.log($scope.custCities1);
            //$scope.custProblems = problem;
            $scope.custGender = gender;
        })
        .error(function(data, status, headers, config) {
            console.log("error msg" + data);
        });
                
		
		custApi.getFetchCust(custID)
		.success(function(data, status, headers, config) {
			myJsonString = JSON.stringify(data);
			var fetchCustObj = JSON.parse(myJsonString);
			console.log("getFetchCust");
			console.log(fetchCustObj);
			//data.payload.customer = ""; 
			if (typeof data.payload.customer != 'undefined' && data.payload.customer != ""){
                if(data.payload.customer.city != null && data.payload.customer.city != undefined && data.payload.customer.city != ""){
					$scope.users2.disableFlagCity = true;
					var employee = {
						"id": data.payload.customer.cityid,
						"name": data.payload.customer.city 
					}
					cityx.push(employee);
					
					$scope.custCities1 = cityx;
					$scope.users2.city = data.payload.customer.cityid;
				}

				//$scope.customerProblem = problem;

				if(data.payload.customer.name != null && data.payload.customer.name != undefined && data.payload.customer.name != ""){
					$scope.users2.disableFlagName = true;
					$scope.users2.name = data.payload.customer.name;
				}

				if(data.payload.customer.phone != null && data.payload.customer.phone != undefined && data.payload.customer.phone != ""){
					$scope.users2.disableFlagPhone = true;
					$scope.users2.contactNo = data.payload.customer.phone;
				}

				if(data.payload.customer.email != null && data.payload.customer.email != undefined && data.payload.customer.email != ""){
					$scope.users2.disableFlagEmail = true;
					$scope.users2.email = data.payload.customer.email;
				}

				if(data.payload.customer.gender != null && data.payload.customer.gender != undefined && data.payload.customer.gender != ""){
					$scope.users2.disableFlagGender = true;
					$scope.custNewAppointment.gender = data.payload.customer.gender;
				} else {
					$scope.custGender = gender;
				}
			}
		})
		.error(function(data, status, headers, config) {
			console.log("error msg" + data);
		});
	}
	
	$scope.spInfo = false;
	$scope.wtUndefined = false;
	//$scope.canMoveForward = false;

	/* $scope.fnServiceChange = function() {
		if(!$('#datetimepicker3').val() == ""){
			$scope.getSpInfo($scope.custNewAppointment.zone, $scope.custNewAppointment.service, $scope.custNewAppointment.pincode);
		}
	} */
		
	$scope.getSpInfo = function(zoneid, servid, pin) {
		
		/*var serviceDate = $('#datetimepicker3').val();
		var serviceDate = serviceDate.split('-').join('');
		$scope.myVar = serviceDate; */

		var serviceDate = "";
		var dateInst = "";
		var intMonth = 0;
		var monthInst = "";
		var lenMonth = 0;
		var dayObj = "";
		var lenDay = 0;
		var yearObj = 0;

		if($scope.isEditAptMode == true) {
			serviceDate = $('#datetimepicker3').val();
			serviceDate = serviceDate.split('-').join('');
			$scope.myVar = serviceDate;
		} else {
			dateInst = $scope.dt;
			intMonth = dateInst.getMonth() + 1;
			monthInst = intMonth + "";
			lenMonth = monthInst.length;
			console.log("lenMonth: " + lenMonth);
			if(lenMonth != 2 && lenMonth == 1) {
			  monthInst = "0" + monthInst;
			}

			dayObj = dateInst.getDate() + "";
			lenDay = dayObj.length;
			console.log("lenDay: " + lenDay);
			if(lenDay != 2 && lenDay == 1) {
			  dayObj = "0" + dayObj;
			}
			console.log("Day: " + dayObj);

			yearObj = dateInst.getFullYear();
			serviceDate = yearObj + monthInst + dayObj + "";
		}

		custApi.getSpInfo(serviceDate, zoneid, servid, pin)
		.success(function(data, status, headers, config) {
			myJsonString = JSON.stringify(data);
			var getSpInfoObj = JSON.parse(myJsonString);
			console.log("getSpInfo");
			console.log(getSpInfoObj);
			
			var aptFromTime = [];
			var aptToTime = [];
			var space = [];
			var aptst = [];
			
			if (typeof data.payload.appointmentslots[0] != 'undefined'){
				//console.log("yes");
				$scope.spInfo = true; 
				$scope.wtUndefined = false;
				//$scope.canMoveForward = true;

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
				//console.log("no");
				$scope.aptSlotTimeFrom = "";
				$scope.aptSlotTimeTo = "";
				$scope.spaceDash = "";
				$scope.spInfo = false; 
				$scope.wtUndefined = true;
				//$scope.canMoveForward = false;
				$scope.wtUndefinedErrorMsg = "Appointment slots not available";
				$scope.custNewAppointment.aptstarttime = false;
			}
		})
		.error(function(data, status, headers, config) {
			console.log("error msg" + data);
		});
	}

	$scope.today = function() {
		$scope.dt = new Date();
	};
	$scope.today();

	$scope.clear = function () {
		$scope.dt = null;
	};

	//API to get dates of given month:year have atleast one free slot for appointment.
	$scope.getMonthlyAppointmentAvailability = function(pincode, zoneid) {
		/*var dateText = $('#datetimepicker3').val();
		dateText = dateText.split('-').join('');
		yyyymmDate = dateText.substring(0,6);
		console.log("yyyymmDate: " + yyyymmDate);*/

		var arrDateInst = $(".btn.btn-default.btn-sm").eq(1).text().split(' '); // November 2015
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

			var url = "/healyos-pdt/hrest/v1/appt/calmon/" + yyyymmDate + "?apikey=" + apiKeyInst + "&sid=" + sidInst + "&role=" + roleInst + "&pincode=" + pincode + "&zoneid=" + zoneid + "&serviceid=" + $scope.service;

			var result = $http.get(url);

			result.success(function(data, status, headers, config) {
				if(data.error == undefined) {
					jsonStringObj = JSON.stringify(data);
					var monthlyAppointmentAvailabilityObj = JSON.parse(myJsonString);
					console.log("monthlyAppointmentAvailabilityObj: " + monthlyAppointmentAvailabilityObj);
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
						$scope.dt = new Date();
						//$scope.callSpInfo();
						$scope.boolFlag = false;
					} else {
						var dayObj = "";
						var lenDay = 0;
						var temp = new Date();
						if(monthObj == (temp.getMonth() + 1) && arrDateInst[1] == temp.getFullYear()) {
							dayObj = temp.getDate() + "";
							lenDay = dayObj.length;
							console.log("lenDay: " + lenDay);
							if(lenDay != 2 && lenDay == 1) {
							  dayObj = "0" + dayObj;
							}
							console.log("Day: " + dayObj);
						} else {
							dayObj = "01";
						}
						var valMonth = (parseInt(monthObj) - 1);
						var valDay = parseInt(dayObj);
						var valYear = arrDateInst[1];
						$scope.dt = new Date(valYear, valMonth, valDay);
					}
				}
			});

			result.error(function(data, status, headers, config) {
				console.log("Error Message: " + data);
			});
		}
	}

	$scope.callSpInfo = function() {
		$scope.getSpInfo($scope.custNewAppointment.zone, $scope.service, $scope.custNewAppointment.pincode);
	}

	function callGetMonthlyAppointmentAvailability() {
		$scope.getMonthlyAppointmentAvailability($scope.custNewAppointment.pincode, $scope.custNewAppointment.zone);
	}

	// Disable weekend selection
	$scope.disabled = function(date, mode) {
		var monthObj = date.getMonth() + "";
		var lenMonth = monthObj.length;
		console.log("lenMonth: " + lenMonth);
		if(lenMonth != 2 && lenMonth == 1) {
		  monthObj = "0" + monthObj;
		}
		console.log("Month: " + monthObj);

		var dayObj = date.getDate() + "";
		var lenDay = dayObj.length;
		console.log("lenDay: " + lenDay);
		if(lenDay != 2 && lenDay == 1) {
		  dayObj = "0" + dayObj;
		}
		console.log("Day: " + dayObj);

		console.log("date: " + date.getFullYear() + "-" + monthObj + "-" + dayObj);
		var dateInstance = date.getFullYear() + "-" + monthObj + "-" + dayObj;
		console.log("dateInstance: " + dateInstance);

		if(availableDate.indexOf(dateInstance) != -1) {
			return false;
		} else {
			return true;
		}
		//return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ));
	};

	$scope.toggleMin = function() {
		$scope.minDate = $scope.minDate ? null : new Date();
	};

	$scope.toggleMin();
	$scope.maxDate = "";

	$scope.open = function($event) {
		$scope.status.opened = true;
	};

	$scope.setDate = function(year, month, day) {
		$scope.dt = new Date(year, month, day);
	};

	$scope.status = {
		opened: false
	};

	$scope.problemSelected;
	
	$scope.custDetails = true;

	$scope.showNext = function (item){
		$(".btn.btn-default.btn-sm").eq(1).attr("disabled", true);
		$(".btn.btn-default.btn-sm").eq(1).css({"color": "#333"});
		$(".btn.btn-default.btn-sm.pull-left").on( "click", function() {
			console.log( $( this ).text() );
			$scope.spInfo = false;
			$timeout(callGetMonthlyAppointmentAvailability, 100);
		});
		$(".btn.btn-default.btn-sm.pull-right").on( "click", function() {
			console.log( $( this ).text() );
			$scope.spInfo = false;
			callGetMonthlyAppointmentAvailability();
		});
		switch (item) {
			case 'serviceProvider':
				$scope.boolCustFlag = true;
				$scope.custDetails = false;
				$scope.serviceProvider = true;
				$scope.custAddress = false;
				$scope.aptConfirmMsg = false;
				
				/* if(!$scope.custNewAppointment.service){
					//console.log("yes");
						custApi.getServices()
						.success(function(data, status, headers, config) {
							myJsonString = JSON.stringify(data);
							var serviceObj = JSON.parse(myJsonString);
							console.log("getServices");
							console.log(serviceObj);
							var sd = [];
							for(var i = 0; i < serviceObj.payload.length; i++) {
								var result1 =  serviceObj.payload[i];
								for(var j = 0; j < result1.services.length; j++){
									sd.push(result1.services[j]);
								}
							}
							$scope.servicesList = sd;
						})
						.error(function(data, status, headers, config) {
							console.log("error msg" + data);
						});
				} else {
					//console.log("no");
				} */
				
				if($scope.custNewAppointment.Problem != $scope.problemSelected){
					$('#datetimepicker3').val('');
					$scope.spInfo = false;
					$scope.wtUndefined = false;
				
					console.log("yes");
					for(var i = 0; i < initgetServicesObj.payload.length; i++) {
						result1 =  initgetServicesObj.payload[i];
						for(var j = 0; j < result1.services.length; j++){
							for(k = 0; k < result1.services[j].problems.length; k++){
								if($scope.custNewAppointment.Problem == result1.services[j].problems[k]){
									console.log($scope.custNewAppointment.Problem);
									console.log(result1.services[j].servicename);
									console.log(result1.services[j].id);
									$scope.service = result1.services[j].id;
									$scope.problemSelected = result1.services[j].problems[k]
								}
							}
						}
					}
				}
				
				break;
			case 'custAddress':
				$scope.boolCustFlag = false;
				$scope.custDetails = false;
				$scope.serviceProvider = false;
				$scope.custAddress = true;
				//console.log($scope.custNewAppointment.aptstarttime);
				$scope.aptConfirmMsg = false;
				break;
			case 'aptConfirmMsg':
				$scope.boolCustFlag = false;
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
				$scope.boolCustFlag = false;
				$scope.custDetails = true;
				$scope.custAddress = false;
				$scope.serviceProvider = false;
				break;
			case 'serviceProvider':
				$scope.boolCustFlag = true;
				$scope.custDetails = false;
				$scope.serviceProvider = true;
				$scope.custAddress = false;
				break;
		}
	}
	
	$scope.hideEditAptMode = function() {
		$scope.isEditAptMode = false;
	}
	
	$scope.custAptDetails = function(appointment) {
		$scope.costPaid = "0";
		console.log(appointment._id);
		$scope.editAptId = appointment.refno;
		custApi.getAppointmentDetails(appointment._id)
        .success(function(data, status, headers, config){
			$scope.isEditAptMode = true;
				
				$scope.custNewAppointment = data.payload;
				$scope.custNewAppointment.appointment.state = appointmentStateMap[$scope.custNewAppointment.appointment.state];

				if ($scope.custNewAppointment.payment != undefined && $scope.custNewAppointment.payment != "") {
					if ($scope.custNewAppointment.payment.amnt != undefined && $scope.custNewAppointment.payment.amnt != "") {
						$scope.costPaid = $scope.custNewAppointment.payment.amnt;
					}
				}

				$scope.fetchedAppointment = true;
				$scope.fetchAptErrorMsg = "";
				console.log($scope.custNewAppointment);

        })
        .error(function(data, status, headers, config){
			console.log("Error (fetchAppointment)-");
            $scope.fetchAptErrorMsg = data.error.message;
            $scope.fetchedAppointment = false;
            $scope.custNewAppointment = {};
        })
	}
	
	$scope.initCache = function() {
		custApi.getServices()
			.success(function(data, status, headers, config){
				$scope.servicesList = buildServicesList(data.payload);
			})
			.error(function(data, status, headers, config){
				$scope.aptErrorMsg = "Failed to fetch services as part of init.";
			})
	}
	
    
    /**
     * Start Customer registration and facebook sign up and sign in
     */
    $scope.initBirthDate = function () {
        var d = moment(new Date()).format('YYYY/MM/DD');
        $('#datetimepicker4').datetimepicker({
            format: 'YYYY-MM-DD',
            maxDate: d
        });
    }

    $scope.custPin = function (cityid) {

        var zones = [];
        var pincode = [];

        custApi.getZones(cityid)
                .success(function (data, status, headers, config) {
                    myJsonString = JSON.stringify(data);
                    var custpinobj = JSON.parse(myJsonString);

                    for (var i = 0; i < custpinobj.payload.length; i++) {
                        var result1 = custpinobj.payload[i];
                        zones.push(custpinobj.payload[i]);
                        var zonId = result1.zoneid;
                        var zoneObj = {};
                        zoneObj[zonId] = [];

                        for (var j = 0; j < result1.pincodes.length; j++) {
                            var result2 = result1.pincodes[j];
                            if(!hasInList(pincode, result1.pincodes[j], "pin")) {
                                pincode.push(result1.pincodes[j]);
                            }
                        }
                    }

                    $scope.custZones = zones;
                    $scope.custPinLocalities = pincode;

                    $scope.flag = true;
                    $scope.flag1 = true;

                    $scope.filterPin = function (aa) {
//                        if ($scope.flag1) {
//                            $scope.flag = false;
                            a1 = [];
                            for (var i = 0; i < custpinobj.payload.length; i++) {
                                var resulta = custpinobj.payload[i];
                                for (var j = 0; j < resulta.pincodes.length; j++) {
                                    var resultb = resulta.pincodes[j];
                                    if (resulta.zoneid == aa) {
                                        a1.push(resulta.pincodes[j]);
                                    }
                                }
                            }
                            $scope.custPinLocalities = a1;
//                        }
                    }

                    $scope.filterArea = function (bb) {
//                        if ($scope.flag) {
//                            $scope.flag1 = false;
                            var b1 = [];
                            for (var i = 0; i < custpinobj.payload.length; i++) {
                                var resulta = custpinobj.payload[i];
                                for (var j = 0; j < resulta.pincodes.length; j++) {
                                    var resultb = resulta.pincodes[j];
                                    if (resulta.pincodes[j].pin == bb) {
                                        b1.push(resulta);
                                    }
                                }
                            }
                            $scope.custZones = b1;
//                        }
                    }
                })
                .error(function (data, status, headers, config) {
                    console.log("error msg" + data);
                });
    }
    /**
     * End Customer registration and facebook sign up and sign in
     */
    
    /**
     * Start Customer register and facebook login
     */
    
    $scope.signUpForm = {};
    $scope.patientSignUp = {};
    
    /**
     * Function to reset fields of patient register form
     */
    $scope.signUpFormReset = function () {
        $scope.patientSignUp.name = "";
        $scope.patientSignUp.gender = "";
        $scope.patientSignUp.email = "";
        $scope.patientSignUp.password = "";
        $scope.patientSignUp.confirmPassword = "";
        $scope.patientSignUp.address = "";
        $scope.patientSignUp.country = "";
        $scope.patientSignUp.state = "";
        $scope.patientSignUp.city = "";
        $scope.patientSignUp.pincode = "";
        $scope.patientSignUp.phoneNumber = "";
        $scope.patientSignUp.residenceNumber = "";
        $scope.patientSignUp.birthdate = "";
        $scope.patientSignupError = "";
        $scope.patientSignupSuccess = "";
        $scope.signUpForm.patientSignupForm.$setPristine();
        $scope.signUpForm.patientSignupForm.$setUntouched();
    }

    /**
     * Function to hide and show the simple register and facebook register form
     */
    $scope.clientRegister = function (item) {

        switch (item) {
            case 'linkDivOne':
                $scope.linkDivOne = true;
                $scope.linkDivTwo = false;
                $scope.selected = item;
                break;

            case 'linkDivTwo':
                $scope.linkDivOne = false;
                $scope.linkDivTwo = true;
                $scope.selected = item;
                break;
        }
    }
    $scope.isActiveLink = function (linkName) {
        return linkName == $scope.selected;
    }
    
    /**
     * Customer signup submit 
     */
    $scope.patientSignupFormSubmit = function () {
        if ($scope.signUpForm.patientSignupForm.$valid) {
            var bdate = $('#datetimepicker4').val();
            bdate = bdate.split('-').join('');
            var dataObj = {
                "name": $scope.patientSignUp.name,
                "gender": $scope.patientSignUp.gender,
                "email": $scope.patientSignUp.email,
                "password": $scope.patientSignUp.password,
                "address": $scope.patientSignUp.address,
                "country": $scope.patientSignUp.country,
                "state": $scope.patientSignUp.state,
                "cityid": $scope.patientSignUp.city,
                "pincode": $scope.patientSignUp.pincode,
                "phone": $scope.patientSignUp.phoneNumber,
                "altphno": $scope.patientSignUp.residenceNumber,
                "birthdate": bdate
            };

            var result = custApi.getRegisterUrl(dataObj);

            result.success(function (data, status, headers, config) {
                $scope.clientRegister("linkDivTwo");
                //$scope.linkDivTwo = false;
                $scope.patientSignUpSuccess = data.payload.customer.email;
                $scope.patientSignupError = "";
            });

            result.error(function (data, status, headers, config) {
                $scope.patientSignupError = data.error.message;
                $scope.patientSignUpSuccess = "";
            });
        }
    }

    /**
     * Customer facebook signup
     */
    $scope.patientFacebookSignup = function () {
		if ($scope.user.id) {
			if($scope.user.email == undefined || $scope.user.email == "" || $scope.user.birthday == undefined || $scope.user.birthday == "" || $scope.user.phone == undefined || $scope.user.phone == "") {
				if(($scope.user.phone == undefined || $scope.user.phone == "") && ($scope.user.birthday == undefined || $scope.user.birthday == "") && ($scope.user.email == undefined || $scope.user.email == "")) {
					ngDialog.openConfirm({
						template: 'fbRegistrationInfo1',
						scope: $scope //Pass the scope object if you need to access in the template
					}).then(
						function(value) {
							console.log("fbRegistrationInfo: Success Dialog!");

							var user_bDate = $('#datetimepicker8').val();
							console.log("user_bDate: " +  user_bDate);

							if(user_bDate == undefined || user_bDate == "") {
								ngDialog.open({ template: '<div style = "color: red" class="ngdialog-message"> Registration failed! Please select valid birth date.</div>',
												plain: 'true'
								});
								$scope.logout();
							} else {
								var myDate = new Date(user_bDate); // Your timezone!
								console.log("myDate:" + myDate);

								var minimumDate = new Date(1900, 00, 01); // Mon Jan 01 1900 00:00:00 GMT+0530 (IST)
								console.log("minimumDate:" + minimumDate);
								var maximumDate = new Date(); // current date
								console.log("maximumDate:" + maximumDate);

								if(myDate.getTime() < minimumDate.getTime() || myDate.getTime() > maximumDate.getTime()) {
									ngDialog.open({ template: '<div style = "color: red" class="ngdialog-message"> Registration failed! Please select valid birth date.</div>',
													plain: 'true'
									});
									$scope.logout();
								} else {
									console.log("patientFbSignUp.phoneNumber: " + $scope.patientFbSignUp.phoneNumber);
									console.log("patientFbSignUp.patientBirthDate: " + user_bDate);
									console.log("patientFbSignUp.email: " + $scope.patientFbSignUp.email);

									var birthDate = user_bDate.split('-').join('');

									var dataObj = {
										"name": $scope.user.name,
										"socialsitetype":1,
										"socialsiteid": $scope.user.id,
										"email": $scope.patientFbSignUp.email,
										"gender": $scope.user.gender,
										"birthdate": birthDate,
										"phone": $scope.patientFbSignUp.phoneNumber,
										"accesstoken": $scope.accesstoken
									};
									console.log("dataObj: " + dataObj);

									var result = custApi.getRegisterUrl(dataObj);
									result.success(function (data, status, headers, config) {
										$scope.patientSignupError = "";
										$scope.patientSignupSuccess = "";
										$scope.patientFacebookSignIn();
									});

									result.error(function (data, status, headers, config) {
										$scope.fbSignUpError(data);
									});
								}
							}
						},
						function(value) {
							//Cancel or do nothing
							console.log("Error Dialog!");

							/*ngDialog.open({template: '<div style = "color: red" class="ngdialog-message"> Registration failed!</div>',
								plain: 'true'
							});*/
							console.log("In btnCancel");

							$scope.logout();
						}
					);
				} else if(($scope.user.phone == undefined || $scope.user.phone == "") && ($scope.user.birthday == undefined || $scope.user.birthday == "")) {
					ngDialog.openConfirm({
						template: 'fbRegistrationInfo2',
						scope: $scope //Pass the scope object if you need to access in the template
					}).then(
						function(value) {
							console.log("fbRegistrationInfo: Success Dialog!");

							var user_bDate = $('#datetimepicker8').val();
							console.log("user_bDate: " +  user_bDate);

							if(user_bDate == undefined || user_bDate == "") {
								ngDialog.open({ template: '<div style = "color: red" class="ngdialog-message"> Registration failed! Please select valid birth date.</div>',
												plain: 'true'
								});
								$scope.logout();
							} else {
								var myDate = new Date(user_bDate); // Your timezone!
								console.log("myDate:" + myDate + " = " + myDate.getTime());

								var minimumDate = new Date(1900, 00, 01); // Mon Jan 01 1900 00:00:00 GMT+0530 (IST)
								console.log("minimumDate:" + minimumDate + " = " + minimumDate.getTime());
								var maximumDate = new Date(); // current date
								console.log("maximumDate:" + maximumDate + " = " + maximumDate.getTime());

								if(myDate.getTime() < minimumDate.getTime() || myDate.getTime() > maximumDate.getTime()) {
									ngDialog.open({ template: '<div style = "color: red" class="ngdialog-message"> Registration failed! Please select valid birth date.</div>',
													plain: 'true'
									});
									$scope.logout();
								} else {
									console.log("patientFbSignUp.phoneNumber: " + $scope.patientFbSignUp.phoneNumber);
									console.log("patientFbSignUp.patientBirthDate: " + user_bDate);

									var birthDate = user_bDate.split('-').join('');

									var dataObj = {
										"name": $scope.user.name,
										"socialsitetype":1,
										"socialsiteid": $scope.user.id,
										"email": $scope.user.email,
										"gender": $scope.user.gender,
										"birthdate": birthDate,
										"phone": $scope.patientFbSignUp.phoneNumber,
										"accesstoken": $scope.accesstoken
									};
									console.log("dataObj: " + dataObj);

									var result = custApi.getRegisterUrl(dataObj);
									result.success(function (data, status, headers, config) {
										$scope.patientSignupError = "";
										$scope.patientSignupSuccess = "";
										$scope.patientFacebookSignIn();
									});

									result.error(function (data, status, headers, config) {
										$scope.fbSignUpError(data);
									});
								}
							}
						},
						function(value) {
							//Cancel or do nothing
							console.log("Error Dialog!");

							/*ngDialog.open({template: '<div style = "color: red" class="ngdialog-message"> Registration failed!</div>',
								plain: 'true'
							});*/
							console.log("In btnCancel");

							$scope.logout();
						}
					);
				} else if(($scope.user.phone == undefined || $scope.user.phone == "") && ($scope.user.email == undefined || $scope.user.email == "")) {
					ngDialog.openConfirm({
						template: 'fbRegistrationInfo3',
						scope: $scope //Pass the scope object if you need to access in the template
					}).then(
						function(value) {
							console.log("fbRegistrationInfo: Success Dialog!");

							console.log("patientFbSignUp.phoneNumber: " + $scope.patientFbSignUp.phoneNumber);
							console.log("patientFbSignUp.email: " + $scope.patientFbSignUp.email);

							var bDate = $scope.user.birthday + "";
							bDate = bDate.split('/').join('');

							var month = bDate.substring(0,2);
							var day = bDate.substring(2,4);
							var year = bDate.substring(4);
							var birthDate = year + month + day;
							console.log("birthDate: " + birthDate);

							var dataObj = {
								"name": $scope.user.name,
								"socialsitetype":1,
								"socialsiteid": $scope.user.id,
								"email": $scope.patientFbSignUp.email,
								"gender": $scope.user.gender,
								"birthdate": birthDate,
								"phone": $scope.patientFbSignUp.phoneNumber,
								"accesstoken": $scope.accesstoken
							};
							console.log("dataObj: " + dataObj);

							var result = custApi.getRegisterUrl(dataObj);
							result.success(function (data, status, headers, config) {
								$scope.patientSignupError = "";
								$scope.patientSignupSuccess = "";
								$scope.patientFacebookSignIn();
							});

							result.error(function (data, status, headers, config) {
								$scope.fbSignUpError(data);
							});
						},
						function(value) {
							//Cancel or do nothing
							console.log("Error Dialog!");

							/*ngDialog.open({template: '<div style = "color: red" class="ngdialog-message"> Registration failed!</div>',
								plain: 'true'
							});*/
							console.log("In btnCancel");

							$scope.logout();
						}
					);
				} else if($scope.user.phone == undefined || $scope.user.phone == "") {
					ngDialog.openConfirm({
						template: 'fbRegistrationInfo4',
						scope: $scope //Pass the scope object if you need to access in the template
					}).then(
						function(value) {
							console.log("fbRegistrationInfo: Success Dialog!");
							console.log("patientFbSignUp.phoneNumber: " + $scope.patientFbSignUp.phoneNumber);

							var bDate = $scope.user.birthday + "";
							bDate = bDate.split('/').join('');

							var month = bDate.substring(0,2);
							var day = bDate.substring(2,4);
							var year = bDate.substring(4);
							var birthDate = year + month + day;
							console.log("birthDate: " + birthDate);

							var dataObj = {
								"name": $scope.user.name,
								"socialsitetype":1,
								"socialsiteid": $scope.user.id,
								"email": $scope.user.email,
								"gender": $scope.user.gender,
								"birthdate": birthDate,
								"phone": $scope.patientFbSignUp.phoneNumber,
								"accesstoken": $scope.accesstoken
							};
							console.log("dataObj: " + dataObj);

							var result = custApi.getRegisterUrl(dataObj);
							result.success(function (data, status, headers, config) {
								$scope.patientSignupError = "";
								$scope.patientSignupSuccess = "";
								$scope.patientFacebookSignIn();
							});

							result.error(function (data, status, headers, config) {
								$scope.fbSignUpError(data);
							});
						},
						function(value) {
							//Cancel or do nothing
							console.log("Error Dialog!");

							/*ngDialog.open({template: '<div style = "color: red" class="ngdialog-message"> Registration failed!</div>',
								plain: 'true'
							});*/
							console.log("In btnCancel");

							$scope.logout();
						}
					);
				}
			}
        }
    }
    
     /**
     * Customer facebook login 
     */
    $scope.patientFacebookSignIn = function () {
        if ($scope.user.id) {
            var dataObj = {
                "socialsitetype":1,
                "username": $scope.user.id,
                "accesstoken": $scope.accesstoken,
            };

            var url = custApi.getLoginUrl();
            var result = $http.post(url, dataObj);
            $scope.fbSignIn(result);
        }
    }
    
     /** 
      * Start Facebook login 
      */
     
      // Define user empty data
      $scope.user = {};
           
      /**
       * Watch for Facebook to be ready.
       * There's also the event that could be used
       */
      $scope.$watch(
        function() {
          return Facebook.isReady();
        },
        function(newVal) {
          if (newVal)
            $scope.facebookReady = true;
        }
      );
      
      $scope.userIsConnected = false;
      
      /**
       * Check if user is logged in to facebook
       */
      Facebook.getLoginStatus(function(response) {
        if (response.status == 'connected') {
          $scope.userIsConnected = true;
          $scope.accesstoken = response.authResponse.accessToken;
        }
      });
      
      /**
       * IntentLogin
       */
      $scope.IntentLogin = function(flag) {
        if(!$scope.userIsConnected) {
          $scope.login(flag);
        }else{
          $scope.fbState(flag);
        }
      };
      
      /**
       * Login
       */
		$scope.login = function(flag) {
			Facebook.login(function(response) {
			if (response.status == 'connected') {
				$scope.fbState(flag);
			}
			},{scope: 'email,user_birthday'});
		};
       
       /**
       * custom function 
       */
       $scope.fbState = function(flag) {
            $scope.me();

			$timeout(function(){
				if($scope.user.id){
					console.log("$scope.user.name: " + $scope.user.name);
					console.log("$scope.user.id: " + $scope.user.id);
					console.log("$scope.user.email: " + $scope.user.email);
					console.log("$scope.user.gender: " + $scope.user.gender);
					console.log("$scope.user.birthday: " + $scope.user.birthday);
				}

				if(flag=='signUp'){
					$scope.patientFacebookSignup();
				}else{
					$scope.patientFacebookSignIn();
				}
			}, 1000);
       }
       
       /**
        * me: get logged in user details
        */
        $scope.me = function() {
          	//Facebook.api('/me?fields=id,name,email,birthday,about,hometown,education', function(response) {
          	//FB.api('/me', { locale: 'en_US', fields: 'name, email, gender, user_birthday' }, function(response) {
        	Facebook.api('/me?fields=id,name,gender,email,birthday', function(response) {
          		console.log("response.name: " + response.name);
				console.log("response.email: " + response.email);
              	if (response && !response.error) {
                	$scope.user = response;
              	}
          	});
        };
      
      /**
       * Logout facebook user from facebook
       */
      $scope.logout = function() {
        Facebook.logout(function() {
            $scope.user   = {};
          });
      }
      
      /**
       * Taking approach of Events :D
       */
      $scope.$on('Facebook:statusChange', function(ev, data) {
        if (data.status == 'connected') {
            $scope.$apply(function(){
              $scope.me();
              $scope.accesstoken = data.authResponse.accessToken;
            });
        } else {
              //$scope.user   = {};
        }        
      });
      /* End Facebook login */
    
    /**
     * End Customer register and facebook login
    */
   
 });