angular.module('app').controller('homeCtrl', function($scope, $state, $http, Campaign) {
  $scope.campaigns = [];
  $scope.loaded = false;

  Campaign.getCampaigns().then(function(data){
    $scope.campaigns = data;
    $scope.loaded = true;
    //console.log(data);
  });

  $scope.viewCampaign = function(campaign){
  	console.log(campaign._id);
    Campaign.selectedCampaign = campaign;
  	$state.go('tabsController.campaignProfile', {id: campaign._id} );
  };

}); 