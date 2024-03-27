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

/**
 * Convert local Civil Time to Universal Time
 */
function localCivilTimeToUniversalTime(lctHours, lctMinutes, lctSeconds, isDaylightSavings, zoneCorrection, localDay, localMonth, localYear) {
    var lct = civilTimeToDecimalHours(lctHours, lctMinutes, lctSeconds);

    var daylightSavingsOffset = (isDaylightSavings) ? 1 : 0;

    var utInterim = lct - daylightSavingsOffset - zoneCorrection;
    var gdayInterim = localDay + (utInterim / 24);

    var jd = paMacros.civilDateToJulianDate(gdayInterim, localMonth, localYear);

    var gDay = paMacros.julianDateDay(jd);
    var gMonth = paMacros.julianDateMonth(jd);
    var gYear = paMacros.julianDateYear(jd);

    var ut = 24 * (gDay - Math.floor(gDay));

    return [
        paMacros.decimalHoursHour(ut),
        paMacros.decimalHoursMinute(ut),
        paMacros.decimalHoursSecond(ut),
        Math.floor(gDay),
        gMonth,
        gYear
    ];
}

/**
 * Convert Universal Time to local Civil Time
 */
function universalTimeToLocalCivilTime(utHours, utMinutes, utSeconds, isDaylightSavings, zoneCorrection, gwDay, gwMonth, gwYear) {
    var dstValue = (isDaylightSavings) ? 1 : 0;
    var ut = paMacros.HMStoDH(utHours, utMinutes, utSeconds);
    var zoneTime = ut + zoneCorrection;
    var localTime = zoneTime + dstValue;
    var localJDPlusLocalTime = paMacros.civilDateToJulianDate(gwDay, gwMonth, gwYear) + (localTime / 24);
    var localDay = paMacros.julianDateDay(localJDPlusLocalTime);
    var integerDay = Math.floor(localDay);
    var localMonth = paMacros.julianDateMonth(localJDPlusLocalTime);
    var localYear = paMacros.julianDateYear(localJDPlusLocalTime);

    var lct = 24 * (localDay - integerDay);

    return [
        paMacros.decimalHoursHour(lct),
        paMacros.decimalHoursMinute(lct),
        paMacros.decimalHoursSecond(lct),
        integerDay,
        localMonth,
        localYear
    ];
}

module.exports = {
    getDateOfEaster,
    civilDateToDayNumber,
    civilTimeToDecimalHours,
    decimalHoursToCivilTime,
    localCivilTimeToUniversalTime,
    universalTimeToLocalCivilTime
};
