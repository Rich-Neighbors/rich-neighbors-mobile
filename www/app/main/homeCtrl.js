angular.module('app').controller('homeCtrl', function($scope, $state, $http, Campaign) {
  $scope.Campaign = Campaign;
  $scope.loaded = false;
  
  $scope.randNum = function() {
    return Math.rand()*100;
  };

  $scope.getCampaigns = function(){
    Campaign.getCampaigns().then(function(data){
      //not sure why this assignement is needed
      Campaign.campaigns = Campaign.showCampaigns();
      $scope.loaded = true;
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.viewCampaign = function(campaign){
  	//console.log(campaign._id);
    Campaign.selectedCampaign = campaign;
  	$state.go('tabsController.campaignProfile', {id: campaign._id, campaign: campaign} );
  };

  //initial loading of campaigns
  $scope.getCampaigns();

}); 