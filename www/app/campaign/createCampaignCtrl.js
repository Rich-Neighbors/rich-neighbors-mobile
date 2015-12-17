angular.module('app').controller('createCampaignCtrl', function($scope, $state, Campaign) {
  
  $scope.newCampaign = {
    id: '',
    date:  '',
    title: '',
    total: '',
    raised: '0',
    description: '',
    picture_url: 'https://pbs.twimg.com/media/BwsrTjGIcAAtjdu.png',
    created_at: Date.now(),
    ip_address: '',
    supplies: '',
    volunteer: '',
    latitude: '',
    longitude: ''
  };

  $scope.createCampaign = function(){
    //Campaign.createCampaign(newCampaign);
    console.log('campaign saved');
    Campaign.selectedCampaign = $scope.newCampaign;
    $scope.viewCampaign($scope.newCampaign);
    Campaign.campaigns.push($scope.newCampaign);
  };

  //run view after created
  $scope.viewCampaign = function(campaign){
    console.log(campaign);
    
    $state.go('tabsController.campaignProfile' );
  };

  //createCampaign();
});
