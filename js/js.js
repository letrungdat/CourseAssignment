var app = angular.module('MyApp', ["firebase"]);

app.controller('MyController', ['$scope', "$firebaseArray", function ($scope, $firebaseArray) {
    var ref = new Firebase("https://cscassignment.firebaseio.com/");
    $scope.news = $firebaseArray(ref.child('news'));
    $scope.teamCalendars = $firebaseArray(ref.child('teamCalendar'));
    $scope.menuClick = function () {
        $('#container').toggleClass('open');
    };
    }]);