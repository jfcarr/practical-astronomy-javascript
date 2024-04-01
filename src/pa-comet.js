const paCometData = require('./data/pa-cometdata.js');
const paMacros = require('./pa-macros.js');
const paUtils = require('./pa-utils.js');

/**
 * Calculate position of an elliptical comet.
 */
function positionOfEllipticalComet(lctHour, lctMin, lctSec, isDaylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear, cometName) {
    var daylightSaving = (isDaylightSaving) ? 1 : 0;

    var greenwichDateDay = paMacros.localCivilTimeGreenwichDay(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);
    var greenwichDateMonth = paMacros.localCivilTimeGreenwichMonth(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);
    var greenwichDateYear = paMacros.localCivilTimeGreenwichYear(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);

    var [comet_name, epoch_EpochOfPerihelion, peri_LongitudeOfPerihelion, node_LongitudeOfAscendingNode, period_PeriodOfOrbit, axis_SemiMajorAxisOfOrbit, ecc_EccentricityOfOrbit, incl_InclinationOfOrbit] = paCometData.getCometEllipticalData(cometName);

    var timeSinceEpochYears = (paMacros.civilDateToJulianDate(greenwichDateDay, greenwichDateMonth, greenwichDateYear) - paMacros.civilDateToJulianDate(0.0, 1, greenwichDateYear)) / 365.242191 + greenwichDateYear - Number(epoch_EpochOfPerihelion);
    var mcDeg = 360 * timeSinceEpochYears / Number(period_PeriodOfOrbit);
    var mcRad = paUtils.degreesToRadians(mcDeg - 360 * Math.floor(mcDeg / 360));
    var eccentricity = Number(ecc_EccentricityOfOrbit);
    var trueAnomalyDeg = paMacros.degrees(paMacros.trueAnomaly(mcRad, eccentricity));
    var lcDeg = trueAnomalyDeg + Number(peri_LongitudeOfPerihelion);
    var rAU = Number(axis_SemiMajorAxisOfOrbit) * (1 - eccentricity * eccentricity) / (1 + eccentricity * Math.cos(paUtils.degreesToRadians(trueAnomalyDeg)));
    var lcNodeRad = paUtils.degreesToRadians(lcDeg - Number(node_LongitudeOfAscendingNode));
    var psiRad = Math.asin(Math.sin(lcNodeRad) * Math.sin(paUtils.degreesToRadians(Number(incl_InclinationOfOrbit))));

    var y = Math.sin(lcNodeRad) * Math.cos(paUtils.degreesToRadians(Number(incl_InclinationOfOrbit)));
    var x = Math.cos(lcNodeRad);

    var ldDeg = paMacros.degrees(Math.atan2(y, x)) + Number(node_LongitudeOfAscendingNode);
    var rdAU = rAU * Math.cos(psiRad);

    var earthLongitudeLeDeg = paMacros.sunLong(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear) + 180.0;
    var earthRadiusVectorAU = paMacros.sunDist(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);

    var leLdRad = paUtils.degreesToRadians(earthLongitudeLeDeg - ldDeg);
    var aRad = (rdAU < earthRadiusVectorAU) ? Math.atan2((rdAU * Math.sin(leLdRad)), (earthRadiusVectorAU - rdAU * Math.cos(leLdRad))) : Math.atan2((earthRadiusVectorAU * Math.sin(-leLdRad)), (rdAU - earthRadiusVectorAU * Math.cos(leLdRad)));

    var cometLongDeg1 = (rdAU < earthRadiusVectorAU) ? 180.0 + earthLongitudeLeDeg + paMacros.degrees(aRad) : paMacros.degrees(aRad) + ldDeg;
    var cometLongDeg = cometLongDeg1 - 360 * Math.floor(cometLongDeg1 / 360);
    var cometLatDeg = paMacros.degrees(Math.atan(rdAU * Math.tan(psiRad) * Math.sin(paUtils.degreesToRadians(cometLongDeg1 - ldDeg)) / (earthRadiusVectorAU * Math.sin(-leLdRad))));
    var cometRAHours1 = paMacros.decimalDegreesToDegreeHours(paMacros.ecRA(cometLongDeg, 0, 0, cometLatDeg, 0, 0, greenwichDateDay, greenwichDateMonth, greenwichDateYear));
    var cometDecDeg1 = paMacros.ecDec(cometLongDeg, 0, 0, cometLatDeg, 0, 0, greenwichDateDay, greenwichDateMonth, greenwichDateYear);
    var cometDistanceAU = Math.sqrt(Math.pow(earthRadiusVectorAU, 2) + Math.pow(rAU, 2) - 2.0 * earthRadiusVectorAU * rAU * Math.cos(paUtils.degreesToRadians(lcDeg - earthLongitudeLeDeg)) * Math.cos(psiRad));

    var cometRAHour = paMacros.decimalHoursHour(cometRAHours1 + 0.008333);
    var cometRAMin = paMacros.decimalHoursMinute(cometRAHours1 + 0.008333);
    var cometDecDeg = paMacros.decimalDegreesDegrees(cometDecDeg1 + 0.008333);
    var cometDecMin = paMacros.decimalDegreesMinutes(cometDecDeg1 + 0.008333);
    var cometDistEarth = paUtils.round(cometDistanceAU, 2);

    return [cometRAHour, cometRAMin, cometDecDeg, cometDecMin, cometDistEarth];
}


module.exports = {
    positionOfEllipticalComet
};