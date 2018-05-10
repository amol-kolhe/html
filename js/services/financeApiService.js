var financeApiService = angular.module('myApp.Services', []);
financeApiService.factory('financeApi', ['$http', '$cookies', function($http, $cookies){
	var baseUrl = "/healyos-pdt";
	var apiKey;
	var sid;
	var financeid;
	var finance_u_name;
	var userType;
	var financeApi = {};

	financeApi.getApiKey = function() {
		if(apiKey == undefined) {
            apiKey = $cookies.get('u_apikey');
        }
		return apiKey;
	};

	financeApi.getSid = function() {
		/*if(sid == undefined) {
            sid = $cookies.get('u_sid');
        }*/
        return $cookies.get('u_sid');
	};

	financeApi.getFinanceid = function() {
		if(financeid == undefined) {
            financeid = $cookies.get('u_id');
        }
        return financeid;
	}

	financeApi.getFinanceuname = function() {
		if(finance_u_name == undefined) {
            finance_u_name = $cookies.get('u_name');
        }
        return finance_u_name;
	}

	financeApi.getUserType = function() {
		if(userType == undefined) {
			userType = $cookies.get('u_type');
		}
		return userType;
	}

	financeApi.getPackage = function() {
		var url = baseUrl + "/hrest/v1/admin/package?apikey=" + financeApi.getApiKey() + "&sid=" + financeApi.getSid() + '&role=3';
		return $http.get(url);
	}

	financeApi.walletTransact = function(custId, obj) {
        return $http.put(baseUrl + "/hrest/v1/cust/" + custId + "/wallet?apikey=" + financeApi.getApiKey() + "&sid=" + financeApi.getSid() + "&role=3", obj);
    }

	financeApi.updatePackageTransaction = function(id, dataObj) {
		return $http.put(baseUrl + "/hrest/v1/admin/updatePackageTransaction/" + id + "?apikey=" + financeApi.getApiKey() + "&sid=" + financeApi.getSid() + "&role=3",dataObj);
	}

	financeApi.fetchPatientWithWallet = function() {
		return $http.get(baseUrl + '/hrest/v1/admin/cust/fetchPatientWithWallet?apikey=' + financeApi.getApiKey() + "&sid=" + financeApi.getSid() + "&role=3&where=fnid=" + financeApi.getFinanceid());
	}

	financeApi.getFetchCust = function(custID) {
		return $http.get(baseUrl + '/hrest/v1/admin/cust/' + custID + "?apikey=" + financeApi.getApiKey() + "&sid=" + financeApi.getSid() + "&role=3");
	};

	financeApi.getWalletHistory = function(custID) {
		return $http.get(baseUrl + '/hrest/v1/admin/walletHistory/' + custID + "?apikey=" + financeApi.getApiKey() + "&sid=" + financeApi.getSid() + "&role=3");
	};

	financeApi.getCollection = function() {
		var url = baseUrl + "/hrest/v1/finance/collection?apikey=" + financeApi.getApiKey() + "&sid=" + financeApi.getSid() + '&role=3';
		return $http.get(url);
	}

	financeApi.updateCollection = function(id, dataObj) {
		return $http.put(baseUrl + "/hrest/v1/finance/updateCollection/" + id + "?apikey=" + financeApi.getApiKey() + "&sid=" + financeApi.getSid() + "&role=3",dataObj);
	}

	financeApi.getCollected = function() {
		var url = baseUrl + "/hrest/v1/finance/collected?apikey=" + financeApi.getApiKey() + "&sid=" + financeApi.getSid() + '&role=3';
		return $http.get(url);
	}

	financeApi.getCollectedReport = function(fromDate,tillDate) {
		var url = baseUrl + "/hrest/v1/finance/collectedReport?apikey=" + financeApi.getApiKey() + "&sid=" + financeApi.getSid() + '&role=3' + '&fromDate=' + fromDate + '&tillDate=' + tillDate;
		return $http.get(url);
	}

	financeApi.searchAppointments = function(appointmentCriteria, isAdvancedSearch) {
		return $http.get(baseUrl + "/hrest/v1/appt?apikey=" + financeApi.getApiKey() + "&sid=" + financeApi.getSid() + "&role=3&where=" + createSearchAppointmentsQuery(appointmentCriteria, isAdvancedSearch));
	};

	financeApi.generateRecipt = function (dataObj) {
        return $http.put(baseUrl + "/hrest/v1/finance/generateInvoice?apikey=" + financeApi.getApiKey() + "&sid=" + financeApi.getSid() + "&role=3", dataObj);
    }

    financeApi.sendRecipt = function (invoice_id,phonemobile,email) {
        return $http.get(baseUrl + "/hrest/v1/finance/sendInvoice?apikey=" + financeApi.getApiKey() + "&sid=" + financeApi.getSid() + "&role=3&invoice_id=" + invoice_id+"&phone="+phonemobile+"&email="+email);
    }

    financeApi.getCustomerDetails = function(custID) {
        return $http.get(baseUrl + '/hrest/v1/admin/cust/' + custID + "?apikey=" + financeApi.getApiKey() + "&sid=" + financeApi.getSid() + "&role=3");
    };

    financeApi.getSpDetails = function(spID) {
        return $http.get(baseUrl + '/hrest/v1/admin/sp/' + spID + "?apikey=" + financeApi.getApiKey() + "&sid=" + financeApi.getSid() + "&role=3");
    };

	return financeApi;
}]);

var tmp;
financeApiService.directive('loading', ['$http', '$timeout', function($http, $timeout){
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
