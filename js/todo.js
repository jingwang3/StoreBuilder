angular.module('storeBuilder', [])
  .controller('StoreBuilderCtrl', ['$scope', '$http', function($scope, $http) {
      $scope.newStore = {brand_name: "", geolocation:{lat:'', long:''}};
      $scope.newDish = {dish_name: ""};

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

      $scope.loadStoreDishes = function(store){
          if(store !== undefined){
            var path = 'http://quamenu-api.herokuapp.com/dish/all?storeID='+store._id;
          }else{
            var path = 'http://quamenu-api.herokuapp.com/dish/all';
          }
          $http.get(path).
            success(function(data, status, headers, config) {
              // this callback will be called asynchronously
              // when the response is available
              $scope.dishesInStore = data;
              jQuery("#storeModal").modal('hide');
            }).
            error(function(data, status, headers, config) {
              // called asynchronously if an error occurs
              // or server returns response with an error status.
            }); 
      };

      $scope.addCatLabel = function(dish){
        dish.categories.push('new label');
      };

      $scope.removeLabel = function(dish, index){
        dish.categories.splice(index, 1);
      }

      $scope.getStaticMap = function(store){
        if(store !== undefined){
          return 'https://maps.googleapis.com/maps/api/staticmap?zoom=13&size=400x250&markers=' + store.geolocation.lat + ',' + store.geolocation.long;
        }
      };

      $scope.setTargetStore = function(store){
        $scope.currentStore = store;
        $scope.currentDish = {};
        $scope.loadStoreDishes(store);
      };

      $scope.setTargetDish = function(dish){
        $scope.currentDish = dish;
      };

      // $scope.loadStoreDishes = function(store){
      //   $http.get('http://quamenu-api.herokuapp.com/dish/dishinstore').
      //     success(function(data, status) {
      //       $scope.status = status;
      //       $scope.allStores = data;
      //       $scope.currentStore = $scope.allStores[0];
      //     }).
      //     error(function(data, status) {
      //       $scope.allStores = data || "Request failed";
      //       $scope.status = status;
      //   });
      // };

      $scope.createNewStore = function(){
        if($scope.newStore.brand_name !== '' && $scope.newStore.geolocation !== ''){
          $http.post('http://quamenu-api.herokuapp.com/store/addstore', $scope.newStore).
            success(function(data, status, headers, config) {
              // this callback will be called asynchronously
              // when the response is available
              $scope.newStore.brand_name = '';
              $scope.newStore.geolocation = {lat:'', long:''};
              jQuery("#storeModal").modal('hide');
              $scope.loadStores();
            }).
            error(function(data, status, headers, config) {
              // called asynchronously if an error occurs
              // or server returns response with an error status.
            });         
        };
      }

      $scope.createNewDish = function(){
        if($scope.newDish.dish_name !== ''){
          $scope.newDish.storeID = [$scope.currentStore._id];
          $scope.newDish.geolocation = {lat:$scope.currentStore.geolocation.lat, long:$scope.currentStore.geolocation.long};
          $http.post('http://quamenu-api.herokuapp.com/dish/adddish', $scope.newDish).
            success(function(data, status, headers, config) {
              // this callback will be called asynchronously
              // when the response is available
              $scope.newDish.dish_name = '';
              jQuery("#dishModal").modal('hide');
              $scope.loadStoreDishes($scope.currentStore);
            }).
            error(function(data, status, headers, config) {
              // called asynchronously if an error occurs
              // or server returns response with an error status.
            });         
        };
      }

      $scope.updateStore = function(store){
        if(store){
          $http.post('http://quamenu-api.herokuapp.com/store/updatestore/'+store._id, store).
            success(function(data, status, headers, config) {
              // this callback will be called asynchronously
              // when the response is available
              jQuery("#storeEditModal").modal('hide');
            }).
            error(function(data, status, headers, config) {
              // called asynchronously if an error occurs
              // or server returns response with an error status.
            });         
        };
      }

      $scope.updateDish = function(dish){
        if(dish){
          $http.post('http://quamenu-api.herokuapp.com/dish/updatedish/'+dish._id, dish).
            success(function(data, status, headers, config) {
              // this callback will be called asynchronously
              // when the response is available
              jQuery("#dishEditModal").modal('hide');
            }).
            error(function(data, status, headers, config) {
              // called asynchronously if an error occurs
              // or server returns response with an error status.
            });         
        };
      }
  }]);