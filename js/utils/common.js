$(document).ready(function(){
    setTimeout(function(){
        setWorkingArea();
        $(".navbar-nav li a").click(function(event) {
            $(".navbar-collapse").collapse('hide');
        });
        $('#myCarousel').carousel({
          interval: 4000
        });
        $('#tcb-testimonial-carousel').carousel({
          interval: 7000
        });
        initAccordian();
        showScrollDownArrow();
    }, 500);
    $(window).resize(function(){
        setTimeout(function(){
            setWorkingArea();
        }, 1000);
        if(isThisMobileDevice()) {
            handleMobileSpecificConditions();
        }
    });
});

/*Function to show an arrow when mouse is moved at the bottom of the screen*/
function showScrollDownArrow() {
    $(document).mousemove(function(event){
        var hotspot = $(window).height() - ($(window).height() * 0.2);
        if(event.clientY >= hotspot) {
            $("#arrow").fadeIn(1000);
        } else {
             $("#arrow").fadeOut(1000);
        }
    });
}

/*Setting up accordian for customer portal*/
function initAccordian() {
    
}

function setCarousalOverlap() {
    var menuheight = $('#menu-height').height() + 17;
    $('.home-slider').css("top", -menuheight);
}

function setWorkingArea() {
    var infoHeaderHeight = $("#infoHeader").height() + 10;
    var headerDivHeight = $("#headerDiv").outerHeight();
    var footerHeight = $("footer").outerHeight();
    var windowHeight = $(window).height();
    $("#workArea").css("min-height", windowHeight - (infoHeaderHeight + headerDivHeight + footerHeight));
    $("#accordionContainer").height(windowHeight - (infoHeaderHeight + headerDivHeight + footerHeight));
}

function handleMobileSpecificConditions() {
    setTimeout(function(){
        handleNavigationMenus();
    }, 1000);
    handleContentAlignment();
}

function handleContentAlignment() {
    var screenWidth = $( document ).width();    
    var screenHeight = $( document ).height();
    if (screenWidth < screenHeight) {
        $(".height-div").css("height", "12%");
    }
    else if (screenWidth > screenHeight) {
        $(".height-div").css("height", "13%");
    }
}

function handleNavigationMenus() {
    $(".accordionMenu").unbind('click').bind('click', function(event) {
       $("#navToggler").click();
    });
}

function isThisMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
* This function will be called when the leftNavigationPanel is loaded.
* It is recursively called till it gets the accordion loaded and then binds the click handler
*/
function handleAccordionStyling() {
    if($("#accordionContainer .panel-heading").length == 0) {
        setTimeout(function(){
            handleAccordionStyling();
        }, 500);
    }
    else {
        $("#accordionContainer .panel-heading").unbind('click').bind('click', function() {
            $("#accordionContainer .active_tab").parents().find(".panel-heading").removeClass("selectedAccordion");
            $("#accordionContainer .active_tab").parent().parent().parent().parent().addClass("selectedAccordion");
        });
        $("#accordionContainer .panel-heading").first().addClass("selectedAccordion");

        // Setting class to look like disable menu as they are not yet supported.
        $("#accordionContainer .panel-heading:contains('Service Providers') .accordionMenu").addClass("clsgray");
        $("#accordionContainer .panel-heading:contains('Leave Management') .accordionMenu").addClass("clsgray");
        $("#accordionContainer .panel-heading:contains('Reports') .accordionMenu").addClass("clsgray");
    }
}

/**
* Listening event "tab-selection-changed" to select the first element from the accordion
**/
document.addEventListener("tab-selection-changed", function(e) {
    if(e.data.title == "My Account") {
        selectFirstAccordionElement();
    }
});

function selectFirstAccordionElement() {
    if($("#accordionContainer .panel-heading").first().find(".accordionMenu").length == 0) {
        setTimeout(function() {
            selectFirstAccordionElement();
        }, 500);
    } else {
        $("#accordionContainer .panel-heading").first().find(".accordionMenu").click();
    }
}

function handleSelectedAccordionStyling() {
   $("#accordionContainer .panel-heading").removeClass("selectedAccordion");
    setTimeout(function(){
       $("#accordionContainer .panel-heading .active_tab").parent().parent().parent().parent().addClass("selectedAccordion");
    }, 500);
}

function showDiv(element) {
	var elementObj = angular.element(document.querySelector(element));
	elementObj.css({"display":"block"});
}

function hideDiv(element) {
	var elementObj = angular.element(document.querySelector(element));
    elementObj.css({"display":"none"});
}

function slideDown(element, callback) {
	var elementObj = $(element);
	elementObj.slideDown(callback);
}

function slideUp(element, callback) {
	var elementObj = $(element);
	elementObj.slideUp(callback);
}

function slideDownByIndex(element, index, callback) {
	var elementObj = $(element+":eq("+index+")");
	elementObj.slideDown(callback);
}

function slideUpByIndex(element, index, callback) {
	var elementObj = $(element+":eq("+index+")");
	elementObj.slideUp(callback);
}