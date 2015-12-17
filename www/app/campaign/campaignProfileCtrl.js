angular.module('app').controller('campaignProfileCtrl', function($scope, $stateParams, $state, Campaign) {
  $scope.description = "Save Thaline's Life";
  $scope.raised = 79417;
  $scope.total = 115000;
  $scope.campaign = Campaign.selectedCampaign;
  console.log('test',$scope.campaign);
  $state.go('tabsController.campaignProfile', Campaign.selectedCampaign, {
          reload: true
        });



});