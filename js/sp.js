
angular.module('myApp.controllers')
.controller('SpCtrl', function ($scope, $http, $cookies,ngDialog,spApi, $timeout, $window, $location, $rootScope) {

    var appointmentStateMap = {
    	"0" : "Created",
    	"1" : "Assigned",
    	"2" : "Confirmed",
    	"3" : "Cancelled",
    	"4" : "Declined",
    	"5" : "Completed",
    	"6" : "Rescheduled",
        "7" : "Waiting Approval",
        "8" : "Prepaid"
    };
    
    $scope.lastApptTime = "";
    $scope.largeImage = "";
    $scope.spApts = {time : 'today'};
    $scope.currentOpenView = "LISTING";
    $scope.serviceIdInst;
    $scope.spInfo = false;
    var availableDate = [];
    $scope.locationArr = [];
    $scope.arrayPolicy = [];
    $scope.customerLocality = '';
    $scope.custProb = "";
    $scope.custResAddr = "";
    $scope.custPincode = "";
    $scope.custEmail = "";
    $scope.custPhone = "";
    $scope.custName = "";
    $scope.custCityId = "";
    $scope.custGender = "";
    $scope.zoneId = "";
    $scope.frm = {submit: ""};
    $scope.showDatepicker = false;
    $scope.showAddressComments = false;
    $scope.spNewAppointment = {};
    $scope.spNewAppointment.check = false;
    $scope.spNewAppointmentForm = {};
    $scope.obj = {custid: "", dt: new Date()};
    $scope.spNewAppointment.aptstarttime = "";
    $scope.spNewAppointment.selectedTimeSlots = [];
    $scope.paymentModes = ["Cash", "Wallet"];
    $scope.serviceLocation = "";
    $scope.paymentModesSp = ["Wallet"];
    $scope.apptPayment = {};
    $scope.apptPackage = {};
    $scope.apptPackage.packageForm = "";
    $scope.aptPackage = {
        package_id : "",
        package_code : "",
        no_of_sessions : "",
        free_cancellation_ratio : "",
        free_cancellation_days : "",
        valid_days : "",
        min_sessions : "",
        max_sessions : "",
        net_amount : "",
        temp_net_amount : "",
        additional_amount : 0,
        iaccept : true,
        isretrofit : false,
    };
    $scope.walletFlag = false;
    $scope.test = "";
    $scope.apptPackageError = "";
    $scope.custTotalAppt = 0;
    $scope.custPackageTotalAppt = 0;
    $scope.apptPayment.paymentForm = "";
    $scope.reasonForPkgCancel = "";
    $scope.aptPayment = {
        currency : "INR",
        type : "Wallet",
        sptype : "Cash",
        amnt : "",
        additionalSpAmnt : "",
        paymentModes: [],
        appointmentid : "",
        promocodeid: "",
        promocode: "",
        discount: "",
        finalcost: "",
        additionalSpAmntDesc:"",
    };
    $scope.calculatedAptAmount = "";
    $scope.aptSlotCount = 0;
    $scope.aptSlotFlag = false;
    $scope.custOldPackage = {
        package_id : "",
        package_code : "",
        no_of_sessions : "",
        is_package_assign : "",
    };

    $scope.custLeftPackageSeesion = 0;
    $scope.apptPaymentErrorMsg = "";
    $scope.costPaid = "0";
    $scope.paymentType = "";
    $scope.disablePayment = false;
    $scope.disablePackage = false;
    var cache = {};
    $scope.show = {"documentRO" : true};
    $scope.zoomingScale = 1;
    $scope.rootApptId;
    $scope.reason;
    $scope.flags = {
        showRescheduleAppt : false
    };

    $scope.arrayCustomerWithWallet = [];
    $scope.arrayWalletHistory = [];
    $scope.walletTransactionDetails = false;
    $scope.asOfBalance = 0;

    $scope.packageLabel = "Select Package";
    $scope.models = {
        calculator: {
            min_sessions: 1,
            max_sessions: 1,
            package: $scope.packageLabel
        },
        packagecodes: [],
        service: {
            id: "",
            name: ""
        },
        response: {
            netTotalCharges: 0
        }
    };
    $scope.showResponse = false;
    $scope.spIdForWallet = "";

    $scope.RequestedBy = ['Physio','Customer','Patient Transfer','Appointment Swap'];
    

    $scope.initSpAppointments = function(timeSpan) {
        $scope.fetchSpAppointments(timeSpan);
    }

    $scope.initCache = function() {
        spApi.getCities("India")
            .success(function(data, status, headers, config){
                cache.cityToIdMap = buildCitiesToIdMap(data.payload);
                angular.forEach(buildCitiesToIdMap(data.payload),function(item,key){
                    console.log(key+'City Ids:'+item);
                });
                
            })

            .error(function(data, status, headers, config){
                $scope.aptErrorMsg = "Failed to fetch services as part of init.";
                $scope.checkSessionTimeout(data);
            })
    }

    $scope.sort = function(keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

    $scope.initSpInfo = function() {
        if(($cookies.get('u_email') != undefined)) {
            $scope.spEmail = $cookies.get('u_email');
        } else {
            console.log("SP email is undefined!");
        }

        if(($cookies.get('u_name') != undefined)) {
            $scope.spName = $cookies.get('u_name');
        } else {
            console.log("SP name is undefined!");
        }

        if(($cookies.get('u_sid') != undefined)) {
            $scope.spId = $cookies.get('u_sid');
        } else {
            console.log("SP id is undefined!");
        }

    }

    $scope.fetchSpAppointments = function(timeSpan) {
        $scope.spApts.time = timeSpan;
        var searchCriteria = {
            "timespan" : timeSpan
        };
        if(timeSpan == "today" || timeSpan == "upcoming") {
            searchCriteria.state = "Scheduled";
        }
        spApi.searchAppointments(searchCriteria)
        .success(function(data, status, headers, config) {
            var appList = [];
            if(data.payload.length == 0) {
                $scope.spAptNotAvailable = true;
            }
            else {
                $scope.spAptNotAvailable = false;
                angular.forEach(data.payload, function(apt) {
                    appList.push(
                        {
                            "city": apt.appointment.city,
                            "refNo": apt.appointment.refno,
                            "id": apt.appointment._id,
                            "scheduledon": apt.appointment.starttime,
                            "sdate" : moment(new Date(apt.appointment.starttime * 1000)).format("YYYY-MM-DD hh:mm A"),
                            "custid": apt.appointment.custid,
                            "customername": apt.customer.name,
                            "customercontact": apt.customer.phone,
                            "status": appointmentStateMap[apt.appointment.state],
                            "servicelocation": apt.appointment.clinic_name
                        }
                    );
                });
            }
            $scope.spAppointmentList = appList;

            //console.log($scope.spAppointmentList);

            if($scope.spApts.time == "past") {
                $scope.spSearch = "";
            }
            else {
                $scope.spSearch = "";
            }
        })
        .error(function(data, status, headers, config) {
            $scope.clscolor = "red";
            $scope.custRecordEnqMsg1 = "error response: " + data.error.message;
            $scope.checkSessionTimeout(data);
        });

        spApi.getPackage(true, false).
        success(function (data, status, headers, config) {
            $scope.models.packagecodes = [];
            var tempArr = data.payload;
            
            console.log("successfully received package codes");
            //console.log(data);
            
            angular.copy(tempArr, $scope.models.packagecodes);
            $scope.models.packagecodes.forEach(function(item) {
                //if($scope.adminNewAppointmentCust.customer.cityid==item.cityId){
                    
                    item.validFromReadonly = item.validfrom*1000;
                    item.validTillReadonly = item.validtill*1000;
                    item.validfrom = moment(new Date(item.validfrom*1000).toString());
                    item.validtill = moment(new Date(item.validtill*1000).toString());
                    item.disctype = item.disctype.toString();
                    item.isNewPromo = false;
                    item.noofappt = item.noofappt;
                    item.is_promocode = item.is_promocode;
                    item.max_sessions = item.max_sessions;
                    item.min_sessions = item.min_sessions;
                    item._id = item._id;
                //}
                
            });
        }).
        error(function (data, status, headers, config) {
            console.log("Error in receiving promo codes");
        });

        spApi.getServices().
        success(function (data, status, headers, config) {
            if(data && data.payload && data.payload.length != 0 && data.payload[0].services && data.payload[0].services.length != 0) {
                $scope.models.service.id = data.payload[0].services[0].id;
                $scope.models.service.name = data.payload[0].services[0].servicename;
            }
        }).
        error(function (data, status, headers, config) {
            console.log("Error in receiving service");
        });
    }

    $scope.showAppointment = function(appointment, fromView) {
        $scope.custTotalAppt = 0;
        $scope.custPackageTotalAppt = 0;
        $scope.aptPackage.package_code = "";
        $scope.aptPackage.no_of_sessions = "";
        $scope.applypromocost= '';
        $scope.lastApptTime = "";
        $scope.apptClinicId = '';

        
        spApi.getCustomerDetails(appointment.custid).success(function(data, status, headers, config){
            $scope.custOldPackage = {
                package_id : data.payload.customer.package_id,
                package_code : data.payload.customer.package_code,
                no_of_sessions : data.payload.customer.no_of_sessions,
                is_package_assign : data.payload.customer.is_package_assign,
            };
            $scope.custReadList = data.payload.customer;
            $scope.customerId = data.payload.customer.healyoscustid;
            $scope.obj.custid = data.payload.customer._id;
            if($scope.custReadList.age == 0 && $scope.custReadList.birthdate == undefined){
                $scope.custReadList.age = "-";
                $scope.custReadList.birthdate = "-";
            }
            $scope.getLocalityFromPincode($scope.custReadList.pincode);
            var appointmentHistory = [];
            if(typeof data.payload.appointments[0] != 'undefined'){
                for(var i = 0; i < data.payload.appointments.length; i++) {
                    $scope.custTotalAppt++;
                    data.payload.appointments[i].appointment.state = appointmentStateMap[data.payload.appointments[i].appointment.state];
                    if(data.payload.appointments[i].appointment.amnt == 0){
                        data.payload.appointments[i].appointment.amnt = "NA";
                    }
                    if(data.payload.appointments[i].appointment.rating == 0){
                        $scope.ratingFlag = false;
                    }else{
                        $scope.ratingFlag = true;
                    }
                    if(data.payload.appointments[i].appointment.state == "Completed" && data.payload.appointments[i].appointment.package_id == data.payload.customer.package_id && data.payload.appointments[i].appointment.package_code == data.payload.customer.package_code && data.payload.appointments[i].appointment.current_session_no != "0"){
                        $scope.custPackageTotalAppt = data.payload.appointments[i].appointment.current_session_no;
                    }
                    appointmentHistory.push(data.payload.appointments[i].appointment);
                    
                    if(i!=0){
                        if(data.payload.appointments[i].appointment.state == "Confirmed" && parseInt(data.payload.appointments[i].appointment.starttime) > parseInt($scope.lastApptTime)){
                            $scope.lastApptTime = data.payload.appointments[i].appointment.starttime;
                        }
                    }else{
                        $scope.lastApptTime = data.payload.appointments[i].appointment.starttime;
                    }
                }
            } else {
                console.log("error");
            }
            $scope.custAptHistory = appointmentHistory;

            var curr_session;
            if(data.payload.customer.use_sessions){
                curr_session = parseInt(data.payload.customer.use_sessions);
            }else{
                curr_session = 0;
            }
            if(curr_session >= data.payload.customer.no_of_sessions){
                $scope.custLeftPackageSeesion = 0
            }else{
                $scope.custLeftPackageSeesion = data.payload.customer.no_of_sessions - curr_session;
            }

        })
        .error(function(data, status, headers, config){
            $scope.aptErrorMsg = data.error.message;
            $scope.checkSessionTimeout(data);
        });

        $scope.disablePayment = false;
        $scope.disablePackage = false;
        $scope.costPaid = "0";
        $scope.spCharges = "0";

        $scope.editAptId = appointment.refNo == undefined ? appointment.refno : appointment.refNo;
        slideUp('#aptDocumentation');
        var id = appointment.id == undefined ? appointment._id : appointment.id;

        if(id == undefined){
            var id = appointment.apptid;
        }

        spApi.getAppointmentDetails(id)
        .success(function(data, status, headers, config){
            if(fromView == "customer") {
                $scope.currentOpenView = "CUSTOMER_APPOINTMENT";
                hidePaymentDialog();
                hidePackageDialog();
            }
            else {
                $scope.currentOpenView = "APPOINTMENT";
                hidePaymentDialog();
                hidePackageDialog();
            }
            $scope.adminNewAppointmentCust = data.payload;
            //console.log($scope.adminNewAppointmentCust.appointment.starttime);


            $scope.adminNewAppointmentCust.appointment.state = appointmentStateMap[$scope.adminNewAppointmentCust.appointment.state];
            //populate pincode string from pincode id
            $scope.adminNewAppointmentCust.appointment.pincodestr = cache.pincodeIdToPincodeNameMap[$scope.adminNewAppointmentCust.appointment.pincode];
            
            if ($scope.adminNewAppointmentCust.appointment.additionalspcharge != undefined && $scope.adminNewAppointmentCust.appointment.additionalspcharge != "") {
                $scope.spCharges = $scope.adminNewAppointmentCust.appointment.additionalspcharge;
            }
            if($scope.adminNewAppointmentCust.appointment.promocode == undefined || $scope.adminNewAppointmentCust.appointment.promocode == ''){
                $scope.adminNewAppointmentCust.appointment.promocode = '';
            }
            if($scope.adminNewAppointmentCust.appointment.package_code == undefined || $scope.adminNewAppointmentCust.appointment.package_code == ''){
                $scope.adminNewAppointmentCust.appointment.package_code = '';
            }

           //api to fetch clinic data of given city:kalyani patil.
           $scope.clinicArrData = [];
           $scope.clinicBasePriceVal = 0;
           if($scope.adminNewAppointmentCust.appointment.cityid){

                var cityid = $scope.adminNewAppointmentCust.appointment.cityid;
                spApi.getClinics(cityid)
                 .success(function(data, status, headers, config) {
                    $scope.clinicArrData = data.payload;

                    //assign servicelocation name by using its Id. 
                    if($scope.adminNewAppointmentCust.appointment.clinic_id){
                        $scope.serviceLocationId = $scope.adminNewAppointmentCust.appointment.clinic_id;
                        $scope.apptClinicId = $scope.adminNewAppointmentCust.appointment.clinic_id;


                        for(var i = 0;i < $scope.clinicArrData.length; i++){
                            if($scope.clinicArrData[i]._id == $scope.serviceLocationId){
                                $scope.serviceLocation = $scope.clinicArrData[i].clinic_name;
                                $scope.serviceLocationLabel = $scope.clinicArrData[i].clinic_name;
                                $scope.clinicBasePriceVal = $scope.clinicArrData[i].clinic_base_price;
                            }
                        }

                    }else{
                        $scope.serviceLocationLabel = 'At Home';
                    }

                
                })
                .error(function(data, status, headers, config) {
                    $scope.checkSessionTimeout(data);
                });
            }else{

                $scope.serviceLocationLabel = 'At Home';
            }
            /*if ($scope.adminNewAppointmentCust.payment != undefined && $scope.adminNewAppointmentCust.payment != "") {
                if ($scope.adminNewAppointmentCust.payment.amnt != undefined && $scope.adminNewAppointmentCust.payment.amnt != "") {
                    $scope.costPaid = $scope.adminNewAppointmentCust.payment.amnt;
                    $scope.paymentType = $scope.adminNewAppointmentCust.payment.type;
                } else {
                    $scope.costPaid = 0;
                }
            } else {
                $scope.costPaid = 0;
            }*/


            if($scope.adminNewAppointmentCust.appointment.finalcost > 0){
                $scope.costPaid = $scope.adminNewAppointmentCust.appointment.finalcost;
                if($scope.adminNewAppointmentCust.appointment.additionalcharge > 0 && $scope.adminNewAppointmentCust.appointment.additionalcharge != undefined){
                    $scope.costPaid = $scope.costPaid + $scope.adminNewAppointmentCust.appointment.additionalcharge;
                }
                if($scope.adminNewAppointmentCust.appointment.additionalchargesp > 0 && $scope.adminNewAppointmentCust.appointment.additionalchargesp != undefined){
                    $scope.costPaid = $scope.costPaid + $scope.adminNewAppointmentCust.appointment.additionalchargesp;
                }
            }

            if($scope.adminNewAppointmentCust.appointment.finalcost > 0 && $scope.adminNewAppointmentCust.appointment.additionalcharge > 0){
                var total;
                total = $scope.adminNewAppointmentCust.appointment.finalcost + $scope.adminNewAppointmentCust.appointment.additionalcharge;
                $scope.calculatedAptAmount = $scope.adminNewAppointmentCust.appointment.finalcost +" + "+ $scope.adminNewAppointmentCust.appointment.additionalcharge +" = "+ total;
                //alert($scope.calculatedAptAmount);
            }else{
                $scope.calculatedAptAmount =  $scope.adminNewAppointmentCust.appointment.finalcost;
                //alert($scope.calculatedAptAmount);
            }

            $scope.aptPayment.appointmentid = id;

            if($cookies.get('u_id') == $scope.adminNewAppointmentCust.sp._id) {
                $scope.disablePayment = false;
                $scope.disablePackage = false;
            } else {
                $scope.disablePayment = true;
                $scope.disablePackage = true;
            }

            // If root appointment documentation exists
            $scope.adminNewAppointmentCust.isEnabledRootApptDocumentation = false;
            if($scope.adminNewAppointmentCust.hasOwnProperty("rootApptDocumentation") && $scope.adminNewAppointmentCust.rootApptDocumentation != undefined) {
                $scope.adminNewAppointmentCust.rootApptDocumentRO = angular.copy($scope.adminNewAppointmentCust.rootApptDocumentation);

                if($scope.adminNewAppointmentCust.rootApptDocumentRO.hasOwnProperty("assessment") || $scope.adminNewAppointmentCust.rootApptDocumentRO.hasOwnProperty("goalsettings")
                || $scope.adminNewAppointmentCust.rootApptDocumentRO.hasOwnProperty("history") || $scope.adminNewAppointmentCust.rootApptDocumentRO.hasOwnProperty("outcomemeasures")
                || $scope.adminNewAppointmentCust.rootApptDocumentRO.hasOwnProperty("painevaluation") || $scope.adminNewAppointmentCust.rootApptDocumentRO.hasOwnProperty("treatment")
                || $scope.adminNewAppointmentCust.rootApptDocumentRO.hasOwnProperty("type")) {
                    $scope.adminNewAppointmentCust.isEnabledRootApptDocumentation = true;
                }
            }

            $scope.adminNewAppointmentCust.hasDocument = false;
            if($scope.adminNewAppointmentCust.appointment.hasOwnProperty("document")) {
                $scope.adminNewAppointmentCust.documentRO = angular.copy($scope.adminNewAppointmentCust.appointment.document);
                $scope.adminNewAppointmentCust.hasDocument = true;
            }


            $scope.hideRescheduleOption($scope.adminNewAppointmentCust.appointment.starttime);
            $scope.setCancelledBy($scope.adminNewAppointmentCust.appointment.starttime);

        })
        .error(function(data, status, headers, config){
            $scope.aptErrorMsg = data.error.message;
            $scope.checkSessionTimeout(data);
        });
        
        $scope.manageRootApptDocumentationCollapse();
        $scope.manageDocumentationCollapse();
        $scope.spInfo = false;
        $scope.flags.showRescheduleAppt = false;

    }

    $scope.getServicesAndProducts = function(patientid){
        //alert('Hi');
        $scope.walletTopUp = false;
        spApi.getServiceAndProducts()
        .success(function(data, status, headers, config) {
            $scope.products = [];
            $scope.services = [];
            $scope.productServiceList = [];
            $scope.productServiceTotal = 0;
            $scope.models.response.netTotalCharges = 0;
            $scope.ServicesAndProducts = data.payload;


            spApi.getAllSps().
             success(function (data, status, headers, config) {
                    $scope.spCity = '';
                    $scope.spId = $cookies.get('u_id');
                    $scope.arrayAllSps = angular.copy(data.payload.spList);
                    for(var i = 0 ; i < $scope.arrayAllSps.length ; i++) {
                        if($scope.spId == $scope.arrayAllSps[i]._id){
                            $scope.spCity = $scope.arrayAllSps[i].city;
                        }
                    }

                   // alert($scope.spCity);

                    $scope.ServicesAndProducts.forEach(function(item) {
                        if(item.category == 'Product' && item.city == $scope.spCity){
                            $scope.products.push(item); 
                        }else if(item.category == 'Service' && item.city == $scope.spCity){
                            $scope.services.push(item);
                        }
                    });
             })
             .error(function(data, status, headers, config) {
                console.log('Failed to fetch SP data!');
            });
     
        })
        .error(function(data, status, headers, config) {
            console.log('Failed to fetch services and products!');
        });


        spApi.getServiceProductTrans(patientid)
        .success(function(data, status, headers, config) {
          
           $scope.productServiceAllTrans = data.payload;
           $scope.productServiceTrans = [];
           $scope.productServiceName = [];
           $scope.productServiceAllTrans.forEach(function(item) {
            if(item.is_used == false){
                $scope.productServiceTrans.push(item);
                $scope.productServiceName.push(item.name);
            }

           });

           var  nameQty = [];
           $scope.productServiceName.forEach(function(i) { 
            nameQty[i] = (nameQty[i]||0) + 1;
            
           });     
           $scope.productServicesWithQty = [];        
           $scope.productServiceAllTrans.forEach(function(item1) {
              if( item1.is_used == false){
                item1.qty = nameQty[item1.name];

                item1.totprice = item1.price * item1.qty;
                $scope.productServicesWithQty.push(item1);
                }
           });

            $scope.uniqueProductsAndServices = [];
            var flag = false;             
            $scope.productServicesWithQty.forEach(function(rec){
               
                if($scope.uniqueProductsAndServices.length === 0){
                    $scope.uniqueProductsAndServices.push(rec);                              
                }else{ 
                    flag = false;  
                    $scope.uniqueProductsAndServices.forEach(function(i){ 
                       if( i.hasOwnProperty('name') && i['name'] === rec.name ){
                            flag = true;
                        }
                    });
                    if(flag == false){
                        $scope.uniqueProductsAndServices.push(rec);
                    }
                }

           });

           //console.log($scope.uniqueProductsAndServices);
 
        })
        .error(function(data, status, headers, config) {
            console.log('Failed to fetch services and products transactions!');
        });


    }

    $scope.AddService = function(service,qty){
        var flag = false;
        if(qty == undefined || qty == NaN){
            service.qty = 1;
             service.totprice = service.price;
        }else{
            service.qty = qty; 
            service.totprice = qty*service.price;   
        }

       // alert($scope.aptPackage.net_amount);

        if($scope.productServiceList.length > 0){
            $scope.productServiceList.forEach(function(item) {
                if(item.name == service.name){
                   flag = true;
                }
            });

            if(flag == true){
                alert('Service already added!');
            }else{
                $scope.productServiceList.push(service);
            }
        }else{
            $scope.productServiceList.push(service);
        }


        $scope.productServiceTotal = $scope.productServiceTotal + service.totprice;
        if($scope.models.response.netTotalCharges > 0){
            $scope.models.response.netTotalCharges = $scope.models.response.netTotalCharges + service.totprice;
        }

        //console.log($scope.productServiceList);
    }

    $scope.AddProduct = function(product ,qty){

        if(qty == undefined || qty == NaN){
            product.qty = 1;
            product.totprice = product.price;
        }else{
             product.qty = qty;
             product.totprice = product.qty*product.price;
        }

        var flag = false;
        if( $scope.productServiceList.length > 0){
            $scope.productServiceList.forEach(function(item) {
                if(item.name == product.name){
                   flag = true;
                }
            });

            if(flag == true){
                alert('Product already added!');
            }else{
                $scope.productServiceList.push(product);
            }
        }else{
            $scope.productServiceList.push(product);
        }

        $scope.productServiceTotal = $scope.productServiceTotal + product.totprice;
        if($scope.models.response.netTotalCharges > 0){
            $scope.models.response.netTotalCharges = $scope.models.response.netTotalCharges + product.totprice;
        }

        //console.log($scope.productServiceList);
    }

    $scope.removeItem = function(item){
        var index = -1;
        for(var i = 0; i < $scope.productServiceList.length; i++) {
           if($scope.productServiceList[i].name === item.name) {
             index = i;
           }
        }

        $scope.productServiceList.splice(index,1);
        $scope.productServiceTotal = $scope.productServiceTotal - item.totprice;
        
        if($scope.models.response.netTotalCharges > 0){
             $scope.models.response.netTotalCharges = $scope.models.response.netTotalCharges - item.totprice;
        }
       
    }

    $scope.hideRescheduleOption = function(appt_starttime) {

        $scope.showRescheduleOption = true;

        var curdate = new Date();
        var myEpochtotime = Math.round(curdate.getTime()/1000);
       // console.log('appt date:'+ appt_starttime);
       // console.log('myEpochtotime:'+ myEpochtotime);

        var hourDiff = parseInt(appt_starttime) - parseInt(myEpochtotime); //in ms
        //var hourDiff1 = parseInt(myEpochtotime) - parseInt(appt_starttime);
        //var secDiff = hourDiff / 1000; //in s
        var minDiff = hourDiff / 60; //in minutes
        var hDiff = (hourDiff / 3600); //in hours
        var hours = Math.floor(hDiff);
        var minutes = Math.floor(minDiff);

        //check appointment within 22 hr i.e. 1320 minutes
        if(minutes <= 1320){
            $scope.showRescheduleOption = false;
        }

    }

    //for past confirmed appointments,cancellation request should go with 'physio' option only. Kalyani patil  
    $scope.setCancelledBy = function(appt_starttime) {
        
        $scope.RequestedBy = ['Physio','Customer','Patient Transfer','Appointment Swap'];
        var curdate = new Date();
        var myEpochtotime = Math.round(curdate.getTime()/1000);
        //console.log(myEpochtotime);
        var date = moment(new Date(appt_starttime * 1000)).format("YYYY-MM-DD 11:59") + " PM";
        var starttime = Date.parse(date);

        //console.log(starttime/1000);
        var datelimit = starttime/1000;

        if(myEpochtotime > datelimit){
            $scope.RequestedBy = ['Physio']; 
        }
    }

    $scope.manageRootApptDocumentationCollapse = function() {
        $('.historyRO1').hide();
        $('.painEvalRO1').hide();
        $('.assessmentRO1').hide();
        $('.omRO1').hide();
        $('.goalRO1').hide();
        $('.treatmentRO1').hide();
    }

    $scope.manageDocumentationCollapse = function() {
        $('.historyRO').hide();
        $('.painEvalRO').hide();
        $('.assessmentRO').hide();
        $('.omRO').hide();
        $('.goalRO').hide();
        $('.treatmentRO').hide();
    }

    $scope.showCustomer = function(appointment) {

        $scope.aptSlotCount = 0;
        $scope.aptSlotFlag = false;
        $scope.custPackageTotalAppt = 0;
        $scope.apptClinicId = '';
        $scope.apptCityId = '';
        $scope.clinicBasePriceVal = 0;
        $scope.clinicArray = [];
        $scope.patientidForPkgCancel = '';
        $scope.packageValidTillDate = '';


        spApi.getCustomerDetails(appointment.custid)
        .success(function(data, status, headers, config){
            //console.log(data);
            $scope.custOldPackage = {
                package_id : data.payload.customer.package_id,
                package_code : data.payload.customer.package_code,
                no_of_sessions : data.payload.customer.no_of_sessions,
                is_package_assign : data.payload.customer.is_package_assign,
            };
            $scope.currentOpenView = "CUSTOMER";
            $scope.patientidForPkgCancel = data.payload.customer._id;
            $scope.custReadList = data.payload.customer;
            $scope.customerId = data.payload.customer.healyoscustid;
            $scope.obj.custid = data.payload.customer._id;

            $scope.getServicesAndProducts($scope.obj.custid);

            if($scope.custReadList.age == 0 && $scope.custReadList.birthdate == undefined){
                $scope.custReadList.age = "-";
                $scope.custReadList.birthdate = "-";
            }
            $scope.custReadList.custwallet.description='';
            $scope.getLocalityFromPincode($scope.custReadList.pincode);
            var appointmentHistory = [];
            if(typeof data.payload.appointments[0] != 'undefined'){
                for(var i = 0; i < data.payload.appointments.length; i++) {
                    data.payload.appointments[i].appointment.state = appointmentStateMap[data.payload.appointments[i].appointment.state];
                    if(data.payload.appointments[i].appointment.amnt == 0){
                        data.payload.appointments[i].appointment.amnt = "NA";
                    }
                    if(data.payload.appointments[i].appointment.rating == 0){
                        $scope.ratingFlag = false;
                    }else{
                        $scope.ratingFlag = true;
                    }
                    if(data.payload.appointments[i].appointment.package_id == data.payload.customer.package_id && data.payload.appointments[i].appointment.package_code == data.payload.customer.package_code && data.payload.appointments[i].appointment.current_session_no != "0"){
                        $scope.custPackageTotalAppt = data.payload.appointments[i].appointment.current_session_no;
                    }
                    appointmentHistory.push(data.payload.appointments[i].appointment);

                   /* if(data.payload.appointments[i].appointment.clinic_id != undefined){
                        $scope.apptClinicId = data.payload.appointments[i].appointment.clinic_id;
                    }*/

                    if(data.payload.appointments[i].appointment.cityid != undefined){
                        $scope.apptCityId = data.payload.appointments[i].appointment.cityid;
                    }
                }

                //api to fetch clinic data of given city:kalyani patil.
               if($scope.apptCityId != undefined){

                    var cityid = $scope.apptCityId;
                    spApi.getClinics(cityid)
                     .success(function(data, status, headers, config) {
                        $scope.clinicArray = data.payload;

                        //assign clinic base price by using its Id. 
                        if($scope.apptClinicId != undefined || $scope.apptClinicId != ''){
                          
                            for(var i = 0;i < $scope.clinicArray.length; i++){
                                if($scope.clinicArray[i]._id == $scope.apptClinicId){
                                    $scope.clinicBasePriceVal = $scope.clinicArray[i].clinic_base_price;
                                }
                            }
                        }
                    
                    })
                    .error(function(data, status, headers, config) {
                        $scope.checkSessionTimeout(data);
                    });
                }   


            } else {
                console.log("error");
            }
            $scope.custAptHistory = appointmentHistory;

            //alert($scope.apptClinicId);

            var curr_session;
            if(data.payload.customer.use_sessions){
                curr_session = parseFloat(data.payload.customer.use_sessions);
            }else{
                curr_session = 0;
            }
            
            if(curr_session >= data.payload.customer.no_of_sessions){
                $scope.custLeftPackageSeesion = 0
            }else{
                if(data.payload.customer.no_of_sessions > 0)
                    $scope.custLeftPackageSeesion = data.payload.customer.no_of_sessions - curr_session;
                else
                    $scope.custLeftPackageSeesion = 0
            }

            if(data.payload.customer.package_created_on && data.payload.customer.approved_valid_days){
                var packageCreatedOn = data.payload.customer.package_created_on;
                var approvedValidDays = data.payload.customer.approved_valid_days;

                var packageCreatedOnDate = moment(new Date(packageCreatedOn * 1000)).format("YYYY-MM-DD hh:mm A");                

                //var result = new Date(packageCreatedOn);
                //var date = result.setDate(result.getDate() + parseInt(5));
                var myDate = new Date(new Date(packageCreatedOnDate).getTime()+(parseInt(approvedValidDays)*24*60*60*1000));
                var validTill = moment(myDate).format("YYYY-MM-DD");

                $scope.packageValidTillDate = validTill; 
                
            }


        })
        .error(function(data, status, headers, config){
            $scope.aptErrorMsg = data.error.message;
            $scope.checkSessionTimeout(data);
        });
    }

    function callGetSpMonthlyAppointmentAvailability() {
        $scope.getSpMonthlyAppointmentAvailability();
    }

    $scope.setupCalendar = function() {
        $timeout(function() {
            $("#datetimepicker3").find("[id^='datepicker'].btn-default").attr("disabled", true);
            $("#datetimepicker3").find("[id^='datepicker'].btn-default").css({"color": "#333"});
            $(".btn.btn-default.btn-sm.pull-left").on( "click", function() {
                $timeout(callGetSpMonthlyAppointmentAvailability, 100);
            });
            $(".btn.btn-default.btn-sm.pull-right").on( "click", function() {
                callGetSpMonthlyAppointmentAvailability();
            });
        }, 1500);        
    }

    $scope.spNewApptForCust = function () {

        $scope.rootApptId = "";
        $scope.obj.custid = "";
        $("#datetimepicker3").find("[id^='datepicker'].btn-default").attr("disabled", true);
        $("#datetimepicker3").find("[id^='datepicker'].btn-default").css({"color": "#333"});
        $(".btn.btn-default.btn-sm.pull-left").on( "click", function() {
            $scope.spInfo = false;
            $timeout(callGetSpMonthlyAppointmentAvailability, 100);
        });
        $(".btn.btn-default.btn-sm.pull-right").on( "click", function() {
            $scope.spInfo = false;
            callGetSpMonthlyAppointmentAvailability();
        });
        $scope.boolFlag = true;
        $scope.clear();

        var sidInst = $cookies.get('u_sid');
        var apiKeyInst = $cookies.get('u_apikey');
        var roleInst = $cookies.get('u_type');
        var serviceId = "";
        var index = $scope.custAptHistory.length - 1;

        if (($scope.custAptHistory[index].apptRootId != "") && ($scope.custAptHistory[index].apptRootId != undefined) && ($scope.custAptHistory[index].apptRootId != null) && ($scope.custAptHistory[index].apptRootId.length > 0)) {
            $scope.rootApptId = $scope.custAptHistory[index].apptRootId;
        } else {
            $scope.rootApptId = $scope.custAptHistory[index]._id;
        }

        var url = "/healyos-pdt/hrest/v1/appt/" + $scope.custAptHistory[index]._id + "?apikey=" + apiKeyInst + "&sid=" + sidInst + "&role=" + roleInst;
        var result = $http.get(url);

        result.success(function(data, status, headers, config) {
            if(data.error == undefined) {
                var jsonStringObj = JSON.stringify(data);
                var spNewApptForCustObj = JSON.parse(jsonStringObj);

                //console.log(spNewApptForCustObj);
    
                $scope.obj.custid = $scope.custAptHistory[index].custid;
                $scope.spNewAppointment.aptstarttime = "";
                $scope.spInfo = false;
                $scope.frm.submit = false;
                $scope.currentOpenView = 'NEW_APPOINTMENT';
                $scope.showDatepicker = true;
                $scope.showAddressComments = true;
                $scope.spNewAppointment.appointmentAddress = data.payload.appointment.address;
                $scope.spNewAppointment.comment = data.payload.appointment.comments;
                $scope.spNewAppointment.selectedTimeSlots = [];
                $scope.serviceIdInst = data.payload.appointment.serviceid;
                $scope.custProb = data.payload.customer.problem;
                $scope.custResAddr = data.payload.customer.address;
                $scope.custPincode = data.payload.appointment.pincode; // to get updated pincode from appoinment object
                $scope.custEmail = data.payload.customer.email;
                $scope.custPhone = data.payload.customer.phone;
                $scope.custName = data.payload.customer.name;
                $scope.custCityId = $scope.custReadList.cityid;
                $scope.custGender = data.payload.customer.gender;
                $scope.zoneId = data.payload.appointment.zoneid;
                $scope.locality = data.payload.appointment.locality;
                $scope.original_costFollowUp = data.payload.appointment.cost;
                $scope.costFollowUp = data.payload.appointment.cost;
                $scope.currFollowUp = data.payload.appointment.currency;
                $scope.baseCost = data.payload.appointment.cost;

                $scope.custReadList.pincode = $scope.custPincode; // new code
                $scope.custReadList.zoneid = $scope.zoneId; // new code
                $scope.serviceIdInst = $scope.serviceIdInst; // new code
                $scope.getSpMonthlyAppointmentAvailability();
             
                $scope.spNewApptForCustErrorMsg = "";
                $scope.resetPromoCodeFollowUp();
                if (data.payload.appointment.additionalcharge != null && data.payload.appointment.additionalcharge != undefined){
                $scope.spNewAppointment.addcharges = data.payload.appointment.additionalcharge;
                $scope.spNewAppointment.addchargedesc = data.payload.appointment.additionalchargedesc;
                    }
                else{
                     $scope.spNewAppointment.addcharges = 0;
                     $scope.spNewAppointment.addchargedesc="";
                }

                $scope.package_code = data.payload.customer.package_code;
                $scope.package_id = data.payload.customer.package_id;
                $scope.no_of_sessions = data.payload.customer.no_of_sessions;
                $scope.package_created_on = data.payload.customer.package_created_on;
                $scope.approved_valid_days = data.payload.customer.approved_valid_days;
                $scope.patientid = data.payload.appointment.patientid;
                
                //console.log(data.payload.customer.additional_amount+'~ $scope.no_of_sessions:'+$scope.no_of_sessions+'data.payload.customer.use_sessions:'+data.payload.customer.use_sessions+'data.payload.customer.is_package_assign:'+data.payload.customer.is_package_assign);

                temp_additional_amount = $scope.additional_amount;

                if(($scope.no_of_sessions+'.0' ==data.payload.customer.use_sessions) && data.payload.customer.is_package_assign==false){
                    temp_additional_amount = 0;
                }else{
                    temp_additional_amount = parseFloat(data.payload.customer.additional_amount);
                }

                if(temp_additional_amount){
                    $scope.additional_amount = temp_additional_amount;
                }else{
                    $scope.additional_amount = 0;
                }
                //console.log($scope.additional_amount);
                /*if(data.payload.customer.additional_amount){
                    $scope.additional_amount = parseFloat(data.payload.customer.additional_amount);
                    //$scope.additional_amount = temp_additional_amount;
                }else{
                    $scope.additional_amount = 0;
                }*/
                   
                if(data.payload.customer.is_package_assign){
                    $scope.is_package_assign = data.payload.customer.is_package_assign;
                }else{
                    $scope.is_package_assign = false;
                }  

                if(data.payload.customer.use_sessions){
                    $scope.use_sessions = parseFloat(data.payload.customer.use_sessions);
                }else{
                    $scope.use_sessions = 0;
                }  

                $scope.discounted_costFollowUp = $scope.costFollowUp;
                //API to fetch discount of given package:kalyani patil
                if( $scope.package_id != null &&  $scope.package_id != undefined && $scope.is_package_assign == true){

                    spApi.getCalculatePackageDiscount($scope.package_code,$scope.package_id, $scope.costFollowUp)
                    .success(function(data, status, headers, config){

                            var jsonStringObj = JSON.stringify(data);
                            var DiscountObj = JSON.parse(jsonStringObj);

                            if(data.payload.discount != null && data.payload.discount != undefined){
                                $scope.discount =  data.payload.discount;
                            }

                            if($scope.discount > 0 && $scope.discount != null){
                                 $scope.costFollowUp =  $scope.costFollowUp - $scope.discount;
                                 $scope.discounted_costFollowUp = $scope.costFollowUp;
                             }

                     })
                    .error(function(data, status, headers, config) {
                            console.log("error msg" + data);
                            $scope.calculateDiscount = data;
                            $scope.checkSessionTimeout(data);
                    });

                }
        

                $location.hash('mainDiv');
            }
        });

        result.error(function(data, status, headers, config) {
            $scope.rootApptId = "";
            console.log("Error Message: " + data);
            $scope.spNewApptForCustErrorMsg = data.error.message;
            $scope.checkSessionTimeout(data);
        });



    }

    //API to get dates of given month:year have atleast one free slot for appointment.
    $scope.getSpMonthlyAppointmentAvailability = function() {
      
        var pincode;
        var zoneid;
         if($scope.custReadList != undefined ) {
            if ($scope.currentOpenView == 'NEW_APPOINTMENT'){
                pincode = $scope.custReadList.pincode;
                zoneid = $scope.custReadList.zoneid;
            }
            if ($scope.currentOpenView == 'APPOINTMENT' || $scope.currentOpenView == 'CUSTOMER_APPOINTMENT'){
                  pincode =$scope.adminNewAppointmentCust.appointment.pincode;
                  zoneid = $scope.adminNewAppointmentCust.appointment.zone;
            }
        }
        else {
            pincode =$scope.adminNewAppointmentCust.appointment.pincode;
            zoneid = $scope.adminNewAppointmentCust.appointment.zone;
        }
        
      
        //var pincode = $scope.custReadList == undefined ? $scope.adminNewAppointmentCust.appointment.pincode : $scope.custReadList.pincode;
      
       // var zoneid = $scope.custReadList == undefined ? $scope.adminNewAppointmentCust.appointment.zone : $scope.custReadList.zoneid;
        var serviceId = $scope.serviceIdInst == undefined ? $scope.adminNewAppointmentCust.appointment.serviceid : $scope.serviceIdInst;

        var arrDateInst =  $("#datetimepicker3").find("[id^='datepicker'].btn-default").text().split(' '); // November 2015
        var monthObj = "";
        if (arrDateInst[0] == "January") {
            monthObj = "01";
        } else if(arrDateInst[0] == "February") {
            monthObj = "02";
        } else if(arrDateInst[0] == "March") {
            monthObj = "03";
        } else if(arrDateInst[0] == "April") {
            monthObj = "04";
        } else if(arrDateInst[0] == "May") {
            monthObj = "05";
        } else if(arrDateInst[0] == "June") {
            monthObj = "06";
        } else if(arrDateInst[0] == "July") {
            monthObj = "07";
        } else if(arrDateInst[0] == "August") {
            monthObj = "08";
        } else if(arrDateInst[0] == "September") {
            monthObj = "09";
        } else if(arrDateInst[0] == "October") {
            monthObj = "10";
        } else if(arrDateInst[0] == "November") {
            monthObj = "11";
        } else if(arrDateInst[0] == "December") {
            monthObj = "12";
        }

        var yyyymmDate = arrDateInst[1] + monthObj;
        var tDate = new Date();
        var tYear = tDate.getFullYear();
        var tMonth = tDate.getMonth() + 1;

        if((arrDateInst[1] == tYear && parseInt(monthObj) >= tMonth) || (arrDateInst[1] > tYear)) {
            var sidInst = $cookies.get('u_sid');
            var apiKeyInst = $cookies.get('u_apikey');
            var roleInst = $cookies.get('u_type');

            if($scope.apptClinicId == undefined || $scope.apptClinicId == ''){
            
                 var url = "/healyos-pdt/hrest/v1/appt/calmon/" + yyyymmDate + "?apikey=" + apiKeyInst + "&sid=" + sidInst + "&role=" + roleInst + "&pincode=" + pincode + "&zoneid=" + zoneid + "&serviceid=" + serviceId; //b24abc5e-ac43-86d4-5a83-aa1807fde79b";
            }else{
                 var url = "/healyos-pdt/hrest/v1/appt/calmon/" + yyyymmDate + "?apikey=" + apiKeyInst + "&sid=" + sidInst + "&role=" + roleInst + "&serviceid=" + serviceId + "&clinic_id=" + $scope.apptClinicId; 

            }

            var result = $http.get(url);

            // Resetting the appt starttime model to disable time slot selection
            $scope.spNewAppointment.aptstarttime = "";

            result.success(function(data, status, headers, config) {
                if(data.error == undefined) {
                    var jsonStringObj = JSON.stringify(data);
                    var spMonthlyAppointmentAvailabilityObj = JSON.parse(jsonStringObj);
                    var arrDates = [];
                    var tempDates = data.payload.dates;
                    for(i = 0 ; i < tempDates.length ; i++) {
                        var txtDate = tempDates[i] + "";
                        var year = txtDate.substring(0,4);
                        var month = txtDate.substring(4,6);

                        var tempMonth = parseInt(month, 10);
                        tempMonth = tempMonth - 1;

                        month = tempMonth + "";
                        var lenMonth = month.length;
                        if(lenMonth != 2 && lenMonth == 1) {
                          month = "0" + month;
                        }

                        var day = txtDate.substring(6,8);
                        arrDates.push(year + "-" + month + "-" + day);
                    }
                    availableDate = arrDates;

                    if($scope.boolFlag == true) {
                        $scope.obj.dt = new Date();
                        $scope.boolFlag = false;
                    } else {
                        var dayObj = "";
                        var lenDay = 0;
                        var temp = new Date();
                        if(monthObj == (temp.getMonth() + 1) && arrDateInst[1] == temp.getFullYear()) {
                            dayObj = temp.getDate() + "";
                            lenDay = dayObj.length;
                            if(lenDay != 2 && lenDay == 1) {
                              dayObj = "0" + dayObj;
                            }
                        } else {
                            dayObj = "01";
                        }
                        var valMonth = (parseInt(monthObj) - 1);
                        var valDay = parseInt(dayObj);
                        var valYear = arrDateInst[1];
                        $scope.obj.dt = new Date(valYear, valMonth, valDay);
                    }
                    $scope.spNewApptForCustErrorMsg = "";
                }
            });

            result.error(function(data, status, headers, config) {
                console.log("Error Message: " + data);
                $scope.spNewApptForCustErrorMsg = data.error.message;
                $scope.scrollDivById('spNewApptForCustErrorMsg');
                $scope.checkSessionTimeout(data);
            });
        }
    }

    $scope.today = function() {
        $scope.obj.dt = new Date();
    };
    $scope.today();

    $scope.clear = function () {
        $scope.obj.dt = null;
    };

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
        var monthObj = date.getMonth() + "";
        var lenMonth = monthObj.length;
        if(lenMonth != 2 && lenMonth == 1) {
          monthObj = "0" + monthObj;
        }

        var dayObj = date.getDate() + "";
        var lenDay = dayObj.length;
        if(lenDay != 2 && lenDay == 1) {
          dayObj = "0" + dayObj;
        }
        var dateInstance = date.getFullYear() + "-" + monthObj + "-" + dayObj;

        if(availableDate.indexOf(dateInstance) != -1) {
            return false;
        } else {
            return true;
        }
    };

    $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
    };

    $scope.toggleMin();
    $scope.maxDate = "";

    $scope.open = function($event) {
        $scope.status.opened = true;
    };

    $scope.setDate = function(year, month, day) {
        $scope.obj.dt = new Date(year, month, day);
    };

    $scope.status = {
        opened: false
    };

    $scope.callSpInfo = function() {

        if($scope.custReadList != undefined && $scope.serviceIdInst != undefined) {
            if ($scope.currentOpenView == 'NEW_APPOINTMENT'){
                $scope.getSpInfo($scope.custReadList.zoneid, $scope.serviceIdInst, $scope.custReadList.pincode);
            }
            if ($scope.currentOpenView == 'APPOINTMENT' || $scope.currentOpenView == 'CUSTOMER_APPOINTMENT'){
                 $scope.getSpInfo($scope.adminNewAppointmentCust.appointment.zoneid, $scope.adminNewAppointmentCust.appointment.serviceid, $scope.adminNewAppointmentCust.appointment.pincode); 
            }
        }
        else {
            $scope.getSpInfo($scope.adminNewAppointmentCust.appointment.zoneid, $scope.adminNewAppointmentCust.appointment.serviceid, $scope.adminNewAppointmentCust.appointment.pincode); // expected is zoneid
        }
    }
/*
* Fetches free time slots for sp using /zone/avail api
*/
    $scope.getSpInfo = function(zoneid, servid, pin) {


        var serviceDate = "";
        var dateInst = "";
        var intMonth = 0;
        var monthInst = "";
        var lenMonth = 0;
        var dayObj = "";
        var lenDay = 0;
        var yearObj = 0;

        dateInst = $scope.obj.dt;
        intMonth = dateInst.getMonth() + 1;
        monthInst = intMonth + "";
        lenMonth = monthInst.length;
        if(lenMonth != 2 && lenMonth == 1) {
          monthInst = "0" + monthInst;
        }

        dayObj = dateInst.getDate() + "";
        lenDay = dayObj.length;
        if(lenDay != 2 && lenDay == 1) {
          dayObj = "0" + dayObj;
        }

        yearObj = dateInst.getFullYear();
        serviceDate = yearObj + monthInst + dayObj + "";

        spApi.getSpInfo(serviceDate, zoneid, servid, pin,$scope.apptClinicId)
        .success(function(data, status, headers, config) {
            myJsonString = JSON.stringify(data);
            var getSpInfoObj = JSON.parse(myJsonString);
            var aptFromTime = [];
            var aptToTime = [];
            var space = [];
            var aptst = [];

            if (typeof data.payload.appointmentslots[0] != 'undefined'){
                $scope.spInfo = true;
                $scope.wtUndefined = false;

                for(var i = 0; i < data.payload.appointmentslots.length; i++){
                    space.push("-");
                }

                for(var j = 0; j < data.payload.appointmentslots.length; j++){
                    aptst.push(data.payload.appointmentslots[j].st);
                    var mins = data.payload.appointmentslots[j].st;
                    mins = mins.substring(2);
                    var str = data.payload.appointmentslots[j].st;
                    str = str.substring(0, str.length - 2);
                    var hours = str > 12 ? "0"+(str - 12) : str;
                    var am_pm = str >= 12 ? " PM" : " AM";
                    from = hours + ":" + mins  + am_pm;
                    aptFromTime.push(from);

                    var mins1 = data.payload.appointmentslots[j].et;
                    mins1 = mins1.substring(2);
                    var str1 = data.payload.appointmentslots[j].et;
                    str1 = str1.substring(0, str1.length - 2);
                    var hours1 = str1 > 12 ? "0"+(str1 - 12) : str1;
                    var am_pm1 = str1 >= 12 ? " PM" : " AM";
                    to = hours1 + ":" + mins1 + am_pm1;
                    aptToTime.push(to);
                }
                $scope.aptSlotTimeFrom = aptFromTime;
                $scope.aptSlotTimeTo = aptToTime;
                $scope.spaceDash = space;
                $scope.aptStartTime = aptst;

            } else {
                $scope.aptSlotTimeFrom = "";
                $scope.aptSlotTimeTo = "";
                $scope.spaceDash = "";
                $scope.spInfo = false;
                $scope.wtUndefined = true;
                $scope.wtUndefinedErrorMsg = "Appointment slots not available";
                $scope.spNewAppointment.aptstarttime = false;
                $scope.spNewApptForCustErrorMsg = "";
            }
        })
        .error(function(data, status, headers, config) {
            console.log("error msg" + data);
            $scope.spNewApptForCustErrorMsg = data;
            $scope.checkSessionTimeout(data);
        });
    }

    function getAppointmentEpochTimes() {
        var dateInst = $scope.obj.dt;
        var year = dateInst.getFullYear();
        var month = dateInst.getMonth();
        var day = dateInst.getDate();

        //get selected apt start time  - hour and minute
        var aptst = $scope.spNewAppointment.aptstarttime;
        var apth = aptst.substring(0,2);
        var aptm = aptst.substring(2,4);

        //From epoch time
        var fromdate = new Date(year, month, day);
        fromdate.setHours(apth);
        fromdate.setMinutes(aptm);
        var myEpochfromtime = fromdate.getTime()/1000.0;

        //To epoch time
        var todate = new Date(year, month, day);
        todate.setTime(fromdate.getTime() + 90*60*1000);
        var myEpochtotime = todate.getTime()/1000.0;

        return [myEpochfromtime, myEpochtotime];
    }

    $scope.spApptForCustSubmit = function() {
        var google_conversion_id = "";
        var google_conversion_language = "";
        var google_conversion_format = "";
        var google_conversion_color = "";
        var google_conversion_label = "";
        var google_conversion_value = "";
        var google_conversion_currency = "";
        var google_remarketing_only = "";
            
        $scope.aptSlotCount = 0;
        $scope.aptSlotFlag = false;

        var custproblem;
        if($scope.custProb == null || $scope.custProb == 'undefined'){
            custproblem = "";
        } else if (typeof $scope.custProb != 'undefined'){
            custproblem = $scope.custProb;
        }else {
            custproblem = "";
        }

        var resAddress;
        if($scope.custResAddr == null || $scope.custResAddr == 'undefined') {
            resAddress = "";
        } else if (typeof $scope.custResAddr != 'undefined'){
            resAddress = $scope.custResAddr;
        } else {
            resAddress = "";
        }

        var spCommentsForCust;
        if($scope.spNewAppointment.comment == null || $scope.spNewAppointment.comment == 'undefined') {
            spCommentsForCust = "";
        } else if (typeof $scope.spNewAppointment.comment != 'undefined') {
            spCommentsForCust = $scope.spNewAppointment.comment;
        } else {
            spCommentsForCust = "";
        }

        var package_code;
        if($scope.package_code == null || $scope.package_code == 'undefined' || $scope.package_code == "0"){
            package_code = null;
        }else{
            package_code = $scope.package_code;
        }

        var package_id;
        if($scope.package_id == null || $scope.package_id == 'undefined'){
            package_id = null;
        }else{
            package_id = $scope.package_id;
        }

        var no_of_sessions;
         if($scope.no_of_sessions == null || $scope.no_of_sessions == 'undefined'){
            no_of_sessions = "";
        }else{
            no_of_sessions = $scope.no_of_sessions;
        }

        var promocode;
        if($scope.applyPromoResponseFollowUp.promocode == null || $scope.applyPromoResponseFollowUp.promocode == "" || $scope.applyPromoResponseFollowUp.promocode == "0"){
            promocode = null;
        }else{
            promocode = $scope.applyPromoResponseFollowUp.promocode;
        }

        var additional_amount;
        if($scope.additional_amount < 0 || $scope.additional_amount == ""){
            $scope.additional_amount = 0;
        }else{
            $scope.additional_amount = $scope.additional_amount;
        }

        var use_sessions;
        if($scope.use_sessions <= 0 || $scope.use_sessions == ""){
            $scope.use_sessions = 0;
        }else{
            $scope.use_sessions = $scope.use_sessions;
        }

        var clinicPrice;
        if($scope.clinicBasePriceVal <= 0 || $scope.clinicBasePriceVal == undefined){
            clinicPrice = 0;
        }else{
            clinicPrice = $scope.clinicBasePriceVal;
        }

        var clinicId;
        if($scope.apptClinicId == undefined || $scope.apptClinicId == ''){
            clinicId = null;
        }else{
            clinicId = $scope.apptClinicId;
        }

        var package_created_on;
        if($scope.package_created_on != 0 && $scope.package_created_on != undefined){
            package_created_on = $scope.package_created_on;
        }else{
            package_created_on = 0;
        }

        var approved_valid_days;
        if($scope.approved_valid_days != 0 && $scope.approved_valid_days != undefined){
            approved_valid_days = $scope.approved_valid_days;
        }else{
            approved_valid_days = 0;
        }
        
        var idObj = $cookies.get('u_id');

        var dataObjSubmitAptForm = {
            "customer":{
                "cityid": $scope.custCityId,
                "name": $scope.custName,
                "phone": $scope.custPhone,
                "email": $scope.custEmail,
                "pincode": $scope.custPincode,
                "address": resAddress,
                "problem": custproblem,
                "gender": $scope.custGender,
                "signMeUp": true,
                "no_of_sessions":no_of_sessions,
                "is_package_assign":$scope.is_package_assign,
                "additional_amount":$scope.additional_amount,
                //"additional_amount":temp_additional_amount,  
                "use_sessions":$scope.use_sessions,
                "package_created_on":package_created_on,
                "approved_valid_days":approved_valid_days
            },
            "apptslots": $scope.spNewAppointment.selectedTimeSlots,
            "adminid": idObj,
            "comments": spCommentsForCust,
            "zoneid": $scope.zoneId,
            "serviceid": $scope.serviceIdInst,
            "address": $scope.spNewAppointment.appointmentAddress,
            "usecustomeraddress":$scope.spNewAppointment.check,
            "locality": $scope.locality,
            "apptRootId": $scope.rootApptId,
            "promocode": promocode,
           // "additionalcharge":$scope.spNewAppointment.addcharges,
            "additionalcharge":$scope.additional_amount,
            "additionalchargedesc":"",
            "package_code":package_code,
            "package_id":package_id,
            "patientid":$scope.patientid,
            "clinic_id":clinicId,
            "clinicBasePrice":clinicPrice,
            "zoneBasePrice":$scope.baseCost

        }
  if ($scope.spNewAppointment.addcharges == null || $scope.spNewAppointment.addcharges == undefined){
            console.log("setting additional charge 0");
            dataObjSubmitAptForm.additionalcharge = 0;
        }
        spApi.createNewAppointment(dataObjSubmitAptForm)
        .success(function(data, status, headers, config) {
            // $scope.frm.submit = data.payload.refno;
            var refnos = [];
            for(var i=0; i<data.payload.length; i++) {
                refnos.push(data.payload[i].refno);
            }
            if(refnos.length == 1) {
                var google_conversion_id = 845120495;
                var google_conversion_language = "en";
                var google_conversion_format = "3";
                var google_conversion_color = "ffffff";
                var google_conversion_label = "186DCO__snMQ74f-kgM";
                var google_conversion_value = 599.00;
                var google_conversion_currency = "INR";
                var google_remarketing_only = false;
                $scope.frm.submit = "Thank you for confirming appointment. Appointment reference number is " + refnos[0];
            } else {
                var google_conversion_id = 845120495;
                var google_conversion_language = "en";
                var google_conversion_format = "3";
                var google_conversion_color = "ffffff";
                var google_conversion_label = "186DCO__snMQ74f-kgM";
                var google_conversion_value = 599.00;
                var google_conversion_currency = "INR";
                var google_remarketing_only = false;
                $scope.frm.submit = "Thank you for confirming appointments. Appointment reference numbers are " + refnos.join(", ");
            }
            $scope.spNewApptForCustErrorMsg = "";
            $scope.showDatepicker = false;
            $scope.showAddressComments = false;
        })
        .error(function(data, status, headers, config) {
            var google_conversion_id = "";
            var google_conversion_language = "";
            var google_conversion_format = "";
            var google_conversion_color = "";
            var google_conversion_label = "";
            var google_conversion_value = "";
            var google_conversion_currency = "";
            var google_remarketing_only = "";
            //$scope.showDatepicker = false;
            //$scope.showAddressComments = false;
            $scope.spNewApptForCustErrorMsg = data.error.message;
            $scope.checkSessionTimeout(data);
        });
    }

    $scope.addPaymentMode = function() {

        if($scope.aptPayment.type != null && $scope.aptPayment.type != undefined){

            if($scope.aptPayment.currency &&
                $scope.aptPayment.type &&
                $scope.aptPayment.amnt != undefined) {
                
                var modeSet = false;
                for(var i=0; i<$scope.aptPayment.paymentModes.length; i++) {
                    var mode = $scope.aptPayment.paymentModes[i];
                    if(mode.type === $scope.aptPayment.type) {
                        mode.amount = $scope.aptPayment.amnt;
                        modeSet = true;
                        break;
                    }
                }
                
                if(!modeSet) {
                    $scope.aptPayment.paymentModes.push({
                        currency: $scope.aptPayment.currency,
                        type: $scope.aptPayment.type,
                        amount: $scope.aptPayment.amnt,
                        description: "appointment amount",
                    });
                }

               // $scope.aptPayment.amnt = 0;
            }

           
           if($scope.aptPayment.sptype &&
                $scope.aptPayment.additionalSpAmnt != undefined) {

                var modeAddSpSet = false;
                for(var i=1; i<$scope.aptPayment.paymentModes.length; i++) {
                    var modeaddsp = $scope.aptPayment.paymentModes[i];
                    if(modeaddsp.sptype === $scope.aptPayment.sptype) {
                        modeaddsp.amount = $scope.aptPayment.additionalSpAmnt;
                        modeAddSpSet = true;
                        break;
                    }
                }

                if(!modeAddSpSet) {
                     $scope.aptPayment.paymentModes.push({
                        currency: $scope.aptPayment.currency,
                        type: $scope.aptPayment.sptype,
                        amount: $scope.aptPayment.additionalSpAmnt,
                        //description: "additional amount",
                        //description:$scope.aptPayment.additionalSpAmntDesc,
                        description:"Services/Products Additional Amount"
                    });
                }

                //$scope.aptPayment.additionalSpAmnt = 0;
            }

        }else{
            alert('Please select mode of payment.')
        }

       
    }

    $scope.removePaymentMode = function() {     
        if($scope.aptPayment.selectedMode) {
            var selectedIndex = $scope.aptPayment.selectedModeIndex;

            /*for(var i=0; i<$scope.aptPayment.paymentModes.length; i++) {
                var mode = $scope.aptPayment.paymentModes[i];
                if(mode.type === $scope.aptPayment.selectedMode.type) {
                    index = i;
                    //break;
                }
            }*/

            if(selectedIndex != -1) {
                $scope.aptPayment.paymentModes.splice(selectedIndex, 1);
                $scope.aptPayment.selectedMode = null;
                $scope.aptPayment.selectedModeIndex = -1;
            }
        }
    }

    $scope.submitAptPackage = function() {

        //alert($scope.aptPackage.isretrofit);
        if($scope.apptPackage.packageForm.free_cancellation_days.$valid && $scope.apptPackage.packageForm.valid_days.$valid && $scope.apptPackage.packageForm.no_of_sessions.$valid && $scope.aptPackage.no_of_sessions >= $scope.aptPackage.min_sessions && $scope.aptPackage.no_of_sessions <= $scope.aptPackage.max_sessions)
        {
            if($scope.custReadList.custwallet.walletbalance >= $scope.aptPackage.net_amount)
            {
                /*var free_cancellation_days = 0;
                if($scope.aptPackage.no_of_sessions > 0 && $scope.aptPackage.free_cancellation_ratio > 0){
                    free_cancellation_days = (($scope.aptPackage.no_of_sessions * $scope.aptPackage.free_cancellation_ratio) / 100);
                    free_cancellation_days = Math.round(free_cancellation_days);
                }*/
                
                var data = {
                    appt_id : $scope.adminNewAppointmentCust.appointment._id,
                    package_id: $scope.aptPackage.package_id,
                    package_code: $scope.aptPackage.package_code,
                    no_of_sessions: $scope.aptPackage.no_of_sessions,
                    additional_amount: $scope.aptPackage.additional_amount,
                    //free_cancellation_ratio:  $scope.aptPackage.free_cancellation_ratio,
                    free_cancellation_days:  $scope.aptPackage.free_cancellation_days,
                    valid_days:  $scope.aptPackage.valid_days,
                    spid: $scope.adminNewAppointmentCust.appointment.spid,
                    session_price: $scope.models.response.perApptCharges,
                    isretrofit:$scope.aptPackage.isretrofit,
                }

                spApi.updatePackage($scope.adminNewAppointmentCust.appointment.patientid, data)
                .success(function(data, status, headers, config) {
                    $scope.adminNewAppointmentCust.customer.package_code = $scope.aptPackage.package_code;
                    $scope.adminNewAppointmentCust.customer.no_of_sessions = $scope.aptPackage.no_of_sessions;
                    $scope.adminNewAppointmentCust.customer.additional_amount = $scope.aptPackage.additional_amount;
                    alert("Customer package updated successfully");
                    hidePackageDialog();
                    $scope.adminNewAppointmentCust.appointment.custid = $scope.adminNewAppointmentCust.appointment.patientid;
                    $scope.showAppointment($scope.adminNewAppointmentCust.appointment, 'appointment');

                })
                .error(function(data, status, headers, config) {
                    $scope.apptPackageError = data.error.message;
                    $scope.checkSessionTimeout(data);
                });

                spApi.addServicesProductsTrans($scope.productServiceList,$scope.adminNewAppointmentCust.appointment.patientid,$scope.adminNewAppointmentCust.appointment.spid)
                .success(function(data, status, headers, config) {
                    console.log('service/product record added successfully!');
                })
                .error(function(data, status, headers, config) {
                    console.log('Failed to add service/product record!');
                });

            }else{
              
                if(!$scope.custOldPackage.is_package_assign && $scope.custOldPackage.package_id == $scope.aptPackage.package_id && $scope.custOldPackage.package_code == $scope.aptPackage.package_code){         
                    if($scope.custReadList.custwallet.walletbalance >= $scope.aptPackage.temp_net_amount)
                    {
                        /*var free_cancellation_days = 0;
                        if($scope.aptPackage.no_of_sessions > 0 && $scope.aptPackage.free_cancellation_ratio > 0){
                            free_cancellation_days = (($scope.aptPackage.no_of_sessions * $scope.aptPackage.free_cancellation_ratio) / 100);
                            free_cancellation_days = Math.round(free_cancellation_days);
                        }*/

                        var data = {
                            appt_id : $scope.adminNewAppointmentCust.appointment._id,
                            package_id: $scope.aptPackage.package_id,
                            package_code: $scope.aptPackage.package_code,
                            no_of_sessions: $scope.aptPackage.no_of_sessions,
                            additional_amount: $scope.aptPackage.additional_amount,
                            //free_cancellation_ratio:  $scope.aptPackage.free_cancellation_ratio,
                            free_cancellation_days:  $scope.aptPackage.free_cancellation_days,
                            valid_days:  $scope.aptPackage.valid_days,
                            spid: $scope.adminNewAppointmentCust.appointment.spid,
                            isretrofit:$scope.aptPackage.isretrofit,
                        }

                        spApi.updatePackage($scope.adminNewAppointmentCust.appointment.patientid, data)
                        .success(function(data, status, headers, config) {
                            $scope.adminNewAppointmentCust.customer.package_code = $scope.aptPackage.package_code;
                            $scope.adminNewAppointmentCust.customer.no_of_sessions = $scope.aptPackage.no_of_sessions;
                            $scope.adminNewAppointmentCust.customer.additional_amount = $scope.aptPackage.additional_amount;
                            alert("Customer package updated successfully");
                            hidePackageDialog();
                            $scoproductServiceListpe.adminNewAppointmentCust.appointment.custid = $scope.adminNewAppointmentCust.appointment.patientid;
                            $scope.showAppointment($scope.adminNewAppointmentCust.appointment, 'appointment');
                        })
                        .error(function(data, status, headers, config) {
                            $scope.apptPackageError = data.error.message;
                            $scope.checkSessionTimeout(data);
                        });

                        spApi.addServicesProductsTrans($scope.productServiceList,$scope.adminNewAppointmentCust.appointment.patientid,$scope.adminNewAppointmentCust.appointment.spid)
                        .success(function(data, status, headers, config) {
                            console.log('service/product record added successfully!');
                        })
                        .error(function(data, status, headers, config) {
                            console.log('Failed to add service/product record!');
                        });
                        

                    }else{
                        $scope.apptPackageError = "Customer does't have enough credit in wallet.";
                        $scope.walletFlag = true;
                    }
                }else{
                   // alert('else');
                    $scope.apptPackageError = "Customer does't have enough credit in wallet.";
                    $scope.walletFlag = true;
                }
            }
        }else{
            $scope.apptPackageError = "No. of Sessions must be in a range of package.";
            $scope.walletFlag = false;
        }

       // $scope.aptPackage.isretrofit = false;
    }

    $scope.calculateCost = function(promo) {
        if(promo != undefined){
            $scope.models.calculator.package = promo.promocode;
            $scope.aptPackage.package_id = promo._id;
            $scope.aptPackage.package_code = promo.promocode;
            $scope.aptPackage.min_sessions = promo.min_sessions;
            $scope.aptPackage.max_sessions = promo.max_sessions;
            $scope.aptPackage.no_of_sessions = promo.min_sessions;
            $scope.aptPackage.free_cancellation_ratio = promo.free_cancellation_ratio;
            $scope.aptPackage.valid_days = promo.valid_days;
            $scope.cancellation_fee = promo.cancellation_fee;
            
            $scope.aptPackage.free_cancellation_days = 0;
            if($scope.aptPackage.no_of_sessions > 0 && $scope.aptPackage.free_cancellation_ratio > 0){
                $scope.aptPackage.free_cancellation_days = (($scope.aptPackage.no_of_sessions * $scope.aptPackage.free_cancellation_ratio) / 100);
                $scope.aptPackage.free_cancellation_days = Math.round($scope.aptPackage.free_cancellation_days);
            }
        }

        var temp_add = null;
        if($scope.aptPackage.no_of_sessions > 0 && $scope.aptPackage.additional_amount > 0){
            temp_add = $scope.aptPackage.additional_amount * $scope.aptPackage.no_of_sessions;
        }
        $scope.models.response = null;
        var data = {
            massnoofappt: $scope.aptPackage.no_of_sessions,
            serviceid: $scope.models.service.id,
            promocode: $scope.models.calculator.package,
            zoneBasePrice:$scope.adminNewAppointmentCust.appointment.cost
        };
        
        spApi.calculateApptCharges(data).
        success(function (data, status, headers, config) {
            if(data && data.payload) {
                $scope.models.response = data.payload;
                console.log(data.payload);
                $scope.models.response.netTotalCharges = $scope.models.response.netTotalCharges + temp_add;
                $scope.aptPackage.net_amount = $scope.models.response.netTotalCharges;
                $scope.aptPackage.temp_net_amount = parseInt($scope.models.response.netTotalCharges / 2);
                $scope.showResponse = true;
                $scope.models.response.status = data.status;
            }
        }).
        error(function (data, status, headers, config) {
            if(data && data.error && data.error.message) {
                $scope.models.response = {
                    error: data.error.message
                };
            }
            console.log("Error in receiving cost per appointment");
        });
    }

    $scope.setFreeCancellationNo = function() {

        var noOfSessions = $scope.aptPackage.no_of_sessions;
        var cancellationPercent = $scope.aptPackage.free_cancellation_ratio;

        if($scope.aptPackage.no_of_sessions > 0 && $scope.aptPackage.free_cancellation_ratio > 0){
            $scope.aptPackage.free_cancellation_days = ((noOfSessions * $scope.aptPackage.free_cancellation_ratio) / 100);
            $scope.aptPackage.free_cancellation_days = Math.round($scope.aptPackage.free_cancellation_days);
        }
    }

    $scope.cancelAptPackage = function() {
        hidePackageDialog();
        try {
            $scope.apptPackage.packageForm.$setPristine();
            $scope.apptPackage.packageForm.$setUntouched();
        } catch(err) {}
        $scope.aptPackage.no_of_sessions = "";
        $scope.aptPackage.additional_amount = "";
        $scope.models.calculator.package = 'Select Package';
        $scope.apptPackageError = "";
        $scope.showResponse = false;
    }

    $scope.submitAptPayment = function() {
        $scope.apptPaymentErrorMsg = "";

        if (($scope.applyPromoResponsePaymentSection != undefined) && 
            ($scope.applyPromoResponsePaymentSection.promocodeid != undefined) && 
            ($scope.applyPromoResponsePaymentSection.promocode != undefined) && 
            ($scope.applyPromoResponsePaymentSection.finalcost != undefined)) {
            $scope.aptPayment.promocodeid = $scope.applyPromoResponsePaymentSection.promocodeid;
            $scope.aptPayment.promocode = $scope.applyPromoResponsePaymentSection.promocode;
            $scope.aptPayment.finalcost = $scope.applyPromoResponsePaymentSection.finalcost;
        }

        if($scope.productServiceAddlTotal > 0 && $scope.productServiceAddlTotal != undefined){
            $scope.aptPayment.additionalSpAmntDesc = "Services/Products Additional Amount";
        }

        var data = {
            appointmentid: $scope.aptPayment.appointmentid,
            promocodeid: $scope.aptPayment.promocodeid,
            promocode: $scope.aptPayment.promocode,
            paymentmodes: $scope.aptPayment.paymentModes,
            promocost:$scope.applypromocost,
            additionalchargespdesc:$scope.aptPayment.additionalSpAmntDesc,
            city:$scope.adminNewAppointmentCust.customer.city,
            cityId:$scope.adminNewAppointmentCust.customer.cityid,
            serviceProductList:$scope.aptPayment.productServicesToBeUsed
        }

        spApi.markAppointmentComplete(data)
        .success(function(data, status, headers, config){
            alert("Appointment marked complete successfully");
            hidePaymentDialog();

            try {
                $scope.apptPayment.paymentForm.$setPristine();
                $scope.apptPayment.paymentForm.$setUntouched();
            } catch(err) {}
            $scope.visitedpaymentAmt = false;
            //added for SP additional amount;
            $scope.visitedaddsppaymentAmt = false;

            var totalCostPaid = 0;
            for(var i=0; i<$scope.aptPayment.paymentModes.length; i++) {
                var mode = $scope.aptPayment.paymentModes[i];
                totalCostPaid += parseInt(mode.amount);
            }
            // $scope.costPaid = $scope.aptPayment.amnt;
            // $scope.costPaid = totalCostPaid;
            if(totalCostPaid!=0){
                $scope.costPaid = totalCostPaid;
            }

            $scope.adminNewAppointmentCust.payment = {
                amnt: totalCostPaid,
                payments: $scope.aptPayment.paymentModes
            }

            $scope.paymentType = $scope.aptPayment.type;
            $scope.adminNewAppointmentCust.appointment.state = "Completed";
            $scope.aptPayment.additionalSpAmnt = "0";
            $scope.aptPayment.additionalSpAmntDesc = "";
           //$scope.aptPayment.amnt = "0";

            if($scope.adminNewAppointmentCust.appointment.additionalcharge>0){
                $scope.aptPayment.amnt = $scope.adminNewAppointmentCust.appointment.finalcost + $scope.adminNewAppointmentCust.appointment.additionalcharge;
            }else{
                $scope.aptPayment.amnt = $scope.adminNewAppointmentCust.appointment.finalcost;
            }
         

            $scope.aptPayment.type = "Wallet";
            $scope.aptPayment.sptype = "Wallet";
            $scope.aptPayment.paymentModes = [];
            $scope.aptPayment.selectedMode = null;
            $scope.aptPayment.selectedModeIndex = -1;
            $scope.applypromocost= '';
        })
        .error(function(data, status, headers, config){
            $scope.apptPaymentErrorMsg = data.error.message;
            $scope.checkSessionTimeout(data);
        })
    }

    $scope.cancelAptPayment = function() {
        hidePaymentDialog();
        $scope.apptPaymentErrorMsg = "";
        try {
            $scope.apptPayment.paymentForm.$setPristine();
            $scope.apptPayment.paymentForm.$setUntouched();
        } catch(err) {}
        $scope.visitedpaymentAmt = false;
        $scope.aptPayment.amnt = "0";
        //added for SP additional amount;
        $scope.visitedaddsppaymentAmt = false;
        $scope.aptPayment.additionalSpAmnt = "0";
        $scope.aptPayment.additionalSpAmntDesc = "";
        $scope.applypromocost= '';

    }

    $scope.showEditDocumentation = function() {
        if(!Object.keys($scope.adminNewAppointmentCust).length == 0) {
            if($scope.adminNewAppointmentCust.sp==undefined){
                $scope.adminNewAppointmentCust.sp = "";
            }
            return $scope.adminNewAppointmentCust.sp._id == $cookies.get("u_id");
        }
    }

    $scope.saveEditedDocumentation = function() {
        var apptstarttime = moment(new Date($scope.adminNewAppointmentCust.appointment.starttime * 1000)).format("YYYY-MM-DD hh:mm A");
        var data = {
            "customer": {
              "problem": $scope.adminNewAppointmentCust.customer.problem,
              "pincode": $scope.adminNewAppointmentCust.appointment.pincode
            },
            "apptslots": [apptstarttime],
            // "apptstarttime": apptstarttime,
            "adminid": $scope.adminNewAppointmentCust.appointment.adminid,
            "comments": $scope.adminNewAppointmentCust.appointment.comments,
            "zoneid": $scope.adminNewAppointmentCust.appointment.zoneid,
            "serviceid": $scope.adminNewAppointmentCust.appointment.serviceid,
            "address": $scope.adminNewAppointmentCust.customer.address,
            "usecustomeraddress": $scope.adminNewAppointmentCust.appointment.usecustomeraddress,
            "rating": $scope.adminNewAppointmentCust.appointment.rating,
            "document": $scope.adminNewAppointmentCust.appointment.document,
            "apptRootId": "",
            "promocode": "",
            "trtmntend": $scope.adminNewAppointmentCust.appointment.isTreatmentCompleted
        };

        spApi.updateAppointmentDetails($scope.adminNewAppointmentCust.appointment._id, data)
        .success(function(data, status, headers, config){
            alert("Documentation saved successfully");
            $scope.adminNewAppointmentCust.documentRO = data.payload[0].document;
            $scope.adminNewAppointmentCust.hasDocument = true;
        })
        .error(function(data, status, headers, config){
            console.log("Error (saveEditedDocumentation)-");
            alert(data.error.message);
            $scope.checkSessionTimeout(data);
        });
    }

    $scope.imagesSelected = function(files) {
        var filesList = files.files;
        for(var i=0; i<filesList.length; i++) {
            var FR= new FileReader();
            FR.filename = filesList[i].name;
            FR.onload = function(e) {
                var investigation = {
                    fname : e.target.filename,
                    base64data : e.target.result,
                    action : "new"
                };
                $scope.setSelectedImages(investigation);
            };
            FR.readAsDataURL( filesList[i] );
        }
    }

    $scope.setSelectedImages = function(investigation) {
        if($scope.adminNewAppointmentCust.appointment.document.assessment == undefined) {
            $scope.adminNewAppointmentCust.appointment.document.assessment = {};
        }
        if($scope.adminNewAppointmentCust.appointment.document.assessment.investigations == undefined) {
            $scope.adminNewAppointmentCust.appointment.document.assessment.investigations = [];
        }
        $scope.adminNewAppointmentCust.appointment.document.assessment.investigations.push(investigation);
        $scope.$apply();
    }

    $scope.editAptClicked = function() {
        if(!$scope.adminNewAppointmentCust.appointment.hasOwnProperty("document")) {
            $scope.adminNewAppointmentCust.appointment.document = {type : ""};
        }
        $scope.scrollDiv("aptDocumentation");
    }

    $scope.scrollDiv = function(element) {
        $timeout(function() {
            var selector = document.getElementsByClassName(element);
            if($scope.currentOpenView == 'APPOINTMENT') {
                selector = selector[0];
            }else if($scope.currentOpenView == 'CUSTOMER_APPOINTMENT') {
                selector = selector[1];
            }
            selector.scrollIntoView();
            $(document).scrollTop(($(document).scrollTop()) - 100 + 30);
        }, 500);
    }

    $scope.scrollDivById = function(element) {
        $timeout(function() {
            var selector = document.getElementById(element);
            selector.scrollIntoView();
            $(document).scrollTop(($(document).scrollTop()) - 100 + 30);
        }, 500);
    }

    showPaymentDialog = function() {
        if($scope.currentOpenView == 'APPOINTMENT') {
            slideDownByIndex('.spApptPayment', 0);
        }else if($scope.currentOpenView == 'CUSTOMER_APPOINTMENT') {
            slideDownByIndex('.spApptPayment', 1);
        }
        $scope.scrollDiv('spApptPayment');
    }

    $scope.addInAccountService = function(service) {



       if(service != undefined){
            $scope.aptPayment.productServicesToBeUsed.push(service)
       }

       //console.log($scope.aptPayment.productServicesToBeUsed);

       var index = -1;
       for(var i = 0;i< $scope.serviceInAccount.length;i++){
            if(service._id == $scope.serviceInAccount[i]._id){
                index = i;
            }
       }
       $scope.serviceInAccount.splice(index,1);

       $scope.productServiceAddlTotal = $scope.productServiceAddlTotal + service.price;
       $scope.aptPayment.additionalSpAmnt = $scope.productServiceAddlTotal;
 
       $scope.aptPayment.sptype = 'Wallet';

    }

    $scope.addInAccountProduct = function(product) {

        if(product != undefined){
            $scope.aptPayment.productServicesToBeUsed.push(product)
        }

        //console.log($scope.aptPayment.productServicesToBeUsed);

        var index = -1;
        for(var i = 0;i< $scope.productsInAccount.length;i++){
            if(product._id == $scope.productsInAccount[i]._id){
                index = i;
            }
        }
       $scope.productsInAccount.splice(index,1);

       $scope.productServiceAddlTotal = $scope.productServiceAddlTotal + product.price;
       $scope.aptPayment.additionalSpAmnt = $scope.productServiceAddlTotal;

       $scope.aptPayment.sptype = 'Wallet';
    }


    $scope.removeServiceProduct = function(item) {
        console.log(item);
        var index = -1;
        for(var i = 0; i < $scope.aptPayment.productServicesToBeUsed.length; i++) {
           if($scope.aptPayment.productServicesToBeUsed[i]._id == item._id) {
             index = i;
           }
        }

        $scope.aptPayment.productServicesToBeUsed.splice(index,1);

         if(item.category == 'Product'){
             $scope.productsInAccount.push(item);
         }else{
             $scope.serviceInAccount.push(item);
         }

         $scope.productServiceAddlTotal = $scope.productServiceAddlTotal - (item.price * item.selectedQty);
         $scope.aptPayment.additionalSpAmnt = $scope.productServiceAddlTotal;
    }

    getPatientProductService = function() {
        //alert($scope.adminNewAppointmentCust.customer.custwallet.walletbalance);
        console.log($scope.custReadList.custwallet.walletbalance);
        //$scope.currentBalance = $scope.adminNewAppointmentCust.customer.custwallet.walletbalance;
        spApi.getServiceProductTrans($scope.adminNewAppointmentCust.appointment.patientid)
        .success(function(data, status, headers, config) {
            $scope.aptPayment.productServicesToBeUsed = [];

            $scope.productsServices = [];
            $scope.serviceInAccount = [];
            $scope.productsInAccount = [];
            $scope.serviceName = [];
            $scope.productName = [];
            $scope.productsServices = data.payload;
            $scope.productServiceAddlTotal = 0;
            $scope.aptPayment.additionalSpAmnt = $scope.productServiceAddlTotal;

            $scope.productsServices.forEach(function(item){
                if(item.is_used == false){
                    if(item.category == 'Service'){
                        $scope.serviceInAccount.push(item);
                        $scope.serviceName.push(item.name);
                    }
                    if(item.category == 'Product'){
                        $scope.productsInAccount.push(item);
                        $scope.productName.push(item.name);
                    }
                }

            });

            var  serviceQty = [];
            $scope.serviceName.forEach(function(i) { 
                serviceQty[i] = (serviceQty[i]||0) + 1;            
            }); 
            console.log(serviceQty);   
            $scope.servicesWithQty = [];        
            $scope.serviceInAccount.forEach(function(item1) {
                item1.qty = serviceQty[item1.name];
                $scope.servicesWithQty.push(item1);
            });

            //console.log('In account services');
            //console.log($scope.servicesWithQty);

            $scope.uniqueServices = [];
            var flagService = false;             
            $scope.serviceInAccount.forEach(function(rec){             
                if($scope.uniqueServices.length === 0){
                    $scope.uniqueServices.push(rec);                              
                }else{ 
                    flagService = false;  
                    $scope.uniqueServices.forEach(function(i){ 
                       if( i.hasOwnProperty('name') && i['name'] === rec.name ){
                            flagService = true;
                        }
                    });
                    if(flagService == false){
                        $scope.uniqueServices.push(rec);
                    }
                }
            });
            //console.log($scope.uniqueServices);

            var  productQty = [];
            $scope.productName.forEach(function(i) { 
                productQty[i] = (productQty[i]||0) + 1;            
            }); 
            console.log(productQty);   
            $scope.productsWithQty = [];        
            $scope.productsInAccount.forEach(function(item1) {
                item1.qty = productQty[item1.name];
                $scope.productsWithQty.push(item1);
            });

            //console.log('In account services');
            //console.log($scope.productsWithQty);

            $scope.uniqueProducts = [];
            var flagProduct = false;             
            $scope.productsInAccount.forEach(function(rec){             
                if($scope.uniqueProducts.length === 0){
                    $scope.uniqueProducts.push(rec);                              
                }else{ 
                    flagProduct = false;  
                    $scope.uniqueProducts.forEach(function(i){ 
                       if( i.hasOwnProperty('name') && i['name'] === rec.name ){
                            flagProduct = true;
                        }
                    });
                    if(flagProduct == false){
                        $scope.uniqueProducts.push(rec);
                    }
                }
            });
            //console.log($scope.uniqueProducts);
      
        })
        .error(function(data, status, headers, config) {
            console.log('Failed to fetch Patient services and products transactions!');
        });

    }

    $scope.showServiceProductPupup = function(){
        //alert('Hi');
        $scope.selectedItems = [];
        $scope.serviceProductQty = 1;
        ngDialog.openConfirm({
            template: 'AptServiceProduct',
            showClose:false,
            scope: $scope 
        }).then(function(value)
        {
            $scope.selectedItems.forEach(function(item){
                if(item.category == 'Service'){
                    if(document.getElementById(item.name+'_service').value != '' && document.getElementById(item.name+'_service').value != undefined){
                        item.selectedQty =  document.getElementById(item.name+'_service').value;
                    }else{
                        item.selectedQty = 1;
                    }

                }else{
                    if(document.getElementById(item.name+'_product').value != '' && document.getElementById(item.name+'_product').value != undefined){
                        item.selectedQty =  document.getElementById(item.name+'_product').value;
                    }else{
                        item.selectedQty = 1;
                    }
                }
                $scope.productServiceAddlTotal = $scope.productServiceAddlTotal + (item.price * item.selectedQty);
               
            });

            $scope.aptPayment.additionalSpAmnt = $scope.productServiceAddlTotal;

            $scope.aptPayment.productServicesToBeUsed = $scope.selectedItems;
            //alert('After confirm');
        },
        function(value) {
            console.log("Fail Service Product Addition.");
        });
    }

    $scope.getSelectedServiceProduct = function(rec,checked,seletedQty){
        //alert(rec.name);
        //alert(checked);
        //console.log(document.getElementById(rec.name+'_service').value);

        if(rec.category == 'Service'){
            var sQty = document.getElementById(rec.name+'_service').value;
        }else{
            var sQty = document.getElementById(rec.name+'_product').value;
        }
    
        var qauntity = parseInt(sQty);

        if(checked == true){
            if(sQty != undefined){
                rec.selectedQty = parseInt(qauntity);
            }else{
                rec.selectedQty = 1;
            }         
            $scope.selectedItems.push(rec);

        }else{

            for(var i = 0; i < $scope.selectedItems.length; i++) {
               if($scope.selectedItems[i].name == rec.name) {
                 index = i;
               }
            }
            $scope.selectedItems.splice(index,1);
        }

        console.log($scope.selectedItems);
    }

    $scope.validateQty = function(selectedQty,rec){
        $scope.validateQuantity = false;
        console.log('selected:'+selectedQty);
        console.log('availed:'+rec.qty);
        if(selectedQty > rec.qty || selectedQty == undefined){
            //alert('true');
            //$scope.validateQuantity = true;
            if(rec.category == 'Service'){
                document.getElementById(rec.name+'_service').value = 1;
            }else{
                document.getElementById(rec.name+'_product').value = 1;
            }
            
        }
    }

    hidePaymentDialog = function() {
        if($scope.currentOpenView == 'APPOINTMENT') {
            slideUpByIndex('.spApptPayment', 0);
        }else if($scope.currentOpenView == 'CUSTOMER_APPOINTMENT') {
            slideUpByIndex('.spApptPayment', 1);
        }
        $scope.scrollDiv('apptSection');
    }

    showPackageDialog = function() {  

        if($scope.currentOpenView == 'APPOINTMENT') {
            slideDownByIndex('.spPackageDetails', 0);
        }else if($scope.currentOpenView == 'CUSTOMER_APPOINTMENT') {
            slideDownByIndex('.spPackageDetails', 1);
        }
        $scope.scrollDiv('spPackageDetails');
        $scope.aptPackage.no_of_sessions = "";
        $scope.aptPackage.additional_amount = 0;
        $scope.models.calculator.package = 'Select Package';
        $scope.apptPackageError = "";
        $scope.showResponse = false;

        $scope.getServicesAndProducts($scope.adminNewAppointmentCust.appointment.patientid);
    }

    hidePackageDialog = function() {
        if($scope.currentOpenView == 'APPOINTMENT') {
            slideUpByIndex('.spPackageDetails', 0);
        }else if($scope.currentOpenView == 'CUSTOMER_APPOINTMENT') {
            slideUpByIndex('.spPackageDetails', 1);
        }
        $scope.scrollDiv('apptSection');
    }

    toggleContainer = function(className) {
        var index;
        if($scope.currentOpenView == 'APPOINTMENT') {
            index = 0;
        }else if($scope.currentOpenView == 'CUSTOMER_APPOINTMENT') {
            index = 1;
        }
        var elementObj = $("." + className+":eq("+index+")");
        elementObj.slideToggle();
    }

    showDocumentation = function() {
        if($scope.currentOpenView == 'APPOINTMENT') {
            slideDownByIndex('.aptDocumentation', 0);
        }else if($scope.currentOpenView == 'CUSTOMER_APPOINTMENT') {
            slideDownByIndex('.aptDocumentation', 1);
        }
    }

    hideDocumentation = function() {
        if($scope.currentOpenView == 'APPOINTMENT') {
            slideUpByIndex('.aptDocumentation', 0);
        }else if($scope.currentOpenView == 'CUSTOMER_APPOINTMENT') {
            slideUpByIndex('.aptDocumentation', 1);
        }
    }

    showApptReschedule = function() {
        $timeout(function(){
            if($scope.currentOpenView == 'APPOINTMENT') {
                slideDownByIndex('.rescheduleAppt', 0);
            }else if($scope.currentOpenView == 'CUSTOMER_APPOINTMENT') {
                slideDownByIndex('.rescheduleAppt', 1);
            }
        }, 200);
    }

    $scope.initLocalities = function() {
        if(cache.hasOwnProperty("cityToIdMap")) {
            $scope.custPin(cache.cityToIdMap["Pune"]);
        } else {
           $timeout(function(){
                $scope.initLocalities();
            }, 200); 
        }        
    }

    $scope.getLocalityFromPincode = function(pincode) {
        if($scope.locationArr.length > 0 && pincode != undefined) {
            for(var i=0; i<$scope.locationArr.length; i++) {
                var location = $scope.locationArr[i];
                if(location.pin == pincode) {
                    $scope.customerLocality = location.localities;
                    $scope.customerPincodeid = location.pincodeid;
                    break;
                }
            }
        } else {  
            if($scope.apptClinicId != undefined && $scope.apptClinicId != ''){
                 $timeout(function() {
                    console.log('function called recursively');
                    $scope.getLocalityFromPincode(pincode);
                }, 200);
            }
        }
    }

    $scope.custPin = function(cityid) {
        var zones = [];
        var pincode = [];

        spApi.getZones(cityid)
        .success(function(data, status, headers, config) {
            myJsonString = JSON.stringify(data);
            //build cache of pincode to pincodeid
            cache.pincodeIdToPincodeNameMap = buildPincodeIdToPincodeNameMap(data.payload);
            cache.pincodeToPincodeIdMap = buildPincodeToPincodeIdMap(data.payload);
            var custpinobj = JSON.parse(myJsonString);

            for(var i = 0; i < custpinobj.payload.length; i++) {
                var result1 =  custpinobj.payload[i];
                zones.push(custpinobj.payload[i]);
                var zonId = result1.zoneid;
                var zoneObj = {};
                zoneObj[zonId] = [];

                for(var j = 0; j < result1.pincodes.length; j++){
                    var result2 =  result1.pincodes[j];
                    if(!hasInList(pincode, result1.pincodes[j], "pin")) {
                        pincode.push(result1.pincodes[j]);
                    }
                }
            }
            $scope.custZones = zones;
            $scope.custPinLocalities = pincode;

            $scope.locationArr = [];
            var dataArray = data.payload;
            for(var i = 0 ; i < dataArray.length ; i++) {
                var zoneid = dataArray[i].zoneid;
                var zonename = dataArray[i].zonename;
                var pincodeArray = dataArray[i].pincodes;

                for(var j = 0 ; j < pincodeArray.length ; j++) {
                    var pincodeVal = pincodeArray[j].pin;
                    var pincodeid = pincodeArray[j].pincodeid;
                    var localitiesVal = pincodeArray[j].localities;
                    var locationObj = {
                        "zoneid": zoneid,
                        "zonename": zonename,
                        "pin": pincodeVal,
                        "pincodeid":pincodeid,
                        "localities": localitiesVal,
                        "val": pincodeVal + " " + localitiesVal
                    };
                    $scope.locationArr.push(locationObj);
                }
            }
            $scope.acRefresh = false;
            $timeout(function() {
                $scope.acRefresh = true;
                $scope.$apply();
                if($scope.isEditAptMode == false) {
                    $scope.selectedLocation = {
                        "zoneid": "",
                        "zonename": "",
                        "pin": "",
                        "localities": "",
                        "val": ""
                    };
                }
                if($scope.locationArr.length == 0) {
                    $scope.adminNewAppointmentCust.pincode = "";
                    $scope.adminNewAppointmentCust.zone = "";
                }
            }, 100);
        })
        .error(function(data, status, headers, config) {
            console.log("error msg" + data);
            $scope.checkSessionTimeout(data);
        });
    }

    $scope.requestApptWalletTrans = function() {

        //alert($scope.models.response.netTotalCharges);
        $scope.custReadList.custwallet.amount = $scope.models.response.netTotalCharges;
        ngDialog.openConfirm({
            template: 'AptWallet',
            showClose:false,
            scope: $scope 
        }).then(function(value)
        {      
            //console.log('City'+$scope.adminNewAppointmentCust.customer.city);
            //console.log('cityId'+$scope.adminNewAppointmentCust.customer.cityid);
            //console.log($scope.custReadList.custwallet.amount+'---'+$scope.models.response.netTotalCharges);
            if($scope.custReadList.custwallet.amount == $scope.models.response.netTotalCharges){
                var data = {
                   // "walletAmount": $scope.custReadList.custwallet.amount,
                    "walletAmount":$scope.aptPackage.net_amount,
                    "walletTransType": "credit",
                    "currency":"INR",
                    "description":"Package Assignment",
                    "createdById":spApi.getSpid(),
                    "createdByName":spApi.getSpname(),
                    "apptId":$scope.adminNewAppointmentCust.appointment._id,
                    "city":$scope.adminNewAppointmentCust.customer.city,
                    "cityId":$scope.adminNewAppointmentCust.customer.cityid
                }

                spApi.walletTransact($scope.custReadList._id, data)
                .success(function(data, status, headers, config) {
                    if(data.error == undefined && data.payload != undefined) {
                        $scope.apptPackageError = "";
                        $scope.walletFlag = false;
                        $scope.custReadList.custwallet = data.payload.custwallet;
                        $scope.custReadList.custwallet.response = {
                            status: "success",
                            message: "Wallet updated successfully!"
                        }
                        $timeout(function() {
                            delete $scope.custReadList.custwallet.response;
                        }, 5000);
                    }
                })
                .error(function(data, status, headers, config) {
                    console.log("Failed to update the wallet transaction!");
                    $scope.custReadList.custwallet.response = {
                        status: "error",
                        message: "Wallet updation failed!"
                    }
                    $timeout(function() {
                        delete $scope.custReadList.custwallet.response;
                    }, 5000);
                });


                if($scope.productServiceTotal > 0){
                    var data1 = {
                       // "walletAmount": $scope.custReadList.custwallet.amount,
                        "walletAmount": $scope.productServiceTotal,
                        "walletTransType": "credit",
                        "currency":"INR",
                        "description":"Services/Products Additional Amount",
                        "createdById":spApi.getSpid(),
                        "createdByName":spApi.getSpname(),
                        "apptId":$scope.adminNewAppointmentCust.appointment._id,
                        "city":$scope.adminNewAppointmentCust.customer.city,
                        "cityId":$scope.adminNewAppointmentCust.customer.cityid
                    }

                    spApi.walletTransact($scope.custReadList._id, data1)
                    .success(function(data, status, headers, config) {
                        if(data.error == undefined && data.payload != undefined) {
                            $scope.apptPackageError = "";
                            $scope.walletFlag = false;
                            $scope.custReadList.custwallet = data.payload.custwallet;
                            $scope.custReadList.custwallet.response1 = {
                                status: "success",
                                message: "Wallet updated successfully!"
                            }
                            $timeout(function() {
                                delete $scope.custReadList.custwallet.response1;
                            }, 5000);
                        }
                    })
                    .error(function(data, status, headers, config) {
                        console.log("Failed to update the wallet transaction!");
                        $scope.custReadList.custwallet.response = {
                            status: "error",
                            message: "Wallet updation failed!"
                        }
                        $timeout(function() {
                            delete $scope.custReadList.custwallet.response;
                        }, 5000);
                    });
                }
                

            }else{
                $scope.custReadList.custwallet.response = {
                    status: "error",
                    message: "Wallet updation failed!"
                }
            }
        },
        function(value) {
            console.log("Fail wallet transaction.");
        });
    }


    $scope.updateWalletForServiceProduct = function() {

        //alert($scope.models.response.netTotalCharges);

        $scope.custReadList.custwallet.amount = $scope.productServiceTotal;

        $scope.walletTopUp = false;
        ngDialog.openConfirm({
            template: 'AptWallet',
            showClose:false,
            scope: $scope 
        }).then(function(value)
        {      
            if($scope.custReadList.custwallet.amount == $scope.productServiceTotal){
                var data = {
                    "walletAmount": $scope.custReadList.custwallet.amount,
                    "walletTransType": "credit",
                    "currency":"INR",
                    "description":"Services/Products Additional Amount",
                    "createdById":spApi.getSpid(),
                    "createdByName":spApi.getSpname(),
                    //"apptId":$scope.custReadList._id,
                    "city":$scope.custReadList.city,
                    "cityId":$scope.custReadList.cityid
                }

                //console.log(data);

                spApi.walletTransact($scope.custReadList._id, data)
                .success(function(data, status, headers, config) {
                    if(data.error == undefined && data.payload != undefined) {
                        $scope.walletTopUp = true;
                        $scope.apptPackageError = "";
                        $scope.walletFlag = false;
                        $scope.custReadList.custwallet = data.payload.custwallet;
                        $scope.custReadList.custwallet.response = {
                            status: "success",
                            message: "Wallet updated successfully!"
                        }
                        $timeout(function() {
                            delete $scope.custReadList.custwallet.response;
                        }, 5000);

                        $scope.addServicesProductsTrans();
                    }
                })
                .error(function(data, status, headers, config) {
                    $scope.walletTopUp = false;
                    console.log("Failed to update the wallet transaction!");
                    $scope.custReadList.custwallet.response = {
                        status: "error",
                        message: "Wallet updation failed!"
                    }
                    $timeout(function() {
                        delete $scope.custReadList.custwallet.response;
                    }, 5000);
                });

            }else{
                $scope.walletTopUp = false;
                $scope.custReadList.custwallet.response = {
                        status: "error",
                        message: "Please enter exact total amount!"
                }
            }

        },
        function(value) {
            console.log("Fail wallet transaction.");
        });
    }

    $scope.addServicesProductsTrans = function() {
        //console.log($scope.productServiceList);
        //console.log(spApi.getSpid());
        //console.log(spApi.getSpname());

        spApi.addServicesProductsTrans($scope.productServiceList,$scope.custReadList._id,spApi.getSpid())
        .success(function(data, status, headers, config) {
            $scope.walletTopUp = false;
            alert('services/products added into account successfully!');
            $scope.productServiceList=[];
            $scope.productServiceTrans=[];

            $scope.getServicesAndProducts($scope.obj.custid);


        })
        .error(function(data, status, headers, config) {
            console.log('Failed to add service/product record!');
        });
       
    }


    $scope.requestPolicy = function() {
        $scope.policytext = null;
        spApi.getPolicy().
        success(function (data, status, headers, config) {
            var dataarray = [];
            var dataarray = data.payload;
            dataarray.forEach(function(item) {
                $scope.policytext = item.policy_description;
            });
            ngDialog.open({
                template: $scope.policytext,
                showClose:true,
                scope: $scope,
                plain: true,
                closeByDocument: true,
                closeByEscape: true,
                width: '80%'
            });
        }).
        error(function (data, status, headers, config) {
            console.log("Error in receiving clinics");
        });
    }

    $scope.requestApptCancel = function() {
       /* var result = confirm("Are you sure you want to cancel this appointment?");
        if(!result) {
            return;
        }*/
        var cancelRequestInfo ={"reason":"","changerequestby":""};
        $scope.CancelRequest = { reason : "",changerequestby : ""};
        

        ngDialog.openConfirm({
            template: 'AptReason',
            showClose:false,
			scope: $scope 
        }).then(function(value)
        {
            cancelRequestInfo.reason=$scope.CancelRequest.reason;
            cancelRequestInfo.changerequestby=$scope.CancelRequest.changerequestby;
            console.log(cancelRequestInfo);
            spApi.requestAppointmentChange($scope.adminNewAppointmentCust.appointment._id, "cancel",cancelRequestInfo)
            .success(function(data, status, headers, config) {
                alert("Appointment cancellation request sent successfully!");
            })
            .error(function(data, status, headers, config) {
                var error = data.error.message;
                alert("Failed to make appointment cancellation request! " + error);
                $scope.checkSessionTimeout(data);
            });
        },
        function(value) {
        	console.log("Fail " + $scope.CancelRequest.reason );
        });
    }


     $scope.requestPackageCancel = function() {



        if($scope.patientidForPkgCancel != undefined) {
            $scope.fetchFutureAppointments($scope.patientidForPkgCancel);
        }else{
            $scope.fetchFutureAppointments($scope.adminNewAppointmentCust.appointment.patientid);
        }



        $scope.CancelPkgRequest = { reasonForPkgCancel : ""};

        ngDialog.openConfirm({
            template: 'AptPkgCancellation',
            showClose:false,
            scope: $scope 
        }).then(function(value)
        {
            //alert($scope.futureApptSelectedDate);
            //alert($scope.futureApptList.length);
            //alert($scope.CancelPkgRequest.reasonForPkgCancel);

            $scope.spId = $cookies.get('u_id');

            var con = confirm("Are you sure you want to cancel package ?");

            //console.log($scope.futureApptList);
            if(con){   
                if($scope.futureApptList.length > 0 && $scope.futureApptSelectedDate != undefined){
               
                    for(var i = 0; i < $scope.futureApptList.length; i++){

                        var cancelRequestInfo ={"reason":"","changerequestby":"","reasonForPkgCancel":""};

                        if(($scope.futureApptList[i].startTime >= $scope.futureApptSelectedDate) && ($scope.futureApptList[i].status != "Cancelled") && ($scope.futureApptList[i].status != "Waiting Approval")){
                                
                                if($scope.futureApptList[i].startTime == $scope.futureApptSelectedDate){
                                    cancelRequestInfo.reason="Package Cancellation";
                                }else{
                                    cancelRequestInfo.reason="Package Cancellation ";
                                }

                                cancelRequestInfo.changerequestby="Customer";
                                if($scope.CancelPkgRequest.reasonForPkgCancel != undefined){
                                    cancelRequestInfo.reasonForPkgCancel=$scope.CancelPkgRequest.reasonForPkgCancel;
                                } 
                                
                                spApi.requestAppointmentChange($scope.futureApptList[i].apptid, "cancel",cancelRequestInfo)
                                .success(function(data, status, headers, config) {
                                   // alert("Appointment cancellation request sent successfully!");
                                  
                                })
                                .error(function(data, status, headers, config) {
                                    var error = data.error.message;
                                    //alert("Failed to make appointment cancellation request! " + error);
                                    $scope.checkSessionTimeout(data);
                                });                           
                        }           
                        
                    }
                    alert("Package cancellation request sent successfully!");                   

                }

                if($scope.futureApptSelectedDate == undefined && $scope.futureApptList.length > 0){
                    alert("Please Select Confirmed Appointment For Package cancellation");
                    $scope.requestPackageCancel();
                }


                if($scope.futureApptList.length == 0){

                    var cancelRequestInfo ={"reason":"pkg cancel","changerequestby":"","reasonForPkgCancel":"","patientid":"","spid":""};

                    cancelRequestInfo.changerequestby="Customer";
                    if($scope.CancelPkgRequest.reasonForPkgCancel != undefined){
                        cancelRequestInfo.reasonForPkgCancel=$scope.CancelPkgRequest.reasonForPkgCancel;
                    }

                    cancelRequestInfo.patientid = $scope.patientidForPkgCancel;
                    cancelRequestInfo.spid = $scope.spId;

                    spApi.requestAppointmentChange("0000", "cancel",cancelRequestInfo)
                    .success(function(data, status, headers, config) {
                                           
                    })
                    .error(function(data, status, headers, config) {
                        var error = data.error.message;
                        $scope.checkSessionTimeout(data);
                    });

                }
                

            }

        },
        function(value) {
            console.log("Fail API");
        });
    }

    $scope.getValue = function(value,starttime) {
        $scope.futureApptSelectedDate = value;
        $scope.apptStatus = "";

        for(var i = 0; i < $scope.futureApptList.length; i++){
            if(($scope.futureApptList[i].startTime == $scope.futureApptSelectedDate)){
                $scope.apptStatus = $scope.futureApptList[i].status;
            }
        }

        if($scope.apptStatus != "Cancelled"){
            for(var i = 0; i < $scope.futureApptList.length; i++){
                if(($scope.futureApptList[i].startTime >= $scope.futureApptSelectedDate) && ($scope.futureApptList[i].status != "Cancelled") && ($scope.futureApptList[i].status != "Waiting Approval")){
                  $("."+$scope.futureApptList[i].refno+"").css({"background-color": "#ff0000"});   
                  $("."+$scope.futureApptList[i].refno+"").css({"color": "#ffffff"});                                                
                }                                  
            }
        }
      
    }


    $scope.fetchFutureAppointments = function(patientid) {

        spApi.fetchFutureAppointments(patientid)
            .success(function(data, status, headers, config) {
                $scope.futureApptList = data.payload;  
                $scope.futureApptListCount = $scope.futureApptList.length;
                //console.log($scope.futureApptList);
                //alert($scope.futureApptListCount);
               
            })
            .error(function(data, status, headers, config) {
                console.log("Failed to fetch future appointments!");
            });
    }    

     $scope.fetchPatientWithWallet = function(){
        if($scope.walletTransactionDetails){
            $scope.searchWallet = {};
            $('#aptFromDateWallet').data("DateTimePicker").clear();
            $('#aptTillDateWallet').data("DateTimePicker").clear();
        }
        $scope.walletTransactionDetails = false;

        $scope.currentDate = moment(new Date()).format('DD-MM-YYYY');
        $scope.currentDateWallet = moment(new Date()).format('DD-MM-YYYY');

        spApi.fetchPatientWithWallet()
            .success(function(custData, custStatus, custHeaders, custConfig) {
                //console.log(custData);

                $scope.arrayCustomerWithWallet = custData.payload;
                //console.log($scope.arrayCustomerWithWallet);

            })
            .error(function(data, status, headers, config) {
                item.walletBalance = 0;
            });

    }

    $scope.initPackageView = function(){
        $scope.spId = $cookies.get('u_id');
        $scope.spCity = '';
        $scope.arrPackages = [];
        $scope.arrPromocodes = [];
        //alert($scope.spId);
        spApi.getAllSps().
        success(function (data, status, headers, config) {
            //console.log(data.payload);
            $scope.arrayAllSps = angular.copy(data.payload.spList);
            for(var i = 0 ; i < $scope.arrayAllSps.length ; i++) {
                if($scope.spId == $scope.arrayAllSps[i]._id){
                    $scope.spCity = $scope.arrayAllSps[i].city;
                }
            }

            spApi.getPromo().
            success(function (data, status, headers, config) {

                $scope.arrPromoCode = [];
                $scope.arrPackages = [];
                $scope.arrPromocodes = [];
                $scope.arrCity = [];
                $scope.basePrice = 0;
                var tempArr = data.payload
                console.log("successfully received promo codes");
                angular.copy(tempArr, $scope.arrPromoCode);

                spApi.getCity(true).
                success(function (data, status, headers, config) {
                    $scope.arrCity = data.payload;

                    $scope.arrCity.forEach(function(itemCity) {  
                        if(itemCity.city_name == $scope.spCity){
                          $scope.basePrice = itemCity.price;  
                        }
                    });

                    $scope.arrPromoCode.forEach(function(item) {                  
                    //console.log(item);
                        if(item.is_promocode == false && item.city == $scope.spCity && item.active == true){
                            item.validfrom = moment(new Date(item.validfrom*1000).toString());
                            item.validtill = moment(new Date(item.validtill*1000).toString());
                            item.disctype = item.disctype.toString();
                            item.noofappt = item.noofappt;
                            item.max_sessions = item.max_sessions;
                            item.min_sessions = item.min_sessions;
                            //item.free_cancellation_percent = item.free_cancellation_ratio;
                            item.before_cancellation_time = item.before_cancellation_time;
                            item.valid_days = item.valid_days;
                            item.cancellation_fee = item.cancellation_fee;
                            item.promocode = item.promocode;

                            var discount = item.discount;
                            var perSession = $scope.basePrice - discount;
                            item.perSessionPrice = perSession;

                            var packageCost = parseInt(item.min_sessions) * parseInt(perSession);
                            item.totalPackageCost = packageCost;

                            var free_cancellation_days = (parseInt(item.min_sessions) * parseInt(item.free_cancellation_ratio)) / 100;
                            item.freeCancellationDays = Math.round(free_cancellation_days);

                            $scope.arrPackages.push(item);
                        }

                        if(item.is_promocode == true && item.city == $scope.spCity  && item.active == true){
                            item.promocode = item.promocode;
                            var discount = item.discount;
                            var perSession = $scope.basePrice - discount;
                            item.perSessionPrice = perSession;
                            item.promodesc = item.promodesc;

                            $scope.arrPromocodes.push(item);

                        }              
                   
                    });

                }).
                error(function (data, status, headers, config) {
                    console.log("Error in receiving cities");
                });
         
                console.log($scope.arrPackages);

            }).
            error(function (data, status, headers, config) {
                console.log("Error in receiving promo codes");
            });

        }).
        error(function (data, status, headers, config) {
            console.log("Error in receiving Sps");
        });


    }

    $scope.initDashboard = function(){
        $scope.spId = $cookies.get('u_id');
        $scope.spApptList = [];

        var today = new Date();
        var preDate = new Date(today);
        preDate.setDate(today.getDate() - 3);

        var yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        var tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        var dayBeforeYesterdayDate = Math.round(Date.parse(preDate)/1000);

       spApi.fetchSpAppointments($scope.spId,dayBeforeYesterdayDate)
        .success(function(data, status, headers, config) {
           console.log(data.payload);
          
           var futureAppt = [];
           $scope.latestApptDate = '';
           $scope.patientName = '';
           $scope.todaysConfirmed = 0;
           $scope.todaysCancelled = 0;
           $scope.todaysCompleted = 0;
           $scope.yesterdaysConfirmed = 0;
           $scope.yesterdaysCancelled = 0;
           $scope.yesterdaysCompleted = 0;
           $scope.tomorrowsConfirmed = 0;
           $scope.tomorrowsCancelled = 0;
           $scope.tomorrowsCompleted = 0;

           todaysDate=moment(today).format('DD-MM-YYYY');
           yesterdayDate = moment(yesterday).format('DD-MM-YYYY');
           tomorrowDate = moment(tomorrow).format('DD-MM-YYYY');

           $scope.spApptList = data.payload;
           var todayDate = new Date();
           var todayEpoch = Math.round(todayDate.getTime()/1000);
           //console.log(todayEpoch);
           $scope.spApptList.forEach(function(item) {  
            if(item.startTime > todayEpoch && item.status == 'Confirmed'){
               var start = item.startTime;
               futureAppt.push(item);
            }

            var apptDate = moment(new Date(item.startTime * 1000)).format("DD-MM-YYYY");

            if(item.status == 'Confirmed' && todaysDate == apptDate){
                $scope.todaysConfirmed = $scope.todaysConfirmed + 1;
            }else if(item.status == 'Cancelled' && todaysDate == apptDate){
                $scope.todaysCancelled = $scope.todaysCancelled + 1;
            }else if(item.status == 'Completed' && todaysDate == apptDate){
                $scope.todaysCompleted = $scope.todaysCompleted + 1;
            }

            if(item.status == 'Confirmed' && yesterdayDate == apptDate){
                $scope.yesterdaysConfirmed = $scope.yesterdaysConfirmed + 1;
            }else if(item.status == 'Cancelled' && yesterdayDate == apptDate){
                $scope.yesterdaysCancelled = $scope.yesterdaysCancelled + 1;
            }else if(item.status == 'Completed' && yesterdayDate == apptDate){
                $scope.yesterdaysCompleted = $scope.yesterdaysCompleted + 1;
            }

            if(item.status == 'Confirmed' && tomorrowDate == apptDate){
                $scope.tomorrowsConfirmed = $scope.tomorrowsConfirmed + 1;
            }else if(item.status == 'Cancelled' && tomorrowDate == apptDate){
                $scope.tomorrowsCancelled = $scope.tomorrowsCancelled + 1;
            }else if(item.status == 'Completed' && tomorrowDate == apptDate){
                $scope.tomorrowsCompleted = $scope.tomorrowsCompleted + 1;
            }


           });

           if(futureAppt.length > 0){
               var apptStartTime = futureAppt.map(function(obj) { return obj.startTime; });
               var min = Math.min.apply(null, apptStartTime);
               //console.log(xVals);
               //console.log(min);
               futureAppt.forEach(function(appt){
                if(appt.startTime == min){
                    $scope.latestApptDate = appt.startTime_date;
                    $scope.patientName = appt.apptPatientName;
                }

               });

           }

           /*console.log($scope.latestApptDate);
           console.log($scope.patientName);
           console.log(todaysDate);
           console.log(yesterdayDate);
           console.log(tomorrowDate);
           console.log($scope.tomorrowsConfirmed);
           console.log($scope.tomorrowsCancelled);
           console.log($scope.tomorrowsCompleted);*/
           $scope.getCollection(); 
        })
        .error(function(data, status, headers, config) {
           console.log('Failed to fetch sp appointments!');
        });


        $scope.wrkHrsSlotsForHome = [
            {                           
                "label" :   "07:30 AM - 09:00 AM",
                "slotNo": "1", 
                "startTime": "07:30AM",
                "endTime": "09:00AM"
            },
            {
                "label":    "09:00 AM - 10:30 AM",
                "slotNo": "2", 
                "startTime": "09:00AM",
                "endTime": "10:30AM"
            },
            {
                "label":    "10:30 AM - 12:00 PM",  
                "slotNo": "3", 
                "startTime": "10:30AM",
                "endTime": "12:00PM"                    
            },
            {
                "label":    "12:00 PM - 13:30 PM",
                "slotNo": "4", 
                "startTime": "12:00PM",
                "endTime": "13:30PM"
            },
            {
                "label":    "15:00 PM - 16:30 PM",  
                "slotNo": "5",  
                "startTime": "15:00PM",
                "endTime": "16:30PM"
            },
            {
                "label":    "16:30 PM - 18:00 PM",
                "slotNo": "6", 
                "startTime": "16:30PM",
                "endTime": "18:00PM"
            },
            {
                "label":    "18:00 PM - 19:30 PM",  
                "slotNo": "7", 
                "startTime": "18:00PM",
                "endTime": "19:30PM"                    
            },
            {
                "label":    "19:30 PM - 21:00 PM",
                "slotNo": "8", 
                "startTime": "19:30PM",
                "endTime": "21:00PM"                            
            }
        ];


        $scope.weekNumber = moment().week();
        //console.log($scope.weekNumber);

        var weekday1 = moment().week($scope.weekNumber).startOf('isoweek');
        var weekday2 = moment().week($scope.weekNumber).startOf('week').add(7, 'days');

        var weekDate1 = weekday1._d;
        var date1 = moment(weekDate1).format('DD-MMM-YYYY');
        var d1 = new Date(weekDate1);
        var dateEpoch1 = Math.round(d1.getTime()/1000);

        var weekDate2 = weekday2._d;
        var d2 = new Date(weekDate2);
        var dateEpoch2 = Math.round(d2.getTime()/1000);

        var day1 = moment(weekDate1).format('ddd');

        $scope.weekDays =[];
        $scope.weekDays.push({
            'Date': date1,
            'DateEpoch': dateEpoch1,
            'Day' : day1
        });
     
        for(var i =2;i<=7;i++){
            var weekday = moment().week($scope.weekNumber).startOf('week').add(i, 'days');

            var weekDate = weekday._d;
            var date = moment(weekDate).format('DD-MMM-YYYY');
            var d = new Date(weekDate);
            var dateEpoch = Math.round(d.getTime()/1000);
            var day = moment(weekDate).format('ddd');
            $scope.weekDays.push({
                'Date': date,
                'DateEpoch': dateEpoch,
                'Day' : day
            });
        }
        //console.log($scope.weekDays);

        $scope.loadSlotView($scope.spId,dateEpoch1,dateEpoch2);

    }

    $scope.loadSlotView = function(spid,start,end){
        spApi.getSpWeeklySlot(spid,start,end)
        .success(function(data, status, headers, config) {
           
            $scope.spWeeklySlots = data.payload;
            if($scope.spWeeklySlots.length > 0){
              $scope.spWeeklySlots.forEach( function(item){
                   for(var i = 0 ; i < $scope.wrkHrsSlotsForHome.length; i++){
                    for(var j = 0 ; j < $scope.weekDays.length; j++){
                        var td = $scope.wrkHrsSlotsForHome[i].startTime+"_"+$scope.weekDays[j].DateEpoch;
                        var start = (($scope.wrkHrsSlotsForHome[i].startTime).substring(0, 5)).replace(":","");

                        if(start == item.startTime && $scope.weekDays[j].DateEpoch == item.date){

                                if(item.is_weeklyOff == true){
                                    document.getElementById(td).style.backgroundColor = 'yellow';
                                   
                                }

                                if(item.is_leave == true){
                                    document.getElementById(td).style.backgroundColor = 'red';
                                }

                                if(item.is_leave == false && item.is_allocated == true){
                                    document.getElementById(td).style.backgroundColor = '#2fca2c'; //green
                                }

                                if(item.is_blocked == true){
                                    document.getElementById(td).style.backgroundColor = '#c1bfbb'; //grey
                                }

                        }
                    }
                   }

                });
            }
        })
        .error(function(data, status, headers, config) {
            console.log('Fail to fetch sp slots!');
        });
    }

    $scope.showNextSlotView = function(){
        $scope.spId = $cookies.get('u_id');

        $scope.weekNumber = $scope.weekNumber + 1;
        var weekday1 = moment().week($scope.weekNumber).startOf('isoweek');
        var weekday2 = moment().week($scope.weekNumber).startOf('week').add(7, 'days');

        var weekDate1 = weekday1._d;
        var date1 = moment(weekDate1).format('DD-MMM-YYYY');
        var d1 = new Date(weekDate1);
        var dateEpoch1 = Math.round(d1.getTime()/1000);

        var weekDate2 = weekday2._d;
        var d2 = new Date(weekDate2);
        var dateEpoch2 = Math.round(d2.getTime()/1000);

        var day1 = moment(weekDate1).format('ddd');

        $scope.weekDays =[];
        $scope.weekDays.push({
            'Date': date1,
            'DateEpoch': dateEpoch1,
            'Day' : day1
        });
     
        for(var i =2;i<=7;i++){
            var weekday = moment().week($scope.weekNumber).startOf('week').add(i, 'days');

            var weekDate = weekday._d;
            var date = moment(weekDate).format('DD-MMM-YYYY');
            var d = new Date(weekDate);
            var dateEpoch = Math.round(d.getTime()/1000);
            var day = moment(weekDate).format('ddd');
            $scope.weekDays.push({
                'Date': date,
                'DateEpoch': dateEpoch,
                'Day' : day
            });
        }
       // console.log($scope.weekDays);
       $scope.loadSlotView($scope.spId,dateEpoch1,dateEpoch2);

    }

    $scope.showPreviousSlotView = function(){
        $scope.spId = $cookies.get('u_id');

        $scope.weekNumber = $scope.weekNumber - 1;
        var weekday1 = moment().week($scope.weekNumber).startOf('isoweek');
        var weekday2 = moment().week($scope.weekNumber).startOf('week').add(7, 'days');

        var weekDate1 = weekday1._d;
        var date1 = moment(weekDate1).format('DD-MMM-YYYY');
        var d1 = new Date(weekDate1);
        var dateEpoch1 = Math.round(d1.getTime()/1000);

        var weekDate2 = weekday2._d;
        var d2 = new Date(weekDate2);
        var dateEpoch2 = Math.round(d2.getTime()/1000);

        var day1 = moment(weekDate1).format('ddd');

        $scope.weekDays =[];
        $scope.weekDays.push({
            'Date': date1,
            'DateEpoch': dateEpoch1,
            'Day' : day1
        });
     
        for(var i =2;i<=7;i++){
            var weekday = moment().week($scope.weekNumber).startOf('week').add(i, 'days');

            var weekDate = weekday._d;
            var date = moment(weekDate).format('DD-MMM-YYYY');
            var d = new Date(weekDate);
            var dateEpoch = Math.round(d.getTime()/1000);
            var day = moment(weekDate).format('ddd');
            $scope.weekDays.push({
                'Date': date,
                'DateEpoch': dateEpoch,
                'Day' : day
            });
        }
        //console.log($scope.weekDays);
        $scope.loadSlotView($scope.spId,dateEpoch1,dateEpoch2);
       
    }

    $scope.getWalletHistory = function(rec){
        $scope.walletTransactionDetails = true;
        $scope.customerName = rec.name;
        $scope.spIdForWallet = rec._id;

         spApi.getWalletHistory(rec._id)
            .success(function(Data, Status, Headers, Config) {
        
                $scope.arrayWalletHistory = Data.payload;
                //console.log($scope.arrayWalletHistory);

                var arrayWalletHistory = Data.payload;
                $scope.arrayWalletData = [];
                $scope.arrayWalletDataTrans = [];
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
                    $scope.arrayWalletData.push(item);
                    $scope.arrayWalletDataTrans.push(item);
                });

                //console.log($scope.arrayWalletData);

            })
            .error(function(data, status, headers, config) {
                item.walletBalance = 0;
            });
    }


    $scope.generateWalletTransactions = function() {

        //console.log($scope.spIdForWallet);
        var arrayWalletDataTemp = [];

        var fromDtWallet = getEpochDate($('#aptFromDateWallet').val());
        var tillDtWallet = getEpochDate($('#aptTillDateWallet').val());
        var fromDateWallet = moment(new Date(fromDtWallet * 1000)).format("DD-MM-YYYY");
        var toDateWallet = moment(new Date(tillDtWallet * 1000)).format("DD-MM-YYYY");

        //console.log(fromDtWallet);
        //console.log(tillDtWallet);

        arrayWalletDataTemp = $scope.arrayWalletDataTrans;
        $scope.currentDateWallet = toDateWallet;

        $scope.arrayWalletData = [];
        $scope.asOfBalance = 0;

        arrayWalletDataTemp.forEach(function(item) {
            //console.log(item);
            // Converting Date and time only Date
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
                $scope.arrayWalletData.push(item);
            }
        });

        //console.log($scope.arrayWalletData);

    }

    $scope.getCollection = function() {
        $scope.arrayCollection = [];
        $scope.collectionTotal = 0;

        spApi.getCollection().
        success(function (data, status, headers, config) {
            var arrStoreTrue = [];
            var arrStoreTrue = data.payload;
            console.log("successfully received collections request.");
            arrStoreTrue.forEach(function(item) {
                if($cookies.get('u_id') == item.service_provider_id && item.trans_type != "debit"){
                    var today = moment(new Date()).format('YYYYMMDD');
                    var alert_date = moment(new Date(item.trans_date * 1000)).add(item.finance_alert_days, 'days').format("YYYYMMDD");
                    item.alert_to_finance = false;
                    if(today >= alert_date){
                        item.alert_to_finance = true;
                    }
                    item.orignal_trans_date = item.trans_date;
                    item.trans_date = moment(new Date(item.trans_date * 1000)).format("DD-MM-YYYY hh:mm A");
                    $scope.arrayCollection.push(item);
                    $scope.collectionTotal = $scope.collectionTotal + item.trans_amount;
                }
         
            });
            //alert($scope.collectionTotal);
            console.log($scope.arrayCollection);
        }).
        error(function (data, status, headers, config) {
            console.log("Error in receiving package cancellation request.");
        });
    };


    $scope.requestApptRescheduleClicked = function() {
        $scope.flags.showRescheduleAppt = true;
        $scope.getSpMonthlyAppointmentAvailability();
        $scope.spInfo = false;
        $scope.spNewAppointment.aptstarttime = "";
        $scope.scrollDiv('rescheduleAppt');
    }

    $scope.requestApptReschedule = function(test) {
        //console.log(test);
        var newTime =  { "proposedTime" : getAppointmentEpochTimes()[0],"reason" :test.reason,"changerequestby":test.requester};

        spApi.requestAppointmentChange($scope.adminNewAppointmentCust.appointment._id, "reschedule", newTime)
        .success(function(data, status, headers, config) {
            alert("Appointment rescheduling request sent successfully!");
        })
        .error(function(data, status, headers, config) {
            var error = data.error.message;
            alert("Failed to make appointment rescheduling request! " + error);
            $scope.checkSessionTimeout(data);
        });

        $scope.flags.showRescheduleAppt = false;
        $scope.scrollDiv('apptSection');
    }

    $scope.getTimestamp = function() {
        return new Date().getTime();
    }

    $scope.emailLifeStyleInfo = function() {
        var shorttermgoals = null;
        if($scope.adminNewAppointmentCust.appointment.document.goalsettings == undefined || $scope.adminNewAppointmentCust.appointment.document.goalsettings.shorttermgoals == undefined || $scope.adminNewAppointmentCust.appointment.document.goalsettings.shorttermgoals.length == 0) {
            shorttermgoals = "";
        } else {
            shorttermgoals = $scope.adminNewAppointmentCust.appointment.document.goalsettings.shorttermgoals;
        }

        var longtermgoals = null;
        if($scope.adminNewAppointmentCust.appointment.document.goalsettings == undefined || $scope.adminNewAppointmentCust.appointment.document.goalsettings.longtermgoals == undefined || $scope.adminNewAppointmentCust.appointment.document.goalsettings.longtermgoals.length == 0) {
            longtermgoals = "";
        } else {
            longtermgoals = $scope.adminNewAppointmentCust.appointment.document.goalsettings.longtermgoals;
        }

        var dosages = null;
        if($scope.adminNewAppointmentCust.appointment.document.treatment == undefined || $scope.adminNewAppointmentCust.appointment.document.treatment.dosages == undefined || $scope.adminNewAppointmentCust.appointment.document.treatment.dosages.length == 0) {
            dosages = "";
        } else {
            dosages = $scope.adminNewAppointmentCust.appointment.document.treatment.dosages;
        }

        var proposedprogression = null;
        if($scope.adminNewAppointmentCust.appointment.document.treatment == undefined || $scope.adminNewAppointmentCust.appointment.document.treatment.proposedprogression == undefined || $scope.adminNewAppointmentCust.appointment.document.treatment.proposedprogression.length == 0) {
            proposedprogression = "";
        } else {
            proposedprogression = $scope.adminNewAppointmentCust.appointment.document.treatment.proposedprogression;
        }

        var lifestylechanges = null;
        if($scope.adminNewAppointmentCust.appointment.document.treatment == undefined || $scope.adminNewAppointmentCust.appointment.document.treatment.lifestylechanges == undefined || $scope.adminNewAppointmentCust.appointment.document.treatment.lifestylechanges.length == 0) {
            lifestylechanges = "";
        } else {
            lifestylechanges = $scope.adminNewAppointmentCust.appointment.document.treatment.lifestylechanges;
        }

        var nosessionswithfrequency = null;
        if($scope.adminNewAppointmentCust.appointment.document.treatment == undefined || $scope.adminNewAppointmentCust.appointment.document.treatment.nosessionswithfrequency == undefined || $scope.adminNewAppointmentCust.appointment.document.treatment.nosessionswithfrequency.length == 0) {
            nosessionswithfrequency = "";
        } else {
            nosessionswithfrequency = $scope.adminNewAppointmentCust.appointment.document.treatment.nosessionswithfrequency;
        }

        var data = {
            "cust_name": $scope.adminNewAppointmentCust.customer.name,
            "cust_email": $scope.adminNewAppointmentCust.customer.email,
            "sp_name": $scope.adminNewAppointmentCust.sp.name,
            "short_term_goals": shorttermgoals,
            "long_term_goals": longtermgoals,
            "treatment_dosages": dosages,
            "treatment_progression_proposed": proposedprogression,
            "treatment_HEP_lifestyle_modifications": lifestylechanges,
            "treatment_number_of_sessions": nosessionswithfrequency
        };

        spApi.emailLifeStyleInformation($scope.adminNewAppointmentCust.customer.healyoscustid, data)
        .success(function(data, status, headers, config) {
            alert("Lifestyle Information sent successfully!");
        })
        .error(function(data, status, headers, config) {
            alert(data.error.message);
            $scope.checkSessionTimeout(data);
        });
    };

    $scope.checkSessionTimeout = function(obj) {
        if(obj.error.errorCode == 3238133787 ) {
            var cookies = $cookies.getAll();
            angular.forEach(cookies, function (v, k) {
                $cookies.remove(k);
            });
            $scope.$root.$broadcast('navigatetoHomeSp');
        }
    };

    $scope.applyPromocodeFollowUpAppt = function () {
        $scope.applyPromoResponseFollowUp = {};
        $scope.promoSuccessFollowUp = false;
        $scope.promoErrorFollowUp = false;

        var dateInst = $scope.obj.dt;
        var year = dateInst.getFullYear();
        var month = dateInst.getMonth();
        var day = dateInst.getDate();

        //get selected apt start time  - hour and minute
        var aptst = $scope.spNewAppointment.aptstarttime;
        var apth = aptst.substring(0,2);
        var aptm = aptst.substring(2,4);

        //From epoch time
        var fromdate = new Date(year, month, day);
        fromdate.setHours(apth);
        fromdate.setMinutes(aptm);
        var myEpochfromtime = fromdate.getTime()/1000.0;

        //To epoch time
        var todate = new Date(year, month, day);
        todate.setTime(fromdate.getTime() + 90*60*1000);
        var myEpochtotime = todate.getTime()/1000.0;


        var dataObj = {
            "promocode": $scope.spNewAppointment.promocode,
            "apptid": "",
            "pincode": $scope.custPincode,
            "cityid": $scope.custCityId,
            "custname": $scope.custName,
            "problem": $scope.custProb,
            "apptslots": $scope.spNewAppointment.selectedTimeSlots,
            // "apptstarttime": myEpochfromtime,
            // "apptendtime": myEpochtotime,
            "serviceid": $scope.serviceIdInst
        };

        spApi.applyPromocode(dataObj).
        success(function (data, status, headers, config) {
            var currency1 = data.payload.currency;
            var finalcost1 = data.payload.finalcost;
            var originalcost1 = data.payload.originalcost;
            var promocode1 = data.payload.promocode;
            var promocodeId1 = data.payload.promocodeid;

            $scope.applyPromoResponseFollowUp = {
                "currency": currency1,
                "finalcost": finalcost1,
                "originalcost": originalcost1,
                "promocode": promocode1,
                "promocodeid": promocodeId1
            };

            $scope.promoSuccessFollowUp = "Promotional code accepted. Discounted total charges are: " + currency1 + " " + data.payload.totalCharges + ". Per appointment charges are: " + currency1 + " " + data.payload.finalcost + ".";
            $scope.promoErrorFollowUp = false;
        }).
        error(function (data, status, headers, config) {
            $scope.promoSuccessFollowUp = false;
            $scope.promoErrorFollowUp = data.error.message;
            $scope.applyPromoResponseFollowUp = {
                "currency": "",
                "finalcost": "",
                "originalcost": "",
                "promocode": "",
                "promocodeid": ""
            };
        });
    }

    $scope.resetPromoCodeFollowUp = function () {
        $scope.spNewAppointment.promocode = "";

        $scope.applyPromoResponseFollowUp = {
            "currency": "",
            "finalcost": "",
            "originalcost": "",
            "promocode": "",
            "promocodeid": ""
        };
        $scope.promoSuccessFollowUp = false;
        $scope.promoErrorFollowUp = false;
    }

    $scope.resetPromoCodePaymentSection = function () {
        $scope.apptPaymentErrorMsg = "";
        $scope.aptPayment.currency = "INR";
        $scope.aptPayment.type = "Wallet";
        $scope.aptPayment.sptype = "Wallet";
       // $scope.aptPayment.amnt = "0";

        if($scope.adminNewAppointmentCust.appointment.additionalcharge>0){
            $scope.aptPayment.amnt = $scope.adminNewAppointmentCust.appointment.finalcost + $scope.adminNewAppointmentCust.appointment.additionalcharge;
        }else{
            $scope.aptPayment.amnt = $scope.adminNewAppointmentCust.appointment.finalcost;
        }


        $scope.aptPayment.additionalSpAmnt = "0";
        $scope.aptPayment.additionalSpAmntDesc = "";
        $scope.aptPayment.paymentModes = [];
        $scope.aptPayment.promocodeid = "";
        $scope.aptPayment.promocode = "";

        $scope.applyPromoResponsePaymentSection = {
            "currency": "",
            "finalcost": "",
            "originalcost": "",
            "promocode": "",
            "promocodeid": ""
        };
        $scope.promoSuccessPaymentSection = false;
        $scope.promoErrorPaymentSection = false;
    }

    $scope.applyPromocodePaymentSection = function () {
        $scope.applyPromoResponsePaymentSection = {};
        $scope.promoSuccessPaymentSection = false;
        $scope.promoErrorPaymentSection = false;

        var time = [];
        if($scope.adminNewAppointmentCust.aptstarttime == undefined || $scope.adminNewAppointmentCust.aptstarttime == "" || $scope.adminNewAppointmentCust.aptstarttime == false) {
            time = [$scope.adminNewAppointmentCust.appointment.starttime, $scope.adminNewAppointmentCust.appointment.endtime];
        }
        else {
            time = getAptEditTime($scope.adminNewAppointmentCust.aptstarttime, $scope.editAptModel.date);
        }



        var apptslot = moment(new Date(time[0] * 1000)).format("YYYY-MM-DD hh:mm A");

        var dataObj = {
            "promocode": $scope.aptPayment.promocode,
            "apptid": $scope.adminNewAppointmentCust.appointment._id,
            "pincode": $scope.adminNewAppointmentCust.appointment.pincode,
            "cityid": $scope.adminNewAppointmentCust.appointment.cityid,
            "custname": $scope.adminNewAppointmentCust.customer.name,
            "problem": $scope.adminNewAppointmentCust.customer.problem,
            "patientid": $scope.adminNewAppointmentCust.appointment.patientid,
            "apptslots": [apptslot],
            // "apptstarttime": time[0],
            // "apptendtime": time[1],
            "serviceid": $scope.adminNewAppointmentCust.appointment.serviceid
        };

        spApi.applyPromocode(dataObj).
        success(function (data, status, headers, config) {
            var currency1 = data.payload.currency;
            var finalcost1 = data.payload.finalcost;
            var originalcost1 = data.payload.originalcost;
            var promocode1 = data.payload.promocode;
            var promocodeId1 = data.payload.promocodeid;

            $scope.applyPromoResponsePaymentSection = {
                "currency": currency1,
                "finalcost": finalcost1,
                "originalcost": originalcost1,
                "promocode": promocode1,
                "promocodeid": promocodeId1
            };
            var addtionalchargeMsg = "";
            if ($scope.adminNewAppointmentCust.appointment.additionalcharge > 0){
                var totalincludingAdditionalCharge = $scope.adminNewAppointmentCust.appointment.additionalcharge + finalcost1;
                addtionalchargeMsg = "\n Total cost including additional charges: "+totalincludingAdditionalCharge+ " " + currency1;
            }
            $scope.promoSuccessPaymentSection = "Promotional code accepted. \nDiscounted charges: " + finalcost1 + " " + currency1+addtionalchargeMsg;
            $scope.promoErrorPaymentSection = false;
            
            if(finalcost1 > 0){
                $scope.applypromocost=finalcost1;
            }else{
                 $scope.applypromocost='';
            }

            if($scope.applypromocost != 'undefined'){

               /* if($scope.applypromocost != 'undefined' && $scope.adminNewAppointmentCust.appointment.additionalcharge >0){
                    $scope.aptPayment.amnt = $scope.applypromocost + $scope.adminNewAppointmentCust.appointment.additionalcharge;

                    var addition;
                    addition =$scope.applypromocost + $scope.adminNewAppointmentCust.appointment.additionalcharge;
                    $scope.calculatedAptAmount = $scope.applypromocost +" + "+ $scope.adminNewAppointmentCust.appointment.additionalcharge +" = "+ addition;
                }else{
                    $scope.aptPayment.amnt = $scope.applypromocost;
                    $scope.calculatedAptAmount = $scope.applypromocost;
                }*/

                 $scope.aptPayment.amnt = $scope.applypromocost;
                 $scope.calculatedAptAmount = $scope.applypromocost;
                
            }else{
                if($scope.adminNewAppointmentCust.appointment.additionalcharge>0){
                    $scope.aptPayment.amnt = $scope.adminNewAppointmentCust.appointment.finalcost + $scope.adminNewAppointmentCust.appointment.additionalcharge;

                    var tot;
                    tot = $scope.adminNewAppointmentCust.appointment.finalcost + $scope.adminNewAppointmentCust.appointment.additionalcharge;
                    $scope.calculatedAptAmount = $scope.adminNewAppointmentCust.appointment.finalcost +" + "+ $scope.adminNewAppointmentCust.appointment.additionalcharge +" = "+ tot;

                }else{
                    $scope.aptPayment.amnt = $scope.adminNewAppointmentCust.appointment.finalcost;
                    $scope.calculatedAptAmount = $scope.adminNewAppointmentCust.appointment.finalcost
                }
            }

            
        }).
        error(function (data, status, headers, config) {
            $scope.promoSuccessPaymentSection = false;
            $scope.promoErrorPaymentSection = data.error.message;
            $scope.applyPromoResponsePaymentSection = {
                "currency": "",
                "finalcost": "",
                "originalcost": "",
                "promocode": "",
                "promocodeid": ""
            };
        });
    }

    $scope.showPromocodeInfoInSp = function() {
        /*if(($scope.adminNewAppointmentCust.appointment != undefined) && ($scope.adminNewAppointmentCust.appointment.promocode != undefined) && ($scope.adminNewAppointmentCust.appointment.promocode.trim().length > 0)) {
            if(($scope.adminNewAppointmentCust.appointment.finalcost != undefined) && ($scope.adminNewAppointmentCust.appointment.finalcost >= 0)) {
                return true;
            }
        }
        return false;*/
        return false;
    }

    $scope.onWalletTransact = function(transType) {

        if(transType == "debit") {
            $scope.custReadList.custwallet.response = {
                status: "error",
                message: "Physio does not have withdrawal permission"
            }
            $timeout(function() {
                delete $scope.custReadList.custwallet.response;
            }, 5000);
            return;
        }
        
        /*angular.forEach($scope.custReadList,function(item,key){
            console.log(key+'~~'+item);
        });*/

        var data = {
            "walletAmount": $scope.custReadList.custwallet.amount,
            "walletTransType": transType,
            "currency":"INR",
            "description":$scope.custReadList.custwallet.description,
            "createdById":spApi.getSpid(),
            "createdByName":spApi.getSpname(),
            "apptId":"",
            "city":$scope.custReadList.city,
            "cityId":$scope.custReadList.cityid,

        }

        spApi.walletTransact($scope.custReadList._id, data)
        .success(function(data, status, headers, config) {
            if(data.error == undefined && data.payload != undefined) {
                $scope.custReadList.custwallet = data.payload.custwallet;
                $scope.custReadList.custwallet.response = {
                    status: "success",
                    message: "Wallet updated successfully!"
                }
                $timeout(function() {
                    delete $scope.custReadList.custwallet.response;
                }, 5000);
            }
        })
        .error(function(data, status, headers, config) {
            console.log("Failed to update the wallet transaction!");
            $scope.custReadList.custwallet.response = {
                status: "error",
                message: "Wallet updation failed!"
            }
            $timeout(function() {
                delete $scope.custReadList.custwallet.response;
            }, 5000);
        });
    }

    $scope.addTimeSlot = function() {

        $scope.aptSlotCount = $scope.aptSlotCount + 1;

        if($scope.obj.dt && $scope.spNewAppointment.aptstarttime && $scope.spInfo) {
            var date = moment($scope.obj.dt).format("YYYY-MM-DD");
            var time = "";
            var hr = parseInt($scope.spNewAppointment.aptstarttime.substring(0, 2));
            var aa = "PM";
            if(hr < 12) {
                aa = "AM";
                time = $scope.spNewAppointment.aptstarttime.substring(0, 2) + ":" + 
                    $scope.spNewAppointment.aptstarttime.substring(2, 4) + " " + aa;
            } else {
                hr = (hr == 12) ? 12 : (hr - 12);
                if(hr < 10) {
                    hr = "0" + hr;
                }
                time = hr + ":" + $scope.spNewAppointment.aptstarttime.substring(2, 4) + " " + aa;
            }
            var slot = date + " " + time;
            if($scope.spNewAppointment.selectedTimeSlots.indexOf(slot) == -1) {
                $scope.spNewAppointment.selectedTimeSlots.push(slot);
            } else {
                alert("Selected Appointment Slot is already added in the list.");
                $scope.aptSlotCount = $scope.aptSlotCount - 1;
            }
        }

        var selectedatetimeslot = moment(new Date($scope.spNewAppointment.selectedTimeSlots)).format("YYYY-MM-DD");
        var selecteddateslot =  moment(selectedatetimeslot, 'YYYY-MM-DD').unix();
        var validtilltimeslot =  moment($scope.packageValidTillDate, 'YYYY-MM-DD').unix();
        //console.log($scope.original_costFollowUp+'~'+);
        if(selecteddateslot>validtilltimeslot){
           $scope.costFollowUp = $scope.original_costFollowUp;
        }else{
           $scope.costFollowUp = $scope.discounted_costFollowUp;
        }

        if($scope.aptSlotCount > 0 && $scope.custLeftPackageSeesion > 0 && $scope.aptSlotCount == $scope.custLeftPackageSeesion){
            $scope.aptSlotFlag = true;
        }else{
            $scope.aptSlotFlag = false;
        }

      
    }

    $timeout(function(){
        $('.dateTimePicker').datetimepicker({
            format: 'YYYY-MM-DD'
        });
    });

    $scope.removeTimeSlot = function() {


        $scope.aptSlotCount = $scope.aptSlotCount - 1;
        if($scope.aptSlotCount > 0 && $scope.custLeftPackageSeesion > 0 && $scope.aptSlotCount == $scope.custLeftPackageSeesion){
            $scope.aptSlotFlag = true;
        }else{
            $scope.aptSlotFlag = false;
        }
       
        var index = -1;
        if($scope.spNewAppointment.selectedSlot) {
            for(var i=0; i<$scope.spNewAppointment.selectedTimeSlots.length; i++) {
                var slot = $scope.spNewAppointment.selectedTimeSlots[i];
                if(slot.date === $scope.spNewAppointment.selectedSlot.date && 
                    slot.time === $scope.spNewAppointment.selectedSlot.time) {
                    index = i;
                    break;
                }
            }
        }
        if(index != -1) {
            $scope.spNewAppointment.selectedTimeSlots.splice(index, 1);
            $scope.spNewAppointment.selectedSlotIndex = -1;
            $scope.spNewAppointment.selectedSlot = null;
        }

    }

 });