angular.module('app')
 
.service('AuthService', function($q, $http, $ionicPopup, $state, USER_ROLES, HOST_URL) {
  var LOCAL_TOKEN_KEY = 'yourTokenKey';
  var username = '';
  var isAuthenticated = false;
  var role = '';
  var authToken;
 
  function loadUserCredentials() {
    var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
    if (token) {
      useCredentials(token);
    }
  }
 
  function storeUserCredentials(token) {
    window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
    console.log('local', window.localStorage.getItem(LOCAL_TOKEN_KEY));
    useCredentials(token);
  }
 
  function useCredentials(token) {
    username = token.split('.')[0];
    isAuthenticated = true;
    authToken = token;
    
    // TODO: real role determination
    if (username == 'admin') {
      role = USER_ROLES.admin;
    }
    if (username == 'user') {
      role = USER_ROLES.public;
    }
 
    // Set the token as header for your requests!
    //$http.defaults.headers.common['X-Auth-Token'] = token;
    $http.defaults.headers.common['access_token'] = token;
  }
 
  function destroyUserCredentials() {
    authToken = undefined;
    username = '';
    isAuthenticated = false;
    $http.defaults.headers.common['X-Auth-Token'] = undefined;
    $http.defaults.headers.common['access_token'] = undefined;
    window.localStorage.removeItem(LOCAL_TOKEN_KEY);
  }
 
  var login = function(email, password) {

        return $http.post( HOST_URL + '/auth/local', {
        email: email,
        password: password
      })
      .then(function(res) {
        console.log(res);
        storeUserCredentials(email + res.data.token);
        console.log('Login success.');
        //console.log('callback',callback())
        
        $state.go('tabsController.home', {}, {
          reload: true
        });
        //$scope.setCurrentUsername(data.username);
        
      })
      .catch(function(err) {
        console.error('login fail');
        var alertPopup = $ionicPopup.alert({
          title: 'Login failed!',
          template: 'Please check your credentials!'
        });
        //Auth.logout();
        //safeCb(callback)(err.data);
        //return $q.reject(err.data);
      });
    /*
    return $q(function(resolve, reject) {

      if ((name == 'admin' && pw == '1') || (name == 'user' && pw == '1')) {
        // Make a request and receive your auth token from your server
        storeUserCredentials(name + '.yourServerToken');
        resolve('Login success.');
      } else {
        reject('Login Failed.');
      }
    });
  */
  };

  // example from webapp

  // login: function(user, callback) {
  //     return $http.post('/auth/local', {
  //       email: user.email,
  //       password: user.password
  //     })
  //     .then(function(res) {
  //       $cookies.put('token', res.data.token);
  //       currentUser = User.get();
  //       return currentUser.$promise;
  //     })
  //     .then(function(user) {
  //       safeCb(callback)(null, user);
  //       return user;
  //     })
  //     .catch(function(err) {
  //       Auth.logout();
  //       safeCb(callback)(err.data);
  //       return $q.reject(err.data);
  //     });
  //   },
 
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
    isAuthenticated: function() {return isAuthenticated;},
    username: function() {return username;},
    role: function() {return role;}
  };
})

.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
  return {
    responseError: function (response) {
      $rootScope.$broadcast({
        401: AUTH_EVENTS.notAuthenticated,
        403: AUTH_EVENTS.notAuthorized
      }[response.status], response);
      return $q.reject(response);
    }
  };
})
 
.config(function ($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
});