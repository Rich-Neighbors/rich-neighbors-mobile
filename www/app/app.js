angular.module('app', ['ionic', 'app.routes', 'app.services', 'app.directives'])
  .run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })

.run(function($rootScope, $state, AuthService, AUTH_EVENTS) {
  $rootScope.$on('$stateChangeStart', function(event, next, nextParams, fromState) {

    if (!AuthService.isAuthenticated()) {
      //Can only visit login, home, and campaign profile pages when not authenticated
      if (next.name !== 'login' && next.name !== 'tabsController.home' &&
        next.name.indexOf('tabsController.campaignProfile') === -1) {
        event.preventDefault();
        $state.go('login');
      }
    }
  });

  $rootScope.$on(AUTH_EVENTS.notAuthenticated, function() {
    AuthService.logout();
    $state.go('login');
    console.error('auth expired');
  });
});

angular.module('app.controllers', []);
