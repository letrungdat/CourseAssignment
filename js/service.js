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