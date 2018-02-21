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
		'youtube-embed'
		]);

	app.config(['$urlRouterProvider', '$stateProvider', '$locationProvider', function ($urlRouterprovider, $stateProvider, $locationProvider) {

		$locationProvider.html5Mode({
            enabled: true
		});

		$stateProvider.
			state('home', {
				url: '/',
				templateUrl: './CustPortal/home_partials/custPortal_home.html',
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
			state('contactus', {
				url: '/contactus',
				templateUrl: './CustPortal/other_pages/contactus.html',
				controller: "innerPageController",
				controllerAs: "innerPageCtrl"
			}).
			state('physioexperts', {
				url: '/physioexperts',
				templateUrl: './CustPortal/other_pages/physioexperts.html',
				controller: "innerPageController",
				controllerAs: "innerPageCtrl"
			}).
			state('aboutsancheti', {
				url: '/about-sancheti-hospital',
				templateUrl: './CustPortal/other_pages/aboutsancheti.html',
				controller: "innerPageController",
				controllerAs: "innerPageCtrl"
			}).
			state('homepages.testimonials', {
				url: '/testimonials',
				templateUrl: './CustPortal/home_partials/testimonials.html'
			}).
			state('faq', {
				url: '/faq',
				templateUrl: './CustPortal/other_pages/faq.html',
				controller: "innerPageController",
				controllerAs: "innerPageCtrl"
			}).
			state('aboutus', {
				url: '/aboutus',
				templateUrl: './CustPortal/other_pages/aboutus.html',
				controller: "innerPageController",
				controllerAs: "innerPageCtrl"
			}).
			state('policy', {
				url: '/policy',
				templateUrl: './CustPortal/other_pages/policy.html',
				controller: "innerPageController",
				controllerAs: "innerPageCtrl"
			}).
			state('neck', {
				url: '/physiotherpay-for-neck',
				templateUrl: './CustPortal/other_pages/neck.html',
				controller: "innerPageController",
				controllerAs: "innerPageCtrl"

			}).
			state('elbow', {
				url: '/physiotherpay-for-elbow',
				templateUrl: './CustPortal/other_pages/elbow.html',
				controller: "innerPageController",
				controllerAs: "innerPageCtrl"
			}).
			state('foot', {
				url: '/physiotherpay-for-foot',
				templateUrl: './CustPortal/other_pages/foot.html',
				controller: "innerPageController",
				controllerAs: "innerPageCtrl"
			}).
			state('hip', {
				url: '/physiotherpay-for-hip',
				templateUrl: './CustPortal/other_pages/hip.html',
				controller: "innerPageController",
				controllerAs: "innerPageCtrl"
			}).
			state('knee', {
				url: '/physiotherpay-for-knee',
				templateUrl: './CustPortal/other_pages/knee.html',
				controller: "innerPageController",
				controllerAs: "innerPageCtrl"
			}).
			state('shoulder', {
				url: '/physiotherpay-for-shoulder',
				templateUrl: './CustPortal/other_pages/shoulder.html',
				controller: "innerPageController",
				controllerAs: "innerPageCtrl"
			}).
			state('wrist', {
				url: '/physiotherpay-for-wrist',
				templateUrl: './CustPortal/other_pages/wrist.html',
				controller: "innerPageController",
				controllerAs: "innerPageCtrl"
			}).
			state('ankle', {
				url: '/physiotherpay-for-ankle',
				templateUrl: './CustPortal/other_pages/ankle.html',
				controller: "innerPageController",
				controllerAs: "innerPageCtrl"
			}).
			state('back', {
				url: '/physiotherpay-for-back',
				templateUrl: './CustPortal/other_pages/back.html',
				controller: "innerPageController",
				controllerAs: "innerPageCtrl"
			}).
			state('homepages.prbm', {
				url: '/prbm',
				templateUrl: './CustPortal/other_pages/prbm.html'
			}).
			state('booking', {
				url: '/booking',
				templateUrl: './CustPortal/booking_partials/booking_parent.html',
				controller: 'bookingController',
				controllerAs: 'bookingCtrl'
			}).
			/*state('booking.booking1', {
				url: '/book-physiotherpist-online',
				templateUrl: './CustPortal/booking_partials/booking1_subview.html',
			}).
			state('booking.booking2', {
				url: '/booking2',
				templateUrl: './CustPortal/booking_partials/booking2_subview.html',
				
			}).
			*/
			state('booking1', {
				url: '/book-physiotherpist-online',
				templateUrl: './CustPortal/booking_partials/booking1_subview.html',
				controller: 'bookingController',
				controllerAs: 'bookingCtrl'
			}).
			state('booking.booking2', {
				url: '/booking2',
				templateUrl: './CustPortal/booking_partials/booking2_subview.html',
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
			}).
			state('zumba', {
				url: '/physiotherpay-zumba',
				templateUrl: './CustPortal/other_pages/zumba.html',
				controller: "innerPageController",
				controllerAs: "innerPageCtrl"

			});

		$urlRouterprovider.otherwise('/');
	}]);
/*})();*/
