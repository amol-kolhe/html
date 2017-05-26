angular.module('myApp', ['ui.bootstrap','angularUtils.directives.dirPagination', 'ngTouch', 'ui.grid', 'ui.grid.selection', 'ui.grid.exporter', 'myApp.controllers', 'ngCookies', 'ngDialog', 'myApp.timeDirectives', 'myApp.Services', 'facebook', 'angularjs-dropdown-multiselect', 'ui.bootstrap.datetimepicker'])
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




