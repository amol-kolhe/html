var custApiService = angular.module('myApp.Services', []);
custApiService.factory('custApi', ['$http', '$cookies', function($http, $cookies){
	var baseUrl = "/healyos-pdt";
	var apiKey;
	var sid;
	var custId;
	var utype;
	var custApi = {};
	
	custApi.getApiKey = function() {
		if(apiKey == undefined) {
            apiKey = $cookies.get('u_apikey');
        }
        if(!apiKey){
            apiKey = 'f4205eb9-d441-499d-a045-734c34ccbf7a';
        }
        
		return apiKey;
	};

	custApi.getSid = function() {
		if(sid == undefined) {
            sid = $cookies.get('u_sid');
        }
        return sid;
	};

	custApi.getCustid = function() {
		if(custId == undefined) {
            custId = $cookies.get('u_id');
        }
        return custId;
	};

	custApi.getUType = function() {
		if(utype == undefined) {
			utype = $cookies.get('u_type');
		}
		return utype;
	};

	//API support to get all policy.
	custApi.getPolicy = function() {
		return $http.get(baseUrl + "/hrest/v1/admin/policy?apikey=" + custApi.getApiKey() + "&sid=" + custApi.getSid() + "&role=0");
	};
	
	custApi.searchAppointments = function(appointmentCriteria, isAdvancedSearch) {
		var url = baseUrl + "/hrest/v1/appt?apikey=" + custApi.getApiKey() + "&sid=" + custApi.getSid() + "&role=1&where=" + createCustomerSearchAppointmentsQuery(appointmentCriteria, isAdvancedSearch);
		return $http.get(url);
	}
	
	//API support for Appointments Details
	custApi.getAppointmentDetails = function(id) {
		return $http.get(baseUrl + '/hrest/v1/appt/' + id + "?apikey=" + custApi.getApiKey() + "&sid=" + custApi.getSid() + "&role=1");
	};
	
	////API for fetch customer 
	custApi.getFetchCust = function(custID) {
		return $http.get(baseUrl + '/hrest/v1/admin/cust/' + custID + "?apikey=" + custApi.getApiKey() + "&sid=" + custApi.getSid() + "&role=1");
	};
	
	////API to get service provider info
	custApi.getSpInfo = function(serviceDate, zoneid, servid, pin) {
		return $http.get(baseUrl + "/hrest/v1/zone/avail?apikey=" + custApi.getApiKey() + "&sid=" + custApi.getSid() + "&date=" + serviceDate + "&zoneid=" + zoneid + "&servid=" + servid + "&pincode=" + pin);
	}
	
	////API for create new appointment 
	custApi.createNewAppointment = function(data) {
		return $http.post(baseUrl + '/hrest/v1/appt?apikey=' + custApi.getApiKey() + "&sid=" + custApi.getSid() + "&role=" + custApi.getUType(), data);
	};
	
	//API to get cities for given country
	custApi.getCities = function(countryName) {
		return $http.get(baseUrl + "/hrest/v1/zone/cities?apikey=" + custApi.getApiKey() + "&sid=" + custApi.getSid() + "&countrynm=" + countryName + '&time=' + new Date().getTime());
	}

	//API support to get all clinic.
	custApi.getCity = function(active) {
		var url = baseUrl + "/hrest/v1/admin/city?apikey=" + custApi.getApiKey() + "&sid=" + custApi.getSid() + '&role=0';
		if(active != undefined) {
			url += "&active=" + active;
		}
		return $http.get(url);
	};
	
	//API to get clinics for given city
	custApi.getClinics = function(cityId) {
		return $http.get(baseUrl + "/hrest/v1/zone/clinic?apikey=" + custApi.getApiKey() + "&sid=" + custApi.getSid() + "&cityid=" + cityId);
	}
	
	//API to get zones for given city
	custApi.getZones = function(cityId) {
		return $http.get(baseUrl + "/hrest/v1/zone/map?apikey=" + custApi.getApiKey() + "&sid=" + custApi.getSid() + "&cityid=" + cityId + '&time=' + new Date().getTime());
	}
	
	//API to get services
	custApi.getServices = function() {
		return $http.get(baseUrl + "/hrest/v1/services/package?apikey=" + custApi.getApiKey() + "&sid=" + custApi.getSid() + '&time=' + new Date().getTime());
	}

    //API to customer register
	custApi.getRegisterUrl = function(dataObj) {
		return $http.post(baseUrl + "/hrest/v1/cust/register?apikey=" + custApi.getApiKey(), dataObj);
	}
    
    //API for customer login
	custApi.getLoginUrl = function() {
		return baseUrl + "/hrest/v1/cust/login?apikey=" + custApi.getApiKey();
	}

	//API for anonymous login
	custApi.performAnonymousLogin = function (dataObj) {
		return $http.post(baseUrl + "/hrest/v1/cust/login?apikey=" + custApi.getApiKey(), dataObj);
	}
	//API for Notify me-Coming soon page
	custApi.postNotifyMe = function (dataObj) {
		return $http.post(baseUrl + "/hrest/v1/cust/notifyme?apikey=f4205eb9-d441-499d-a045-734c34ccbf7a", dataObj);
	}

	//check if session is valid
	custApi.checkSessionValid = function() {
		return $http.get(baseUrl + "/hrest/v1/session/" + custApi.getSid() + "?apikey=" + custApi.getApiKey() + '&time=' + new Date().getTime());
	}

	//API to get available dates in a month of a particular service
	custApi.checkAvailableDatesInMonth = function(roleInst, yyyymmDate, pincode, zoneid, serviceId) {
		return $http.get(baseUrl + "/hrest/v1/appt/calmon/" + yyyymmDate + "?apikey=" + custApi.getApiKey() + "&sid=" + custApi.getSid() + "&role=" + roleInst + "&pincode=" + pincode + "&zoneid=" + zoneid + "&serviceid=" + serviceId + '&time=' + new Date().getTime());
	}

	//API to get available dates in a month of a particular service for particular clinic
	custApi.checkAvailableDatesInMonthClinic = function(roleInst, yyyymmDate, clinicId, serviceId) {
		return $http.get(baseUrl + "/hrest/v1/appt/calmon/" + yyyymmDate + "?apikey=" + custApi.getApiKey() + "&sid=" + custApi.getSid() + "&role=" + roleInst + "&clinic_id=" + clinicId + "&serviceid=" + serviceId + '&time=' + new Date().getTime());
	}

	////API to get service provider info
	custApi.fetchAvailableSlotsForDay = function(serviceDate, zoneid, servid, pin) {
		return $http.get(baseUrl + "/hrest/v1/zone/avail?apikey=" + custApi.getApiKey() + "&sid=" + custApi.getSid() + "&date=" + serviceDate + "&zoneid=" + zoneid + "&servid=" + servid + "&pincode=" + pin + '&time=' + new Date().getTime());
	}

	////API to get service provider info
	custApi.fetchAvailableSlotsForDayClinic = function(serviceDate, clinicId, servid) {
		return $http.get(baseUrl + "/hrest/v1/zone/avail?apikey=" + custApi.getApiKey() + "&sid=" + custApi.getSid() + "&date=" + serviceDate + "&clinic_id=" + clinicId + "&servid=" + servid + '&time=' + new Date().getTime());
	}

	// API for Request a call back fucntionality
	custApi.postCallMeBack = function(dataObj) {
		return $http.post(baseUrl + "/hrest/v1/cust/callme?apikey=" + custApi.getApiKey(), dataObj);
	}
	custApi.applyPromocode = function(dataObj, role) {
		return $http.post(baseUrl + "/hrest/v1/appt/applypromocode?apikey=" + custApi.getApiKey() + "&sid=" + custApi.getSid() + "&role=" + role, dataObj)
	}
	return custApi;
}]);

var tmp;
custApiService.directive('loading', ['$http', function($http){
	return {
        restrict: 'A',
        link: function (scope, elm, attrs) {
            scope.isLoading = function () {
                return $http.pendingRequests.length > 0;
            };
            scope.$watch(scope.isLoading, function (v) {
                if (v) {
                    tmp = setTimeout(function(){
                        $(elm).show();
                    }, 1000);
                } else {
                    clearTimeout(tmp);
                    $(elm).hide();
                }
            });
        }
    };
}]);