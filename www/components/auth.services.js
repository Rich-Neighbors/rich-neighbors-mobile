angular.module('app')

.service('AuthService', function($q, $http, USER_ROLES, HOST_URL) {
  var LOCAL_TOKEN_KEY = 'token';
  var username = '';
  var isAuthenticated = false;
  var role = '';
  var authToken;
  var currentUser = {};

  var authParams = function(){
    var params = '';
    if (authToken !== undefined){
      params += '?access_token=' + authToken;

      if (currentUser._id !== undefined){
        params += '&user=' + currentUser._id;
      }
    }
    return params;
  }; 


  var getCurrentUser = function() {
    if (currentUser._id !== undefined){
      return currentUser;
    }
    $http({
      method: 'GET',
      url: HOST_URL + '/api/users/me' + authParams(),
      dataType: 'application/json',
    }).then(function(res) {
      currentUser = res.data;
      console.log('currentUser:', currentUser);
      return currentUser;
    }, function(err) {
      console.error(err);
    });
  };

  var loadUserCredentials = function() {
    var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
    if (token) {
      useCredentials(token);
    }
  };

  var storeUserCredentials = function(token) {
    window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
    useCredentials(token);
  };

  var useCredentials = function(token) {
    isAuthenticated = true;
    authToken = token;
    getCurrentUser();


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
    currentUser = {};
    isAuthenticated = false;
    window.localStorage.removeItem(LOCAL_TOKEN_KEY);
  };

  var login = function(email, password) {
    return $http.post(HOST_URL + '/auth/local', {
        email: email,
        password: password
      })
      .success(function(res) {
        storeUserCredentials(res.token);
      })
      .error(function(err) {
        console.error('login fail');
      });
  };

  var logout = function() {
    destroyUserCredentials();
  };

  var isAuthorized = function(authorizedRoles) {
    // if (!angular.isArray(authorizedRoles)) {
    //   authorizedRoles = [authorizedRoles];
    // }
    // return (isAuthenticated && authorizedRoles.indexOf(role) !== -1);
    return isAuthenticated;
  };

  loadUserCredentials();

  return {
    login: login,
    logout: logout,
    isAuthorized: isAuthorized,
    authParams: authParams,
    isAuthenticated: function() {
      return isAuthenticated;
    },
    username: function() {
      return username;
    },
    role: function() {
      return role;
    },
    getCurrentUser: function() {
      return currentUser;
    },
    authToken: function(){
      return authToken;
    }
  };
})

.factory('AuthInterceptor', function($rootScope, $q, $injector, AUTH_EVENTS) {
  
  return {
    responseError: function(response) {
      $rootScope.$broadcast({
        401: AUTH_EVENTS.notAuthenticated,
        403: AUTH_EVENTS.notAuthorized
      }[response.status], response);
      var AuthService = $injector.get('AuthService');
      var $state = $injector.get('$state');
      AuthService.logout();
      $state.go($state.current, {}, {reload: true});
      console.error('unauthorized!');
      return $q.reject(response);
    }
  };
})

// .factory('httpRequestInterceptor', function ($injector) {
//   return {
//     request: function (config) {
//       var AuthService = $injector.get('AuthService');
//       var token = AuthService.authToken();
//       var user = AuthService.currentUser();
//       if (token) {
//         config.url =  URI(config.url).addSearch({'access_token': token}).toString();
//       }
//       if (user) {
//         config.url =  URI(config.url).addSearch({'user': user}).toString();
//       }
//       return config;
//     }
//   };
// })

.config(function($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
  //$httpProvider.interceptors.push('httpRequestInterceptor');
});
