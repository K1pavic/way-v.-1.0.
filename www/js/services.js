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
                url: ' https://api.ionic.io/users',
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

}]);