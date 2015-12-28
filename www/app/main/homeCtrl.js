angular.module('app').controller('homeCtrl', function($scope, $state, $http, Campaign) {
  $scope.Campaign = Campaign;
  $scope.loaded = false;
  $scope.filter = '';
  
  $scope.changeFilter = function(filter){
    $scope.filter = filter;
    $scope.loaded = false;
    $scope.getCampaigns();
  };

  $scope.getCampaigns = function(){
    Campaign.getCampaigns($scope.filter).then(function(data){
      //not sure why this assignement is needed
      //Campaign.campaigns = Campaign.showCampaigns();
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
  $scope.getCampaigns($scope.filter);

}); 