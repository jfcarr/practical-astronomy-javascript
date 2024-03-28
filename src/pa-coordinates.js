const paMacros = require('./pa-macros.js');
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


module.exports = {
    angleToDecimalDegrees,
    decimalDegreesToAngle,
    rightAscensionToHourAngle,
    hourAngleToRightAscension,
    equatorialCoordinatesToHorizonCoordinates,
    horizonCoordinatesToEquatorialCoordinates
};