'use strict';

angular.module('app')
  .controller('LoginController', function($scope, Auth, $state){
    //start-non-standard
  $scope.user = {};
  $scope.errors = {};
  $scope.submitted = false;
  //end-non-standard

  $scope.Auth = Auth;
  $scope.$state = $state;

  $scope.login = function(form) {
    $scope.submitted = true;

    if (form.$valid) {
      $scope.Auth.login({
        email: $scope.user.email,
        password: $scope.user.password
      })
      .then(function() {
        console.log('welcome');
        // Logged in, redirect to home
        $scope.$state.go('main');
      })
      .catch(function(err) {
        $scope.errors.other = err.message;
      });
      }
    }

  });
