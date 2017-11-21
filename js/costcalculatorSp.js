angular.module('myApp.controllers')
.controller('CostCalculatorCtrl', function($scope, $http, spApi){
	var vm = this;
	var promocodeLabel = "Select Promocode";

	vm.models = {
		calculator: {
			noofappt: 1,
			promo: promocodeLabel
		},
		promocodes: [],
		service: {
			id: "",
			name: ""
		},
		response: null
	};

	vm.methods = {
		init: init,
		getServices: getServices,
		getPromoCodes: getPromoCodes,
		calculateCost: calculateCost,
		verifyNoofappt: verifyNoofappt
	};

	vm.flags = {};

	function init() {
		vm.methods.getServices();
		vm.methods.getPromoCodes();
	}

	function getPromoCodes() {
		spApi.getPromo(true).
		success(function (data, status, headers, config) {
			vm.models.promocodes = [];
			var tempArr = data.payload
			console.log("successfully received promo codes");
			console.log(data);
			angular.copy(tempArr, vm.models.promocodes);
			vm.models.promocodes.forEach(function(item) {
				item.validFromReadonly = item.validfrom*1000;
				item.validTillReadonly = item.validtill*1000;
				item.validfrom = moment(new Date(item.validfrom*1000).toString());
				item.validtill = moment(new Date(item.validtill*1000).toString());
				item.disctype = item.disctype.toString();
				item.isNewPromo = false;
				item.noofappt = item.noofappt;
			});
		}).
		error(function (data, status, headers, config) {
			console.log("Error in receiving promo codes");
		});
	}

	function getServices() {
		spApi.getServices().
		success(function (data, status, headers, config) {
			if(data && data.payload && data.payload.length != 0 && data.payload[0].services && data.payload[0].services.length != 0) {
				vm.models.service.id = data.payload[0].services[0].id;
				vm.models.service.name = data.payload[0].services[0].servicename;
			}
		}).
		error(function (data, status, headers, config) {
			console.log("Error in receiving service");
		});
	}

	function calculateCost() {
		vm.models.response = null;
		var data = {
			massnoofappt: vm.models.calculator.noofappt,
			serviceid: vm.models.service.id
		};
		if(vm.models.calculator.promo != promocodeLabel) {
			data.promocode = vm.models.calculator.promo;
		}
		spApi.calculateApptCharges(data).
		success(function (data, status, headers, config) {
			if(data && data.payload) {
				vm.models.response = data.payload;
				vm.models.response.showResponse = true;
				vm.models.response.status = data.status;
			}
		}).
		error(function (data, status, headers, config) {
			if(data && data.error && data.error.message) {
				vm.models.response = {
					error: data.error.message
				};
			}
			console.log("Error in receiving cost per appointment");
		});
	}

	function verifyNoofappt() {
		if(vm.models.calculator.noofappt == undefined || vm.models.calculator.noofappt == "") {
			vm.models.calculator.noofappt = 1;
		} else if(isNaN(vm.models.calculator.noofappt)) {
			vm.models.calculator.noofappt = 1;
		} else {
			var num = 1;
			try {
				num = parseInt(vm.models.calculator.noofappt);
			} catch(err) {
				vm.models.calculator.noofappt = 1;
			}
			if(num < 1) {
				vm.models.calculator.noofappt = 1;	
			} else if(num > 90) {
				vm.models.calculator.noofappt = 90;
			}
		}
	}
});