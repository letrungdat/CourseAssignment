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
		        }).when('/table', {
		            templateUrl: 'template/table.html',
		            controller: 'tableController'
		        }).when('/player/:num', {
		            templateUrl: 'template/player.html',
		            controller: 'playerController'
		        }).otherwise({
		            redirectTo: '/'
		        });
		}]);
		app.controller('MyController', ['$scope', '$firebaseArray', function ($scope, $firebaseArray) {
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
		app.controller('playerController', ['$scope', '$firebaseArray', '$routeParams', function ($scope, $firebaseArray, $routeParams) {
		    $scope.page.title = "PLAYER DETAIL"
		    var ref = new Firebase("https://cscassignment.firebaseio.com/");
		    var number = $routeParams.num;
		    $scope.players = $firebaseArray(ref.child('teamMembers').orderByChild('number').equalTo(parseInt(number)));
	    }]);
		app.controller('teamController', ['$scope', '$firebaseArray', function ($scope, $firebaseArray) {
		    var ref = new Firebase("https://cscassignment.firebaseio.com/");
		    $scope.page.title = "SQUAD";
		    $scope.goalkeepers = $firebaseArray(ref.child('teamMembers').orderByChild('type').equalTo('G'));
		    $scope.defenders = $firebaseArray(ref.child('teamMembers').orderByChild('type').equalTo('D'));
		    $scope.midfielders = $firebaseArray(ref.child('teamMembers').orderByChild('type').equalTo('M'));
		    $scope.strikers = $firebaseArray(ref.child('teamMembers').orderByChild('type').equalTo('S'));
	    }]);
		app.controller('tableController', ['$scope', '$firebaseArray', function ($scope, $firebaseArray) {
		    $scope.page.title = "TABLE";
		    var ref = new Firebase("https://cscassignment.firebaseio.com/leagueTable");
		    $scope.table = $firebaseArray(ref.orderByChild('position'));
}]);