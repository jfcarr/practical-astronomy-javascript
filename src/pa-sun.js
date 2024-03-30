const paMacros = require('./pa-macros.js');
const paUtils = require('./pa-utils.js');

/**
 * Calculate approximate position of the sun for a local date and time.
 */
function approximatePositionOfSun(lctHours, lctMinutes, lctSeconds, localDay, localMonth, localYear, isDaylightSaving, zoneCorrection) {
    var daylightSaving = (isDaylightSaving == true) ? 1 : 0;

    var greenwichDateDay = paMacros.localCivilTimeGreenwichDay(lctHours, lctMinutes, lctSeconds, daylightSaving, zoneCorrection, localDay, localMonth, localYear);
    var greenwichDateMonth = paMacros.localCivilTimeGreenwichMonth(lctHours, lctMinutes, lctSeconds, daylightSaving, zoneCorrection, localDay, localMonth, localYear);
    var greenwichDateYear = paMacros.localCivilTimeGreenwichYear(lctHours, lctMinutes, lctSeconds, daylightSaving, zoneCorrection, localDay, localMonth, localYear);
    var utHours = paMacros.localCivilTimeToUniversalTime(lctHours, lctMinutes, lctSeconds, daylightSaving, zoneCorrection, localDay, localMonth, localYear);
    var utDays = utHours / 24;
    var jdDays = paMacros.civilDateToJulianDate(greenwichDateDay, greenwichDateMonth, greenwichDateYear) + utDays;
    var dDays = jdDays - paMacros.civilDateToJulianDate(0, 1, 2010);
    var nDeg = 360 * dDays / 365.242191;
    var mDeg1 = nDeg + paMacros.sunELong(0, 1, 2010) - paMacros.sunPeri(0, 1, 2010);
    var mDeg2 = mDeg1 - 360 * Math.floor(mDeg1 / 360);
    var eCDeg = 360 * paMacros.sunEcc(0, 1, 2010) * Math.sin(paUtils.degreesToRadians(mDeg2)) / Math.PI;
    var lSDeg1 = nDeg + eCDeg + paMacros.sunELong(0, 1, 2010);
    var lSDeg2 = lSDeg1 - 360 * Math.floor(lSDeg1 / 360);
    var raDeg = paMacros.ecRA(lSDeg2, 0, 0, 0, 0, 0, greenwichDateDay, greenwichDateMonth, greenwichDateYear);
    var raHours = paMacros.decimalDegreesToDegreeHours(raDeg);
    var decDeg = paMacros.ecDec(lSDeg2, 0, 0, 0, 0, 0, greenwichDateDay, greenwichDateMonth, greenwichDateYear);

    var sunRAHour = paMacros.decimalHoursHour(raHours);
    var sunRAMin = paMacros.decimalHoursMinute(raHours);
    var sunRASec = paMacros.decimalHoursSecond(raHours);
    var sunDecDeg = paMacros.decimalDegreesDegrees(decDeg);
    var sunDecMin = paMacros.decimalDegreesMinutes(decDeg);
    var sunDecSec = paMacros.decimalDegreesSeconds(decDeg);

    return [sunRAHour, sunRAMin, sunRASec, sunDecDeg, sunDecMin, sunDecSec];
}

/**
 * Calculate precise position of the sun for a local date and time.
 */
function precisePositionOfSun(lctHours, lctMinutes, lctSeconds, localDay, localMonth, localYear, isDaylightSaving, zoneCorrection) {
    var daylightSaving = (isDaylightSaving == true) ? 1 : 0;

    var gDay = paMacros.localCivilTimeGreenwichDay(lctHours, lctMinutes, lctSeconds, daylightSaving, zoneCorrection, localDay, localMonth, localYear);
    var gMonth = paMacros.localCivilTimeGreenwichMonth(lctHours, lctMinutes, lctSeconds, daylightSaving, zoneCorrection, localDay, localMonth, localYear);
    var gYear = paMacros.localCivilTimeGreenwichYear(lctHours, lctMinutes, lctSeconds, daylightSaving, zoneCorrection, localDay, localMonth, localYear);
    var sunEclipticLongitudeDeg = paMacros.sunLong(lctHours, lctMinutes, lctSeconds, daylightSaving, zoneCorrection, localDay, localMonth, localYear);
    var raDeg = paMacros.ecRA(sunEclipticLongitudeDeg, 0, 0, 0, 0, 0, gDay, gMonth, gYear);
    var raHours = paMacros.decimalDegreesToDegreeHours(raDeg);
    var decDeg = paMacros.ecDec(sunEclipticLongitudeDeg, 0, 0, 0, 0, 0, gDay, gMonth, gYear);

    var sunRAHour = paMacros.decimalHoursHour(raHours);
    var sunRAMin = paMacros.decimalHoursMinute(raHours);
    var sunRASec = paMacros.decimalHoursSecond(raHours);
    var sunDecDeg = paMacros.decimalDegreesDegrees(decDeg);
    var sunDecMin = paMacros.decimalDegreesMinutes(decDeg);
    var sunDecSec = paMacros.decimalDegreesSeconds(decDeg);

    return [sunRAHour, sunRAMin, sunRASec, sunDecDeg, sunDecMin, sunDecSec];
}

/**
 * Calculate distance to the Sun (in km), and angular size.
 */
function sunDistanceAndAngularSize(lctHours, lctMinutes, lctSeconds, localDay, localMonth, localYear, isDaylightSaving, zoneCorrection) {
    var daylightSaving = (isDaylightSaving) ? 1 : 0;

    var gDay = paMacros.localCivilTimeGreenwichDay(lctHours, lctMinutes, lctSeconds, daylightSaving, zoneCorrection, localDay, localMonth, localYear);
    var gMonth = paMacros.localCivilTimeGreenwichMonth(lctHours, lctMinutes, lctSeconds, daylightSaving, zoneCorrection, localDay, localMonth, localYear);
    var gYear = paMacros.localCivilTimeGreenwichYear(lctHours, lctMinutes, lctSeconds, daylightSaving, zoneCorrection, localDay, localMonth, localYear);
    var trueAnomalyDeg = paMacros.sunTrueAnomaly(lctHours, lctMinutes, lctSeconds, daylightSaving, zoneCorrection, localDay, localMonth, localYear);
    var trueAnomalyRad = paUtils.degreesToRadians(trueAnomalyDeg);
    var eccentricity = paMacros.sunEcc(gDay, gMonth, gYear);
    var f = (1 + eccentricity * Math.cos(trueAnomalyRad)) / (1 - eccentricity * eccentricity);
    var rKm = 149598500 / f;
    var thetaDeg = f * 0.533128;

    var sunDistKm = paUtils.round(rKm, 0);
    var sunAngSizeDeg = paMacros.decimalDegreesDegrees(thetaDeg);
    var sunAngSizeMin = paMacros.decimalDegreesMinutes(thetaDeg);
    var sunAngSizeSec = paMacros.decimalDegreesSeconds(thetaDeg);

    return [sunDistKm, sunAngSizeDeg, sunAngSizeMin, sunAngSizeSec];
}


module.exports = {
    approximatePositionOfSun,
    precisePositionOfSun,
    sunDistanceAndAngularSize
};