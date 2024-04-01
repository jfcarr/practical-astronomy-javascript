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
 * Convert Universal Time to Local Civil Time
 * 
 * Original macro name: UTLct
 */
function universalTimeToLocalCivilTime(uHours, uMinutes, uSeconds, daylightSaving, zoneCorrection, greenwichDay, greenwichMonth, greenwichYear) {
  var a = HMStoDH(uHours, uMinutes, uSeconds);
  var b = a + zoneCorrection;
  var c = b + daylightSaving;
  var d = civilDateToJulianDate(greenwichDay, greenwichMonth, greenwichYear) + (c / 24);
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

/**
 * Calculate geocentric ecliptic longitude for the Moon
 * 
 * Original macro name: MoonLong
 */
function moonLong(lh, lm, ls, ds, zc, dy, mn, yr) {
  var ut = localCivilTimeToUniversalTime(lh, lm, ls, ds, zc, dy, mn, yr);
  var gd = localCivilTimeGreenwichDay(lh, lm, ls, ds, zc, dy, mn, yr);
  var gm = localCivilTimeGreenwichMonth(lh, lm, ls, ds, zc, dy, mn, yr);
  var gy = localCivilTimeGreenwichYear(lh, lm, ls, ds, zc, dy, mn, yr);
  var t = ((civilDateToJulianDate(gd, gm, gy) - 2415020) / 36525) + (ut / 876600);
  var t2 = t * t;

  var m1 = 27.32158213;
  var m2 = 365.2596407;
  var m3 = 27.55455094;
  var m4 = 29.53058868;
  var m5 = 27.21222039;
  var m6 = 6798.363307;
  var q = civilDateToJulianDate(gd, gm, gy) - 2415020 + (ut / 24);
  m1 = q / m1;
  m2 = q / m2;
  m3 = q / m3;
  m4 = q / m4;
  m5 = q / m5;
  m6 = q / m6;
  m1 = 360 * (m1 - Math.floor(m1));
  m2 = 360 * (m2 - Math.floor(m2));
  m3 = 360 * (m3 - Math.floor(m3));
  m4 = 360 * (m4 - Math.floor(m4));
  m5 = 360 * (m5 - Math.floor(m5));
  m6 = 360 * (m6 - Math.floor(m6));

  var ml = 270.434164 + m1 - (0.001133 - 0.0000019 * t) * t2;
  var ms = 358.475833 + m2 - (0.00015 + 0.0000033 * t) * t2;
  var md = 296.104608 + m3 + (0.009192 + 0.0000144 * t) * t2;
  var me1 = 350.737486 + m4 - (0.001436 - 0.0000019 * t) * t2;
  var mf = 11.250889 + m5 - (0.003211 + 0.0000003 * t) * t2;
  var na = 259.183275 - m6 + (0.002078 + 0.0000022 * t) * t2;
  var a = paUtils.degreesToRadians(51.2 + 20.2 * t);
  var s1 = Math.sin(a);
  var s2 = Math.sin(paUtils.degreesToRadians(na));
  var b = 346.56 + (132.87 - 0.0091731 * t) * t;
  var s3 = 0.003964 * Math.sin(paUtils.degreesToRadians(b));
  var c = paUtils.degreesToRadians(na + 275.05 - 2.3 * t);
  var s4 = Math.sin(c);
  ml = ml + 0.000233 * s1 + s3 + 0.001964 * s2;
  ms = ms - 0.001778 * s1;
  md = md + 0.000817 * s1 + s3 + 0.002541 * s2;
  mf = mf + s3 - 0.024691 * s2 - 0.004328 * s4;
  me1 = me1 + 0.002011 * s1 + s3 + 0.001964 * s2;
  var e = 1.0 - (0.002495 + 0.00000752 * t) * t;
  var e2 = e * e;
  ml = paUtils.degreesToRadians(ml);
  ms = paUtils.degreesToRadians(ms);
  me1 = paUtils.degreesToRadians(me1);
  mf = paUtils.degreesToRadians(mf);
  md = paUtils.degreesToRadians(md);

  var l = 6.28875 * Math.sin(md) + 1.274018 * Math.sin(2.0 * me1 - md);
  l = l + 0.658309 * Math.sin(2.0 * me1) + 0.213616 * Math.sin(2.0 * md);
  l = l - e * 0.185596 * Math.sin(ms) - 0.114336 * Math.sin(2.0 * mf);
  l = l + 0.058793 * Math.sin(2.0 * (me1 - md));
  l = l + 0.057212 * e * Math.sin(2.0 * me1 - ms - md) + 0.05332 * Math.sin(2.0 * me1 + md);
  l = l + 0.045874 * e * Math.sin(2.0 * me1 - ms) + 0.041024 * e * Math.sin(md - ms);
  l = l - 0.034718 * Math.sin(me1) - e * 0.030465 * Math.sin(ms + md);
  l = l + 0.015326 * Math.sin(2.0 * (me1 - mf)) - 0.012528 * Math.sin(2.0 * mf + md);
  l = l - 0.01098 * Math.sin(2.0 * mf - md) + 0.010674 * Math.sin(4.0 * me1 - md);
  l = l + 0.010034 * Math.sin(3.0 * md) + 0.008548 * Math.sin(4.0 * me1 - 2.0 * md);
  l = l - e * 0.00791 * Math.sin(ms - md + 2.0 * me1) - e * 0.006783 * Math.sin(2.0 * me1 + ms);
  l = l + 0.005162 * Math.sin(md - me1) + e * 0.005 * Math.sin(ms + me1);
  l = l + 0.003862 * Math.sin(4.0 * me1) + e * 0.004049 * Math.sin(md - ms + 2.0 * me1);
  l = l + 0.003996 * Math.sin(2.0 * (md + me1)) + 0.003665 * Math.sin(2.0 * me1 - 3.0 * md);
  l = l + e * 0.002695 * Math.sin(2.0 * md - ms) + 0.002602 * Math.sin(md - 2.0 * (mf + me1));
  l = l + e * 0.002396 * Math.sin(2.0 * (me1 - md) - ms) - 0.002349 * Math.sin(md + me1);
  l = l + e2 * 0.002249 * Math.sin(2.0 * (me1 - ms)) - e * 0.002125 * Math.sin(2.0 * md + ms);
  l = l - e2 * 0.002079 * Math.sin(2.0 * ms) + e2 * 0.002059 * Math.sin(2.0 * (me1 - ms) - md);
  l = l - 0.001773 * Math.sin(md + 2.0 * (me1 - mf)) - 0.001595 * Math.sin(2.0 * (mf + me1));
  l = l + e * 0.00122 * Math.sin(4.0 * me1 - ms - md) - 0.00111 * Math.sin(2.0 * (md + mf));
  l = l + 0.000892 * Math.sin(md - 3.0 * me1) - e * 0.000811 * Math.sin(ms + md + 2.0 * me1);
  l = l + e * 0.000761 * Math.sin(4.0 * me1 - ms - 2.0 * md);
  l = l + e2 * 0.000704 * Math.sin(md - 2.0 * (ms + me1));
  l = l + e * 0.000693 * Math.sin(ms - 2.0 * (md - me1));
  l = l + e * 0.000598 * Math.sin(2.0 * (me1 - mf) - ms);
  l = l + 0.00055 * Math.sin(md + 4.0 * me1) + 0.000538 * Math.sin(4.0 * md);
  l = l + e * 0.000521 * Math.sin(4.0 * me1 - ms) + 0.000486 * Math.sin(2.0 * md - me1);
  l = l + e2 * 0.000717 * Math.sin(md - 2.0 * ms);
  var mm = unwind(ml + paUtils.degreesToRadians(l));

  return degrees(mm);
}

/**
 * Calculate geocentric ecliptic latitude for the Moon
 * 
 * Original macro name: MoonLat
 */
function moonLat(lh, lm, ls, ds, zc, dy, mn, yr) {
  var ut = localCivilTimeToUniversalTime(lh, lm, ls, ds, zc, dy, mn, yr);
  var gd = localCivilTimeGreenwichDay(lh, lm, ls, ds, zc, dy, mn, yr);
  var gm = localCivilTimeGreenwichMonth(lh, lm, ls, ds, zc, dy, mn, yr);
  var gy = localCivilTimeGreenwichYear(lh, lm, ls, ds, zc, dy, mn, yr);
  var t = ((civilDateToJulianDate(gd, gm, gy) - 2415020) / 36525) + (ut / 876600);
  var t2 = t * t;

  var m1 = 27.32158213;
  var m2 = 365.2596407;
  var m3 = 27.55455094;
  var m4 = 29.53058868;
  var m5 = 27.21222039;
  var m6 = 6798.363307;
  var q = civilDateToJulianDate(gd, gm, gy) - 2415020 + (ut / 24);
  m1 = q / m1;
  m2 = q / m2;
  m3 = q / m3;
  m4 = q / m4;
  m5 = q / m5;
  m6 = q / m6;
  m1 = 360 * (m1 - Math.floor(m1));
  m2 = 360 * (m2 - Math.floor(m2));
  m3 = 360 * (m3 - Math.floor(m3));
  m4 = 360 * (m4 - Math.floor(m4));
  m5 = 360 * (m5 - Math.floor(m5));
  m6 = 360 * (m6 - Math.floor(m6));

  var ml = 270.434164 + m1 - (0.001133 - 0.0000019 * t) * t2;
  var ms = 358.475833 + m2 - (0.00015 + 0.0000033 * t) * t2;
  var md = 296.104608 + m3 + (0.009192 + 0.0000144 * t) * t2;
  var me1 = 350.737486 + m4 - (0.001436 - 0.0000019 * t) * t2;
  var mf = 11.250889 + m5 - (0.003211 + 0.0000003 * t) * t2;
  var na = 259.183275 - m6 + (0.002078 + 0.0000022 * t) * t2;
  var a = paUtils.degreesToRadians(51.2 + 20.2 * t);
  var s1 = Math.sin(a);
  var s2 = Math.sin(paUtils.degreesToRadians(na));
  var b = 346.56 + (132.87 - 0.0091731 * t) * t;
  var s3 = 0.003964 * Math.sin(paUtils.degreesToRadians(b));
  var c = paUtils.degreesToRadians(na + 275.05 - 2.3 * t);
  var s4 = Math.sin(c);
  ml = ml + 0.000233 * s1 + s3 + 0.001964 * s2;
  ms = ms - 0.001778 * s1;
  md = md + 0.000817 * s1 + s3 + 0.002541 * s2;
  mf = mf + s3 - 0.024691 * s2 - 0.004328 * s4;
  me1 = me1 + 0.002011 * s1 + s3 + 0.001964 * s2;
  var e = 1.0 - (0.002495 + 0.00000752 * t) * t;
  var e2 = e * e;
  ms = paUtils.degreesToRadians(ms);
  na = paUtils.degreesToRadians(na);
  me1 = paUtils.degreesToRadians(me1);
  mf = paUtils.degreesToRadians(mf);
  md = paUtils.degreesToRadians(md);

  var g = 5.128189 * Math.sin(mf) + 0.280606 * Math.sin(md + mf);
  g = g + 0.277693 * Math.sin(md - mf) + 0.173238 * Math.sin(2.0 * me1 - mf);
  g = g + 0.055413 * Math.sin(2.0 * me1 + mf - md) + 0.046272 * Math.sin(2.0 * me1 - mf - md);
  g = g + 0.032573 * Math.sin(2.0 * me1 + mf) + 0.017198 * Math.sin(2.0 * md + mf);
  g = g + 0.009267 * Math.sin(2.0 * me1 + md - mf) + 0.008823 * Math.sin(2.0 * md - mf);
  g = g + e * 0.008247 * Math.sin(2.0 * me1 - ms - mf) + 0.004323 * Math.sin(2.0 * (me1 - md) - mf);
  g = g + 0.0042 * Math.sin(2.0 * me1 + mf + md) + e * 0.003372 * Math.sin(mf - ms - 2.0 * me1);
  g = g + e * 0.002472 * Math.sin(2.0 * me1 + mf - ms - md);
  g = g + e * 0.002222 * Math.sin(2.0 * me1 + mf - ms);
  g = g + e * 0.002072 * Math.sin(2.0 * me1 - mf - ms - md);
  g = g + e * 0.001877 * Math.sin(mf - ms + md) + 0.001828 * Math.sin(4.0 * me1 - mf - md);
  g = g - e * 0.001803 * Math.sin(mf + ms) - 0.00175 * Math.sin(3.0 * mf);
  g = g + e * 0.00157 * Math.sin(md - ms - mf) - 0.001487 * Math.sin(mf + me1);
  g = g - e * 0.001481 * Math.sin(mf + ms + md) + e * 0.001417 * Math.sin(mf - ms - md);
  g = g + e * 0.00135 * Math.sin(mf - ms) + 0.00133 * Math.sin(mf - me1);
  g = g + 0.001106 * Math.sin(mf + 3.0 * md) + 0.00102 * Math.sin(4.0 * me1 - mf);
  g = g + 0.000833 * Math.sin(mf + 4.0 * me1 - md) + 0.000781 * Math.sin(md - 3.0 * mf);
  g = g + 0.00067 * Math.sin(mf + 4.0 * me1 - 2.0 * md) + 0.000606 * Math.sin(2.0 * me1 - 3.0 * mf);
  g = g + 0.000597 * Math.sin(2.0 * (me1 + md) - mf);
  g = g + e * 0.000492 * Math.sin(2.0 * me1 + md - ms - mf) + 0.00045 * Math.sin(2.0 * (md - me1) - mf);
  g = g + 0.000439 * Math.sin(3.0 * md - mf) + 0.000423 * Math.sin(mf + 2.0 * (me1 + md));
  g = g + 0.000422 * Math.sin(2.0 * me1 - mf - 3.0 * md) - e * 0.000367 * Math.sin(ms + mf + 2.0 * me1 - md);
  g = g - e * 0.000353 * Math.sin(ms + mf + 2.0 * me1) + 0.000331 * Math.sin(mf + 4.0 * me1);
  g = g + e * 0.000317 * Math.sin(2.0 * me1 + mf - ms + md);
  g = g + e2 * 0.000306 * Math.sin(2.0 * (me1 - ms) - mf) - 0.000283 * Math.sin(md + 3.0 * mf);
  var w1 = 0.0004664 * Math.cos(na);
  var w2 = 0.0000754 * Math.cos(c);
  var bm = paUtils.degreesToRadians(g) * (1.0 - w1 - w2);

  return degrees(bm);
}

/**
 * Calculate horizontal parallax for the Moon
 * 
 * Original macro name: MoonHP
 */
function moonHP(lh, lm, ls, ds, zc, dy, mn, yr) {
  var ut = localCivilTimeToUniversalTime(lh, lm, ls, ds, zc, dy, mn, yr);
  var gd = localCivilTimeGreenwichDay(lh, lm, ls, ds, zc, dy, mn, yr);
  var gm = localCivilTimeGreenwichMonth(lh, lm, ls, ds, zc, dy, mn, yr);
  var gy = localCivilTimeGreenwichYear(lh, lm, ls, ds, zc, dy, mn, yr);
  var t = ((civilDateToJulianDate(gd, gm, gy) - 2415020) / 36525) + (ut / 876600);
  var t2 = t * t;

  var m1 = 27.32158213;
  var m2 = 365.2596407;
  var m3 = 27.55455094;
  var m4 = 29.53058868;
  var m5 = 27.21222039;
  var m6 = 6798.363307;
  var q = civilDateToJulianDate(gd, gm, gy) - 2415020 + (ut / 24);
  m1 = q / m1;
  m2 = q / m2;
  m3 = q / m3;
  m4 = q / m4;
  m5 = q / m5;
  m6 = q / m6;
  m1 = 360 * (m1 - Math.floor(m1));
  m2 = 360 * (m2 - Math.floor(m2));
  m3 = 360 * (m3 - Math.floor(m3));
  m4 = 360 * (m4 - Math.floor(m4));
  m5 = 360 * (m5 - Math.floor(m5));
  m6 = 360 * (m6 - Math.floor(m6));

  var ml = 270.434164 + m1 - (0.001133 - 0.0000019 * t) * t2;
  var ms = 358.475833 + m2 - (0.00015 + 0.0000033 * t) * t2;
  var md = 296.104608 + m3 + (0.009192 + 0.0000144 * t) * t2;
  var me1 = 350.737486 + m4 - (0.001436 - 0.0000019 * t) * t2;
  var mf = 11.250889 + m5 - (0.003211 + 0.0000003 * t) * t2;
  var na = 259.183275 - m6 + (0.002078 + 0.0000022 * t) * t2;
  var a = paUtils.degreesToRadians(51.2 + 20.2 * t);
  var s1 = Math.sin(a);
  var s2 = Math.sin(paUtils.degreesToRadians(na));
  var b = 346.56 + (132.87 - 0.0091731 * t) * t;
  var s3 = 0.003964 * Math.sin(paUtils.degreesToRadians(b));
  var c = paUtils.degreesToRadians(na + 275.05 - 2.3 * t);
  var s4 = Math.sin(c);
  ml = ml + 0.000233 * s1 + s3 + 0.001964 * s2;
  ms = ms - 0.001778 * s1;
  md = md + 0.000817 * s1 + s3 + 0.002541 * s2;
  mf = mf + s3 - 0.024691 * s2 - 0.004328 * s4;
  me1 = me1 + 0.002011 * s1 + s3 + 0.001964 * s2;
  var e = 1.0 - (0.002495 + 0.00000752 * t) * t;
  var e2 = e * e;
  ms = paUtils.degreesToRadians(ms);
  me1 = paUtils.degreesToRadians(me1);
  mf = paUtils.degreesToRadians(mf);
  md = paUtils.degreesToRadians(md);

  var pm = 0.950724 + 0.051818 * Math.cos(md) + 0.009531 * Math.cos(2.0 * me1 - md);
  pm = pm + 0.007843 * Math.cos(2.0 * me1) + 0.002824 * Math.cos(2.0 * md);
  pm = pm + 0.000857 * Math.cos(2.0 * me1 + md) + e * 0.000533 * Math.cos(2.0 * me1 - ms);
  pm = pm + e * 0.000401 * Math.cos(2.0 * me1 - md - ms);
  pm = pm + e * 0.00032 * Math.cos(md - ms) - 0.000271 * Math.cos(me1);
  pm = pm - e * 0.000264 * Math.cos(ms + md) - 0.000198 * Math.cos(2.0 * mf - md);
  pm = pm + 0.000173 * Math.cos(3.0 * md) + 0.000167 * Math.cos(4.0 * me1 - md);
  pm = pm - e * 0.000111 * Math.cos(ms) + 0.000103 * Math.cos(4.0 * me1 - 2.0 * md);
  pm = pm - 0.000084 * Math.cos(2.0 * md - 2.0 * me1) - e * 0.000083 * Math.cos(2.0 * me1 + ms);
  pm = pm + 0.000079 * Math.cos(2.0 * me1 + 2.0 * md) + 0.000072 * Math.cos(4.0 * me1);
  pm = pm + e * 0.000064 * Math.cos(2.0 * me1 - ms + md) - e * 0.000063 * Math.cos(2.0 * me1 + ms - md);
  pm = pm + e * 0.000041 * Math.cos(ms + me1) + e * 0.000035 * Math.cos(2.0 * md - ms);
  pm = pm - 0.000033 * Math.cos(3.0 * md - 2.0 * me1) - 0.00003 * Math.cos(md + me1);
  pm = pm - 0.000029 * Math.cos(2.0 * (mf - me1)) - e * 0.000029 * Math.cos(2.0 * md + ms);
  pm = pm + e2 * 0.000026 * Math.cos(2.0 * (me1 - ms)) - 0.000023 * Math.cos(2.0 * (mf - me1) + md);
  pm = pm + e * 0.000019 * Math.cos(4.0 * me1 - ms - md);

  return pm;
}

/**
 * Convert angle in radians to equivalent angle in degrees.
 * 
 * Original macro name: Unwind
 */
function unwind(w) {
  return w - 6.283185308 * Math.floor(w / 6.283185308);
}

/**
 * Convert angle in degrees to equivalent angle in the range 0 to 360 degrees.
 * 
 * Original macro name: UnwindDeg
 */
function unwindDeg(w) {
  return w - 360 * Math.floor(w / 360);
}

/**
 * Mean ecliptic longitude of the Sun at the epoch
 * 
 * Original macro name: SunElong
 */
function sunELong(gd, gm, gy) {
  var t = (civilDateToJulianDate(gd, gm, gy) - 2415020) / 36525;
  var t2 = t * t;
  var x = 279.6966778 + 36000.76892 * t + 0.0003025 * t2;

  return x - 360 * Math.floor(x / 360);
}

/**
 * Longitude of the Sun at perigee
 * 
 * Original macro name: SunPeri
 */
function sunPeri(gd, gm, gy) {
  var t = (civilDateToJulianDate(gd, gm, gy) - 2415020) / 36525;
  var t2 = t * t;
  var x = 281.2208444 + 1.719175 * t + 0.000452778 * t2;

  return x - 360 * Math.floor(x / 360);
}

/**
 * Eccentricity of the Sun-Earth orbit
 * 
 * Original macro name: SunEcc
 */
function sunEcc(gd, gm, gy) {
  var t = (civilDateToJulianDate(gd, gm, gy) - 2415020) / 36525;
  var t2 = t * t;

  return 0.01675104 - 0.0000418 * t - 0.000000126 * t2;
}

/**
 * Ecliptic - Declination (degrees)
 * 
 * Original macro name: ECDec
 */
function ecDec(eld, elm, els, bd, bm, bs, gd, gm, gy) {
  var a = paUtils.degreesToRadians(degreesMinutesSecondsToDecimalDegrees(eld, elm, els));
  var b = paUtils.degreesToRadians(degreesMinutesSecondsToDecimalDegrees(bd, bm, bs));
  var c = paUtils.degreesToRadians(obliq(gd, gm, gy));
  var d = Math.sin(b) * Math.cos(c) + Math.cos(b) * Math.sin(c) * Math.sin(a);

  return degrees(Math.asin(d));
}

/**
 * Ecliptic - Right Ascension (degrees)
 * 
 * Original macro name: ECRA
 */
function ecRA(eld, elm, els, bd, bm, bs, gd, gm, gy) {
  var a = paUtils.degreesToRadians(degreesMinutesSecondsToDecimalDegrees(eld, elm, els));
  var b = paUtils.degreesToRadians(degreesMinutesSecondsToDecimalDegrees(bd, bm, bs));
  var c = paUtils.degreesToRadians(obliq(gd, gm, gy));
  var d = Math.sin(a) * Math.cos(c) - Math.tan(b) * Math.sin(c);
  var e = Math.cos(a);
  var f = degrees(Math.atan2(d, e));

  return f - 360 * Math.floor(f / 360);
}

/**
 * Calculate Sun's true anomaly, i.e., how much its orbit deviates from a true circle to an ellipse.
 *
 * Original macro name: SunTrueAnomaly
 */
function sunTrueAnomaly(lch, lcm, lcs, ds, zc, ld, lm, ly) {
  var aa = localCivilTimeGreenwichDay(lch, lcm, lcs, ds, zc, ld, lm, ly);
  var bb = localCivilTimeGreenwichMonth(lch, lcm, lcs, ds, zc, ld, lm, ly);
  var cc = localCivilTimeGreenwichYear(lch, lcm, lcs, ds, zc, ld, lm, ly);
  var ut = localCivilTimeToUniversalTime(lch, lcm, lcs, ds, zc, ld, lm, ly);
  var dj = civilDateToJulianDate(aa, bb, cc) - 2415020;

  var t = (dj / 36525) + (ut / 876600);
  var t2 = t * t;

  var a = 99.99736042 * t;
  var b = 360 * (a - Math.floor(a));

  var m1 = 358.47583 - (0.00015 + 0.0000033 * t) * t2 + b;
  var ec = 0.01675104 - 0.0000418 * t - 0.000000126 * t2;

  var am = paUtils.degreesToRadians(m1);

  return degrees(trueAnomaly(am, ec));
}

/**
 * Calculate the Sun's mean anomaly.
 * 
 * Original macro name: SunMeanAnomaly
 */
function sunMeanAnomaly(lch, lcm, lcs, ds, zc, ld, lm, ly) {
  var aa = localCivilTimeGreenwichDay(lch, lcm, lcs, ds, zc, ld, lm, ly);
  var bb = localCivilTimeGreenwichMonth(lch, lcm, lcs, ds, zc, ld, lm, ly);
  var cc = localCivilTimeGreenwichYear(lch, lcm, lcs, ds, zc, ld, lm, ly);
  var ut = localCivilTimeToUniversalTime(lch, lcm, lcs, ds, zc, ld, lm, ly);
  var dj = civilDateToJulianDate(aa, bb, cc) - 2415020;
  var t = (dj / 36525) + (ut / 876600);
  var t2 = t * t;
  var a = 100.0021359 * t;
  var b = 360 * (a - Math.floor(a));
  var m1 = 358.47583 - (0.00015 + 0.0000033 * t) * t2 + b;
  var am = unwind(paUtils.degreesToRadians(m1));

  return am;
}

/**
 * Calculate local civil time of sunrise.
 * 
 * Original macro name: SunriseLCT
 */
function sunriseLCT(ld, lm, ly, ds, zc, gl, gp) {
  var di = 0.8333333;
  var gd = localCivilTimeGreenwichDay(12, 0, 0, ds, zc, ld, lm, ly);
  var gm = localCivilTimeGreenwichMonth(12, 0, 0, ds, zc, ld, lm, ly);
  var gy = localCivilTimeGreenwichYear(12, 0, 0, ds, zc, ld, lm, ly);
  var sr = sunLong(12, 0, 0, ds, zc, ld, lm, ly);

  var [result1_a, result1_x, result1_y, result1_la, result1_s] = sunriseLCTL3710(gd, gm, gy, sr, di, gp);

  var xx;
  if (result1_s != paTypes.RiseSetCalcStatus.OK) {
    xx = -99.0;
  }
  else {
    var x = localSiderealTimeToGreenwichSiderealTime(result1_la, 0, 0, gl);
    var ut = greenwichSiderealTimeToUniversalTime(x, 0, 0, gd, gm, gy);

    if (eGreenwichSiderealToUniversalTime(x, 0, 0, gd, gm, gy) != paTypes.WarningFlag.OK) {
      xx = -99.0;
    }
    else {
      sr = sunLong(ut, 0, 0, 0, 0, gd, gm, gy);

      var [result2_a, result2_x, result2_y, result2_la, result2_s] = sunriseLCTL3710(gd, gm, gy, sr, di, gp);

      if (result2_s != paTypes.RiseSetCalcStatus.OK) {
        xx = -99.0;
      }
      else {
        x = localSiderealTimeToGreenwichSiderealTime(result2_la, 0, 0, gl);
        ut = greenwichSiderealTimeToUniversalTime(x, 0, 0, gd, gm, gy);
        xx = universalTimeToLocalCivilTime(ut, 0, 0, ds, zc, gd, gm, gy);
      }
    }
  }

  return xx;
}

/**
 * Helper function for sunrise_lct()
 */
function sunriseLCTL3710(gd, gm, gy, sr, di, gp) {
  var a = sr + nutatLong(gd, gm, gy) - 0.005694;
  var x = ecRA(a, 0, 0, 0, 0, 0, gd, gm, gy);
  var y = ecDec(a, 0, 0, 0, 0, 0, gd, gm, gy);
  var la = riseSetLocalSiderealTimeRise(decimalDegreesToDegreeHours(x), 0, 0, y, 0, 0, di, gp);
  var s = eRS(decimalDegreesToDegreeHours(x), 0.0, 0.0, y, 0.0, 0.0, di, gp);

  return [a, x, y, la, s];
}

/**
 * Calculate local civil time of sunset.
 * 
 * Original macro name: SunsetLCT
 */
function sunsetLCT(ld, lm, ly, ds, zc, gl, gp) {
  var di = 0.8333333;
  var gd = localCivilTimeGreenwichDay(12, 0, 0, ds, zc, ld, lm, ly);
  var gm = localCivilTimeGreenwichMonth(12, 0, 0, ds, zc, ld, lm, ly);
  var gy = localCivilTimeGreenwichYear(12, 0, 0, ds, zc, ld, lm, ly);
  var sr = sunLong(12, 0, 0, ds, zc, ld, lm, ly);

  var [result1_a, result1_x, result1_y, result1_la, result1_s] = sunsetLCTL3710(gd, gm, gy, sr, di, gp);

  var xx;
  if (result1_s != paTypes.RiseSetCalcStatus.OK) {
    xx = -99.0;
  }
  else {
    var x = localSiderealTimeToGreenwichSiderealTime(result1_la, 0, 0, gl);
    var ut = greenwichSiderealTimeToUniversalTime(x, 0, 0, gd, gm, gy);

    if (eGreenwichSiderealToUniversalTime(x, 0, 0, gd, gm, gy) != paTypes.WarningFlag.OK) {
      xx = -99.0;
    }
    else {
      sr = sunLong(ut, 0, 0, 0, 0, gd, gm, gy);
      var [result2_a, result2_x, result2_y, result2_la, result2_s] = sunsetLCTL3710(gd, gm, gy, sr, di, gp);

      if (result2_s != paTypes.RiseSetCalcStatus.OK) {
        xx = -99;
      }
      else {
        x = localSiderealTimeToGreenwichSiderealTime(result2_la, 0, 0, gl);
        ut = greenwichSiderealTimeToUniversalTime(x, 0, 0, gd, gm, gy);
        xx = universalTimeToLocalCivilTime(ut, 0, 0, ds, zc, gd, gm, gy);
      }
    }
  }
  return xx;
}

/**
 * Helper function for sunset_lct().
 */
function sunsetLCTL3710(gd, gm, gy, sr, di, gp) {
  var a = sr + nutatLong(gd, gm, gy) - 0.005694;
  var x = ecRA(a, 0.0, 0.0, 0.0, 0.0, 0.0, gd, gm, gy);
  var y = ecDec(a, 0.0, 0.0, 0.0, 0.0, 0.0, gd, gm, gy);
  var la = riseSetLocalSiderealTimeSet(decimalDegreesToDegreeHours(x), 0, 0, y, 0, 0, di, gp);
  var s = eRS(decimalDegreesToDegreeHours(x), 0, 0, y, 0, 0, di, gp);

  return [a, x, y, la, s];
}

/**
 * Calculate azimuth of sunrise.
 *
 * Original macro name: SunriseAz
 */
function sunriseAZ(ld, lm, ly, ds, zc, gl, gp) {
  var di = 0.8333333;
  var gd = localCivilTimeGreenwichDay(12, 0, 0, ds, zc, ld, lm, ly);
  var gm = localCivilTimeGreenwichMonth(12, 0, 0, ds, zc, ld, lm, ly);
  var gy = localCivilTimeGreenwichYear(12, 0, 0, ds, zc, ld, lm, ly);
  var sr = sunLong(12, 0, 0, ds, zc, ld, lm, ly);

  var [result1_a, result1_x, result1_y, result1_la, result1_s] = sunriseAZ_L3710(gd, gm, gy, sr, di, gp);

  if (result1_s != paTypes.RiseSetCalcStatus.OK) {
    return -99.0;
  }

  var x = localSiderealTimeToGreenwichSiderealTime(result1_la, 0, 0, gl);
  var ut = greenwichSiderealTimeToUniversalTime(x, 0, 0, gd, gm, gy);

  if (eGreenwichSiderealToUniversalTime(x, 0, 0, gd, gm, gy) != paTypes.WarningFlag.OK) {
    return -99.0;
  }

  sr = sunLong(ut, 0, 0, 0, 0, gd, gm, gy);

  var [result2_a, result2_x, result2_y, result2_la, result2_s] = sunriseAZ_L3710(gd, gm, gy, sr, di, gp);

  if (result2_s != paTypes.RiseSetCalcStatus.OK) {
    return -99.0;
  }

  return riseSetAzimuthRise(decimalDegreesToDegreeHours(x), 0, 0, result2_y, 0.0, 0.0, di, gp);
}

/**
 * Helper function for sunrise_az()
 */
function sunriseAZ_L3710(gd, gm, gy, sr, di, gp) {
  var a = sr + nutatLong(gd, gm, gy) - 0.005694;
  var x = ecRA(a, 0, 0, 0, 0, 0, gd, gm, gy);
  var y = ecDec(a, 0, 0, 0, 0, 0, gd, gm, gy);
  var la = riseSetLocalSiderealTimeRise(decimalDegreesToDegreeHours(x), 0, 0, y, 0, 0, di, gp);
  var s = eRS(decimalDegreesToDegreeHours(x), 0, 0, y, 0, 0, di, gp);

  return [a, x, y, la, s];
}

/**
 * Calculate azimuth of sunset.
 * 
 * Original macro name: SunsetAz
 */
function sunsetAZ(ld, lm, ly, ds, zc, gl, gp) {
  var di = 0.8333333;
  var gd = localCivilTimeGreenwichDay(12, 0, 0, ds, zc, ld, lm, ly);
  var gm = localCivilTimeGreenwichMonth(12, 0, 0, ds, zc, ld, lm, ly);
  var gy = localCivilTimeGreenwichYear(12, 0, 0, ds, zc, ld, lm, ly);
  var sr = sunLong(12, 0, 0, ds, zc, ld, lm, ly);

  var [result1_a, result1_x, result1_y, result1_la, result1_s] = sunsetAZ_L3710(gd, gm, gy, sr, di, gp);

  if (result1_s != paTypes.RiseSetCalcStatus.OK) {
    return -99.0;
  }

  var x = localSiderealTimeToGreenwichSiderealTime(result1_la, 0, 0, gl);
  var ut = greenwichSiderealTimeToUniversalTime(x, 0, 0, gd, gm, gy);

  if (eGreenwichSiderealToUniversalTime(x, 0, 0, gd, gm, gy) != paTypes.WarningFlag.OK) {
    return -99.0;
  }

  sr = sunLong(ut, 0, 0, 0, 0, gd, gm, gy);

  var [result2_a, result2_x, result2_y, result2_la, result2_s] = sunsetAZ_L3710(gd, gm, gy, sr, di, gp);

  if (result2_s != paTypes.RiseSetCalcStatus.OK) {
    return -99.0;
  }
  return riseSetAzimuthSet(decimalDegreesToDegreeHours(x), 0, 0, result2_y, 0, 0, di, gp);
}

/**
 * Helper function for sunset_az()
 */
function sunsetAZ_L3710(gd, gm, gy, sr, di, gp) {
  var a = sr + nutatLong(gd, gm, gy) - 0.005694;
  var x = ecRA(a, 0, 0, 0, 0, 0, gd, gm, gy);
  var y = ecDec(a, 0, 0, 0, 0, 0, gd, gm, gy);
  var la = riseSetLocalSiderealTimeSet(decimalDegreesToDegreeHours(x), 0, 0, y, 0, 0, di, gp);
  var s = eRS(decimalDegreesToDegreeHours(x), 0, 0, y, 0, 0, di, gp);

  return [a, x, y, la, s];
}

/**
 * Status of conversion of Greenwich Sidereal Time to Universal Time.
 * 
 * Original macro name: eGSTUT
 */
function eGreenwichSiderealToUniversalTime(gsh, gsm, gss, gd, gm, gy) {
  var a = civilDateToJulianDate(gd, gm, gy);
  var b = a - 2451545;
  var c = b / 36525;
  var d = 6.697374558 + (2400.051336 * c) + (0.000025862 * c * c);
  var e = d - (24 * Math.floor(d / 24));
  var f = HMStoDH(gsh, gsm, gss);
  var g = f - e;
  var h = g - (24 * Math.floor(g / 24));

  return ((h * 0.9972695663) < (4.0 / 60.0)) ? paTypes.WarningFlag.Warning : paTypes.WarningFlag.OK;
}

/**
 * Rise/Set status
 * 
 * Original macro name: eRS
 */
function eRS(rah, ram, ras, dd, dm, ds, vd, g) {
  var a = HMStoDH(rah, ram, ras);
  var c = paUtils.degreesToRadians(degreesMinutesSecondsToDecimalDegrees(dd, dm, ds));
  var d = paUtils.degreesToRadians(vd);
  var e = paUtils.degreesToRadians(g);
  var f = -(Math.sin(d) + Math.sin(e) * Math.sin(c)) / (Math.cos(e) * Math.cos(c));

  var returnValue = paTypes.RiseSetStatus.OK
  if (f >= 1)
    returnValue = paTypes.RiseSetStatus.NeverRises;
  if (f <= -1)
    returnValue = paTypes.RiseSetStatus.Circumpolar;

  return returnValue;
}

/**
 * Local sidereal time of rise, in hours.
 * 
 * Original macro name: RSLSTR
 */
function riseSetLocalSiderealTimeRise(rah, ram, ras, dd, dm, ds, vd, g) {
  var a = HMStoDH(rah, ram, ras);
  var b = paUtils.degreesToRadians(degreeHoursToDecimalDegrees(a));
  var c = paUtils.degreesToRadians(degreesMinutesSecondsToDecimalDegrees(dd, dm, ds));
  var d = paUtils.degreesToRadians(vd);
  var e = paUtils.degreesToRadians(g);
  var f = -(Math.sin(d) + Math.sin(e) * Math.sin(c)) / (Math.cos(e) * Math.cos(c));
  var h = (Math.abs(f) < 1) ? Math.acos(f) : 0;
  var i = decimalDegreesToDegreeHours(degrees(b - h));

  return i - 24 * Math.floor(i / 24);
}

/**
 * Local sidereal time of setting, in hours.
 * 
 * Original macro name: RSLSTS
 */
function riseSetLocalSiderealTimeSet(rah, ram, ras, dd, dm, ds, vd, g) {
  var a = HMStoDH(rah, ram, ras);
  var b = paUtils.degreesToRadians(degreeHoursToDecimalDegrees(a));
  var c = paUtils.degreesToRadians(degreesMinutesSecondsToDecimalDegrees(dd, dm, ds));
  var d = paUtils.degreesToRadians(vd);
  var e = paUtils.degreesToRadians(g);
  var f = -(Math.sin(d) + Math.sin(e) * Math.sin(c)) / (Math.cos(e) * Math.cos(c));
  var h = (Math.abs(f) < 1) ? Math.acos(f) : 0;
  var i = decimalDegreesToDegreeHours(degrees(b + h));

  return i - 24 * Math.floor(i / 24);
}

/**
 * Sunrise/Sunset calculation status.
 * 
 * Original macro name: eSunRS
 */
function eSunRS(ld, lm, ly, ds, zc, gl, gp) {
  var di = 0.8333333;
  var gd = localCivilTimeGreenwichDay(12, 0, 0, ds, zc, ld, lm, ly);
  var gm = localCivilTimeGreenwichMonth(12, 0, 0, ds, zc, ld, lm, ly);
  var gy = localCivilTimeGreenwichYear(12, 0, 0, ds, zc, ld, lm, ly);
  var sr = sunLong(12, 0, 0, ds, zc, ld, lm, ly);

  var [result1_a, result1_x, result1_y, result1_la, result1_s] = eSunRS_L3710(gd, gm, gy, sr, di, gp);

  if (result1_s != paTypes.RiseSetCalcStatus.OK) {
    return result1_s;
  }
  else {
    var x = localSiderealTimeToGreenwichSiderealTime(result1_la, 0, 0, gl);
    var ut = greenwichSiderealTimeToUniversalTime(x, 0, 0, gd, gm, gy);
    sr = sunLong(ut, 0, 0, 0, 0, gd, gm, gy);
    var [result2_a, result2_x, result2_y, result2_la, result2_s] = eSunRS_L3710(gd, gm, gy, sr, di, gp);
    if (result2_s != paTypes.RiseSetCalcStatus.OK) {
      return result2_s;
    }
    else {
      x = localSiderealTimeToGreenwichSiderealTime(result2_la, 0, 0, gl);

      if (eGreenwichSiderealToUniversalTime(x, 0, 0, gd, gm, gy) != paTypes.WarningFlag.OK) {
        return paTypes.RiseSetCalcStatus.ConversionWarning;
      }

      return result2_s;
    }
  }
}

/**
 * Helper function for eSunRS()
 */
function eSunRS_L3710(gd, gm, gy, sr, di, gp) {
  var a = sr + nutatLong(gd, gm, gy) - 0.005694;
  var x = ecRA(a, 0, 0, 0, 0, 0, gd, gm, gy);
  var y = ecDec(a, 0, 0, 0, 0, 0, gd, gm, gy);
  var la = riseSetLocalSiderealTimeRise(decimalDegreesToDegreeHours(x), 0, 0, y, 0, 0, di, gp);
  var s = eRS(decimalDegreesToDegreeHours(x), 0, 0, y, 0, 0, di, gp);

  return [a, x, y, la, s];
}

/**
 * Azimuth of rising, in degrees.
 * 
 * Original macro name: RSAZR
 */
function riseSetAzimuthRise(rah, ram, ras, dd, dm, ds, vd, g) {
  var a = HMStoDH(rah, ram, ras);
  var c = paUtils.degreesToRadians(degreesMinutesSecondsToDecimalDegrees(dd, dm, ds));
  var d = paUtils.degreesToRadians(vd);
  var e = paUtils.degreesToRadians(g);
  var f = (Math.sin(c) + Math.sin(d) * Math.sin(e)) / (Math.cos(d) * Math.cos(e));
  var h = (eRS(rah, ram, ras, dd, dm, ds, vd, g) == paTypes.RiseSetStatus.OK) ? Math.acos(f) : 0;
  var i = degrees(h);

  return i - 360 * Math.floor(i / 360);
}

/**
 * Azimuth of setting, in degrees.
 * 
 * Original macro name: RSAZS
 */
function riseSetAzimuthSet(rah, ram, ras, dd, dm, ds, vd, g) {
  var a = HMStoDH(rah, ram, ras);
  var c = paUtils.degreesToRadians(degreesMinutesSecondsToDecimalDegrees(dd, dm, ds));
  var d = paUtils.degreesToRadians(vd);
  var e = paUtils.degreesToRadians(g);
  var f = (Math.sin(c) + Math.sin(d) * Math.sin(e)) / (Math.cos(d) * Math.cos(e));
  var h = (eRS(rah, ram, ras, dd, dm, ds, vd, g) == paTypes.RiseSetStatus.OK) ? Math.acos(f) : 0;
  var i = 360 - degrees(h);

  return i - 360 * Math.floor(i / 360);
}

/**
 * Calculate morning twilight start, in local time.
 * 
 * Original macro name: TwilightAMLCT
 */
function twilightAMLCT(ld, lm, ly, ds, zc, gl, gp, tt) {
  var di = tt;

  var gd = localCivilTimeGreenwichDay(12, 0, 0, ds, zc, ld, lm, ly);
  var gm = localCivilTimeGreenwichMonth(12, 0, 0, ds, zc, ld, lm, ly);
  var gy = localCivilTimeGreenwichYear(12, 0, 0, ds, zc, ld, lm, ly);
  var sr = sunLong(12, 0, 0, ds, zc, ld, lm, ly);

  var [result1_a, result1_x, result1_y, result1_la, result1_s] = twilightAMLCT_L3710(gd, gm, gy, sr, di, gp);

  if (result1_s != "OK")
    return -99.0;

  var x = localSiderealTimeToGreenwichSiderealTime(result1_la, 0, 0, gl);
  var ut = greenwichSiderealTimeToUniversalTime(x, 0, 0, gd, gm, gy);

  if (eGreenwichSiderealToUniversalTime(x, 0, 0, gd, gm, gy) != paTypes.WarningFlag.OK)
    return -99.0;

  sr = sunLong(ut, 0, 0, 0, 0, gd, gm, gy);

  var [result2_a, result2_x, result2_y, result2_la, result2_s] = twilightAMLCT_L3710(gd, gm, gy, sr, di, gp);

  if (result2_s != "OK")
    return -99.0;

  x = localSiderealTimeToGreenwichSiderealTime(result2_la, 0, 0, gl);
  ut = greenwichSiderealTimeToUniversalTime(x, 0, 0, gd, gm, gy);

  var xx = universalTimeToLocalCivilTime(ut, 0, 0, ds, zc, gd, gm, gy);

  return xx;
}

/**
 * Helper function for twilight_am_lct()
 */
function twilightAMLCT_L3710(gd, gm, gy, sr, di, gp) {
  var a = sr + nutatLong(gd, gm, gy) - 0.005694;
  var x = ecRA(a, 0, 0, 0, 0, 0, gd, gm, gy);
  var y = ecDec(a, 0, 0, 0, 0, 0, gd, gm, gy);
  var la = riseSetLocalSiderealTimeRise(decimalDegreesToDegreeHours(x), 0, 0, y, 0, 0, di, gp);
  var s = eRS(decimalDegreesToDegreeHours(x), 0, 0, y, 0, 0, di, gp);

  return [a, x, y, la, s];
}

/**
 * Calculate evening twilight end, in local time.
 * 
 * Original macro name: TwilightPMLCT
 */
function twilightPMLCT(ld, lm, ly, ds, zc, gl, gp, tt) {
  var di = tt;

  var gd = localCivilTimeGreenwichDay(12, 0, 0, ds, zc, ld, lm, ly);
  var gm = localCivilTimeGreenwichMonth(12, 0, 0, ds, zc, ld, lm, ly);
  var gy = localCivilTimeGreenwichYear(12, 0, 0, ds, zc, ld, lm, ly);
  var sr = sunLong(12, 0, 0, ds, zc, ld, lm, ly);

  var [result1_a, result1_x, result1_y, result1_la, result1_s] = twilightPMLCT_L3710(gd, gm, gy, sr, di, gp);

  if (result1_s != "OK")
    return 0.0;

  var x = localSiderealTimeToGreenwichSiderealTime(result1_la, 0, 0, gl);
  var ut = greenwichSiderealTimeToUniversalTime(x, 0, 0, gd, gm, gy);

  if (eGreenwichSiderealToUniversalTime(x, 0, 0, gd, gm, gy) != paTypes.WarningFlag.OK)
    return 0.0;

  sr = sunLong(ut, 0, 0, 0, 0, gd, gm, gy);

  var [result2_a, result2_x, result2_y, result2_la, result2_s] = twilightPMLCT_L3710(gd, gm, gy, sr, di, gp);

  if (result2_s != "OK")
    return 0.0;

  x = localSiderealTimeToGreenwichSiderealTime(result2_la, 0, 0, gl);
  ut = greenwichSiderealTimeToUniversalTime(x, 0, 0, gd, gm, gy);

  return universalTimeToLocalCivilTime(ut, 0, 0, ds, zc, gd, gm, gy);
}

/**
 * Helper function for twilight_pm_lct()
 */
function twilightPMLCT_L3710(gd, gm, gy, sr, di, gp) {
  var a = sr + nutatLong(gd, gm, gy) - 0.005694;
  var x = ecRA(a, 0, 0, 0, 0, 0, gd, gm, gy);
  var y = ecDec(a, 0, 0, 0, 0, 0, gd, gm, gy);
  var la = riseSetLocalSiderealTimeSet(decimalDegreesToDegreeHours(x), 0, 0, y, 0, 0, di, gp);
  var s = eRS(decimalDegreesToDegreeHours(x), 0, 0, y, 0, 0, di, gp);

  return [a, x, y, la, s];
}

/**
 * Twilight calculation status.
 * 
 * Original macro name: eTwilight
 */
function eTwilight(ld, lm, ly, ds, zc, gl, gp, tt) {
  var di = tt;

  var gd = localCivilTimeGreenwichDay(12, 0, 0, ds, zc, ld, lm, ly);
  var gm = localCivilTimeGreenwichMonth(12, 0, 0, ds, zc, ld, lm, ly);
  var gy = localCivilTimeGreenwichYear(12, 0, 0, ds, zc, ld, lm, ly);
  var sr = sunLong(12, 0, 0, ds, zc, ld, lm, ly);

  var [result1_a, result1_x, result1_y, result1_la, result1_s] = eTwilight_L3710(gd, gm, gy, sr, di, gp);

  if (result1_s != "OK")
    return result1_s;

  var x = localSiderealTimeToGreenwichSiderealTime(result1_la, 0, 0, gl);
  var ut = greenwichSiderealTimeToUniversalTime(x, 0, 0, gd, gm, gy);
  sr = sunLong(ut, 0, 0, 0, 0, gd, gm, gy);

  var [result2_a, result2_x, result2_y, result2_la, result2_s] = eTwilight_L3710(gd, gm, gy, sr, di, gp);

  if (result2_s != "OK")
    return result2_s;

  x = localSiderealTimeToGreenwichSiderealTime(result2_la, 0, 0, gl);

  if (eGreenwichSiderealToUniversalTime(x, 0, 0, gd, gm, gy) != paTypes.WarningFlag.OK) {
    return paTypes.TwilightStatus.ConversionWarning;
  }

  return result2_s;
}

/**
 * Helper function for e_twilight()
 */
function eTwilight_L3710(gd, gm, gy, sr, di, gp) {
  var a = sr + nutatLong(gd, gm, gy) - 0.005694;
  var x = ecRA(a, 0, 0, 0, 0, 0, gd, gm, gy);
  var y = ecDec(a, 0, 0, 0, 0, 0, gd, gm, gy);
  var la = riseSetLocalSiderealTimeRise(decimalDegreesToDegreeHours(x), 0, 0, y, 0, 0, di, gp);
  var s = eRS(decimalDegreesToDegreeHours(x), 0, 0, y, 0, 0, di, gp);

  if (s != paTypes.RiseSetStatus.OK) {
    if (s == paTypes.RiseSetStatus.Circumpolar) {
      s = paTypes.TwilightStatus.AllNight;
    }
    else {
      if (s == paTypes.RiseSetStatus.NeverRises) {
        s = paTypes.TwilightStatus.TooFarBelowHorizon;
      }
    }
  }

  return [a, x, y, la, s];
}

/**
 * Calculate the angle between two celestial objects
 * 
 * Original macro name: Angle
 */
function angle(xx1, xm1, xs1, dd1, dm1, ds1, xx2, xm2, xs2, dd2, dm2, ds2, s) {
  var a = (s == paTypes.AngleMeasure.Hours) ? degreeHoursToDecimalDegrees(HMStoDH(xx1, xm1, xs1)) : degreesMinutesSecondsToDecimalDegrees(xx1, xm1, xs1);
  var b = paUtils.degreesToRadians(a);
  var c = degreesMinutesSecondsToDecimalDegrees(dd1, dm1, ds1);
  var d = paUtils.degreesToRadians(c);
  var e = (s == paTypes.AngleMeasure.Hours) ? degreeHoursToDecimalDegrees(HMStoDH(xx2, xm2, xs2)) : degreesMinutesSecondsToDecimalDegrees(xx2, xm2, xs2);
  var f = paUtils.degreesToRadians(e);
  var g = degreesMinutesSecondsToDecimalDegrees(dd2, dm2, ds2);
  var h = paUtils.degreesToRadians(g);
  var i = Math.acos(Math.sin(d) * Math.sin(h) + Math.cos(d) * Math.cos(h) * Math.cos(b - f));

  return degrees(i);
}

/**
 * Calculate several planetary properties.
 * 
 * Original macro names: PlanetLong, PlanetLat, PlanetDist, PlanetHLong1, PlanetHLong2, PlanetHLat, PlanetRVect
 */
function planetCoordinates(lh, lm, ls, ds, zc, dy, mn, yr, s) {
  var a11 = 178.179078;
  var a12 = 415.2057519;
  var a13 = 0.0003011;
  var a14 = 0.0;
  var a21 = 75.899697;
  var a22 = 1.5554889;
  var a23 = 0.0002947;
  var a24 = 0.0;
  var a31 = 0.20561421;
  var a32 = 0.00002046;
  var a33 = -0.00000003;
  var a34 = 0.0;
  var a41 = 7.002881;
  var a42 = 0.0018608;
  var a43 = -0.0000183;
  var a44 = 0.0;
  var a51 = 47.145944;
  var a52 = 1.1852083;
  var a53 = 0.0001739;
  var a54 = 0.0;
  var a61 = 0.3870986;
  var a62 = 6.74;
  var a63 = -0.42;

  var b11 = 342.767053;
  var b12 = 162.5533664;
  var b13 = 0.0003097;
  var b14 = 0.0;
  var b21 = 130.163833;
  var b22 = 1.4080361;
  var b23 = -0.0009764;
  var b24 = 0.0;
  var b31 = 0.00682069;
  var b32 = -0.00004774;
  var b33 = 0.000000091;
  var b34 = 0.0;
  var b41 = 3.393631;
  var b42 = 0.0010058;
  var b43 = -0.000001;
  var b44 = 0.0;
  var b51 = 75.779647;
  var b52 = 0.89985;
  var b53 = 0.00041;
  var b54 = 0.0;
  var b61 = 0.7233316;
  var b62 = 16.92;
  var b63 = -4.4;

  var c11 = 293.737334;
  var c12 = 53.17137642;
  var c13 = 0.0003107;
  var c14 = 0.0;
  var c21 = 334.218203;
  var c22 = 1.8407584;
  var c23 = 0.0001299;
  var c24 = -0.00000119;
  var c31 = 0.0933129;
  var c32 = 0.000092064;
  var c33 = -0.000000077;
  var c34 = 0.0;
  var c41 = 1.850333;
  var c42 = -0.000675;
  var c43 = 0.0000126;
  var c44 = 0.0;
  var c51 = 48.786442;
  var c52 = 0.7709917;
  var c53 = -0.0000014;
  var c54 = -0.00000533;
  var c61 = 1.5236883;
  var c62 = 9.36;
  var c63 = -1.52;

  var d11 = 238.049257;
  var d12 = 8.434172183;
  var d13 = 0.0003347;
  var d14 = -0.00000165;
  var d21 = 12.720972;
  var d22 = 1.6099617;
  var d23 = 0.00105627;
  var d24 = -0.00000343;
  var d31 = 0.04833475;
  var d32 = 0.00016418;
  var d33 = -0.0000004676;
  var d34 = -0.0000000017;
  var d41 = 1.308736;
  var d42 = -0.0056961;
  var d43 = 0.0000039;
  var d44 = 0.0;
  var d51 = 99.443414;
  var d52 = 1.01053;
  var d53 = 0.00035222;
  var d54 = -0.00000851;
  var d61 = 5.202561;
  var d62 = 196.74;
  var d63 = -9.4;

  var e11 = 266.564377;
  var e12 = 3.398638567;
  var e13 = 0.0003245;
  var e14 = -0.0000058;
  var e21 = 91.098214;
  var e22 = 1.9584158;
  var e23 = 0.00082636;
  var e24 = 0.00000461;
  var e31 = 0.05589232;
  var e32 = -0.0003455;
  var e33 = -0.000000728;
  var e34 = 0.00000000074;
  var e41 = 2.492519;
  var e42 = -0.0039189;
  var e43 = -0.00001549;
  var e44 = 0.00000004;
  var e51 = 112.790414;
  var e52 = 0.8731951;
  var e53 = -0.00015218;
  var e54 = -0.00000531;
  var e61 = 9.554747;
  var e62 = 165.6;
  var e63 = -8.88;

  var f11 = 244.19747;
  var f12 = 1.194065406;
  var f13 = 0.000316;
  var f14 = -0.0000006;
  var f21 = 171.548692;
  var f22 = 1.4844328;
  var f23 = 0.0002372;
  var f24 = -0.00000061;
  var f31 = 0.0463444;
  var f32a = -0.00002658;
  var f33 = 0.000000077;
  var f34 = 0.0;
  var f41 = 0.772464;
  var f42 = 0.0006253;
  var f43 = 0.0000395;
  var f44 = 0.0;
  var f51 = 73.477111;
  var f52 = 0.4986678;
  var f53 = 0.0013117;
  var f54 = 0.0;
  var f61 = 19.21814;
  var f62 = 65.8;
  var f63 = -7.19;

  var g11 = 84.457994;
  var g12 = 0.6107942056;
  var g13 = 0.0003205;
  var g14 = -0.0000006;
  var g21 = 46.727364;
  var g22 = 1.4245744;
  var g23 = 0.00039082;
  var g24 = -0.000000605;
  var g31 = 0.00899704;
  var g32 = 0.00000633;
  var g33 = -0.000000002;
  var g34 = 0.0;
  var g41 = 1.779242;
  var g42 = -0.0095436;
  var g43 = -0.0000091;
  var g44 = 0.0;
  var g51 = 130.681389;
  var g52 = 1.098935;
  var g53 = 0.00024987;
  var g54 = -0.000004718;
  var g61 = 30.10957;
  var g62 = 62.2;
  var g63 = -6.87;

  let pl = [];

  pl.push(["", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

  var ip = 0;
  var b = localCivilTimeToUniversalTime(lh, lm, ls, ds, zc, dy, mn, yr);
  var gd = localCivilTimeGreenwichDay(lh, lm, ls, ds, zc, dy, mn, yr);
  var gm = localCivilTimeGreenwichMonth(lh, lm, ls, ds, zc, dy, mn, yr);
  var gy = localCivilTimeGreenwichYear(lh, lm, ls, ds, zc, dy, mn, yr);
  var a = civilDateToJulianDate(gd, gm, gy);
  var t = ((a - 2415020.0) / 36525.0) + (b / 876600.0);

  var a0 = a11;
  var a1 = a12;
  var a2 = a13;
  var a3 = a14;
  var b0 = a21;
  var b1 = a22;
  var b2 = a23;
  var b3 = a24;
  var c0 = a31;
  var c1 = a32;
  var c2 = a33;
  var c3 = a34;
  var d0 = a41;
  var d1 = a42;
  var d2 = a43;
  var d3 = a44;
  var e0 = a51;
  var e1 = a52;
  var e2 = a53;
  var e3 = a54;
  var f = a61;
  var g = a62;
  var h = a63;
  var aa = a1 * t;
  b = 360.0 * (aa - Math.floor(aa));
  var c = a0 + b + (a3 * t + a2) * t * t;

  pl.push(
    [
      "Mercury",
      c - 360.0 * Math.floor(c / 360.0),
      (a1 * 0.009856263) + (a2 + a3) / 36525.0,
      ((b3 * t + b2) * t + b1) * t + b0,
      ((c3 * t + c2) * t + c1) * t + c0,
      ((d3 * t + d2) * t + d1) * t + d0,
      ((e3 * t + e2) * t + e1) * t + e0,
      f,
      g,
      h,
      0.0
    ]
  );

  a0 = b11;
  a1 = b12;
  a2 = b13;
  a3 = b14;
  b0 = b21;
  b1 = b22;
  b2 = b23;
  b3 = b24;
  c0 = b31;
  c1 = b32;
  c2 = b33;
  c3 = b34;
  d0 = b41;
  d1 = b42;
  d2 = b43;
  d3 = b44;
  e0 = b51;
  e1 = b52;
  e2 = b53;
  e3 = b54;
  f = b61;
  g = b62;
  h = b63;
  aa = a1 * t;
  b = 360.0 * (aa - Math.floor(aa));
  c = a0 + b + (a3 * t + a2) * t * t;

  pl.push(
    [
      "Venus",
      c - 360.0 * Math.floor(c / 360.0),
      (a1 * 0.009856263) + (a2 + a3) / 36525.0,
      ((b3 * t + b2) * t + b1) * t + b0,
      ((c3 * t + c2) * t + c1) * t + c0,
      ((d3 * t + d2) * t + d1) * t + d0,
      ((e3 * t + e2) * t + e1) * t + e0,
      f,
      g,
      h,
      0.0
    ]
  );

  a0 = c11;
  a1 = c12;
  a2 = c13;
  a3 = c14;
  b0 = c21;
  b1 = c22;
  b2 = c23;
  b3 = c24;
  c0 = c31;
  c1 = c32;
  c2 = c33;
  c3 = c34;
  d0 = c41;
  d1 = c42;
  d2 = c43;
  d3 = c44;
  e0 = c51;
  e1 = c52;
  e2 = c53;
  e3 = c54;
  f = c61;
  g = c62;
  h = c63;

  aa = a1 * t;
  b = 360.0 * (aa - Math.floor(aa));
  c = a0 + b + (a3 * t + a2) * t * t;

  pl.push(
    [
      "Mars",
      c - 360.0 * Math.floor(c / 360.0),
      (a1 * 0.009856263) + (a2 + a3) / 36525.0,
      ((b3 * t + b2) * t + b1) * t + b0,
      ((c3 * t + c2) * t + c1) * t + c0,
      ((d3 * t + d2) * t + d1) * t + d0,
      ((e3 * t + e2) * t + e1) * t + e0,
      f,
      g,
      h,
      0.0
    ]
  );

  a0 = d11;
  a1 = d12;
  a2 = d13;
  a3 = d14;
  b0 = d21;
  b1 = d22;
  b2 = d23;
  b3 = d24;
  c0 = d31;
  c1 = d32;
  c2 = d33;
  c3 = d34;
  d0 = d41;
  d1 = d42;
  d2 = d43;
  d3 = d44;
  e0 = d51;
  e1 = d52;
  e2 = d53;
  e3 = d54;
  f = d61;
  g = d62;
  h = d63;

  aa = a1 * t;
  b = 360.0 * (aa - Math.floor(aa));
  c = a0 + b + (a3 * t + a2) * t * t;

  pl.push(
    [
      "Jupiter",
      c - 360.0 * Math.floor(c / 360.0),
      (a1 * 0.009856263) + (a2 + a3) / 36525.0,
      ((b3 * t + b2) * t + b1) * t + b0,
      ((c3 * t + c2) * t + c1) * t + c0,
      ((d3 * t + d2) * t + d1) * t + d0,
      ((e3 * t + e2) * t + e1) * t + e0,
      f,
      g,
      h,
      0.0
    ]
  );

  a0 = e11;
  a1 = e12;
  a2 = e13;
  a3 = e14;
  b0 = e21;
  b1 = e22;
  b2 = e23;
  b3 = e24;
  c0 = e31;
  c1 = e32;
  c2 = e33;
  c3 = e34;
  d0 = e41;
  d1 = e42;
  d2 = e43;
  d3 = e44;
  e0 = e51;
  e1 = e52;
  e2 = e53;
  e3 = e54;
  f = e61;
  g = e62;
  h = e63;

  aa = a1 * t;
  b = 360.0 * (aa - Math.floor(aa));
  c = a0 + b + (a3 * t + a2) * t * t;

  pl.push(
    [
      "Saturn",
      c - 360.0 * Math.floor(c / 360.0),
      (a1 * 0.009856263) + (a2 + a3) / 36525.0,
      ((b3 * t + b2) * t + b1) * t + b0,
      ((c3 * t + c2) * t + c1) * t + c0,
      ((d3 * t + d2) * t + d1) * t + d0,
      ((e3 * t + e2) * t + e1) * t + e0,
      f,
      g,
      h,
      0.0
    ]
  );

  a0 = f11;
  a1 = f12;
  a2 = f13;
  a3 = f14;
  b0 = f21;
  b1 = f22;
  b2 = f23;
  b3 = f24;
  c0 = f31;
  c1 = f32a;
  c2 = f33;
  c3 = f34;
  d0 = f41;
  d1 = f42;
  d2 = f43;
  d3 = f44;
  e0 = f51;
  e1 = f52;
  e2 = f53;
  e3 = f54;
  f = f61;
  g = f62;
  h = f63;

  aa = a1 * t;
  b = 360.0 * (aa - Math.floor(aa));
  c = a0 + b + (a3 * t + a2) * t * t;

  pl.push(
    [
      "Uranus",
      c - 360.0 * Math.floor(c / 360.0),
      (a1 * 0.009856263) + (a2 + a3) / 36525.0,
      ((b3 * t + b2) * t + b1) * t + b0,
      ((c3 * t + c2) * t + c1) * t + c0,
      ((d3 * t + d2) * t + d1) * t + d0,
      ((e3 * t + e2) * t + e1) * t + e0,
      f,
      g,
      h,
      0.0
    ]
  );

  a0 = g11;
  a1 = g12;
  a2 = g13;
  a3 = g14;
  b0 = g21;
  b1 = g22;
  b2 = g23;
  b3 = g24;
  c0 = g31;
  c1 = g32;
  c2 = g33;
  c3 = g34;
  d0 = g41;
  d1 = g42;
  d2 = g43;
  d3 = g44;
  e0 = g51;
  e1 = g52;
  e2 = g53;
  e3 = g54;
  f = g61;
  g = g62;
  h = g63;

  aa = a1 * t;
  b = 360.0 * (aa - Math.floor(aa));
  c = a0 + b + (a3 * t + a2) * t * t;

  pl.push(
    [
      "Neptune",
      c - 360.0 * Math.floor(c / 360.0),
      (a1 * 0.009856263) + (a2 + a3) / 36525.0,
      ((b3 * t + b2) * t + b1) * t + b0,
      ((c3 * t + c2) * t + c1) * t + c0,
      ((d3 * t + d2) * t + d1) * t + d0,
      ((e3 * t + e2) * t + e1) * t + e0,
      f,
      g,
      h,
      0.0
    ]
  );

  let checkPlanet = ["not found", -99, -99, -99, -99, -99, -99, -99, -99, -99, -99];

  for (let iLoop = 0; iLoop < pl.length; iLoop++) {
    if (pl[iLoop][0] == s)
      checkPlanet = pl[iLoop];
  }

  if (checkPlanet[0] == "not found")
    return [degrees(unwind(0)), degrees(unwind(0)), degrees(unwind(0)), degrees(unwind(0)), degrees(unwind(0)), degrees(unwind(0)), degrees(unwind(0))];

  var li = 0.0;
  var ms = sunMeanAnomaly(lh, lm, ls, ds, zc, dy, mn, yr);
  var sr = paUtils.degreesToRadians(sunLong(lh, lm, ls, ds, zc, dy, mn, yr));
  var re = sunDist(lh, lm, ls, ds, zc, dy, mn, yr);
  var lg = sr + Math.PI;

  var l0 = 0.0;
  var s0 = 0.0;
  var p0 = 0.0;
  var vo = 0.0;
  var lp1 = 0.0;
  var ll = 0.0;
  var rd = 0.0;
  var pd = 0.0;
  var sp = 0.0;
  var ci = 0.0;

  for (let k = 1; k <= 3; k++) {
    for (let iLoop = 0; iLoop < pl.length; iLoop++) {
      pl[iLoop][10] = paUtils.degreesToRadians(Number(pl[iLoop][1]) - Number(pl[iLoop][3]) - li * Number(pl[iLoop][2]));
    }

    var qa = 0.0;
    var qb = 0.0;
    var qc = 0.0;
    var qd = 0.0;
    var qe = 0.0;
    var qf = 0.0;
    var qg = 0.0;
    var sa = 0.0;
    var ca = 0.0;

    if (s == "Mercury")
      [qa, qb] = planetLong_L4685(pl);

    if (s == "Venus")
      [qa, qb, qc, qe] = planetLong_L4735(pl, ms, t);

    if (s == "Mars") {
      [a, sa, ca, qc, qe, qa, qb] = planetLong_L4810(pl, ms);
    }

    let matchPlanet = ["not found", -99, -99, -99, -99, -99, -99, -99, -99, -99, -99];
    for (let iLoop = 0; iLoop < pl.length; iLoop++) {
      if (pl[iLoop][0] == s)
        matchPlanet = pl[iLoop];
    }

    if (s == "Jupiter" || s == "Saturn" || s == "Uranus" || s == "Neptune")
      [qa, qb, qc, qd, qe, qf, qg] = planetLong_L4945(t, matchPlanet);

    var ec = Number(matchPlanet[4]) + qd;
    var am = Number(matchPlanet[10]) + qe;
    var at = trueAnomaly(am, ec);
    var pvv = (Number(matchPlanet[7]) + qf) * (1.0 - ec * ec) / (1.0 + ec * Math.cos(at));
    var lp = degrees(at) + Number(matchPlanet[3]) + degrees(qc - qe);
    lp = paUtils.degreesToRadians(lp);
    var om = paUtils.degreesToRadians(matchPlanet[6]);
    var lo = lp - om;
    var so = Math.sin(lo);
    var co = Math.cos(lo);
    var inn = paUtils.degreesToRadians(matchPlanet[5]);
    pvv = pvv + qb;
    sp = so * Math.sin(inn);
    var y = so * Math.cos(inn);
    var ps = Math.asin(sp) + qg;
    sp = Math.sin(ps);
    pd = Math.atan2(y, co) + om + paUtils.degreesToRadians(qa);
    pd = unwind(pd);
    ci = Math.cos(ps);
    rd = pvv * ci;
    ll = pd - lg;
    var rh = re * re + pvv * pvv - 2.0 * re * pvv * ci * Math.cos(ll);
    rh = Math.sqrt(rh);
    li = rh * 0.005775518;

    if (k == 1) {
      l0 = pd;
      s0 = ps;
      p0 = pvv;
      vo = rh;
      lp1 = lp;
    }
  }

  var l1 = Math.sin(ll);
  var l2 = Math.cos(ll);

  var ep = (ip < 3) ? Math.atan(-1.0 * rd * l1 / (re - rd * l2)) + lg + Math.PI : Math.atan(re * l1 / (rd - re * l2)) + pd;
  ep = unwind(ep);

  var bp = Math.atan(rd * sp * Math.sin(ep - pd) / (ci * re * l1));

  var planetLongitude = degrees(unwind(ep));
  var planetLatitude = degrees(unwind(bp));
  var planetDistanceAU = vo;
  var planetHLong1 = degrees(lp1);
  var planetHLong2 = degrees(l0);
  var planetHLat = degrees(s0);
  var planetRVect = p0;

  return [planetLongitude, planetLatitude, planetDistanceAU, planetHLong1, planetHLong2, planetHLat, planetRVect];
}

/**
 * Helper function for planet_long_lat()
 */
function planetLong_L4685(pl) {
  var qa = 0.00204 * Math.cos(5.0 * pl[2][10] - 2.0 * pl[1][10] + 0.21328);
  qa = qa + 0.00103 * Math.cos(2.0 * pl[2][10] - pl[1][10] - 2.8046);
  qa = qa + 0.00091 * Math.cos(2.0 * pl[4][10] - pl[1][10] - 0.64582);
  qa = qa + 0.00078 * Math.cos(5.0 * pl[2][10] - 3.0 * pl[1][10] + 0.17692);

  var qb = 0.000007525 * Math.cos(2.0 * pl[4][10] - pl[1][10] + 0.925251);
  qb = qb + 0.000006802 * Math.cos(5.0 * pl[2][10] - 3.0 * pl[1][10] - 4.53642);
  qb = qb + 0.000005457 * Math.cos(2.0 * pl[2][10] - 2.0 * pl[1][10] - 1.24246);
  qb = qb + 0.000003569 * Math.cos(5.0 * pl[2][10] - pl[1][10] - 1.35699);

  return [qa, qb];
}

/**
 * Helper function for planet_long_lat()
 */
function planetLong_L4735(pl, ms, t) {
  var qc = 0.00077 * Math.sin(4.1406 + t * 2.6227);
  qc = paUtils.degreesToRadians(qc);
  var qe = qc;

  var qa = 0.00313 * Math.cos(2.0 * ms - 2.0 * pl[2][10] - 2.587);
  qa = qa + 0.00198 * Math.cos(3.0 * ms - 3.0 * pl[2][10] + 0.044768);
  qa = qa + 0.00136 * Math.cos(ms - pl[2][10] - 2.0788);
  qa = qa + 0.00096 * Math.cos(3.0 * ms - 2.0 * pl[2][10] - 2.3721);
  qa = qa + 0.00082 * Math.cos(pl[4][10] - pl[2][10] - 3.6318);

  var qb = 0.000022501 * Math.cos(2.0 * ms - 2.0 * pl[2][10] - 1.01592);
  qb = qb + 0.000019045 * Math.cos(3.0 * ms - 3.0 * pl[2][10] + 1.61577);
  qb = qb + 0.000006887 * Math.cos(pl[4][10] - pl[2][10] - 2.06106);
  qb = qb + 0.000005172 * Math.cos(ms - pl[2][10] - 0.508065);
  qb = qb + 0.00000362 * Math.cos(5.0 * ms - 4.0 * pl[2][10] - 1.81877);
  qb = qb + 0.000003283 * Math.cos(4.0 * ms - 4.0 * pl[2][10] + 1.10851);
  qb = qb + 0.000003074 * Math.cos(2.0 * pl[4][10] - 2.0 * pl[2][10] - 0.962846);

  return [qa, qb, qc, qe];
}

/**
 * Helper function for planet_long_lat()
 */
function planetLong_L4810(pl, ms) {
  var a = 3.0 * pl[4][10] - 8.0 * pl[3][10] + 4.0 * ms;
  var sa = Math.sin(a);
  var ca = Math.cos(a);
  var qc = -(0.01133 * sa + 0.00933 * ca);
  qc = paUtils.degreesToRadians(qc);
  var qe = qc;

  var qa = 0.00705 * Math.cos(pl[4][10] - pl[3][10] - 0.85448);
  qa = qa + 0.00607 * Math.cos(2.0 * pl[4][10] - pl[3][10] - 3.2873);
  qa = qa + 0.00445 * Math.cos(2.0 * pl[4][10] - 2.0 * pl[3][10] - 3.3492);
  qa = qa + 0.00388 * Math.cos(ms - 2.0 * pl[3][10] + 0.35771);
  qa = qa + 0.00238 * Math.cos(ms - pl[3][10] + 0.61256);
  qa = qa + 0.00204 * Math.cos(2.0 * ms - 3.0 * pl[3][10] + 2.7688);
  qa = qa + 0.00177 * Math.cos(3.0 * pl[3][10] - pl[2][10] - 1.0053);
  qa = qa + 0.00136 * Math.cos(2.0 * ms - 4.0 * pl[3][10] + 2.6894);
  qa = qa + 0.00104 * (pl[4][10] + 0.30749);

  var qb = 0.000053227 * Math.cos(pl[4][10] - pl[3][10] + 0.717864);
  qb = qb + 0.000050989 * Math.cos(2.0 * pl[4][10] - 2.0 * pl[3][10] - 1.77997);
  qb = qb + 0.000038278 * Math.cos(2.0 * pl[4][10] - pl[3][10] - 1.71617);
  qb = qb + 0.000015996 * Math.cos(ms - pl[3][10] - 0.969618);
  qb = qb + 0.000014764 * Math.cos(2.0 * ms - 3.0 * pl[3][10] + 1.19768);
  qb = qb + 0.000008966 * Math.cos(pl[4][10] - 2.0 * pl[3][10] + 0.761225);
  qb = qb + 0.000007914 * Math.cos(3.0 * pl[4][10] - 2.0 * pl[3][10] - 2.43887);
  qb = qb + 0.000007004 * Math.cos(2.0 * pl[4][10] - 3.0 * pl[3][10] - 1.79573);
  qb = qb + 0.00000662 * Math.cos(ms - 2.0 * pl[3][10] + 1.97575);
  qb = qb + 0.00000493 * Math.cos(3.0 * pl[4][10] - 3.0 * pl[3][10] - 1.33069);
  qb = qb + 0.000004693 * Math.cos(3.0 * ms - 5.0 * pl[3][10] + 3.32665);
  qb = qb + 0.000004571 * Math.cos(2.0 * ms - 4.0 * pl[3][10] + 4.27086);
  qb = qb + 0.000004409 * Math.cos(3.0 * pl[4][10] - pl[3][10] - 2.02158);

  return [a, sa, ca, qc, qe, qa, qb];
}

/**
 * Helper function for planet_long_lat()
 */
function planetLong_L4945(t, planet) {
  var qa = 0.0;
  var qb = 0.0;
  var qc = 0.0;
  var qd = 0.0;
  var qe = 0.0;
  var qf = 0.0;
  var qg = 0.0;
  var vk = 0.0;
  var ja = 0.0;
  var jb = 0.0;
  var jc = 0.0;

  var j1 = t / 5.0 + 0.1;
  var j2 = unwind(4.14473 + 52.9691 * t);
  var j3 = unwind(4.641118 + 21.32991 * t);
  var j4 = unwind(4.250177 + 7.478172 * t);
  var j5 = 5.0 * j3 - 2.0 * j2;
  var j6 = 2.0 * j2 - 6.0 * j3 + 3.0 * j4;

  if (planet[0] == "Mercury" || planet[0] == "Venus" || planet[0] == "Mars")
    return [qa, qb, qc, qd, qe, qf, qg];

  if (planet[0] == "Jupiter" || planet[0] == "Saturn") {
    var j7 = j3 - j2;
    var u1 = Math.sin(j3);
    var u2 = Math.cos(j3);
    var u3 = Math.sin(2.0 * j3);
    var u4 = Math.cos(2.0 * j3);
    var u5 = Math.sin(j5);
    var u6 = Math.cos(j5);
    var u7 = Math.sin(2.0 * j5);
    var u8a = Math.sin(j6);
    var u9 = Math.sin(j7);
    var ua = Math.cos(j7);
    var ub = Math.sin(2.0 * j7);
    var uc = Math.cos(2.0 * j7);
    var ud = Math.sin(3.0 * j7);
    var ue = Math.cos(3.0 * j7);
    var uf = Math.sin(4.0 * j7);
    var ug = Math.cos(4.0 * j7);
    var vh = Math.cos(5.0 * j7);

    if (planet[0] == "Saturn") {
      var ui = Math.sin(3.0 * j3);
      var uj = Math.cos(3.0 * j3);
      var uk = Math.sin(4.0 * j3);
      var ul = Math.cos(4.0 * j3);
      var vi = Math.cos(2.0 * j5);
      var un = Math.sin(5.0 * j7);
      var j8 = j4 - j3;
      var uo = Math.sin(2.0 * j8);
      var up = Math.cos(2.0 * j8);
      var uq = Math.sin(3.0 * j8);
      var ur = Math.cos(3.0 * j8);

      qc = 0.007581 * u7 - 0.007986 * u8a - 0.148811 * u9;
      qc = qc - (0.814181 - (0.01815 - 0.016714 * j1) * j1) * u5;
      qc = qc - (0.010497 - (0.160906 - 0.0041 * j1) * j1) * u6;
      qc = qc - 0.015208 * ud - 0.006339 * uf - 0.006244 * u1;
      qc = qc - 0.0165 * ub * u1 - 0.040786 * ub;
      qc = qc + (0.008931 + 0.002728 * j1) * u9 * u1 - 0.005775 * ud * u1;
      qc = qc + (0.081344 + 0.003206 * j1) * ua * u1 + 0.015019 * uc * u1;
      qc = qc + (0.085581 + 0.002494 * j1) * u9 * u2 + 0.014394 * uc * u2;
      qc = qc + (0.025328 - 0.003117 * j1) * ua * u2 + 0.006319 * ue * u2;
      qc = qc + 0.006369 * u9 * u3 + 0.009156 * ub * u3 + 0.007525 * uq * u3;
      qc = qc - 0.005236 * ua * u4 - 0.007736 * uc * u4 - 0.007528 * ur * u4;
      qc = paUtils.degreesToRadians(qc);

      qd = (-7927.0 + (2548.0 + 91.0 * j1) * j1) * u5;
      qd = qd + (13381.0 + (1226.0 - 253.0 * j1) * j1) * u6 + (248.0 - 121.0 * j1) * u7;
      qd = qd - (305.0 + 91.0 * j1) * vi + 412.0 * ub + 12415.0 * u1;
      qd = qd + (390.0 - 617.0 * j1) * u9 * u1 + (165.0 - 204.0 * j1) * ub * u1;
      qd = qd + 26599.0 * ua * u1 - 4687.0 * uc * u1 - 1870.0 * ue * u1 - 821.0 * ug * u1;
      qd = qd - 377.0 * vh * u1 + 497.0 * up * u1 + (163.0 - 611.0 * j1) * u2;
      qd = qd - 12696.0 * u9 * u2 - 4200.0 * ub * u2 - 1503.0 * ud * u2 - 619.0 * uf * u2;
      qd = qd - 268.0 * un * u2 - (282.0 + 1306.0 * j1) * ua * u2;
      qd = qd + (-86.0 + 230.0 * j1) * uc * u2 + 461.0 * uo * u2 - 350.0 * u3;
      qd = qd + (2211.0 - 286.0 * j1) * u9 * u3 - 2208.0 * ub * u3 - 568.0 * ud * u3;
      qd = qd - 346.0 * uf * u3 - (2780.0 + 222.0 * j1) * ua * u3;
      qd = qd + (2022.0 + 263.0 * j1) * uc * u3 + 248.0 * ue * u3 + 242.0 * uq * u3;
      qd = qd + 467.0 * ur * u3 - 490.0 * u4 - (2842.0 + 279.0 * j1) * u9 * u4;
      qd = qd + (128.0 + 226.0 * j1) * ub * u4 + 224.0 * ud * u4;
      qd = qd + (-1594.0 + 282.0 * j1) * ua * u4 + (2162.0 - 207.0 * j1) * uc * u4;
      qd = qd + 561.0 * ue * u4 + 343.0 * ug * u4 + 469.0 * uq * u4 - 242.0 * ur * u4;
      qd = qd - 205.0 * u9 * ui + 262.0 * ud * ui + 208.0 * ua * uj - 271.0 * ue * uj;
      qd = qd - 382.0 * ue * uk - 376.0 * ud * ul;
      qd = qd * 0.0000001;

      vk = (0.077108 + (0.007186 - 0.001533 * j1) * j1) * u5;
      vk = vk - 0.007075 * u9;
      vk = vk + (0.045803 - (0.014766 + 0.000536 * j1) * j1) * u6;
      vk = vk - 0.072586 * u2 - 0.075825 * u9 * u1 - 0.024839 * ub * u1;
      vk = vk - 0.008631 * ud * u1 - 0.150383 * ua * u2;
      vk = vk + 0.026897 * uc * u2 + 0.010053 * ue * u2;
      vk = vk - (0.013597 + 0.001719 * j1) * u9 * u3 + 0.011981 * ub * u4;
      vk = vk - (0.007742 - 0.001517 * j1) * ua * u3;
      vk = vk + (0.013586 - 0.001375 * j1) * uc * u3;
      vk = vk - (0.013667 - 0.001239 * j1) * u9 * u4;
      vk = vk + (0.014861 + 0.001136 * j1) * ua * u4;
      vk = vk - (0.013064 + 0.001628 * j1) * uc * u4;
      qe = qc - (paUtils.degreesToRadians(vk) / planet[4]);

      qf = 572.0 * u5 - 1590.0 * ub * u2 + 2933.0 * u6 - 647.0 * ud * u2;
      qf = qf + 33629.0 * ua - 344.0 * uf * u2 - 3081.0 * uc + 2885.0 * ua * u2;
      qf = qf - 1423.0 * ue + (2172.0 + 102.0 * j1) * uc * u2 - 671.0 * ug;
      qf = qf + 296.0 * ue * u2 - 320.0 * vh - 267.0 * ub * u3 + 1098.0 * u1;
      qf = qf - 778.0 * ua * u3 - 2812.0 * u9 * u1 + 495.0 * uc * u3 + 688.0 * ub * u1;
      qf = qf + 250.0 * ue * u3 - 393.0 * ud * u1 - 856.0 * u9 * u4 - 228.0 * uf * u1;
      qf = qf + 441.0 * ub * u4 + 2138.0 * ua * u1 + 296.0 * uc * u4 - 999.0 * uc * u1;
      qf = qf + 211.0 * ue * u4 - 642.0 * ue * u1 - 427.0 * u9 * ui - 325.0 * ug * u1;
      qf = qf + 398.0 * ud * ui - 890.0 * u2 + 344.0 * ua * uj + 2206.0 * u9 * u2;
      qf = qf - 427.0 * ue * uj;
      qf = qf * 0.000001;

      qg = 0.000747 * ua * u1 + 0.001069 * ua * u2 + 0.002108 * ub * u3;
      qg = qg + 0.001261 * uc * u3 + 0.001236 * ub * u4 - 0.002075 * uc * u4;
      qg = paUtils.degreesToRadians(qg);

      return [qa, qb, qc, qd, qe, qf, qg];
    }

    qc = (0.331364 - (0.010281 + 0.004692 * j1) * j1) * u5;
    qc = qc + (0.003228 - (0.064436 - 0.002075 * j1) * j1) * u6;
    qc = qc - (0.003083 + (0.000275 - 0.000489 * j1) * j1) * u7;
    qc = qc + 0.002472 * u8a + 0.013619 * u9 + 0.018472 * ub;
    qc = qc + 0.006717 * ud + 0.002775 * uf + 0.006417 * ub * u1;
    qc = qc + (0.007275 - 0.001253 * j1) * u9 * u1 + 0.002439 * ud * u1;
    qc = qc - (0.035681 + 0.001208 * j1) * u9 * u2 - 0.003767 * uc * u1;
    qc = qc - (0.033839 + 0.001125 * j1) * ua * u1 - 0.004261 * ub * u2;
    qc = qc + (0.001161 * j1 - 0.006333) * ua * u2 + 0.002178 * u2;
    qc = qc - 0.006675 * uc * u2 - 0.002664 * ue * u2 - 0.002572 * u9 * u3;
    qc = qc - 0.003567 * ub * u3 + 0.002094 * ua * u4 + 0.003342 * uc * u4;
    qc = paUtils.degreesToRadians(qc);

    qd = (3606.0 + (130.0 - 43.0 * j1) * j1) * u5 + (1289.0 - 580.0 * j1) * u6;
    qd = qd - 6764.0 * u9 * u1 - 1110.0 * ub * u1 - 224.0 * ud * u1 - 204.0 * u1;
    qd = qd + (1284.0 + 116.0 * j1) * ua * u1 + 188.0 * uc * u1;
    qd = qd + (1460.0 + 130.0 * j1) * u9 * u2 + 224.0 * ub * u2 - 817.0 * u2;
    qd = qd + 6074.0 * u2 * ua + 992.0 * uc * u2 + 508.0 * ue * u2 + 230.0 * ug * u2;
    qd = qd + 108.0 * vh * u2 - (956.0 + 73.0 * j1) * u9 * u3 + 448.0 * ub * u3;
    qd = qd + 137.0 * ud * u3 + (108.0 * j1 - 997.0) * ua * u3 + 480.0 * uc * u3;
    qd = qd + 148.0 * ue * u3 + (99.0 * j1 - 956.0) * u9 * u4 + 490.0 * ub * u4;
    qd = qd + 158.0 * ud * u4 + 179.0 * u4 + (1024.0 + 75.0 * j1) * ua * u4;
    qd = qd - 437.0 * uc * u4 - 132.0 * ue * u4;
    qd = qd * 0.0000001;

    vk = (0.007192 - 0.003147 * j1) * u5 - 0.004344 * u1;
    vk = vk + (j1 * (0.000197 * j1 - 0.000675) - 0.020428) * u6;
    vk = vk + 0.034036 * ua * u1 + (0.007269 + 0.000672 * j1) * u9 * u1;
    vk = vk + 0.005614 * uc * u1 + 0.002964 * ue * u1 + 0.037761 * u9 * u2;
    vk = vk + 0.006158 * ub * u2 - 0.006603 * ua * u2 - 0.005356 * u9 * u3;
    vk = vk + 0.002722 * ub * u3 + 0.004483 * ua * u3;
    vk = vk - 0.002642 * uc * u3 + 0.004403 * u9 * u4;
    vk = vk - 0.002536 * ub * u4 + 0.005547 * ua * u4 - 0.002689 * uc * u4;
    qe = qc - (paUtils.degreesToRadians(vk) / planet[4]);

    qf = 205.0 * ua - 263.0 * u6 + 693.0 * uc + 312.0 * ue + 147.0 * ug + 299.0 * u9 * u1;
    qf = qf + 181.0 * uc * u1 + 204.0 * ub * u2 + 111.0 * ud * u2 - 337.0 * ua * u2;
    qf = qf - 111.0 * uc * u2;
    qf = qf * 0.000001;

    return [qa, qb, qc, qd, qe, qf, qg];
  }

  if (planet[0] == "Uranus" || planet[0] == "Neptune") {
    var j8 = unwind(1.46205 + 3.81337 * t);
    var j9 = 2.0 * j8 - j4;
    var vj = Math.sin(j9);
    var uu = Math.cos(j9);
    var uv = Math.sin(2.0 * j9);
    var uw = Math.cos(2.0 * j9);

    if (planet[0] == "Neptune") {
      ja = j8 - j2;
      jb = j8 - j3;
      jc = j8 - j4;
      qc = (0.001089 * j1 - 0.589833) * vj;
      qc = qc + (0.004658 * j1 - 0.056094) * uu - 0.024286 * uv;
      qc = paUtils.degreesToRadians(qc);

      vk = 0.024039 * vj - 0.025303 * uu + 0.006206 * uv;
      vk = vk - 0.005992 * uw;
      qe = qc - (paUtils.degreesToRadians(vk) / planet[4]);

      qd = 4389.0 * vj + 1129.0 * uv + 4262.0 * uu + 1089.0 * uw;
      qd = qd * 0.0000001;

      qf = 8189.0 * uu - 817.0 * vj + 781.0 * uw;
      qf = qf * 0.000001;

      var vd = Math.sin(2.0 * jc);
      var ve = Math.cos(2.0 * jc);
      var vf = Math.sin(j8);
      var vg = Math.cos(j8);
      qa = -0.009556 * Math.sin(ja) - 0.005178 * Math.sin(jb);
      qa = qa + 0.002572 * vd - 0.002972 * ve * vf - 0.002833 * vd * vg;

      qg = 0.000336 * ve * vf + 0.000364 * vd * vg;
      qg = paUtils.degreesToRadians(qg);

      qb = -40596.0 + 4992.0 * Math.cos(ja) + 2744.0 * Math.cos(jb);
      qb = qb + 2044.0 * Math.cos(jc) + 1051.0 * ve;
      qb = qb * 0.000001;

      return [qa, qb, qc, qd, qe, qf, qg];
    }

    ja = j4 - j2;
    jb = j4 - j3;
    jc = j8 - j4;
    qc = (0.864319 - 0.001583 * j1) * vj;
    qc = qc + (0.082222 - 0.006833 * j1) * uu + 0.036017 * uv;
    qc = qc - 0.003019 * uw + 0.008122 * Math.sin(j6);
    qc = paUtils.degreesToRadians(qc);

    vk = 0.120303 * vj + 0.006197 * uv;
    vk = vk + (0.019472 - 0.000947 * j1) * uu;
    qe = qc - (paUtils.degreesToRadians(vk) / planet[4]);

    qd = (163.0 * j1 - 3349.0) * vj + 20981.0 * uu + 1311.0 * uw;
    qd = qd * 0.0000001;

    qf = -0.003825 * uu;

    qa = (-0.038581 + (0.002031 - 0.00191 * j1) * j1) * Math.cos(j4 + jb);
    qa = qa + (0.010122 - 0.000988 * j1) * Math.sin(j4 + jb);
    var a = (0.034964 - (0.001038 - 0.000868 * j1) * j1) * Math.cos(2.0 * j4 + jb);
    qa = a + qa + 0.005594 * Math.sin(j4 + 3.0 * jc) - 0.014808 * Math.sin(ja);
    qa = qa - 0.005794 * Math.sin(jb) + 0.002347 * Math.cos(jb);
    qa = qa + 0.009872 * Math.sin(jc) + 0.008803 * Math.sin(2.0 * jc);
    qa = qa - 0.004308 * Math.sin(3.0 * jc);

    var ux = Math.sin(jb);
    var uy = Math.cos(jb);
    var uz = Math.sin(j4);
    var va = Math.cos(j4);
    var vb = Math.sin(2.0 * j4);
    var vc = Math.cos(2.0 * j4);
    qg = (0.000458 * ux - 0.000642 * uy - 0.000517 * Math.cos(4.0 * jc)) * uz;
    qg = qg - (0.000347 * ux + 0.000853 * uy + 0.000517 * Math.sin(4.0 * jb)) * va;
    qg = qg + 0.000403 * (Math.cos(2.0 * jc) * vb + Math.sin(2.0 * jc) * vc);
    qg = paUtils.degreesToRadians(qg);

    qb = -25948.0 + 4985.0 * Math.cos(ja) - 1230.0 * va + 3354.0 * uy;
    qb = qb + 904.0 * Math.cos(2.0 * jc) + 894.0 * (Math.cos(jc) - Math.cos(3.0 * jc));
    qb = qb + (5795.0 * va - 1165.0 * uz + 1388.0 * vc) * ux;
    qb = qb + (1351.0 * va + 5702.0 * uz + 1388.0 * vb) * uy;
    qb = qb * 0.000001;

    return [qa, qb, qc, qd, qe, qf, qg];
  }

  return [qa, qb, qc, qd, qe, qf, qg];
}

/**
 * For W, in radians, return S, also in radians.
 * 
 * Original macro name: SolveCubic
 */
function solveCubic(w) {
  var s = w / 3.0;

  while (1 == 1) {
    var s2 = s * s;
    var d = (s2 + 3.0) * s - w;

    if (Math.abs(d) < 0.000001) {
      return s;
    }

    s = ((2.0 * s * s2) + w) / (3.0 * (s2 + 1.0));
  }
}

/**
 * Calculate longitude, latitude, and distance of parabolic-orbit comet.
 * 
 * Original macro names: PcometLong, PcometLat, PcometDist
 */
function pCometLongLatDist(lh, lm, ls, ds, zc, dy, mn, yr, td, tm, ty, q, i, p, n) {
  var gd = localCivilTimeGreenwichDay(lh, lm, ls, ds, zc, dy, mn, yr);
  var gm = localCivilTimeGreenwichMonth(lh, lm, ls, ds, zc, dy, mn, yr);
  var gy = localCivilTimeGreenwichYear(lh, lm, ls, ds, zc, dy, mn, yr);
  var ut = localCivilTimeToUniversalTime(lh, lm, ls, ds, zc, dy, mn, yr);
  var tpe = (ut / 365.242191) + civilDateToJulianDate(gd, gm, gy) - civilDateToJulianDate(td, tm, ty);
  var lg = paUtils.degreesToRadians(sunLong(lh, lm, ls, ds, zc, dy, mn, yr) + 180.0);
  var re = sunDist(lh, lm, ls, ds, zc, dy, mn, yr);

  var rh2 = 0.0;
  var rd = 0.0;
  var s3 = 0.0;
  var c3 = 0.0;
  var lc = 0.0;
  var s2 = 0.0;
  var c2 = 0.0;

  for (let k = 1; k < 3; k++) {
    var s = solveCubic(0.0364911624 * tpe / (q * Math.sqrt(q)));
    s = Number(s);
    var nu = 2.0 * Math.atan(s);
    var r = q * (1.0 + s * s);
    var l = nu + paUtils.degreesToRadians(p);
    var s1 = Math.sin(l);
    var c1 = Math.cos(l);
    var i1 = paUtils.degreesToRadians(i);
    s2 = s1 * Math.sin(i1);
    var ps = Math.asin(s2);
    var y = s1 * Math.cos(i1);
    lc = Math.atan2(y, c1) + paUtils.degreesToRadians(n);
    c2 = Math.cos(ps);
    rd = r * c2;
    var ll = lc - lg;
    c3 = Math.cos(ll);
    s3 = Math.sin(ll);
    var rh = Math.sqrt((re * re) + (r * r) - (2.0 * re * rd * c3 * Math.cos(ps)));
    if (k == 1) {
      rh2 = Math.sqrt((re * re) + (r * r) - (2.0 * re * r * Math.cos(ps) * Math.cos(l + paUtils.degreesToRadians(n) - lg)));
    }
  }

  var ep;

  ep = (rd < re) ? Math.atan((-rd * s3) / (re - (rd * c3))) + lg + 3.141592654 : Math.atan((re * s3) / (rd - (re * c3))) + lc;
  ep = unwind(ep);

  var tb = (rd * s2 * Math.sin(ep - lc)) / (c2 * re * s3);
  var bp = Math.atan(tb);

  var cometLongDeg = degrees(ep);
  var cometLatDeg = degrees(bp);
  var cometDistAU = rh2;

  return [cometLongDeg, cometLatDeg, cometDistAU];
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
  eccentricAnomaly,
  moonLong,
  moonLat,
  moonHP,
  unwind,
  unwindDeg,
  sunELong,
  sunPeri,
  sunEcc,
  ecDec,
  ecRA,
  sunTrueAnomaly,
  sunMeanAnomaly,
  sunriseLCT,
  sunriseLCTL3710,
  sunsetLCT,
  sunsetLCTL3710,
  universalTimeToLocalCivilTime,
  eGreenwichSiderealToUniversalTime,
  eRS,
  riseSetLocalSiderealTimeRise,
  riseSetLocalSiderealTimeSet,
  eSunRS,
  eSunRS_L3710,
  sunriseAZ,
  sunriseAZ_L3710,
  sunsetAZ,
  sunsetAZ_L3710,
  riseSetAzimuthRise,
  riseSetAzimuthSet,
  twilightAMLCT,
  twilightAMLCT_L3710,
  twilightPMLCT,
  twilightPMLCT_L3710,
  eTwilight,
  eTwilight_L3710,
  angle,
  planetCoordinates,
  planetLong_L4685,
  planetLong_L4735,
  planetLong_L4810,
  planetLong_L4945,
  solveCubic,
  pCometLongLatDist
};
