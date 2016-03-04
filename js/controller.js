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