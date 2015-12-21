angular.module('app').controller('homeCtrl', function($scope, $state, $http, Campaign) {
  $scope.campaigns = [];
  $scope.loaded = false;
  
  $scope.getCampaigns = function(){
    Campaign.getCampaigns().then(function(data){
      //console.log(data);
      $scope.campaigns = data;
      $scope.loaded = true;
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.viewCampaign = function(campaign){
  	//console.log(campaign._id);
    //TODO: send loaded campaign to avoid display lag
  	$state.go('tabsController.campaignProfile', {id: campaign._id, campaign: campaign} );
  };

  //initial loading of campaigns
  $scope.getCampaigns();
  $state.go('tabsController.home');

}); 