angular.module('app')
  .service('apiCall', function($http, HOST_URL, AuthService) {

    var apiExtend = function(obj, links, callback) {
      var count = 0;
      _.forEach(links, function(link){
        $http.get(HOST_URL + link.href)
          .success(function(data) {
            //console.log(link.ref, data);
            //TODO: remove if statement once links are fixed
            if (link.ref !== 'images'){
              obj[link.ref] = data;
            }
            count++;
            if (count === links.length) {
              callback();
            }
          })
          .error(function(err) {
            console.error(err);
            count++;

          });
        });
    };

    return {
      apiExtend: apiExtend
    };


  });
