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


module.exports = {
  HMStoDH,
  decimalHoursHour,
  decimalHoursMinute,
  decimalHoursSecond
};