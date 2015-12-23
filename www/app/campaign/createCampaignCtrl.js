angular.module('app').controller('createCampaignCtrl', function($scope, $state, Campaign, Camera) {
  

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
  $scope.resetForm();

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
