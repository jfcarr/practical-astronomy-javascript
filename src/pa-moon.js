const paMacros = require('./pa-macros.js');
const paPlanetData = require('./data/pa-planetdata.js');
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


module.exports = {
    approximatePositionOfMoon,
    precisePositionOfMoon
};