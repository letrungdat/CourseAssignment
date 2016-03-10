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