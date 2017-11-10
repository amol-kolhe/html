
angular.module('myApp.controllers', ['ngCookies', 'ngDialog', 'myApp.timeDirectives', 'acute.select'])
.controller('TabsCtrl',['$filter', '$scope', '$http', '$cookies', '$window', 'Facebook', '$timeout', function($filter, $scope, $http, $cookies, $window, Facebook, $timeout) {

		$scope.signInForm1 = {};
		$scope.signInForm2 = {};
		$scope.signInForm3 = {};
		$scope.signInForm = {};
		$scope.spSignIn = {};
		$scope.adminSignIn = {};
		$scope.patientSignIn = {};
		$scope.financeSignIn = {};
		$scope.adminLogoutSuccess = "";
		$scope.adminLogoutError = "";
		$scope.spLogoutSuccess = "";
		$scope.spLogoutError = "";
		$scope.financeLogoutSuccess = "";
		$scope.financeLogoutError = "";
		$scope.adminNewAppointmentForm = {};
		$scope.users1 = {};
		$scope.users2 = {};
		$scope.adminNewAppointmentCust = {};
		$scope.custSearch = {};
		$scope.custEdit = {};
		$scope.forgotPasswordForm = {};
		$scope.patientUserId = {};
		$scope.resetPasswordForm = {};
		$scope.patientPassword = {};

		$scope.users1.disableFlag = false;
		$scope.boolFlag = false;
		$scope.boolCustFlag = false;
		$scope.refBoolFlag = false;

		$scope.users2.disableFlagCity = false;
		$scope.users2.disableFlagName = false;
		$scope.users2.disableFlagPhone = false;
		$scope.users2.disableFlagEmail = false;
		$scope.sessionFlag = {
			adminSessionTimeoutFlag: false,
			spSessionTimeoutFlag: false,
			financeSessionTimeoutFlag: false
		};

		$scope.notification = {
			servertime: 0, // server time when user has logged in
			interval: 180000, // 3 mins interval to fetch appointments
			timeout: 30000, // Duration for which the notification will rmain on screen. 30 mins
			isSetupDone: false
		};

		$scope.dashboard = {
			today: new Date(),
			appointments: {
				total: 0,
				booked: 0,
				cancelled: 0,
				rescheduled: 0
			},
			unhandledCallMeList: 0
		};
		
		$scope.users1.city = "";
		$scope.users1.name = "";
		$scope.users1.contactNo = "";
		$scope.users1.email = "";

		$scope.actionableAppts = { count : 0 };
		$scope.cancelActionableAppts = { count : 0 };

		$scope.adminAptPayment = {refno : ""};
		$scope.fetched = {Appointment : false};

		$scope.tabs1 = [{title: 'Home', url: 'home.html', glyph: 'glyphicon glyphicon-home'},
			{title: 'About Us', url: '../generic/aboutUs.html', glyph: 'glyphicon glyphicon-info-sign'},
			{title: 'Contact Us', url: '../generic/contactUs.html', glyph: 'glyphicon glyphicon-envelope'}];
        
        $scope.usertabs = [{title: 'Home', url: 'home.html', glyph: 'glyphicon glyphicon-home'},
            {title: 'My Account', url: 'appointments.html', glyph: 'glyphicon glyphicon-user'},
            {title: 'Reports', url: 'appointmentAnalysisReport.html', glyph: 'glyphicon glyphicon-save'},
			{title: 'About Us', url: '../generic/aboutUs.html', glyph: 'glyphicon glyphicon-info-sign'},
			{title: 'Contact Us', url: '../generic/contactUs.html', glyph: 'glyphicon glyphicon-envelope'},
			];
        $scope.userTabsFlg = false;



		$scope.tabs2 = [{title: 'Admin Name'},
			{title: 'Notifications'},
			{title: 'Settings'},
			{title: 'SignOut'}];
		
		$scope.adminMenus = [{title: 'CallMe List', url: 'callMe.html', clsclass: 'clsblack'},
			{title: 'Appointments', url: 'appointments.html', clsclass: 'clsblack'},
			{title: 'New Appointment', url: 'adminNewAppointment.html', clsclass: 'clsblack'},
			{title: 'Customers', url: 'cust.html', clsclass: 'clsblack'},
			// {title: 'Payment', url: 'payments.html', clsclass: 'clsblack'},
			//{title: 'Leave Management', url: 'reports.html', clsclass: 'clsgray'},
			//{title: 'Reports', url: 'reports.html', clsclass: 'clsgray'},
			{title: 'Actionables', url: 'actionables.html', clsclass: 'clsgray'},
			{title: 'Zone Management', url: 'zoneManagement.html', clsclass: 'clsgray'},
			{title: 'Service Provider Management', url: 'spManagement.html', clsclass: 'clsgray'},
			{title: 'Slot Management', url: 'slotManagement.html', clsclass: 'clsgray'},
			{title: 'Promotional Code Management', url: 'promotionalCodeMgmt.html', clsclass: 'clsgray'},
			{title: 'Cost Calculator', url: 'costcalculator.html', clsclass: 'clsgray'},
			{title: 'Clinics Management', url: 'clinicManagement.html', clsclass: 'clsgray'},

			//{title: 'City Management', url: 'cityManagement.html', clsclass: 'clsgray'},

			{title: 'Policy Management', url: 'policyManagement.html', clsclass: 'clsgray'},
			{title: 'Cancel Actionables', url: 'cancel_actionables.html', clsclass: 'clsgray'},
			{title: 'PRBM Form', url: 'prbm_form.html', clsclass: 'clsgray'},			
			//{title: "Appt. Analysis Report", url: 'appointmentAnalysisReport.html'},
			//{title: "Cancellation Report", url: 'cancellationReport.html'},
			//{title: "New Patient Report", url: 'newPatientConversionReport.html'}

			];

		$scope.adminReportMenus = [
			{title: "Appt. Analysis Report", url: 'appointmentAnalysisReport.html'},
			{title: "New Patient Report", url: 'newPatientConversionReport.html'},
			{title: "Cancellation Report", url: 'cancellationReport.html'},
			{title: "Attendance Report", url: 'attendenceReport.html'}

			];	

		$scope.custMenus = [{title: "My Appointments", url: 'appointments.html'},
			{title: "New Appointment", url: 'custNewAppointment.html'}
		];
			
		$scope.spMenus = [{title: "My Appointments", url: 'quickView.html'},
			{title: "Cost Calculator", url: 'costcalculator.html'},
			//{title: "Package View", url: 'packageView.html'},
			{title: "Patient Wallet", url: 'patientWallet.html'},
			{title: "Collection Transactions", url: 'collectionInfo.html'}
		];

		$scope.financeMenus = [
			{title: "Package Cancellations", url: 'quickView.html'},
			{title: "Collection", url: 'collection.html'},
			{title: "Collection Report", url: 'reportFilters.html'},
			{title: "Patient Wallet", url: 'patientWallet.html'}
			
		];
		
		if($cookies.get('u_sid') != undefined) {
			$scope.users1.disableFlag = false;
			$scope.boolFlag = false;
			$scope.boolCustFlag = false;
			$scope.users1.city = "";
			$scope.users1.name = "";
			$scope.users1.contactNo = "";
			$scope.users1.email = "";

			var sidObj = $cookies.get('u_sid');
			var apiKeyObj = $cookies.get('u_apikey');

			//var url =  "http://localhost:8080/healyos-pdt/hrest/session/" + sidObj + "?apikey=" + apiKeyObj;
			var url =  "/healyos-pdt/hrest/v1/session/" + sidObj + "?apikey=" + apiKeyObj;

			var result = $http.get(url);

			result.success(function(data, status, headers, config) {
				if(data.error == undefined) {
					var typeObj = data.payload.type;

					$scope.typeObject = typeObj;

					//alert($scope.typeObject);
					//alert('hii'+ $scope.typeObject);

					if($scope.typeObject != 0){
						$scope.usertabs.splice(2, 1);
					}
					
					if(typeObj == 0) {
						$cookies.put('u_type', typeObj);
						$scope.activeTab = 'Home';
						$scope.pageSource = 'home.html';
						$scope.pageSource1 = "";
						$scope.pageSource2 = 'adminInfoBar.html';
						if(data.payload.currentTime) {
							$scope.notification.servertime = data.payload.currentTime;
							$scope.notification.isSetupDone = false;
						}
					} else if(typeObj == 1) {
						$cookies.put('u_type', typeObj);
						$scope.activeTab = 'My Appointments';
						$scope.pageSource = 'appointments.html';
						$scope.pageSource1 = "leftNavigation.html";
						$scope.pageSource2 = 'custInfoBar.html';
					} else if(typeObj == 2) {
						$cookies.put('u_type', typeObj);
						$scope.activeTab = 'My Appointments';
						$scope.pageSource = 'quickView.html';
						$scope.pageSource1 = "leftNavigation.html";
						$scope.pageSource2 = 'spInfoBar.html';
					} else if(typeObj == 3) {
						$cookies.put('u_type', typeObj);
						$scope.activeTab = 'Package Cancellations';
						$scope.pageSource = 'quickView.html';
						$scope.pageSource1 = "leftNavigation.html";
						$scope.pageSource2 = 'financeInfoBar.html';
						/*if(data.payload.currentTime) {
							$scope.notification.servertime = data.payload.currentTime;
							$scope.notification.isSetupDone = false;
						}*/
					}
				}
			});
			result.error(function(data, status, headers, config) {
				console.log("error response: " + data.error.message);
				$scope.activeTab = 'Home';
				$scope.pageSource = 'home.html';
			});

		} else {
			$scope.activeTab = 'Home';
			$scope.pageSource = 'home.html';
		}
        
        $scope.setUserMenu = function(){
            if($cookies.get('u_type')!=undefined) 
            {
                if($cookies.get('u_type')==0){
                    $scope.activeTab = 'My Account';
                    $scope.pageSource = 'callMe.html';
                    $scope.pageSource1 = "leftNavigation.html";
                    $scope.pageSource2 = 'adminInfoBar.html';
                } else if($cookies.get('u_type') == 1) {
                    $scope.activeTab = 'My Account';
                    $scope.pageSource = 'appointments.html';
                    $scope.pageSource1 = "leftNavigation.html";
                    $scope.pageSource2 = 'custInfoBar.html';
                } else if($cookies.get('u_type') == 2) {
                    $scope.activeTab = 'My Appointments';
                    $scope.pageSource = 'quickView.html';
                    $scope.pageSource1 = "leftNavigation.html";
                    $scope.pageSource2 = 'spInfoBar.html';
                } else if($cookies.get('u_type') == 3){
                    $scope.activeTab = 'Package Cancellations';
					$scope.pageSource = 'quickView.html';
					$scope.pageSource1 = "leftNavigation.html";
					$scope.pageSource2 = 'financeInfoBar.html';
                }
            }
        }
        
		$scope.onClickMenu = function(menu) {

			if(menu.title == 'New Appointment'){
				$scope.users1.disableFlag = false;

				$scope.users1.city = "";
				$scope.users1.name = "";
				$scope.users1.contactNo = "";
				$scope.users1.email = "";
			} else { // psLog: TODO: Check
				$scope.boolFlag = false;
				$scope.boolCustFlag = false;
			}

			$scope.activeTab = menu.title;
			$scope.pageSource = menu.url;
			$scope.refBoolFlag = false;
		}
		
		$scope.onClickSubMenu = function(tab) {
			$scope.pageSource = tab.url;
		}
		if($cookies.get('u_id') != undefined){
            $scope.userTabsFlg = true;
        }
		$scope.onClickHeaderTab = function(tab) {

            if((tab.title=='Home' || tab.title=='My Account') && $cookies.get('u_id') != undefined){
                $scope.setUserMenu(tab.title);
                if(tab.title=='Home'){
                    $scope.activeTab = tab.title;
                    $scope.pageSource = tab.url;
                    $scope.pageSource1 = ""; 
                }
            }else if(tab.title=='Reports'){
            	 $scope.activeTab = 'Reports';
                 $scope.pageSource = tab.url;
                 $scope.pageSource1 = "leftNavigationReport.html"; 
                 
            }else{
                $scope.activeTab = tab.title;
                $scope.pageSource = tab.url;
                $scope.pageSource1 = "";
                $scope.pageSource2 = "";
            }

            var event = new CustomEvent("tab-selection-changed");
            event.data = {
            	title : tab.title
            };
            document.dispatchEvent(event);
		}
		
		$scope.isActive = function(item) {
		   return $scope.selected === item;
		};
		
		$scope.custDetails = function(aa) {
			$scope.activeTab = aa;
			$scope.pageSource = 'adminNewAppointment.html';
			$scope.users1.disableFlag = false;
		};
		
		/*$scope.users = []; //declare an empty array
		$http.get("../js/mock.json").success(function(response){ 
			$scope.users = response;  //ajax request to fetch data into $scope.data
		});	
		
		$scope.users1 = [];
		$scope.custDetails1 = function(aa) {
			console.log("-------" + aa);

			$scope.users1 = $filter('filter')($scope.patient, function (d) {return d.refNo === aa;})[0];
			console.log("----------" + $scope.users1);
			$scope.activeTab = 'New Appointment';
			$scope.pageSource = 'adminNewAppointment.html';
			//return $scope.users1;
		};*/
		
		$scope.homeLogin = function (item){
		//console.log(item + " clicked");
			switch (item) {
				case 'divOne':
					$scope.divOne = true;
					$scope.divTwo = false;
					$scope.divThree = false;
                    $scope.divSignup = false;
					$scope.selected = item;
					break;

				case 'divTwo':
					$scope.divOne = false;
					$scope.divTwo = true;
					$scope.divThree = false;
                    $scope.divSignup = false;
					$scope.selected = item;
					break;

				case 'divThree':
					$scope.divOne = false;
					$scope.divTwo = false;
					$scope.divThree = true;
                    $scope.divSignup = false;
					$scope.selected = '';

					$scope.patientForgotPasswordFormReset();
					break;
                    
                case 'divSignup':
					$scope.divOne = false;
					$scope.divTwo = false;
					$scope.divThree = false;
                    $scope.divSignup = true;
					$scope.selected = item;
					break;
			}
		}

		/* $scope.x2 = function() {
				if ($scope.pageSource1 == "leftNavigation.html") {
					$scope.pageSource1 = "";
					console.log("hide");
					angular.element(document.querySelector('#q1')).removeClass('mainContent');
					angular.element(document.querySelector('#q1')).addClass('mainContent1');					
				} else {
					$scope.pageSource1 = "leftNavigation.html";
					console.log("show");
					angular.element(document.querySelector('#q1')).removeClass('mainContent1');
					angular.element(document.querySelector('#q1')).addClass('mainContent');

				}
		} */

		$scope.isActiveTab = function(tabUrl) {
			return tabUrl == $scope.activeTab;
		}

		$scope.patientSignInFormReset = function () {
			$scope.patientSignIn.uname = "";
			$scope.patientSignIn.password = "";
			$scope.patientSignIn.errorResult = "";

			$scope.signInForm2.patientSignInForm.$setPristine();
			$scope.signInForm2.patientSignInForm.$setUntouched();
		}

		$scope.patientSignInFormSubmit = function() {
			if($scope.signInForm2.patientSignInForm.$valid) {
				var dataObj = {
					"username": $scope.patientSignIn.uname,
					"password": $scope.patientSignIn.password
				};

				var url = "/healyos-pdt/hrest/v1/cust/login?apikey=f4205eb9-d441-499d-a045-734c34ccbf7a";
				var result = $http.post(url, dataObj);

				result.success(function(data, status, headers, config) {
					if(data.error == undefined) {
						$scope.patientSignIn.errorResult = "";
						var sidObj = data.sid;
						var emailObj = data.payload.email;
						var idObj = data.payload.id;
                        var name = data.payload.fullname;

						$cookies.put('u_sid', sidObj);
						$cookies.put('u_apikey', 'f4205eb9-d441-499d-a045-734c34ccbf7a');
						$cookies.put('u_email', emailObj);
						$cookies.put('u_id', idObj);
                        $cookies.put('u_name', name);
                        $cookies.put('u_type', 1);
                        $scope.userTabsFlg = true;

                        if(!data.payload.lastlogintime){
                            $scope.activeTab = 'New Appointment';
                            $scope.pageSource = 'custNewAppointment.html';
                        } else {
                            $scope.activeTab = 'My Appointments';
                            $scope.pageSource = 'appointments.html';
                        }
						$scope.pageSource1 = "leftNavigation.html";
						$scope.pageSource2 = 'custInfoBar.html';
					}
				});

				result.error(function(data, status, headers, config) {
					$scope.patientSignIn.errorResult = data.error.message;
				});
			}
		}

		$scope.logoutCust = function() {
			var sidObj = $cookies.get('u_sid');
			var apiKeyObj = $cookies.get('u_apikey');

			var url = "/healyos-pdt/hrest/v1/session/logout?apikey=" + apiKeyObj + "&sid=" + sidObj;
			var result = $http.post(url);

			result.success(function(data, status, headers, config) {
				if(data.error == undefined) {
					if($cookies.get('u_sid') != undefined) {
						$cookies.remove('u_sid');
					}
					if($cookies.get('u_apikey') != undefined) {
						$cookies.remove('u_apikey');
					}
					if($cookies.get('u_email') != undefined) {
						$cookies.remove('u_email');
					}
					if($cookies.get('u_type') != undefined) {
						$cookies.remove('u_type');
					}
					if($cookies.get('u_id') != undefined) {
						$cookies.remove('u_id');
					}
                    if($cookies.get('u_name') != undefined) {
						$cookies.remove('u_name');
					}
                    
                    $scope.userTabsFlg = false;
					$scope.activeTab = 'Home';
					$scope.pageSource = 'home.html';
					$scope.pageSource1 = "";
					$scope.pageSource2 = "";

					$scope.custLogoutSuccess = "You have logged out successfully!";
					$scope.custLogoutError = "";
                    
                    //call to facebook logout function 
                    $scope.fbLogout();
                    
                    //To reaload the cookies, default value and cache reload the page
                    $window.location.reload();
				}
			});

			result.error(function(data, status, headers, config) {
				if($cookies.get('u_sid') != undefined) {
					$cookies.remove('u_sid');
				}
				if($cookies.get('u_apikey') != undefined) {
					$cookies.remove('u_apikey');
				}
				if($cookies.get('u_email') != undefined) {
					$cookies.remove('u_email');
				}
				if($cookies.get('u_type') != undefined) {
					$cookies.remove('u_type');
				}
                if($cookies.get('u_name') != undefined) {
					$cookies.remove('u_name');
				}
                
                $scope.userTabsFlg = false;
				$scope.activeTab = 'Home';
				$scope.pageSource = 'home.html';
				$scope.pageSource1 = "";
				$scope.pageSource2 = "";

				console.log("error response: " + data.error.message);
				$scope.custLogoutSuccess = "";
				$scope.custLogoutError = data.error.message;
			});
		};

		$scope.patientForgotPasswordFormReset = function() {
			$scope.patientUserId.userId = "";

			$scope.forgotPasswordForm.patientUserId.$setPristine();
			$scope.forgotPasswordForm.patientUserId.$setUntouched();
		}

		$scope.patientForgotPassword = function() {
			var dataObj = {
				"username": $scope.patientUserId.userId
			};

			var url = "/healyos-pdt/hrest/v1/cust/reset?apikey=f4205eb9-d441-499d-a045-734c34ccbf7a";
			var result = $http.post(url, dataObj);

			result.success(function(data, status, headers, config) {
				if(data.error == undefined) {
					$scope.divOne = false;
					$scope.divTwo = false;
					$scope.divThree = true;

					$scope.patientForgotPasswordFormReset();

					$scope.patientForgotPasswordSuccess = "Email is sent to your registered email address. Please check your registered email to reset your password.";
					$scope.patientForgotPasswordError = "";
				}
			});
			result.error(function(data, status, headers, config) {
				$scope.divOne = false;
				$scope.divTwo = false;
				$scope.divThree = true;

				$scope.patientForgotPasswordFormReset();

				console.log("error response: " + data.error.message);
				$scope.patientForgotPasswordSuccess = "";
				$scope.patientForgotPasswordError = data.error.message;
			});
		}

		$scope.getParameterByName = function(name) {
			console.log("name before: " + name);
			name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
			console.log("name after: " + name);
			var regexS = "[\\?&]"+name+"=([^&#]*)";
			console.log("regexS: " + regexS);
			var regex = new RegExp(regexS);
			console.log("regex: " + regex);
			var results = regex.exec( window.location.href );
			console.log("results[1]: " + results[1]);
			if(results == null) {
				return "";
			}
			else {
				return results[1];
			}
		}

		$scope.resetCustomerPasswordFormReset = function() {
			$scope.patientPassword.password = "";
			$scope.patientPassword.confirmPassword = "";

			$scope.resetPasswordForm.patientPwd.$setPristine();
			$scope.resetPasswordForm.patientPwd.$setUntouched();
		}

		$scope.resetCustomerPassword = function() {
			if($scope.resetPasswordForm.patientPwd.$valid) {
				var custId = $scope.getParameterByName("cust");
				var token = $scope.getParameterByName("token");
				
				var dataObj = {
					"password": $scope.patientPassword.password
				};

				var url = "/healyos-pdt/hrest/v1/cust/" + custId + "?apikey=f4205eb9-d441-499d-a045-734c34ccbf7a&token=" + token;
				var result = $http.put(url, dataObj);

				result.success(function(data, status, headers, config) {
					if(data.error == undefined) {
						$scope.resetCustomerPasswordFormReset();

						$scope.patientResetPasswordSuccess = "Password is reset successfully! Please login.";
						$scope.patientResetPasswordError = "";
					}
				});
				result.error(function(data, status, headers, config) {

					$scope.resetCustomerPasswordFormReset();

					console.log("error response: " + data.error.message);
					$scope.patientResetPasswordSuccess = "";
					$scope.patientResetPasswordError = data.error.message;
				});
			}
		}

		$scope.financeSignInFormReset = function () {
			$scope.financeSignIn.uname = "";
			$scope.financeSignIn.password = "";
			$scope.financeSignIn.errorResult = "";

			$scope.signInForm3.financeSignInForm.$setPristine();
			$scope.signInForm3.financeSignInForm.$setUntouched();
		}

		$scope.financeSignInFormSubmit = function() {
			if($scope.signInForm3.financeSignInForm.$valid) {
				var dataObj = {
					"username": $scope.financeSignIn.uname,
					"password": $scope.financeSignIn.password
				};
				
				var url = "/healyos-pdt/hrest/v1/admin/login?apikey=f4205eb9-d441-499d-a045-734c34ccbf7a";
				//var url = "http://localhost:8080/healyos-pdt/hrest/admin/login?apikey=f4205eb9-d441-499d-a045-734c34ccbf7a";
				//var url = "/api/hrest/admin/login?apikey=f4205eb9-d441-499d-a045-734c34ccbf7a";

				var result = $http.post(url, dataObj);

				result.success(function(data, status, headers, config) {
					if(data.error == undefined) {
						$scope.financeSignIn.errorResult = "";
						var sidObj = data.sid;
						var emailObj = data.payload.email;
						var idObj = data.payload.id;
                        var name = data.payload.fullname;
                        /*if(data.payload.currentTime) {
                        	$scope.notification.servertime = data.payload.currentTime;
                        	$scope.notification.isSetupDone = false;
                        }
                        console.log("s_id: "+data.sid);*/
						$cookies.put('u_sid', sidObj);
						$cookies.put('u_apikey', 'f4205eb9-d441-499d-a045-734c34ccbf7a');
						$cookies.put('u_email', emailObj);
						$cookies.put('u_id', idObj);
                        $cookies.put('u_name', name);
                        $cookies.put('u_type', 3);

						/*$scope.activeTab = 'Home';
						$scope.pageSource = 'home.html';
						$scope.pageSource1 = "";
						$scope.pageSource2 = 'financeInfoBar.html';*/

						$scope.activeTab = 'Package Cancellations';
						$scope.pageSource = 'quickView.html';
						$scope.pageSource1 = "leftNavigation.html";
						$scope.pageSource2 = 'financeInfoBar.html';

						$scope.userTabsFlg = true;
					}
				});

				result.error(function(data, status, headers, config) {
					$scope.financeSignIn.errorResult = data.error.message;
				});
			}
		}

		$scope.$on('logOutFinance', function(event, args) {
			var sidObj = $cookies.get('u_sid');
			var apiKeyObj = $cookies.get('u_apikey');

			var url = "/healyos-pdt/hrest/v1/session/logout?apikey=" + apiKeyObj + "&sid=" + sidObj;

			var result = $http.post(url);

			result.success(function(data, status, headers, config) {
				if(data.error == undefined) {
					if($cookies.get('u_sid') != undefined) {
						$cookies.remove('u_sid');
					}
					if($cookies.get('u_apikey') != undefined) {
						$cookies.remove('u_apikey');
					}
					if($cookies.get('u_email') != undefined) {
						$cookies.remove('u_email');
					}
					if($cookies.get('u_type') != undefined) {
						$cookies.remove('u_type');
					}
					if($cookies.get('u_id') != undefined) {
						$cookies.remove('u_id');
					}
                    if($cookies.get('u_name') != undefined) {
						$cookies.remove('u_name');
					}

                    $scope.userTabsFlg = false;
					$scope.activeTab = 'Home';
					$scope.pageSource = 'home.html';
					$scope.pageSource1 = "";
					$scope.pageSource2 = "";

					$scope.financeLogoutSuccess = "You have logged out successfully!";
					$scope.financeLogoutError = "";
                    
                    //To reaload the cookies, default value and cache reload the page
                    $window.location.reload();
				}
			});

			result.error(function(data, status, headers, config) {
				if($cookies.get('u_sid') != undefined) {
					$cookies.remove('u_sid');
				}
				if($cookies.get('u_apikey') != undefined) {
					$cookies.remove('u_apikey');
				}
				if($cookies.get('u_email') != undefined) {
					$cookies.remove('u_email');
				}
				if($cookies.get('u_type') != undefined) {
					$cookies.remove('u_type');
				}
                if($cookies.get('u_name') != undefined) {
					$cookies.remove('u_name');
				}

                $scope.userTabsFlg = false;
				$scope.activeTab = 'Home';
				$scope.pageSource = 'home.html';
				$scope.pageSource1 = "";
				$scope.pageSource2 = "";

				console.log("error response: " + data.error.message);
				$scope.financeLogoutSuccess = "";
				$scope.financeLogoutError = data.error.message;
			});
		});

		$scope.adminSignInFormReset = function () {
			$scope.adminSignIn.uname = "";
			$scope.adminSignIn.password = "";
			$scope.adminSignIn.errorResult = "";

			$scope.signInForm1.adminSignInForm.$setPristine();
			$scope.signInForm1.adminSignInForm.$setUntouched();
		}

		$scope.adminSignInFormSubmit = function() {
			if($scope.signInForm1.adminSignInForm.$valid) {
				var dataObj = {
					"username": $scope.adminSignIn.uname,
					"password": $scope.adminSignIn.password
				};

				var url = "/healyos-pdt/hrest/v1/admin/login?apikey=f4205eb9-d441-499d-a045-734c34ccbf7a";
				//var url = "http://localhost:8080/healyos-pdt/hrest/admin/login?apikey=f4205eb9-d441-499d-a045-734c34ccbf7a";
				//var url = "/api/hrest/admin/login?apikey=f4205eb9-d441-499d-a045-734c34ccbf7a";

				var result = $http.post(url, dataObj);

				result.success(function(data, status, headers, config) {
					if(data.error == undefined) {
						$scope.adminSignIn.errorResult = "";
						var sidObj = data.sid;
						var emailObj = data.payload.email;
						var idObj = data.payload.id;
                        var name = data.payload.fullname;
                        if(data.payload.currentTime) {
                        	$scope.notification.servertime = data.payload.currentTime;
                        	$scope.notification.isSetupDone = false;
                        }
                        console.log("s_id: "+data.sid);
						$cookies.put('u_sid', sidObj);
						$cookies.put('u_apikey', 'f4205eb9-d441-499d-a045-734c34ccbf7a');
						$cookies.put('u_email', emailObj);
						$cookies.put('u_id', idObj);
                        $cookies.put('u_name', name);
                        $cookies.put('u_type', 0);
                        $scope.userTabsFlg = true;

						$scope.activeTab = 'Home';
						$scope.pageSource = 'home.html';
						$scope.pageSource1 = "";
						$scope.pageSource2 = 'adminInfoBar.html';
					}
				});

				result.error(function(data, status, headers, config) {
					$scope.adminSignIn.errorResult = data.error.message;
				});
			}
		}

		$scope.$on('moveToPaymentScreen', function(event, args) {
			console.log("--->args: "+ args);
		    $scope.activeTab = 'Payment';
            $scope.pageSource = 'payments.html';
            $scope.pageSource1 = "leftNavigation.html";
            $scope.pageSource2 = 'adminInfoBar.html';

			$scope.refBoolFlag = true;
            $scope.adminAptPayment.refno = args.refno;
            $scope.$root.$broadcast("loadPaymentScreen", args);
		});

			$scope.$on('custDetailsForAdmin', function(event, args) {
			console.log("--->args: "+ args);

			$scope.activeTab = 'New Appointment';
			$scope.pageSource = 'adminNewAppointment.html';
			$scope.pageSource1 = "leftNavigation.html";
			$scope.pageSource2 = 'adminInfoBar.html';

			$scope.users1.cityname = args.customercity;
            $scope.users1.name = args.custname;
            $scope.users1.contactNo = args.contactno;
            $scope.users1.email = args.customeremail;
			$scope.users1.city = args.id;
			$scope.users1.uuid = args.uuid;
			//$scope.users1.pincode = args.pincode;

			//$scope.users1.city = "68485e0d-7cfc-d890-2a56-8bba6fa96380";
			$scope.users1.disableFlag = true;
		});

		$scope.$on('navigatetoHomeAdmin', function(event, args) {
			$scope.sessionFlag.adminSessionTimeoutFlag = true;
			$scope.userTabsFlg = false;
			$scope.activeTab = 'Home';
			$scope.pageSource = 'home.html';
			$scope.pageSource1 = "";
			$scope.pageSource2 = "";
            $timeout(function () { $scope.sessionFlag.adminSessionTimeoutFlag = false; }, 7000);
		});

		$scope.$on('navigatetoHomeSp', function(event, args) {
			$scope.sessionFlag.spSessionTimeoutFlag = true;
			$scope.userTabsFlg = false;
			$scope.activeTab = 'Home';
			$scope.pageSource = 'home.html';
			$scope.pageSource1 = "";
			$scope.pageSource2 = "";
            $timeout(function () { $scope.sessionFlag.spSessionTimeoutFlag = false; }, 7000);
		});

		$scope.$on('navigatetoHomeFinance', function(event, args) {
			$scope.sessionFlag.financeSessionTimeoutFlag = true;
			$scope.userTabsFlg = false;
			$scope.activeTab = 'Home';
			$scope.pageSource = 'home.html';
			$scope.pageSource1 = "";
			$scope.pageSource2 = "";
            $timeout(function () { $scope.sessionFlag.financeSessionTimeoutFlag = false; }, 7000);
		});

		$scope.$on('logOutAdmin', function(event, args) {
			var sidObj = $cookies.get('u_sid');
			var apiKeyObj = $cookies.get('u_apikey');

			//var url = "http://localhost:8080/healyos-pdt/hrest/session/logout?apikey=" + apiKeyObj + "&sid=" + sidObj;
			var url = "/healyos-pdt/hrest/v1/session/logout?apikey=" + apiKeyObj + "&sid=" + sidObj;

			/*$http.get(url).
			then(function(response) {
				// this callback will be called asynchronously
				// when the response is available
				$scope.users = response.data.payload;
			}, function(response) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
				console.log("error response: " + response);
			});*/

			var result = $http.post(url);

			result.success(function(data, status, headers, config) {
				if(data.error == undefined) {
					if($cookies.get('u_sid') != undefined) {
						$cookies.remove('u_sid');
					}
					if($cookies.get('u_apikey') != undefined) {
						$cookies.remove('u_apikey');
					}
					if($cookies.get('u_email') != undefined) {
						$cookies.remove('u_email');
					}
					if($cookies.get('u_type') != undefined) {
						$cookies.remove('u_type');
					}
					if($cookies.get('u_id') != undefined) {
						$cookies.remove('u_id');
					}
                    if($cookies.get('u_name') != undefined) {
						$cookies.remove('u_name');
					}

                    $scope.userTabsFlg = false;
					$scope.activeTab = 'Home';
					$scope.pageSource = 'home.html';
					$scope.pageSource1 = "";
					$scope.pageSource2 = "";

					$scope.adminLogoutSuccess = "You have logged out successfully!";
					$scope.adminLogoutError = "";
                    
                    //To reaload the cookies, default value and cache reload the page
                    $window.location.reload();
				}
			});

			result.error(function(data, status, headers, config) {
				if($cookies.get('u_sid') != undefined) {
					$cookies.remove('u_sid');
				}
				if($cookies.get('u_apikey') != undefined) {
					$cookies.remove('u_apikey');
				}
				if($cookies.get('u_email') != undefined) {
					$cookies.remove('u_email');
				}
				if($cookies.get('u_type') != undefined) {
					$cookies.remove('u_type');
				}
                if($cookies.get('u_name') != undefined) {
					$cookies.remove('u_name');
				}

                $scope.userTabsFlg = false;
				$scope.activeTab = 'Home';
				$scope.pageSource = 'home.html';
				$scope.pageSource1 = "";
				$scope.pageSource2 = "";

				console.log("error response: " + data.error.message);
				$scope.adminLogoutSuccess = "";
				$scope.adminLogoutError = data.error.message;
			});
		});

		$scope.spSignInFormSubmit = function() {
			if($scope.signInForm.spSignInForm.$valid) {
				var dataObj = {
					"username": $scope.spSignIn.name,
					"password": $scope.spSignIn.password
				};

				var url = "/healyos-pdt/hrest/v1/sp/login?apikey=f4205eb9-d441-499d-a045-734c34ccbf7a";

				var result = $http.post(url, dataObj);

				result.success(function(data, status, headers, config) {
					if(data.error == undefined) {
						$scope.spSignIn.errorResult = "";
						var sidObj = data.sid;
						var emailObj = data.payload.email;
						var idObj = data.payload.id;
						var name = data.payload.fullname;

						$cookies.put('u_sid', sidObj);
						$cookies.put('u_apikey', 'f4205eb9-d441-499d-a045-734c34ccbf7a');
						$cookies.put('u_email', emailObj);
						$cookies.put('u_id', idObj);
						$cookies.put('u_name', name);
						$cookies.put('u_type', 2);

						$scope.activeTab = 'My Appointments';
						$scope.pageSource = 'quickView.html';
						$scope.pageSource1 = "leftNavigation.html";
						$scope.pageSource2 = 'spInfoBar.html';

						$scope.userTabsFlg = true;
					}
				});

				result.error(function(data, status, headers, config) {
					$scope.spSignIn.errorResult = data.error.message;
				});
			}
		}

		$scope.spSignInFormReset = function() {
			$scope.spSignIn.name = "";
			$scope.spSignIn.password = "";
			$scope.spSignIn.errorResult = "";
			$scope.signInForm.spSignInForm.$setPristine();
			$scope.signInForm.spSignInForm.$setUntouched();
		}

		$scope.logoutSp = function() {
			var sidObj = $cookies.get('u_sid');
			var apiKeyObj = $cookies.get('u_apikey');

			var url = "/healyos-pdt/hrest/v1/session/logout?apikey=" + apiKeyObj + "&sid=" + sidObj;
			var result = $http.post(url);

			result.success(function(data, status, headers, config) {
				if(data.error == undefined) {
					if($cookies.get('u_sid') != undefined) {
						$cookies.remove('u_sid');
					}
					if($cookies.get('u_apikey') != undefined) {
						$cookies.remove('u_apikey');
					}
					if($cookies.get('u_email') != undefined) {
						$cookies.remove('u_email');
					}
					if($cookies.get('u_type') != undefined) {
						$cookies.remove('u_type');
					}
					if($cookies.get('u_id') != undefined) {
						$cookies.remove('u_id');
					}
					if($cookies.get('u_name') != undefined) {
						$cookies.remove('u_name');
					}

					$scope.activeTab = 'Home';
					$scope.pageSource = 'home.html';
					$scope.pageSource1 = "";
					$scope.pageSource2 = "";

					$scope.spLogoutSuccess = "You have logged out successfully!";
					$scope.spLogoutError = "";
				    $window.location.reload();

				    $scope.userTabsFlg = false;
				}
			});

			result.error(function(data, status, headers, config) {
				if($cookies.get('u_sid') != undefined) {
					$cookies.remove('u_sid');
				}
				if($cookies.get('u_apikey') != undefined) {
					$cookies.remove('u_apikey');
				}
				if($cookies.get('u_email') != undefined) {
					$cookies.remove('u_email');
				}
				if($cookies.get('u_type') != undefined) {
					$cookies.remove('u_type');
				}
				if($cookies.get('u_name') != undefined) {
					$cookies.remove('u_name');
				}

				$scope.activeTab = 'Home';
				$scope.pageSource = 'home.html';
				$scope.pageSource1 = "";
				$scope.pageSource2 = "";

				console.log("error response: " + data.error.message);
				$scope.spLogoutSuccess = "";
				$scope.spLogoutError = data.error.message;
			});
		};

		$scope.toggleNav = function() {
			var leftNav = angular.element(document.querySelector('#leftNavigation'));
			var mainContent = angular.element(document.querySelector('.mainContent'));
			var toggleBtn = angular.element(document.querySelector('#navToggler'));
			var display = leftNav.css("display");
			if(display == "" || display == "block") {
				leftNav.css({"display":"none"});
				mainContent.css({"float":"none", "width":"100%"});
				toggleBtn.removeClass("glyphicon-align-justify");
				toggleBtn.addClass("glyphicon-list");
			}
			else {
				leftNav.css({"display":"block"});
				mainContent.css({"float":"left", "width":"82%"});
				toggleBtn.addClass("glyphicon-align-justify");
				toggleBtn.removeClass("glyphicon-list");
			}
		}

		$scope.toggleLeftNavigation = function() {
            var leftNav = angular.element(document.querySelector('#menuListing'));
            var workArea = angular.element(document.querySelector('#workArea'));
            var display = $("#menuListing").is(':visible');
            if(display == true) {
                //leftNav.css({"display":"none"});
                leftNav.addClass("hidden-xs hidden-sm hidden-md hidden-lg");
                leftNav.removeClass("col-xs-5 col-sm-4 col-md-2 col-lg-2");
                workArea.removeClass("col-sm-12 col-xs-12 col-md-10 col-lg-10");
                workArea.addClass("col-sm-12 col-xs-12 col-md-12 col-lg-12");
                /*toggleBtn.removeClass("glyphicon-align-justify");
                toggleBtn.addClass("glyphicon-list");*/
            }
            else {
                //leftNav.css({"display":"block"});
                leftNav.addClass("col-xs-5 col-sm-4 col-md-2 col-lg-2");
                leftNav.removeClass("hidden-xs hidden-sm hidden-md hidden-lg");
                workArea.removeClass("col-sm-12 col-xs-12 col-md-12 col-lg-12");
                workArea.addClass("col-sm-12 col-xs-12 col-md-10 col-lg-10");
                /*toggleBtn.addClass("glyphicon-align-justify");
                toggleBtn.removeClass("glyphicon-list");*/
            }
		}

		$scope.isThisMobileDevice = function() {
		    return isThisMobileDevice();
		}

    /**
     * Start Customer facebook login 
     */
    $scope.fbSignIn = function (result) {
           result.success(function(data, status, headers, config) {

            if(data.error == undefined) {
                var sidObj = data.sid;
                var usernameObj = data.payload.username;
                var idObj = data.payload.id;
                var name = data.payload.fullname;

                $cookies.put('u_sid', sidObj);
                $cookies.put('u_apikey', 'f4205eb9-d441-499d-a045-734c34ccbf7a');
                $cookies.put('u_email', usernameObj);
                $cookies.put('u_id', idObj);
                $cookies.put('u_name', name);
                $cookies.put('u_type', 1);
                $scope.userTabsFlg = true;

                if(!data.payload.lastlogintime){
                    $scope.activeTab = 'New Appointment';
                    $scope.pageSource = 'custNewAppointment.html';
                }else{
                    $scope.activeTab = 'My Appointments';
                    $scope.pageSource = 'appointments.html';
                }

                $scope.pageSource1 = "leftNavigation.html";
                $scope.pageSource2 = 'custInfoBar.html';
                
                $scope.patientSignIn.errorResult = "";
                $scope.custLogoutSuccess = "";
                $scope.aptErrorMsg = "";
            }
        });

        result.error(function (data, status, headers, config) {
            $scope.patientSignupError = data.error.message;
            $scope.patientSignInError = data.error.message;
            $scope.patientSignupSuccess = "";
            $scope.patientSignIn.errorResult = "";
            $scope.custLogoutSuccess = "";
        });
    }
    
    $scope.fbSignUpError = function (data) {
        $scope.patientSignupError = "";
        $scope.patientSignupSuccess = "";
        $scope.patientFbSignupError = data.error.message;
    }
    
    $scope.fbLogout = function() {
        
          Facebook.logout(function() {
            console.log('logout from fb');
            $scope.user   = {};
          });   
    }

    $scope.initAccordion = function() {
        setWorkingArea();
        
        if($cookies.get('u_type')!=undefined) 
        {
        	$scope.activeTab = "My Appointments";
            if($cookies.get('u_type') == 3){
                $scope.activeTab = 'Package Cancellations';
            }
        }
        
        if( isThisMobileDevice() ) {
            setTimeout(function(){
                handleNavigationMenus();
            }, 1000);
        }
        handleAccordionStyling();
    }
    
    /**
     * End Customer facebook login
     */
}]);
