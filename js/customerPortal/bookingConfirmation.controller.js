app.controller('bookingConfirmController', bookingConfirmController);
bookingConfirmController.$inject = ['$timeout', '$http', 'custApi', '$cookies', '$scope', '$state', 'custportalGetSetService'];

function bookingConfirmController($timeout, $http, custApi, $cookies, $scope, $state, custportalGetSetService) {
	var vm = this;
	window.scrollTo(0, 0);
	vm.method = {
		initBookingConfirm: initBookingConfirm,
		redirectToHome: redirectToHome
	};
	vm.model = {
		confirmObj: {}
	};

	/*
	* Function to initialize controller
	*/
	function initBookingConfirm () {
		vm.model.confirmObj = custportalGetSetService.getConfirmObj();
		if($cookies.get('booking_session') != undefined) {
			$cookies.remove('booking_session');
			$scope.$parent.cpc.flags.booknowSectionfieldsValid = false;
		} else {
			window.location = "/";
		}
	}

	/*
	*Function to redirect to home page
	*/
	function redirectToHome() {
		window.location = "/";
	}

	vm.method.initBookingConfirm();
}