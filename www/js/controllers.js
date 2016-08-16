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
            var data = Ionic.User.current();
            $scope.data = data.custom;
            data.set('locationSharing', false);
            data.set('friends', ['Bob']);
            data.save();
            $state.go('tab.home');
            $ionicLoading.hide();
        }, function (err) {
            // error
            $scope.errors = err;
            $ionicLoading.hide();
        });
    };
}]);

myApp.controller('ProfileCtrl', ['$scope', 'AuthService', function ($scope, AuthService) {

    AuthService.currentUser();
    $scope.data = data.details;
    
}]);

myApp.controller('MapCtrl', ['$scope', 'AuthService', function ($scope, AuthService) {

    AuthService.currentUser();

}]);

myApp.controller('MeetingCtrl', ['$scope', 'AuthService', function ($scope, AuthService) {


}]);

myApp.controller('NewMeetingCtrl', ['$scope', function ($scope) {



}]);

myApp.controller('MoreCtrl', ['$scope', '$state', 'AuthService', function ($scope, $state, AuthService) {

    $scope.current_user = Ionic.User.current();

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