myApp.config(function ($ionicConfigProvider, $stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/");

    $stateProvider
      .state('get-started', {
          url: '/',
          templateUrl: 'views/get-started.html'
      })

    .state('sign-up', {
        url: '/sign-up',
        templateUrl: 'views/sign-up.html',
        controller: 'SignupCtrl'
    })

    .state('log-in', {
        url: '/log-in',
        templateUrl: 'views/log-in.html',
        controller: 'LoginCtrl'
    })

    .state('tab', {
        cache: false,
        url: "/tab",
        templateUrl: "templates/tab.html"
    })

    // Each tab has its own nav history stack:

    .state('tab.home', {
        url: '/home',
        views: {
            'tab-home': {
                templateUrl: 'templates/tab-home.html',
                controller: 'ProfileCtrl'
            }
        }
    })

    .state('tab.map', {
        url: '/map',
        views: {
            'tab-map': {
                templateUrl: 'templates/tab-map.html',
                controller: 'MapCtrl'
            }
        }
    })

    .state('tab.new-meeting', {
        url: '/new-meeting',
        views: {
            'tab-new-meeting': { templateUrl: 'templates/tab-new-meeting.html' }
        }
    })

    .state('tab.new-meeting-created', {
        url: '/created-meeting',
        views: {
            'tab-new-meeting': { templateUrl: 'templates/new-meeting-created.html' }
        }
    })

    .state('tab.more', {
        url: '/more',
        views: {
            'tab-more': {
                templateUrl: 'templates/tab-more.html',
                controller: 'MoreCtrl'
            }
        }
    })

    .state('tab.location-settings', {
        url: '/location-settings',
        views: {
            'tab-more': {
                templateUrl: 'templates/more-location-settings.html',
                controller: 'LocationSettingsCtrl'
            }
        }
    })

    .state('tab.add-friends', {
        url: '/add-friends',
        views: {
            'tab-more': {
                templateUrl: 'templates/more-add-friends.html',
                controller: 'AddFriends'
            }
        }
    })

});