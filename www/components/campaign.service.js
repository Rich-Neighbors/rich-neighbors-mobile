angular.module('app.services', [])

.factory('Campaign', ['$http', 'HOST_URL', 'AuthService', function($http, HOST_URL, AuthService) {

  var campaigns = [];
  var selectedCampaign = {};


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

  var createCampaign = function(newCampaign) {
    var user = AuthService.currentUser();
    newCampaign.user = user._id;
    console.log(user);
    $http.post(HOST_URL + '/api/campaigns?access_token=' + window.localStorage.getItem('token') + '&user=' + user._id, newCampaign)
      .success(function(data) {
        console.log(data);
      })
      .error(function(data){
        console.log(data);
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
    selectedCampaign: selectedCampaign
  };

}]);
