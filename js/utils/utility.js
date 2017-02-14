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
function getFormattedDate(date, isMidnight) {
	var dateObj = new Date();
	var ampm = "AM";
	if(date != undefined) {
		dateObj = date;
	}
    if(isMidnight != undefined && isMidnight == true) {
        dateObj.setHours(12);
        dateObj.setMinutes(0);
        dateObj.setDate(dateObj.getDate() + 1);
    }
	var yrObj = dateObj.getFullYear();
    var monthObj = dateObj.getMonth() + 1; //Since January is 0
    if(monthObj.toString().length == 1) {
        monthObj = "0" + monthObj.toString();
    }
    var dayObj = dateObj.getDate();
    if(dayObj.toString().length == 1) {
        dayObj = "0" + dayObj.toString();
    }
    var hrObj = dateObj.getHours();
    if(hrObj > 12) {
        hrObj -= 12;
        ampm = "PM";
    }
    if(hrObj.toString().length == 1) {
        hrObj = "0" + hrObj.toString();
    }
    var mnObj = dateObj.getMinutes();
    if(mnObj.toString().length == 1) {
        mnObj = "0" + mnObj.toString();
    }
    return yrObj + "-" + monthObj + "-" + dayObj + " " + hrObj + ":" + mnObj + " " + ampm;
}

function getEpochDate(dateString) {
	dateString = dateString.replace(/-/g, "/");
	var myDate = new Date(dateString); // Your timezone!
    var epoch = myDate.getTime()/1000.0;
    return epoch;
}

function buildBookedAppointmentData(starttime, endtime) {
	var startDate = new Date(starttime * 1000);
	var endDate = new Date(endtime * 1000);
	var bookedAppointment = {};
	bookedAppointment.appointmentDate = moment(startDate).format("YYYY-MM-DD");
	bookedAppointment.starttime = moment(startDate).format("HHmm");
	bookedAppointment.endtime = moment(endDate).format("HHmm");
	return bookedAppointment;
}

function createCreationTimeApptQuery(obj) {
	return "after=" + obj.fromEpoch + "ANDbefore=" + obj.tillEpoch;
}

function createSearchAppointmentsQuery(obj, isAdvancedSearch) {
	var queryString = "after=" + obj.fromEpoch + "ANDbefore=" + obj.tillEpoch;
	if(isAdvancedSearch != undefined && isAdvancedSearch) {
		if(obj.zone != "") {
			queryString += "ANDzone=" + obj.zone;
		}
		if(obj.service != "") {
			queryString += "ANDservice=" + obj.service;
		}
		if(obj.custemail != "") {
			queryString += "ANDcustemail=" + obj.custemail;
		}
		if(obj.custid != "") {
			queryString += "ANDcustomerid=" + obj.custid;
		}
		if(obj.spemail != "") {
			queryString += "ANDspemail=" + obj.spemail;
		}
		if(obj.custph != "") {
			queryString += "ANDcustcontact=" + obj.custph;
		}
		if(obj.spname != "") {
			queryString += "ANDspname=" + obj.spname;
		}
		if(obj.spid != "") {
			queryString += "ANDserviceproviderid=" + obj.spid;
		}
	}
	return queryString;
}

function createCustomerSearchAppointmentsQuery(obj, isAdvancedSearch) {
	var queryString = "after=" + obj.fromEpoch + "ANDbefore=" + obj.tillEpoch + "ANDcustid=" + obj.customerid;
	if(isAdvancedSearch != undefined && isAdvancedSearch) {
		if(obj.service != undefined && obj.service != "") {
			queryString += "ANDservice=" + obj.service;
		}
	}
	return queryString;
}

function buildCustomerAptSrcCriteria(obj) {
	var queryString = [];

	if(obj.service != undefined && obj.service != "") {
		queryString.push("Service = " + obj.service);
	}
	if(queryString.length > 0){
		return "Advanced Search Criteria: " + queryString.join(", ");
	}
	else {
		return "";
	}
}

function buildAptSrcCriteria(obj) {
	var queryString = [];
	if(obj.zone != "") {
		queryString.push("Zone = " + obj.zone);
	}
	if(obj.service != "") {
		queryString.push("Service = " + obj.service);
	}
	if(obj.custemail != "") {
		queryString.push("Customer email = " + obj.custemail);
	}
	if(obj.custid != "") {
		queryString.push("Customer Id = " + obj.custid);
	}
	if(obj.spemail != "") {
		queryString.push("Service Provider email = " + obj.spemail);
	}
	if(obj.custph != "") {
		queryString.push("Customer phone = " + obj.custph);
	}
	if(obj.spname != "") {
		queryString.push("Service Provider name = " + obj.spname);
	}
	if(obj.spid != "") {
		queryString.push("Service Provider Id = " + obj.spid);
	}
	if(queryString.length > 0){
		return "Advanced Search Criteria: " + queryString.join(", ");
	}
	else {
		return "";
	}
}

function buildAppointmentsList(payload) {
	var appointmentsList = [];
	if(payload == undefined || payload.length == 0) {
		return;
	}
	for(var i = 0; i<payload.length; i++) {
		var data = payload[i];
		if(data.appointment.state == 7) { // Skipping the appointments with state 'Waiting Approval'
		    continue;
		}
		var payment = (data.appointment.curr == undefined && data.appointment.amnt == 0) ? "NA" : data.appointment.curr + "-" + data.appointment.amnt;
		appointmentsList.push({
			"id" : data.appointment._id,
			"start" : new Date(data.appointment.starttime),
			"patient" : data.customer.name,
			"gender" : data.customer.gender,
			"ref" : data.appointment.refno,
			"service" : data.appointment.service,
			"spname" : data.appointment.spname,
			"zone" : data.appointment.zone,
			"state" : appointmentStateMap[data.appointment.state],
			"rating" : data.appointment.rating,
			"payment" : payment,
			"sdate" : moment(new Date(data.appointment.starttime * 1000)).format("YYYY-MM-DD hh:mm A"),
			"custid" : data.appointment.custid
		});
	}
	return appointmentsList;
}

function buildServicesList(payload) {
	var servicesList = [];
	if(payload == undefined || payload.length == 0) {
        return;
    }
    for(var i = 0; i<payload.length; i++) {
        var result = payload[i];
        for(var j=0; j<result.services.length; j++) {
	        servicesList.push(result.services[j]);
        }
    }
    return servicesList;
}

function buildServicesMap(payload) {
	var map = {};
	if(payload == undefined || payload.length == 0) {
        return;
    }
    for(var i = 0; i<payload.length; i++) {
        var result = payload[i];
        for(var j=0; j<result.services.length; j++) {
            map[result.services[j].id] = result.services[j].servicename;
            map[result.services[j].servicename] = result.services[j].id;
        }
    }
	return map;
}

function buildZonesList(payload) {
	var zonesList = [];
	if(payload == undefined || payload.length == 0) {
        return;
    }
    return payload;
}

function buildPincodeIdToPincodeNameMap(payload) {
	var map = {};
	for(var i=0; i<payload.length; i++) {
		var pincodes = payload[i].pincodes;
		for(j=0; j<pincodes.length; j++) {
			map[pincodes[j].pincodeid] = pincodes[j].pin;
		}
	}
	return map;
}

function buildPincodeToPincodeIdMap(payload) {
	var map = {};
	for(var i=0; i<payload.length; i++) {
		var pincodes = payload[i].pincodes;
		for(j=0; j<pincodes.length; j++) {
            if (typeof map[pincodes[j].pin] === 'undefined'){
			map[pincodes[j].pin] = pincodes[j].pincodeid;
            }
            else{
                if (pincodes[j].isdeleted === false){
                    map[pincodes[j].pin] = pincodes[j].pincodeid;
                }
            }
		}
	}
	return map;
}

function buildZoneIdToNameMap(payload) {
	var map = {};
	for(var i=0; i<payload.length; i++) {
		map[payload[i].zoneid] = payload[i].zonename;
	}
	return map;
}

function buildClinicIdToNameMap(payload) {
	var map = {};
	for(var i=0; i<payload.length; i++) {
		map[payload[i]._id] = payload[i].clinic_name;
	}
	return map;
}

function buildCitiesToIdMap(payload) {
	var map = {};
	for(var i=0; i<payload.states.length; i++) {
		var result = payload.states[i];
		for(var j = 0; j < result.cities.length; j++){
	         map[result.cities[j].name] = result.cities[j].id;
	    }
	}
	return map;
}

function buildCitiesIdToNameMap(payload) {
    var map = {};
    for(var i=0; i<payload.states.length; i++) {
        var result = payload.states[i];
        for(var j = 0; j < result.cities.length; j++){
             map[result.cities[j].id] = result.cities[j].name;
        }
    }
    return map;
}

function buildCityIdToStateMap(payload) {
    var map = {};
    for(var i=0; i<payload.states.length; i++) {
        var result = payload.states[i];
        for(var j = 0; j < result.cities.length; j++){
             map[result.cities[j].id] = result.name;
        }
    }
    return map;
}

function getAptEditTime(starttime, editAptDate) {
	var myEpochfromtime = 0;
	var myEpochtotime = 0;

	try {
		var dateInst = editAptDate;

	    var month = dateInst.getMonth();
		var day = dateInst.getDate();
		var year = dateInst.getFullYear();

	    //get selected apt start time  - hour and minute
	    var aptst = starttime;
	    var apth = aptst.substring(0,2);
	    var aptm = aptst.substring(2,4);

	    //From epoch time
	    var fromdate = new Date(year, month, day);
	    fromdate.setHours(apth);
	    fromdate.setMinutes(aptm);
	    myEpochfromtime = fromdate.getTime()/1000.0;

	    //To epoch time
	    var todate = new Date(year, month, day);
	    todate.setTime(fromdate.getTime() + 90*60*1000);
	    myEpochtotime = todate.getTime()/1000.0;
	}
	catch(err) {}   

    return [myEpochfromtime, myEpochtotime];
}

function hasInList(list, obj, key) {
	var result = false;
	if(list != undefined && list.length > 0) {
		for(var i=0; i<list.length; i++) {
			var object = list[i];
			if(object[key] == obj[key]) {
				return true;
			}
		}
	}
	return result;
}