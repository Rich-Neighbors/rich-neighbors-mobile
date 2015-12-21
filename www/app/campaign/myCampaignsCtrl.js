angular.module('app').controller('myCampaignsCtrl', function($scope, Campaign) {

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

  $scope.getCampaigns('me');

});