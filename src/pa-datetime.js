const paMacros = require('./pa-macros.js');
const paTypes = require('./pa-types.js');
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

/**
 * Convert Universal Time to Greenwich Sidereal Time
 */
function universalTimeToGreenwichSiderealTime(utHours, utMinutes, utSeconds, gwDay, gwMonth, gwYear) {
    var jd = paMacros.civilDateToJulianDate(gwDay, gwMonth, gwYear);
    var s = jd - 2451545;
    var t = s / 36525;
    var t01 = 6.697374558 + (2400.051336 * t) + (0.000025862 * t * t);
    var t02 = t01 - (24.0 * Math.floor(t01 / 24));
    var ut = paMacros.HMStoDH(utHours, utMinutes, utSeconds);
    var a = ut * 1.002737909;
    var gst1 = t02 + a;
    var gst2 = gst1 - (24.0 * Math.floor(gst1 / 24));

    var gstHours = paMacros.decimalHoursHour(gst2);
    var gstMinutes = paMacros.decimalHoursMinute(gst2);
    var gstSeconds = paMacros.decimalHoursSecond(gst2);

    return [gstHours, gstMinutes, gstSeconds];
}

/**
 * Convert Greenwich Sidereal Time to Universal Time
 */
function greenwichSiderealTimeToUniversalTime(gstHours, gstMinutes, gstSeconds, gwDay, gwMonth, gwYear) {
    var jd = paMacros.civilDateToJulianDate(gwDay, gwMonth, gwYear);
    var s = jd - 2451545;
    var t = s / 36525;
    var t01 = 6.697374558 + (2400.051336 * t) + (0.000025862 * t * t);
    var t02 = t01 - (24 * Math.floor(t01 / 24));
    var gstHours1 = paMacros.HMStoDH(gstHours, gstMinutes, gstSeconds);

    var a = gstHours1 - t02;
    var b = a - (24 * Math.floor(a / 24));
    var ut = b * 0.9972695663;
    var utHours = paMacros.decimalHoursHour(ut);
    var utMinutes = paMacros.decimalHoursMinute(ut);
    var utSeconds = paMacros.decimalHoursSecond(ut);

    var warningFlag = (ut < 0.065574) ? paTypes.WarningFlag.Warning : paTypes.WarningFlag.OK;

    return [utHours, utMinutes, utSeconds, warningFlag];
}

module.exports = {
    getDateOfEaster,
    civilDateToDayNumber,
    civilTimeToDecimalHours,
    decimalHoursToCivilTime,
    localCivilTimeToUniversalTime,
    universalTimeToLocalCivilTime,
    universalTimeToGreenwichSiderealTime,
    greenwichSiderealTimeToUniversalTime
};
