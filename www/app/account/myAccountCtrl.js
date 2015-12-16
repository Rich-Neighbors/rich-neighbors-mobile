angular.module('app').controller('myAccountCtrl', function($scope, $state, AuthService) {
	$scope.logout = function() {
    AuthService.logout();
    $state.go('login');
  };
});