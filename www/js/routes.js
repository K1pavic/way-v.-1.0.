myApp.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/");

    $stateProvider
      .state('get-started', {
          url: '/',
          templateUrl: 'views/get-started.html'
      })
    .state('sign-up', {
        url: '/sign-up',
        templateUrl: 'views/sign-up.html'
    })
    .state('log-in', {
        url: '/log-in',
        templateUrl: 'views/log-in.html'
    })

    .state('tab', {
        url: "/tab",
        templateUrl: "templates/tab.html"
    })

    // Each tab has its own nav history stack:

    .state('tab.home', {
        cache: false,
        url: '/home',
        views: {
            'tab-home': { templateUrl: 'templates/tab-home.html' }
        }
    })
    .state('tab.map', {
        url: '/map',
        views: {
            'tab-map': { templateUrl: 'templates/tab-map.html' }
        }
    })
    .state('tab.new-meeting', {
        url: '/new-meeting',
        views: {
            'tab-new-meeting': { templateUrl: 'templates/tab-new-meeting.html' }
        }
    })

    .state('tab.more', {
        url: '/more',
        views: {
            'tab-more': { templateUrl: 'templates/tab-more.html' }
        }
    })

    .state('tab.location-settings', {
        url: '/location-settings',
        views: {
            'tab-more': { templateUrl: 'templates/more-location-settings.html' }
        }
    })

    .state('tab.add-friends', {
        cache: false,
        url: '/add-friends',
        views: {
            'tab-more': { templateUrl: 'templates/more-add-friends.html' }
        }
    })


});