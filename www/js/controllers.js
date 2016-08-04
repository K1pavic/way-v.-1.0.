myApp.controller('MainController', ['$scope', function ($scope) {

    $scope.platform = ionic.Platform.platform();



}]);

myApp.controller('LoginCtrl', ['$scope', 'DataFctr', function ($scope, DataFctr) {


    $scope.data = DataFctr.data;

}]);

myApp.controller('SignupCtrl', ['$scope', '$state', 'DataFctr', function ($scope, $state, DataFctr) {

    $scope.data = DataFctr.data; // Controller binding with the service to use service data to comunicate with the server.

    $scope.customRegistration = function () {

        Ionic.Auth.signup(DataFctr.data).then(function () {

            $state.go('tab.home');

            var options = { 'remember': true };
            Ionic.Auth.login('basic', options, DataFctr.data).then(function () {

                console.log('Login Success');

                var user = Ionic.User.current();

                if (user.isAuthenticated()) {
                    console.log("The user is loged in!" + user);

                    user.set('addres', 'K.Tomislava 50');
                    user.save();

                } else {
                    console.log('somethign went worng');
                }

            }, function (error) {
            
                console.log('Login Failed');

            });

            $scope.authFailure = function () {
                console.log("user isn't loed in!");
            };

        }, function (error) {
               
            if (error.errors[0] == 'conflict_username') {

                console.log("Username is used");
       
            };
        });
     };
}]);

myApp.controller('ProfileCtrl', ['$scope', 'DataFctr', function ($scope, DataFctr) {

    $scope.data = DataFctr.data;

}]);

myApp.controller('MeetingCtrl', ['$scope', 'DataFctr', function ($scope, DataFctr) {

    $scope.data = DataFctr.data;

}]);

myApp.controller('NewMeetingCtrl', ['$scope', 'DataFctr', function ($scope, DataFctr) {

    $scope.data = DataFctr.data;

}]);

myApp.controller('LocationSettingsCtrl', ['$scope', 'DataFctr', function ($scope, DataFctr) {

    $scope.location = {
        checked: true
    };

    $scope.toggleChange = function () {
        $scope.location.checked;

        console.log($scope.location.checked);
    };

}]);