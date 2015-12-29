angular.module('app').controller('campaignProfileCtrl', function($scope, $http, $stateParams, $state, $ionicHistory, Campaign, AuthService, apiCall) {

  $scope.id = $stateParams.id;
  $scope.isAuthenticated = AuthService.isAuthenticated;
  $scope.currentUser = AuthService.getCurrentUser();
  $scope.campaign = Campaign.select($scope.id);
  $scope.comment = {};
  // if ($scope.campaign === undefined){
  //   $state.go('tabsController.home', {}, {reload: true});
  // }
  //$scope.gotDetails = false;

  $scope.isOwner = function(campaign){
    if (campaign.user_id){
      return campaign.user_id._id === $scope.currentUser._id;
    }
  };

  $scope.getCampaign = function(){
    Campaign.getCampaigns($scope.id).then(function(campaign){    
      $scope.loaded = true;
      $scope.$broadcast('scroll.refreshComplete');
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

  $scope.deleteCampaign = function(){
    //add an "are you sure" popup
    Campaign.deleteCampaign($scope.id);
    //TODO: fix refresh after campaign deletion
    $state.go($ionicHistory.backView().stateName, {}, {reload: true});
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

  $scope.addComment = function(comment){
    comment.user_id = $scope.currentUser._id;
    comment.profile_pic = $scope.currentUser.profile_pic;
    comment.username = $scope.currentUser.name;
    comment.campaign_id = $scope.id;
    console.log(comment)
    Campaign.addComment(comment)
      .success(function(data){
        $scope.campaign.comments.push(data);
      });
    //reset comment
    $scope.comment = {};
  };

  

    //$scope.getCampaignDetails($scope.campaign);
    $scope.getCampaign();
  




});