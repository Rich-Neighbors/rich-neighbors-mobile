angular.module('app.directives', [])

// .directive('viewCampaign', [function(){
//   return {
//     restrict: 'AE',
//     scope: true,
//     templateUrl: 'components/viewCampaign.html'
//   };

// }])

.directive('campaignListItem', function(){
  return {
    restrict: 'AE',
    scope: true,
    templateUrl: 'components/campaignListItem.html'
  };

})

.directive('campaignForm', function(){
  return {
    restrict: 'AE',
    scope: true,
    templateUrl: 'components/campaignForm.html'
  };

});