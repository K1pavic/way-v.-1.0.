myApp.controller('MainController', ['$scope', function ($scope) {

    $scope.platform = ionic.Platform.platform();

}]);

myApp.controller('LoginCtrl', ['$scope', '$state', '$ionicLoading', 'AuthService', function ($scope, $state, $ionicLoading, AuthService) {

    $scope.login = function (user) {
        $ionicLoading.show({
            template: 'Loging in ...'
        });

        AuthService.doLogin(user)
        .then(function (user) {
            // success
            $state.go('tab.home');
            $ionicLoading.hide();
        }, function (err) {
            // error
            $scope.errors = err;
            $ionicLoading.hide();
        });
    };
}]);

myApp.controller('SignupCtrl', ['$scope', '$state', '$ionicLoading', 'AuthService', function ($scope, $state, $ionicLoading, AuthService) {

    $scope.signup = function(user) {
        $ionicLoading.show({
            template: 'Signing up ...'
        });

        AuthService.doSignup(user)
        .then(function (user) {
            // success
            AuthService.currentUser();
            AuthService.setData();
            $state.go('tab.home');
            $ionicLoading.hide();
        }, function (err) {
            // error
            $scope.errors = err;
            $ionicLoading.hide();
        });
    };
}]);

myApp.controller('ProfileCtrl', ['$scope', '$http', 'AuthService', function ($scope, $http, AuthService) {

    AuthService.currentUser();
    $scope.data = data.details;

}]);

myApp.controller('MapCtrl', ['$scope', '$ionicLoading', 'AuthService', function ($scope, $ionicLoading, AuthService) {

    AuthService.currentUser();
    $scope.data = data.data.data;

    var Latitude = undefined;
    var Longitude = undefined;
    var options = { enableHighAccuracy: true }; // If not true, app is not working on mobile devices
    var marker;

    // Get geo coordinates

    function initMap() {

        $ionicLoading.show({
            template: 'Loading data ...'
        });

        // Known bug requires 2 calls, so the second can work properly ...
        navigator.geolocation.getCurrentPosition(function () { }, function () { }, {});
        navigator.geolocation.getCurrentPosition
        (onMapSuccess, onMapError, options);
    }

    // Success callback for get geo coordinates

    var onMapSuccess = function (position) {

        Latitude = position.coords.latitude;
        Longitude = position.coords.longitude;

        $ionicLoading.hide();
        getMap(Latitude, Longitude);

    }

    // Get map by using coordinates

    function getMap(latitude, longitude) {

        var mapOptions = {
            center: new google.maps.LatLng(0, 0),
            zoom: 1,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        map = new google.maps.Map
        (document.getElementById("map"), mapOptions);

        AuthService.updateCurrent(latitude, longitude); // Updates current user location in database

        var latLong = new google.maps.LatLng(latitude, longitude);
        marker = new google.maps.Marker({
            position: latLong
        });

        marker.setMap(map);
        map.setZoom(15);
        map.setCenter(marker.getPosition());

        // Adding friends markers to map

        var friendsData = $scope.data.friends;

        for (var friendsName in friendsData) {
            console.log((friendsName, friendsData[friendsName])[1]);

            var latID = (friendsName, friendsData[friendsName])[1][0];
            var longID = (friendsName, friendsData[friendsName])[1][1];

            var latiLongi = new google.maps.LatLng(latID, longID);

            var friendMarker = new google.maps.Marker({
                position: latiLongi
            });

            friendMarker.setMap(map);
            
        }
    }

    // Update current user's marker

    var updateMarker = function(updateLat, updateLong) {

        var updatedlatLong = new google.maps.LatLng(updateLat, updateLong);
        marker.setPosition(updatedlatLong);
        console.log("Position updated!");

    };

    // Success callback for watching your changing position

    var Updatesuccess = function (position) {

        var updatedLatitude = position.coords.latitude;
        var updatedLongitude = position.coords.longitude;

        console.log(updatedLatitude);
        console.log(updatedLongitude);

        if (updatedLatitude != Latitude || updatedLongitude != Longitude) {

            AuthService.updateCurrent(updatedLatitude, updatedLongitude); // Updates current user location in database
            Latitude = updatedLatitude;
            Longitude = updatedLongitude;
            updateMarker(updatedLatitude, updatedLongitude);

        }
    }

    // Error callback

    function onMapError(error) {
        console.log('code: ' + error.code + '\n' +
            'message: ' + error.message + '\n');
    }

    // Watching for current user's position changes

    var id;

    id = navigator.geolocation.watchPosition(Updatesuccess, onMapError, options);

    // Initialize map when device is ready

    ionic.Platform.ready(function () {
        initMap();
    });

}]);

myApp.controller('MoreCtrl', ['$scope', '$state', 'AuthService', function ($scope, $state, AuthService) {

    $scope.logout = function () {
        AuthService.doLogout();
        $state.go('get-started');
    }

}]);

myApp.controller('LocationSettingsCtrl', ['$scope', 'AuthService', function ($scope, AuthService) {

    AuthService.currentUser();
    $scope.data = data.data.data;

    $scope.toggleChange = function () {
        $scope.data.locationSharing;
        data.save();
    };

}]);

myApp.controller('AddFriends', ['$scope', 'AuthService', function ($scope, AuthService) {

    $scope.addFriend = function(friend) {
        $scope.friend = friend;

        AuthService.getAll()
        .then(function success(users) {
            $scope.users = users;
            var all = $scope.users.data.data;
            var i;
            for (i = 0; i < all.length; i++) {
                if (all[i].details.username === $scope.friend) {
                    var newFriend = all[i];
                    AuthService.currentUser();
                    AuthService.setNewFriend(newFriend);
                };
            };
        }, function error() {
            console.log("Something went wrong!");
        });
    };

}]);

