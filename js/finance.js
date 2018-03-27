angular.module('myApp.controllers')
.controller('FinanceCtrl', function($scope, $http, $cookies, ngDialog, $animate, uiGridConstants, uiGridSelectionService, uiGridExporterService, $rootScope, financeApi, $timeout, $location, $interval,$filter){
	$scope.financeInfoBarForm = {};
	$scope.financeEmail = "";
	$scope.financeName = "";
	$scope.financeAutoRefresh = false;
	/* Added for Bug 4615 : Finance collection - Auto refresh on particular time frequency.*/
	$scope.autoRefreshTimeFrequency=3600000;//60min	
	$interval( function(){ $scope.financeAutoRefreshSetting(); }, $scope.autoRefreshTimeFrequency);
	$interval( function(){ $scope.financeMgmt.getCollection(); }, $scope.autoRefreshTimeFrequency);
	$interval( function(){ $scope.financeMgmt.getFinance(); }, $scope.autoRefreshTimeFrequency);
	$interval( function(){ $scope.financeMgmt.getCollected(); }, $scope.autoRefreshTimeFrequency);
	$interval( function(){ $scope.financeMgmt.fetchPatientWithWallet(); }, $scope.autoRefreshTimeFrequency);

	$scope.financeAutoRefreshSetting = function() {
		$scope.financeAutoRefresh = true;
	}

	$scope.initFinanceInfo = function() {
		if(($cookies.get('u_email') != undefined)) {
			$scope.financeEmail = $cookies.get('u_email');
		} else {
		}
		
	   if(($cookies.get('u_name') != undefined)) {
			$scope.financeName = $cookies.get('u_name');
		} else {
		}
	}

	$scope.logoutFinance = function() {
		$scope.$root.$broadcast("logOutFinance", {});
	}


	$scope.checkSessionTimeout = function(obj) {
		if(obj.error.errorCode == 3238133787 ) {
			var cookies = $cookies.getAll();
			angular.forEach(cookies, function (v, k) {
				$cookies.remove(k);
			});
			$scope.$root.$broadcast('navigatetoHomeFinance');
		}
	};

	$scope.initFinance = function() {
		
	}

	/* **********FINANCE********************** */

	$scope.financeMgmt = {};
	$scope.financeMgmt._id = null;
	$scope.financeMgmt.customer_id = null;
	$scope.financeMgmt.customer_name = null;
	$scope.financeMgmt.service_provider_id = null;
	$scope.financeMgmt.service_provider_name = null;
	$scope.financeMgmt.package_code = null;
	$scope.financeMgmt.no_of_sessions = null;
	$scope.financeMgmt.package_rate = null;
	$scope.financeMgmt.used_sessions = null;
	$scope.financeMgmt.revise_amount = null;
	$scope.financeMgmt.cost_difference = null;
	$scope.financeMgmt.reviseRateDetails = false;
	$scope.financeMgmt.showCollectionForm = false;
	$scope.financeMgmt.trans_date = null;
	$scope.financeMgmt.trans_description = null;
	$scope.financeMgmt.trans_mode = null;
	$scope.financeMgmt.trans_amount = null;
	$scope.financeMgmt.money_deposited_by_sp = null;
	$scope.financeMgmt.is_cash = null;
	$scope.financeMgmt.cash_amount = 0;
	$scope.financeMgmt.is_cheque = null;
	$scope.financeMgmt.cheque_number = null;
	$scope.financeMgmt.cheque_bank_details = null;
	$scope.financeMgmt.cheque_amount = 0;
	$scope.financeMgmt.is_online = null;
	$scope.financeMgmt.online_transaction_id = null;
	$scope.financeMgmt.online_amount = 0;
	$scope.financeMgmt.is_paytm = null;
	$scope.financeMgmt.paytm_transaction_id = null;
	$scope.financeMgmt.paytm_amount = 0;
	$scope.financeMgmt.healyos_receipt_number = null;
	$scope.financeMgmt.arrayFinance = [];
	$scope.financeMgmt.arrayCollection = [];

	$scope.financeMgmt.arrayCustomerWithWallet = [];
	$scope.financeMgmt.arrayWalletHistory = [];
	$scope.financeMgmt.walletTransactionDetails = false;
	$scope.financeMgmt.asOfBalance = 0;
	$scope.financeMgmt.fromDate = "";
	$scope.financeMgmt.tillDate = "";
	$scope.financeMgmt.validDateRange = true;
	$scope.financeMgmt.dateValid = true;
	$scope.financeMgmt.spIdForWallet = "";
	$scope.financeMgmt.is_incorrect = 0;
	$scope.financeMgmt.incorrect_description = null;

	$scope.from_date="";
	$scope.till_date="";
	$scope.appointmentCriteria = {
		fromDate : "",
		fromEpoch : "",
		tillDate : "",
		tillEpoch : "",
		zone : "",
		zoneId : "",
		service : "",
		serviceId : "",
		custemail : "",
		custid : "",
		custph : "",
		spemail : "",
		spname : "",
		spid : ""
	};

	
	$scope.financeMgmt.getFinance = function() {
		$scope.financeMgmt.arrayFinance = [];

		financeApi.getPackage().
		success(function (data, status, headers, config) {
			var arrStoreTrue = [];
			var arrStoreTrue = data.payload;
			console.log("successfully received package cancellation request.");

			arrStoreTrue.forEach(function(item) {

				financeApi.getFetchCust(item.customer_id)
				.success(function(custData, custStatus, custHeaders, custConfig) {
					item.wallet_balance = custData.payload.customer.custwallet.walletbalance;
				})
				.error(function(data, status, headers, config) {
					item.walletBalance = 0;
				});

				/*var created_on = moment(new Date(item.created_on * 1000)).format("DD/MM/YYYY HH:mm:ss");
				var cancelled_on = moment(new Date(item.cancelled_on * 1000)).format("DD/MM/YYYY HH:mm:ss");
				
				var ms = moment(cancelled_on,"DD/MM/YYYY HH:mm:ss").diff(moment(created_on,"DD/MM/YYYY HH:mm:ss"));
				var duration = moment.duration(ms);
				var hrs = duration.asHours();*/

				if(item.package_cancellation != undefined){
					if(item.package_cancellation.used_sessions == 0){
						//if(hrs > 24){

							item.created_on = moment(new Date(item.created_on * 1000)).format("DD-MM-YYYY hh:mm A");
							if(item.no_of_sessions > 0 && item.used_sessions > 0)
								item.remaining_sessions = item.no_of_sessions - item.used_sessions;
							else
								item.remaining_sessions = item.no_of_sessions;

							$scope.financeMgmt.arrayFinance.push(item);
						//}
					}
				}else{
					//if(hrs > 24){

						item.created_on = moment(new Date(item.created_on * 1000)).format("DD-MM-YYYY hh:mm A");
						if(item.no_of_sessions > 0 && item.used_sessions > 0)
							item.remaining_sessions = item.no_of_sessions - item.used_sessions;
						else
							item.remaining_sessions = item.no_of_sessions;

						$scope.financeMgmt.arrayFinance.push(item);
					//}
				}
				
				//$scope.financeMgmt.arrayFinance.push(item);
			});
		}).
		error(function (data, status, headers, config) {
			console.log("Error in receiving package cancellation request.");
		});
	};

	$scope.financeMgmt.showReviseRate = function(rec) {
		$scope.financeAutoRefresh = false;
		$scope.financeMgmt.InitFinanceParams();
		ngDialog.openConfirm({
            template: 'ReviseRate',
            showClose:false,
            scope: $scope 
        }).then(function(value)
        {
        	if(rec != undefined){
        		$scope.financeMgmt._id = rec._id;
        		$scope.financeMgmt.customer_id = rec.customer_id;
				$scope.financeMgmt.customer_name = rec.customer_name;
				$scope.financeMgmt.service_provider_name = rec.service_provider_name;
				$scope.financeMgmt.package_code = rec.package_code;
				$scope.financeMgmt.no_of_sessions = rec.no_of_sessions;
				$scope.financeMgmt.package_rate = rec.package_rate;
				$scope.financeMgmt.used_sessions = rec.used_sessions;
			}
            if($scope.financeMgmt.revise_amount > 0 && $scope.financeMgmt.revise_amount > $scope.financeMgmt.package_rate){
                $scope.financeMgmt.cost_difference = 0;
                $scope.financeMgmt.cost_difference = parseInt(parseInt($scope.financeMgmt.revise_amount * $scope.financeMgmt.used_sessions) - parseInt($scope.financeMgmt.package_rate * $scope.financeMgmt.used_sessions));
                $scope.financeMgmt.reviseRateDetails = true;
                $scope.financeMgmt.financeErrorMsg = "";
            }else{
                $scope.financeMgmt.financeErrorMsg = "Revise rate should be greater than existing rate.";
            }
        },
        function(value) {
            console.log("Fail wallet transaction.");
        });
	};

	$scope.financeMgmt.debitWallet = function() {

		if($scope.financeMgmt.cost_difference > 0){
            
            var con = confirm("Are you sure you want to debit "+$scope.financeMgmt.cost_difference+" Rs. from wallet.");

            if(con){
            	var data = {
	                "walletAmount": $scope.financeMgmt.cost_difference,
	                "walletTransType": "debit",
	                "currency":"INR",
	                "description":"Package Cancellation",
	                "createdById":financeApi.getFinanceid(),
		            "createdByName":financeApi.getFinanceuname(),
		            "apptId":"",
	            }
	            financeApi.walletTransact($scope.financeMgmt.customer_id, data)
	            .success(function(data, status, headers, config) {
	                if(data.error == undefined && data.payload != undefined) {
	                	var id = null;
	                	var dataObj = {};
	                	id = $scope.financeMgmt._id;
						dataObj = {
							"used_sessions": $scope.financeMgmt.used_sessions,
							"existing_rate": $scope.financeMgmt.package_rate,
							"revise_rate": $scope.financeMgmt.revise_amount,
							"cost_difference": $scope.financeMgmt.cost_difference
						};

						financeApi.updatePackageTransaction(id, dataObj)
			            .success(function(data, status, headers, config) {
			                if(data.error == undefined && data.payload != undefined) {			                	
			                    $scope.financeMgmt.custwallet = data.payload.custwallet;
			                    $scope.financeMgmt.financeSuccessMsg = "Wallet updated successfully.";
			                    $scope.financeAutoRefresh = false;
			                    $scope.financeMgmt.InitFinanceParams();
			                    $scope.financeMgmt.getFinance();
			                }
			            })
			            .error(function(data, status, headers, config) {
			                console.log("Failed to update the wallet transaction!");
			                $scope.financeMgmt.financeErrorMsg = "Wallet updation failed!";
			            });
	                }
	            })
	            .error(function(data, status, headers, config) {
	                console.log("Failed to update the wallet transaction!");
	                $scope.financeMgmt.financeErrorMsg = "Wallet updation failed!";
	            });
            }
            
        }else{
            console.log("Failed to update the wallet transaction!");
            $scope.financeMgmt.financeErrorMsg = "Wallet updation failed.";
        }
    }

    $scope.financeMgmt.fetchPatientWithWallet = function(){
    	$scope.financeMgmt.walletTransactionDetails = false;
    	$scope.financeMgmt.currentDate = moment(new Date()).format('DD-MM-YYYY');
        $scope.financeMgmt.currentDateWallet = moment(new Date()).format('DD-MM-YYYY');

    	financeApi.fetchPatientWithWallet()
			.success(function(custData, custStatus, custHeaders, custConfig) {
				//console.log(custData);

				$scope.financeMgmt.arrayCustomerWithWallet = custData.payload;
				console.log($scope.financeMgmt.arrayCustomerWithWallet);

			})
			.error(function(data, status, headers, config) {
				item.walletBalance = 0;
			});

    }

     $scope.financeMgmt.getWalletHistory = function(rec){
     	$scope.financeMgmt.walletTransactionDetails = true;
     	if($scope.financeMgmt.walletTransactionDetails){
            $scope.searchWallet = {};
            $('#aptFromDateWallet').data("DateTimePicker").clear();
            $('#aptTillDateWallet').data("DateTimePicker").clear();
        }
     	$scope.financeMgmt.customerName = rec.name;

     	$scope.financeMgmt.spIdForWallet = rec._id;

         financeApi.getWalletHistory(rec._id)
			.success(function(Data, Status, Headers, Config) {
		
				$scope.financeMgmt.arrayWalletHistory = Data.payload;
				//console.log($scope.financeMgmt.arrayWalletHistory);

				var arrayWalletHistory = Data.payload;
				$scope.financeMgmt.arrayWalletData = [];
				$scope.financeMgmt.arrayWalletDataTrans = [];
				$scope.asOfBalance = 0;


				arrayWalletHistory.forEach(function(item) {
					$scope.debitAmnt = 0;
				    $scope.creditAmnt = 0;

					if(item.wallettranstype == 'credit'){
						$scope.asOfBalance = $scope.asOfBalance + item.wallettransamount;
						$scope.creditAmnt = item.wallettransamount;
					}else{
						$scope.asOfBalance = $scope.asOfBalance - item.wallettransamount;
						$scope.debitAmnt = item.wallettransamount;
					}

					item.trans_date = moment(new Date(item.transactiontime * 1000)).format("DD-MM-YYYY hh:mm A");				
					item.asOfBalance = $scope.asOfBalance;
					item.creditAmnt = $scope.creditAmnt;
					item.debitAmnt = $scope.debitAmnt;
					$scope.financeMgmt.arrayWalletData.push(item);
					$scope.financeMgmt.arrayWalletDataTrans.push(item);
				});

				//console.log($scope.financeMgmt.arrayWalletData);

			})
			.error(function(data, status, headers, config) {
				item.walletBalance = 0;
			});
     }

	$scope.financeMgmt.InitFinanceParams = function(){
		if($scope.financeAutoRefresh!=true){
			$scope.financeMgmt._id = null;
			$scope.financeMgmt.customer_id = null;
			$scope.financeMgmt.customer_name = null;
			$scope.financeMgmt.service_provider_id = null;
			$scope.financeMgmt.service_provider_name = null;
			$scope.financeMgmt.package_code = null;
			$scope.financeMgmt.no_of_sessions = null;
			$scope.financeMgmt.package_rate = null;
			$scope.financeMgmt.used_sessions = null;
			$scope.financeMgmt.revise_amount = null;
			$scope.financeMgmt.cost_difference = null;
			$scope.financeMgmt.reviseRateDetails = false;
			$scope.financeMgmt.financeErrorMsg = null;

			$scope.financeMgmt.showCollectionForm = false;
			$scope.financeMgmt.trans_date = null;
			$scope.financeMgmt.trans_description = null;
			$scope.financeMgmt.trans_mode = null;
			$scope.financeMgmt.trans_amount = null;
			$scope.financeMgmt.money_deposited_by_sp = null;
			$scope.financeMgmt.is_cash = null;
			$scope.financeMgmt.cash_amount = 0;
			$scope.financeMgmt.is_cheque = null;
			$scope.financeMgmt.cheque_number = null;
			$scope.financeMgmt.cheque_bank_details = null;
			$scope.financeMgmt.cheque_amount = 0;
			$scope.financeMgmt.is_online = null;
			$scope.financeMgmt.online_transaction_id = null;
			$scope.financeMgmt.online_amount = 0;
			$scope.financeMgmt.is_paytm = null;
			$scope.financeMgmt.paytm_transaction_id = null;
			$scope.financeMgmt.paytm_amount = 0;
			$scope.financeMgmt.healyos_receipt_number = null;

			$scope.financeMgmt.showCollectedForm = false;
			$scope.financeMgmt.is_incorrect = 0;
			$scope.financeMgmt.incorrect_description = null;
	 	}
	}

	$scope.financeReverse = false;

	$scope.financeMgmt.sortFinance = function(keyname) {
		$scope.financeSortKey = keyname;
		$scope.financeReverse = !$scope.financeReverse;
	}

	$scope.financeMgmt.sortFinance('created_on');


	//***************************COLLECTION****************************************

	$scope.financeMgmt.getCollection = function() {
		$scope.financeMgmt.InitFinanceParams();
		$scope.financeMgmt.arrayCollection = [];

		financeApi.getCollection().
		success(function (data, status, headers, config) {
			var arrStoreTrue = [];
			$scope.financeMgmt.arrayCollection = [];//Added for Bug 4617
			var arrStoreTrue = data.payload;
			console.log("successfully received collections request.");
			arrStoreTrue.forEach(function(item) {
				var today = moment(new Date()).format('YYYYMMDD');
				var alert_date = moment(new Date(item.trans_date * 1000)).add(item.finance_alert_days, 'days').format("YYYYMMDD");
				item.alert_to_finance = false;
				if(today >= alert_date){
					item.alert_to_finance = true;
				}
				item.orignal_trans_date = item.trans_date;
				//item.checkOrTransNO = item.checkOrTransNO;
				item.trans_date = moment(new Date(item.trans_date * 1000)).format("DD-MM-YYYY hh:mm A");
				$scope.financeMgmt.arrayCollection.push(item);

				
				
				
			});

			//console.log($scope.financeMgmt.arrayCollection);
		}).
		error(function (data, status, headers, config) {
			console.log("Error in receiving package cancellation request.");
		});
	};

	$scope.financeMgmt.collectionForm = function(rec) {
		$scope.financeAutoRefresh = false;
		$scope.financeMgmt.InitFinanceParams();
		
    	if(rec != undefined){
    		$scope.financeMgmt.showCollectionForm = true;
            $scope.financeMgmt.financeErrorMsg = "";
            $scope.financeMgmt.financeSuccessMsg = "";
    		$scope.financeMgmt.rec = rec;
    		$scope.financeMgmt.service_provider_name = rec.service_provider_name;
			$scope.financeMgmt.customer_name = rec.customer_name;
			$scope.financeMgmt.trans_date = rec.trans_date;
			$scope.financeMgmt.trans_description = rec.trans_description;
			$scope.financeMgmt.trans_mode = rec.trans_mode;
			$scope.financeMgmt.trans_amount = rec.trans_amount;		
			$scope.financeMgmt.is_incorrect = rec.is_incorrect;		
			$scope.financeMgmt.incorrect_description = rec.incorrect_description;			
		}

		if(rec.trans_mode == 'Cash'){
			$scope.financeMgmt.is_cash = true;
			$scope.financeMgmt.cash_amount = rec.trans_amount;
			$scope.financeMgmt.is_cheque = null;
			$scope.financeMgmt.is_online = null;
			$scope.financeMgmt.is_paytm = null;
		}

		if(rec.trans_mode == 'Cheque'){
			$scope.financeMgmt.is_cheque = true;
			$scope.financeMgmt.cheque_number = rec.checkOrTransNO;
			$scope.financeMgmt.cheque_amount = rec.trans_amount;
			$scope.financeMgmt.is_cash = null;
			$scope.financeMgmt.is_online = null;
			$scope.financeMgmt.is_paytm = null;
		}

		if(rec.trans_mode == 'Paytm'){
			$scope.financeMgmt.is_paytm = true;
			$scope.financeMgmt.paytm_transaction_id = rec.checkOrTransNO;
			$scope.financeMgmt.paytm_amount = rec.trans_amount;
			$scope.financeMgmt.is_cash = null;
			$scope.financeMgmt.is_online = null;
			$scope.financeMgmt.is_cheque = null;
		}
	};

	$scope.financeMgmt.updateCollection = function(rec) {
    	if(rec != undefined){
    		if(($scope.financeMgmt.is_cash && $scope.financeMgmt.cash_amount > 0) || ($scope.financeMgmt.is_cheque && $scope.financeMgmt.cheque_amount > 0) || ($scope.financeMgmt.is_online && $scope.financeMgmt.online_amount > 0) || ($scope.financeMgmt.is_paytm && $scope.financeMgmt.paytm_amount > 0)){
	    		dataObj = {
					"_id" : rec._id,
					"customer_id" : rec.customer_id,
					"customer_name" : rec.customer_name,
					"service_provider_id" : rec.service_provider_id,
					"service_provider_name" : rec.service_provider_name,
					"trans_date" : rec.orignal_trans_date,
					"trans_description" : rec.trans_description,
					"trans_mode" : rec.trans_mode,
					"trans_amount" : rec.trans_amount,
					"money_deposited_by_sp" : $scope.financeMgmt.money_deposited_by_sp,
					"is_cash" : $scope.financeMgmt.is_cash,
					"cash_amount" : $scope.financeMgmt.cash_amount,
					"is_cheque" : $scope.financeMgmt.is_cheque,
					"cheque_number" : $scope.financeMgmt.cheque_number,
					"cheque_bank_details" : $scope.financeMgmt.cheque_bank_details,
					"cheque_amount" : $scope.financeMgmt.cheque_amount,
					"is_online" : $scope.financeMgmt.is_online,
					"online_transaction_id" : $scope.financeMgmt.online_transaction_id,
					"online_amount" : $scope.financeMgmt.online_amount,
					"is_paytm" : $scope.financeMgmt.is_paytm,
					"paytm_transaction_id" : $scope.financeMgmt.paytm_transaction_id,
					"paytm_amount" : $scope.financeMgmt.paytm_amount,
					"healyos_receipt_number" : $scope.financeMgmt.healyos_receipt_number,
					"createdById":financeApi.getFinanceid(),
					"walletTransFlag":rec.walletTransFlag,
					"is_incorrect" : $scope.financeMgmt.is_incorrect,
					"incorrect_description" : $scope.financeMgmt.incorrect_description,
				}

				financeApi.updateCollection(rec._id, dataObj)
	            .success(function(data, status, headers, config) {
	                if(data.error == undefined && data.payload != undefined) {
	                    $scope.financeMgmt.financeSuccessMsg = "Amount collected successfully.";
	                    $scope.financeAutoRefresh = false;
	                    $scope.financeMgmt.InitFinanceParams();
	                    $scope.financeMgmt.getCollection();
	                    
	                }
	            })
	            .error(function(data, status, headers, config) {
	                console.log("Failed to update the wallet transaction!");
	                $scope.financeMgmt.financeErrorMsg = "Amount collection failed!";
	            });
	        }
		}
	};


	//***************************COLLECTED****************************************

	$scope.financeMgmt.getCollected = function() {
		$scope.financeMgmt.InitFinanceParams();
		$scope.financeMgmt.arrayCollected = [];

		financeApi.getCollected().
		success(function (data, status, headers, config) {
			var arrStoreTrue = [];
			$scope.financeMgmt.arrayCollected = [];//Added For Bug 4617
			var arrStoreTrue = data.payload;
			console.log("successfully received collected request.");
			arrStoreTrue.forEach(function(item) {
				item.alert_to_finance = false;
				if(item.outstanding_amount > 0 && !item.is_outstanding_clear){
					item.alert_to_finance = true;
				}else{
					item.outstanding_clear_time = moment(new Date(item.outstanding_clear_time * 1000)).format("DD-MM-YYYY hh:mm A");
				}
				item.trans_date = moment(new Date(item.actual_trans_date * 1000)).format("DD-MM-YYYY hh:mm A");
				item.collected_date = moment(new Date(item.created_date * 1000)).format("DD-MM-YYYY hh:mm A");
				item.trans_description = item.actual_trans_description;
				item.trans_mode = item.actual_trans_mode;
				item.trans_amount = item.actual_trans_amount;
				item.collected_amount = 0;
				if(item.cash_amount != undefined){
					if(item.cash_amount > 0){
						item.collected_amount = parseInt(item.collected_amount) + parseInt(item.cash_amount);
					}
				}
				if(item.cheque_amount != undefined){
					if(item.cheque_amount > 0){
						item.collected_amount = parseInt(item.collected_amount) + parseInt(item.cheque_amount);
					}
				}
				if(item.online_amount != undefined){
					if(item.online_amount > 0){
						item.collected_amount = parseInt(item.collected_amount) + parseInt(item.online_amount);
					}
				}
				if(item.paytm_amount != undefined){
					if(item.paytm_amount > 0){
						item.collected_amount = parseInt(item.collected_amount) + parseInt(item.paytm_amount);
					}
				}
				item.collected_amount = item.collected_amount;

				item.outstanding_amount = item.outstanding_amount;
				item.outstanding_clear_time = item.outstanding_clear_time;

				$scope.financeMgmt.arrayCollected.push(item);
			});
			//console.log('Hiiiii');
			//console.log($scope.financeMgmt.arrayCollected);
			console.log(arrStoreTrue);
		}).
		error(function (data, status, headers, config) {
			console.log("Error in receiving package cancellation request.");
		});
	};



    $scope.financeMgmt.initReports = function() {
		$scope.sortKey = 'starttime';
		$scope.reverse = false;

		var current_date = moment().unix();
		var formatted_cur_date = moment(new Date(current_date * 1000)).format("YYYY-MM-DD");

		var days = 7;
		var date = new Date();
		var weekly_date_before = Math.round((date.setTime(date.getTime() - (days * 24 * 60 * 60 * 1000)))/1000);
		var formatted_weekly_date_before = moment(new Date(weekly_date_before * 1000)).format("YYYY-MM-DD");
		
		$scope.financeMgmt.fromDate = formatted_weekly_date_before; 
		$scope.financeMgmt.tillDate = formatted_cur_date;
		$('#aptFromDate').val($scope.financeMgmt.fromDate);
		$('#aptTillDate').val($scope.financeMgmt.tillDate);
		$('#aptFromDateRevenue').val($scope.financeMgmt.fromDate);
		$('#aptTillDateRevenue').val($scope.financeMgmt.tillDate);

		$scope.financeMgmt.arrayCollectedReport = [];

	    financeApi.getCollectedReport(weekly_date_before,current_date).
		success(function (data, status, headers, config) {
			var arrStoreTrue = [];
			var arrStoreTrue = data.payload;

			console.log("successfully received collected request.");
			arrStoreTrue.forEach(function(item) {
				
				item.trans_date = moment(new Date(item.actual_trans_date * 1000)).format("DD-MM-YYYY hh:mm A");
				item.collected_date = moment(new Date(item.created_date * 1000)).format("DD-MM-YYYY hh:mm A");
				item.trans_description = item.actual_trans_description;
				item.trans_mode = item.actual_trans_mode;
				item.trans_amount = item.actual_trans_amount;
				item.collected_amount = 0;
				if(item.cash_amount != undefined){
					if(item.cash_amount > 0){
						item.collected_amount = parseInt(item.collected_amount) + parseInt(item.cash_amount);
					}
				}
				if(item.cheque_amount != undefined){
					if(item.cheque_amount > 0){
						item.collected_amount = parseInt(item.collected_amount) + parseInt(item.cheque_amount);
					}
				}
				if(item.online_amount != undefined){
					if(item.online_amount > 0){
						item.collected_amount = parseInt(item.collected_amount) + parseInt(item.online_amount);
					}
				}
				if(item.paytm_amount != undefined){
					if(item.paytm_amount > 0){
						item.collected_amount = parseInt(item.collected_amount) + parseInt(item.paytm_amount);
					}
				}
				item.collected_amount = item.collected_amount;

				item.outstanding_amount = item.outstanding_amount;
				if(item.outstanding_clear_time > 0){
					item.outstanding_clear_time = moment(new Date(item.outstanding_clear_time * 1000)).format("DD-MM-YYYY hh:mm A");
				}
				
				item.healyos_receipt_number = item.healyos_receipt_number;
				$scope.financeMgmt.arrayCollectedReport.push(item);
			});
			
			//console.log($scope.financeMgmt.arrayCollectedReport);
			$scope.initGrigOptions(formatted_weekly_date_before,formatted_cur_date);
			$scope.gridOptions.data = $scope.financeMgmt.arrayCollectedReport;
			

			//console.log("hi\n"+ $scope.gridOptions.data);
		}).
		error(function (data, status, headers, config) {
			console.log("Error in receiving collection report request.");
		});

		$scope.financeMgmt.generateRevenueReport();
		$scope.initRevenueGrigOptions(formatted_weekly_date_before,formatted_cur_date);
	
		}


	$scope.financeMgmt.generateReport = function() {
		
		var fromDt = getEpochDate($('#aptFromDate').val());
		var tillDt = getEpochDate($('#aptTillDate').val());
	  	var from_date = moment(new Date(fromDt * 1000)).format("DD-MM-YYYY");
		var to_date = moment(new Date(tillDt * 1000)).format("DD-MM-YYYY");

    	var date1 = new Date(fromDt * 1000);
    	var date2 = new Date(tillDt * 1000);
    	var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds    
    	var diffDays = Math.round(Math.abs((date1.getTime() - date2.getTime())/(oneDay)));

    	$scope.financeMgmt.validDateRange = true;
		$scope.financeMgmt.dateValid = true;

    	if(date1.getTime() > date2.getTime()){
    		$scope.financeMgmt.dateValid = false;
    	}

    	if(diffDays <= 31){
    		
			$scope.financeMgmt.arrayCollectedReport = [];

		    financeApi.getCollectedReport(fromDt,tillDt).
			success(function (data, status, headers, config) {
				var arrStoreTrue = [];
				var arrStoreTrue = data.payload;

				console.log("successfully received collected request.");
				arrStoreTrue.forEach(function(item) {
					//item.trans_date = item.actual_trans_date ;
					item.trans_date = item.actual_trans_date;//moment(new Date(item.actual_trans_date * 1000)).format("YYYY-MM-DD hh:mm A");
					item.collected_date = item.created_date;//moment(new Date(item.created_date * 1000)).format("DD-MM-YYYY hh:mm A");
					item.trans_description = item.actual_trans_description;
					item.trans_mode = item.actual_trans_mode;
					item.trans_amount = item.actual_trans_amount;
					item.collected_amount = 0;
					if(item.cash_amount != undefined){
						if(item.cash_amount > 0){
							item.collected_amount = parseInt(item.collected_amount) + parseInt(item.cash_amount);
						}
					}
					if(item.cheque_amount != undefined){
						if(item.cheque_amount > 0){
							item.collected_amount = parseInt(item.collected_amount) + parseInt(item.cheque_amount);
						}
					}
					if(item.online_amount != undefined){
						if(item.online_amount > 0){
							item.collected_amount = parseInt(item.collected_amount) + parseInt(item.online_amount);
						}
					}
					if(item.paytm_amount != undefined){
						if(item.paytm_amount > 0){
							item.collected_amount = parseInt(item.collected_amount) + parseInt(item.paytm_amount);
						}
					}
					item.collected_amount = item.collected_amount;

					item.outstanding_amount = item.outstanding_amount;
					if(item.outstanding_clear_time > 0){
						item.outstanding_clear_time = moment(new Date(item.outstanding_clear_time * 1000)).format("DD-MM-YYYY hh:mm A");
					}
					item.healyos_receipt_number = item.healyos_receipt_number;

					$scope.financeMgmt.arrayCollectedReport.push(item);
				});
				
				//console.log($scope.financeMgmt.arrayCollectedReport);
				$scope.initGrigOptions(from_date,to_date);
				$scope.gridOptions.data = $scope.financeMgmt.arrayCollectedReport;
				$scope.gridData = $scope.financeMgmt.arrayCollectedReport;		

				 var postsLen = $scope.gridData.length;

		        for(var i=0; i < postsLen; i++) {
		        	$scope.gridData[i].actual_trans_date = $scope.gridData[i].trans_date;
		        	$scope.gridData[i].trans_date = moment(new Date($scope.gridData[i].trans_date  * 1000)).format("DD-MM-YYYY hh:mm A");
		        	$scope.gridData[i].actual_collected_date = $scope.gridData[i].collected_date;
		        	$scope.gridData[i].collected_date = moment(new Date($scope.gridData[i].collected_date  * 1000)).format("DD-MM-YYYY hh:mm A");		     
		        }		 

				//console.log("hi\n"+ $scope.gridOptions.data);
			}).
			error(function (data, status, headers, config) {
				console.log("Error in receiving collection report request.");
			});
		}else{
	
			$scope.financeMgmt.validDateRange = false;
		}
			
    };


    $scope.financeMgmt.generateRevenueReport = function() {
		
		var fromDt = getEpochDate($('#aptFromDateRevenue').val());
		var tillDt = getEpochDate($('#aptTillDateRevenue').val());
	  	var from_date = moment(new Date(fromDt * 1000)).format("DD-MM-YYYY");
		var to_date = moment(new Date(tillDt * 1000)).format("DD-MM-YYYY");

		console.log(fromDt);
		console.log(tillDt);

		$scope.appointmentCriteria.fromEpoch = fromDt;
		$scope.appointmentCriteria.tillEpoch = tillDt;
		var isAdvancedSearch = false;

    	var date1 = new Date(fromDt * 1000);
    	var date2 = new Date(tillDt * 1000);
    	var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds    
    	var diffDays = Math.round(Math.abs((date1.getTime() - date2.getTime())/(oneDay)));
    	$scope.financeMgmt.validDateRange = true;
		$scope.financeMgmt.dateValid = true;
    	if(date1.getTime() > date2.getTime()){
    		$scope.financeMgmt.dateValid = false;
    	}

    	if(diffDays <= 31){
    		$scope.appointmentsList = [];
    		
			$scope.financeMgmt.arrayRevenueReport = [];
			financeApi.searchAppointments($scope.appointmentCriteria, isAdvancedSearch)
			.success(function(data, status, headers, config){
				$scope.appointmentsList = buildAppointmentsList(data.payload);

				//console.log($scope.appointmentsList);

				$scope.initRevenueGrigOptions(from_date,to_date);
				$scope.revenueGridOptions.data = $scope.appointmentsList;
				 
				
			})
			.error(function(data, status, headers, config){
				console.log("Error in receiving revenue report request.");
			});
		}else{
	
			$scope.financeMgmt.validDateRange = false;
		}
			
    };

    
    $scope.financeMgmt.generateWalletTransactions = function() {

    	//alert($scope.financeMgmt.spIdForWallet);
    	var arrayWalletDataTemp = [];

    	var fromDtWallet = getEpochDate($('#aptFromDateWallet').val());
		var tillDtWallet = getEpochDate($('#aptTillDateWallet').val());
	  	var fromDateWallet = moment(new Date(fromDtWallet * 1000)).format("DD-MM-YYYY");
		var toDateWallet = moment(new Date(tillDtWallet * 1000)).format("DD-MM-YYYY");

		alert(fromDtWallet);
		alert(tillDtWallet);

		arrayWalletDataTemp = $scope.financeMgmt.arrayWalletDataTrans;
		$scope.financeMgmt.currentDateWallet = toDateWallet;

		//console.log(arrayWalletDataTemp);

		$scope.financeMgmt.arrayWalletData = [];

		arrayWalletDataTemp.forEach(function(item) {
			var trancsaction_date = moment(new Date(item.transactiontime * 1000)).format("DD-MM-YYYY");
            // converting Date to time stamp
            var trancsaction_date_timestamp =  moment(trancsaction_date, 'DD-MM-YYYY').unix();

			//if((item.transactiontime >= fromDtWallet) && (tillDtWallet >= item.transactiontime)){
			  if((trancsaction_date_timestamp >= fromDtWallet) && (tillDtWallet >= trancsaction_date_timestamp)){	
				$scope.debitAmnt = 0;
			    $scope.creditAmnt = 0;

				if(item.wallettranstype == 'credit'){
					$scope.asOfBalance = $scope.asOfBalance + item.wallettransamount;
					$scope.creditAmnt = item.wallettransamount;
				}else{
					$scope.asOfBalance = $scope.asOfBalance - item.wallettransamount;
					$scope.debitAmnt = item.wallettransamount;
				}

				item.trans_date = moment(new Date(item.transactiontime * 1000)).format("DD-MM-YYYY hh:mm A");				
				item.asOfBalance = $scope.asOfBalance;
				item.creditAmnt = $scope.creditAmnt;
				item.debitAmnt = $scope.debitAmnt;
				$scope.financeMgmt.arrayWalletData.push(item);
			}
		});

		//console.log($scope.financeMgmt.arrayWalletData);

    }



	$scope.initGrigOptions = function(fromdate,tilldate) {

		var from_date=fromdate;
		var till_date=tilldate;

		//alert(from_date);
		//alert(till_date);

	    $scope.gridOptions = {
	    	 data: 'gridData',
		    columnDefs: [
		      { field: 'customer_name' },
		      //{ field: 'service_provider_name', visible: false},
		      { field: 'service_provider_name' },
		      { field: 'trans_description' },
		      { field: 'trans_mode' },
		      { field: 'actual_trans_date',
		        displayName:'Trans Date',
		        cellTemplate: "<span style='display:none'> {{row.entity.actual_trans_date}} </span> <span> {{row.entity.trans_date}}</span>"
              },
              { field: 'actual_collected_date',
		        displayName:'Collected Date',
		        cellTemplate: "<span style='display:none'> {{row.entity.actual_collected_date}} </span> <span> {{row.entity.collected_date}}</span>"
              },
		      { field: 'trans_amount' },
		      { field: 'collected_amount' },
		      { field: 'outstanding_amount' },
		      { field: 'outstanding_clear_time' },
		      { field: 'healyos_receipt_number' },
		    ],
		    enableGridMenu: true,
		    enableSelectAll: true,
		    exporterCsvFilename: 'Collection_Report.csv',
		    exporterPdfDefaultStyle: {fontSize: 9},
		    exporterPdfTableStyle: {margin: [ 0, 0, 0, 0 ]},
		    exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},
		    exporterPdfHeader: { text: "Collection Report", style: 'headerStyle' },
		    exporterFieldCallback: function ( grid, row, col, value ){
			              if (col.name === "actual_trans_date" || col.name === "actual_collected_date") {
			              var wu_details = "";
			              if(!angular.isUndefined(value)){
            				wu_details = moment(new Date(value * 1000)).format("DD-MM-YYYY hh:mm A");
            				value = wu_details;
				            }
				          else{
					                value = value;
				              }
				              
			            }
			            else{
			               value = value;
			              
			            }
			  return value;
			},
		    exporterPdfFooter: function ( currentPage, pageCount ) {
		      return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
		    },
		    exporterPdfCustomFormatter: function ( docDefinition ) {
		      docDefinition.styles.headerStyle = { fontSize: 22, bold: true, alignment: 'center' };
		      docDefinition.styles.footerStyle = { fontSize: 10, bold: true, alignment: 'right' };
		      return docDefinition;
		    },
		    exporterPdfOrientation: 'landscape',
		    exporterPdfPageSize: 'LETTER',
		    exporterPdfMaxGridWidth: 600,
		    exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
		    onRegisterApi: function(gridApi){
		      $scope.gridApi = gridApi;
		    }
	  	};

  	}

  	$scope.initRevenueGrigOptions = function(fromdate,tilldate) {

		var from_date=fromdate;
		var till_date=tilldate;

		//alert(from_date);
		//alert(till_date);

	    $scope.revenueGridOptions = {
		    columnDefs: [
		      { field: 'city' },
		      //{ field: 'service_provider_name', visible: false},
		      { field: 'sdate',name:'Appt.Date',width: '18%' },
		      { field: 'ref' ,name:'Ref.No.'},
		      { field: 'zone' },
		      { field: 'spname' ,name:'Service Provider',width: '15%'},
		      { field: 'patient',width: '15%'},
		      { field: 'state' ,name:'Appt.State'},
		      { field: 'payment' },
		    ],
		    enableGridMenu: true,
		    enableSelectAll: true,
		    enableFiltering: true,
		    exporterCsvFilename: 'Revenue_Report.csv',
		    exporterPdfDefaultStyle: {fontSize: 9},
		    exporterPdfTableStyle: {margin: [ 0, 0, 0, 0 ]},
		    exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},
		    exporterPdfHeader: { text: "Revenue Report", style: 'headerStyle' },
		    exporterPdfFooter: function ( currentPage, pageCount ) {
		      return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
		    },
		    exporterPdfCustomFormatter: function ( docDefinition ) {
		      docDefinition.styles.headerStyle = { fontSize: 22, bold: true, alignment: 'center' };
		      docDefinition.styles.footerStyle = { fontSize: 10, bold: true, alignment: 'right' };
		      return docDefinition;
		    },
		    exporterPdfOrientation: 'landscape',
		    exporterPdfPageSize: 'LETTER',
		    exporterPdfMaxGridWidth: 600,
		    exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
		    onRegisterApi: function(gridApi){
		      $scope.gridApi = gridApi;
		    }
	  	};

  	}


	$scope.financeMgmt.collectedForm = function(rec) {
		$scope.financeAutoRefresh = false;
		$scope.financeMgmt.InitFinanceParams();
		
    	if(rec != undefined){
    		$scope.financeMgmt.showCollectedForm = true;
    		$scope.financeMgmt._id = rec._id;
			$scope.financeMgmt.customer_id = rec.customer_id;
			$scope.financeMgmt.customer_name = rec.customer_name;
			$scope.financeMgmt.service_provider_id = rec.service_provider_id;
			$scope.financeMgmt.service_provider_name = rec.service_provider_name;
			$scope.financeMgmt.trans_date = rec.trans_date;
			$scope.financeMgmt.collected_date = rec.collected_date;
			$scope.financeMgmt.trans_description = rec.trans_description;
			//$scope.financeMgmt.trans_description = rec.description;
			$scope.financeMgmt.trans_mode = rec.trans_mode;
			$scope.financeMgmt.trans_amount = rec.trans_amount;
			$scope.financeMgmt.collected_amount = rec.collected_amount;
			$scope.financeMgmt.money_deposited_by_sp = rec.money_deposited_by_sp;
			$scope.financeMgmt.is_cash = rec.is_cash;
			$scope.financeMgmt.cash_amount = rec.cash_amount;
			$scope.financeMgmt.is_cheque = rec.is_cheque;
			$scope.financeMgmt.cheque_number = rec.cheque_number;
			$scope.financeMgmt.cheque_bank_details = rec.cheque_bank_details;
			$scope.financeMgmt.cheque_amount = rec.cheque_amount;
			$scope.financeMgmt.is_online = rec.is_online;
			$scope.financeMgmt.online_transaction_id = rec.online_transaction_id;
			$scope.financeMgmt.online_amount = rec.online_amount;
			$scope.financeMgmt.is_paytm = rec.is_paytm;
			$scope.financeMgmt.paytm_transaction_id = rec.paytm_transaction_id;
			$scope.financeMgmt.paytm_amount = rec.paytm_amount;
			$scope.financeMgmt.healyos_receipt_number = rec.healyos_receipt_number;
			$scope.financeMgmt.outstanding_amount = rec.outstanding_amount;
			$scope.financeMgmt.outstanding_clear_time = rec.outstanding_clear_time;
			$scope.financeMgmt.is_outstanding_clear = rec.is_outstanding_clear;
			$scope.financeMgmt.is_incorrect = rec.is_incorrect;
			$scope.financeMgmt.incorrect_description = rec.incorrect_description;
		}
	};

	$timeout(function(){
		$('.dateTimePicker').datetimepicker({
			format: 'YYYY-MM-DD'
		});
		$('.datetimepicker2').datetimepicker({
			format: 'YYYY-MM-DD'
		});
		$('#datetimepicker4').datetimepicker({
			format: 'YYYY-MM-DD'
		});
		$('#datetimepicker5').datetimepicker({
			format: 'YYYY-MM-DD'
		});
		$('.dateTimePickerRevenue').datetimepicker({
			format: 'YYYY-MM-DD hh:mm A'
		});
	}, 200);


    $scope.initGrigOptions($scope.from_date,$scope.till_date);
    $scope.initRevenueGrigOptions($scope.from_date,$scope.till_date);

	$scope.initFinance();
	
});