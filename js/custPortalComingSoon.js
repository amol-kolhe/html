(function () {
	'use strict';
	angular.module('custPortalComingSoonApp', ['ngToast', 'myApp.Services', 'ngCookies'])
	.controller('custPortalComingSoonController', custPortalComingSoonController);
	
	custPortalComingSoonController.$inject = ['ngToast', 'custApi', '$cookies', '$http'];
	function custPortalComingSoonController(ngToast, custApi) {
		var vm = this;
		
		vm.initComingSoon = initComingSoon;
		vm.verifyAndSendMail = verifyAndSendMail;
		var validateEmail = validateEmail;

		vm.flags = {
			'isThisMobile': isThisMobileDevice()
		};
		
		/*
		* Function to check whether device is mobile or not
		*/
		function initComingSoon() {
			if(vm.flags.isThisMobile) {
				handleMobileSpecificConditions();
			}	
		}

		/*
		* Function to validate email id
		*/
		function validateEmail() {
			if (!vm.emailId || !(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/).test(vm.emailId)) {
				return false;
			} else {
				return true;
			}
		}

		/*
		* Function to validate email id and send notification
		*/
		function verifyAndSendMail() {
			var isEmailValid = validateEmail();
			if(isEmailValid) {
				console.log("Email valid send notify");
				var dataobj = {
					 "cust_email": vm.emailId
				};

				custApi.postNotifyMe(dataobj).
				success(function (data, status, headers, config) {
					console.log("Email Sent successFully");
					vm.emailId = '';
					//ngToast.create('Email Sent successFully');
				}).
				error(function (data, status, headers, config) {
					console.log("Error in sending email");
					//ngToast.warning('Error in sending Email');
					vm.emailId = '';
				});
			}
			else {
				console.log("Error");
				vm.emailId = '';
				//ngToast.warning('Please enter valid Email Id');
			}
		}
	} /* custPortalComingSoonController END */

})();