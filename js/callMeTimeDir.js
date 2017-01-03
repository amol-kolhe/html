
angular.module('myApp.timeDirectives', [])
.directive('datepicker1', function() {
	var linker = function(scope,element,attrs) {
		$(element).find("input").datetimepicker();
	};
	return {
		restrict: "E",
		link: linker,
		template: "<input id='datetimepicker6' ng-model='callMeBack.appointmentTime' type='text'>"
		//template: "<input ng-model='event.eventStartDate' type='text'>"
	}
})
.directive('datepicker2', function() {
	var linker = function(scope,element,attrs) {
		$(element).find("input").datetimepicker({
			format: 'YYYY-MM-DD'
		});
	};
	return {
		restrict: "E",
		link: linker,
		template: "<input id='datetimepicker8' ng-model='patientFbSignUp.patientBirthDate' type='text'>"
		//template: "<input ng-model='event.eventStartDate' type='text'>"
	}
});
