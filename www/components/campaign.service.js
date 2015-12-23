angular.module('app.services', [])

.factory('Campaign', ['$http', 'HOST_URL', 'AuthService', function($http, HOST_URL, AuthService) {

  var campaigns = [];
  var selectedCampaign;


  var getCampaigns = function(id) {
    id = id || '';
    var apiUrl = '/api/campaigns/';
    if (id === 'me') {
      id = '';
      apiUrl = '/api/users/me/campaigns';
    }
    return $http({
      method: 'GET',
      url: HOST_URL + apiUrl + id + AuthService.authParams(),
      dataType: 'application/json',
    }).then(function successCallback(response) {
      campaigns = response.data;
      return response.data;
    }, function errorCallback(response) {
      console.log(response);
      //handle error
    });
  };

  var deleteCampaign = function(id) {
    return $http.delete(HOST_URL + '/api/campaigns/' + id + AuthService.authParams() + '&user=' + AuthService.getCurrentUser())
      .success(function(data) {
        console.log('deleted');
        console.log(data);
      })
      .error(function(err) {
        console.error(err);
      });
  };

  var createCampaign = function(newCampaign, volunteers, supplies) {
    return $http.post(HOST_URL + '/api/campaigns' + AuthService.authParams(), newCampaign)
      .success(function(data) {
        console.log('campaign res:', data);
        var campaign_id = data._id;
        //add volunteers
        volunteers.forEach(function(volunteer) {
          if (volunteer.name && volunteer.quantity) {
            volunteer['campaign_id'] = campaign_id;
            $http.post(HOST_URL + '/api/volunteers' + AuthService.authParams(), volunteer)
              .success(function(data) {
                console.log('volunteer', data);
              })
              .error(function(err) {
                console.error(err);
              });
          }
        });
        //add supplies
        supplies.forEach(function(item) {
          if (item.name && item.quantity) {
            item['campaign_id'] = campaign_id;
            $http.post(HOST_URL + '/api/items' + AuthService.authParams(), item)
              .success(function(data) {
                console.log('item', data);
              })
              .error(function(err) {
                console.error(err);
              });
          }
        });
      })
      .error(function(err) {
        console.log('Failed to save campaign');
        console.error(err);
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
    deleteCampaign: deleteCampaign,
    selectedCampaign: selectedCampaign
  };

}]);
