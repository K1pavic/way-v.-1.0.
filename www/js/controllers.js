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

myApp.controller('MapCtrl', ['$scope', '$ionicLoading', '$ionicGesture', 'AuthService', function ($scope, $ionicLoading, $ionicGesture, AuthService) {

    AuthService.currentUser();
    $scope.details = data.details;
    $scope.data = data.data.data;
    $scope.used = false;


    var Latitude = undefined;
    var Longitude = undefined;
    var options = {enableHighAccuracy: true }; // If not true, app is not working on mobile devices
    var marker;
    var meeting;
    var listenerHandle;

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

        var meetingCheck = $scope.data.meeting[2];

        console.log(meetingCheck + "is trueee");

        var mapOptions = {
            center: new google.maps.LatLng(0, 0),
            zoom: 1,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        map = new google.maps.Map
        (document.getElementById("map"), mapOptions);

        var add = true;
        AuthService.addFriends(add); // Adds friends to map

        AuthService.updateCurrent(latitude, longitude); // Updates current user location in database

        var latLong = new google.maps.LatLng(latitude, longitude);
        marker = new google.maps.Marker({
            position: latLong,
            icon: {
                path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
                fillColor: "#387ef5",
                fillOpacity: 1,
                scale: 1,
            },
            title: "Me",
            zIndex: 100
        });

        marker.setMap(map);
        map.setZoom(15);
        map.setCenter(marker.getPosition());

        // Add and remove meeting marker on hold

        var icon = {
            url: "img/meeting.png",
            scaledSize: new google.maps.Size(40, 40),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(20, 20)
        };

        if (meetingCheck) {
            console.log("Hello");
            placeMarker($scope.data.meeting[1]);
        };

        var element = angular.element(document.querySelector('#map'));

        $ionicGesture.on('hold', function (e) {
            $scope.$apply(function () {
                console.log('hold');
                if (!$scope.data.meeting[2]) {
                    console.log($scope.data.meeting[2] + "1");
                    listenerHandle = google.maps.event.addListener(map, 'mouseup', function (event) {
                        placeMarker(event.latLng);
                    });
                }
                else if ($scope.data.meeting[2] == true && $scope.data.meeting[0] == $scope.details.username) {
                    if ($scope.used) {
                        meeting.setMap(null);
                        $scope.data.meeting[0] = "";
                        $scope.data.meeting[1] = null;
                        $scope.data.meeting[2] = false;
                        AuthService.addMeeting(false);
                        $scope.used = false;
                    }
                }
                else {
                    alert("A meeting is already set by one of your friends!");
                }
            });
        }, element);

        function placeMarker(location) {
            if (!$scope.used) {
                    meeting = new google.maps.Marker({
                        position: location,
                        icon: icon,
                        scale: 1,
                        map: map
                    });
                    var contentString = "Meeting created by " + $scope.data.meeting[0];
                    var infowindow = new google.maps.InfoWindow({
                        content: contentString
                    });
                meeting.addListener('click', function () {
                    infowindow.open(map, meeting);
                });
                $scope.used = true;
                if ($scope.data.meeting[0] == "") {
                    $scope.data.meeting[0] = $scope.details.username;
                }        
                $scope.data.meeting[1] = location;
                $scope.data.meeting[2] = true;
                AuthService.addMeeting(true);
                google.maps.event.removeListener(listenerHandle);
            }
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

        //console.log(updatedLatitude);
        //console.log(updatedLongitude);

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
        $ionicLoading.hide();
        alert("Something went wrong, please log in again!");
    }

    // Initialize map when device is ready

    ionic.Platform.ready(function () {
        initMap();
    });

    // Watching for current user's position changes

    var id;

    id = navigator.geolocation.watchPosition(Updatesuccess, onMapError, options);

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

