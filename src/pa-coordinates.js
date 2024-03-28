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
    angleBetweenTwoObjects
};