angular.module('app')

.service('AuthService', function($q, $http, $ionicPopup, $state, USER_ROLES, HOST_URL) {
  var LOCAL_TOKEN_KEY = 'token';
  var username = '';
  var isAuthenticated = false;
  var role = '';
  var authToken;
  var currentUser = {};


  var getCurrentUser = function() {
    $http({
      method: 'GET',
      url: HOST_URL + '/api/users/me?access_token=' + window.localStorage.getItem(LOCAL_TOKEN_KEY),
      dataType: 'application/json',
    }).then(function(res) {
      currentUser = res.data;
      //console.log(res.data);
    }, function(err) {
      console.error(err);
    });
  };

  //Check if user is already logged in on app initialize
  if (window.localStorage.getItem(LOCAL_TOKEN_KEY)) {
    getCurrentUser();
  }

  var loadUserCredentials = function() {
    var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
    if (token) {
      useCredentials(token);
    }
  };

  var storeUserCredentials = function(username, token) {
    window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
    useCredentials(username, token);
    getCurrentUser();
  };

  var useCredentials = function(username, token) {
    username = token;
    isAuthenticated = true;
    authToken = token;

    // TODO: add real role determination
    if (username == 'admin') {
      role = USER_ROLES.admin;
    }
    if (username == 'user') {
      role = USER_ROLES.public;
    }
  };

  var destroyUserCredentials = function() {
    authToken = undefined;
    username = '';
    currentUser = {};
    isAuthenticated = false;
    window.localStorage.removeItem(LOCAL_TOKEN_KEY);
  };

  var login = function(email, password) {
    return $http.post(HOST_URL + '/auth/local', {
        email: email,
        password: password
      })
      .then(function(res) {
        storeUserCredentials(email, res.data.token);
        $state.go('tabsController.home', {}, {reload: true});
      })
      .catch(function(err) {
        console.error('login fail');
        var alertPopup = $ionicPopup.alert({
          title: 'Login failed!',
          template: 'Please check your credentials!'
        });
      });
  };

  var logout = function() {
    destroyUserCredentials();
  };

  var isAuthorized = function(authorizedRoles) {
    if (!angular.isArray(authorizedRoles)) {
      authorizedRoles = [authorizedRoles];
    }
    return (isAuthenticated && authorizedRoles.indexOf(role) !== -1);
  };

  loadUserCredentials();
  return {
    login: login,
    logout: logout,
    isAuthorized: isAuthorized,
    isAuthenticated: function() {
      return isAuthenticated;
    },
    username: function() {
      return username;
    },
    role: function() {
      return role;
    },
    currentUser: function() {
      return currentUser;
    }
  };
})

.factory('AuthInterceptor', function($rootScope, $q, AUTH_EVENTS) {
  return {
    responseError: function(response) {
      $rootScope.$broadcast({
        401: AUTH_EVENTS.notAuthenticated,
        403: AUTH_EVENTS.notAuthorized
      }[response.status], response);
      return $q.reject(response);
    }
  };
})

.config(function($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
});
