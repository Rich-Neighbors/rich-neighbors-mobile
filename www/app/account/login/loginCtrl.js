angular.module('app').controller('loginCtrl', function($scope, AuthService, $ionicPopup, $state) {
  $scope.data = {};

  $scope.login = function(data) {
    AuthService.login(data.username, data.password);
  };

  $scope.facebookLogin = function() {
  	//TODO
  };

});
