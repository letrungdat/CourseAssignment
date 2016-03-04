var app = angular.module('myApp', ['firebase', 'ngRoute','ngAnimate','ui.bootstrap']);
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
        }).when('/calendar', {
            templateUrl: 'template/calendar.html',
            controller: 'calendarController'
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
$scope.teamCalendars = $firebaseArray(ref.child('teamCalendar').orderByChild('date').startAt(moment().format('DD/MM/YYYY')).limit(3));
	    }]);
app.controller('playerController', ['$scope', '$firebaseArray', '$routeParams', function ($scope, $firebaseArray, $routeParams) {
    $scope.page.title = "PLAYER DETAIL";
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
app.controller("calendarController", ['$scope', '$firebaseArray', function ($scope, $firebaseArray) {
    $scope.page.title = "Calendar";
    var matchs = {};
    var typeCalendar=true;
    var ref = new Firebase("https://cscassignment.firebaseio.com/teamCalendar");
    ref.on("value", function (snapshot) {
        matchs = snapshot.val();
    });
    $scope.teamCalendars = $firebaseArray(ref.orderByChild('date').startAt(moment().format('DD/MM/YYYY')));
    $scope.day = moment().date;
    $scope.selected = _removeTime($scope.selected || moment());
    $scope.month = $scope.selected.clone();
    var start = $scope.selected.clone();
    start.date(1);
    _removeTime(start.day(0));
    _buildMonth($scope, start, $scope.month, matchs);
    $scope.select = function (day) {
        $scope.selected = day.date;
    };
    $scope.changeView=function(type){
        if(type==='calendar'){
            if(!typeCalendar){
                $('#calendar-view').toggleClass('show');
                $('#list-view').toggleClass('show');
                typeCalendar=true;
            }
        }else{
             if(typeCalendar){
                $('#calendar-view').toggleClass('show');
                $('#list-view').toggleClass('show');
                 typeCalendar=false;
            }
        }
    };
    $scope.next = function () {
        var next = $scope.month.clone();
        _removeTime(next.month(next.month() + 1).date(1).day(0));
        $scope.month.month($scope.month.month() + 1);
        _buildMonth($scope, next, $scope.month, matchs);
    };

    $scope.previous = function () {
        var previous = $scope.month.clone();
        _removeTime(previous.month(previous.month() - 1).date(1).day(0));
        $scope.month.month($scope.month.month() - 1);
        _buildMonth($scope, previous, $scope.month, matchs);
    };
}]);
function _removeTime(date) {
    return date.hour(0).minute(0).second(0).millisecond(0);
}

function _buildMonth(scope, start, month, matchs) {
    scope.weeks = [];
    var done = false,
        date = start.clone(),
        monthIndex = date.month(),
        count = 0;
    while (!done) {
        scope.weeks.push({
            days: _buildWeek(date.clone(), month, matchs)
        });
        date.add(1, "w");
        done = count++ > 2 && monthIndex !== date.month();
        monthIndex = date.month();
    }
}

function _buildWeek(date, month, matchs) {
    var days = [];
    for (var i = 0; i < 7; i++) {
        var haveMatch = checkMatch(date, matchs);
        days.push({
            name: date.format("dd").substring(0, 1),
            number: date.date(),
            isCurrentMonth: date.month() === month.month(),
            isToday: date.isSame(new Date(), "day"),
            date: date,
            haveMatch: haveMatch,
            match: getMatch(date, matchs)
        });
        date = date.clone();
        date.add(1, "d");
    }
    return days;
}

function checkMatch(date, matchs) {
    var flag = false;
    for (var match in matchs) {
        if (!matchs.hasOwnProperty(match)) continue;
        var obj = matchs[match].date;
        if (date.isSame(moment(obj, 'DD/MM/YYYY'))) {
            flag = true;
        }
    }
    return flag;
}

function getMatch(date, matchs) {
    for (var match in matchs) {
        if (!matchs.hasOwnProperty(match)) continue;
        var obj = matchs[match].date;
        if (date.isSame(moment(obj, 'DD/MM/YYYY'))) {
            return matchs[match];
        }
    }
    return "";
}