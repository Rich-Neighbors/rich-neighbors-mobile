'use strict';

angular.module('app.auth', [
  'app.constants',
  'app.util',
  'ngCookies',
  'ui.router'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
