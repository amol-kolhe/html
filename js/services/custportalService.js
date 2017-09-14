app.service('custportalGetSetService', function() {
	var localityObject;
	var bookNowObject;
	var problemObject;
	var bookingConfirmation;
	var physioIdObj;
	/*
	* get set location Array
	*/
	this.setLocalityObj = function(obj) {
		localityObject = obj;
	}
	this.getLocalityObj = function() {
		return localityObject;
	}

	/*
	* get set booknow data
	*/
	this.setBooknowObj = function(obj) {
		bookNowObject = obj;
	}
	this.getBooknowObj = function() {
		return bookNowObject;
	}
	
	/*
	* get set select a problem
	*/
	this.setProblem = function(obj) {
		problemObject = obj;
	}
	this.getProblem = function() {
		return problemObject;
	}

	/*Get set booking confirmation obj*/
	this.setConfirmObj = function(obj) {
		bookingConfirmation = obj;
	}
	this.getConfirmObj = function() {
		return bookingConfirmation;
	}

	/*Get set physio ID*/
	this.setPhysioId = function(obj) {
		physioIdObj = obj;
	}
	this.getPhysioId = function() {
		return physioIdObj;
	}
});
app.directive('loading', ['$http', function($http){
	return {
        restrict: 'A',
        link: function (scope, elm, attrs) {
            scope.isLoading = function () {
                return $http.pendingRequests.length > 0;
            };
            scope.$watch(scope.isLoading, function (v) {
                if (v) {
                    elm.show();
                } else {
                    elm.hide();
                }
            });
        }
    };
}]);