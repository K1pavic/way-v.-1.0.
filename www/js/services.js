myApp.service('AuthService', ['$q', '$http', function($q, $http) {

    this.doLogin = function(user) {
        var deferred = $q.defer(),
            authProvider = 'basic',
            authSettings = {
                'remember': false
            };

        Ionic.Auth.login(authProvider, authSettings, user)
        .then(function () {
            deferred.resolve();
            console.log("Login succeded!");
        }, function () {
            console.log("Login failed!");
        });

        return deferred.promise;
    };

    this.doSignup = function(user) {
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
            console.log("Signup failed!");
        });

        return deferred.promise;
    };

    this.doLogout = function() {
        Ionic.Auth.logout();
        console.log("Logged out!");
    };

    this.currentUser = function() {

        data = Ionic.User.current();
        
    };

    this.setData = function () {

        var listOffriends = {};
        data.set('locationSharing', false);
        data.set('friends', listOffriends);
        data.set('position', [0,0]);
        data.save();
    };

    this.getAll = function() {
        return $http({
                method: 'GET',
                url: "https://api.ionic.io/users",
                headers: {
                    'Authorization': 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhOTUxMzQ4Yi1hNmNhLTQ0OTctYjllMC1jMDk0ZmY3OTUxMjUifQ.lUsX1ByZ4v5A2RChYEBHZLAc10lteKUyS-Kd2XTgTzY'
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
                url: "https://api.ionic.io/users/"+newFriend.uuid+"/custom",
                data: addCustom,
                headers: {
                    'Authorization': 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhOTUxMzQ4Yi1hNmNhLTQ0OTctYjllMC1jMDk0ZmY3OTUxMjUifQ.lUsX1ByZ4v5A2RChYEBHZLAc10lteKUyS-Kd2XTgTzY'
                },
                })
                .then(function successCallback(response) {
                    console.log(response);
                    console.log("Updated!");
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
        console.log("Saved new position!");

        this.updateDistant();

    };

    this.updateDistant = function () {

        var friends = data.data.data.friends;
        for (var friendName in friends) {
            console.log("Hello " + friendName);
            var friendID = (friendName, friends[friendName])[0];
            this.syncData(friendID);
        };
    };

    this.syncData = function (friendID) {

        $http({
            method: 'GET',
            url: "https://api.ionic.io/users/" + friendID + "/custom",
            headers: {
                'Authorization': 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhOTUxMzQ4Yi1hNmNhLTQ0OTctYjllMC1jMDk0ZmY3OTUxMjUifQ.lUsX1ByZ4v5A2RChYEBHZLAc10lteKUyS-Kd2XTgTzY'
            },
        })
            .then(function successCallback(response) {
                var currentPos = data.data.data.position;
                console.log("Getting friends data..." + friendID);
                response.data.data.friends[data.details.username][1] = currentPos;
                var updatePos = response.data.data;

                $http({
                    method: 'PUT',
                    url: "https://api.ionic.io/users/" + friendID + "/custom",
                    data: updatePos,
                    headers: {
                        'Authorization': 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhOTUxMzQ4Yi1hNmNhLTQ0OTctYjllMC1jMDk0ZmY3OTUxMjUifQ.lUsX1ByZ4v5A2RChYEBHZLAc10lteKUyS-Kd2XTgTzY'
                    },
                })
                .then(function successCallback(response) {
                    console.log("Updated! " + friendID);
                }, function errorCallback(error) {
                    console.log("Somehting went wrong!")
                    console.log(error);
                });

            }, function errorCallback(error) {
                console.log("Somehting went wrong!")
                console.log(error);
            });

    };

}]);