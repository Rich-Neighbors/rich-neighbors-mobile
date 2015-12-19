angular.module('app.services', [])

.factory('Campaign', ['$http', 'HOST_URL', function($http, HOST_URL) {

  var campaigns = [];
  var selectedCampaign = {};

  var createCampaign = function(newCampaign) {
    campaigns.push(newCampaign);
  };

  var getCampaigns = function(id) {
    id = id || '';
    return $http({
      method: 'GET',
      url: HOST_URL + '/api/campaigns/' + id,
      dataType: 'application/json',
    }).then(function successCallback(response) {
      campaigns = response.data;
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
