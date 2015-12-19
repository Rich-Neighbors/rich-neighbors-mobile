angular.module('app').controller('settingsCtrl', function($scope, $state, $http, AuthService, HOST_URL) {
	
	$scope.logout = function() {
    AuthService.logout();
    $state.go('tabsController.home');
  };

  $scope.changePassword = function() {
  	//TODO
  };

});