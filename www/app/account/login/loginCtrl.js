angular.module('app').controller('loginCtrl', function($scope, LoginService, $ionicPopup, $state) {
  $scope.data = {};

  $scope.login = function() {
    console.log('Login user:' + $scope.data.username + ' -ps: ' + $scope.data.password);

    LoginService.loginUser($scope.data.username, $scope.data.password)
      .success(function(data) {
        $state.go('tabsController.home');
      }).error(function(data) {
        var alertPopup = $ionicPopup.alert({
          title: 'Login failed!',
          template: 'Please check your credentials!'
        });
      });
  };

});
