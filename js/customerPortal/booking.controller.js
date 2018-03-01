app.controller('bookingController', bookingController);
bookingController.$inject = ['$timeout', '$http', 'custApi', '$cookies', '$scope', '$state', 'custportalGetSetService'];

function bookingController($timeout, $http, custApi, $cookies, $scope, $state, custportalGetSetService) {
	var vm = this;
	window.scrollTo(0, 0);

	vm.optionStyle = {
	    background: '#D6CFC4',
	    border: '1px solid #f2f2f2'
	}
	vm.method = {
		initBooking1screen: initBooking1screen,
		getAllLocations: getAllLocations,
		locationSelected: locationSelected,
		checktimeslot: checktimeslot,
		navigateToBooking2: navigateToBooking2,
		navigateBackToBooking1: navigateBackToBooking1,
		getlocation: getlocation,
		bookNewAppointment: bookNewAppointment,
		checkOtherProblem: checkOtherProblem,
		navigateToHome: navigateToHome,
		applyPromoCode: applyPromoCode,
		changeTimeSlot: changeTimeSlot,
		loadConversionScript: loadConversionScript
	};

	vm.svgMethod = {
		problemSelected: problemSelected
	};

	var localmethods = {
		initDatePicker: initDatePicker,
		getServicesList: getServicesList
	};

	var displayCurrentLocation= displayCurrentLocation;
	var displayError= displayError;
	var getAddressFromLatLang= getAddressFromLatLang;
	
	vm.flags = {
		custInfoFormSubmitted: false,
		showErrorForCustInfoForm: false,
		showErrorForFirstName: false,
		showErrorForLastName: false,
		showErrorForMobile: false,
		showErrorForGender: false,
		showErrorForEmail:false,
		bookingErrorContainer: false,
		selectProblemError: false,
		innerPageBookNowError: false,
		confirmAppointmentError:false,
		datesNotAvailable: false,
		promocodeValid: ''
	};
	
	vm.model = {
		locationArr: [],
		selectedLocation: {},
		acRefresh: false,
		fromMonthDate: '',
		physiotherapyId: '',
		timeslotArray: [],
		timeslot: '',
		fromDate: '',
		problemName: '',
		otherProblem: '',
		appointmentRefNumber: '',
		selectedDate: '',
		bookingErrorMessageContainer: '',
		apptCost: '',
		promocodeResultMessage: '',
		clinic_id: '',
		clinicPrice: '',
		clinicAddress: '',
		clinicName:'',
		
	};


	
	var localVariables = {
		bookNowobj: {},
		selectedItem: '',
		selectedProblemId: '',
		cityId: ''
	};

	vm.custInfoFormFields = {
		hasAccount: false,
		address: '',
		signup: true
	};

	vm.promoobj = {
		promocode: '',
		promocodeid: '',
		finalcost: '',
		discount: ''
	};
	vm.problemNameVar = "";

	vm.problemSelectedVar = "";

	$scope.locationArray = [];

	/*$scope.$watch(function watchOtherProblem(scope) {
		return (vm.model.otherProblem);
		},
		function handleOther(newvalue, oldValue) {
			if(vm.model.otherProblem != '') {
				if(localVariables.selectedItem != '') {
					localVariables.selectedItem.href.baseVal = "./images/customer_portal/circle.png";
					vm.model.problemName = vm.model.otherProblem;
				} else if(localVariables.selectedItem == '') {
					vm.model.problemName = vm.model.otherProblem;
				}			
			}
		}
	);*/

	function checkOtherProblem() {
		if(vm.model.otherProblem == '' && localVariables.selectedItem == '') {
			vm.model.problemName = '';
		}
		if(vm.model.otherProblem != '') {
			if(localVariables.selectedItem != '') {
				localVariables.selectedItem.href.baseVal = "./images/customer_portal/circle.png";
				localVariables.selectedItem = '';
				vm.model.problemName = vm.model.otherProblem;
			} else if(localVariables.selectedItem == '') {
				vm.model.problemName = vm.model.otherProblem;
			}			
		}
	}

	/*
	* Function for initialization
	*/
	function initBooking1screen() {
		/*$scope.$parent.cpc.checkHomeDataFilled();*/
		/*populate location array*/

		vm.model.locationArr = custportalGetSetService.getLocalityObj();
		$scope.locationArray =  custportalGetSetService.getLocalityObj();

		
		/*populate book now info*/
		localVariables.bookNowobj = custportalGetSetService.getBooknowObj();
		if(localVariables.bookNowobj != undefined) {
			console.log(localVariables.bookNowobj);
			vm.model.apptCost = localVariables.bookNowobj.apptCost;
			vm.model.selectedLocation = localVariables.bookNowobj.location;
			vm.model.timeslotArray = localVariables.bookNowobj.timeslotArray;
			vm.model.timeslot = localVariables.bookNowobj.timeslot;
			//vm.model.fromDate = localVariables.bookNowobj.date.format('YYYYMMDD');
			vm.model.fromDate = moment().format('YYYYMMDD');
			localVariables.cityId = localVariables.bookNowobj.cityid;
			//vm.model.selectedDate = localVariables.bookNowobj.date;
			vm.model.clinic_id = localVariables.bookNowobj.clinic_id;

			vm.model.clinicPrice = localVariables.bookNowobj.apptCost;
			vm.model.clinicAddress = localVariables.bookNowobj.clinic_address;
			vm.model.clinicName = localVariables.bookNowobj.clinic_name;

            //set clinic address as appointment address in case of clinic appointment booking:kalyani patil
			if(vm.model.clinic_id != undefined){
				vm.custInfoFormFields.address = vm.model.clinicAddress;
			}

			
			setTimeout(function() { // let the above script run, then replace doc.write
	            $('#booking1-dt').val(moment().format('DD-MM-YYYY'));

	        }, 100)

			
		}
		if(localVariables.bookNowobj != undefined) {
			localmethods.getServicesList();
			localmethods.initDatePicker();
		}
	}
	/*
	* Function for initialization for datepicker
	*/
	function initDatePicker() {
		if($('#booking1-dt').length != 1) {
			$timeout(localmethods.initDatePicker, 50);
			//console.log("inside datepicker");
			return;
		}
		$('#booking1-dt').datetimepicker({
			defaultDate: localVariables.bookNowobj.date,
			format: 'DD-MM-YYYY'
		});

		/*set array of enabled dates*/
		//vm.model.fromMonthDate = moment(new Date()).format("YYYYMM");
		//vm.model.fromMonthDate = localVariables.bookNowobj.date.format('YYYYMM');
		vm.model.fromMonthDate = moment().format('YYYYMM');
		$("#booking1-dt").data("DateTimePicker").enabledDates(localVariables.bookNowobj.datesEnabled);

		/* Event called when month is changed */

		if(vm.model.clinic_id == undefined){

			$("#booking1-dt").on("dp.update", function (e) {
	        	vm.model.selectedDate = e.date;
	        	vm.model.fromMonthDate = e.viewDate.format("YYYYMM");
	        	if(vm.model.selectedLocation != 'Choose Location') {
	        		custApi.checkAvailableDatesInMonth(3, vm.model.fromMonthDate, vm.model.selectedLocation.pincodeid, vm.model.selectedLocation.zoneid, vm.model.physiotherapyId).
					success(function (data, status, header, config) {
						console.log("Available dates retrieved successfully");
						
						/* Enabling available dates */
						var i=0;
						var enableDatesArray = [];
						var yr='';
						var month='';
						var day='';
						var date='';
						data.payload.dates.forEach(function(p) {
							yr = p.substring(0,4);
							month = p.substring(4,6);
							day = p.substring(6,8);
							date = yr + '/' + month + '/' + day;
							enableDatesArray.push(new Date(date));
						});				
						/*$("#booking1-dt").data("DateTimePicker").enabledDates(enableDatesArray);*/
						if(enableDatesArray.length != 0) {
							$("#booking1-dt").data("DateTimePicker").enabledDates(enableDatesArray);
							vm.flags.datesNotAvailable = false;
							vm.flags.bookingErrorContainer = vm.flags.datesNotAvailable;
						} else {
							vm.flags.datesNotAvailable = true;
							vm.flags.bookingErrorContainer = vm.flags.datesNotAvailable;
							vm.model.bookingErrorMessageContainer = 'Dates not Available for currently selected Location';
							$timeout(function () { vm.flags.bookingErrorContainer = false; vm.flags.datesNotAvailable = false}, 5000);
							$("#booking1-dt").data("DateTimePicker").enabledDates([new Date('1970/1/1')]);
						}
					}).
					error(function (data, status, header, config) {
						console.log("Error in retrieving available dates");
					});
	        	}
	        	vm.promoobj.promocode='';
				vm.promoobj.promocodeid='';
				vm.promoobj.finalcost='';
				vm.promoobj.discount='';
				vm.model.apptCost = localVariables.bookNowobj.apptCost;
				vm.custInfoFormFields.promocode='';
	        });
			
	        /*
	        * Event called when date is changed 
	        */
	        $("#booking1-dt").on("dp.change", function (e) {
	        	vm.model.fromDate = e.date.format("YYYYMMDD");
	        	vm.model.selectedDate = e.date;
	        	/* For available date retrieve 'available time' slots */
	        	if(vm.model.selectedLocation != 'Choose Location') {
	        		custApi.fetchAvailableSlotsForDay(vm.model.fromDate, vm.model.selectedLocation.zoneid, vm.model.physiotherapyId, vm.model.selectedLocation.pincodeid).
	            	success(function (data, status, header, config) {
	            		console.log("Available slots retrieved successfully");
	            		console.log("Slots:");
	            		console.log(data);
	            		vm.model.timeslotArray = [];
	            		
	            		var selectedDate = $('#booking1-dt').val();
	            		var currentDate = moment().format('DD-MM-YYYY');
	            		/* format time slot into hr:min am/pm */
	            		data.payload.appointmentslots.forEach(function(item) {
	            			var hours = item.st.substring(0,2);
	            			var mins = item.st.substring(2,4);
	            			var period = "";
							if(hours > 12) {
								hours = hours - 12;
								period = "PM";
							} else if(hours < 12) {
								period = "AM";
							} else if(hours == 12) {
								period = "PM";
							}
	            			var timeformat = hours + ":" + mins + " " + period;
	            			
	            			if(selectedDate == currentDate){
	            				var currentHour = moment().format('h');
	            				var tempHour =  parseInt(currentHour) + 3;
	            				if(parseInt(hours) > parseInt(tempHour)){
	            					vm.model.timeslotArray.push({starttime: timeformat});
	            				}
	            				
	            			}else{
	            				vm.model.timeslotArray.push({starttime: timeformat});
	            			}

	            		});

	            		
	            	}).
	            	error(function (data, status, header, config) {
	            		console.log("Error in retrieving available slots");
	            	});
	        	}
	        	vm.promoobj.promocode='';
				vm.promoobj.promocodeid='';
				vm.promoobj.finalcost='';
				vm.promoobj.discount='';
				vm.model.apptCost = localVariables.bookNowobj.apptCost; 
				vm.custInfoFormFields.promocode='';
	        });

		}else{

			$("#booking1-dt").on("dp.update", function (e) {
        	vm.model.selectedDate = e.date;
        	vm.model.fromMonthDate = e.viewDate.format("YYYYMM");
        	if(vm.model.selectedLocation != 'Choose Location') {
	        		custApi.checkAvailableDatesInMonthClinic(3, vm.model.fromMonthDate, vm.model.clinic_id, vm.model.physiotherapyId).
					success(function (data, status, header, config) {
						console.log("Available dates retrieved successfully");
						
						/* Enabling available dates */
						var i=0;
						var enableDatesArray = [];
						var yr='';
						var month='';
						var day='';
						var date='';
						data.payload.dates.forEach(function(p) {
							yr = p.substring(0,4);
							month = p.substring(4,6);
							day = p.substring(6,8);
							date = yr + '/' + month + '/' + day;
							enableDatesArray.push(new Date(date));
						});				
						/*$("#booking1-dt").data("DateTimePicker").enabledDates(enableDatesArray);*/
						if(enableDatesArray.length != 0) {
							$("#booking1-dt").data("DateTimePicker").enabledDates(enableDatesArray);
							vm.flags.datesNotAvailable = false;
							vm.flags.bookingErrorContainer = vm.flags.datesNotAvailable;
						} else {
							vm.flags.datesNotAvailable = true;
							vm.flags.bookingErrorContainer = vm.flags.datesNotAvailable;
							vm.model.bookingErrorMessageContainer = 'Dates not Available for currently selected Location';
							$timeout(function () { vm.flags.bookingErrorContainer = false; vm.flags.datesNotAvailable = false}, 5000);
							$("#booking1-dt").data("DateTimePicker").enabledDates([new Date('1970/1/1')]);
						}
					}).
					error(function (data, status, header, config) {
						console.log("Error in retrieving available dates");
					});
	        	}
	        	vm.promoobj.promocode='';
				vm.promoobj.promocodeid='';
				vm.promoobj.finalcost='';
				vm.promoobj.discount='';
				vm.model.apptCost = localVariables.bookNowobj.apptCost;
				vm.custInfoFormFields.promocode='';
	        });

	        /*
	        * Event called when date is changed 
	        */
	        $("#booking1-dt").on("dp.change", function (e) {
	        	vm.model.fromDate = e.date.format("YYYYMMDD");
	        	vm.model.selectedDate = e.date;
	        	/* For available date retrieve 'available time' slots */
	        	if(vm.model.selectedLocation != 'Choose Location') {
	        		custApi.fetchAvailableSlotsForDayClinic(vm.model.fromDate, vm.model.clinic_id, vm.model.physiotherapyId).
	            	success(function (data, status, header, config) {
	            		console.log("Available slots retrieved successfully");
	            		console.log("Slots:");
	            		console.log(data);
	            		vm.model.timeslotArray = [];

	            		var selectedDate = $('#booking1-dt').val();
	            		var currentDate = moment().format('DD-MM-YYYY');
	            		/* format time slot into hr:min am/pm */
	            		data.payload.appointmentslots.forEach(function(item) {
	            			var hours = item.st.substring(0,2);
	            			var mins = item.st.substring(2,4);
	            			var period = "";
							if(hours > 12) {
								hours = hours - 12;
								period = "PM";
							} else if(hours < 12) {
								period = "AM";
							} else if(hours == 12) {
								period = "PM";
							}
	            			var timeformat = hours + ":" + mins + " " + period;
	            			
	            			if(selectedDate == currentDate){
	            				var currentHour = moment().format('h');
	            				var tempHour =  parseInt(currentHour) + 3;
	            				if(parseInt(hours) > parseInt(tempHour)){
	            					vm.model.timeslotArray.push({starttime: timeformat});
	            				}
	            			}else{
	            				vm.model.timeslotArray.push({starttime: timeformat});
	            			}

	            		});


	            		
	            	}).
	            	error(function (data, status, header, config) {
	            		console.log("Error in retrieving available slots");
	            	});
	        	}
	        	vm.promoobj.promocode='';
				vm.promoobj.promocodeid='';
				vm.promoobj.finalcost='';
				vm.promoobj.discount='';
				vm.model.apptCost = localVariables.bookNowobj.apptCost; 
				vm.custInfoFormFields.promocode='';
	        });

		}
        
	}

	function changeTimeSlot() {
		vm.promoobj.promocode='';
		vm.promoobj.promocodeid='';
		vm.promoobj.finalcost='';
		vm.promoobj.discount='';
		vm.model.apptCost = localVariables.bookNowobj.apptCost;
		vm.custInfoFormFields.promocode='';
	}
	/*
	* function to get location array
	*/
	function getAllLocations(callback) {
		
		$('#booking1-dt').datetimepicker({
			defaultDate: localVariables.bookNowobj.date,
			format: 'DD-MM-YYYY'
		});
		vm.model.problemName = localVariables.bookNowobj.problemName;
		callback(vm.model.locationArr);
	};

	/*
	* function for location selected
	*/
	function locationSelected(value) {
		//console.log(value);
		//alert('Hello');
		vm.model.selectedLocation = value;
		if(value.price > 0){
			localVariables.bookNowobj.apptCost = value.price;
		}
		
		//alert(vm.model.apptCost);
		/* API call to check available dates */
		custApi.checkAvailableDatesInMonth(3, vm.model.fromMonthDate, value.pincodeid, value.zoneid, vm.model.physiotherapyId).
		success(function (data, status, header, config) {
			console.log("Available dates retrieved successfully");
			console.log(data);
			/* Enabling available dates */
			var i=0;
			var enableDatesArray = [];
			var yr='';
			var month='';
			var day='';
			var date='';
			data.payload.dates.forEach(function(p) {
				yr = p.substring(0,4);
				month = p.substring(4,6);
				day = p.substring(6,8);
				date = yr + '/' + month + '/' + day;
				enableDatesArray.push(new Date(date));
			});

			$scope.enableDatesArray = enableDatesArray;			
			/*$("#booking1-dt").data("DateTimePicker").enabledDates(enableDatesArray);*/
			if(enableDatesArray.length != 0) {
				vm.flags.datesNotAvailable = false;
				vm.flags.bookingErrorContainer = vm.flags.datesNotAvailable;
				$("#booking1-dt").data("DateTimePicker").enabledDates(enableDatesArray);
			} else {
				vm.flags.datesNotAvailable = true;
				vm.flags.bookingErrorContainer = vm.flags.datesNotAvailable;
				vm.model.bookingErrorMessageContainer = 'Dates not Available for currently selected Location';
				$timeout(function () { vm.flags.bookingErrorContainer = false; vm.flags.datesNotAvailable = false}, 5000);
				$("#booking1-dt").data("DateTimePicker").enabledDates([new Date('1970/1/1')]);
			}
			
			/* For available date retrieve 'available time' slots */
        	if(vm.model.selectedLocation != 'Choose Location' && vm.model.fromDate != undefined) {
        		custApi.fetchAvailableSlotsForDay(vm.model.fromDate, vm.model.selectedLocation.zoneid, vm.model.physiotherapyId, vm.model.selectedLocation.pincodeid).
            	success(function (data, status, header, config) {
            		console.log("Available slots retrieved successfully");
            		console.log("Slots:");
            		console.log(data);
            		vm.model.timeslotArray = [];
            		/* format time slot into hr:min am/pm */
            		var selectedDate = $('#booking1-dt').val();
            		var currentDate = moment().format('DD-MM-YYYY');

            		data.payload.appointmentslots.forEach(function(item) {
            			var hours = item.st.substring(0,2);
            			var mins = item.st.substring(2,4);
            			var period = "";
						if(hours > 12) {
							hours = hours - 12;
							period = "PM";
							/*if(hours.toString().length == 1) {
								hours = "0"+hours;
							}*/
						} else if(hours < 12) {
							period = "AM";
						} else if(hours == 12) {
							period = "PM";
						}

            			var timeformat = hours + ":" + mins + " " + period;

            			if(selectedDate == currentDate){
            				var currentHour = moment().format('h');
            				var tempHour =  parseInt(currentHour) + 3;
            				if(parseInt(hours) > parseInt(tempHour)){
            					vm.model.timeslotArray.push({starttime: timeformat});
            				}
            				
            			}else{
            				vm.model.timeslotArray.push({starttime: timeformat});
            			}
            		});

            		
            	}).
            	error(function (data, status, header, config) {
            		console.log("Error in retrieving available slots");
            	});
        	}
		}).
		error(function (data, status, header, config) {
			console.log("Error in retrieving available dates");
		});

		vm.promoobj.promocode='';
		vm.promoobj.promocodeid='';
		vm.promoobj.finalcost='';
		vm.promoobj.discount='';
		vm.model.apptCost = localVariables.bookNowobj.apptCost;
		vm.custInfoFormFields.promocode='';
		
	}

	/*
	* Function to get the list of available problems
	*/
	function getServicesList() {
		custApi.getServices().
		success(function (data, status, header, config) {
			console.log("Services retrieved successfully");
			var serviceMap = buildServicesMap(data.payload);
			vm.model.physiotherapyId = serviceMap["physiotherapy"];
		}).
		error(function (data, status, header, config) {
			console.log("Error in retrieving services");
		});
	}

	/*
	* Function to check timeslot
	*/
	function checktimeslot() {

	}

	/*
	* Function to check which problem is selected from the image.
	* Fill the currently selected item circle with red color & make the previous one transparent.
	* Save the id of the selected problem in a model for API use
	*/
	function problemSelected(item) {
		if(localVariables.selectedItem != '') {
			localVariables.selectedItem.href.baseVal = "./images/customer_portal/circle.png";
		}
		item.target.href.baseVal = "./images/customer_portal/circle_tick.png";					
		localVariables.selectedProblemId = item.target.id;
		localVariables.selectedItem = item.target;
		vm.model.problemName = item.target.getAttribute("value");
		
		vm.model.otherProblem = '';
	}

	/*
	* Function to Navigate to booking screen 2.
	* Will pass selected problem to booking2 screen.
	* Header remains constant.
	*/
	function navigateToBooking2() {
		
		localVariables.bookNowobj.problemName = "";

		var obj = {
			location: vm.model.selectedLocation,
			date: vm.model.selectedDate,
			datesEnabled: $scope.enableDatesArray,
			timeslot: vm.model.timeslot,
			timeslotArray: vm.model.timeslotArray,
			apptCost:vm.model.apptCost,
			cityid:localVariables.cityId
		};
		custportalGetSetService.setBooknowObj(obj);

		vm.problemSelectedVar = vm.model.problemName;
		$cookies.put('problem', vm.problemSelectedVar);   


		if(vm.model.selectedLocation != 'Choose Location' && 
		(vm.model.selectedDate != undefined || vm.model.selectedDate != "") &&
		 (vm.model.timeslot != null)) {
			if(vm.model.problemName == '' || vm.model.problemName == undefined) {
				//alert("Please select a Problem to Continue.");
				vm.flags.selectProblemError = true;
				vm.flags.bookingErrorContainer = vm.flags.selectProblemError;
				vm.model.bookingErrorMessageContainer = 'Please select a Problem to Continue.';
				$timeout(function () { vm.flags.bookingErrorContainer = false; vm.flags.selectProblemError = false}, 5000);
			} else {
				custportalGetSetService.setProblem({selectedItemId: localVariables.selectedProblemId, otherProblem: vm.model.otherProblem});
				localVariables.bookNowobj.problemName = vm.model.problemName;
				console.log("IN:"+vm.problemSelectedVar);
				$state.go('booking.booking2');
			}
		} else {
			//alert("Please fill the Booking Details in the top panel to proceed.");
			vm.flags.innerPageBookNowError = true;
			vm.flags.bookingErrorContainer = vm.flags.innerPageBookNowError;
			vm.model.bookingErrorMessageContainer = 'Please fill the Booking Details in the top panel to proceed.';
			$timeout(function () { vm.flags.bookingErrorContainer = false; vm.flags.innerPageBookNowError = false; }, 5000);
		}

				
	}

	/*
	* Function to navigate back to booking screen1
	*/
	function navigateBackToBooking1() {
		$state.go('booking1');
		var problemObj = custportalGetSetService.getProblem();
		$timeout(function() {
			
			if(problemObj.otherProblem != '' && problemObj.otherProblem != undefined) {
				vm.model.otherProblem = problemObj.otherProblem;
				if (problemObj.selectedItemId != "" && problemObj.selectedItemId != undefined) {
					localVariables.selectedItem = document.getElementById(problemObj.selectedItemId);
					localVariables.selectedItem.href.baseVal = "./images/customer_portal/circle.png";
				}
			} else 		
			if (problemObj.selectedItemId != "" && problemObj.selectedItemId != undefined) {
				localVariables.selectedItem = document.getElementById(problemObj.selectedItemId);
				localVariables.selectedItem.href.baseVal = "./images/customer_portal/circle_tick.png";
				if(problemObj.otherProblem != '' && problemObj.otherProblem != undefined) {
					vm.model.otherProblem = '';
				}
			}
		}, 200);
	}

	/*
	* Function to get users current location.
	* The location is populated in the address bar in UI
	*/
	function getlocation() {
    	console.log("Entering getLocation()");
    	if(navigator.geolocation){
			navigator.geolocation.getCurrentPosition(
			displayCurrentLocation,
			displayError,
			{ 
				maximumAge: 3000, 
				timeout: 5000, 
				enableHighAccuracy: true 
			});
		}else{
			//console.log("Oops, no geolocation support");
		} 
    	//console.log("Exiting getLocation()");
    };
    function displayCurrentLocation(position){
    	//console.log("Entering displayCurrentLocation");
    	var latitude = position.coords.latitude;
		var longitude = position.coords.longitude;
		console.log("Latitude " + latitude +" Longitude " + longitude);
		getAddressFromLatLang(latitude,longitude);
    	//console.log("Exiting displayCurrentLocation");
    }
   function  displayError(error){
		console.log("Entering ConsultantLocator.displayError()");
		var errorType = {
			0: "Unknown error",
			1: "Permission denied by user",
			2: "Position is not available",
			3: "Request time out"
		};
		var errorMessage = errorType[error.code];
		if(error.code == 0  || error.code == 2){
			errorMessage = errorMessage + "  " + error.message;
		}
		alert("Error Message " + errorMessage);
		console.log("Exiting ConsultantLocator.displayError()");
	}
    function getAddressFromLatLang(lat,lng){
    	console.log("Entering getAddressFromLatLang()");
    	var geocoder = new google.maps.Geocoder();
        var latLng = new google.maps.LatLng(lat, lng);
        geocoder.geocode( { 'latLng': latLng}, function(results, status) {
    		console.log("After getting address");
    		console.log(results);
    		if (status == google.maps.GeocoderStatus.OK) {
    			if (results[1]) {
    				console.log(results[1]);
    				/*alert(results[0].formatted_address);*/
    				vm.custInfoFormFields.address = results[0].formatted_address;
    				$scope.$apply();
    			}
    		}else{
    			alert("Geocode was not successful for the following reason: " + status);
    		}
        });
    	console.log("Entering getAddressFromLatLang()");
    }

    /*
	* Validating customer Information form
    */
    function bookNewAppointment() {
    	//console.log("Model");
    	var problem = $cookies.get('problem');
    	//console.log(problem);


    	var google_conversion_id = "";
        var google_conversion_language = "";
        var google_conversion_format = "";
        var google_conversion_color = "";
        var google_conversion_label = "";
        var google_conversion_value = "";
        var google_conversion_currency = "";
        var google_remarketing_only = "";
    	vm.flags.custInfoFormSubmitted = true;
    	if(vm.model.selectedLocation != 'Choose Location' && 
		(vm.model.selectedDate != undefined || vm.model.selectedDate != "") &&
		 (vm.model.timeslot != null)) {

    		if(vm.custInfoForm.$valid) {
	    		var uid = $cookies.get('u_id');
	    		if(vm.custInfoFormFields.lastName == "" || vm.custInfoFormFields.lastName == undefined) {
	    			var name = vm.custInfoFormFields.firstName;
	    		} else {
	    			var name = vm.custInfoFormFields.firstName+ " "+vm.custInfoFormFields.lastName;
	    		}	    
	    		//console.log('vm.model=');	
	    		//console.log(vm.model);	
	    		var dateInstance = $('#booking1-dt').data("DateTimePicker").date().format("YYYYMMDD");
	    		var year = $('#booking1-dt').data("DateTimePicker").date().format("YYYY");
	    		var month = $('#booking1-dt').data("DateTimePicker").date().format("MM") - 1;
	    		var day = $('#booking1-dt').data("DateTimePicker").date().format("DD");
	    		var period = vm.model.timeslot.starttime.split(" ")[1];
	    		if(period == "PM"){
	    			if(parseInt(vm.model.timeslot.starttime.split(" ")[0].split(":")[0]) < 12) {
	    				var apptHrs = parseInt(vm.model.timeslot.starttime.split(" ")[0].split(":")[0]) + 12;
	    			} else {
	    				var apptHrs = vm.model.timeslot.starttime.split(" ")[0].split(":")[0];
	    			}
	    		}
	    		else {
	    			var apptHrs = vm.model.timeslot.starttime.split(" ")[0].split(":")[0];
	    		}    		
	    		var apptMins = vm.model.timeslot.starttime.split(" ")[0].split(":")[1];

	    		/*from epoch time*/
	    		var fromCurrentDate = new Date(year, month, day);
	    		fromCurrentDate.setHours(apptHrs);
	    		fromCurrentDate.setMinutes(apptMins);
	    		var apptstarttime = moment(fromCurrentDate).format("YYYY-MM-DD hh:mm A");

	    		/* Customer information object for taking new appointment */
	    		//alert(vm.model.problemName);
	    		//alert(localVariables.bookNowobj.problemName);
	    		if(vm.model.clinic_id == undefined){
	    			if(vm.promoobj.promocodeid == '' || vm.promoobj.promocodeid == null) {
		    			var apptObj = {
			    			"customer": {
								"cityid": localVariables.cityId,
								"name": name,
								"phone": vm.custInfoFormFields.mobile,
								"email": vm.custInfoFormFields.email,
								"pincode": vm.model.selectedLocation.pincodeid,
								"address": vm.custInfoFormFields.address,
								//"problem": vm.model.problemName,
								"problem": problem,
								"gender": vm.custInfoFormFields.gender,
								"signMeUp": vm.custInfoFormFields.signup,
								"is_package_assign":false,
								"source":"Online"
							},
							"apptslots": [apptstarttime],
							"adminid": uid,
							"comments": vm.custInfoFormFields.comments,
							"zoneid": vm.model.selectedLocation.zoneid,
							"serviceid": vm.model.physiotherapyId,
							"address": vm.custInfoFormFields.address,
							"usecustomeraddress": false,
							"locality": vm.model.selectedLocation.localities,
							"apptRootId": "",
							"zoneBasePrice":localVariables.bookNowobj.apptCost
			    		};
		    		} else {
		    			var apptObj = {
			    			"customer": {
								"cityid": localVariables.cityId,
								"name": name,
								"phone": vm.custInfoFormFields.mobile,
								"email": vm.custInfoFormFields.email,
								"pincode": vm.model.selectedLocation.pincodeid,
								"address": vm.custInfoFormFields.address,
								//"problem": vm.model.problemName,
								"problem": problem,
								"gender": vm.custInfoFormFields.gender,
								"signMeUp": vm.custInfoFormFields.signup,
								"is_package_assign":false,
								"source":"Online"

							},
							"apptslots": [apptstarttime],
							"adminid": uid,
							"comments": vm.custInfoFormFields.comments,
							"zoneid": vm.model.selectedLocation.zoneid,
							"serviceid": vm.model.physiotherapyId,
							"address": vm.custInfoFormFields.address,
							"usecustomeraddress": false,
							"locality": vm.model.selectedLocation.localities,
							"apptRootId": "",
							"promocode": vm.promoobj.promocode,
							"zoneBasePrice":localVariables.bookNowobj.apptCost
			    		};
		    		}
	    		}else{

	    			if(vm.promoobj.promocodeid == '' || vm.promoobj.promocodeid == null) {
		    			var apptObj = {
			    			"customer": {
								"cityid": localVariables.cityId,
								"name": name,
								"phone": vm.custInfoFormFields.mobile,
								"email": vm.custInfoFormFields.email,
								"pincode": vm.model.selectedLocation.pincodeid,
								"address": vm.custInfoFormFields.address,
								//"problem": vm.model.problemName,
								"problem": problem,
								"gender": vm.custInfoFormFields.gender,
								"signMeUp": vm.custInfoFormFields.signup,
								"is_package_assign":false,
								"source":"Online"
							},
							"apptslots": [apptstarttime],
							"adminid": uid,
							"comments": vm.custInfoFormFields.comments,
							"zoneid": vm.model.selectedLocation.zoneid,
							"serviceid": vm.model.physiotherapyId,
							"address": vm.custInfoFormFields.address,
							"usecustomeraddress": false,
							"locality": vm.model.selectedLocation.localities,
							"apptRootId": "",
							"clinic_id": vm.model.clinic_id,
							"clinicBasePrice": vm.model.clinicPrice
			    		};
		    		} else {
		    			var apptObj = {
			    			"customer": {
								"cityid": localVariables.cityId,
								"name": name,
								"phone": vm.custInfoFormFields.mobile,
								"email": vm.custInfoFormFields.email,
								"pincode": vm.model.selectedLocation.pincodeid,
								"address": vm.custInfoFormFields.address,
								//"problem": vm.model.problemName,
								"problem": problem,
								"gender": vm.custInfoFormFields.gender,
								"signMeUp": vm.custInfoFormFields.signup,
								"is_package_assign":false,
								"source":"Online"
							},
							"apptslots": [apptstarttime],
							"adminid": uid,
							"comments": vm.custInfoFormFields.comments,
							"zoneid": vm.model.selectedLocation.zoneid,
							"serviceid": vm.model.physiotherapyId,
							"address": vm.custInfoFormFields.address,
							"usecustomeraddress": false,
							"locality": vm.model.selectedLocation.localities,
							"apptRootId": "",
							"promocode": vm.promoobj.promocode,
							"clinic_id": vm.model.clinic_id,
							"clinicBasePrice": vm.model.clinicPrice

			    		};
		    		}
	    		}
	    		
	    		
	    		console.log(apptObj);

	    		/*API for taking new appointment*/
	    		custApi.createNewAppointment(apptObj).
	    		success(function (data, status, headers, config) {
	    			console.log("Appointment booked successfully");
	    			
	    			// CompleteRegistration
	    			// Track when a registration form is completed (ex. complete subscription, sign up for a service)
	    			try {
	    				fbq('track', 'CompleteRegistration');
	    			} catch(err) {}

	    			// Google Analytics - 'Appointment Booked' event
	    			try {
	    				ga('send', 'event', 'Appointment Booked', 'click');
	    			} catch(err) {}

	    			// load Google Conversion script now
	    			vm.method.loadConversionScript();
	    			var google_conversion_id = 845120495;
					var google_conversion_language = "en";
					var google_conversion_format = "3";
					var google_conversion_color = "ffffff";
					var google_conversion_label = "186DCO__snMQ74f-kgM";
					var google_conversion_value = 599.00;
					var google_conversion_currency = "INR";
					var google_remarketing_only = false;
	    			console.log(data);
	    			vm.model.appointmentRefNumber = data.payload[0].refno;
	    			/*alert("Thank you for confirming appointment. Appointment reference number is: "+vm.model.appointmentRefNumber);*/
	    			var confirmationObj = {
	    				"address": data.payload[0].address,
	    				"startdate": $('#booking1-dt').data("DateTimePicker").date().format("DD-MM-YYYY"),
	    				"time": vm.model.timeslot.starttime,
	    				"price": "Consulting charges Rs. "+vm.model.apptCost,
	    				"custName": data.payload[0].apptpatientname,
	    				"spname": data.payload[0].spname
	    			};
	    			custportalGetSetService.setConfirmObj(confirmationObj);
	    			$state.go("bookingConfirmation");
	    		}).
	    		error(function (data, status, headers, config) {
	    			//alert(data.error.message);
	    			var google_conversion_id = "";
		            var google_conversion_language = "";
		            var google_conversion_format = "";
		            var google_conversion_color = "";
		            var google_conversion_label = "";
		            var google_conversion_value = "";
		            var google_conversion_currency = "";
		            var google_remarketing_only = "";
	    			vm.flags.confirmAppointmentError = true;
	    			vm.flags.bookingErrorContainer = vm.flags.confirmAppointmentError;
					vm.model.bookingErrorMessageContainer = data.error.message;
					$timeout(function () { vm.flags.bookingErrorContainer = false; vm.flags.confirmAppointmentError = false; }, 5000);
	    			console.log("Appointment booking Failed");
	    		});
	    	} else {
	    		window.scrollTo(0,0);
	    	}
    	} else {
    		//alert("Please fill the Booking Details in the top panel to proceed.");
    		vm.flags.innerPageBookNowError = true;
			vm.flags.bookingErrorContainer = vm.flags.innerPageBookNowError;
			vm.model.bookingErrorMessageContainer = 'Please fill the Booking Details in the top panel to proceed.';
			$timeout(function () { vm.flags.bookingErrorContainer = false; vm.flags.innerPageBookNowError = false; }, 5000);
    	}    	
    }

    /*
	* Function to redirect to home page.
	* This function is called when clicked on logo
    */
    function navigateToHome() {
    	window.location = "/";
    }

    /*
	* Function to aply promo code
    */
    function applyPromoCode() {
    	var dateInstance = $('#booking1-dt').data("DateTimePicker").date().format("YYYYMMDD");
		var year = $('#booking1-dt').data("DateTimePicker").date().format("YYYY");
		var month = $('#booking1-dt').data("DateTimePicker").date().format("MM") - 1;
		var day = $('#booking1-dt').data("DateTimePicker").date().format("DD");
		var period = vm.model.timeslot.starttime.split(" ")[1];
		if(period == "PM"){
			if(parseInt(vm.model.timeslot.starttime.split(" ")[0].split(":")[0]) < 12) {
				var apptHrs = parseInt(vm.model.timeslot.starttime.split(" ")[0].split(":")[0]) + 12;
			} else {
				var apptHrs = vm.model.timeslot.starttime.split(" ")[0].split(":")[0];
			}
		}
		else {
			var apptHrs = vm.model.timeslot.starttime.split(" ")[0].split(":")[0];
		}    		
		var apptMins = vm.model.timeslot.starttime.split(" ")[0].split(":")[1];

		/*from epoch time*/
		var fromCurrentDate = new Date(year, month, day);
		fromCurrentDate.setHours(apptHrs);
		fromCurrentDate.setMinutes(apptMins);
		var fromEpochTime = fromCurrentDate.getTime()/1000.0;


		var apptslot = moment(new Date(fromCurrentDate.getTime())).format("YYYY-MM-DD hh:mm A");

        if(vm.model.clinic_id == undefined){
        	var promoobj = {
	    		'promocode': vm.custInfoFormFields.promocode,
	    		'apptid': '',
	    		'pincode': vm.model.selectedLocation.pincodeid,
	    		'cityid': localVariables.cityId,
	    		'custname': '',
	    		'problem': vm.model.problemName,
	    		"apptslots": [apptslot],
	    		'serviceid': vm.model.physiotherapyId,
	    		'zoneBasePrice' : localVariables.bookNowobj.apptCost
	    	};
        }else{
        	var promoobj = {
	    		'promocode': vm.custInfoFormFields.promocode,
	    		'apptid': '',
	    		'cityid': localVariables.cityId,
	    		'custname': '',
	    		'problem': vm.model.problemName,
	    		"apptslots": [apptslot],
	    		'serviceid': vm.model.physiotherapyId,
	    		'clinicBasePrice': vm.model.clinicPrice
	    	};
        }
		
	
    	custApi.applyPromocode(promoobj, 3).
    	success(function (data, status, headers, config) {
    		console.log("successfully Applied Promocode");
    		vm.model.apptCost = data.payload.finalcost;
    		vm.promoobj.promocode = data.payload.promocode;
    		vm.promoobj.promocodeid = data.payload.promocodeid;
    		vm.promoobj.finalcost = data.payload.finalcost;
    		vm.promoobj.discount = data.payload.discount;
    		vm.flags.promocodeValid = "Valid";
    		vm.model.promocodeResultMessage = "Promotional code accepted. Discounted charges are Rs. " + data.payload.finalcost + " only";
    		$timeout(function () { vm.flags.promocodeValid = ''; }, 6000);
    	}).
    	error(function (data, status, headers, config) {
    		console.log("Invalid Promocode");
    		vm.promoobj.promocode = '';
    		vm.promoobj.promocodeid = '';
    		vm.promoobj.finalcost = '';
    		vm.promoobj.discount = '';
    		vm.model.apptCost = localVariables.bookNowobj.apptCost;
			vm.custInfoFormFields.promocode='';
    		vm.flags.promocodeValid = "Not Valid";
    		vm.model.promocodeResultMessage = data.error.message;
    		$timeout(function () { vm.flags.promocodeValid = ''; }, 6000);
    	});
    }

    function loadConversionScript() {
		/* <![CDATA[ */
		window.google_conversion_id = 881129817;
	    window.google_conversion_language = "en";
	    window.google_conversion_format = "3";
	    window.google_conversion_color = "ffffff";
	    window.google_conversion_label = "bKmrCOyJp2gQ2fKTpAM";
	    window.google_conversion_value = 0;
	    window.google_remarketing_only = false;
	    /* ]]> */

	    var oldDocWrite = document.write // save old doc write

	    document.write = function(node){ // change doc write to be friendlier, temporary
	        $("body").append(node)
	    }

	    var noscriptTag = document.createElement('noscript');
	    noscriptTag.id = "idconversion";
	    var imgTag = document.createElement('img');
	    imgTag.height = 1;
	    imgTag.width = 1;
	    imgTag.border = 0;
	    imgTag.src = encodeURI("https://www.googleadservices.com/pagead/conversion/881129817/?label=bKmrCOyJp2gQ2fKTpAM&guid=ON&script=0");

		$('body').append(noscriptTag);
	    $('#idconversion').append(imgTag);    

	    $.getScript("https://www.googleadservices.com/pagead/conversion.js", function() {

	        setTimeout(function() { // let the above script run, then replace doc.write
	            document.write = oldDocWrite;
	        }, 100)
	    });
    }

    /*Calling init function*/
	vm.method.initBooking1screen();
} /* END of controller */