angular.module('app').controller('homeCtrl', function($scope, $state, $http, Campaign) {
  $scope.Campaign = Campaign;
  $scope.filterName = 'Home';
  
  var filterNames = {
    time: "Ending Soon",
    campaigns: 'My Campaigns',
    followers: 'Following'
  };

  //redirect when new campaign is created
      if (Campaign.newCampaignId){
        var campaign = {_id: Campaign.newCampaignId};
        Campaign.newCampaignId = undefined;
        $scope.viewCampaign(campaign);
      }

  $scope.loaded = false;

  $scope.sort = function(campaign){
    if ($scope.filter === 'time') {
      return Campaign.daysLeft(campaign);
    }
    //return campaign.created_at;
    return false;
  }; 

  $scope.changeFilter = function(filter){
    $scope.filterName = 'Near Me';
    if (filter){$scope.filterName = filterNames[filter];}
    $scope.filter = filter;
    $scope.loaded = false;
    $scope.getCampaigns();
  };

  $scope.getCampaigns = function(){
    Campaign.getCampaigns($scope.filter).then(function(data){
      $scope.loaded = true;
      $scope.$broadcast('scroll.refreshComplete');


    });
  };

  $scope.viewCampaign = function(campaign){
    //Campaign.selectedCampaign = campaign;
    // $state.params.id = '';
    // $state.go('tabsController.home', {} );
  	$state.go('tabsController.campaignProfile', {id: campaign._id} );
  };

  //initial loading of campaigns
  $scope.getCampaigns($scope.filter);

}); 