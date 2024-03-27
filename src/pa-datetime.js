const paMacros = require('./pa-macros.js');
const paUtils = require('./pa-utils.js');

/**
 * Gets the date of Easter for the year specified.
 */
function getDateOfEaster(inputYear) {
    var year = inputYear;

    var a = year % 19;
    var b = Math.floor(year / 100);
    var c = year % 100;
    var d = Math.floor(b / 4);
    var e = b % 4;
    var f = Math.floor((b + 8) / 25);
    var g = Math.floor((b - f + 1) / 3);
    var h = ((19 * a) + b - d - g + 15) % 30;
    var i = Math.floor(c / 4);
    var k = c % 4;
    var l = (32 + 2 * (e + i) - h - k) % 7;
    var m = Math.floor((a + (11 * h) + (22 * l)) / 451);
    var n = Math.floor((h + l - (7 * m) + 114) / 31);
    var p = (h + l - (7 * m) + 114) % 31;

    var day = p + 1;
    var month = n;

    return [month, day, year];
}

/**
 * Calculate day number for a date.
 */
function civilDateToDayNumber(month, day, year) {
    if (month <= 2) {
        month = month - 1;
        month = (paUtils.isLeapYear(year)) ? month * 62 : month * 63;
        month = Math.floor(month / 2);
    }
    else {
        month = Math.floor((month + 1) * 30.6);
        month = (paUtils.isLeapYear(year)) ? month - 62 : month - 63;
    }

    return month + day;
}

/**
 * Convert a Civil Time (hours,minutes,seconds) to Decimal Hours
 */
function civilTimeToDecimalHours(hours, minutes, seconds) {
    return paMacros.HMStoDH(hours, minutes, seconds);
}

/**
 * Convert Decimal Hours to Civil Time
 */
function decimalHoursToCivilTime(decimalHours) {
    var hours = paMacros.decimalHoursHour(decimalHours);
    var minutes = paMacros.decimalHoursMinute(decimalHours);
    var seconds = paMacros.decimalHoursSecond(decimalHours);

    return [hours, minutes, seconds];
}

module.exports = {
    getDateOfEaster,
    civilDateToDayNumber,
    civilTimeToDecimalHours,
    decimalHoursToCivilTime
};