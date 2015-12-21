angular.module('app').controller('createCampaignCtrl', function($scope, $state, Campaign, Camera) {
  
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
        console.log('saved campaign', res);
        //add supplies & volunteers
        $scope.viewCampaign(res.data);
      })
      .catch(function(err){
        console.error(err);
      });

      //reset form
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

  //run view after created - pass campaign id in url
  $scope.viewCampaign = function(campaign){
    console.log('show',campaign);
    $state.go('tabsController.campaignProfile', {campaign: campaign} );
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
