angular.module('storeBuilder', [])
  .controller('StoreBuilderCtrl', ['$scope', '$http', function($scope, $http) {

      console.log();
      $scope.newStore = {brand_name: ""};

      $scope.loadStores = function(){
        $http.get('http://quamenu-api.herokuapp.com/store/allstores').
          success(function(data, status) {
            $scope.status = status;
            $scope.allStores = data;
            $scope.currentStore = $scope.allStores[0];
          }).
          error(function(data, status) {
            $scope.allStores = data || "Request failed";
            $scope.status = status;
        });
      };

      $scope.loadStores();

      $scope.getStaticMap = function(store){
        if(store !== undefined){
          return 'https://maps.googleapis.com/maps/api/staticmap?zoom=13&size=200x125&markers=' + store.geolocation.lat + ',' + store.geolocation.long;
        }
      };

      $scope.setTargetStore = function(store){
        $scope.currentStore = store;
      };

      $scope.createNewStore = function(){
        if($scope.newStore.brand_name !== ''){
          $http.post('http://quamenu-api.herokuapp.com/store/addstore', $scope.newStore).
            success(function(data, status, headers, config) {
              // this callback will be called asynchronously
              // when the response is available
              $scope.newStore.brand_name = '';
              jQuery("#storeModal").modal('hide');
              $scope.loadStores();
            }).
            error(function(data, status, headers, config) {
              // called asynchronously if an error occurs
              // or server returns response with an error status.
            });         
        };
      }
  }]);