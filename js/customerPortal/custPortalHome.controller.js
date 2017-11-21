/*(function () {
	'use strict';*/

	/*angular
	.module('custPortalApp', ['acute.select', 'myApp.Services', 'ngCookies', 'ui.bootstrap', 'ngSanitize'])*/

	app.controller('custPortalController', custPortalController);
	
	custPortalController.$inject = ['$timeout', '$http', 'custApi', '$cookies', 'ngDialog', '$scope', '$state', 'custportalGetSetService', '$window', '$templateCache'];

	function custPortalController ($timeout, $http, custApi, $cookies, ngDialog, $scope, $state, custportalGetSetService, $window, $templateCache) {
		
		var vm = this;

	    $templateCache.removeAll();		

		vm.flags = {
			booknowSectionfieldsValid: false,
			requestACallbackSucess: false,
			requestACallbackError: false,
			bookNowError: false,
			callMeValidationError: false,
			datesNotAvailable: false
		};

		/*===Function declaration===*/
		vm.videoId1 = "gPuN_9DS0Zk";
		vm.videoId2 = "HqiozPzPMCI";	
		vm.videoId3 = "N2cIv0yTpU4";
		vm.videoId4 = "g3gAvyxJDvA";
		vm.playerVars = {loop:1,rel:0};
		vm.isThisMobileDevice = isThisMobileDevice;
		vm.getAllLocations = getAllLocations;
		vm.locationSelected = locationSelected;
		vm.initCustPortal = initCustPortal;
		vm.initCurrentState = initCurrentState;
		vm.initLocalities = initLocalities;
		vm.getSelectedCity = getSelectedCity;
		vm.getServicesList = getServicesList;
		var anonymousLogin = anonymousLogin;
		vm.showCallmeScroll = showCallmeScroll;
		vm.hideCallmeScroll = hideCallmeScroll;
		vm.submitRequestACallBack = submitRequestACallBack;
		var validateRequestCallbackForm = validateRequestCallbackForm;
		//vm.isDrawerOpen = isDrawerOpen;
		vm.redirectToBooking1 = redirectToBooking1;
		vm.redirectToClinicBooking = redirectToClinicBooking;
		var registerEvents = registerEvents;
		var calcViewPort = calcViewPort;
		var initDatepicker = initDatepicker;
		var initDatepicker1 = initDatepicker1;

		vm.checktimeslot = checktimeslot;
		vm.checkHomeDataFilled = checkHomeDataFilled;
		vm.swipeleft = swipeleft;
		vm.swiperight = swiperight;
		vm.toggleFaq = toggleFaq;
		vm.redirectToPhysioExperts = redirectToPhysioExperts;
		vm.redirectToFaq = redirectToFaq;
		vm.closeDrawerMenu = closeDrawerMenu;
		vm.setSpecializationFlag = setSpecializationFlag;
		vm.setEventsFlag = setEventsFlag;
		vm.navigateToHome = navigateToHome;
		vm.scrolltodiv = scrolltodiv;
		vm.faqScrolltodiv = faqScrolltodiv;
		vm.openPrivacyPolicy = openPrivacyPolicy;
		vm.openTermsOfUse = openTermsOfUse;
		vm.scrollToTopBookNow = scrollToTopBookNow;
		vm.cityMap = {};

		vm.redirectToBookingClinic = redirectToBookingClinic;
		vm.getCities = getCities;
		vm.getCities();
		vm.cities = '';
		vm.getClinics = getClinics;
		vm.clinics = '';
		vm.city = 'pune';
		var initDatepicker2 = initDatepicker2;
		//vm.initClinicPicker = initClinicPicker;
		vm.clinicSelected = clinicSelected;
		

		vm.specializationFlag = false;
		vm.EventsFlag = false;
		/*===Variable declaration===*/
		vm.scrolltodivName = '';
		vm.requestACallbackErrorMessage = '';
		vm.requestACallbackRefNum = '';
		vm.exp = 1;
		vm.selectedLocation = "Choose Location";
		vm.zonePrice = 0;
		vm.baseArray = [];
		//vm.initLocalities();
		var screenWidth = 0;
		vm.viewPort = '';
		vm.selectedDate = '';
		vm.selectedDateClinic = '';
		var cache = {};
		vm.locationArr = [];
		$scope.locationArray = [];
		$scope.currentState = '';
		var enableDatesArray = [];
		vm.acRefresh = false;
		vm.physiotherapyId;
		vm.timeslot = '';
		vm.timeslotClinic = '';
		vm.apptCost = '';
		vm.navMenuItems = {
			'home': 'Home',
			'about': 'About Us',
			'contact': 'Contact Us'
		};

		vm.callmeInputs = {};
		vm.footerCompanyItems = {
			'about': 'About Us',
			'faq': 'Frequently Asked Questions',
			'tou': 'Terms of Use',
			'pPolicy': 'Privacy Policy'
		};
		
		vm.sliderImagesForSmallScreens = [
			{
				imgUrl: './images/customer_portal/back_hero2_1_320_sml.jpg',
				heading1: 'Heal Your Pain',
				heading2: 'Feel Awesome Again',
				subtext: 'Expert Physios<br /> At Your Door <br /> <span class="sancheti-subtext2-mobile">Endorsed by Sancheti.</span> <img class="sancheti-subtext-logo-mobile" src="./images/customer_portal/sancheti_sml_logo.png" />',
				classes: 'item active'
			}/*,
			{
				imgUrl: './images/customer_portal/back_hero2_320_sml.png',
				heading1: 'High Quality Physiotherapy',
				heading2: 'Endorsed by Sancheti',
				subtext: '<img class="sancheti-subtext-logo" src="./images/customer_portal/sancheti_sml_logo.png" />India\'s Premier Orthopaedic Institute',
				classes: 'item'
			}*/
		];
		vm.sliderImagesForTabletScreens = [
			{
				imgUrl: './images/customer_portal/back_hero2_768_sml.png',
				heading1: 'High Quality Physiotherapy',
				heading2: 'Endorsed by Sancheti',
				subtext: '<img class="sancheti-subtext-logo" src="./images/customer_portal/sancheti_sml_logo.png" />India\'s Premier Orthopaedic Institute',
				classes: 'item active'
			},
			{
				imgUrl: './images/customer_portal/back_hero_768_sml.png',
				heading1: 'Heal Your Pain',
				heading2: 'Feel Awesome Again',
				subtext:  'Expert Physiotherapists at your door',
				classes: 'item'
			}
		];
		vm.sliderImagesForLargeScreens = [
			{
				imgUrl: './images/customer_portal/back_hero2_992_sml.png',
				heading1: 'High Quality Physiotherapy',
				heading2: 'Endorsed by Sancheti',
				subtext: '<img class="sancheti-subtext-logo" src="./images/customer_portal/sancheti_sml_logo.png" />India\'s Premier Orthopaedic Institute',
				classes: 'item active'
			},
			{
				imgUrl: './images/customer_portal/back_hero_992_sml.png',
				heading1: 'Heal Your Pain',
				heading2: 'Feel Awesome Again',
				subtext: 'Expert Physiotherapists at your door',
				classes: 'item'
			}
		];
		vm.sliderImagesForExtraLargeScreens = [
			{
				imgUrl: './images/customer_portal/back_hero2_1200_sml.png',
				heading1: 'High Quality Physiotherapy',
				heading2: 'Endorsed by Sancheti',
				subtext: '<img class="sancheti-subtext-logo" src="./images/customer_portal/sancheti_sml_logo.png" />India\'s Premier Orthopaedic Institute',
				classes: 'item active'
			},
			{
				imgUrl: './images/customer_portal/back_hero_1200_sml.png',
				heading1: 'Heal Your Pain',
				heading2: 'Feel Awesome Again',
				subtext: '<h1>Expert Physiotherapists at your door</h1>',
				classes: 'item'
			}
		];
		vm.selectedLocation = {
			"zoneid": "",
			"zonename": "",
			"pin": "",
			"pincodeid": "",
			"localities": "",
			"val": "",
			"price":0,
			"cityId":"",
		};

		vm.selectedLocationClinic = {
			"zoneid": "",
			"zonename": "",
			"pin": "",
			"pincodeid": "",
			"localities": "",
			"val": ""
		};


		vm.timeslotArray = [];
		vm.timeslotArrayClinic = [];
		vm.arrayActiveCityList = [];

		/* FAQ questions */
		vm.groups = [
			/*{
			  title: "How will physiotherapy help me?",
			  content: "Do any of the the following apply to you:"+
					"<ul>"+
					"<li>You are suffering from pain in your neck, back, knee, shoulder, ankle or some other joint, muscle or ligament.</li>"+
					"<li>The pain is chronic or has come about recently. It is the result of an injury, your lifestyle or an age related degenerative condition.</li>"+
					"<li>You have recently had an orthopedic surgery</li>"+
					"</ul>"+
					"If any of the above describe your condition, you might benefit from Physiotherapy. To know more about what Physiotherapy is, <a href ui-sref=\"homepages.faq({scrollTo: 'physiotherapy'})\">click here</a>",
			  open: false
			},
			{
			  title: "Do I Need a Doctor\'s referral to see a Physiotherapist",
			  content: "<p>You don’t require a referral to see a physiotherapist. HealYos Physiotherapists undergo intensive training as per current international best practice, so that we have the necessary skills to examine, DIAGNOSE, treat and advise our patients with no previous input or referral from a doctor.</p>"+
				"<p>If, upon examination, your condition needs the intervention of another medical practioner, we will inform you accordingly.</p>"+
				"<p>In case your doctor had recommended physiotherapy to you, we can work closely with your doctor to optimize your care.</p>",
			  open: false
			},
			{
			  title: "How much will each physiotherapy session cost?",
			  content: "<p>Each physiotherapy session is currently priced at Rs. 499. You might be eligible for a special price if you have received a promo code, or you have a condition that requires you to have more than <u>10 sessions</u> or <u>30 sessions</u>. Please call our Customer Care at 020-65802802 to know more about these long term physiotherapy packages.</p>",
			  open: false
			},
			{
			  title: "What will be the time taken for each physiotherapy session?",
			  content: "<p>The initial assessment session usually lasts between 45 minutes to an hour. Thereafter, depending the treatment regimen decided by your physio, treatment sessions will be for a minimum of 30 minutes, but usually average between 40 to 50 minutes.<p>",
			  open: false
			},
			{
			  title: "Can I choose my physiotherapist?",
			  content: "<p>All our physiotherapists are handpicked after an intense screening process and trained rigorously. For your initial assessment visit, we assign a qualified physio expert to you. Based on the assessment of your condition, we match your treatment requirement with an appropriate physiotherapist, who might sometimes be the same person as your assessment physiotherapist.</p>",
			  open: false
			},
			{
			  title: "<span id=\"physiotherapy\">What is physiotherapy? Who are Physiotherapists?</span>",
			  content: "<p>Physiotherapy is a <strong>medical discipline</strong>. In India, physiotherapists take the common entrance tests just like specialists in other medical fields, and then undergo <u><strong>4.5 years of education to get their Bachelors degree</strong></u>, the BPT (Bachelor’s in Physiotherapy). A Masters in Physiotherapy ( MPT)  degree can last between 1-3 years. <i>Physiotherapists are experts in human movement and function, with deep understanding of the structure and working of the human body</i>. They use a variety of techniques e.g. Manual Therapy, Exercise Therapy, Dry Needling etc, to assist their patients. They work collaboratively with patients to free them of pain and to conquer specific problems with physical motion that hinder normal daily activity and reduce overall quality of life. (Adapted from definitions by the Australian Physiotherapy Association and the World Confederation for Physical Therapy).</p>",
			  open: false
			},
			{
			  title: "How is physiotherapy different from massage?",
			  content: "<p>Physiotherapy is not massage. A massage training course lasts between a few weeks to six months. A BPT Physiotherapist trains for 4.5 years. A Masters in Physiotherapy trains for 6-7 years to receive their university recognised degrees. Physiotherapy is a medical requirement for rectifying underlying problems whereas Massage is primarily used for relaxation and rejuvenation. Physiotherapists use a variety of techniques to diagnose, assess and treat their patients. They address these concerns primarily through corrective exercises. In addition they may use electrotherapeutic modalities e.g. Ultrasound, Interferential Therapy (IFT). Several Physiotherapists also undergo specialist training such as Mulligans Manual Therapy, Maitland Manual Therapy, Taping, etc.</p>",
			  open: false
			},
			{
			  title: "What can I expect in my HealYos physiotherapy sessions?",
			  content: "<p>Your first session with Healyos is an assessment session, where your physiotherapist understands your history, diagnoses your condition, and sets up a treatment plan that aligns with the outcomes you seek from your treatment.</p>"+
			  	"<p>Your treatment begins from your second session, where your physiotherapist uses a range of specialist techniques, continually making adjustments to the treatment plan based on your response. <i>You can also expect some homework from your physiotherapist, such as some body movements, exercises and lifestyle modifications, that not only enhance and maintain the effect of the treatment, they prevent recurrence of the original problem.</i></p>",
			  open: false
			},
			{
			  title: "Can I rebook the same physiotherapist?",
			  content: "<p>If you have started treatment with a physiotherapist, we will try ensure that the same physiotherapist comes to you till the end of your treatment cycle.</p>",
			  open: false
			},
			{
			  title: "What should I wear for my physiotherapy session?",
			  content: "<p>We recommend you wear loose and comfortable clothes for your physiotherapy appointment.</p>",
			  open: false
			},
			{
			  title: "How can I reschedule or cancel my HealYos Physiotherapy Appointment?",
			  content: "<p>The fastest way to reschedule or cancel your HealYos appointment is to call your physiotherapist and request them to move/cancel your appointment. You can also call our call-centre at 020-65802802 between 9.00 am to 9.00 p.m. (Sat-Sun 9.00 am – 6.00 p.m.) and our Customer Care executive should be able to help you.</p>",
			  open: false
			}*/
		];

		/*++++++++++++++++++++++++++++FUCNTIONS++++++++++++++++++++++++++++++*/

		$(document).ready(function() {
			$(window).resize(function() {
				calcViewPort();
			});
		});

		function swipeleft() {
			/*alert("left");*/
			if(vm.exp == 1) {
				vm.exp = 3;
			} else {
				vm.exp = vm.exp - 1;
			}
		}

		function swiperight() {
			/*alert("right");*/
			if(vm.exp == 3) {
				vm.exp = 1;
			} else {
				vm.exp = vm.exp + 1;
			}
		}
		/*
		* Function to check whether book now data on home page is filled.
		* If yes then redirect to the booking urls.
		* If not then redirect to home url which performs anonymous login.
		*/
		function checkHomeDataFilled() {
			if (vm.flags.booknowSectionfieldsValid != true) {
				//$state.go('home');
				window.location = "/web/CustPortal/";
			}
		}
		
		/*
		* Function to redirect to the booking 1 screen.
		* It passes the booknow parameters - locality, date, timezone to booking screen1.
		* These values are set in the new header for booking1 screen.
		*/
		function redirectToBooking1() {
			// InitiateCheckout
			// Track when people enter the checkout flow (ex. click/landing page on checkout button)
			console.log(vm.selectedLocation);
			try {
				fbq('track', 'InitiateCheckout');
			} catch(err) {}

			// Google Analytics - 'Book My Session' event
			try {
				ga('send', 'event', 'Book My Session', 'click');
			} catch(err) {}
			
			/*vm.fromDt = $('.dt1').val();*/
			if(vm.selectedLocation != 'Choose Location' && 
				(vm.selectedDate != undefined || vm.selectedDate != "") &&
				 (vm.timeslot != "Select Time")) {
				var obj = {
					location: vm.selectedLocation,
					date: vm.selectedDate,
					datesEnabled: enableDatesArray,
					timeslot: vm.timeslot,
					timeslotArray: vm.timeslotArray,
					//cityid: cache.cityToIdMap["Pune"],
					cityid: $scope.activeCityId,
					//apptCost: vm.apptCost
					apptCost:vm.zonePrice
				};

				vm.flags.booknowSectionfieldsValid = true;
				custportalGetSetService.setBooknowObj(obj);
				$cookies.put('booking_session', 'in_progress', { path: "/"});
				$state.go('booking1');
			} else {
				vm.flags.booknowSectionfieldsValid = false;
				vm.flags.bookNowError = true;
				$timeout(function () { vm.flags.bookNowError = false; }, 5000);
				//alert("Please fill the Booking Details to proceed.");
			}
		}


		function redirectToClinicBooking() {
			// InitiateCheckout
			// Track when people enter the checkout flow (ex. click/landing page on checkout button)
			try {
				fbq('track', 'InitiateCheckout');
			} catch(err) {}

			// Google Analytics - 'Book My Session' event
			try {
				ga('send', 'event', 'Book My Session', 'click');
			} catch(err) {}
			
			/*vm.fromDt = $('.dt1').val();*/

			$scope.clinicName = '';
			$scope.clinicPrice = '';
			$scope.clinicAddress = '';

			if(vm.clinics != null && 
				(vm.selectedDateClinic != undefined || vm.selectedDateClinic != "") &&
				 (vm.timeslotClinic != "Select Time") && vm.selectedLocationClinic != "Select Location") {

                for(var i = 0;i < $scope.clinicArr.length ; i++){
                	//console.log($scope.clinicArr[i]);

                	if($scope.clinicArr[i]._id == vm.clinics){
                		$scope.clinicName=$scope.clinicArr[i].clinic_name;
                		$scope.clinicPrice=$scope.clinicArr[i].clinic_base_price;
                		$scope.clinicAddress=$scope.clinicArr[i].clinic_address;
                	}
    	
                }

				var obj = {
					location: vm.selectedLocationClinic,
					date: vm.selectedDateClinic,
					datesEnabled: enableDatesArray,
					timeslot: vm.timeslotClinic,
					timeslotArray: vm.timeslotArrayClinic,
					cityid: cache.cityToIdMap["Pune"],
					apptCost: $scope.clinicPrice,
					clinic_id:vm.clinics,
					clinic_address:$scope.clinicAddress,
					clinic_name:$scope.clinicName,
				};
				vm.flags.booknowSectionfieldsValid = true;
				custportalGetSetService.setBooknowObj(obj);
				$cookies.put('booking_session', 'in_progress', { path: "/"});
				$state.go('booking1');
			} else {
				vm.flags.booknowSectionfieldsValid = false;
				vm.flags.bookNowError = true;
				$timeout(function () { vm.flags.bookNowError = false; }, 5000);
				//alert("Please fill the Booking Details to proceed.");
			}
		}



        function getCities(){

        	var city = [];
		    var city1 = [];
            
	        custApi.getCities("India")
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
			})
			.error(function(data, status, headers, config) {
				$scope.checkSessionTimeout(data);
			});
        	
        }	


        function getClinics(cityId){

        	$scope.clinicArrList =[];
	    	custApi.getClinics(cityId)
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
		
			
			})
			.error(function(data, status, headers, config) {
				$scope.checkSessionTimeout(data);
			});
        	
        }

       /* function initClinicPicker(){
        	initDatepicker2();
        }*/


        //This function will redirect page to clinic booking:kalyani patil
		function redirectToBookingClinic(){

			initDatepicker2();
			vm.cities = 'Select City';
			vm.clinics = 'Select Clinic';
			vm.timeslotClinic = 'Select Time';
			vm.timeslotArrayClinic = [];
			vm.selectedLocationClinic = [];
            
			 ngDialog.openConfirm({
		            template: 'ClinicDialog',
		            showClose:false,
		            scope: $scope 
		        }).then(function(value)
		        {
                   //vm.initCustPortal();
                   //console.log(vm.clinics);
                   //console.log(vm.selectedDateClinic);
                   //console.log(vm.timeslotClinic);
                   vm.redirectToClinicBooking();
                       
		        },
		        function(value) {
		            console.log("Fail clinic transaction.");
		        });


		}

		/*
		* Function to initialize customer portal
		*/
		function initCustPortal() {
			/* check if sid is available or not */
			if($cookies.get('u_sid') != undefined) {
				/* sid is available */
				
				/* check if sid is valid or not */
				custApi.checkSessionValid()
				.success(function(data, status, headers, config) {
					if(data.error == undefined) {
						var typeObj = data.payload.type;
						if(typeObj == 3) {
							$cookies.put('u_type', typeObj, { path: "/"});
							vm.getServicesList();
						}
					}
				}).error(function(data, status, headers, config) {
					console.log("error response: " + data.error.message);
					anonymousLogin();
				});
			}
			else {
				/* sid not available hence login implicitly */
				anonymousLogin();
			}
			vm.selectedLocation = "Choose Location";
			vm.timeslot = "Select Time";
			vm.timeslotClinic = "Select Time";
			//vm.initLocalities();
			registerEvents();
			initDatepicker();
			initDatepicker1();
			//initDatepicker2();
			
		} /* initCustPortal() END */

		function initCurrentState() {	
			vm.initLocalities();		
			/*if (window.navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function (position) {
						var lat 	 = position.coords.latitude,
						lng 	 = position.coords.longitude,
						latlng 	 = new google.maps.LatLng(lat, lng),
						geocoder = new google.maps.Geocoder();
						geocoder.geocode({'latLng': latlng}, function(results, status) {
						if (status == google.maps.GeocoderStatus.OK) {
							if (results[1]) {
								for (var i = 0; i < results.length; i++) {
									if (results[i].types[0] === "locality") {
										//var state = results[i].address_components[0].long_name;
										$scope.currentState = results[i].address_components[0].long_name;
										var city = results[i].address_components[0].short_name;
										//$("input[name='location']").val(city + ", " + state);
										//console.log(results[i]);
										if(city == 'Pune' || city == 'pune' || city == 'PUNE'){
											vm.city = 'pune';
										}else if(city == 'Delhi' || city == 'delhi' || city == 'DELHI' || (city.indexOf("delhi") != -1) || (city.indexOf("Delhi") != -1)) {
											vm.city = 'delhi';
										}else{
											vm.city = 'pune';
										}

										//cpc.activeCity = 'pune';
										vm.initLocalities();
									}
								}
							}
							else {console.log("No reverse geocode results.")}
						}
						else {console.log("Geocoder failed: " + status)}
					});
				},
				function() {console.log("Geolocation not available.")},
				 {timeout: 30000, enableHighAccuracy: true, maximumAge: 75000});
				vm.initLocalities();				
			}*/

		}

		/*
		* Resgister jquery events
		*/
		function registerEvents() {
			/*calculating window width*/			
			calcViewPort();
		}

		/*
		* Calculate viewport size and set appropriate value
		*/
		function calcViewPort() {
			screenWidth = $( document ).width();
			$timeout(function() {
				if(screenWidth <= 480) { //mobile
					vm.viewPort = 'Mobile';
					/*vm.baseArray = [];
					vm.baseArray = vm.sliderImagesForSmallScreens;*/
				} else if(screenWidth >= 481 && screenWidth <= 991) { //tablet
					vm.viewPort = 'Tablet';
					/*vm.baseArray = [];
					vm.baseArray = vm.sliderImagesForTabletScreens;*/
				} else if(screenWidth >= 992 && screenWidth <= 1199) { //small desktop
					vm.viewPort = 'Desktop';
					/*vm.baseArray = [];
					vm.baseArray = vm.sliderImagesForLargeScreens;*/
				} else if(screenWidth >= 1200) {
					vm.viewPort = 'extraLarge';
					/*vm.baseArray = [];
					vm.baseArray = vm.sliderImagesForExtraLargeScreens;*/
				}
				$scope.$apply();
			}, 200)
			
		}

		/*
		* Function to initialize datepicker. 
		* It as 2 instances ie. In header & footer.
		* If only 1 instance found then call the function again in timeout.
		*/
		function initDatepicker() {
			//console.log('first' + $('#dt1').length);

			if($('#dt1').length != 1) {
				$timeout(initDatepicker, 50);
				//console.log("inside datepicker");
				return;
			}
			$('#dt1').datetimepicker({
				/*defaultDate: new Date(),*/
				format: 'DD-MM-YYYY'
			});
			vm.fromMonthDate = moment(new Date()).format("YYYYMM");
			$("#dt1").data("DateTimePicker").enabledDates([new Date('1970/1/1')]);

			/* Event called when month is changed */
			$("#dt1").on("dp.update", function (e) {
				vm.fromMonthDate = e.viewDate.format("YYYYMM");
				/*var getdate = $('.dt1').val();
				$('.dt1').data('DateTimePicker').date(moment(getdate, 'DD-MM-YYYY'));*/
				/* If location not Pune then check 'available dates' for the month */
				if(vm.selectedLocation != 'Choose Location') {
					custApi.checkAvailableDatesInMonth(3, vm.fromMonthDate, vm.selectedLocation.pincodeid, vm.selectedLocation.zoneid, vm.physiotherapyId).
					success(function (data, status, header, config) {
						console.log("Available dates retrieved successfully");
						
						/* Enabling available dates */
						var i=0;
						enableDatesArray = [];
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
						if(enableDatesArray.length != 0) {
							vm.flags.datesNotAvailable = false;
							$("#dt1").data("DateTimePicker").enabledDates(enableDatesArray);
							$("#dt2").data("DateTimePicker").enabledDates(enableDatesArray);
						} else {
							vm.flags.datesNotAvailable = true;
							$timeout(function () { vm.flags.datesNotAvailable = false; }, 5000);
							$("#dt1").data("DateTimePicker").enabledDates([new Date('1970/1/1')]);
							$("#dt2").data("DateTimePicker").enabledDates([new Date('1970/1/1')]);
						}
						
					}).
					error(function (data, status, header, config) {
						console.log("Error in retrieving available dates");
					});
				}
			});

			/*
			* Event called when date is changed 
			*/
			$("#dt1").on("dp.change", function (e) {
				vm.fromDate = e.date.format("YYYYMMDD");
				$("#dt2").data("DateTimePicker").date(e.date);
				vm.selectedDate = e.date;
				/* For available date retrieve 'available time' slots */
				if(vm.selectedLocation != 'Choose Location') {
					custApi.fetchAvailableSlotsForDay(vm.fromDate, vm.selectedLocation.zoneid, vm.physiotherapyId, vm.selectedLocation.pincodeid).
					success(function (data, status, header, config) {
						console.log("Available slots retrieved successfully");
						console.log("Slots:");
						console.log(data);
						vm.timeslotArray = [];
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
							vm.timeslotArray.push({starttime: timeformat});
						});
					}).
					error(function (data, status, header, config) {
						console.log("Error in retrieving available slots");
					});
				}            	
			});
		}


		/*
		* Function to initialize datepicker. 
		* It as 2 instances ie. In header & footer.
		* If only 1 instance found then call the function again in timeout.
		*/
		function initDatepicker1() {
			//console.log('second'+ $('#dt2').length);

			if($('#dt2').length != 1) {
				$timeout(initDatepicker1, 50);
				//console.log("inside datepicker");
				return;
			}
			$('#dt2').datetimepicker({
				/*defaultDate: new Date(),*/
				format: 'DD-MM-YYYY'
			});
			vm.fromMonthDate = moment(new Date()).format("YYYYMM");
			$("#dt2").data("DateTimePicker").enabledDates([new Date('1970/1/1')]);

			/* Event called when month is changed */
			$("#dt2").on("dp.update", function (e) {
				vm.fromMonthDate = e.viewDate.format("YYYYMM");
				/*var getdate = $('.dt1').val();
				$('.dt1').data('DateTimePicker').date(moment(getdate, 'DD-MM-YYYY'));*/
				/* If location not Pune then check 'available dates' for the month */
				if(vm.selectedLocation != 'Choose Location') {
					custApi.checkAvailableDatesInMonth(3, vm.fromMonthDate, vm.selectedLocation.pincodeid, vm.selectedLocation.zoneid, vm.physiotherapyId).
					success(function (data, status, header, config) {
						console.log("Available dates retrieved successfully");
						
						/* Enabling available dates */
						var i=0;
						enableDatesArray = [];
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
						if(enableDatesArray.length != 0) {
							vm.flags.datesNotAvailable = false;
							$("#dt2").data("DateTimePicker").enabledDates(enableDatesArray);
						} else {
							vm.flags.datesNotAvailable = true;
							$timeout(function () { vm.flags.datesNotAvailable = false; }, 5000);
							$("#dt2").data("DateTimePicker").enabledDates([new Date('1970/1/1')]);
						}
						
					}).
					error(function (data, status, header, config) {
						console.log("Error in retrieving available dates");
					});
				}
			});

			/*
			* Event called when date is changed 
			*/
			$("#dt2").on("dp.change", function (e) {
				vm.fromDate = e.date.format("YYYYMMDD");
				$("#dt1").data("DateTimePicker").date(e.date);
				vm.selectedDate = e.date;
				/* For available date retrieve 'available time' slots */
				if(vm.selectedLocation != 'Choose Location') {
					custApi.fetchAvailableSlotsForDay(vm.fromDate, vm.selectedLocation.zoneid, vm.physiotherapyId, vm.selectedLocation.pincodeid).
					success(function (data, status, header, config) {
						console.log("Available slots retrieved successfully");
						//console.log("Slots:");
						//console.log(data);
						vm.timeslotArray = [];
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
							vm.timeslotArray.push({starttime: timeformat});
						});
					}).
					error(function (data, status, header, config) {
						console.log("Error in retrieving available slots");
					});
				}            	
			});
		}
		/* END of DATEPICKER2*/

        //date picker for clinic:kalyani patil
		function initDatepicker2() {

			//console.log('Mine'+ $('#dt3').length);

			if($('#dt3').length != 1) {
				$timeout(initDatepicker2, 50);
				//console.log("inside datepicker");
				return;
			}

			$('#dt3').datetimepicker({
				/*defaultDate: new Date(),*/
				format: 'DD-MM-YYYY'
			});
			vm.fromMonthDate = moment(new Date()).format("YYYYMM");
			$("#dt3").data("DateTimePicker").enabledDates([new Date('1970/1/1')]);
            

			/* Event called when month is changed */
			$("#dt3").on("dp.update", function (e) {
				vm.fromMonthDate = e.viewDate.format("YYYYMM");
				/*var getdate = $('.dt1').val();
				$('.dt1').data('DateTimePicker').date(moment(getdate, 'DD-MM-YYYY'));*/
				/* If location not Pune then check 'available dates' for the month */
				if(vm.clinics != 'null') {
					custApi.checkAvailableDatesInMonthClinic(3, vm.fromMonthDate, vm.clinics, vm.physiotherapyId).
					success(function (data, status, header, config) {
						console.log("Available dates retrieved successfully");
						
						/* Enabling available dates */
						var i=0;
						enableDatesArray = [];
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
						if(enableDatesArray.length != 0) {
							vm.flags.datesNotAvailable = false;
							$("#dt3").data("DateTimePicker").enabledDates(enableDatesArray);
						} else {
							vm.flags.datesNotAvailable = true;
							$timeout(function () { vm.flags.datesNotAvailable = false; }, 5000);
							$("#dt3").data("DateTimePicker").enabledDates([new Date('1970/1/1')]);
						}
						
					}).
					error(function (data, status, header, config) {
						console.log("Error in retrieving available dates");
					});
				}
			});

/*
			* Event called when date is changed 
			*/
			$("#dt3").on("dp.change", function (e) {
				vm.fromDate = e.date.format("YYYYMMDD");
				//$("#dt2").data("DateTimePicker").date(e.date);
				vm.selectedDateClinic = e.date;
				/* For available date retrieve 'available time' slots */
				if(vm.clinics != 'null') {
					custApi.fetchAvailableSlotsForDayClinic(vm.fromDate, vm.clinics, vm.physiotherapyId ).
					success(function (data, status, header, config) {
						console.log("Available slots retrieved successfully");
						console.log("Slots:");
						console.log(data);
						vm.timeslotArrayClinic = [];
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
							vm.timeslotArrayClinic.push({starttime: timeformat});
						});
					}).
					error(function (data, status, header, config) {
						console.log("Error in retrieving available slots");
					});
				}            	
			});

			
		}
		/* END of DATEPICKER3*/

		/*
		* Function used to perform anonymous login for customer portal
		*/
		function anonymousLogin () {
			var dataObj = {
				"username": "anonymous/healyos",
				"password": "healyos123"
			};
		
			custApi.performAnonymousLogin(dataObj)
			.success(function (data, status, headers, config) {
				if(data.error == undefined) {
					var sidObj = data.sid;
					var emailObj = data.payload.email;
					var idObj = data.payload.id;
					var name = data.payload.fullname;
					$cookies.put('u_sid', sidObj, { path: "/"});
					$cookies.put('u_apikey', 'f4205eb9-d441-499d-a045-734c34ccbf7a', { path: "/"});
					$cookies.put('u_email', emailObj, { path: "/"});
					$cookies.put('u_id', idObj, { path: "/"});
					$cookies.put('u_name', name, { path: "/"});
					$cookies.put('u_type', 3, { path: "/"});
					vm.getServicesList();
				}
			})
			.error(function (data, status, headers, config) {
				console.log("error in Login");
			});
		}


		function getSelectedCity() {

			//alert(vm.activeCity);
			//console.log(vm.locationArr);
			//vm.selectedLocation = "Choose Location";
			//vm.timeslot = "Select Time";
			//vm.timeslotClinic = "Select Time";
			$scope.activeCityId = vm.activeCity;
			vm.locationArr = [];
			$scope.locationArray = [];
			custApi.getZones(vm.activeCity)
			.success(function(data, status, headers, config){
				var dataArray = [];
				dataArray = data.payload;
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
                                "cityId": vm.activeCity
                            };
                            vm.locationArr.push(locationObj);
                            $scope.locationArray.push(locationObj);
                            vm.locationArr.sort(compare);
                        }
					}
                  }
				}
				vm.acRefresh = false;
				custportalGetSetService.setLocalityObj(vm.locationArr);
			})
			.error(function(data, status, headers, config){
				console.log("Error in getting Zones");
			});

			//vm.initCustPortal();
			//console.log($scope.locationArray);

		}

		/*
		* Function to initialize Pune Localities in dropdown
		*/
		function initLocalities() {
			$scope.arrayActiveCity = [];
			vm.arrayActiveCityList = [];

			//alert('localities');
			//alert($scope.currentState);
			//alert(vm.city);

			custApi.getCity(true).
			success(function (data, status, headers, config) {
				var arrStoreTrue = [];

				var arrStoreTrue = data.payload;
				vm.arrayActiveCityList = data.payload;
				console.log("successfully received cities");
				//console.log(arrStoreTrue);

				arrStoreTrue.forEach(function(item) {
					$scope.arrayActiveCity.push(item);
					if(item.city_name==vm.city){
						$scope.activeCityId = item._id;
						vm.activeCity = $scope.activeCityId;
						
						//custApi.getZones(vm.activeCity)
						custApi.getZones(item._id)
						.success(function(data, status, headers, config){
						/*$scope.zonesList = buildZonesList(data.payload);
						cache.zoneIdToNameMap = buildZoneIdToNameMap(data.payload);*/
						vm.locationArr = [];
						$scope.locationArray = [];
						var dataArray = data.payload;
						//console.log(dataArray);
						for(var i = 0 ; i < dataArray.length ; i++) {                            
                            //change to show only zones which are not deleted               
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
                                        "cityId": vm.activeCity
                                    };
                                    vm.locationArr.push(locationObj);
                                    $scope.locationArray.push(locationObj);
                                    vm.locationArr.sort(compare);
                                }
							}
                          }
						}
						vm.acRefresh = false;
						custportalGetSetService.setLocalityObj(vm.locationArr);
					})
					.error(function(data, status, headers, config){
						console.log("Error in getting Zones");
					}); /*adminApi.getZones END*/	
					}
				});
			}).
			error(function (data, status, headers, config) {
				console.log("Error in receiving cities");
			});

			/*custApi.getCities("India")
			.success(function(data, status, headers, config){
				cache.cityToIdMap = buildCitiesToIdMap(data.payload);
				console.log(arrStoreTrue);
				vm.cityMap = cache.cityToIdMap;
				cache.cityIdToNameMap = buildCitiesIdToNameMap(data.payload);
				cache.cityIdToStateMap = buildCityIdToStateMap(data.payload);
				custApi.getZones(cache.cityToIdMap["Pune"])
					.success(function(data, status, headers, config){*/
						//$scope.zonesList = buildZonesList(data.payload);
						//cache.zoneIdToNameMap = buildZoneIdToNameMap(data.payload);*/
				/*		vm.locationArr = [];
						var dataArray = data.payload;
						for(var i = 0 ; i < dataArray.length ; i++) {                            
                            //change to show only zones which are not deleted               
                        if(!dataArray[i].hasOwnProperty("deleted") || dataArray[i].deleted === false) {
							var zoneid = dataArray[i].zoneid;
							var zonename = dataArray[i].zonename;
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
                                        "val": pincodeVal + " " + localitiesVal
                                    };
                                    vm.locationArr.push(locationObj);
                                    vm.locationArr.sort(compare);
                                }
							}
                          }
						}
						vm.acRefresh = false;
						custportalGetSetService.setLocalityObj(vm.locationArr);
					})
					.error(function(data, status, headers, config){
						console.log("Error in getting Zones");
					}); /*adminApi.getZones END*/
			/*})
			.error(function(data, status, headers, config){
				console.log("Failed to get Cities");
			});*/
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
		* function to get location array
		*/
		function getAllLocations(callback) {
			callback(vm.locationArr);
		};

		/*
		* function for location selected
		*/
		function locationSelected(value) {
			
			vm.zonePrice = value.price;
			vm.selectedLocation = value;
			if($("#dt1").data("DateTimePicker").date() != null) {
				vm.fromMonthDate = $("#dt1").data("DateTimePicker").date().format("YYYYMM");
			}
			else {
				vm.fromMonthDate = moment(new Date()).format("YYYYMM");
			}
			/* API call to check available dates */
			custApi.checkAvailableDatesInMonth(3, vm.fromMonthDate, value.pincodeid, value.zoneid, vm.physiotherapyId).
			success(function (data, status, header, config) {
				console.log("Available dates retrieved successfully");
				console.log(data);
				/* Enabling available dates */
				var i=0;
				enableDatesArray = [];
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
				if(enableDatesArray.length != 0) {
					vm.flags.datesNotAvailable = false;
					$("#dt1").data("DateTimePicker").enabledDates(enableDatesArray);
					$("#dt2").data("DateTimePicker").enabledDates(enableDatesArray);
				} else {
					vm.flags.datesNotAvailable = true;
					$timeout(function () { vm.flags.datesNotAvailable = false; }, 5000);
					$("#dt1").data("DateTimePicker").enabledDates([new Date('1970/1/1')]);
					$("#dt2").data("DateTimePicker").enabledDates([new Date('1970/1/1')]);
				}
				
				/* For available date retrieve 'available time' slots */
				if(vm.selectedLocation != 'Choose Location' && vm.fromDate != undefined) {
					custApi.fetchAvailableSlotsForDay(vm.fromDate, vm.selectedLocation.zoneid, vm.physiotherapyId, vm.selectedLocation.pincodeid).
					success(function (data, status, header, config) {
						console.log("Available slots retrieved successfully");
						console.log("Slots:");
						console.log(data);
						vm.timeslotArray = [];
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
							vm.timeslotArray.push({starttime: timeformat});
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
		* function for location selected
		*/
		function clinicSelected(value) {
			//console.log('my:'+value);

			if($("#dt3").data("DateTimePicker").date() != null) {
				vm.fromMonthDate = $("#dt3").data("DateTimePicker").date().format("YYYYMM");
			}
			else {
				vm.fromMonthDate = moment(new Date()).format("YYYYMM");
			}
			/* API call to check available dates */
			custApi.checkAvailableDatesInMonthClinic(3, vm.fromMonthDate, value, vm.physiotherapyId).
			success(function (data, status, header, config) {
				console.log("Available dates retrieved successfully");
				console.log(data);
				/* Enabling available dates */
				var i=0;
				enableDatesArray = [];
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
				if(enableDatesArray.length != 0) {
					vm.flags.datesNotAvailable = false;
					$("#dt3").data("DateTimePicker").enabledDates(enableDatesArray);			
				} else {
					vm.flags.datesNotAvailable = true;
					$timeout(function () { vm.flags.datesNotAvailable = false; }, 5000);
					$("#dt3").data("DateTimePicker").enabledDates([new Date('1970/1/1')]);
				}

				//console.log(vm.fromDate);
				
				/* For available date retrieve 'available time' slots */
				if(vm.clinics != 'null' && vm.fromDate != undefined) {
					console.log('in');
					custApi.fetchAvailableSlotsForDayClinic(vm.fromDate, vm.clinics, vm.physiotherapyId).
					success(function (data, status, header, config) {
						console.log("Available slots retrieved successfully");
						console.log("Slots:");
						console.log(data);
						vm.timeslotArrayClinic = [];
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
							vm.timeslotArrayClinic.push({starttime: timeformat});
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
		* Function to get the list of available problems
		*/
		function getServicesList() {
		
			custApi.getServices().
			success(function (data, status, header, config) {
				console.log("Services retrieved successfully");
				//vm.apptCost = data.payload[0].rate;
				vm.apptCost = vm.zonePrice;
				var serviceMap = buildServicesMap(data.payload);
				vm.physiotherapyId = serviceMap["physiotherapy"];
				custportalGetSetService.setPhysioId({"physioId": vm.physiotherapyId, "apptCost": vm.apptCost});
			}).
			error(function (data, status, header, config) {
				console.log("Error in retrieving services");
			});
		}

		/*
		* Function to show the Callme details div
		*/
		function showCallmeScroll() {
			$(".callme-input-scroll-fields").show( "slide", {direction: "right" }, 1000 );
		}

		/*
		* Function to hide the callme details div
		*/
		function hideCallmeScroll() {
			$(".callme-input-scroll-fields").hide( "slide", {direction: "right" }, 1000 );;
		}

		/*
		* Function for 'Call me back' functionality. API integration for it
		*/
		function submitRequestACallBack() {

			var isRequestCallbackFormValid = validateRequestCallbackForm();
			if(isRequestCallbackFormValid) {

				// Google Analytics - 'Request A Call Back' event
				try {
					ga('send', 'event', 'Request A Call Back', 'click');
				} catch(err) {}

				var obj = {
					'custname': vm.callmeInputs.name,
					'contactno': vm.callmeInputs.phone,
					'customercity': 'Pune'
				}
				custApi.postCallMeBack(obj).
				success(function (data, status, header, config) {
					console.log("Call me back success!");
					vm.requestACallbackRefNum = data.payload.refno;
					vm.flags.requestACallbackSucess = true;
					$timeout(function () { vm.flags.requestACallbackSucess = false; }, 6000);
					vm.hideCallmeScroll();
				}).
				error(function (data, status, header, config) {
					vm.requestACallbackErrorMessage = data.error.message;
					vm.flags.requestACallbackError = true;
					$timeout(function () { vm.flags.requestACallbackError = false; }, 6000);
					console.log("Error in Call me back!");
				});
				console.log(obj);
			} else {
				//alert("Please fill valid Name & Phone number");
				vm.flags.callMeValidationError = true;
				$timeout(function () { vm.flags.callMeValidationError = false; }, 5000);
			}		
		}

		/*
		* Function to validate Call me back request form
		*/
		function validateRequestCallbackForm() {
			var nameError = false;
			var phoneError = false;
			if(!vm.callmeInputs.name || !(/^([0-9A-Za-z]+\s?)+\s*$/).test(vm.callmeInputs.name)) {
				nameError = true;
			} else {
				nameError = false;
			}
			if(!vm.callmeInputs.phone || !(/^\d{10}$/).test(vm.callmeInputs.phone)){
				phoneError = true;
			} else {
				phoneError = false;
			}
			if(nameError == true || phoneError == true) {
				return false;
			} else {
				return true;
			}
		}

		/*function isDrawerOpen() {
			if($("#pure-toggle-left").is(':checked')) {
				$(".pure-toggle-label").css("border","0px");
			} else {
				$(".pure-toggle-label").css("border","2px solid #5d809d");
			}
		}*/

		function checktimeslot() {
			/*alert("hi");
			console.log(vm.timeslot);*/
		}

		/*
		* Function to toggle the testimonial accordian
		*/
		function toggleFaq(event) {
			// $(event.currentTarget).parent().find(".accordion_body").first().toggle();

			if ($(event.currentTarget).parent().find(".accordion_body").first().is(':visible')) {
				$(event.currentTarget).parent().find(".accordion_body").first().slideUp(300);
				$(event.currentTarget).find(".plusminus").text('+');
			}
			else {
				$(event.currentTarget).parent().find(".accordion_body").first().slideDown(300);
				$(event.currentTarget).find(".plusminus").text('-');
			}
		}

		function setSpecializationFlag(){

			//alert('Hi');
			if(vm.specializationFlag == false){
				vm.specializationFlag = true;
			}else{
				vm.specializationFlag = false;
			}
			
		}

		function setEventsFlag(){

			//alert('Hi');
			if(vm.EventsFlag == false){
				vm.EventsFlag = true;
			}else{
				vm.EventsFlag = false;
			}
			
		}


		/*
		* Function to redirect to physioexperts page
		*/
		function redirectToPhysioExperts() {
			$state.go("physioexperts");
		}

		/*
		* Function to redirect to FAQ page
		*/
		function redirectToFaq() {
			$state.go("faq");
		}

		/*
		* Function to close the drawer menu
		*/
		function closeDrawerMenu() {
			$('.pure-toggle-label').click();

		}

		/*
		* Function to redirect to home page.
		* This function is called when clicked on logo
		*/
		function navigateToHome() {
			window.location = "/";
		}

		/*
		* Function to redirect faq page and scroll to the physiotherapy div
		*/
		function scrolltodiv(divname) {
			if(divname = "physiotherapy") {
				$state.go("faq");
				vm.scrolltodivName = "physiotherapy";
			}
		}

		/*
		* Function to scroll to the physiotherapy div
		*/
		function faqScrolltodiv(divname) {
			var element = document.getElementById("physiotherapy");
	        element.scrollIntoView();
		}

		/*
		* Function to open privacy policy page in a different window
		*/
		function openPrivacyPolicy() {
			//$window.open('/web/CustPortal/#/homepages/privacypolicy', 'width=500,height=400');
			$window.open('/CustPortal/privacy_policy.html', 'Privacy Policy', 'scrollbars=yes,width=500,height=500');
		}

		/*
		* Function to open Terms Of Use page in a different window
		*/
		function openTermsOfUse() {
			$window.open('/CustPortal/terms_of_service.html', 'Terms Of Service', 'scrollbars=yes,width=1000,height=700');
		}

		/*
		Function to scroll up to slider book now section
		*/
		function scrollToTopBookNow() {
			//$(window).scrollTop($('.scrolltobooknow').offset().top);
			document.getElementById('scrolltobooknow').scrollIntoView(true);
		}

		vm.initCurrentState();	
		vm.initCustPortal();


	} /* Controller End */

/*})();*/