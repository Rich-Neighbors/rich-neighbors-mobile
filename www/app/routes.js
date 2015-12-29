angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

  .state('login', {
    url: '/login',
    templateUrl: 'app/account/login/login.html',
    controller: 'loginCtrl'
  })

  .state('signup', {
    url: '/signup',
    templateUrl: 'app/account/signup/signup.html',
    controller: 'signupCtrl'
  })

  // tab controller states
  .state('tabsController', {
    url: '/tabs',
    abstract: true,
    templateUrl: 'components/tabsController.html'
  })

  .state('tabsController.home', {
    url: '/home',
    parent: 'tabsController',
    views: {
      'homeTab': {
        templateUrl: 'app/main/home.html',
        controller: 'homeCtrl'
      }
    }
  })

  .state('tabsController.campaignProfile', {
    url: '/campaign/:id',
    views: {
      'homeTab@tabsController': {
        templateUrl: 'app/campaign/campaignProfile.html',
        controller: 'campaignProfileCtrl',
        params: ['id']
        
        
      }
    }
  })

  .state('tabsController.editCampaign', {
    url: '/editcampaign/:id',
    views: {
      'homeTab@tabsController': {
        templateUrl: 'app/campaign/createCampaign.html',
        controller: 'createCampaignCtrl',
        params: ['id']
      }
    }
  })

  // .state('tabsController.myCampaigns', {
  //   url: '/mycampaign',
  //   parent: 'tabsController',
  //   views: {
  //     'myTab': {
  //       templateUrl: 'app/campaign/myCampaigns.html',
  //       controller: 'myCampaignsCtrl'
  //     }
  //   }
  // })

  // .state('tabsController.myCampaignProfile', {
  //   url: '/mycampaign/:id',
  //   views: {
  //     'myTab@tabsController': {
  //       templateUrl: 'app/campaign/campaignProfile.html',
  //       controller: 'campaignProfileCtrl',
  //       params: ['id']
  //     }
  //   }
  // })

  // .state('tabsController.editMyCampaign', {
  //   url: '/editcampaign/:id',
  //   views: {
  //     'myTab@tabsController': {
  //       templateUrl: 'app/campaign/createCampaign.html',
  //       controller: 'createCampaignCtrl',
  //       params: ['id']
  //     }
  //   }
  // })

  .state('tabsController.createCampaign', {
    url: '/startcampaign',
    parent: 'tabsController',
    views: {
      'createTab': {
        templateUrl: 'app/campaign/createCampaign.html',
        controller: 'createCampaignCtrl'
      }
    }
  })

  .state('tabsController.newCampaignProfile', {
    url: '/new-campaign/:id',
    views: {
      'createTab@tabsController': {
        templateUrl: 'app/campaign/campaignProfile.html',
        controller: 'campaignProfileCtrl',
        params: ['id']
        
      }
    }
  })

  // .state('tabsController.editCampaign', {
  //   url: '/editcampaign/:id',
  //   views: {
  //     'createTab': {
  //       templateUrl: 'app/campaign/createCampaign.html',
  //       controller: 'createCampaignCtrl',
  //       params: ['id']
  //     }
  //   }
  // })


  .state('tabsController.myAccount', {
    url: '/userAccount',
    views: {
      'settingsTab': {
        templateUrl: 'app/account/settings/settings.html',
        controller: 'settingsCtrl'
      }
    }
  })

  .state('campaignSuccessPage', {
    url: '/success',
    templateUrl: 'app/campaign/campaignSuccessPage.html',
    controller: 'campaignSuccessPageCtrl'
  })

  .state('supplyList', {
    url: '/supplylist',
    templateUrl: 'components/supplyList.html',
    controller: 'supplyListCtrl'
  })

  .state('volunteer', {
    url: '/volunteer',
    templateUrl: 'components/volunteer.html',
    controller: 'volunteerCtrl'
  })

  .state('donateMoney', {
    url: '/donatemoney',
    templateUrl: 'components/donateMoney.html',
    controller: 'donateMoneyCtrl'
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise(function($injector, $location){
    var $state = $injector.get("$state");
    $state.go('tabsController.home');
  });

});
