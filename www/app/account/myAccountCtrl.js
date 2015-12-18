angular.module('app').controller('myAccountCtrl', function($scope, $state, $http, AuthService, HOST_URL) {
	
	$scope.logout = function() {
    AuthService.logout();
    $state.go('tabsController.home');
  };

});