angular.module('app.services', [])

.factory('Campaign', ['$http', 'HOST_URL', 'AuthService', function($http, HOST_URL, AuthService) {

  var selectIndex = 0;
  var campaigns = [];
  var myCampaigns = [];
  var selectedCampaigns = 'campaigns';
  var selectedCampaign;

  // var getLocal = function(id) {
  //   var found = {};
  //   campaigns.some(function(campaign){
  //     found = campaign;
  //     return campaign._id === id;
  //   });
  //   return found;
  // };

  var getRandom = function(){
    return Math.random()*100;
  };

  var select = function(id){
    index = _.findIndex(campaigns, function(campaign) { 
      return campaign._id === id; 
    });
    selectIndex = index;
    return campaigns[index];
    //return _.findWhere(campaigns, {_id: id});
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
      campaigns = response.data;
      console.log(campaigns);
      return response.data;
    }, function errorCallback(response) {
      console.log(response);
      //handle error
    });
  };

  var updateCampaign = function(campaign){
    return $http.put(HOST_URL + '/api/campaigns/' + campaign._id + AuthService.authParams(), campaign)
        .success(function(data) {
          console.log('updated', data)
          campaigns[selectIndex] = data;  
          return data;
        })
        .error(function(err){
          return err;
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

  var followCampaign = function(campaign){
    console.log(campaign.follower_id);
    if (campaign.following){
      //unfollow
      return $http.delete(HOST_URL + '/api/followers/' + campaign.follower_id + AuthService.authParams())
      .success(function(data){
        console.log('unfollowed');
      }).error(function(err){
        console.error(err);
      });
    } else {
      //follow
      var newFollower = {};
      newFollower.user_id = AuthService.getCurrentUser()._id;
      newFollower.campaign_id = campaign._id;

      return $http.post(HOST_URL + '/api/followers' + AuthService.authParams(), newFollower)
        .success(function(data){
          console.log('followed', data);
          campaign.follow_id = data._id;
        }).error(function(err){
          console.error(err);
        });
    }
  };

  // initial load of campaigns
  getCampaigns().then(function(data) {
    campaigns = data;
  });


  return {
    getRandom: getRandom,
    campaigns: campaigns,
    select: select,
    showCampaigns: function(){ return campaigns; },
    createCampaign: createCampaign,
    getCampaigns: getCampaigns,
    followCampaign: followCampaign,
    deleteCampaign: deleteCampaign,
    selectedCampaign: selectedCampaign,
    updateCampaign: updateCampaign,
    setSelected: function(campaign){selectedCampaign = campaign;},
    getSelected: function(campaign){return selectedCampaign;},

  };

}]);
