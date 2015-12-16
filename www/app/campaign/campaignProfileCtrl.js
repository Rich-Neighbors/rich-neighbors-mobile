angular.module('app').controller('campaignProfileCtrl', function($scope, $stateParams, Campaign) {
  $scope.description = "Save Thaline's Life";
  $scope.raised = 79417;
  $scope.total = 115000;
  console.log('hi');
  $scope.campaign = Campaign.selectedCampaign;
  console.log($scope.campaign);



});