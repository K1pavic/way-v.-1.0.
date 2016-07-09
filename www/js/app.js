// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var myApp = angular.module('myApp', ['ionic']);

myApp.controller('mainController', ['$scope', function ($scope) {

}]);

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
        abstract: true,
        templateUrl: "templates/tab.html"
    })

    // Each tab has its own nav history stack:

    .state('tab.home', {
        url: '/home',
        views: {
            'tab-home': {templateUrl: 'templates/tab-home.html'}
        }
    })
    .state('tab.map', {
        url: '/map',
        views: {
            'tab-map': {templateUrl: 'templates/tab-map.html'}
        }
    })
    .state('tab.new-meeting', {
        url: '/new-meeting',
        views: {
            'tab-new-meeting': {templateUrl: 'templates/tab-new-meeting.html'}
        }
    })
    .state('tab.more', {
        url: '/more',
        views: {
            'tab-more': {templateUrl: 'templates/tab-more.html'}
        }
    })

});

myApp.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
});
