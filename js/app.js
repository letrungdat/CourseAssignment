var app = angular.module('myApp', ['firebase', 'ngRoute', 'ngAnimate']);
app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'template/home.html',
            controller: 'homeController'
        })
        .when('/news', {
            templateUrl: 'template/news.html',
            controller: 'newsController'
        })
        .when('/team', {
            templateUrl: 'template/team.html',
            controller: 'teamController'
        }).when('/table', {
            templateUrl: 'template/table.html',
            controller: 'tableController'
        }).when('/player/:num', {
            templateUrl: 'template/player.html',
            controller: 'playerController'
        }).when('/calendar', {
            templateUrl: 'template/calendar.html',
            controller: 'calendarController'
        }).otherwise({
            redirectTo: '/'
        });
		}]);