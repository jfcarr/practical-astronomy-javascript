const paMacros = require('./pa-macros.js');
const paTypes = require('./pa-types.js');
const paUtils = require('./pa-utils.js');

/**
 * Convert an Angle (degrees, minutes, and seconds) to Decimal Degrees
 */
function angleToDecimalDegrees(degrees, minutes, seconds) {
    var a = Math.abs(seconds) / 60;
    var b = (Math.abs(minutes) + a) / 60;
    var c = Math.abs(degrees) + b;
    var d = (degrees < 0 || minutes < 0 || seconds < 0) ? -c : c;

    return d;
}

/**
 * Convert Decimal Degrees to an Angle (degrees, minutes, and seconds)
 */
function decimalDegreesToAngle(decimalDegrees) {
    var unsignedDecimal = Math.abs(decimalDegrees);
    var totalSeconds = unsignedDecimal * 3600;
    var seconds2DP = paUtils.round(totalSeconds % 60, 2);
    var correctedSeconds = (seconds2DP == 60) ? 0 : seconds2DP;
    var correctedRemainder = (seconds2DP == 60) ? totalSeconds + 60 : totalSeconds;
    var minutes = Math.floor(correctedRemainder / 60) % 60;
    var unsignedDegrees = Math.floor(correctedRemainder / 3600);
    var signedDegrees = (decimalDegrees < 0) ? -1 * unsignedDegrees : unsignedDegrees;

    return [signedDegrees, minutes, Math.floor(correctedSeconds)];
}

/**
 * Convert Right Ascension to Hour Angle
 */
function rightAscensionToHourAngle(raHours, raMinutes, raSeconds, lctHours, lctMinutes, lctSeconds, isDaylightSavings, zoneCorrection, localDay, localMonth, localYear, geographicalLongitude) {
    var daylightSaving = (isDaylightSavings) ? 1 : 0;

    var hourAngle = paMacros.rightAscensionToHourAngle(raHours, raMinutes, raSeconds, lctHours, lctMinutes, lctSeconds, daylightSaving, zoneCorrection, localDay, localMonth, localYear, geographicalLongitude);

    var hourAngleHours = paMacros.decimalHoursHour(hourAngle);
    var hourAngleMinutes = paMacros.decimalHoursMinute(hourAngle);
    var hourAngleSeconds = paMacros.decimalHoursSecond(hourAngle);

    return [hourAngleHours, hourAngleMinutes, hourAngleSeconds];
}

/**
 * Convert Hour Angle to Right Ascension
 */
function hourAngleToRightAscension(hourAngleHours, hourAngleMinutes, hourAngleSeconds, lctHours, lctMinutes, lctSeconds, isDaylightSaving, zoneCorrection, localDay, localMonth, localYear, geographicalLongitude) {
    var daylightSaving = (isDaylightSaving) ? 1 : 0;

    var rightAscension = paMacros.hourAngleToRightAscension(hourAngleHours, hourAngleMinutes, hourAngleSeconds, lctHours, lctMinutes, lctSeconds, daylightSaving, zoneCorrection, localDay, localMonth, localYear, geographicalLongitude);

    var rightAscensionHours = paMacros.decimalHoursHour(rightAscension);
    var rightAscensionMinutes = paMacros.decimalHoursMinute(rightAscension);
    var rightAscensionSeconds = paMacros.decimalHoursSecond(rightAscension);

    return [rightAscensionHours, rightAscensionMinutes, rightAscensionSeconds];
}

/**
 * Convert Equatorial Coordinates to Horizon Coordinates
 */
function equatorialCoordinatesToHorizonCoordinates(hourAngleHours, hourAngleMinutes, hourAngleSeconds, declinationDegrees, declinationMinutes, declinationSeconds, geographicalLatitude) {
    var azimuthInDecimalDegrees = paMacros.equatorialCoordinatesToAzimuth(hourAngleHours, hourAngleMinutes, hourAngleSeconds, declinationDegrees, declinationMinutes, declinationSeconds, geographicalLatitude);

    var altitudeInDecimalDegrees = paMacros.equatorialCoordinatesToAltitude(hourAngleHours, hourAngleMinutes, hourAngleSeconds, declinationDegrees, declinationMinutes, declinationSeconds, geographicalLatitude);

    var azimuthDegrees = paMacros.decimalDegreesDegrees(azimuthInDecimalDegrees);
    var azimuthMinutes = paMacros.decimalDegreesMinutes(azimuthInDecimalDegrees);
    var azimuthSeconds = paMacros.decimalDegreesSeconds(azimuthInDecimalDegrees);

    var altitudeDegrees = paMacros.decimalDegreesDegrees(altitudeInDecimalDegrees);
    var altitudeMinutes = paMacros.decimalDegreesMinutes(altitudeInDecimalDegrees);
    var altitudeSeconds = paMacros.decimalDegreesSeconds(altitudeInDecimalDegrees);

    return [azimuthDegrees, azimuthMinutes, azimuthSeconds, altitudeDegrees, altitudeMinutes, altitudeSeconds];
}

/**
 * Convert Horizon Coordinates to Equatorial Coordinates
 */
function horizonCoordinatesToEquatorialCoordinates(azimuthDegrees, azimuthMinutes, azimuthSeconds, altitudeDegrees, altitudeMinutes, altitudeSeconds, geographicalLatitude) {
    var hourAngleInDecimalDegrees = paMacros.horizonCoordinatesToHourAngle(azimuthDegrees, azimuthMinutes, azimuthSeconds, altitudeDegrees, altitudeMinutes, altitudeSeconds, geographicalLatitude);

    var declinationInDecimalDegrees = paMacros.horizonCoordinatesToDeclination(azimuthDegrees, azimuthMinutes, azimuthSeconds, altitudeDegrees, altitudeMinutes, altitudeSeconds, geographicalLatitude);

    var hourAngleHours = paMacros.decimalHoursHour(hourAngleInDecimalDegrees);
    var hourAngleMinutes = paMacros.decimalHoursMinute(hourAngleInDecimalDegrees);
    var hourAngleSeconds = paMacros.decimalHoursSecond(hourAngleInDecimalDegrees);

    var declinationDegrees = paMacros.decimalDegreesDegrees(declinationInDecimalDegrees);
    var declinationMinutes = paMacros.decimalDegreesMinutes(declinationInDecimalDegrees);
    var declinationSeconds = paMacros.decimalDegreesSeconds(declinationInDecimalDegrees);

    return [hourAngleHours, hourAngleMinutes, hourAngleSeconds, declinationDegrees, declinationMinutes, declinationSeconds];
}

/**
 * Calculate Mean Obliquity of the Ecliptic for a Greenwich Date
 */
function meanObliquityOfTheEcliptic(greenwichDay, greenwichMonth, greenwichYear) {
    var jd = paMacros.civilDateToJulianDate(greenwichDay, greenwichMonth, greenwichYear);
    var mjd = jd - 2451545;
    var t = mjd / 36525;
    var de1 = t * (46.815 + t * (0.0006 - (t * 0.00181)));
    var de2 = de1 / 3600;

    return 23.439292 - de2;
}

/**
 * Convert Ecliptic Coordinates to Equatorial Coordinates
 */
function eclipticCoordinateToEquatorialCoordinate(eclipticLongitudeDegrees, eclipticLongitudeMinutes, eclipticLongitudeSeconds, eclipticLatitudeDegrees, eclipticLatitudeMinutes, eclipticLatitudeSeconds, greenwichDay, greenwichMonth, greenwichYear) {
    var eclonDeg = paMacros.degreesMinutesSecondsToDecimalDegrees(eclipticLongitudeDegrees, eclipticLongitudeMinutes, eclipticLongitudeSeconds);
    var eclatDeg = paMacros.degreesMinutesSecondsToDecimalDegrees(eclipticLatitudeDegrees, eclipticLatitudeMinutes, eclipticLatitudeSeconds);
    var eclonRad = paUtils.degreesToRadians(eclonDeg);
    var eclatRad = paUtils.degreesToRadians(eclatDeg);
    var obliqDeg = paMacros.obliq(greenwichDay, greenwichMonth, greenwichYear);
    var obliqRad = paUtils.degreesToRadians(obliqDeg);
    var sinDec = Math.sin(eclatRad) * Math.cos(obliqRad) + Math.cos(eclatRad) * Math.sin(obliqRad) * Math.sin(eclonRad);
    var decRad = Math.asin(sinDec);
    var decDeg = paMacros.degrees(decRad);
    var y = Math.sin(eclonRad) * Math.cos(obliqRad) - Math.tan(eclatRad) * Math.sin(obliqRad);
    var x = Math.cos(eclonRad);
    var raRad = Math.atan2(y, x);
    var raDeg1 = paMacros.degrees(raRad);
    var raDeg2 = raDeg1 - 360 * Math.floor(raDeg1 / 360);
    var raHours = paMacros.decimalDegreesToDegreeHours(raDeg2);

    var outRAHours = paMacros.decimalHoursHour(raHours);
    var outRAMinutes = paMacros.decimalHoursMinute(raHours);
    var outRASeconds = paMacros.decimalHoursSecond(raHours);
    var outDecDegrees = paMacros.decimalDegreesDegrees(decDeg);
    var outDecMinutes = paMacros.decimalDegreesMinutes(decDeg);
    var outDecSeconds = paMacros.decimalDegreesSeconds(decDeg);

    return [outRAHours, outRAMinutes, outRASeconds, outDecDegrees, outDecMinutes, outDecSeconds];
}

/**
 * Convert Equatorial Coordinates to Ecliptic Coordinates
 */
function equatorialCoordinateToEclipticCoordinate(raHours, raMinutes, raSeconds, decDegrees, decMinutes, decSeconds, gwDay, gwMonth, gwYear) {
    var raDeg = paMacros.degreeHoursToDecimalDegrees(paMacros.HMStoDH(raHours, raMinutes, raSeconds));
    var decDeg = paMacros.degreesMinutesSecondsToDecimalDegrees(decDegrees, decMinutes, decSeconds);
    var raRad = paUtils.degreesToRadians(raDeg);
    var decRad = paUtils.degreesToRadians(decDeg);
    var obliqDeg = paMacros.obliq(gwDay, gwMonth, gwYear);
    var obliqRad = paUtils.degreesToRadians(obliqDeg);
    var sinEclLat = Math.sin(decRad) * Math.cos(obliqRad) - Math.cos(decRad) * Math.sin(obliqRad) * Math.sin(raRad);
    var eclLatRad = Math.asin(sinEclLat);
    var eclLatDeg = paMacros.degrees(eclLatRad);
    var y = Math.sin(raRad) * Math.cos(obliqRad) + Math.tan(decRad) * Math.sin(obliqRad);
    var x = Math.cos(raRad);
    var eclLongRad = Math.atan2(y, x);
    var eclLongDeg1 = paMacros.degrees(eclLongRad);
    var eclLongDeg2 = eclLongDeg1 - 360 * Math.floor(eclLongDeg1 / 360);

    var outEclLongDeg = paMacros.decimalDegreesDegrees(eclLongDeg2);
    var outEclLongMin = paMacros.decimalDegreesMinutes(eclLongDeg2);
    var outEclLongSec = paMacros.decimalDegreesSeconds(eclLongDeg2);
    var outEclLatDeg = paMacros.decimalDegreesDegrees(eclLatDeg);
    var outEclLatMin = paMacros.decimalDegreesMinutes(eclLatDeg);
    var outEclLatSec = paMacros.decimalDegreesSeconds(eclLatDeg);

    return [outEclLongDeg, outEclLongMin, outEclLongSec, outEclLatDeg, outEclLatMin, outEclLatSec];
}

/**
 * 
 * Convert Equatorial Coordinates to Galactic Coordinates
 */
function equatorialCoordinateToGalacticCoordinate(raHours, raMinutes, raSeconds, decDegrees, decMinutes, decSeconds) {
    var raDeg = paMacros.degreeHoursToDecimalDegrees(paMacros.HMStoDH(raHours, raMinutes, raSeconds));
    var decDeg = paMacros.degreesMinutesSecondsToDecimalDegrees(decDegrees, decMinutes, decSeconds);
    var raRad = paUtils.degreesToRadians(raDeg);
    var decRad = paUtils.degreesToRadians(decDeg);
    var sinB = Math.cos(decRad) * Math.cos(paUtils.degreesToRadians(27.4)) * Math.cos(raRad - paUtils.degreesToRadians(192.25)) + Math.sin(decRad) * Math.sin(paUtils.degreesToRadians(27.4));
    var bRadians = Math.asin(sinB);
    var bDeg = paMacros.degrees(bRadians);
    var y = Math.sin(decRad) - sinB * Math.sin(paUtils.degreesToRadians(27.4));
    var x = Math.cos(decRad) * Math.sin(raRad - paUtils.degreesToRadians(192.25)) * Math.cos(paUtils.degreesToRadians(27.4));
    var longDeg1 = paMacros.degrees(Math.atan2(y, x)) + 33;
    var longDeg2 = longDeg1 - 360 * Math.floor(longDeg1 / 360);

    var galLongDeg = paMacros.decimalDegreesDegrees(longDeg2);
    var galLongMin = paMacros.decimalDegreesMinutes(longDeg2);
    var galLongSec = paMacros.decimalDegreesSeconds(longDeg2);
    var galLatDeg = paMacros.decimalDegreesDegrees(bDeg);
    var galLatMin = paMacros.decimalDegreesMinutes(bDeg);
    var galLatSec = paMacros.decimalDegreesSeconds(bDeg);

    return [galLongDeg, galLongMin, galLongSec, galLatDeg, galLatMin, galLatSec];
}

/**
 * Convert Galactic Coordinates to Equatorial Coordinates
 */
function galacticCoordinateToEquatorialCoordinate(galLongDeg, galLongMin, galLongSec, galLatDeg, galLatMin, galLatSec) {
    var glongDeg = paMacros.degreesMinutesSecondsToDecimalDegrees(galLongDeg, galLongMin, galLongSec);
    var glatDeg = paMacros.degreesMinutesSecondsToDecimalDegrees(galLatDeg, galLatMin, galLatSec);
    var glongRad = paUtils.degreesToRadians(glongDeg);
    var glatRad = paUtils.degreesToRadians(glatDeg);
    var sinDec = Math.cos(glatRad) * Math.cos(paUtils.degreesToRadians(27.4)) * Math.sin(glongRad - paUtils.degreesToRadians(33.0)) + Math.sin(glatRad) * Math.sin(paUtils.degreesToRadians(27.4));
    var decRadians = Math.asin(sinDec);
    var decDeg = paMacros.degrees(decRadians);
    var y = Math.cos(glatRad) * Math.cos(glongRad - paUtils.degreesToRadians(33.0));
    var x = Math.sin(glatRad) * Math.cos(paUtils.degreesToRadians(27.4)) - Math.cos(glatRad) * Math.sin(paUtils.degreesToRadians(27.4)) * Math.sin(glongRad - paUtils.degreesToRadians(33.0));

    var raDeg1 = paMacros.degrees(Math.atan2(y, x)) + 192.25;
    var raDeg2 = raDeg1 - 360 * Math.floor(raDeg1 / 360);
    var raHours1 = paMacros.decimalDegreesToDegreeHours(raDeg2);

    var raHours = paMacros.decimalHoursHour(raHours1);
    var raMinutes = paMacros.decimalHoursMinute(raHours1);
    var raSeconds = paMacros.decimalHoursSecond(raHours1);
    var decDegrees = paMacros.decimalDegreesDegrees(decDeg);
    var decMinutes = paMacros.decimalDegreesMinutes(decDeg);
    var decSeconds = paMacros.decimalDegreesSeconds(decDeg);

    return [raHours, raMinutes, raSeconds, decDegrees, decMinutes, decSeconds];
}

/**
 * Calculate the angle between two celestial objects
 */
function angleBetweenTwoObjects(raLong1HourDeg, raLong1Min, raLong1Sec, decLat1Deg, decLat1Min, decLat1Sec, raLong2HourDeg, raLong2Min, raLong2Sec, decLat2Deg, decLat2Min, decLat2Sec, hourOrDegree) {
    var raLong1Decimal = (hourOrDegree == paTypes.AngleMeasure.Hours) ? paMacros.HMStoDH(raLong1HourDeg, raLong1Min, raLong1Sec) : paMacros.degreesMinutesSecondsToDecimalDegrees(raLong1HourDeg, raLong1Min, raLong1Sec);
    var raLong1Deg = (hourOrDegree == paTypes.AngleMeasure.Hours) ? paMacros.degreeHoursToDecimalDegrees(raLong1Decimal) : raLong1Decimal;

    var raLong1Rad = paUtils.degreesToRadians(raLong1Deg);
    var decLat1Deg1 = paMacros.degreesMinutesSecondsToDecimalDegrees(decLat1Deg, decLat1Min, decLat1Sec);
    var decLat1Rad = paUtils.degreesToRadians(decLat1Deg1);

    var raLong2Decimal = (hourOrDegree == paTypes.AngleMeasure.Hours) ? paMacros.HMStoDH(raLong2HourDeg, raLong2Min, raLong2Sec) : paMacros.degreesMinutesSecondsToDecimalDegrees(raLong2HourDeg, raLong2Min, raLong2Sec);
    var raLong2Deg = (hourOrDegree == paTypes.AngleMeasure.Hours) ? paMacros.degreeHoursToDecimalDegrees(raLong2Decimal) : raLong2Decimal;
    var raLong2Rad = paUtils.degreesToRadians(raLong2Deg);
    var decLat2Deg1 = paMacros.degreesMinutesSecondsToDecimalDegrees(decLat2Deg, decLat2Min, decLat2Sec);
    var decLat2Rad = paUtils.degreesToRadians(decLat2Deg1);

    var cosD = Math.sin(decLat1Rad) * Math.sin(decLat2Rad) + Math.cos(decLat1Rad) * Math.cos(decLat2Rad) * Math.cos(raLong1Rad - raLong2Rad);
    var dRad = Math.acos(cosD);
    var dDeg = paMacros.degrees(dRad);

    var angleDeg = paMacros.decimalDegreesDegrees(dDeg);
    var angleMin = paMacros.decimalDegreesMinutes(dDeg);
    var angleSec = paMacros.decimalDegreesSeconds(dDeg);

    return [angleDeg, angleMin, angleSec];
}

/**
 * Calculate rising and setting times for an object.
 */
function risingAndSetting(raHours, raMinutes, raSeconds, decDeg, decMin, decSec, gwDateDay, gwDateMonth, gwDateYear, geogLongDeg, geogLatDeg, vertShiftDeg) {
    var raHours1 = paMacros.HMStoDH(raHours, raMinutes, raSeconds);
    var decRad = paUtils.degreesToRadians(paMacros.degreesMinutesSecondsToDecimalDegrees(decDeg, decMin, decSec));
    var verticalDisplRadians = paUtils.degreesToRadians(vertShiftDeg);
    var geoLatRadians = paUtils.degreesToRadians(geogLatDeg);
    var cosH = -(Math.sin(verticalDisplRadians) + Math.sin(geoLatRadians) * Math.sin(decRad)) / (Math.cos(geoLatRadians) * Math.cos(decRad));
    var hHours = paMacros.decimalDegreesToDegreeHours(paMacros.degrees(Math.acos(cosH)));
    var lstRiseHours = (raHours1 - hHours) - 24 * Math.floor((raHours1 - hHours) / 24);
    var lstSetHours = (raHours1 + hHours) - 24 * Math.floor((raHours1 + hHours) / 24);
    var aDeg = paMacros.degrees(Math.acos((Math.sin(decRad) + Math.sin(verticalDisplRadians) * Math.sin(geoLatRadians)) / (Math.cos(verticalDisplRadians) * Math.cos(geoLatRadians))));
    var azRiseDeg = aDeg - 360 * Math.floor(aDeg / 360);
    var azSetDeg = (360 - aDeg) - 360 * Math.floor((360 - aDeg) / 360);
    var utRiseHours1 = paMacros.greenwichSiderealTimeToUniversalTime(paMacros.localSiderealTimeToGreenwichSiderealTime(lstRiseHours, 0, 0, geogLongDeg), 0, 0, gwDateDay, gwDateMonth, gwDateYear);
    var utSetHours1 = paMacros.greenwichSiderealTimeToUniversalTime(paMacros.localSiderealTimeToGreenwichSiderealTime(lstSetHours, 0, 0, geogLongDeg), 0, 0, gwDateDay, gwDateMonth, gwDateYear);
    var utRiseAdjustedHours = utRiseHours1 + 0.008333;
    var utSetAdjustedHours = utSetHours1 + 0.008333;

    var riseSetStatus = paTypes.RiseSetStatus.OK;
    if (cosH > 1)
        riseSetStatus = paTypes.RiseSetStatus.NeverRises;
    if (cosH < -1)
        riseSetStatus = paTypes.RiseSetStatus.Circumpolar;

    var utRiseHour = (riseSetStatus == paTypes.RiseSetStatus.OK) ? paMacros.decimalHoursHour(utRiseAdjustedHours) : 0;
    var utRiseMin = (riseSetStatus == paTypes.RiseSetStatus.OK) ? paMacros.decimalHoursMinute(utRiseAdjustedHours) : 0;
    var utSetHour = (riseSetStatus == paTypes.RiseSetStatus.OK) ? paMacros.decimalHoursHour(utSetAdjustedHours) : 0;
    var utSetMin = (riseSetStatus == paTypes.RiseSetStatus.OK) ? paMacros.decimalHoursMinute(utSetAdjustedHours) : 0;
    var azRise = (riseSetStatus == paTypes.RiseSetStatus.OK) ? paUtils.round(azRiseDeg, 2) : 0;
    var azSet = (riseSetStatus == paTypes.RiseSetStatus.OK) ? paUtils.round(azSetDeg, 2) : 0;

    return [riseSetStatus, utRiseHour, utRiseMin, utSetHour, utSetMin, azRise, azSet];
}

/**
 * Calculate precession (corrected coordinates between two epochs)
 */
function correctForPrecession(raHour, raMinutes, raSeconds, decDeg, decMinutes, decSeconds, epoch1Day, epoch1Month, epoch1Year, epoch2Day, epoch2Month, epoch2Year) {
    var ra1Rad = paUtils.degreesToRadians(paMacros.degreeHoursToDecimalDegrees(paMacros.HMStoDH(raHour, raMinutes, raSeconds)));
    var dec1Rad = paUtils.degreesToRadians(paMacros.degreesMinutesSecondsToDecimalDegrees(decDeg, decMinutes, decSeconds));
    var tCenturies = (paMacros.civilDateToJulianDate(epoch1Day, epoch1Month, epoch1Year) - 2415020) / 36525;
    var mSec = 3.07234 + (0.00186 * tCenturies);
    var nArcsec = 20.0468 - (0.0085 * tCenturies);
    var nYears = (paMacros.civilDateToJulianDate(epoch2Day, epoch2Month, epoch2Year) - paMacros.civilDateToJulianDate(epoch1Day, epoch1Month, epoch1Year)) / 365.25;
    var s1Hours = ((mSec + (nArcsec * Math.sin(ra1Rad) * Math.tan(dec1Rad) / 15)) * nYears) / 3600;
    var ra2Hours = paMacros.HMStoDH(raHour, raMinutes, raSeconds) + s1Hours;
    var s2Deg = (nArcsec * Math.cos(ra1Rad) * nYears) / 3600;
    var dec2Deg = paMacros.degreesMinutesSecondsToDecimalDegrees(decDeg, decMinutes, decSeconds) + s2Deg;

    var correctedRAHour = paMacros.decimalHoursHour(ra2Hours);
    var correctedRAMinutes = paMacros.decimalHoursMinute(ra2Hours);
    var correctedRASeconds = paMacros.decimalHoursSecond(ra2Hours);
    var correctedDecDeg = paMacros.decimalDegreesDegrees(dec2Deg);
    var correctedDecMinutes = paMacros.decimalDegreesMinutes(dec2Deg);
    var correctedDecSeconds = paMacros.decimalDegreesSeconds(dec2Deg);

    return [correctedRAHour, correctedRAMinutes, correctedRASeconds, correctedDecDeg, correctedDecMinutes, correctedDecSeconds];
}

/**
 * Calculate nutation for two values: ecliptic longitude and obliquity, for a Greenwich date.
 */
function nutationInEclipticLongitudeAndObliquity(greenwichDay, greenwichMonth, greenwichYear) {
    var jdDays = paMacros.civilDateToJulianDate(greenwichDay, greenwichMonth, greenwichYear);
    var tCenturies = (jdDays - 2415020) / 36525;
    var aDeg = 100.0021358 * tCenturies;
    var l1Deg = 279.6967 + (0.000303 * tCenturies * tCenturies);
    var lDeg1 = l1Deg + 360 * (aDeg - Math.floor(aDeg));
    var lDeg2 = lDeg1 - 360 * Math.floor(lDeg1 / 360);
    var lRad = paUtils.degreesToRadians(lDeg2);
    var bDeg = 5.372617 * tCenturies;
    var nDeg1 = 259.1833 - 360 * (bDeg - Math.floor(bDeg));
    var nDeg2 = nDeg1 - 360 * (Math.floor(nDeg1 / 360));
    var nRad = paUtils.degreesToRadians(nDeg2);
    var nutInLongArcsec = -17.2 * Math.sin(nRad) - 1.3 * Math.sin(2 * lRad);
    var nutInOblArcsec = 9.2 * Math.cos(nRad) + 0.5 * Math.cos(2 * lRad);

    var nutInLongDeg = nutInLongArcsec / 3600;
    var nutInOblDeg = nutInOblArcsec / 3600;

    return [nutInLongDeg, nutInOblDeg];
}

/**
 * Correct ecliptic coordinates for the effects of aberration.
 */
function correctForAberration(utHour, utMinutes, utSeconds, gwDay, gwMonth, gwYear, trueEclLongDeg, trueEclLongMin, trueEclLongSec, trueEclLatDeg, trueEclLatMin, trueEclLatSec) {
    var trueLongDeg = paMacros.degreesMinutesSecondsToDecimalDegrees(trueEclLongDeg, trueEclLongMin, trueEclLongSec);
    var trueLatDeg = paMacros.degreesMinutesSecondsToDecimalDegrees(trueEclLatDeg, trueEclLatMin, trueEclLatSec);
    var sunTrueLongDeg = paMacros.sunLong(utHour, utMinutes, utSeconds, 0, 0, gwDay, gwMonth, gwYear);
    var dlongArcsec = -20.5 * Math.cos(paUtils.degreesToRadians(sunTrueLongDeg - trueLongDeg)) / Math.cos(paUtils.degreesToRadians(trueLatDeg));
    var dlatArcsec = -20.5 * Math.sin(paUtils.degreesToRadians(sunTrueLongDeg - trueLongDeg)) * Math.sin(paUtils.degreesToRadians(trueLatDeg));
    var apparentLongDeg = trueLongDeg + (dlongArcsec / 3600);
    var apparentLatDeg = trueLatDeg + (dlatArcsec / 3600);

    var apparentEclLongDeg = paMacros.decimalDegreesDegrees(apparentLongDeg);
    var apparentEclLongMin = paMacros.decimalDegreesMinutes(apparentLongDeg);
    var apparentEclLongSec = paMacros.decimalDegreesSeconds(apparentLongDeg);
    var apparentEclLatDeg = paMacros.decimalDegreesDegrees(apparentLatDeg);
    var apparentEclLatMin = paMacros.decimalDegreesMinutes(apparentLatDeg);
    var apparentEclLatSec = paMacros.decimalDegreesSeconds(apparentLatDeg);

    return [apparentEclLongDeg, apparentEclLongMin, apparentEclLongSec, apparentEclLatDeg, apparentEclLatMin, apparentEclLatSec];
}

/**
 * Calculate corrected RA/Dec, accounting for atmospheric refraction.
 */
function atmosphericRefraction(trueRAHour, trueRAMin, trueRASec, trueDecDeg, trueDecMin, trueDecSec, coordinateType, geogLongDeg, geogLatDeg, daylightSavingHours, timezoneHours, lcdDay, lcdMonth, lcdYear, lctHour, lctMin, lctSec, atmosphericPressureMbar, atmosphericTemperatureCelsius) {
    var haHour = paMacros.rightAscensionToHourAngle(trueRAHour, trueRAMin, trueRASec, lctHour, lctMin, lctSec, daylightSavingHours, timezoneHours, lcdDay, lcdMonth, lcdYear, geogLongDeg);
    var azimuthDeg = paMacros.equatorialCoordinatesToAzimuth(haHour, 0, 0, trueDecDeg, trueDecMin, trueDecSec, geogLatDeg);
    var altitudeDeg = paMacros.equatorialCoordinatesToAltitude(haHour, 0, 0, trueDecDeg, trueDecMin, trueDecSec, geogLatDeg);
    var correctedAltitudeDeg = paMacros.refract(altitudeDeg, coordinateType, atmosphericPressureMbar, atmosphericTemperatureCelsius);

    var correctedHAHour = paMacros.horizonCoordinatesToHourAngle(azimuthDeg, 0, 0, correctedAltitudeDeg, 0, 0, geogLatDeg);
    var correctedRAHour1 = paMacros.hourAngleToRightAscension(correctedHAHour, 0, 0, lctHour, lctMin, lctSec, daylightSavingHours, timezoneHours, lcdDay, lcdMonth, lcdYear, geogLongDeg);
    var correctedDecDeg1 = paMacros.horizonCoordinatesToDeclination(azimuthDeg, 0, 0, correctedAltitudeDeg, 0, 0, geogLatDeg);

    var correctedRAHour = paMacros.decimalHoursHour(correctedRAHour1);
    var correctedRAMin = paMacros.decimalHoursMinute(correctedRAHour1);
    var correctedRASec = paMacros.decimalHoursSecond(correctedRAHour1);
    var correctedDecDeg = paMacros.decimalDegreesDegrees(correctedDecDeg1);
    var correctedDecMin = paMacros.decimalDegreesMinutes(correctedDecDeg1);
    var correctedDecSec = paMacros.decimalDegreesSeconds(correctedDecDeg1);

    return [correctedRAHour, correctedRAMin, correctedRASec, correctedDecDeg, correctedDecMin, correctedDecSec];
}

/**
 * Calculate corrected RA/Dec, accounting for geocentric parallax.
 */
function correctionsForGeocentricParallax(raHour, raMin, raSec, decDeg, decMin, decSec, coordinateType, equatorialHorParallaxDeg, geogLongDeg, geogLatDeg, heightM, daylightSaving, timezoneHours, lcdDay, lcdMonth, lcdYear, lctHour, lctMin, lctSec) {
    var haHours = paMacros.rightAscensionToHourAngle(raHour, raMin, raSec, lctHour, lctMin, lctSec, daylightSaving, timezoneHours, lcdDay, lcdMonth, lcdYear, geogLongDeg);

    var correctedHAHours = paMacros.parallaxHA(haHours, 0, 0, decDeg, decMin, decSec, coordinateType, geogLatDeg, heightM, equatorialHorParallaxDeg);

    var correctedRAHours = paMacros.hourAngleToRightAscension(correctedHAHours, 0, 0, lctHour, lctMin, lctSec, daylightSaving, timezoneHours, lcdDay, lcdMonth, lcdYear, geogLongDeg);

    var correctedDecDeg1 = paMacros.parallaxDec(haHours, 0, 0, decDeg, decMin, decSec, coordinateType, geogLatDeg, heightM, equatorialHorParallaxDeg);

    var correctedRAHour = paMacros.decimalHoursHour(correctedRAHours);
    var correctedRAMin = paMacros.decimalHoursMinute(correctedRAHours);
    var correctedRASec = paMacros.decimalHoursSecond(correctedRAHours);
    var correctedDecDeg = paMacros.decimalDegreesDegrees(correctedDecDeg1);
    var correctedDecMin = paMacros.decimalDegreesMinutes(correctedDecDeg1);
    var correctedDecSec = paMacros.decimalDegreesSeconds(correctedDecDeg1);

    return [correctedRAHour, correctedRAMin, correctedRASec, correctedDecDeg, correctedDecMin, correctedDecSec];
}

/**
 * 
 * Calculate heliographic coordinates for a given Greenwich date, with a given heliographic position angle and heliographic displacement in arc minutes.
 */
function heliographicCoordinates(helioPositionAngleDeg, helioDisplacementArcmin, gwdateDay, gwdateMonth, gwdateYear) {
    var julianDateDays = paMacros.civilDateToJulianDate(gwdateDay, gwdateMonth, gwdateYear);
    var tCenturies = (julianDateDays - 2415020) / 36525;
    var longAscNodeDeg = paMacros.degreesMinutesSecondsToDecimalDegrees(74, 22, 0) + (84 * tCenturies / 60);
    var sunLongDeg = paMacros.sunLong(0, 0, 0, 0, 0, gwdateDay, gwdateMonth, gwdateYear);
    var y = Math.sin(paUtils.degreesToRadians(longAscNodeDeg - sunLongDeg)) * Math.cos(paUtils.degreesToRadians(paMacros.degreesMinutesSecondsToDecimalDegrees(7, 15, 0)));
    var x = -Math.cos(paUtils.degreesToRadians(longAscNodeDeg - sunLongDeg));
    var aDeg = paMacros.degrees(Math.atan2(y, x));
    var mDeg1 = 360 - (360 * (julianDateDays - 2398220) / 25.38);
    var mDeg2 = mDeg1 - 360 * Math.floor(mDeg1 / 360);
    var l0Deg1 = mDeg2 + aDeg;
    var b0Rad = Math.asin(Math.sin(paUtils.degreesToRadians(sunLongDeg - longAscNodeDeg)) * Math.sin(paUtils.degreesToRadians(paMacros.degreesMinutesSecondsToDecimalDegrees(7, 15, 0))));
    var theta1Rad = Math.atan(-Math.cos(paUtils.degreesToRadians(sunLongDeg)) * Math.tan(paUtils.degreesToRadians(paMacros.obliq(gwdateDay, gwdateMonth, gwdateYear))));
    var theta2Rad = Math.atan(-Math.cos(paUtils.degreesToRadians(longAscNodeDeg - sunLongDeg)) * Math.tan(paUtils.degreesToRadians(paMacros.degreesMinutesSecondsToDecimalDegrees(7, 15, 0))));
    var pDeg = paMacros.degrees(theta1Rad + theta2Rad);
    var rho1Deg = helioDisplacementArcmin / 60;
    var rhoRad = Math.asin(2 * rho1Deg / paMacros.sunDia(0, 0, 0, 0, 0, gwdateDay, gwdateMonth, gwdateYear)) - paUtils.degreesToRadians(rho1Deg);
    var bRad = Math.asin(Math.sin(b0Rad) * Math.cos(rhoRad) + Math.cos(b0Rad) * Math.sin(rhoRad) * Math.cos(paUtils.degreesToRadians(pDeg - helioPositionAngleDeg)));
    var bDeg = paMacros.degrees(bRad);
    var lDeg1 = paMacros.degrees(Math.asin(Math.sin(rhoRad) * Math.sin(paUtils.degreesToRadians(pDeg - helioPositionAngleDeg)) / Math.cos(bRad))) + l0Deg1;
    var lDeg2 = lDeg1 - 360 * Math.floor(lDeg1 / 360);

    var helioLongDeg = paUtils.round(lDeg2, 2);
    var helioLatDeg = paUtils.round(bDeg, 2);

    return [helioLongDeg, helioLatDeg];
}

/**
 * Calculate carrington rotation number for a Greenwich date
 */
function carringtonRotationNumber(gwdateDay, gwdateMonth, gwdateYear) {
    var julianDateDays = paMacros.civilDateToJulianDate(gwdateDay, gwdateMonth, gwdateYear);

    var crn = 1690 + paUtils.round((julianDateDays - 2444235.34) / 27.2753, 0);

    return crn;
}

/**
 * Calculate selenographic (lunar) coordinates (sub-Earth)
 */
function selenographicCoordinates1(gwdateDay, gwdateMonth, gwdateYear) {
    var julianDateDays = paMacros.civilDateToJulianDate(gwdateDay, gwdateMonth, gwdateYear);
    var tCenturies = (julianDateDays - 2451545) / 36525;
    var longAscNodeDeg = 125.044522 - 1934.136261 * tCenturies;
    var f1 = 93.27191 + 483202.0175 * tCenturies;
    var f2 = f1 - 360 * Math.floor(f1 / 360);
    var geocentricMoonLongDeg = paMacros.moonLong(0, 0, 0, 0, 0, gwdateDay, gwdateMonth, gwdateYear);
    var geocentricMoonLatRad = paUtils.degreesToRadians(paMacros.moonLat(0, 0, 0, 0, 0, gwdateDay, gwdateMonth, gwdateYear));
    var inclinationRad = paUtils.degreesToRadians(paMacros.degreesMinutesSecondsToDecimalDegrees(1, 32, 32.7));
    var nodeLongRad = paUtils.degreesToRadians(longAscNodeDeg - geocentricMoonLongDeg);
    var sinBe = -Math.cos(inclinationRad) * Math.sin(geocentricMoonLatRad) + Math.sin(inclinationRad) * Math.cos(geocentricMoonLatRad) * Math.sin(nodeLongRad);
    var subEarthLatDeg = paMacros.degrees(Math.asin(sinBe));
    var aRad = Math.atan2((-Math.sin(geocentricMoonLatRad) * Math.sin(inclinationRad) - Math.cos(geocentricMoonLatRad) * Math.cos(inclinationRad) * Math.sin(nodeLongRad)), (Math.cos(geocentricMoonLatRad) * Math.cos(nodeLongRad)));
    var aDeg = paMacros.degrees(aRad);
    var subEarthLongDeg1 = aDeg - f2;
    var subEarthLongDeg2 = subEarthLongDeg1 - 360 * Math.floor(subEarthLongDeg1 / 360);
    var subEarthLongDeg3 = (subEarthLongDeg2 > 180) ? subEarthLongDeg2 - 360 : subEarthLongDeg2;
    var c1Rad = Math.atan(Math.cos(nodeLongRad) * Math.sin(inclinationRad) / (Math.cos(geocentricMoonLatRad) * Math.cos(inclinationRad) + Math.sin(geocentricMoonLatRad) * Math.sin(inclinationRad) * Math.sin(nodeLongRad)));
    var obliquityRad = paUtils.degreesToRadians(paMacros.obliq(gwdateDay, gwdateMonth, gwdateYear));
    var c2Rad = Math.atan(Math.sin(obliquityRad) * Math.cos(paUtils.degreesToRadians(geocentricMoonLongDeg)) / (Math.sin(obliquityRad) * Math.sin(geocentricMoonLatRad) * Math.sin(paUtils.degreesToRadians(geocentricMoonLongDeg)) - Math.cos(obliquityRad) * Math.cos(geocentricMoonLatRad)));
    var cDeg = paMacros.degrees(c1Rad + c2Rad);

    var subEarthLongitude = paUtils.round(subEarthLongDeg3, 2);
    var subEarthLatitude = paUtils.round(subEarthLatDeg, 2);
    var positionAngleOfPole = paUtils.round(cDeg, 2);

    return [subEarthLongitude, subEarthLatitude, positionAngleOfPole];
}

/**
 * Calculate selenographic (lunar) coordinates (sub-Solar)
 */
function selenographicCoordinates2(gwdateDay, gwdateMonth, gwdateYear) {
    var julianDateDays = paMacros.civilDateToJulianDate(gwdateDay, gwdateMonth, gwdateYear);
    var tCenturies = (julianDateDays - 2451545) / 36525;
    var longAscNodeDeg = 125.044522 - 1934.136261 * tCenturies;
    var f1 = 93.27191 + 483202.0175 * tCenturies;
    var f2 = f1 - 360 * Math.floor(f1 / 360);
    var sunGeocentricLongDeg = paMacros.sunLong(0, 0, 0, 0, 0, gwdateDay, gwdateMonth, gwdateYear);
    var moonEquHorParallaxArcMin = paMacros.moonHP(0, 0, 0, 0, 0, gwdateDay, gwdateMonth, gwdateYear) * 60;
    var sunEarthDistAU = paMacros.sunDist(0, 0, 0, 0, 0, gwdateDay, gwdateMonth, gwdateYear);
    var geocentricMoonLatRad = paUtils.degreesToRadians(paMacros.moonLat(0, 0, 0, 0, 0, gwdateDay, gwdateMonth, gwdateYear));
    var geocentricMoonLongDeg = paMacros.moonLong(0, 0, 0, 0, 0, gwdateDay, gwdateMonth, gwdateYear);
    var adjustedMoonLongDeg = sunGeocentricLongDeg + 180 + (26.4 * Math.cos(geocentricMoonLatRad) * Math.sin(paUtils.degreesToRadians(sunGeocentricLongDeg - geocentricMoonLongDeg)) / (moonEquHorParallaxArcMin * sunEarthDistAU));
    var adjustedMoonLatRad = 0.14666 * geocentricMoonLatRad / (moonEquHorParallaxArcMin * sunEarthDistAU);
    var inclinationRad = paUtils.degreesToRadians(paMacros.degreesMinutesSecondsToDecimalDegrees(1, 32, 32.7));
    var nodeLongRad = paUtils.degreesToRadians(longAscNodeDeg - adjustedMoonLongDeg);
    var sinBs = -Math.cos(inclinationRad) * Math.sin(adjustedMoonLatRad) + Math.sin(inclinationRad) * Math.cos(adjustedMoonLatRad) * Math.sin(nodeLongRad);
    var subSolarLatDeg = paMacros.degrees(Math.asin(sinBs));
    var aRad = Math.atan2((-Math.sin(adjustedMoonLatRad) * Math.sin(inclinationRad) - Math.cos(adjustedMoonLatRad) * Math.cos(inclinationRad) * Math.sin(nodeLongRad)), (Math.cos(adjustedMoonLatRad) * Math.cos(nodeLongRad)));
    var aDeg = paMacros.degrees(aRad);
    var subSolarLongDeg1 = aDeg - f2;
    var subSolarLongDeg2 = subSolarLongDeg1 - 360 * Math.floor(subSolarLongDeg1 / 360);
    var subSolarLongDeg3 = (subSolarLongDeg2 > 180) ? subSolarLongDeg2 - 360 : subSolarLongDeg2;
    var subSolarColongDeg = 90 - subSolarLongDeg3;

    var subSolarLongitude = paUtils.round(subSolarLongDeg3, 2);
    var subSolarColongitude = paUtils.round(subSolarColongDeg, 2);
    var subSolarLatitude = paUtils.round(subSolarLatDeg, 2);

    return [subSolarLongitude, subSolarColongitude, subSolarLatitude];
}


module.exports = {
    angleToDecimalDegrees,
    decimalDegreesToAngle,
    rightAscensionToHourAngle,
    hourAngleToRightAscension,
    equatorialCoordinatesToHorizonCoordinates,
    horizonCoordinatesToEquatorialCoordinates,
    meanObliquityOfTheEcliptic,
    eclipticCoordinateToEquatorialCoordinate,
    equatorialCoordinateToEclipticCoordinate,
    equatorialCoordinateToGalacticCoordinate,
    galacticCoordinateToEquatorialCoordinate,
    angleBetweenTwoObjects,
    risingAndSetting,
    correctForPrecession,
    nutationInEclipticLongitudeAndObliquity,
    correctForAberration,
    atmosphericRefraction,
    correctionsForGeocentricParallax,
    heliographicCoordinates,
    carringtonRotationNumber,
    selenographicCoordinates1,
    selenographicCoordinates2
};