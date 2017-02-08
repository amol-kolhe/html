var adminApiService = angular.module('myApp.Services', []);
adminApiService.factory('adminApi', ['$http', '$cookies', function($http, $cookies){
	var baseUrl = "/healyos-pdt";
	var apiKey;
	var sid;
	var adminid;
	var userType;
	var adminApi = {};

	adminApi.getApiKey = function() {
		if(apiKey == undefined) {
            apiKey = $cookies.get('u_apikey');
        }
		return apiKey;
	};

	adminApi.getSid = function() {
		/*if(sid == undefined) {
            sid = $cookies.get('u_sid');
        }*/
        return $cookies.get('u_sid');
	};

	adminApi.getAdminid = function() {
		if(adminid == undefined) {
            adminid = $cookies.get('u_id');
        }
        return adminid;
	}

	adminApi.getUserType = function() {
		if(userType == undefined) {
			userType = $cookies.get('u_type');
		}
		return userType;
	}

	//API to get cities for given country
	adminApi.getCities = function(countryName) {
		return $http.get(baseUrl + "/hrest/v1/zone/cities?apikey=" + adminApi.getApiKey() + "&sid=" + adminApi.getSid() + "&countrynm=" + countryName);
	}
	
	//API to get zones for given city
	adminApi.getZones = function(cityId) {
		return $http.get(baseUrl + "/hrest/v1/zone/map?apikey=" + adminApi.getApiKey() + "&sid=" + adminApi.getSid() + "&cityid=" + cityId);
	}
	
	//API to record enquiry
	adminApi.createAptRecordEnquiry = function(data) {
		return $http.post(baseUrl + "/hrest/v1/admin/enquiry?apikey=" + adminApi.getApiKey() + "&sid=" + adminApi.getSid(), data);
	};
	
	//API to get services
	adminApi.getServices = function() {
		return $http.get(baseUrl + "/hrest/v1/services/package?apikey=" + adminApi.getApiKey() + "&sid=" + adminApi.getSid());
	}
	
	//API to get service provider info
	adminApi.getSpInfo = function(serviceDate, zoneid, servid, pin, spid) {
	    if(spid == undefined) {
		    return $http.get(baseUrl + "/hrest/v1/zone/avail?apikey=" + adminApi.getApiKey() + "&sid=" + adminApi.getSid() + "&date=" + serviceDate + "&zoneid=" + zoneid + "&servid=" + servid + "&pincode=" + pin);
	    }
	    else {
	        return $http.get(baseUrl + "/hrest/v1/zone/avail?apikey=" + adminApi.getApiKey() + "&sid=" + adminApi.getSid() + "&date=" + serviceDate + "&zoneid=" + zoneid + "&servid=" + servid + "&pincode=" + pin + "&spid=" + spid);
	    }
	}

	adminApi.getCalculatePackageDiscount=function(package_code,package_id,cost){
        return $http.get(baseUrl + "/hrest/v1/appt/calculatePackageDiscount?apikey=" + adminApi.getApiKey() + "&sid=" + adminApi.getSid() + "&package_code=" + package_code + "&package_id=" + package_id + "&cost=" + cost);
    };
	
	//API for create new appointment 
	adminApi.createNewAppointment = function(data) {
		return $http.post(baseUrl + '/hrest/v1/appt?apikey=' + adminApi.getApiKey() + "&sid=" + adminApi.getSid() + "&role=0", data);
	};
	
	//API for customer search 
	adminApi.getCustSearch = function(item) {
		var items = item;
		var url = baseUrl + '/hrest/v1/admin/cust?apikey=' + adminApi.getApiKey() + "&sid=" + adminApi.getSid() + "&role=0" + "&where=";

		$.each(items, function(key, value) {
			if(value != ""){
				url = url + key + "=" + value + "AND";
				str = url.substring(0, url.length - 3);
			}
		});
		return $http.get(str);
	};
	
	//API for fetch customer 
	adminApi.getFetchCust = function(custID) {
		return $http.get(baseUrl + '/hrest/v1/admin/cust/' + custID + "?apikey=" + adminApi.getApiKey() + "&sid=" + adminApi.getSid() + "&role=0");
	};
	
	//API for edit customer by admin
	adminApi.updateCustomerDetails = function(id, data) {
		return $http.put(baseUrl + '/hrest/v1/admin/cust/' + id + "?apikey=" + adminApi.getApiKey() + "&sid=" + adminApi.getSid() + "&role=0", data);
	};

	//API support for Appointments
	adminApi.getAppointmentDetails = function(id) {
		return $http.get(baseUrl + '/hrest/v1/appt/' + id + "?apikey=" + adminApi.getApiKey() + "&sid=" + adminApi.getSid() + "&role=0");
	};

	adminApi.updateAppointmentDetails = function(id, data) {
		return $http.put(baseUrl + '/hrest/v1/appt/' + id + "?apikey=" + adminApi.getApiKey() + "&sid=" + adminApi.getSid() + "&role=0", data);
	};

	adminApi.deleteAppointmentDetails = function(id) {
        return $http.delete(baseUrl + '/hrest/v1/appt/' + id + "?apikey=" + adminApi.getApiKey() + "&sid=" + adminApi.getSid() + "&role=0");
    };

	adminApi.searchAppointments = function(appointmentCriteria, isAdvancedSearch) {
		return $http.get(baseUrl + "/hrest/v1/appt?apikey=" + adminApi.getApiKey() + "&sid=" + adminApi.getSid() + "&role=0&where=" + createSearchAppointmentsQuery(appointmentCriteria, isAdvancedSearch));
	};

	adminApi.searchCreateTimeBasedAppointments = function(appointmentCriteria) {
		return $http.get(baseUrl + "/hrest/v1/appt?apikey=" + adminApi.getApiKey() + "&sid=" + adminApi.getSid() + "&role=0&type=createtime&where=" + createCreationTimeApptQuery(appointmentCriteria));
	};

	adminApi.searchRescheduledAppointments = function(appointmentCriteria) {
		return $http.get(baseUrl + "/hrest/v1/appt?apikey=" + adminApi.getApiKey() + "&sid=" + adminApi.getSid() + "&role=0&type=rescheduledfor&where=" + createCreationTimeApptQuery(appointmentCriteria));
	};

	adminApi.searchActionableAppts = function() {
		return $http.get(baseUrl + "/hrest/v1/appt?apikey=" + adminApi.getApiKey() + "&sid=" + adminApi.getSid() + "&role=0&where=timespan=ALLANDstate=7");
	};

	adminApi.searchTodaysAppointments = function(appointmentCriteria) {
		return $http.get(baseUrl + "/hrest/v1/appt?apikey=" + adminApi.getApiKey() + "&sid=" + adminApi.getSid() + "&role=0&where=timespan=" + appointmentCriteria.timespan);
	};

	adminApi.saveAppointmentPayment = function(data) {
		return $http.post(baseUrl + "/hrest/v1/admin/payment?apikey=" + adminApi.getApiKey() + "&sid=" + adminApi.getSid() + "&role=0", data);
	};

	adminApi.markAppointmentComplete = function(data) {
		return $http.post(baseUrl + "/hrest/v1/appt/complete?apikey=" + adminApi.getApiKey() + "&sid=" + adminApi.getSid() + "&role=0", data);
	};

    adminApi.emailLifeStyleInformation = function(custId, data) {
		return $http.post(baseUrl + "/hrest/v1/admin/lifeStyleInfo/" + custId + "?apikey=" + adminApi.getApiKey() + "&sid=" + adminApi.getSid() + "&role=0", data);
    };

    adminApi.setActionable = function(id, data) {
        return $http.post(baseUrl + '/hrest/v1/admin/approve/' + id + "?apikey=" + adminApi.getApiKey() + "&sid=" + adminApi.getSid() + "&role=0", data);
    };

    // API support to get callMe list
    adminApi.callMeList = function(fromDate, toDate) {
		if (fromDate == "" && toDate == "") {
			return $http.get(baseUrl + "/hrest/v1/admin/callme?apikey=" + adminApi.getApiKey() + "&sid=" + adminApi.getSid() + "&type=yet_to_call");
		} else if ((fromDate != undefined && fromDate != "") && (toDate != undefined && toDate != "")) {
			return $http.get(baseUrl + "/hrest/v1/admin/callme?apikey=" + adminApi.getApiKey() + "&sid=" + adminApi.getSid() + "&from=" + fromDate + "&to=" + toDate);
		}
	};

	// API support to move callMe back items with one of the defined types.
	/*adminApi.moveToCallMeBack = function(dataObj) {
		if (dataObj != undefined) {
			return $http.post(baseUrl + "/hrest/v1/admin/callme?apikey=" + adminApi.getApiKey() + "&sid=" + adminApi.getSid(), dataObj);
		}
	};*/

	// API support to get sp list
	adminApi.getSps = function (cityId) {
		return $http.get(baseUrl + "/hrest/v1/admin/" + cityId + "/sps?apikey=" + adminApi.getApiKey() + "&sid=" + adminApi.getSid() + "&role=0");
	};

	// API support to add new sp record
	adminApi.addNewSpRecord = function (spDetailsObj) {
		return $http.post(baseUrl + "/hrest/v1/admin/addNewSp?apikey=" + adminApi.getApiKey() + "&sid=" + adminApi.getSid() + "&role=0", spDetailsObj);
	};

	// API support to update existing sp record
	adminApi.updateSpRecord = function (spDetailsObj, spId) {
		return $http.put(baseUrl + "/hrest/v1/admin/updateSp/" + spId + "?apikey=" + adminApi.getApiKey() + "&sid=" + adminApi.getSid() + "&role=0", spDetailsObj);
	};

	// API support to delete existing sp record
	adminApi.deleteSpRecord = function (spId) {
		return $http.delete(baseUrl + "/hrest/v1/admin/deleteSp/" + spId + "?apikey=" + adminApi.getApiKey() + "&sid=" + adminApi.getSid() + "&role=0");
	};

	// API support to add work hours for sp
	adminApi.addSpWrkHrs = function (wrkHrsDetailsObj) {
		return $http.post(baseUrl + "/hrest/v1/admin/addSpWrkHrs?apikey=" + adminApi.getApiKey() + "&sid=" + adminApi.getSid(), wrkHrsDetailsObj);
	};

	// API support to add leaves for sp
	adminApi.addSpLeaves = function (leaveDetailsObj) {
		return $http.post(baseUrl + "/hrest/v1/admin/markSpLeaves?apikey=" + adminApi.getApiKey() + "&sid=" + adminApi.getSid(), leaveDetailsObj);
	};

	// API support to get wtime and offslots for sp
	adminApi.getSpMonthlyWtimeAndOffSlots = function (dataObj) {
		return $http.post(baseUrl + "/hrest/v1/admin/getSpMonthlyWtimeAndOffSlots?apikey=" + adminApi.getApiKey() + "&sid=" + adminApi.getSid(), dataObj);
	};

	//API support to Add New promo code.
	adminApi.addPromoCode = function(promoobj) {
		return $http.post(baseUrl + "/hrest/v1/admin/promocode?apikey=" + adminApi.getApiKey() + "&sid=" + adminApi.getSid(), promoobj);
	};

	//API support to update promocode
	adminApi.updatePromoCode = function(promoobj, promoId) {
		return $http.put(baseUrl + "/hrest/v1/admin/promocode/" + promoId + "?apikey=" + adminApi.getApiKey() + "&sid=" + adminApi.getSid(), promoobj);
	};

	//API support to get all promocodes.
	adminApi.getPromo = function(active) {
		var url = baseUrl + "/hrest/v1/admin/promocode?apikey=" + adminApi.getApiKey() + "&sid=" + adminApi.getSid() + '&time=' + new Date().getTime() + '&role=0';
		if(active != undefined) {
			url += "&active=" + active;
		}
		return $http.get(url);
	};

	//API support to Add New clinic.
	adminApi.addClinic = function(clinicobj) {
		return $http.post(baseUrl + "/hrest/v1/admin/clinic?apikey=" + adminApi.getApiKey() + "&sid=" + adminApi.getSid(), clinicobj);
	};

	//API support to get all clinic.
	adminApi.getClinic = function(active) {
		var url = baseUrl + "/hrest/v1/admin/clinic?apikey=" + adminApi.getApiKey() + "&sid=" + adminApi.getSid() + '&role=0';
		if(active != undefined) {
			url += "&active=" + active;
		}
		return $http.get(url);
	};

	//API support to update the clinic
	adminApi.updateClinic = function(id, dataObj) {
		return $http.put(baseUrl + "/hrest/v1/admin/updateClinic/" + id + "?apikey=" + adminApi.getApiKey() + "&sid=" + adminApi.getSid() + "&role=0",dataObj);
	}

	//APIsupport to delet promocodes
	adminApi.deletePromoCode = function(promoId) {
		return $http.delete(baseUrl + "/hrest/v1/admin/promocode/" + promoId + "?apikey=" + adminApi.getApiKey() + "&sid=" + adminApi.getSid());
	}

	// API support to apply promocode
	adminApi.applyPromocode = function (dataObj) {
		return $http.post(baseUrl + "/hrest/v1/appt/applypromocode?apikey=" + adminApi.getApiKey() + "&sid=" + adminApi.getSid() + "&role=0", dataObj);
	}

	//API support to add new zone
	adminApi.addNewZone = function (dataObj) {
		return $http.post(baseUrl + "/hrest/v1/admin/addNewZone?apikey=" + adminApi.getApiKey() + "&sid=" + adminApi.getSid() + "&role=0", dataObj);
	};

	//API support to get all zones
	adminApi.getAllZones = function() {
		return $http.get(baseUrl + "/hrest/v1/admin/getZone?apikey=" + adminApi.getApiKey() + "&sid=" + adminApi.getSid() + "&role=0&time=" + new Date().getTime());
	};

	//API support to edit the zone
	adminApi.editZone = function(id, dataObj) {
		return $http.put(baseUrl + "/hrest/v1/admin/updateZone/" + id + "?apikey=" + adminApi.getApiKey() + "&sid=" + adminApi.getSid() + "&role=0",dataObj);
	}

	//API support to delete Zone
	adminApi.deleteZone = function(id) {
		return $http.delete(baseUrl + "/hrest/v1/admin/deleteZone/" + id + "?apikey=" + adminApi.getApiKey() + "&sid=" + adminApi.getSid() + "&role=0");
	}

	//API to fetch the appointment charges
	adminApi.calculateApptCharges = function(obj) {
		var url = baseUrl + "/hrest/v1/appt/calculateapptcharges" +
			"?apikey=" + adminApi.getApiKey() + "&sid=" + adminApi.getSid() + "&role=0" +
			"&serviceid=" + obj.serviceid +
			"&massnoofappt=" + obj.massnoofappt;
		if(obj.promocode) {
			url += "&promocode=" + obj.promocode;
		}
		return $http.get(url);
	}

	// API to update (debit / credit) the customer wallet
	adminApi.walletTransact = function(custId, obj) {
		return $http.put(baseUrl + "/hrest/v1/cust/" + custId + "/wallet?apikey=" + adminApi.getApiKey() + "&sid=" + adminApi.getSid() + "&role=0", obj);
	}

	return adminApi;
}]);

var tmp;
adminApiService.directive('loading', ['$http', '$timeout', function($http, $timeout){
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
