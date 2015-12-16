angular.module('app').controller('loginCtrl', function($scope, AuthService, $ionicPopup, $state) {
  $scope.data = {};

  $scope.login = function(data) {
    AuthService.login(data.username, data.password)
      .then(function(authenticated) {
        $state.go('tabsController.home', {}, {
          reload: true
        });
        $scope.setCurrentUsername(data.username);
      }, function(err) {
        var alertPopup = $ionicPopup.alert({
          title: 'Login failed!',
          template: 'Please check your credentials!'
        });
      });
  };

});
