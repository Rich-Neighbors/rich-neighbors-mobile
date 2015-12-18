angular.module('app').controller('homeCtrl', function($scope, $state, $http, Campaign) {
  $scope.campaigns = [];
  $scope.loaded = false;
  
  $scope.getCampaigns = function(){
    Campaign.getCampaigns().then(function(data){
      $scope.campaigns = data;
      $scope.loaded = true;
      console.log(data);
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.viewCampaign = function(campaign){
  	console.log(campaign._id);
    Campaign.selectedCampaign = campaign;
  	$state.go('tabsController.campaignProfile', {id: campaign._id} );
  };

  $scope.getCampaigns();

}); 