angular.module('app').controller('campaignProfileCtrl', function($scope, $stateParams, $state, Campaign) {

  $scope.campaign = {};
  $scope.getCampaign = function(){
  	var id = $stateParams.id;
    Campaign.getCampaigns(id).then(function(data){
      //console.log(data);
      $scope.campaign = data;
      $scope.loaded = true;
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.getCampaign();



});