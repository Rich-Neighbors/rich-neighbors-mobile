angular.module('app.services', [])

.factory('Campaign', ['$http', function($http) {



  var campaigns = [];
  var selectedCampaign = {};

  var createCampaign = function(newCampaign) {
    campaigns.push(newCampaign);
  };

  var getCampaigns = function() {
    return $http({
      method: 'GET',
      url: 'http://localhost:9000/api/campaigns',
      // dataType: 'application/json',
    }).then(function successCallback(response) {
      return response.data;
    }, function errorCallback(response) {
      console.log(response);
      //handle error
    });
  };

  var getCampaign = function(id){
    console.log(id);
    campaigns.forEach(function(campaign){
      //console.log(campaign._id);
      if (campaign._id === id){
        return campaign;
      }
    });
  };

  // initial load of campaigns
  getCampaigns().then(function(data) {
    campaigns = data;
  });


  return {
    campaigns: campaigns,
    createCampaign: createCampaign, 
    getCampaigns: getCampaigns,
    getCampaign: getCampaign,
    selectedCampaign: selectedCampaign
  };

}]);
