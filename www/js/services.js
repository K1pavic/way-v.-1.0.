myApp.service('AuthService', function ($q) {

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
            console.log("Signup failed!");
        });

        return deferred.promise;
    };

    this.doLogout = function () {
        Ionic.Auth.logout();
        console.log("Logged out!");
    };

    this.currentUser = function () {

        data = Ionic.User.current();

    };

});