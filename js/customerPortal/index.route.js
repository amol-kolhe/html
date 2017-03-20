/*(function () {
	'use strict';*/

	var app = angular.module('custPortalApp', [
		'ui.router',
		'acute.select', 
		'myApp.Services', 
		'ngCookies',
		'ngDialog',
		'ui.bootstrap', 
		'ngSanitize',
		'ngTouch',
		'ngAnimate',
		]);

	app.config(['$urlRouterProvider', '$stateProvider', '$locationProvider', function ($urlRouterprovider, $stateProvider, $locationProvider) {

		$locationProvider.html5Mode({
            enabled: true
		});

		$stateProvider.
			state('home', {
				url: '/home',
				templateUrl: './CustPortal/home_partials/custPortal_home.html'
			}).
			state('homepages', {
				url: '/homepages',
				templateUrl: './CustPortal/other_pages/innerpages_parent.html',
				controller: "innerPageController",
				controllerAs: "innerPageCtrl"
			}).
			state('homepages.privacypolicy', {
				url: '/privacypolicy',
				templateUrl: './CustPortal/other_pages/privacy_policy.html'
			}).
			state('homepages.contactus', {
				url: '/contactus',
				templateUrl: './CustPortal/other_pages/contactus.html'
			}).
			state('homepages.physioexperts', {
				url: '/physioexperts',
				templateUrl: './CustPortal/other_pages/physioexperts.html'
			}).
			state('homepages.aboutsancheti', {
				url: '/aboutsancheti',
				templateUrl: './CustPortal/other_pages/aboutsancheti.html'
			}).
			state('homepages.faq', {
				url: '/faq',
				templateUrl: './CustPortal/other_pages/faq.html'
			}).
			state('homepages.aboutus', {
				url: '/aboutus',
				templateUrl: './CustPortal/other_pages/aboutus.html'
			}).
			state('homepages.policy', {
				url: '/policy',
				templateUrl: './CustPortal/other_pages/policy.html'
			}).
			state('booking', {
				url: '/booking',
				templateUrl: './CustPortal/booking_partials/booking_parent.html',
				controller: 'bookingController',
				controllerAs: 'bookingCtrl'
			}).
			state('booking.booking1', {
				url: '/booking1',
				templateUrl: './CustPortal/booking_partials/booking1_subview.html'
			}).
			state('booking.booking2', {
				url: '/booking2',
				templateUrl: './CustPortal/booking_partials/booking2_subview.html'
			}).
			state('bookingConfirmation', {
				url: '/booking_confirmation',
				templateUrl: './CustPortal/booking_partials/booking3_subview.html',
				controller: 'bookingConfirmController',
				controllerAs: 'bookingConfirmCtrl'
			}).
			state('privacypolicy', {
				url: '/privacypolicy',
				templateUrl: './CustPortal/other_pages/privacy_policy.html'
			});

		$urlRouterprovider.otherwise('/home');
	}]);
/*})();*/
