app.controller('innerPageController', innerPageController);
innerPageController.$inject = ['$timeout', '$http', 'custApi', '$cookies', '$scope', '$state', 'custportalGetSetService'];

function innerPageController($timeout, $http, custApi, $cookies, $scope, $state, custportalGetSetService) {
	var vm = this;
	window.scrollTo(0, 0);

	vm.flags = {
		booknowSectionfieldsValid: false
       
	}
	vm.method = {
		initInnerPageController: initInnerPageController,
		getAllLocations: getAllLocations,
		locationSelected: locationSelected,
		redirectToBooking1: redirectToBooking1,
		toggleFaq: toggleFaq,
		getPolicy: getPolicy
	};
	vm.model = {
		locationArr: [],
		selectedLocation: '',
		acRefresh: false,
		fromMonthDate: '',
		physiotherapyId: '',
		timeslotArray: [],
		timeslot: '',
		fromDate: '',
		selectedDate: '',
		comments: '',
		apptCost: '',
		arrayPolicy: []
	};
	var localmethods = {
		initDatePicker: initDatePicker,
		initLocalities: initLocalities,
		compare: compare
	};

	var localVariables = {
		enableDatesArray: [],
		cache: {},
	};
	
	/* *******Function Definitions**************** */

	function getPolicy() {
		vm.model.arrayPolicy = [];
		custApi.getPolicy().
		success(function (data, status, headers, config) {
			var dataarray = [];
			var dataarray = data.payload;
			console.log("successfully received policy");
			dataarray.forEach(function(item) {
				vm.model.arrayPolicy.push(item);
			});
		}).
		error(function (data, status, headers, config) {
			console.log("Error in receiving clinics");
		});
	}

	/*
	* Function to initialize controller
	*/
	function initInnerPageController() {
		/*populate location array*/
		/*vm.model.locationArr = custportalGetSetService.getLocalityObj();*/
		var obj = custportalGetSetService.getPhysioId();
		// If obj found undefined, then we will wait for 100 ms and will try to init inner page controller again
		if(obj == undefined) {
			console.log("waiting in initInnerPageController");
			$timeout(function() {
				vm.method.initInnerPageController();
			}, 100);
			return;
		}
		vm.model.physiotherapyId = obj.physioId;
		vm.model.apptCost = obj.apptCost;
		vm.model.selectedLocation = "Choose Location";
		vm.model.timeslot = "Select Time";
		localmethods.initDatePicker();
		localmethods.initLocalities();
		$timeout(function() {
			if($scope.$parent.cpc.scrolltodivName == 'physiotherapy') {
				var element = document.getElementById("physiotherapy");
	            element.scrollIntoView();
			}
		}, 200);
		
	}

	/*
	* Function to initialize Pune Localities in dropdown
	*/
	function initLocalities() {
		custApi.getCities("India")
        .success(function(data, status, headers, config){
            localVariables.cache.cityToIdMap = buildCitiesToIdMap(data.payload);
            //vm.cityMap = cache.cityToIdMap;
            localVariables.cache.cityIdToNameMap = buildCitiesIdToNameMap(data.payload);
            localVariables.cache.cityIdToStateMap = buildCityIdToStateMap(data.payload);
            custApi.getZones(localVariables.cache.cityToIdMap["Pune"])
                .success(function(data, status, headers, config){
                    /*$scope.zonesList = buildZonesList(data.payload);
                    cache.zoneIdToNameMap = buildZoneIdToNameMap(data.payload);*/
                    vm.model.locationArr = [];
					var dataArray = data.payload;
					for(var i = 0 ; i < dataArray.length ; i++) {
                    if(!dataArray[i].hasOwnProperty("deleted") || dataArray[i].deleted === false) {
						var zoneid = dataArray[i].zoneid;
						var zonename = dataArray[i].zonename;
						var pincodeArray = dataArray[i].pincodes;
						for(var j = 0 ; j < pincodeArray.length ; j++) {
                         var isdeleted = pincodeArray[j].isdeleted;
                         if (isdeleted === false){
							var pincodeVal = pincodeArray[j].pin;
							var localitiesVal = pincodeArray[j].localities;
                             var pincodeid = pincodeArray[j].pincodeid;
							var locationObj = {
								"zoneid": zoneid,
								"zonename": zonename,
								"pin": pincodeVal,
                                "pincodeid":pincodeid,
								"localities": localitiesVal,
								"val": pincodeVal + " " + localitiesVal
							};
							vm.model.locationArr.push(locationObj);
							vm.model.locationArr.sort(localmethods.compare);
                          }
						}
                     }
					}
					vm.model.acRefresh = false;
					custportalGetSetService.setLocalityObj(vm.model.locationArr);
                })
                .error(function(data, status, headers, config){
                    console.log("Error in getting Zones");
                }); /*adminApi.getZones END*/
        })
        .error(function(data, status, headers, config){
            console.log("Failed to get Cities");
        });
	}

	/*
	* function to sort pincodes
	*/
	function compare(a,b) {
		if (a.pin < b.pin)
			return -1;
		else if (a.pin > b.pin)
			return 1;
		else
			return 0;
	}


	/*
	* Function to initialize datepicker
	*/
	function initDatePicker() {
		if($('#dt3').length != 1) {
			$timeout(localmethods.initDatePicker, 50);
			//console.log("inside datepicker");
			return;
		}
		$('#dt3').datetimepicker({
			/*defaultDate: localVariables.bookNowobj.date,*/
			format: 'DD-MM-YYYY'
		});

		/*set array of enabled dates*/
		vm.model.fromMonthDate = moment(new Date()).format("YYYYMM");
		$("#dt3").data("DateTimePicker").enabledDates([new Date('1970/1/1')]);

		/* Event called when month is changed */
        $("#dt3").on("dp.update", function (e) {
        	vm.model.fromMonthDate = e.viewDate.format("YYYYMM");
        	if(vm.model.selectedLocation != 'Choose Location') {
        		custApi.checkAvailableDatesInMonth(3, vm.model.fromMonthDate, vm.model.selectedLocation.pincodeid, vm.model.selectedLocation.zoneid, vm.model.physiotherapyId).
				success(function (data, status, header, config) {
					console.log("Available dates retrieved successfully");
					
					/* Enabling available dates */
					var i=0;
					localVariables.enableDatesArray = [];
					var yr='';
					var month='';
					var day='';
					var date='';
					data.payload.dates.forEach(function(p) {
						yr = p.substring(0,4);
						month = p.substring(4,6);
						day = p.substring(6,8);
						date = yr + '/' + month + '/' + day;
						localVariables.enableDatesArray.push(new Date(date));
                        
					});				
                  
					if(localVariables.enableDatesArray.length != 0) {
                        console.log("setting date not available flag to false");
                        	$scope.$parent.cpc.flags.datesNotAvailable = false;
						$("#dt3").data("DateTimePicker").enabledDates(localVariables.enableDatesArray);
					} else {
                        console.log("setting date not available flag to true");
                        $scope.$parent.cpc.flags.datesNotAvailable = true;
                        
                        $timeout(function () { 	$scope.$parent.cpc.flags.datesNotAvailable = false; }, 5000);
						$("#dt3").data("DateTimePicker").enabledDates([new Date('1970/1/1')]);
					}
				}).
				error(function (data, status, header, config) {
					console.log("Error in retrieving available dates");
				});
        	}
        });

        /* *Event called when date is changed* */
        $("#dt3").on("dp.change", function (e) {
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
            			vm.model.timeslotArray.push({starttime: timeformat});
            		});
            	}).
            	error(function (data, status, header, config) {
            		console.log("Error in retrieving available slots");
            	});
        	}            	
        });
	}

	/*
	* function to get location array
	*/
	function getAllLocations(callback) {
		callback(vm.model.locationArr);
	};
	
	/*
	* function for location selected
	*/
	function locationSelected(value) {
		console.log(value);
		vm.model.selectedLocation = value;
		/* API call to check available dates */
		custApi.checkAvailableDatesInMonth(3, vm.model.fromMonthDate, value.pincodeid, value.zoneid, vm.model.physiotherapyId).
		success(function (data, status, header, config) {
			console.log("Available dates retrieved successfully");
         
			console.log(data);
			/* Enabling available dates */
			var i=0;
			localVariables.enableDatesArray = [];
			var yr='';
			var month='';
			var day='';
			var date='';
			data.payload.dates.forEach(function(p) {
				yr = p.substring(0,4);
				month = p.substring(4,6);
				day = p.substring(6,8);
				date = yr + '/' + month + '/' + day;
				localVariables.enableDatesArray.push(new Date(date));
			});				
			if(localVariables.enableDatesArray.length != 0) {
               	$scope.$parent.cpc.flags.datesNotAvailable = false;
				$("#dt3").data("DateTimePicker").enabledDates(localVariables.enableDatesArray);
			} else {
                console.log("setting date not available flag to true");
               	$scope.$parent.cpc.flags.datesNotAvailable = true;
               
                $timeout(function () { 	$scope.$parent.cpc.flags.datesNotAvailable = false; }, 5000);
				$("#dt3").data("DateTimePicker").enabledDates([new Date('1970/1/1')]);
			}
			
			/* For available date retrieve 'available time' slots */
        	if(vm.model.selectedLocation != 'Choose Location' && ( vm.model.fromDate != '' && vm.model.fromDate != undefined)) {
        		custApi.fetchAvailableSlotsForDay(vm.model.fromDate, vm.model.selectedLocation.zoneid, vm.model.physiotherapyId, vm.model.selectedLocation.pincodeid).
            	success(function (data, status, header, config) {
            		console.log("Available slots retrieved successfully");
            		console.log("Slots:");
            		console.log(data);
            		vm.model.timeslotArray = [];
            		/* format time slot into hr:min am/pm */
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
            			vm.model.timeslotArray.push({starttime: timeformat});
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
	}

	/*
	* Function to redirect to booking1 screen
	*/
	function redirectToBooking1() {
		// InitiateCheckout
		// Track when people enter the checkout flow (ex. click/landing page on checkout button)
		try {
			fbq('track', 'InitiateCheckout');
		} catch(err) {}
			
		if(vm.model.selectedLocation != 'Choose Location' && 
			(vm.model.selectedDate != undefined || vm.model.selectedDate != "") &&
			 (vm.model.timeslot != "Select Time")) {
			var obj = {
				location: vm.model.selectedLocation,
				date: vm.model.selectedDate,
				datesEnabled: localVariables.enableDatesArray,
				timeslot: vm.model.timeslot,
				timeslotArray: vm.model.timeslotArray,
				cityid: localVariables.cache.cityToIdMap["Pune"],
				apptCost: vm.model.apptCost
			};
			/* 
			* Set the master controller flag to true
			* It indicates the booking details are filled and navigate to the desired location.
			* On loading the booking pages, checkHomeDataFilled() is excecuted to check this flag. 
			*/
			$scope.$parent.cpc.flags.booknowSectionfieldsValid = true;
			$cookies.put('booking_session', 'in_progress', { path: "/"});
			custportalGetSetService.setBooknowObj(obj);
			$state.go('booking.booking1');
		} else {
			$scope.$parent.cpc.flags.booknowSectionfieldsValid = false;
			$scope.$parent.cpc.flags.bookNowError = true;
			$timeout(function () { $scope.$parent.cpc.flags.bookNowError = false; }, 5000);
			//alert("Please fill the Booking Details to proceed.");
		}
	}

	/*
	* Function to toggle the testimonial accordian
	*/
	function toggleFaq(event) {
			if ($(event.currentTarget).parent().find(".accordion1_body").first().is(':visible')) {
                $(event.currentTarget).parent().find(".accordion1_body").first().slideUp(300);
                $(event.currentTarget).find(".plusminus1").text('+');
            }
            else {
            	$(event.currentTarget).parent().find(".accordion1_body").first().slideDown(300);
                $(event.currentTarget).find(".plusminus1").text('-');
            }
		}

	vm.method.initInnerPageController();
}