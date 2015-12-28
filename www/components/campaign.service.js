angular.module('app.services', [])

.factory('Campaign', ['$http', 'HOST_URL', 'AuthService', function($http, HOST_URL, AuthService, apiCall) {

  var selectIndex = 0;
  var campaigns = [];
  var myCampaigns = [];
  var selectedCampaigns = 'campaigns';
  var selectedCampaign;

  var getRandom = function() {
    return Math.random() * 100;
  };

  var setCampaigns = function(selection){
    campaigns.length = 0;
    campaigns.push.apply(campaigns, selection);
  };

  var select = function(id) {
    selectIndex = _.findIndex(campaigns, function(campaign) {
      return campaign._id === id;
    });
    return campaigns[selectIndex];
  };

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
      setCampaigns(response.data);
      console.log(campaigns);
      return response.data;
    }, function errorCallback(response) {
      console.log(response);
      //handle error
    });
  };

  var updateCampaign = function(campaign, volunteers, supplies) {
    return $http.put(HOST_URL + '/api/campaigns/' + campaign._id + AuthService.authParams(), campaign)
      .success(function(data) {
        console.log('updated', data)
        campaigns[selectIndex] = data;
          //update the rest
          addCampaignNeeds(data, {
          'items': supplies,
          'volunteers': volunteers
        });
        return data;
      })
      .error(function(err) {
        return err;
      });

    //apply after fully updated
    
  };

  var deleteCampaign = function(id) {
    return $http.delete(HOST_URL + '/api/campaigns/' + id + AuthService.authParams())
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
      .success(function(campaign) {
        console.log('new campaign:', campaign);
        addCampaignNeeds(campaign, {
          'items': supplies,
          'volunteers': volunteers
        });
      })
      .error(function(err) {
        console.log('Failed to save campaign');
        console.error(err);
      });
  };

  var addCampaignNeeds = function(campaign, needs) {
    for (var needType in needs) {
      needs[needType].forEach(function(need) {
        if (need.name && need.quantity) {
          need['campaign_id'] = campaign._id;
          $http.post(HOST_URL + '/api/' + needType + AuthService.authParams(), need)
            .success(function(data) {
              console.log('added needs', data);
            })
            .error(function(err) {
              console.error(err);
            });
        }
      });
    }
  };

  var followCampaign = function(campaign) {
    console.log(campaign.follower_id);
    if (campaign.following) {
      //unfollow
      return $http.delete(HOST_URL + '/api/followers/' + campaign.follower_id + AuthService.authParams())
        .success(function(data) {
          console.log('unfollowed');
        }).error(function(err) {
          console.error(err);
        });
    } else {
      //follow
      var newFollower = {};
      newFollower.user_id = AuthService.getCurrentUser()._id;
      newFollower.campaign_id = campaign._id;

      return $http.post(HOST_URL + '/api/followers' + AuthService.authParams(), newFollower)
        .success(function(data) {
          console.log('followed', data);
          campaign.follow_id = data._id;
        }).error(function(err) {
          console.error(err);
        });
    }
  };

  getCampaigns();



  return {
    getRandom: getRandom,
    campaigns: campaigns,
    select: select,
    showCampaigns: function() {
      return campaigns;
    },
    createCampaign: createCampaign,
    getCampaigns: getCampaigns,
    followCampaign: followCampaign,
    deleteCampaign: deleteCampaign,
    selectedCampaign: selectedCampaign,
    updateCampaign: updateCampaign,
    setSelected: function(campaign) {
      selectedCampaign = campaign;
    },
    getSelected: function(campaign) {
      return selectedCampaign;
    },

  };

}]);
