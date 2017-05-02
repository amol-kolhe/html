
angular.module('myApp.controllers')
.controller('FinanceCtrl', function($scope, $http, $cookies, ngDialog, $rootScope, financeApi, $timeout, $location, $interval){
	
	$scope.financeInfoBarForm = {};
	$scope.financeEmail = "";
	$scope.financeName = "";
	

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
	$scope.financeMgmt.service_provider_name = null;
	$scope.financeMgmt.package_code = null;
	$scope.financeMgmt.no_of_sessions = null;
	$scope.financeMgmt.package_rate = null;
	$scope.financeMgmt.used_sessions = null;
	$scope.financeMgmt.revise_amount = null;
	$scope.financeMgmt.cost_difference = null;
	$scope.financeMgmt.reviseRateDetails = false;
	$scope.financeMgmt.arrayFinance = [];

	$scope.financeMgmt.getFinance = function() {
		$scope.financeMgmt.arrayFinance = [];

		financeApi.getPackage().
		success(function (data, status, headers, config) {
			var arrStoreTrue = [];
			var arrStoreTrue = data.payload;
			console.log("successfully safnajfnajfreceived package cancellation request hiiiii.");

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
							$scope.financeMgmt.arrayFinance.push(item);
						//}
					}
				}else{
					//if(hrs > 24){
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
	                "currency":"INR"
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

	$scope.financeMgmt.InitFinanceParams = function(){
		$scope.financeMgmt._id = null;
		$scope.financeMgmt.customer_id = null;
		$scope.financeMgmt.customer_name = null;
		$scope.financeMgmt.service_provider_name = null;
		$scope.financeMgmt.package_code = null;
		$scope.financeMgmt.no_of_sessions = null;
		$scope.financeMgmt.package_rate = null;
		$scope.financeMgmt.used_sessions = null;
		$scope.financeMgmt.revise_amount = null;
		$scope.financeMgmt.cost_difference = null;
		$scope.financeMgmt.reviseRateDetails = false;
		$scope.financeMgmt.financeErrorMsg = null;
	}

	$scope.financeReverse = false;

	$scope.financeMgmt.sortFinance = function(keyname) {
		$scope.financeSortKey = keyname;
		$scope.financeReverse = !$scope.financeReverse;
	}

	$scope.financeMgmt.sortFinance('created_on');

	$scope.initFinance();
});