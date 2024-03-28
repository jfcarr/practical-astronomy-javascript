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

/**
 * Convert Right Ascension to Hour Angle
 * 
 * Original macro name: RAHA
 */
function rightAscensionToHourAngle(raHours, raMinutes, raSeconds, lctHours, lctMinutes, lctSeconds, daylightSaving, zoneCorrection, localDay, localMonth, localYear, geographicalLongitude) {
  var a = localCivilTimeToUniversalTime(lctHours, lctMinutes, lctSeconds, daylightSaving, zoneCorrection, localDay, localMonth, localYear);
  var b = localCivilTimeGreenwichDay(lctHours, lctMinutes, lctSeconds, daylightSaving, zoneCorrection, localDay, localMonth, localYear);
  var c = localCivilTimeGreenwichMonth(lctHours, lctMinutes, lctSeconds, daylightSaving, zoneCorrection, localDay, localMonth, localYear);
  var d = localCivilTimeGreenwichYear(lctHours, lctMinutes, lctSeconds, daylightSaving, zoneCorrection, localDay, localMonth, localYear);
  var e = universalTimeToGreenwichSiderealTime(a, 0, 0, b, c, d);
  var f = greenwichSiderealTimeToLocalSiderealTime(e, 0, 0, geographicalLongitude);
  var g = HMStoDH(raHours, raMinutes, raSeconds);
  var h = f - g;

  return (h < 0) ? 24 + h : h;
}

/**
 * Convert Hour Angle to Right Ascension
 * 
 * Original macro name: HARA
 */
function hourAngleToRightAscension(hourAngleHours, hourAngleMinutes, hourAngleSeconds, lctHours, lctMinutes, lctSeconds, daylightSaving, zoneCorrection, localDay, localMonth, localYear, geographicalLongitude) {
  var a = localCivilTimeToUniversalTime(lctHours, lctMinutes, lctSeconds, daylightSaving, zoneCorrection, localDay, localMonth, localYear);
  var b = localCivilTimeGreenwichDay(lctHours, lctMinutes, lctSeconds, daylightSaving, zoneCorrection, localDay, localMonth, localYear);
  var c = localCivilTimeGreenwichMonth(lctHours, lctMinutes, lctSeconds, daylightSaving, zoneCorrection, localDay, localMonth, localYear);
  var d = localCivilTimeGreenwichYear(lctHours, lctMinutes, lctSeconds, daylightSaving, zoneCorrection, localDay, localMonth, localYear);
  var e = universalTimeToGreenwichSiderealTime(a, 0, 0, b, c, d);
  var f = greenwichSiderealTimeToLocalSiderealTime(e, 0, 0, geographicalLongitude);
  var g = HMStoDH(hourAngleHours, hourAngleMinutes, hourAngleSeconds);
  var h = f - g;

  return (h < 0) ? 24 + h : h;
}

/**
 * Convert Local Civil Time to Universal Time
 * 
 * Original macro name: LctUT
 */
function localCivilTimeToUniversalTime(lctHours, lctMinutes, lctSeconds, daylightSaving, zoneCorrection, localDay, localMonth, localYear) {
  var a = HMStoDH(lctHours, lctMinutes, lctSeconds);
  var b = a - daylightSaving - zoneCorrection;
  var c = localDay + (b / 24);
  var d = civilDateToJulianDate(c, localMonth, localYear);
  var e = julianDateDay(d);
  var e1 = Math.floor(e);

  return 24 * (e - e1);
}

/**
 * Determine Greenwich Day for Local Time
 * 
 * Original macro name: LctGDay
 */
function localCivilTimeGreenwichDay(lctHours, lctMinutes, lctSeconds, daylightSaving, zoneCorrection, localDay, localMonth, localYear) {
  var a = HMStoDH(lctHours, lctMinutes, lctSeconds);
  var b = a - daylightSaving - zoneCorrection;
  var c = localDay + (b / 24);
  var d = civilDateToJulianDate(c, localMonth, localYear);
  var e = julianDateDay(d);

  return Math.floor(e);
}

/**
 * Determine Greenwich Month for Local Time
 * 
 * Original macro name: LctGMonth
 */
function localCivilTimeGreenwichMonth(lctHours, lctMinutes, lctSeconds, daylightSaving, zoneCorrection, localDay, localMonth, localYear) {
  var a = HMStoDH(lctHours, lctMinutes, lctSeconds);
  var b = a - daylightSaving - zoneCorrection;
  var c = localDay + (b / 24);
  var d = civilDateToJulianDate(c, localMonth, localYear);

  return julianDateMonth(d);
}

/**
 * Determine Greenwich Year for Local Time
 * 
 * Original macro name: LctGYear
 */
function localCivilTimeGreenwichYear(lctHours, lctMinutes, lctSeconds, daylightSaving, zoneCorrection, localDay, localMonth, localYear) {
  var a = HMStoDH(lctHours, lctMinutes, lctSeconds);
  var b = a - daylightSaving - zoneCorrection;
  var c = localDay + (b / 24);
  var d = civilDateToJulianDate(c, localMonth, localYear);

  return julianDateYear(d);
}

/**
 * Convert Universal Time to Greenwich Sidereal Time
 * 
 * Original macro name: UTGST
 */
function universalTimeToGreenwichSiderealTime(uHours, uMinutes, uSeconds, greenwichDay, greenwichMonth, greenwichYear) {
  var a = civilDateToJulianDate(greenwichDay, greenwichMonth, greenwichYear);
  var b = a - 2451545;
  var c = b / 36525;
  var d = 6.697374558 + (2400.051336 * c) + (0.000025862 * c * c);
  var e = d - (24 * Math.floor(d / 24));
  var f = HMStoDH(uHours, uMinutes, uSeconds);
  var g = f * 1.002737909;
  var h = e + g;

  return h - (24 * Math.floor(h / 24));
}

/**
 * Convert Greenwich Sidereal Time to Local Sidereal Time
 * 
 * Original macro name: GSTLST
 */
function greenwichSiderealTimeToLocalSiderealTime(greenwichHours, greenwichMinutes, greenwichSeconds, geographicalLongitude) {
  var a = HMStoDH(greenwichHours, greenwichMinutes, greenwichSeconds);
  var b = geographicalLongitude / 15;
  var c = a + b;

  return c - (24 * Math.floor(c / 24));
}

/**
 * Convert Equatorial Coordinates to Azimuth (in decimal degrees)
 * 
 * Original macro name: EQAz
 */
function equatorialCoordinatesToAzimuth(hourAngleHours, hourAngleMinutes, hourAngleSeconds, declinationDegrees, declinationMinutes, declinationSeconds, geographicalLatitude) {
  var a = HMStoDH(hourAngleHours, hourAngleMinutes, hourAngleSeconds);
  var b = a * 15;
  var c = paUtils.degreesToRadians(b);
  var d = degreesMinutesSecondsToDecimalDegrees(declinationDegrees, declinationMinutes, declinationSeconds);
  var e = paUtils.degreesToRadians(d);
  var f = paUtils.degreesToRadians(geographicalLatitude);
  var g = Math.sin(e) * Math.sin(f) + Math.cos(e) * Math.cos(f) * Math.cos(c);
  var h = -Math.cos(e) * Math.cos(f) * Math.sin(c);
  var i = Math.sin(e) - (Math.sin(f) * g);
  var j = degrees(Math.atan2(h, i));

  return j - 360.0 * Math.floor(j / 360);
}

/**
 * Convert Equatorial Coordinates to Altitude (in decimal degrees)
 * 
 * Original macro name: EQAlt
 */
function equatorialCoordinatesToAltitude(hourAngleHours, hourAngleMinutes, hourAngleSeconds, declinationDegrees, declinationMinutes, declinationSeconds, geographicalLatitude) {
  var a = HMStoDH(hourAngleHours, hourAngleMinutes, hourAngleSeconds);
  var b = a * 15;
  var c = paUtils.degreesToRadians(b);
  var d = degreesMinutesSecondsToDecimalDegrees(declinationDegrees, declinationMinutes, declinationSeconds);
  var e = paUtils.degreesToRadians(d);
  var f = paUtils.degreesToRadians(geographicalLatitude);
  var g = Math.sin(e) * Math.sin(f) + Math.cos(e) * Math.cos(f) * Math.cos(c);

  return degrees(Math.asin(g));
}

/**
 * Convert Degrees Minutes Seconds to Decimal Degrees
 * 
 * Original macro name: DMSDD
 */
function degreesMinutesSecondsToDecimalDegrees(degrees, minutes, seconds) {
  var a = Math.abs(seconds) / 60;
  var b = (Math.abs(minutes) + a) / 60;
  var c = Math.abs(degrees) + b;

  return (degrees < 0 || minutes < 0 || seconds < 0) ? -c : c;
}

/**
 * Convert W to Degrees
 * 
 * Original macro name: Degrees
 */
function degrees(w) {
  return w * 57.29577951;
}

/**
 * Return Degrees part of Decimal Degrees
 * 
 * Original macro name: DDDeg
 */
function decimalDegreesDegrees(decimalDegrees) {
  var a = Math.abs(decimalDegrees);
  var b = a * 3600;
  var c = paUtils.round(b - 60 * Math.floor(b / 60), 2);
  var e = (c == 60) ? 60 : b;

  return (decimalDegrees < 0) ? -(Math.floor(e / 3600)) : Math.floor(e / 3600);
}

/**
 * Return Minutes part of Decimal Degrees
 * 
 * Original macro name: DDMin
 */
function decimalDegreesMinutes(decimalDegrees) {
  var a = Math.abs(decimalDegrees);
  var b = a * 3600;
  var c = paUtils.round(b - 60 * Math.floor(b / 60), 2);
  var e = (c == 60) ? b + 60 : b;

  return Math.floor(e / 60) % 60;
}

/**
 * Return Seconds part of Decimal Degrees
 * 
 * Original macro name: DDSec
 */
function decimalDegreesSeconds(decimalDegrees) {
  var a = Math.abs(decimalDegrees);
  var b = a * 3600;
  var c = paUtils.round(b - 60 * Math.floor(b / 60), 2);
  var d = (c == 60) ? 0 : c;

  return d;
}

/**
 * Convert Horizon Coordinates to Declination (in decimal degrees)
 * 
 * Original macro name: HORDec
 */
function horizonCoordinatesToDeclination(azimuthDegrees, azimuthMinutes, azimuthSeconds, altitudeDegrees, altitudeMinutes, altitudeSeconds, geographicalLatitude) {
  var a = degreesMinutesSecondsToDecimalDegrees(azimuthDegrees, azimuthMinutes, azimuthSeconds);
  var b = degreesMinutesSecondsToDecimalDegrees(altitudeDegrees, altitudeMinutes, altitudeSeconds);
  var c = paUtils.degreesToRadians(a);
  var d = paUtils.degreesToRadians(b);
  var e = paUtils.degreesToRadians(geographicalLatitude);
  var f = Math.sin(d) * Math.sin(e) + Math.cos(d) * Math.cos(e) * Math.cos(c);

  return degrees(Math.asin(f));
}

/**
 * Convert Horizon Coordinates to Hour Angle (in decimal degrees)
 * 
 * Original macro name: HORHa
 */
function horizonCoordinatesToHourAngle(azimuthDegrees, azimuthMinutes, azimuthSeconds, altitudeDegrees, altitudeMinutes, altitudeSeconds, geographicalLatitude) {
  var a = degreesMinutesSecondsToDecimalDegrees(azimuthDegrees, azimuthMinutes, azimuthSeconds);
  var b = degreesMinutesSecondsToDecimalDegrees(altitudeDegrees, altitudeMinutes, altitudeSeconds);
  var c = paUtils.degreesToRadians(a);
  var d = paUtils.degreesToRadians(b);
  var e = paUtils.degreesToRadians(geographicalLatitude);
  var f = Math.sin(d) * Math.sin(e) + Math.cos(d) * Math.cos(e) * Math.cos(c);
  var g = -Math.cos(d) * Math.cos(e) * Math.sin(c);
  var h = Math.sin(d) - Math.sin(e) * f;
  var i = decimalDegreesToDegreeHours(degrees(Math.atan2(g, h)));

  return i - 24 * Math.floor(i / 24);
}

/**
 * Convert Decimal Degrees to Degree-Hours
 * 
 * Original macro name: DDDH
 */
function decimalDegreesToDegreeHours(decimalDegrees) {
  return decimalDegrees / 15;
}

/**
 * Convert Degree-Hours to Decimal Degrees
 * 
 * Original macro name: DHDD
 */
function degreeHoursToDecimalDegrees(degreeHours) {
  return degreeHours * 15;
}

/**
 * Obliquity of the Ecliptic for a Greenwich Date
 * 
 * Original macro name: Obliq
 */
function obliq(greenwichDay, greenwichMonth, greenwichYear) {
  var a = civilDateToJulianDate(greenwichDay, greenwichMonth, greenwichYear);
  var b = a - 2415020;
  var c = (b / 36525) - 1;
  var d = c * (46.815 + c * (0.0006 - (c * 0.00181)));
  var e = d / 3600;

  return 23.43929167 - e + nutatObl(greenwichDay, greenwichMonth, greenwichYear);
}

/**
 * Nutation amount to be added in ecliptic longitude, in degrees.
 * 
 * Original macro name: NutatLong
 */
function nutatLong(gd, gm, gy) {
  var dj = civilDateToJulianDate(gd, gm, gy) - 2415020;
  var t = dj / 36525;
  var t2 = t * t;

  var a = 100.0021358 * t;
  var b = 360 * (a - Math.floor(a));

  var l1 = 279.6967 + 0.000303 * t2 + b;
  var l2 = 2 * paUtils.degreesToRadians(l1);

  a = 1336.855231 * t;
  b = 360 * (a - Math.floor(a));

  var d1 = 270.4342 - 0.001133 * t2 + b;
  var d2 = 2 * paUtils.degreesToRadians(d1);

  a = 99.99736056 * t;
  b = 360 * (a - Math.floor(a));

  var m1 = 358.4758 - 0.00015 * t2 + b;
  m1 = paUtils.degreesToRadians(m1);

  a = 1325.552359 * t;
  b = 360 * (a - Math.floor(a));

  var m2 = 296.1046 + 0.009192 * t2 + b;
  m2 = paUtils.degreesToRadians(m2);

  a = 5.372616667 * t;
  b = 360 * (a - Math.floor(a));

  var n1 = 259.1833 + 0.002078 * t2 - b;
  n1 = paUtils.degreesToRadians(n1);

  var n2 = 2.0 * n1;

  var dp = (-17.2327 - 0.01737 * t) * Math.sin(n1);
  dp = dp + (-1.2729 - 0.00013 * t) * Math.sin(l2) + 0.2088 * Math.sin(n2);
  dp = dp - 0.2037 * Math.sin(d2) + (0.1261 - 0.00031 * t) * Math.sin(m1);
  dp = dp + 0.0675 * Math.sin(m2) - (0.0497 - 0.00012 * t) * Math.sin(l2 + m1);
  dp = dp - 0.0342 * Math.sin(d2 - n1) - 0.0261 * Math.sin(d2 + m2);
  dp = dp + 0.0214 * Math.sin(l2 - m1) - 0.0149 * Math.sin(l2 - d2 + m2);
  dp = dp + 0.0124 * Math.sin(l2 - n1) + 0.0114 * Math.sin(d2 - m2);

  return dp / 3600;
}

/**
 * Nutation of Obliquity
 * 
 * Original macro name: NutatObl
 */
function nutatObl(greenwichDay, greenwichMonth, greenwichYear) {
  var dj = civilDateToJulianDate(greenwichDay, greenwichMonth, greenwichYear) - 2415020;
  var t = dj / 36525;
  var t2 = t * t;

  var a = 100.0021358 * t;
  var b = 360 * (a - Math.floor(a));

  var l1 = 279.6967 + 0.000303 * t2 + b;
  var l2 = 2 * paUtils.degreesToRadians(l1);

  a = 1336.855231 * t;
  b = 360 * (a - Math.floor(a));

  var d1 = 270.4342 - 0.001133 * t2 + b;
  var d2 = 2 * paUtils.degreesToRadians(d1);

  a = 99.99736056 * t;
  b = 360 * (a - Math.floor(a));

  var m1 = paUtils.degreesToRadians(358.4758 - 0.00015 * t2 + b);

  a = 1325.552359 * t;
  b = 360 * (a - Math.floor(a));

  var m2 = paUtils.degreesToRadians(296.1046 + 0.009192 * t2 + b);

  a = 5.372616667 * t;
  b = 360 * (a - Math.floor(a));

  var n1 = paUtils.degreesToRadians(259.1833 + 0.002078 * t2 - b);

  var n2 = 2 * n1;

  var ddo = (9.21 + 0.00091 * t) * Math.cos(n1);
  ddo = ddo + (0.5522 - 0.00029 * t) * Math.cos(l2) - 0.0904 * Math.cos(n2);
  ddo = ddo + 0.0884 * Math.cos(d2) + 0.0216 * Math.cos(l2 + m1);
  ddo = ddo + 0.0183 * Math.cos(d2 - n1) + 0.0113 * Math.cos(d2 + m2);
  ddo = ddo - 0.0093 * Math.cos(l2 - m1) - 0.0066 * Math.cos(l2 - n1);

  return ddo / 3600;
}

/**
 * Convert Greenwich Sidereal Time to Universal Time
 * 
 * Original macro name: GSTUT
 */
function greenwichSiderealTimeToUniversalTime(greenwichSiderealHours, greenwichSiderealMinutes, greenwichSiderealSeconds, greenwichDay, greenwichMonth, greenwichYear) {
  var a = civilDateToJulianDate(greenwichDay, greenwichMonth, greenwichYear);
  var b = a - 2451545;
  var c = b / 36525;
  var d = 6.697374558 + (2400.051336 * c) + (0.000025862 * c * c);
  var e = d - (24 * Math.floor(d / 24));
  var f = HMStoDH(greenwichSiderealHours, greenwichSiderealMinutes, greenwichSiderealSeconds);
  var g = f - e;
  var h = g - (24 * Math.floor(g / 24));

  return h * 0.9972695663;
}

/**
 * Convert Local Sidereal Time to Greenwich Sidereal Time
 * 
 * Original macro name: LSTGST
 */
function localSiderealTimeToGreenwichSiderealTime(localHours, localMinutes, localSeconds, longitude) {
  var a = HMStoDH(localHours, localMinutes, localSeconds);
  var b = longitude / 15;
  var c = a - b;

  return c - (24 * Math.floor(c / 24));
}


module.exports = {
  HMStoDH,
  decimalHoursHour,
  decimalHoursMinute,
  decimalHoursSecond,
  civilDateToJulianDate,
  julianDateDay,
  julianDateMonth,
  julianDateYear,
  rightAscensionToHourAngle,
  hourAngleToRightAscension,
  localCivilTimeToUniversalTime,
  localCivilTimeGreenwichDay,
  localCivilTimeGreenwichMonth,
  localCivilTimeGreenwichYear,
  universalTimeToGreenwichSiderealTime,
  greenwichSiderealTimeToLocalSiderealTime,
  equatorialCoordinatesToAzimuth,
  equatorialCoordinatesToAltitude,
  degreesMinutesSecondsToDecimalDegrees,
  degrees,
  decimalDegreesDegrees,
  decimalDegreesMinutes,
  decimalDegreesSeconds,
  horizonCoordinatesToDeclination,
  horizonCoordinatesToHourAngle,
  decimalDegreesToDegreeHours,
  degreeHoursToDecimalDegrees,
  obliq,
  nutatLong,
  nutatObl,
  greenwichSiderealTimeToUniversalTime,
  localSiderealTimeToGreenwichSiderealTime
};
