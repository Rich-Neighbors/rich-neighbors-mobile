angular.module('app.services', [])

.factory('Campaign', ['$http', 'HOST_URL', 'AuthService', 'apiCall', function($http, HOST_URL, AuthService, apiCall) {

  var selectIndex = 0;
  var campaigns = [];
  var myCampaigns = [];
  var selectedCampaigns = 'campaigns';
  var selectedCampaign;

  // var getRandom = function() {
  //   return Math.random() * 100;
  // };

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

  var getCampaigns = function(filter) {
    //set api call by filter
    var apiUrl = '/api/campaigns/';
    if (filter === 'campaigns' || filter === 'followers'){
      apiUrl = '/api/users/me/' + filter;
    } else if (filter){
      apiUrl += filter;
      var id = filter;
    }
    return $http({
      method: 'GET',
      url: HOST_URL + apiUrl + AuthService.authParams(),
      dataType: 'application/json',
    }).then(function successCallback(response) {
      var data = response.data;
      //convert follower array to campaigns
      if (filter === 'followers'){
       data = _.pluck(data, 'campaign_id');
      }

      if (id){
        select(id);
        //if first load, replace local early
        // if (!campaigns[selectIndex].loaded) {
        //   var oldCampaign = campaigns[selectIndex];
        //   _.extend(oldCampaign, data);
        //   getCampaignDetails(oldCampaign);
        // } else {
          getCampaignDetails(data);
        //}
      } else {
        setCampaigns(data); 
      }
      console.log(campaigns);
      //return data;
    }, function errorCallback(response) {
      console.log(response);
      //handle error
    });
  };

  var getCampaignDetails = function(campaign){

    var links = campaign._links.slice(1);
    apiCall.apiExtend(campaign, links, function(){
      //$scope.campaign = campaign;  

      //determine if following campaign
      var currentUser = AuthService.getCurrentUser();
      campaign.following = campaign.followers.some(function(follower){
         campaign.follower_id = follower._id;
         return follower.user_id === currentUser._id; 
      });
      console.log('follow id', campaign.follower_id)

      //get total of donations
      var amounts = _.pluck(campaign.contributors, 'amount');
      campaign.donated = _.reduce(amounts, function(total, n) {
        return total + n;
      }, 0);
      
      campaign.loaded = true;
      //replace local campaign with retrieved
      var oldCampaign = campaigns[selectIndex];
      _.extend(oldCampaign, campaign);
      console.log('full campaign', campaign)
    });

  };

  var updateCampaign = function(campaign, volunteers, supplies) {
    return $http.put(HOST_URL + '/api/campaigns/' + campaign._id + AuthService.authParams(), campaign)
      .success(function(data) {
        console.log('updated', data)
        campaigns[selectIndex] = data;
          processCampaignNeeds(campaign, volunteers, supplies);
        return data;
      })
      .error(function(err) {
        return err;
      });
    
  };

  var deleteCampaign = function(id) {
    campaigns.splice(selectIndex, 1);
    return $http.delete(HOST_URL +  '/api/campaigns/' + id + AuthService.authParams())
      .success(function(data) {
        console.log('deleted', data)
      })
      .error(function(err) {
        console.error(err);
      });
  };

  var createCampaign = function(newCampaign, volunteers, supplies) {
    return $http.post(HOST_URL + '/api/campaigns' + AuthService.authParams(), newCampaign)
      .success(function(campaign) {
        console.log('new campaign:', campaign);
        campaigns.push(campaign);
        select(campaign._id);
        processCampaignNeeds(campaign, volunteers, supplies);
      })
      .error(function(err) {
        console.log('Failed to save campaign');
        console.error(err);
      });
  };

  var processCampaignNeeds = function(campaign, volunteers, supplies) {
    supplies.forEach(function(item){
      if (item.name && item.quantity) {
        if (item.new) {
          item.campaign_id = campaign._id;
          addCampaignItem(item);
        } else if (item.updated) {
          updateCampaignItem(item);
        }   
      }
    });

    volunteers.forEach(function(volunteer){
      if (volunteer.name && volunteer.quantity) {
        if (volunteer.new){
          volunteer.campaign_id = campaign._id;
          addCampaignVolunteer(volunteer);
        } else if (volunteer.updated){
          updateCampaignVolunteer(volunteer);
        }
      }
    });
  };

  var updateCampaignItem = function(item){
    $http.put(HOST_URL + '/api/items/' + item._id + AuthService.authParams(), item)
      .success(function(data){
        console.log('updated item', data);
      })
      .error(function(err){
        console.error(err);
      });
  };

  var updateCampaignVolunteer = function(volunteer){
    $http.put(HOST_URL + '/api/volunteers/' + volunteer._id + AuthService.authParams(), volunteer)
      .success(function(data){
        console.log('updated volunteer', data);
      })
      .error(function(err){
        console.error(err);
      });
  };

  var addCampaignItem = function(item){
    $http.post(HOST_URL + '/api/items' + AuthService.authParams(), item)
      .success(function(data){
        console.log('added item', data);
      })
      .error(function(err){
        console.error(err);
      });
  };

  var addCampaignVolunteer = function(volunteer){
    $http.post(HOST_URL + '/api/volunteers' + AuthService.authParams(), volunteer)
      .success(function(data){
        console.log('added volunteer', data);
      })
      .error(function(err){
        console.error(err);
      });
  };

  var deleteCampaignItem = function(id){
    $http.delete(HOST_URL + '/api/items/' + id + AuthService.authParams())
      .success(function(data){
        console.log('deleted item', data);
      })
      .error(function(err){
        console.error(err);
      });
  };

  var deleteCampaignVolunteer = function(id){
    $http.delete(HOST_URL + '/api/volunteers/' + id + AuthService.authParams())
      .success(function(data){
        console.log('deleted volunteer', data);
      })
      .error(function(err){
        console.error(err);
      });
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

  var addComment = function(comment){
    return $http.post(HOST_URL + '/api/comments' + AuthService.authParams(), comment)
      .success(function(data) {
        console.log('added comment', data);
        return data;
      }).error(function(err) {
        console.log(err);
      });
  };

  getCampaigns();



  return {
    //getRandom: getRandom,
    campaigns: campaigns,
    select: select,
    //getSelected: function() {return campaigns[selectIndex];},
    showCampaigns: function() {
      return campaigns;
    },
    createCampaign: createCampaign,
    getCampaigns: getCampaigns,
    followCampaign: followCampaign,
    deleteCampaign: deleteCampaign,
    selectedCampaign: selectedCampaign,
    updateCampaign: updateCampaign,
    deleteCampaignVolunteer: deleteCampaignVolunteer,
    deleteCampaignItem: deleteCampaignItem,
    addComment: addComment

  };

}]);
