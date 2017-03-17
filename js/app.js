angular.module('myApp', ['ui.bootstrap','angularUtils.directives.dirPagination', 'myApp.controllers', 'ngCookies', 'ngDialog', 'myApp.timeDirectives', 'myApp.Services', 'facebook', 'angularjs-dropdown-multiselect', 'ui.bootstrap.datetimepicker'])
.run(function() {
   //...
})
.config([
  'FacebookProvider',
  function(FacebookProvider) {
   var myAppId = '451412948393776';
   FacebookProvider.init(myAppId);
  }
]);




