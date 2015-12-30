angular.module('app.directives', [])

.directive('campaignListItem', function(){
  return {
    restrict: 'AE',
    scope: true,
    templateUrl: 'components/campaignListItem.html'
  };

})

.directive('fundingBar', function(){
  return {
    restrict: 'AE',
    scope: true,
    templateUrl: 'components/fundingBar.html'
  };

})

.directive('campaignForm', function(){
  return {
    restrict: 'AE',
    scope: true,
    templateUrl: 'components/campaignForm.html'
  };

});