angular.module('app').controller('loginCtrl', function($scope, AuthService, $ionicPopup, $state) {
  $scope.data = {};

  $scope.login = function(data) {
    AuthService.login(data.username, data.password)
    	.success(function(res) {
        $state.go('tabsController.home', {}, {reload: true});
        $scope.data = {};
      })
    	.error(function(err) {
        var alertPopup = $ionicPopup.alert({
          title: 'Login failed!',
          template: 'Please check your credentials!'
        });
      });
  };

  $scope.facebookLogin = function() {
  	//TODO
  };

});
