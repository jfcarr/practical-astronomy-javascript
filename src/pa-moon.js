const paMacros = require('./pa-macros.js');
const paTypes = require('./pa-types.js');
const paUtils = require('./pa-utils.js');

/**
 * Calculate approximate position of the Moon.
 */
function approximatePositionOfMoon(lctHour, lctMin, lctSec, isDaylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear) {
    var daylightSaving = (isDaylightSaving) ? 1 : 0;

    var l0 = 91.9293359879052;
    var p0 = 130.143076320618;
    var n0 = 291.682546643194;
    var i = 5.145396;

    var gdateDay = paMacros.localCivilTimeGreenwichDay(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);
    var gdateMonth = paMacros.localCivilTimeGreenwichMonth(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);
    var gdateYear = paMacros.localCivilTimeGreenwichYear(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);

    var utHours = paMacros.localCivilTimeToUniversalTime(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);
    var dDays = paMacros.civilDateToJulianDate(gdateDay, gdateMonth, gdateYear) - paMacros.civilDateToJulianDate(0.0, 1, 2010) + utHours / 24;
    var sunLongDeg = paMacros.sunLong(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);
    var sunMeanAnomalyRad = paMacros.sunMeanAnomaly(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);
    var lmDeg = paMacros.unwindDeg(13.1763966 * dDays + l0);
    var mmDeg = paMacros.unwindDeg(lmDeg - 0.1114041 * dDays - p0);
    var nDeg = paMacros.unwindDeg(n0 - (0.0529539 * dDays));
    var evDeg = 1.2739 * Math.sin(paUtils.degreesToRadians(2.0 * (lmDeg - sunLongDeg) - mmDeg));
    var aeDeg = 0.1858 * Math.sin(sunMeanAnomalyRad);
    var a3Deg = 0.37 * Math.sin(sunMeanAnomalyRad);
    var mmdDeg = mmDeg + evDeg - aeDeg - a3Deg;
    var ecDeg = 6.2886 * Math.sin(paUtils.degreesToRadians(mmdDeg));
    var a4Deg = 0.214 * Math.sin(2.0 * paUtils.degreesToRadians(mmdDeg));
    var ldDeg = lmDeg + evDeg + ecDeg - aeDeg + a4Deg;
    var vDeg = 0.6583 * Math.sin(2.0 * paUtils.degreesToRadians(ldDeg - sunLongDeg));
    var lddDeg = ldDeg + vDeg;
    var ndDeg = nDeg - 0.16 * Math.sin(sunMeanAnomalyRad);
    var y = Math.sin(paUtils.degreesToRadians(lddDeg - ndDeg)) * Math.cos(paUtils.degreesToRadians(i));
    var x = Math.cos(paUtils.degreesToRadians(lddDeg - ndDeg));

    var moonLongDeg = paMacros.unwindDeg(paMacros.degrees(Math.atan2(y, x)) + ndDeg);
    var moonLatDeg = paMacros.degrees(Math.asin(Math.sin(paUtils.degreesToRadians(lddDeg - ndDeg)) * Math.sin(paUtils.degreesToRadians(i))));
    var moonRAHours1 = paMacros.decimalDegreesToDegreeHours(paMacros.ecRA(moonLongDeg, 0, 0, moonLatDeg, 0, 0, gdateDay, gdateMonth, gdateYear));
    var moonDecDeg1 = paMacros.ecDec(moonLongDeg, 0, 0, moonLatDeg, 0, 0, gdateDay, gdateMonth, gdateYear);

    var moonRAHour = paMacros.decimalHoursHour(moonRAHours1);
    var moonRAMin = paMacros.decimalHoursMinute(moonRAHours1);
    var moonRASec = paMacros.decimalHoursSecond(moonRAHours1);
    var moonDecDeg = paMacros.decimalDegreesDegrees(moonDecDeg1);
    var moonDecMin = paMacros.decimalDegreesMinutes(moonDecDeg1);
    var moonDecSec = paMacros.decimalDegreesSeconds(moonDecDeg1);

    return [moonRAHour, moonRAMin, moonRASec, moonDecDeg, moonDecMin, moonDecSec];
}

/**
 * Calculate precise position of the Moon.
 */
function precisePositionOfMoon(lctHour, lctMin, lctSec, isDaylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear) {
    var daylightSaving = (isDaylightSaving) ? 1 : 0;

    var gdateDay = paMacros.localCivilTimeGreenwichDay(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);
    var gdateMonth = paMacros.localCivilTimeGreenwichMonth(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);
    var gdateYear = paMacros.localCivilTimeGreenwichYear(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);

    var [moonLongDeg, moonLatDeg, moonHorPara] = paMacros.moonLongLatHP(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);

    var nutationInLongitudeDeg = paMacros.nutatLong(gdateDay, gdateMonth, gdateYear);
    var correctedLongDeg = moonLongDeg + nutationInLongitudeDeg;
    var earthMoonDistanceKM = 6378.14 / Math.sin(paUtils.degreesToRadians(moonHorPara));
    var moonRAHours1 = paMacros.decimalDegreesToDegreeHours(paMacros.ecRA(correctedLongDeg, 0, 0, moonLatDeg, 0, 0, gdateDay, gdateMonth, gdateYear));
    var moonDecDeg1 = paMacros.ecDec(correctedLongDeg, 0, 0, moonLatDeg, 0, 0, gdateDay, gdateMonth, gdateYear);

    var moonRAHour = paMacros.decimalHoursHour(moonRAHours1);
    var moonRAMin = paMacros.decimalHoursMinute(moonRAHours1);
    var moonRASec = paMacros.decimalHoursSecond(moonRAHours1);
    var moonDecDeg = paMacros.decimalDegreesDegrees(moonDecDeg1);
    var moonDecMin = paMacros.decimalDegreesMinutes(moonDecDeg1);
    var moonDecSec = paMacros.decimalDegreesSeconds(moonDecDeg1);
    var earthMoonDistKM = paUtils.round(earthMoonDistanceKM, 0);
    var moonHorParallaxDeg = paUtils.round(moonHorPara, 6);

    return [moonRAHour, moonRAMin, moonRASec, moonDecDeg, moonDecMin, moonDecSec, earthMoonDistKM, moonHorParallaxDeg];
}

/**
 * Calculate Moon phase and position angle of bright limb.
 */
function moonPhase(lctHour, lctMin, lctSec, isDaylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear, accuracyLevel) {
    var daylightSaving = (isDaylightSaving) ? 1 : 0;

    var gdateDay = paMacros.localCivilTimeGreenwichDay(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);
    var gdateMonth = paMacros.localCivilTimeGreenwichMonth(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);
    var gdateYear = paMacros.localCivilTimeGreenwichYear(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);

    var sunLongDeg = paMacros.sunLong(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);
    var [moonLongDeg, moonLatDeg, moonHorPara] = paMacros.moonLongLatHP(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);
    var dRad = paUtils.degreesToRadians(moonLongDeg - sunLongDeg);

    var moonPhase1 = (accuracyLevel == paTypes.AccuracyLevel.Precise) ? paMacros.moonPhase(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear) : (1.0 - Math.cos(dRad)) / 2.0;

    var sunRARad = paUtils.degreesToRadians(paMacros.ecRA(sunLongDeg, 0, 0, 0, 0, 0, gdateDay, gdateMonth, gdateYear));
    var moonRARad = paUtils.degreesToRadians(paMacros.ecRA(moonLongDeg, 0, 0, moonLatDeg, 0, 0, gdateDay, gdateMonth, gdateYear));
    var sunDecRad = paUtils.degreesToRadians(paMacros.ecDec(sunLongDeg, 0, 0, 0, 0, 0, gdateDay, gdateMonth, gdateYear));
    var moonDecRad = paUtils.degreesToRadians(paMacros.ecDec(moonLongDeg, 0, 0, moonLatDeg, 0, 0, gdateDay, gdateMonth, gdateYear));

    var y = Math.cos(sunDecRad) * Math.sin(sunRARad - moonRARad);
    var x = Math.cos(moonDecRad) * Math.sin(sunDecRad) - Math.sin(moonDecRad) * Math.cos(sunDecRad) * Math.cos(sunRARad - moonRARad);

    var chiDeg = paMacros.degrees(Math.atan2(y, x));

    var moonPhase = paUtils.round(moonPhase1, 2);
    var paBrightLimbDeg = paUtils.round(chiDeg, 2);

    return [moonPhase, paBrightLimbDeg];
}

/**
 * Calculate new moon and full moon instances.
 */
function timesOfNewMoonAndFullMoon(isDaylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear) {
    var daylightSaving = (isDaylightSaving) ? 1 : 0;

    var jdOfNewMoonDays = paMacros.newMoon(daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);
    var jdOfFullMoonDays = paMacros.fullMoon(3, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);

    var gDateOfNewMoonDay = paMacros.julianDateDay(jdOfNewMoonDays);
    var integerDay1 = Math.floor(gDateOfNewMoonDay);
    var gDateOfNewMoonMonth = paMacros.julianDateMonth(jdOfNewMoonDays);
    var gDateOfNewMoonYear = paMacros.julianDateYear(jdOfNewMoonDays);

    var gDateOfFullMoonDay = paMacros.julianDateDay(jdOfFullMoonDays);
    var integerDay2 = Math.floor(gDateOfFullMoonDay);
    var gDateOfFullMoonMonth = paMacros.julianDateMonth(jdOfFullMoonDays);
    var gDateOfFullMoonYear = paMacros.julianDateYear(jdOfFullMoonDays);

    var utOfNewMoonHours = 24.0 * (gDateOfNewMoonDay - integerDay1);
    var utOfFullMoonHours = 24.0 * (gDateOfFullMoonDay - integerDay2);
    var lctOfNewMoonHours = paMacros.universalTimeToLocalCivilTime(utOfNewMoonHours + 0.008333, 0, 0, daylightSaving, zoneCorrectionHours, integerDay1, gDateOfNewMoonMonth, gDateOfNewMoonYear);
    var lctOfFullMoonHours = paMacros.universalTimeToLocalCivilTime(utOfFullMoonHours + 0.008333, 0, 0, daylightSaving, zoneCorrectionHours, integerDay2, gDateOfFullMoonMonth, gDateOfFullMoonYear);

    var nmLocalTimeHour = paMacros.decimalHoursHour(lctOfNewMoonHours);
    var nmLocalTimeMin = paMacros.decimalHoursMinute(lctOfNewMoonHours);
    var nmLocalDateDay = paMacros.universalTime_LocalCivilDay(utOfNewMoonHours, 0, 0, daylightSaving, zoneCorrectionHours, integerDay1, gDateOfNewMoonMonth, gDateOfNewMoonYear);
    var nmLocalDateMonth = paMacros.universalTime_LocalCivilMonth(utOfNewMoonHours, 0, 0, daylightSaving, zoneCorrectionHours, integerDay1, gDateOfNewMoonMonth, gDateOfNewMoonYear);
    var nmLocalDateYear = paMacros.universalTime_LocalCivilYear(utOfNewMoonHours, 0, 0, daylightSaving, zoneCorrectionHours, integerDay1, gDateOfNewMoonMonth, gDateOfNewMoonYear);
    var fmLocalTimeHour = paMacros.decimalHoursHour(lctOfFullMoonHours);
    var fmLocalTimeMin = paMacros.decimalHoursMinute(lctOfFullMoonHours);
    var fmLocalDateDay = paMacros.universalTime_LocalCivilDay(utOfFullMoonHours, 0, 0, daylightSaving, zoneCorrectionHours, integerDay2, gDateOfFullMoonMonth, gDateOfFullMoonYear);
    var fmLocalDateMonth = paMacros.universalTime_LocalCivilMonth(utOfFullMoonHours, 0, 0, daylightSaving, zoneCorrectionHours, integerDay2, gDateOfFullMoonMonth, gDateOfFullMoonYear);
    var fmLocalDateYear = paMacros.universalTime_LocalCivilYear(utOfFullMoonHours, 0, 0, daylightSaving, zoneCorrectionHours, integerDay2, gDateOfFullMoonMonth, gDateOfFullMoonYear);

    return [nmLocalTimeHour, nmLocalTimeMin, nmLocalDateDay, nmLocalDateMonth, nmLocalDateYear, fmLocalTimeHour, fmLocalTimeMin, fmLocalDateDay, fmLocalDateMonth, fmLocalDateYear];
}

/**
 * Calculate Moon's distance, angular diameter, and horizontal parallax.
 */
function moonDistAngDiamHorParallax(lctHour, lctMin, lctSec, isDaylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear) {
    var daylightSaving = (isDaylightSaving) ? 1 : 0;

    var moonDistance = paMacros.moonDist(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);
    var moonAngularDiameter = paMacros.moonSize(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);
    var moonHorizontalParallax = paMacros.moonHP(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);

    var earthMoonDist = paUtils.round(moonDistance, 0);
    var angDiameterDeg = paMacros.decimalDegreesDegrees(moonAngularDiameter + 0.008333);
    var angDiameterMin = paMacros.decimalDegreesMinutes(moonAngularDiameter + 0.008333);
    var horParallaxDeg = paMacros.decimalDegreesDegrees(moonHorizontalParallax);
    var horParallaxMin = paMacros.decimalDegreesMinutes(moonHorizontalParallax);
    var horParallaxSec = paMacros.decimalDegreesSeconds(moonHorizontalParallax);

    return [earthMoonDist, angDiameterDeg, angDiameterMin, horParallaxDeg, horParallaxMin, horParallaxSec];
}

/**
 * Calculate date/time of local moonrise and moonset.
 */
function moonriseAndMoonset(localDateDay, localDateMonth, localDateYear, isDaylightSaving, zoneCorrectionHours, geogLongDeg, geogLatDeg) {
    var daylightSaving = (isDaylightSaving) ? 1 : 0;

    var localTimeOfMoonriseHours = paMacros.moonRiseLCT(localDateDay, localDateMonth, localDateYear, daylightSaving, zoneCorrectionHours, geogLongDeg, geogLatDeg);
    var [moonRiseLCResult_dy1, moonRiseLCResult_mn1, moonRiseLCResult_yr1] = paMacros.moonRiseLcDMY(localDateDay, localDateMonth, localDateYear, daylightSaving, zoneCorrectionHours, geogLongDeg, geogLatDeg);
    var localAzimuthDeg1 = paMacros.moonRiseAz(localDateDay, localDateMonth, localDateYear, daylightSaving, zoneCorrectionHours, geogLongDeg, geogLatDeg);

    var localTimeOfMoonsetHours = paMacros.moonSetLCT(localDateDay, localDateMonth, localDateYear, daylightSaving, zoneCorrectionHours, geogLongDeg, geogLatDeg);
    var [moonSetLCResult_dy1, moonSetLCResult_mn1, moonSetLCResult_yr1] = paMacros.moonSetLcDMY(localDateDay, localDateMonth, localDateYear, daylightSaving, zoneCorrectionHours, geogLongDeg, geogLatDeg);
    var localAzimuthDeg2 = paMacros.moonSetAz(localDateDay, localDateMonth, localDateYear, daylightSaving, zoneCorrectionHours, geogLongDeg, geogLatDeg);

    var mrLTHour = paMacros.decimalHoursHour(localTimeOfMoonriseHours + 0.008333);
    var mrLTMin = paMacros.decimalHoursMinute(localTimeOfMoonriseHours + 0.008333);
    var mrLocalDateDay = moonRiseLCResult_dy1;
    var mrLocalDateMonth = moonRiseLCResult_mn1;
    var mrLocalDateYear = moonRiseLCResult_yr1;
    var mrAzimuthDeg = paUtils.round(localAzimuthDeg1, 2);
    var msLTHour = paMacros.decimalHoursHour(localTimeOfMoonsetHours + 0.008333);
    var msLTMin = paMacros.decimalHoursMinute(localTimeOfMoonsetHours + 0.008333);
    var msLocalDateDay = moonSetLCResult_dy1;
    var msLocalDateMonth = moonSetLCResult_mn1;
    var msLocalDateYear = moonSetLCResult_yr1;
    var msAzimuthDeg = paUtils.round(localAzimuthDeg2, 2);

    return [mrLTHour, mrLTMin, mrLocalDateDay, mrLocalDateMonth, mrLocalDateYear, mrAzimuthDeg, msLTHour, msLTMin, msLocalDateDay, msLocalDateMonth, msLocalDateYear, msAzimuthDeg];
}


module.exports = {
    approximatePositionOfMoon,
    precisePositionOfMoon,
    moonPhase,
    timesOfNewMoonAndFullMoon,
    moonDistAngDiamHorParallax,
    moonriseAndMoonset
};