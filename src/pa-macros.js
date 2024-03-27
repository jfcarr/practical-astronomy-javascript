const paUtils = require('./pa-utils.js');

/**
   * Convert a Civil Time (hours,minutes,seconds) to Decimal Hours
 * 
   * Original macro name: HMSDH
 */
function HMStoDH(hours, minutes, seconds) {
  var fHours = hours;
  var fMinutes = minutes;
  var fSeconds = seconds;

  var a = Math.abs(fSeconds) / 60;
  var b = (Math.abs(fMinutes) + a) / 60;
  var c = Math.abs(fHours) + b;

  return (fHours < 0 || fMinutes < 0 || fSeconds < 0) ? -c : c;
}

/**
 * Return the hour part of a Decimal Hours
 * 
 * Original macro name: DHHour
 */
function decimalHoursHour(decimalHours) {
  var a = Math.abs(decimalHours);
  var b = a * 3600;
  var c = paUtils.round(b - 60 * Math.floor(b / 60), 2);
  var e = (c == 60) ? b + 60 : b;

  return (decimalHours < 0) ? - (Math.floor(e / 3600)) : Math.floor(e / 3600);
}

/**
 * Return the minutes part of a Decimal Hours
 * 
 * Original macro name: DHMin
 */
function decimalHoursMinute(decimalHours) {
  var a = Math.abs(decimalHours);
  var b = a * 3600;
  var c = paUtils.round(b - 60 * Math.floor(b / 60), 2);
  var e = (c == 60) ? b + 60 : b;

  return Math.floor(e / 60) % 60;
}

/**
 * Return the seconds part of a Decimal Hours
 * 
 * Original macro name: DHSec
 */
function decimalHoursSecond(decimalHours) {
  var a = Math.abs(decimalHours);
  var b = a * 3600;
  var c = paUtils.round(b - 60 * Math.floor(b / 60), 2);
  var d = (c == 60) ? 0 : c;

  return d;
}

/**
 * Convert a Greenwich Date/Civil Date (day,month,year) to Julian Date
 *
 * Original macro name: CDJD
 */
function civilDateToJulianDate(day, month, year) {
  var fDay = day;
  var fMonth = month;
  var fYear = year;

  var y = (fMonth < 3) ? fYear - 1 : fYear;
  var m = (fMonth < 3) ? fMonth + 12 : fMonth;

  var b;

  if (fYear > 1582) {
    var a = Math.floor(y / 100);
    b = 2 - a + Math.floor(a / 4);
  }
  else {
    if (fYear == 1582 && fMonth > 10) {
      var a = Math.floor(y / 100);
      b = 2 - a + Math.floor(a / 4);
    }
    else {
      if (fYear == 1582 && fMonth == 10 && fDay >= 15) {
        var a = Math.floor(y / 100);
        b = 2 - a + Math.floor(a / 4);
      }
      else {
        b = 0;
      }
    }
  }

  var c = (y < 0) ? Math.floor(((365.25 * y) - 0.75)) : Math.floor(365.25 * y);
  var d = Math.floor(30.6001 * (m + 1.0));

  return b + c + d + fDay + 1720994.5;
}

/**
 * Returns the day part of a Julian Date
 * 
 * Original macro name: JDCDay
 */
function julianDateDay(julianDate) {
  var i = Math.floor(julianDate + 0.5);
  var f = julianDate + 0.5 - i;
  var a = Math.floor((i - 1867216.25) / 36524.25);
  var b = (i > 2299160) ? i + 1 + a - Math.floor(a / 4) : i;
  var c = b + 1524;
  var d = Math.floor((c - 122.1) / 365.25);
  var e = Math.floor(365.25 * d);
  var g = Math.floor((c - e) / 30.6001);

  return c - e + f - Math.floor(30.6001 * g);
}

/**
 * Returns the month part of a Julian Date
 * 
 * Original macro name: JDCMonth
 */
function julianDateMonth(julianDate) {
  var i = Math.floor(julianDate + 0.5);
  var a = Math.floor((i - 1867216.25) / 36524.25);
  var b = (i > 2299160) ? i + 1 + a - Math.floor(a / 4) : i;
  var c = b + 1524;
  var d = Math.floor((c - 122.1) / 365.25);
  var e = Math.floor(365.25 * d);
  var g = Math.floor((c - e) / 30.6001);

  var returnValue = (g < 13.5) ? g - 1 : g - 13;

  return returnValue;
}

/**
 * Returns the year part of a Julian Date
 * 
 * Original macro name: JDCYear
 */
function julianDateYear(julianDate) {
  var i = Math.floor(julianDate + 0.5);
  var a = Math.floor((i - 1867216.25) / 36524.25);
  var b = (i > 2299160) ? i + 1.0 + a - Math.floor(a / 4.0) : i;
  var c = b + 1524;
  var d = Math.floor((c - 122.1) / 365.25);
  var e = Math.floor(365.25 * d);
  var g = Math.floor((c - e) / 30.6001);
  var h = (g < 13.5) ? g - 1 : g - 13;

  var returnValue = (h > 2.5) ? d - 4716 : d - 4715;

  return returnValue;
}

module.exports = {
  HMStoDH,
  decimalHoursHour,
  decimalHoursMinute,
  decimalHoursSecond,
  civilDateToJulianDate,
  julianDateDay,
  julianDateMonth,
  julianDateYear
};
