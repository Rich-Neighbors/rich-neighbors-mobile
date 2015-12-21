angular.module('app').controller('campaignProfileCtrl', function($scope, $stateParams, $state, Campaign, AuthService) {

  $scope.campaign = {};
  
  $scope.isOwner = function(){
    var currentUser = AuthService.currentUser();
    return $scope.ownerId === currentUser._id;
  };

  $scope.getCampaign = function(){
    $scope.id = $stateParams.id;
    console.log('id',$scope.id)
    Campaign.getCampaigns($scope.id).then(function(campaign){
      $scope.campaign = campaign;
      $scope.ownerId = campaign.user_id._id;
      $scope.loaded = true;
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.deleteCampaign = function(){
    //add an "are you sure" popup
    Campaign.deleteCampaign($scope.id);
  };

  $scope.getCampaign();



});