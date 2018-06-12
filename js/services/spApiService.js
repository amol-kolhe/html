var spApiService = angular.module('myApp.Services', []);
spApiService.factory('spApi', ['$http', '$cookies', function($http, $cookies){
	var baseUrl = "/healyos-pdt";
	var apiKey;
	var sid;
	var spid;
	var spId;
    var spname;
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

    spApi.getSpname = function() {
        if(spname == undefined) {
            spname = $cookies.get('u_name');
        }
        return spname;
    };

    //API support to get all policy.
    spApi.getPolicy = function() {
        return $http.get(baseUrl + "/hrest/v1/admin/policy?apikey=" + spApi.getApiKey() + "&sid=" + spApi.getSid() + "&role=0");
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

     spApi.fetchFutureAppointments = function(patientid) {
        return $http.get(baseUrl + "/hrest/v1/appt/fetchfutureappt?apikey=" + spApi.getApiKey() + "&sid=" + spApi.getSid() + "&role=2&patientid=" + patientid);
    };


    //API to get services
    spApi.getServices = function() {
        return $http.get(baseUrl + "/hrest/v1/services/package?apikey=" + spApi.getApiKey() + "&sid=" + spApi.getSid());
    }

    //API to get service provider info
    spApi.getSpInfo = function(serviceDate, zoneid, servid, pin,clinic_id) {

        if(clinic_id == undefined || clinic_id == 0){
            return $http.get(baseUrl + "/hrest/v1/zone/avail?apikey=" + spApi.getApiKey() + "&sid=" + spApi.getSid() + "&date=" + serviceDate + "&zoneid=" + zoneid + "&servid=" + servid + "&pincode=" + pin);

        }else{
            return $http.get(baseUrl + "/hrest/v1/zone/avail?apikey=" + spApi.getApiKey() + "&sid=" + spApi.getSid() + "&date=" + serviceDate + "&servid=" + servid + "&clinic_id=" + clinic_id);
        }
        
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

    spApi.addDocumentationDetails = function(data) {
        return $http.put(baseUrl + "/hrest/v1/appt/addDocumentation?apikey=" + spApi.getApiKey() + "&sid=" + spApi.getSid() + "&role=2", data);
    };

    spApi.updateNewDocumentation = function(data) {
        return $http.put(baseUrl + "/hrest/v1/appt/updateDocumentation?apikey=" + spApi.getApiKey() + "&sid=" + spApi.getSid() + "&role=2", data);
    };

     spApi.documentationList = function(data) {
        return $http.post(baseUrl + "/hrest/v1/appt/listDocumentation?apikey=" + spApi.getApiKey() + "&sid=" + spApi.getSid() + "&role=2", data);
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

    spApi.fetchPatientWithWallet = function() {
        return $http.get(baseUrl + '/hrest/v1/admin/cust/fetchPatientWithWallet?apikey=' + spApi.getApiKey() + "&sid=" + spApi.getSid() + "&role=2&where=spid=" + spApi.getSpid());
    }

    spApi.getWalletHistory = function(custID) {
        return $http.get(baseUrl + '/hrest/v1/admin/walletHistory/' + custID + "?apikey=" + spApi.getApiKey() + "&sid=" + spApi.getSid() + "&role=2");
    };

    spApi.getCollection = function() {
        var url = baseUrl + "/hrest/v1/finance/collection?apikey=" + spApi.getApiKey() + "&sid=" + spApi.getSid() + '&role=2' + "&where=spid=" + spApi.getSpid();
        return $http.get(url);
    }


    //API support to get all promocodes.
    spApi.getPackage = function(active, is_promocode) {
        var url = baseUrl + "/hrest/v1/admin/packagecode?apikey=" + spApi.getApiKey() + "&sid=" + spApi.getSid() + '&time=' + new Date().getTime() + '&role=2';
        if(active != undefined) {
            url += "&active=" + active;
        }
        if(is_promocode != undefined) {
            url += "&is_promocode=" + is_promocode;
        }
        url += "&where=spid=" + spApi.getSpid() ;
        return $http.get(url);
    };

    //API to fetch the appointment charges
    spApi.calculateApptCharges = function(obj) {
        var url = baseUrl + "/hrest/v1/appt/calculateapptcharges" +
            "?apikey=" + spApi.getApiKey() + "&sid=" + spApi.getSid() + "&role=2" +
            "&serviceid=" + obj.serviceid +
            "&massnoofappt=" + obj.massnoofappt+
            "&zoneBasePrice=" + obj.zoneBasePrice;
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

    // API support to get all sp list
    spApi.getAllSps = function () {
        return $http.get(baseUrl + "/hrest/v1/admin/getAllSps?apikey=" + spApi.getApiKey() + "&sid=" + spApi.getSid() + "&role=2");
    };

    //API support to get all promocodes.
    spApi.getPromo = function(active) {
        var url = baseUrl + "/hrest/v1/admin/promocode?apikey=" + spApi.getApiKey() + "&sid=" + spApi.getSid() + '&time=' + new Date().getTime() + '&role=2';
        if(active != undefined) {
            url += "&active=" + active;
        }
        return $http.get(url);
    };

    //API support to get all clinic.
    spApi.getCity = function(active) {
        var url = baseUrl + "/hrest/v1/admin/city?apikey=" + spApi.getApiKey() + "&sid=" + spApi.getSid() + '&role=2';
        if(active != undefined) {
            url += "&active=" + active;
        }
        return $http.get(url);
    };

    //APIs for dashboard
    spApi.fetchSpAppointments = function(spid,dayBeforeYesterdayDate) {
        return $http.get(baseUrl + "/hrest/v1/appt/fetchSpAppointments?apikey=" + spApi.getApiKey() + "&sid=" + spApi.getSid() + "&role=2&spid=" + spid + "&starttime=" + dayBeforeYesterdayDate);
    };

    spApi.getSpWeeklySlot = function(spid,dateFrom,dateTill) {
        return $http.get(baseUrl + "/hrest/v1/slot/getSpWeeklySlot?apikey=" + spApi.getApiKey() + "&sid=" + spApi.getSid()+ '&spid=' + spid+ '&dateFrom=' + dateFrom+ '&dateTill=' + dateTill);
    }

    spApi.getServiceAndProducts = function() {
        var url = baseUrl + "/hrest/v1/admin/getServiceAndProducts?apikey=" + spApi.getApiKey() + "&sid=" + spApi.getSid() + '&role=2';
        return $http.get(url);
    };

    spApi.getServiceProductTrans = function(patientid) {
        var url = baseUrl + "/hrest/v1/admin/getServiceProductTrans?apikey=" + spApi.getApiKey() + "&sid=" + spApi.getSid() + "&role=2&patientid="+ patientid;
        return $http.get(url);
    };

    spApi.addServicesProductsTrans = function (dataObj,patientid,spid) {
        return $http.post(baseUrl + "/hrest/v1/admin/addServicesProductsTrans?apikey=" + spApi.getApiKey() + "&sid=" + spApi.getSid() + "&role=2&patientid="+ patientid + "&spid="+ spid , dataObj);
    }

    spApi.fetchInsufficientWalletAppts = function(spid) {
        return $http.get(baseUrl + "/hrest/v1/appt/fetchInsufficientWalletAppts?apikey=" + spApi.getApiKey() + "&sid=" + spApi.getSid() + "&role=2&spid=" + spid);
    };

    spApi.generateRecipt = function (dataObj) {
        return $http.put(baseUrl + "/hrest/v1/finance/generateInvoice?apikey=" + spApi.getApiKey() + "&sid=" + spApi.getSid() + "&role=2", dataObj);
    }

    spApi.sendRecipt = function (invoice_id,phonemobile,email) {
        return $http.get(baseUrl + "/hrest/v1/finance/sendInvoice?apikey=" + spApi.getApiKey() + "&sid=" + spApi.getSid() + "&role=2&invoice_id=" + invoice_id+"&phone="+phonemobile+"&email="+email);
    }

    spApi.getCustomerDetails = function(custID) {
        return $http.get(baseUrl + '/hrest/v1/admin/cust/' + custID + "?apikey=" + spApi.getApiKey() + "&sid=" + spApi.getSid() + "&role=2");
    };

    spApi.getSpDetails = function(spID) {
        return $http.get(baseUrl + '/hrest/v1/admin/sp/' + spID + "?apikey=" + spApi.getApiKey() + "&sid=" + spApi.getSid() + "&role=2");
    };



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