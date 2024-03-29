const paTypes = require('./pa-types.js');
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

/**
 * Calculate Sun's ecliptic longitude
 * 
 * Original macro name: SunLong
 */
function sunLong(lch, lcm, lcs, ds, zc, ld, lm, ly) {
  var aa = localCivilTimeGreenwichDay(lch, lcm, lcs, ds, zc, ld, lm, ly);
  var bb = localCivilTimeGreenwichMonth(lch, lcm, lcs, ds, zc, ld, lm, ly);
  var cc = localCivilTimeGreenwichYear(lch, lcm, lcs, ds, zc, ld, lm, ly);
  var ut = localCivilTimeToUniversalTime(lch, lcm, lcs, ds, zc, ld, lm, ly);
  var dj = civilDateToJulianDate(aa, bb, cc) - 2415020;
  var t = (dj / 36525) + (ut / 876600);
  var t2 = t * t;
  var a = 100.0021359 * t;
  var b = 360.0 * (a - Math.floor(a));

  var l = 279.69668 + 0.0003025 * t2 + b;
  a = 99.99736042 * t;
  b = 360 * (a - Math.floor(a));

  var m1 = 358.47583 - (0.00015 + 0.0000033 * t) * t2 + b;
  var ec = 0.01675104 - 0.0000418 * t - 0.000000126 * t2;

  var am = paUtils.degreesToRadians(m1);
  var at = trueAnomaly(am, ec);

  a = 62.55209472 * t;
  b = 360 * (a - Math.floor(a));

  var a1 = paUtils.degreesToRadians(153.23 + b);
  a = 125.1041894 * t;
  b = 360 * (a - Math.floor(a));

  var b1 = paUtils.degreesToRadians(216.57 + b);
  a = 91.56766028 * t;
  b = 360.0 * (a - Math.floor(a));

  var c1 = paUtils.degreesToRadians(312.69 + b);
  a = 1236.853095 * t;
  b = 360.0 * (a - Math.floor(a));

  var d1 = paUtils.degreesToRadians(350.74 - 0.00144 * t2 + b);
  var e1 = paUtils.degreesToRadians(231.19 + 20.2 * t);
  a = 183.1353208 * t;
  b = 360.0 * (a - Math.floor(a));
  var h1 = paUtils.degreesToRadians(353.4 + b);

  var d2 = 0.00134 * Math.cos(a1) + 0.00154 * Math.cos(b1) + 0.002 * Math.cos(c1);
  d2 = d2 + 0.00179 * Math.sin(d1) + 0.00178 * Math.sin(e1);
  var d3 = 0.00000543 * Math.sin(a1) + 0.00001575 * Math.sin(b1);
  d3 = d3 + 0.00001627 * Math.sin(c1) + 0.00003076 * Math.cos(d1);

  var sr = at + paUtils.degreesToRadians(l - m1 + d2);
  var tp = 6.283185308;

  sr = sr - tp * Math.floor(sr / tp);

  return degrees(sr);
}

/**
 * Solve Kepler's equation, and return value of the true anomaly in radians
 * 
 * Original macro name: TrueAnomaly
 */
function trueAnomaly(am, ec) {
  var tp = 6.283185308;
  var m = am - tp * Math.floor(am / tp);
  var ae = m;

  while (1 == 1) {
    var d = ae - (ec * Math.sin(ae)) - m;
    if (Math.abs(d) < 0.000001) {
      break;
    }
    d = d / (1.0 - (ec * Math.cos(ae)));
    ae = ae - d;
  }
  var a = Math.sqrt((1 + ec) / (1 - ec)) * Math.tan(ae / 2);
  var at = 2.0 * Math.atan(a);

  return at;
}

/**
 * Calculate effects of refraction
 * 
 * Original macro name: Refract
 */
function refract(y2, sw, pr, tr) {
  var y = paUtils.degreesToRadians(y2);

  var d = (sw == paTypes.CoordinateType.True) ? -1.0 : 1.0;

  if (d == -1) {
    var y3 = y;
    var y1 = y;
    var r1 = 0.0;

    while (1 == 1) {
      var yNew = y1 + r1;
      var rfNew = refractL3035(pr, tr, yNew, d);

      if (y < -0.087)
        return 0;

      var r2 = rfNew;

      if ((r2 == 0) || (Math.abs(r2 - r1) < 0.000001)) {
        var qNew = y3;

        return degrees(qNew + rfNew);
      }

      r1 = r2;
    }
  }

  var rf = refractL3035(pr, tr, y, d);

  if (y < -0.087)
    return 0;

  var q = y;

  return degrees(q + rf);
}

/**
 * Helper function for Refract
 */
function refractL3035(pr, tr, y, d) {
  if (y < 0.2617994) {
    if (y < -0.087)
      return 0;

    var yd = degrees(y);
    var a = ((0.00002 * yd + 0.0196) * yd + 0.1594) * pr;
    var b = (273.0 + tr) * ((0.0845 * yd + 0.505) * yd + 1);

    return paUtils.degreesToRadians(-(a / b) * d);
  }

  return -d * 0.00007888888 * pr / ((273.0 + tr) * Math.tan(y));
}

/**
 * Calculate corrected hour angle in decimal hours
 * 
 * Original macro name: ParallaxHA
 */
function parallaxHA(hh, hm, hs, dd, dm, ds, sw, gp, ht, hp) {
  var a = paUtils.degreesToRadians(gp);
  var c1 = Math.cos(a);
  var s1 = Math.sin(a);

  var u = Math.atan(0.996647 * s1 / c1);
  var c2 = Math.cos(u);
  var s2 = Math.sin(u);
  var b = ht / 6378160;

  var rs = (0.996647 * s2) + (b * s1);

  var rc = c2 + (b * c1);
  var tp = 6.283185308;

  var rp = 1.0 / Math.sin(paUtils.degreesToRadians(hp));

  var x = paUtils.degreesToRadians(degreeHoursToDecimalDegrees(HMStoDH(hh, hm, hs)));
  var x1 = x;
  var y = paUtils.degreesToRadians(degreesMinutesSecondsToDecimalDegrees(dd, dm, ds));
  var y1 = y;

  var d = (sw == paTypes.CoordinateType.True) ? 1.0 : -1.0;

  if (d == 1) {
    var [resultP, resultQ] = parallaxHAL2870(x, y, rc, rp, rs, tp);
    return decimalDegreesToDegreeHours(degrees(resultP));
  }

  var p1 = 0.0;
  var q1 = 0.0;
  var xLoop = x;
  var yLoop = y;

  while (1 == 1) {
    var [resultP, resultQ] = parallaxHAL2870(xLoop, yLoop, rc, rp, rs, tp);
    var p2 = resultP - xLoop;
    var q2 = resultQ - yLoop;

    var aa = Math.abs(p2 - p1);
    var bb = Math.abs(q2 - q1);

    if ((aa < 0.000001) && (bb < 0.000001)) {
      var p3 = x1 - p2;

      return decimalDegreesToDegreeHours(degrees(p3));
    }

    xLoop = x1 - p2;
    yLoop = y1 - q2;
    p1 = p2;
    q1 = q2;
  }
}

/**
 * Helper function for parallax_ha
 */
function parallaxHAL2870(x, y, rc, rp, rs, tp) {
  var cx = Math.cos(x);
  var sy = Math.sin(y);
  var cy = Math.cos(y);

  var aa = (rc * Math.sin(x)) / ((rp * cy) - (rc * cx));

  var dx = Math.atan(aa);
  var p = x + dx;
  var cp = Math.cos(p);

  p = p - tp * Math.floor(p / tp);
  var q = Math.atan(cp * (rp * sy - rs) / (rp * cy * cx - rc));

  return [p, q];
}

/**
 * Calculate corrected declination in decimal degrees
 * 
 * Original macro name: ParallaxDec
 */
function parallaxDec(hh, hm, hs, dd, dm, ds, sw, gp, ht, hp) {
  var a = paUtils.degreesToRadians(gp);
  var c1 = Math.cos(a);
  var s1 = Math.sin(a);

  var u = Math.atan(0.996647 * s1 / c1);

  var c2 = Math.cos(u);
  var s2 = Math.sin(u);
  var b = ht / 6378160;
  var rs = (0.996647 * s2) + (b * s1);

  var rc = c2 + (b * c1);
  var tp = 6.283185308;

  var rp = 1.0 / Math.sin(paUtils.degreesToRadians(hp));

  var x = paUtils.degreesToRadians(degreeHoursToDecimalDegrees(HMStoDH(hh, hm, hs)));
  var x1 = x;

  var y = paUtils.degreesToRadians(degreesMinutesSecondsToDecimalDegrees(dd, dm, ds));
  var y1 = y;

  var d = (sw == paTypes.CoordinateType.True) ? 1.0 : -1.0;

  if (d == 1) {
    var [resultP, resultQ] = parallaxDecL2870(x, y, rc, rp, rs, tp);

    return degrees(resultQ);
  }

  var p1 = 0.0;
  var q1 = 0.0;

  var xLoop = x;
  var yLoop = y;

  while (1 == 1) {
    var [resultP, resultQ] = parallaxDecL2870(xLoop, yLoop, rc, rp, rs, tp);
    var p2 = resultP - xLoop;
    var q2 = resultQ - yLoop;
    var aa = Math.abs(p2 - p1);

    if ((aa < 0.000001) && (b < 0.000001)) {
      var q = y1 - q2;

      return degrees(q);
    }
    xLoop = x1 - p2;
    yLoop = y1 - q2;
    p1 = p2;
    q1 = q2;
  }
}

/**
 * Helper function for parallax_dec
 */
function parallaxDecL2870(x, y, rc, rp, rs, tp) {
  var cx = Math.cos(x);
  var sy = Math.sin(y);
  var cy = Math.cos(y);

  var aa = (rc * Math.sin(x)) / ((rp * cy) - (rc * cx));
  var dx = Math.atan(aa);
  var p = x + dx;
  var cp = Math.cos(p);

  p = p - tp * Math.floor(p / tp);
  var q = Math.atan(cp * (rp * sy - rs) / (rp * cy * cx - rc));

  return [p, q];
}

/**
 * Calculate Sun's angular diameter in decimal degrees
 * 
 * Original macro name: SunDia
 */
function sunDia(lch, lcm, lcs, ds, zc, ld, lm, ly) {
  var a = sunDist(lch, lcm, lcs, ds, zc, ld, lm, ly);

  return 0.533128 / a;
}

/**
 * Calculate Sun's distance from the Earth in astronomical units
 * 
 * Original macro name: SunDist
 */
function sunDist(lch, lcm, lcs, ds, zc, ld, lm, ly) {
  var aa = localCivilTimeGreenwichDay(lch, lcm, lcs, ds, zc, ld, lm, ly);
  var bb = localCivilTimeGreenwichMonth(lch, lcm, lcs, ds, zc, ld, lm, ly);
  var cc = localCivilTimeGreenwichYear(lch, lcm, lcs, ds, zc, ld, lm, ly);
  var ut = localCivilTimeToUniversalTime(lch, lcm, lcs, ds, zc, ld, lm, ly);
  var dj = civilDateToJulianDate(aa, bb, cc) - 2415020;

  var t = (dj / 36525) + (ut / 876600);
  var t2 = t * t;

  var a = 100.0021359 * t;
  var b = 360 * (a - Math.floor(a));
  a = 99.99736042 * t;
  b = 360 * (a - Math.floor(a));
  var m1 = 358.47583 - (0.00015 + 0.0000033 * t) * t2 + b;
  var ec = 0.01675104 - 0.0000418 * t - 0.000000126 * t2;

  var am = paUtils.degreesToRadians(m1);
  var ae = eccentricAnomaly(am, ec);

  a = 62.55209472 * t;
  b = 360 * (a - Math.floor(a));
  var a1 = paUtils.degreesToRadians(153.23 + b);
  a = 125.1041894 * t;
  b = 360 * (a - Math.floor(a));
  var b1 = paUtils.degreesToRadians(216.57 + b);
  a = 91.56766028 * t;
  b = 360 * (a - Math.floor(a));
  var c1 = paUtils.degreesToRadians(312.69 + b);
  a = 1236.853095 * t;
  b = 360 * (a - Math.floor(a));
  var d1 = paUtils.degreesToRadians(350.74 - 0.00144 * t2 + b);
  var e1 = paUtils.degreesToRadians(231.19 + 20.2 * t);
  a = 183.1353208 * t;
  b = 360 * (a - Math.floor(a));
  var h1 = paUtils.degreesToRadians(353.4 + b);

  var d3 = (0.00000543 * Math.sin(a1) + 0.00001575 * Math.sin(b1)) + (0.00001627 * Math.sin(c1) + 0.00003076 * Math.cos(d1)) + (0.00000927 * Math.sin(h1));

  return 1.0000002 * (1 - ec * Math.cos(ae)) + d3;
}

/**
 * Solve Kepler's equation, and return value of the eccentric anomaly in radians
 * 
 * Original macro name: EccentricAnomaly
 */
function eccentricAnomaly(am, ec) {
  var tp = 6.283185308;
  var m = am - tp * Math.floor(am / tp);
  var ae = m;

  while (1 == 1) {
    var d = ae - (ec * Math.sin(ae)) - m;

    if (Math.abs(d) < 0.000001) {
      break;
    }

    d = d / (1 - (ec * Math.cos(ae)));
    ae = ae - d;
  }

  return ae;
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
  localSiderealTimeToGreenwichSiderealTime,
  sunLong,
  trueAnomaly,
  refract,
  refractL3035,
  parallaxHA,
  parallaxHAL2870,
  parallaxDec,
  parallaxDecL2870,
  sunDia,
  sunDist,
  eccentricAnomaly
};
