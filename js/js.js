		var app = angular.module('myApp', ['firebase', 'ngRoute']);
		app.config(['$routeProvider', function ($routeProvider) {
		    $routeProvider
		        .when('/', {
		            templateUrl: 'template/home.html',
		            controller: 'homeController'
		        })
		        .when('/team', {
		            templateUrl: 'template/team.html',
		            controller: 'teamController'
		        }).otherwise({
		            redirectTo: '/'
		        });
		}]);
		app.controller('MyController', ['$scope', function ($scope) {
		    $scope.page = {};
		    $scope.page.title = "";
		    $scope.menuClick = function () {
		        $('#container').toggleClass('open');
		    };
	    }]);
		app.controller('homeController', ['$scope', '$firebaseArray', function ($scope, $firebaseArray) {
		    var ref = new Firebase("https://cscassignment.firebaseio.com/");
		    $scope.page.title = "HOME";
		    $scope.news = $firebaseArray(ref.child('news'));
		    $scope.teamCalendars = $firebaseArray(ref.child('teamCalendar'));
	    }]);
		app.controller('teamController', ['$scope', '$firebaseArray', function ($scope, $firebaseArray) {
		    var ref = new Firebase("https://cscassignment.firebaseio.com/");
		    $scope.page.title = "SQUAD";
		    $scope.goalkeepers = $firebaseArray(ref.child('teamMembers').child('goalKeeper'));
		    $scope.defenders = $firebaseArray(ref.child('teamMembers').child('Defender'));
		    $scope.midfielders = $firebaseArray(ref.child('teamMembers').child('Midfielder'));
		    $scope.strikers = $firebaseArray(ref.child('teamMembers').child('Striker'));
	    }]);