angular.module('app').controller('campaignProfileCtrl', function($scope, $stateParams, $state, $ionicHistory, Campaign, AuthService) {

  $scope.campaign = {};
  console.log('params', $stateParams);
  
  $scope.isOwner = function(){
    var currentUserId = AuthService.getCurrentUser()._id;
    return $scope.ownerId === currentUserId;
  };

  $scope.getCampaign = function(){
    $scope.id = $stateParams.id;
    Campaign.getCampaigns($scope.id).then(function(campaign){
      $scope.campaign = campaign;
      if (campaign.user_id) {
        $scope.ownerId = campaign.user_id._id;
      }
      $scope.loaded = true;
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.deleteCampaign = function(){
    //add an "are you sure" popup
    Campaign.deleteCampaign($scope.id);
    $state.go($ionicHistory.backView().stateName, {}, {reload: true});
  };

  $scope.getCampaign();



});