angular.module('app').controller('campaignProfileCtrl', function($scope, $http, $stateParams, $state, $ionicHistory, Campaign, AuthService, apiCall) {

  if (Campaign.selectedCampaign === undefined){
    $state.go('tabsController.home', {}, {reload: true});
  }

  $scope.id = $stateParams.id;
  $scope.campaign = Campaign.select($scope.id);
  $scope.currentUserId = AuthService.getCurrentUser()._id;
  //$scope.gotDetails = false;

  $scope.isOwner = function(campaign){
    if (campaign.user_id){
      return campaign.user_id === $scope.currentUserId;
    }
  };

  $scope.getCampaign = function(){
    Campaign.getCampaigns($scope.id).then(function(campaign){
      if (!$scope.campaign){
        $scope.campaign = campaign;
      }
      
      $scope.loaded = true;
      $scope.$broadcast('scroll.refreshComplete');
      /// set back to id
      campaign = Campaign.select($scope.id);
      $scope.getCampaignDetails(campaign);
      return campaign;
    }).then(function(data){
      //get additional campaign data
      //if ($scope.gotDetails === false && data) {
        //$scope.getCampaignDetails(data);
      //}
    });
    
  };

  $scope.editCampaign = function(campaign){
    //Campaign.setSelected(campaign);
    console.log($state.current);
    var editView = 'tabsController.editCampaign';
    if ($state.current.name === 'tabsController.myCampaignProfile') {
      editView = 'tabsController.editMyCampaign';
    }
    $state.go(editView, {id: campaign._id} );
  };

  $scope.followCampaign = function(campaign){
    Campaign.followCampaign(campaign)
      .success(function(data){
        //sync follow status
        console.log('sync',data);
        if (data._id){
          campaign.follower_id = data._id;
          campaign.following = true;
        } else {
          campaign.following = false;
        }
      });
    campaign.following = !campaign.following;
  };

  $scope.getCampaignDetails = function(campaign){
    //$scope.gotDetails = true;

    //is user campaign owner
      if (campaign.user_id) {
        if (campaign.user_id._id === $scope.currentUserId){
          campaign.isOwner = true;
        }
      }

    var links = campaign._links.slice(1);
    apiCall.apiExtend(campaign, links, function(){
      $scope.campaign = campaign;   
      //determine if following campaign
      campaign.following = campaign.followers.some(function(follower){
         campaign.follower_id = follower._id;
         return follower.user_id === $scope.currentUserId; 
      });
      console.log('follow id', campaign.follower_id)

      //get total of donations
      var amounts = _.pluck(campaign.contributors, 'amount');
      campaign.donated = _.reduce(amounts, function(total, n) {
        return total + n;
      }, 0);
      console.log($scope.campaign)
    });

  };

  $scope.deleteCampaign = function(){
    //add an "are you sure" popup
    Campaign.deleteCampaign($scope.id);
    //TODO: fix refresh after campaign deletion
    $state.go($ionicHistory.backView().stateName, {}, {reload: true});
  };

    $scope.getCampaignDetails($scope.campaign);
    //$scope.getCampaign();
  




});