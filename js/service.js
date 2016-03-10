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