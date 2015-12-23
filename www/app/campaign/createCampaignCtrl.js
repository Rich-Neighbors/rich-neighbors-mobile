angular.module('app').controller('createCampaignCtrl', function($scope, $state, $ionicHistory, Campaign, Camera) {
  

  $scope.id = $state.params.id;
  $scope.newCampaign = Campaign.getSelected();
  if ($scope.newCampaign){
    $scope.volunteers = $scope.newCampaign.volunteers || [{}];
    $scope.supplies = $scope.newCampaign.items || [{}];
  }
  $scope.title = 'Edit Campaign';   

  $scope.resetForm = function(){
    $scope.newCampaign = {
      title: '',
      description: '',
      goal: '',
      picture_url: '',
      ip_address: '',
      //supplies: [{}],
      //volunteers: [{}],
      latitude: '',
      longitude: '',
    };

    $scope.supplies = [{}];
    $scope.volunteers = [{}];
  };

  //initialize form
  if (!$scope.id) {
    $scope.title = "Create a Campaign";
    $scope.resetForm();
  }

  $scope.addVolunteer = function(){
    $scope.volunteers.push({});
  };

  $scope.removeVolunteer = function(index){
    $scope.volunteers.splice(index, 1);
  };

  $scope.addSupplies = function(){
    $scope.supplies.push({});
  };

  $scope.removeSupplies = function(index){
    $scope.supplies.splice(index, 1);
  };

  $scope.updateCampaign = function(campaign){

    Campaign.updateCampaign($scope.newCampaign)
      .success(function(data){
        //$scope.viewCampaign(data);
        $ionicHistory.goBack(-1);
      })
      .catch(function(err){
        console.error(err);
      });
  };

  $scope.createCampaign = function(){
    //save campaign
    Campaign.createCampaign($scope.newCampaign, $scope.volunteers, $scope.supplies)
      .then(function(res){
        $scope.viewCampaign(res.data);
      })
      .catch(function(err){
        console.error(err);
      });
      //reset form
      $scope.resetForm();
  };

  //run view after created - pass campaign id in url
  $scope.viewCampaign = function(campaign){
    console.log('viewnew', campaign);
    Campaign.selectedCampaign = campaign;
    $state.go('tabsController.newCampaignProfile', { id: campaign._id } );
  };

  //TODO: fix error with camera plugin install
  $scope.takePhoto = function() {
    Camera.getPicture().then(function(imageURI) {
      console.log(imageURI);
    }, function(err) {
      console.err(err);
    });
  };

});
