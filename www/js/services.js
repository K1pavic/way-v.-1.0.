myApp.service('AuthService', ['$q', '$http', '$ionicLoading', '$rootScope', '$ionicPopup', '$timeout', function ($q, $http, $ionicLoading, $rootScope, $ionicPopup, $timeout) {

    var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJhMmM4YWQyNS0yN2ZiLTRiMzUtOTVkNy1kMTcxZjU5OWQ5YTEifQ.R2KIWtH0vZW_htEHeQmcUK_j3-xw3piD_cSZaRaC-zA';
    var friendObj = {};

    var friendMarker;

    this.doLogin = function (user) {
        var deferred = $q.defer(),
            authProvider = 'basic',
            authSettings = {
                'remember': false
            };

        Ionic.Auth.login(authProvider, authSettings, user)
        .then(function () {
            // success
            deferred.resolve();
            console.log("Login succeded!");
        }, function () {
            // error
            $ionicLoading.hide();
            console.log("Login failed!");

            var loginFailed = $ionicPopup.alert({
                title: 'Error',
                template: 'Something went wrong, please try again!'
            });
            $timeout(function () {
                loginFailed.close(); //close the popup after 3 seconds for some reason
            }, 3000);
        });

        return deferred.promise;
    };

    this.doSignup = function (user) {
        var deferred = $q.defer(),
            authService = this;

        Ionic.Auth.signup(user)
        .then(function () {
            console.log("Signup succeded!");
            // After signup we should automatically login the user
            authService.doLogin(user)
            .then(function () {
                // success
                deferred.resolve();
            }, function () {
                // error
                deferred.reject();
            });
        }, function () {
            // error
            console.log("Signup failed!");
            $ionicLoading.hide();

            var signupFailed = $ionicPopup.alert({
                title: 'Error',
                template: 'Something went wrong, please try again!'
            });
            $timeout(function () {
                signupFailed.close(); //close the popup after 3 seconds for some reason
            }, 3000);
        });

        return deferred.promise;
    };

    this.doLogout = function () {
        $rootScope.$broadcast('logUserOut');
        Ionic.Auth.logout();
        console.log("Logged out!");
    };

    this.currentUser = function (dataID) {

        data = Ionic.User.current(dataID);

    };

    this.setData = function () {

        var listOffriends = {};
        data.set('locationSharing', true);
        data.set('gps', true);
        data.set('friends', listOffriends);
        data.set('position', [0, 0]);
        data.set('meeting', ['', '', false]);
        data.save();
    };

    this.getAll = function () {
        return $http({
            method: 'GET',
            url: "https://api.ionic.io/users",
            headers: {
                'Authorization': 'Bearer ' + token
            },
        })
            .then(function successCallback(response) {
                return response;
            }, function errorCallback(error) {
                console.log("Somehting went wrong!")
                console.log(error);
            });
    };

    this.setNewFriend = function (newFriend) {

        // Add new friend to current users data
        var friendList = data.data.data.friends;
        friendList[newFriend.details.username] = [newFriend.uuid, newFriend.custom.position];
        data.set('friends', friendList);
        console.log('User ' + data.details.username + 's id is ' + data.id);
        data.save();

        // Add current user to distant user friend list
        var addFriendList = newFriend.custom.friends;
        addFriendList[data.details.username] = [data.id, data.data.data.position];
        var addCustom = newFriend.custom;

        return $http({
            method: 'PUT',
            url: "https://api.ionic.io/users/" + newFriend.uuid + "/custom",
            data: addCustom,
            headers: {
                'Authorization': 'Bearer ' + token
            },
        })
                .then(function successCallback(response) {
                    console.log(response);
                    console.log("Updated friends!");
                }, function errorCallback(error) {
                    console.log("Somehting went wrong!")
                    console.log(error);
                });
    };

    this.updateCurrent = function (lat, long) {

        var newPos = data.data.data.position;
        newPos[0] = lat;
        newPos[1] = long;
        data.save();
        this.updateDistant();

    };

    this.updateDistant = function () {

        this.currentUser();
        var friends = data.data.data.friends;
        for (var friendName in friends) {
            var friendID = (friendName, friends[friendName])[0];
            this.syncData(friendID, friendName);
        };
    };

    this.syncData = function (friendID, friendName) {

        $http({
            method: 'GET',
            url: "https://api.ionic.io/users/" + friendID + "/custom",
            headers: {
                'Authorization': 'Bearer ' + token
            },
        })
            .then(function successCallback(response) {
                var currentPos = data.data.data.position;
                response.data.data.friends[data.details.username][1] = currentPos;
                var updatePos = response.data.data;

                $http({
                    method: 'PUT',
                    url: "https://api.ionic.io/users/" + friendID + "/custom",
                    data: updatePos,
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                })
                .then(function successCallback(response) {

                }, function errorCallback(error) {
                    console.log("Somehting went wrong!")
                    console.log(error);
                });

            }, function errorCallback(error) {
                console.log("Somehting went wrong!")
                console.log(error);
            });

    };

    this.addMeeting = function (value) {

        this.currentUser();
        if (value) {
            console.log("Meeting will be added");
            data.set('meeting', [data.data.data.meeting[0], data.data.data.meeting[1], data.data.data.meeting[2], data.data.data.meeting[3]]);
            data.save();
        }
        else {
            console.log("Meeting will be deleted!!");
            data.set('meeting', ["", null, false, null]);
            data.save();
        }

        console.log("DB Changes!!!");
        var friends = data.data.data.friends;
        for (var friendName in friends) {
            var friendID = (friendName, friends[friendName])[0];
            this.syncMeeting(friendID);
        };
    };

    this.syncMeeting = function (friendID) {

        $http({
            method: 'GET',
            url: "https://api.ionic.io/users/" + friendID + "/custom",
            headers: {
                'Authorization': 'Bearer ' + token
            },
        })
            .then(function successCallback(response) {
                var meetingData = data.data.data.meeting;
                console.log(meetingData);
                response.data.data.meeting = meetingData;
                var updateMeeting = response.data.data;

                $http({
                    method: 'PUT',
                    url: "https://api.ionic.io/users/" + friendID + "/custom",
                    data: updateMeeting,
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                })
                .then(function successCallback(response) {
                    //console.log("Updated! " + friendID);
                }, function errorCallback(error) {
                    console.log("Somehting went wrong!")
                    console.log(error);
                });

            }, function errorCallback(error) {
                console.log("Somehting went wrong!")
                console.log(error);
            });

    };

    this.addFriends = function (update) {

        if (update) {
            this.currentUser();
            var friendsData = data.data.data.friends;
            for (var friendsName in friendsData) {

                var latID = (friendsName, friendsData[friendsName])[1][0];
                var longID = (friendsName, friendsData[friendsName])[1][1];

                var latiLongi = new google.maps.LatLng(latID, longID);

                friendMarker = new google.maps.Marker({
                    position: latiLongi,
                    title: friendsName,
                    label: friendsName[0],
                    zIndex: 0
                });

                friendMarker.setMap(map);

                friendObj[friendsName] = friendMarker;
            }
        } else {
            this.currentUser();

            Ionic.User.load(data.id).then(function success(loadedUser) {
                Ionic.User.current(loadedUser);
                data = Ionic.User.current();
            }, function error(error) {
                console.log(error);
            });

            var friendsDataUpdated = data.data.data.friends;
            for (var friendsNameUpdated in friendsDataUpdated) {

                var latIDnew = (friendsNameUpdated, friendsDataUpdated[friendsNameUpdated])[1][0];
                var longIDnew = (friendsNameUpdated, friendsDataUpdated[friendsNameUpdated])[1][1];
                var latiLongiNew = new google.maps.LatLng(latIDnew, longIDnew);

                friendObj[friendsNameUpdated].setPosition(latiLongiNew);
                console.log("Updating friends position!");
            }
        }
    };

}]);