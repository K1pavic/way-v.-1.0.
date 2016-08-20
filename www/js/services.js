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

    this.setData = function() {
        data.set('locationSharing', false);
        data.set('friends', ['Bob', false]);
        data.set('position', [0,0]);
        data.save();
        console.log(data);
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
}]);