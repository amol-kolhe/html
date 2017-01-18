
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
    
    $scope.largeImage = "";
    $scope.spApts = {time : 'today'};
    $scope.currentOpenView = "LISTING";
    $scope.serviceIdInst;
    $scope.spInfo = false;
    var availableDate = [];
    $scope.locationArr = [];
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
    $scope.paymentModesSp = ["Cash", "Wallet"];
    $scope.apptPayment = {};
    $scope.apptPackage = {};
    $scope.apptPackage.packageForm = "";
    $scope.aptPackage = {
        package_id : "",
        package_code : "",
        no_of_sessions : "",
        min_sessions : "",
        max_sessions : "",
        net_amount : "",
        temp_net_amount : "",
        additional_amount : 0,
    };
    $scope.test = "";
    $scope.apptPackageError = "";
    $scope.custTotalAppt = 0;
    $scope.custPackageTotalAppt = 0;
    $scope.apptPayment.paymentForm = "";
    $scope.aptPayment = {
        currency : "INR",
        type : "Wallet",
        sptype : "Wallet",
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
        response: null
    };

    $scope.initSpAppointments = function(timeSpan) {
        $scope.fetchSpAppointments(timeSpan);
    }

    $scope.initCache = function() {
        spApi.getCities("India")
            .success(function(data, status, headers, config){
                cache.cityToIdMap = buildCitiesToIdMap(data.payload);
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
                            "refNo": apt.appointment.refno,
                            "id": apt.appointment._id,
                            "scheduledon": apt.appointment.starttime,
                            "sdate" : moment(new Date(apt.appointment.starttime * 1000)).format("YYYY-MM-DD hh:mm A"),
                            "custid": apt.appointment.custid,
                            "customername": apt.customer.name,
                            "customercontact": apt.customer.phone,
                            "status": appointmentStateMap[apt.appointment.state]
                        }
                    );
                });
            }
            $scope.spAppointmentList = appList;
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
            console.log(data);
            angular.copy(tempArr, $scope.models.packagecodes);
            $scope.models.packagecodes.forEach(function(item) {
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
        
        spApi.getCustomerDetails(appointment.custid)
        .success(function(data, status, headers, config){
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
                }
            } else {
                console.log("error");
            }
            $scope.custAptHistory = appointmentHistory;
            if($scope.custPackageTotalAppt >= data.payload.customer.no_of_sessions){
                $scope.custLeftPackageSeesion = 0
            }else{
                $scope.custLeftPackageSeesion = data.payload.customer.no_of_sessions - $scope.custPackageTotalAppt;
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
        $scope.custPackageTotalAppt = 0;
        spApi.getCustomerDetails(appointment.custid)
        .success(function(data, status, headers, config){
            $scope.custOldPackage = {
                package_id : data.payload.customer.package_id,
                package_code : data.payload.customer.package_code,
                no_of_sessions : data.payload.customer.no_of_sessions,
                is_package_assign : data.payload.customer.is_package_assign,
            };
            $scope.currentOpenView = "CUSTOMER";
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
                }
            } else {
                console.log("error");
            }
            $scope.custAptHistory = appointmentHistory;
            if($scope.custPackageTotalAppt >= data.payload.customer.no_of_sessions){
                $scope.custLeftPackageSeesion = 0
            }else{
                if(data.payload.customer.no_of_sessions > 0)
                    $scope.custLeftPackageSeesion = data.payload.customer.no_of_sessions - $scope.custPackageTotalAppt;
                else
                    $scope.custLeftPackageSeesion = 0
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

                console.log(spNewApptForCustObj);
    
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
                $scope.costFollowUp = data.payload.appointment.cost;
                $scope.currFollowUp = data.payload.appointment.currency;

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
                $scope.patientid = data.payload.appointment.patientid;
                if(data.payload.customer.additional_amount){
                    $scope.additional_amount = parseFloat(data.payload.customer.additional_amount);
                }else{
                    $scope.additional_amount = 0;
                }
                   
                if(data.payload.customer.is_package_assign){
                    $scope.is_package_assign = data.payload.customer.is_package_assign;
                }else{
                    $scope.is_package_assign = false;
                }    

                
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

            var url = "/healyos-pdt/hrest/v1/appt/calmon/" + yyyymmDate + "?apikey=" + apiKeyInst + "&sid=" + sidInst + "&role=" + roleInst + "&pincode=" + pincode + "&zoneid=" + zoneid + "&serviceid=" + serviceId; //b24abc5e-ac43-86d4-5a83-aa1807fde79b";

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

        spApi.getSpInfo(serviceDate, zoneid, servid, pin)
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
                "additional_amount":$scope.additional_amount
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
            //"additionalchargedesc":$scope.spNewAppointment.addchargedesc,
            "package_code":package_code,
            "package_id":package_id,
            "patientid":$scope.patientid,

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
                $scope.frm.submit = "Thank you for confirming appointment. Appointment reference number is " + refnos[0];
            } else {
                $scope.frm.submit = "Thank you for confirming appointments. Appointment reference numbers are " + refnos.join(", ");
            }
            $scope.spNewApptForCustErrorMsg = "";
            $scope.showDatepicker = false;
            $scope.showAddressComments = false;
        })
        .error(function(data, status, headers, config) {
            //$scope.showDatepicker = false;
            //$scope.showAddressComments = false;
            $scope.spNewApptForCustErrorMsg = data.error.message;
            $scope.checkSessionTimeout(data);
        });
    }

    $scope.addPaymentMode = function() {

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
                    description:$scope.aptPayment.additionalSpAmntDesc,
                });
            }

            //$scope.aptPayment.additionalSpAmnt = 0;
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
        if($scope.apptPackage.packageForm.additional_amount.$valid && $scope.apptPackage.packageForm.no_of_sessions.$valid && $scope.aptPackage.no_of_sessions >= $scope.aptPackage.min_sessions && $scope.aptPackage.no_of_sessions <= $scope.aptPackage.max_sessions)
        {
            if($scope.custReadList.custwallet.walletbalance >= $scope.aptPackage.net_amount)
            {
                var data = {
                    appt_id : $scope.adminNewAppointmentCust.appointment._id,
                    package_id: $scope.aptPackage.package_id,
                    package_code: $scope.aptPackage.package_code,
                    no_of_sessions: $scope.aptPackage.no_of_sessions,
                    additional_amount: $scope.aptPackage.additional_amount
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

            }else{
                if(!$scope.custOldPackage.is_package_assign && $scope.custOldPackage.package_id == $scope.aptPackage.package_id && $scope.custOldPackage.package_code == $scope.aptPackage.package_code){
                    
                    if($scope.custReadList.custwallet.walletbalance >= $scope.aptPackage.temp_net_amount)
                    {
                        var data = {
                            appt_id : $scope.adminNewAppointmentCust.appointment._id,
                            package_id: $scope.aptPackage.package_id,
                            package_code: $scope.aptPackage.package_code,
                            no_of_sessions: $scope.aptPackage.no_of_sessions,
                            additional_amount: $scope.aptPackage.additional_amount
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

                    }else{
                        $scope.apptPackageError = "Customer does't have enough credit in wallet.";
                    }
                }else{
                    $scope.apptPackageError = "Customer does't have enough credit in wallet.";
                }
            }
        }else{
            $scope.apptPackageError = "No. of Sessions must be in a range of package.";
        }
    }

    $scope.calculateCost = function() {
        $scope.models.response = null;
        var data = {
            massnoofappt: $scope.aptPackage.no_of_sessions,
            serviceid: $scope.models.service.id,
            promocode: $scope.models.calculator.package,
        };
        
        spApi.calculateApptCharges(data).
        success(function (data, status, headers, config) {
            if(data && data.payload) {
                $scope.models.response = data.payload;
                $scope.aptPackage.net_amount = $scope.models.response.netTotalCharges;
                $scope.aptPackage.temp_net_amount = parseInt($scope.models.response.netTotalCharges / 2);
                $scope.models.response.showResponse = true;
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
        $scope.models.response.showResponse = false;
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

        var data = {
            appointmentid: $scope.aptPayment.appointmentid,
            promocodeid: $scope.aptPayment.promocodeid,
            promocode: $scope.aptPayment.promocode,
            paymentmodes: $scope.aptPayment.paymentModes,
            promocost:$scope.applypromocost,
            additionalchargespdesc:$scope.aptPayment.additionalSpAmntDesc
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
        $scope.models.response.showResponse = false;
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
            $timeout(function() {
                console.log('function called recursively');
                $scope.getLocalityFromPincode(pincode);
            }, 200);
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
        }).then(
                    function(value)
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
			                        }

                );
      
   
		


    }

    $scope.requestApptRescheduleClicked = function() {
        $scope.flags.showRescheduleAppt = true;
        $scope.getSpMonthlyAppointmentAvailability();
        $scope.spInfo = false;
        $scope.spNewAppointment.aptstarttime = "";
        $scope.scrollDiv('rescheduleAppt');
    }

    $scope.requestApptReschedule = function(test) {
        console.log(test);
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

                if($scope.applypromocost != 'undefined' && $scope.adminNewAppointmentCust.appointment.additionalcharge >0){
                    $scope.aptPayment.amnt = $scope.applypromocost + $scope.adminNewAppointmentCust.appointment.additionalcharge;

                    var addition;
                    addition =$scope.applypromocost + $scope.adminNewAppointmentCust.appointment.additionalcharge;
                    $scope.calculatedAptAmount = $scope.applypromocost +" + "+ $scope.adminNewAppointmentCust.appointment.additionalcharge +" = "+ addition;
                }else{
                    $scope.aptPayment.amnt = $scope.applypromocost;
                    $scope.calculatedAptAmount = $scope.applypromocost;
                }
                
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

        var data = {
            "walletAmount": $scope.custReadList.custwallet.amount,
            "walletTransType": transType,
            "currency":"INR"
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
            }
        }
    }

    $scope.removeTimeSlot = function() {
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