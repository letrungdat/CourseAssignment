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
app.controller('MyController', ['$scope', '$firebaseArray', function ($scope, $firebaseArray) {
    $scope.teamName = "Manchester United";
    $scope.pageIcon = "image/team/manu-logo.png";
    $scope.leagueLogo = "image/Premier_League_logo.svg";
    $scope.leagueName = "Barclays Preimer League";
    $scope.page = {};
    $scope.page.title = "";
    $scope.menuClick = function () {
        $('#container').toggleClass('open');
    };
	    }]);
app.controller('homeController', ['$scope', '$firebaseArray', '$timeout', 'mainService', function ($scope, $firebaseArray, $timeout, MService) {
    var matchList = {};
    var ref = new Firebase("https://cscassignment.firebaseio.com/");
    $scope.page.title = "Home";
    $scope.news = $firebaseArray(ref.child('news').limitToFirst(5));
    //    $scope.teamCalendars = $firebaseArray(ref.child('teamCalendar').orderByChild('date').startAt(moment().format('DD/MM/YYYY')).limitToFirst(3));
    ref.child('teamCalendar').orderByChild('date').once('value', function (snapshot) {
        $timeout(function () {
            matchList = snapshot.val();
            for (var match in matchList) {
                matchList[match].date = moment(matchList[match].date, "DD/MM/YYYY").format("MMM DD");
                matchList[match].time = moment(matchList[match].time, "HH:mm").format("hh:mma");
            }
            $scope.teamCalendars = MService.sortByDate(matchList).slice(0, 3);
        });
    });
    var playersList = {};
    var arrayPlayers = [];
    ref.child('teamMembers').once('value', function (snapshot) {
        $timeout(function () {
            playersList = snapshot.val();
            arrayPlayers = MService.convertToArray(playersList);
            $scope.players = arrayPlayers;
        });
    });
	    }]);
app.controller('newsController', ['$scope', '$firebaseArray', 'mainService', '$timeout', function ($scope, $firebaseArray, MService, $timeout) {
    $scope.page.title = "News";
    var newsList = {};
    var array = [];
    var newsArray = [];
    var numItem = 4;
    var current = 3;
    var ref = new Firebase("https://cscassignment.firebaseio.com/");
    //    $scope.news = $firebaseArray(ref.child('news'));
    ref.child('news').once('value', function (snapshot) {
        $timeout(function () {
            newsList = snapshot.val();
            array = MService.convertToArray(newsList);
            for (i = 0; i < numItem; i++) {
                newsArray.push(array[i]);
            }
        });
    });
    $scope.news = newsArray;
    $scope.showMore = function () {
        var currentLength = current + numItem;
        if (current < array.length && currentLength < array.length) {
            for (var t = current + 1; t < currentLength; t++) {
                newsArray.push(array[t]);
                current++;
            }
        } else {
            if (current < array.length && currentLength > array.length) {
                for (var j = current + 1; j < array.length; j++) {
                    newsArray.push(array[j]);
                    current++;
                }
                $('.showMoreBtn').addClass('hide');
            } else {
                $('.showMoreBtn').addClass('hide');
            }
        }
    };
}]);
app.controller('playerController', ['$scope', '$firebaseArray', '$routeParams', function ($scope, $firebaseArray, $routeParams) {

    var ref = new Firebase("https://cscassignment.firebaseio.com/");
    var number = $routeParams.num;
    var player = {};
    $scope.players = $firebaseArray(ref.child('teamMembers').orderByChild('number').equalTo(parseInt(number)));
    ref.child('teamMembers').orderByChild('number').equalTo(parseInt(number)).on('value', function (snapshot) {
        player = snapshot.val();
        for (var p in player) {
            $scope.page.title = player[p].name;
        }
    });
	    }]);
app.controller('teamController', ['$scope', '$firebaseArray', function ($scope, $firebaseArray) {
    var ref = new Firebase("https://cscassignment.firebaseio.com/");
    $scope.page.title = "Squad";
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
app.controller("calendarController", ['$scope', '$firebaseArray', 'mainService', '$timeout', function ($scope, $firebaseArray, MService, $timeout) {
    $scope.page.title = "Calendar";
    var matchs = {};
    var matchList = {};
    var ref = new Firebase("https://cscassignment.firebaseio.com/teamCalendar");
    //    $scope.teamCalendars = $firebaseArray(ref.orderByChild('date').startAt(moment().format('DD/MM/YYYY')));
    $scope.day = moment().date;
    $scope.selected = MService._removeTime($scope.selected || moment());
    $scope.month = $scope.selected.clone();
    var start = $scope.selected.clone();
    start.date(1);
    MService._removeTime(start.day(0));
    $scope.select = function (day) {
        $scope.selected = day.date;
    };
    ref.once("value", function (snapshot) {
        matchs = snapshot.val();
        MService._buildMonth($scope, start, $scope.month, matchs);
    });
    ref.orderByChild('date').once('value', function (snapshot) {
        $timeout(function () {
            matchList = snapshot.val();
            for (var match in matchList) {
                matchList[match].date = moment(matchList[match].date, "DD/MM/YYYY").format("MMM DD");
                matchList[match].time = moment(matchList[match].time, "HH:mm").format("hh:mma");
            }
            $scope.teamCalendars = MService.sortByDate(matchList);
        });
    });
    $scope.changeView = function (type) {
        MService._changeView(type);
    };
    $scope.next = function () {
        var next = $scope.month.clone();
        MService._removeTime(next.month(next.month() + 1).date(1).day(0));
        $scope.month.month($scope.month.month() + 1);
        MService._buildMonth($scope, next, $scope.month, matchs);
    };

    $scope.previous = function () {
        var previous = $scope.month.clone();
        MService._removeTime(previous.month(previous.month() - 1).date(1).day(0));
        $scope.month.month($scope.month.month() - 1);
        MService._buildMonth($scope, previous, $scope.month, matchs);
    };
}]);
app.controller('carouselCtrl', ['$scope', '$firebaseArray', 'mainService', '$timeout', function ($scope, $firebaseArray, MService, $timeout) {
    var newsList = {};
    var arrayNews = [];
    var ref = new Firebase("https://cscassignment.firebaseio.com/");
    ref.child('news').once('value', function (snapshot) {
        $timeout(function () {
            newsList = snapshot.val();
            arrayNews = MService.convertToArray(newsList);
            $scope.items2 = arrayNews;
        });
    });

    }]);
app.directive("owlCarousel", function () {
        return {
            restrict: 'E',
            transclude: false,
            link: function (scope) {
                scope.initCarousel = function (element) {
                    // provide any default options you want
                    var defaultOptions = {};
                    var customOptions = scope.$eval($(element).attr('data-options'));
                    // combine the two options objects
                    for (var key in customOptions) {
                        defaultOptions[key] = customOptions[key];
                    }
                    // init carousel
                    $(element).owlCarousel(defaultOptions);
                };
            }
        };
    })
    .directive('owlCarouselItem', [function () {
        return {
            restrict: 'A',
            transclude: false,
            link: function (scope, element) {
                // wait for the last item in the ng-repeat then call init
                if (scope.$last) {
                    scope.initCarousel(element.parent());
                }
            }
        };
}]);
 app.service('mainService', function () {
     var typeCalendar = true;
     this._removeTime = function (date) {
         return date.hour(0).minute(0).second(0).millisecond(0);
     };
     this._buildMonth = function (scope, start, month, matchs) {
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
     };
     this._changeView = function (type) {
         if (type === 'calendar') {
             if (!typeCalendar) {
                 $('#calendar-view').toggleClass('show');
                 $('#list-view').toggleClass('show');
                 typeCalendar = true;
             }
         } else {
             if (typeCalendar) {
                 $('#calendar-view').toggleClass('show');
                 $('#list-view').toggleClass('show');
                 typeCalendar = false;
             }
         }
     };
     this.sortByDate = function (obj) {
         var array = $.map(obj, function (value, index) {
             return [value];
         });
         for (var i = 0; i < array.length; i++) {
             if (moment() > moment(array[i].date, "MMM DD")) {
                 array.splice(i, 1);
                 i--;
             }

         }
         array.sort(function (a, b) {
             if (moment(a.date, "MMM DD") < moment(b.date, "MMM DD")) return -1;
             if (moment(a.date, "MMM DD") > moment(b.date, "MMM DD")) return 1;
             return 0;
         });
         return array;
     };
     this.convertToArray=function(obj){
        return $.map(obj, function (value, index) {
             return [value];
         });
     };

     function _buildWeek(date, month, matchs) {
         var days = [];
         for (var i = 0; i < 7; i++) {
             var haveMatch = false;
             var venue = true;
             var match = "";
             if (checkMatch(date, matchs)) {
                 haveMatch = true;
                 match = getMatch(date, matchs);
             }
             days.push({
                 name: date.format("dd").substring(0, 1),
                 number: date.date(),
                 isCurrentMonth: date.month() === month.month(),
                 isToday: date.isSame(new Date(), "day"),
                 date: date,
                 haveMatch: haveMatch,
                 match: match
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
 });