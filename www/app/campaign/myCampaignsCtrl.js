angular.module('app').controller('myCampaignsCtrl', function($scope, $state, Campaign) {

	$scope.campaigns = [];
	$scope.loaded = false;

	$scope.getCampaigns = function(id){
    Campaign.getCampaigns(id)
    	.then(function(data){
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

  $scope.getCampaigns('me');

});