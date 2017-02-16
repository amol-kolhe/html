var spApiService = angular.module('myApp.Services', []);
spApiService.factory('spApi', ['$http', '$cookies', function($http, $cookies){
	var baseUrl = "/healyos-pdt";
	var apiKey;
	var sid;
	var spid;
	var spId;
	var spApi = {};
	
	spApi.getApiKey = function() {
		if(apiKey == undefined) {
            apiKey = $cookies.get('u_apikey');
        }
		return apiKey;
	};

	spApi.getSid = function() {
		/*if(sid == undefined) {
            sid = $cookies.get('u_sid');
        }*/
        return $cookies.get('u_sid');
	};

	spApi.getSpid = function() {
		if(spid == undefined) {
            spid = $cookies.get('u_id');
        }
        return spid;
	};

    spApi.getCities = function(countryName) {
        return $http.get(baseUrl + "/hrest/v1/zone/cities?apikey=" + spApi.getApiKey() + "&sid=" + spApi.getSid() + "&countrynm=" + countryName);
    }

    spApi.getZones = function(cityId) {
        return $http.get(baseUrl + "/hrest/v1/zone/map?apikey=" + spApi.getApiKey() + "&sid=" + spApi.getSid() + "&cityid=" + cityId);
    }

    //API to get clinics for given city
    spApi.getClinics = function(cityId) {
        return $http.get(baseUrl + "/hrest/v1/zone/clinic?apikey=" + spApi.getApiKey() + "&sid=" + spApi.getSid() + "&cityid=" + cityId);
    }

	spApi.getCustomerDetails = function(custID) {
        return $http.get(baseUrl + '/hrest/v1/admin/cust/' + custID + "?apikey=" + spApi.getApiKey() + "&sid=" + spApi.getSid() + "&role=2");
    };
	
    spApi.searchAppointments = function(appointmentCriteria) {
        if(appointmentCriteria.hasOwnProperty("state")) {
            return $http.get(baseUrl + "/hrest/v1/appt?apikey=" + spApi.getApiKey() + "&sid=" + spApi.getSid() + "&role=2&where=spid=" + spApi.getSpid() + "ANDtimespan=" + appointmentCriteria.timespan + "ANDstate=" + appointmentCriteria.state);
        }
        else {
            return $http.get(baseUrl + "/hrest/v1/appt?apikey=" + spApi.getApiKey() + "&sid=" + spApi.getSid() + "&role=2&where=spid=" + spApi.getSpid() + "ANDtimespan=" + appointmentCriteria.timespan);
        }
    }

    spApi.getAppointmentDetails = function(id) {
        return $http.get(baseUrl + '/hrest/v1/appt/' + id + "?apikey=" + spApi.getApiKey() + "&sid=" + spApi.getSid() + "&role=2");
    };

    //API to get services
    spApi.getServices = function() {
        return $http.get(baseUrl + "/hrest/v1/services/package?apikey=" + spApi.getApiKey() + "&sid=" + spApi.getSid());
    }

    //API to get service provider info
    spApi.getSpInfo = function(serviceDate, zoneid, servid, pin) {
        return $http.get(baseUrl + "/hrest/v1/zone/avail?apikey=" + spApi.getApiKey() + "&sid=" + spApi.getSid() + "&date=" + serviceDate + "&zoneid=" + zoneid + "&servid=" + servid + "&pincode=" + pin);
    }


    spApi.getCalculatePackageDiscount=function(package_code,package_id,cost){
        return $http.get(baseUrl + "/hrest/v1/appt/calculatePackageDiscount?apikey=" + spApi.getApiKey() + "&sid=" + spApi.getSid() + "&package_code=" + package_code + "&package_id=" + package_id + "&cost=" + cost);
    }

    //API for create new appointment
    spApi.createNewAppointment = function(data) {
        return $http.post(baseUrl + '/hrest/v1/appt?apikey=' + spApi.getApiKey() + "&sid=" + spApi.getSid() + "&role=2", data);
    };

    spApi.saveAppointmentPayment = function(data) {
        return $http.post(baseUrl + "/hrest/v1/admin/payment?apikey=" + spApi.getApiKey() + "&sid=" + spApi.getSid() + "&role=2", data);
    }

    spApi.markAppointmentComplete = function(data) {
        return $http.post(baseUrl + "/hrest/v1/appt/complete?apikey=" + spApi.getApiKey() + "&sid=" + spApi.getSid() + "&role=2", data);
    };

    spApi.updateAppointmentDetails = function(id, data) {
        return $http.put(baseUrl + '/hrest/v1/appt/' + id + "?apikey=" + spApi.getApiKey() + "&sid=" + spApi.getSid() + "&role=2", data);
    };

    spApi.requestAppointmentChange = function(apptid, reqType, data) {
        return $http.post(baseUrl + "/hrest/v1/sp/req/" + apptid + "/" + reqType + "?apikey=" + spApi.getApiKey() + "&sid=" + spApi.getSid(), data);
    };

    spApi.emailLifeStyleInformation = function(custId, data) {
        return $http.post(baseUrl + "/hrest/v1/admin/lifeStyleInfo/" + custId + "?apikey=" + spApi.getApiKey() + "&sid=" + $cookies.get('u_sid') + "&role=2", data);
    };

    // API support to apply promocode
    spApi.applyPromocode = function (dataObj) {
        return $http.post(baseUrl + "/hrest/v1/appt/applypromocode?apikey=" + spApi.getApiKey() + "&sid=" + spApi.getSid() + "&role=2", dataObj);
    }

    //API support to get all promocodes.
    spApi.getPromo = function(active) {
        var url = baseUrl + "/hrest/v1/admin/promocode?apikey=" + spApi.getApiKey() + "&sid=" + spApi.getSid() + '&time=' + new Date().getTime() + '&role=2';
        if(active != undefined) {
            url += "&active=" + active;
        }
        return $http.get(url);
    };

    //API support to get all promocodes.
    spApi.getPackage = function(active, is_promocode) {
        var url = baseUrl + "/hrest/v1/admin/packagecode?apikey=" + spApi.getApiKey() + "&sid=" + spApi.getSid() + '&time=' + new Date().getTime() + '&role=2';
        if(active != undefined) {
            url += "&active=" + active;
        }
        if(is_promocode != undefined) {
            url += "&is_promocode=" + is_promocode;
        }
        return $http.get(url);
    };

    //API to fetch the appointment charges
    spApi.calculateApptCharges = function(obj) {
        var url = baseUrl + "/hrest/v1/appt/calculateapptcharges" +
            "?apikey=" + spApi.getApiKey() + "&sid=" + spApi.getSid() + "&role=2" +
            "&serviceid=" + obj.serviceid +
            "&massnoofappt=" + obj.massnoofappt;
        if(obj.promocode) {
            url += "&promocode=" + obj.promocode;
        }
        return $http.get(url);
    }

    // API to update (debit / credit) the customer wallet
    spApi.walletTransact = function(custId, obj) {
        return $http.put(baseUrl + "/hrest/v1/cust/" + custId + "/wallet?apikey=" + spApi.getApiKey() + "&sid=" + spApi.getSid() + "&role=2", obj);
    }

    // API to update package for customer
    spApi.updatePackage = function(custId, obj) {
        return $http.put(baseUrl + "/hrest/v1/cust/" + custId + "/package?apikey=" + spApi.getApiKey() + "&sid=" + spApi.getSid() + "&role=2", obj);
    }

	return spApi;
}]);

var tmp;
spApiService.directive('loading', ['$http', function($http){
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