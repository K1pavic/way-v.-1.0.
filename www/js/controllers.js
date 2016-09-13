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

myApp.controller('MapCtrl', ['$scope', '$ionicLoading', '$ionicGesture', '$ionicPopup', '$timeout', '$interval', 'AuthService', function ($scope, $ionicLoading, $ionicGesture, $ionicPopup, $timeout, $interval, AuthService) {

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
    var element = angular.element(document.querySelector('#map'));
    var timer;

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
        AuthService.updateCurrent(Latitude, Longitude); // Updates current user location in database
        getMap(Latitude, Longitude);

    }

    // Get map by using coordinates

    function getMap(latitude, longitude) {

        var meetingCheck = $scope.data.meeting[2];
        var add = true;
        var mapOptions = {
            center: new google.maps.LatLng(0, 0),
            zoom: 1,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        map = new google.maps.Map
        (document.getElementById("map"), mapOptions);

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

        AuthService.addFriends(add); // Adds friends to map

        // Add and remove meeting marker on hold

        var icon = {
            url: "img/meeting2.png",
            scaledSize: new google.maps.Size(40, 40),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(20, 20)
        };

        if (meetingCheck) {
            placeMarker($scope.data.meeting[1]);
        };

        $ionicGesture.on('hold', function (e) {
            $scope.$apply(function () {
                console.log('hold');
                if (!$scope.data.meeting[2]) {
                    console.log($scope.data.meeting[2] + "1");
                    markerInterval(true);
                    listenerHandle = google.maps.event.addListener(map, 'mouseup', function (event) {
                        var myPopup = $ionicPopup.show({
                            template: '<input type="time" ng-model="data.meetingTime">',
                            title: 'Enter Meeting Time',
                            scope: $scope,
                            buttons: [
                              { text: 'Cancel' },
                              {
                                  text: '<b>Save</b>',
                                  type: 'button-positive',
                                  onTap: function (e) {
                                      if (!$scope.data.meetingTime) {
                                          //don't allow the user to close unless he enters wifi password
                                          e.preventDefault();
                                      } else {
                                          placeMarker(event.latLng);
                                          markerInterval(false)
                                          return $scope.data.meetingTime;
                                      }
                                  }
                              }
                            ]
                        });
                    });
                }
                else if ($scope.data.meeting[2] == true && $scope.data.meeting[0] == $scope.details.username) {
                    markerInterval(true);
                    if ($scope.used) {
                        meeting.setMap(null);
                        $scope.data.meeting[0] = "";
                        $scope.data.meeting[1] = null;
                        $scope.data.meeting[2] = false;
                        console.log(data);
                        AuthService.addMeeting(false);
                        $scope.used = false;
                    }
                    markerInterval(false);
                }
                else {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Meeting',
                        template: 'A meeting is already set by one of your friends!'
                    });
                    $timeout(function() {
                        alertPopup.close(); //close the popup after 3 seconds for some reason
                    }, 3000);
                };
            });
        }, element);

        function placeMarker(location) {
            if (!$scope.used) {
                console.log("Will create meeting in DB");
                meeting = new google.maps.Marker({
                    position: location,
                    icon: icon,
                    scale: 1,
                    map: map
                });
                meeting.addListener('click', function () {
                    infowindow.open(map, meeting);
                });
                $scope.used = true;
                if ($scope.data.meeting[0] == "") {
                    $scope.data.meeting[0] = $scope.details.username;
                }
                var meetingTimeSet = $scope.data.meetingTime;
                console.log(meetingTimeSet);
                var contentString = "Meeting created by " + $scope.data.meeting[0] + "</ br>" + " " + meetingTimeSet;
                var infowindow = new google.maps.InfoWindow({
                    content: contentString
                });
                AuthService.currentUser();
                data.data.data.meeting[1] = location;
                data.data.data.meeting[2] = true;
                data.data.data.meeting[0] = $scope.data.meeting[0]
                data.save();
                AuthService.addMeeting(true);
                google.maps.event.removeListener(listenerHandle);
            }
        }

        markerInterval(false);
        //var interval = $interval(function () {
        //    AuthService.addFriends(false);
        //    console.log("Update!");
        //}, 3000);
    };

    var markerInterval = function (stop) {
        if (stop) {
            $interval.cancel(timer);
        } else {
            timer = $interval(function() {
                AuthService.addFriends(false);
                console.log("Working on updates!");
            }, 5000);
        }
    };

    // Update current user's marker

    var updateMarker = function(updateLat, updateLong) {

        var updatedlatLong = new google.maps.LatLng(updateLat, updateLong);
        marker.setPosition(updatedlatLong);
        AuthService.updateCurrent(updateLat, updateLong); // Updates current user location in database
        console.log("Position updated!");

    };

    // Success callback for watching your changing position

    var Updatesuccess = function (position) {
        var updatedLatitude = position.coords.latitude;
        var updatedLongitude = position.coords.longitude;

        if (updatedLatitude != Latitude || updatedLongitude != Longitude) {

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
    };

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
