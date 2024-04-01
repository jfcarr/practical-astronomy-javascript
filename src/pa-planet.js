const paMacros = require('./pa-macros.js');
const paPlanetData = require('./data/pa-planetdata.js');
const paUtils = require('./pa-utils.js');

/**
 * Calculate approximate position of a planet.
 */
function approximatePositionOfPlanet(lctHour, lctMin, lctSec, isDaylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear, planetName) {
    var daylightSaving = (isDaylightSaving) ? 1 : 0;

    var [planetInfo_name, planetInfo_tp_PeriodOrbit, planetInfo_long_LongitudeEpoch, planetInfo_peri_LongitudePerihelion, planetInfo_ecc_EccentricityOrbit, planetInfo_axis_AxisOrbit, planetInfo_incl_OrbitalInclination, planetInfo_node_LongitudeAscendingNode, planetInfo_theta0_AngularDiameter, planetInfo_v0_VisualMagnitude] = paPlanetData.getPlanetData(planetName);

    var gdateDay = paMacros.localCivilTimeGreenwichDay(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);
    var gdateMonth = paMacros.localCivilTimeGreenwichMonth(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);
    var gdateYear = paMacros.localCivilTimeGreenwichYear(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);

    var utHours = paMacros.localCivilTimeToUniversalTime(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);
    var dDays = paMacros.civilDateToJulianDate(gdateDay + (utHours / 24), gdateMonth, gdateYear) - paMacros.civilDateToJulianDate(0, 1, 2010);
    var npDeg1 = 360 * dDays / (365.242191 * Number(planetInfo_tp_PeriodOrbit));
    var npDeg2 = npDeg1 - 360 * Math.floor(npDeg1 / 360);
    var mpDeg = npDeg2 + Number(planetInfo_long_LongitudeEpoch) - Number(planetInfo_peri_LongitudePerihelion);
    var lpDeg1 = npDeg2 + (360 * Number(planetInfo_ecc_EccentricityOrbit) * Math.sin(paUtils.degreesToRadians(mpDeg)) / Math.PI) + Number(planetInfo_long_LongitudeEpoch);
    var lpDeg2 = lpDeg1 - 360 * Math.floor(lpDeg1 / 360);
    var planetTrueAnomalyDeg = lpDeg2 - Number(planetInfo_peri_LongitudePerihelion);
    var rAU = Number(planetInfo_axis_AxisOrbit) * (1 - Math.pow(Number(planetInfo_ecc_EccentricityOrbit), 2)) / (1 + Number(planetInfo_ecc_EccentricityOrbit) * Math.cos(paUtils.degreesToRadians(planetTrueAnomalyDeg)));

    var [earthInfo_name, earthInfo_tp_PeriodOrbit, earthInfo_long_LongitudeEpoch, earthInfo_peri_LongitudePerihelion, earthInfo_ecc_EccentricityOrbit, earthInfo_axis_AxisOrbit, earthInfo_incl_OrbitalInclination, earthInfo_node_LongitudeAscendingNode, earthInfo_theta0_AngularDiameter, earthInfo_v0_VisualMagnitude] = paPlanetData.getPlanetData(paPlanetData.planetNames.earth);

    var neDeg1 = 360 * dDays / (365.242191 * Number(earthInfo_tp_PeriodOrbit));
    var neDeg2 = neDeg1 - 360 * Math.floor(neDeg1 / 360);
    var meDeg = neDeg2 + Number(earthInfo_long_LongitudeEpoch) - Number(earthInfo_peri_LongitudePerihelion);
    var leDeg1 = neDeg2 + Number(earthInfo_long_LongitudeEpoch) + 360 * Number(earthInfo_ecc_EccentricityOrbit) * Math.sin(paUtils.degreesToRadians(meDeg)) / Math.PI;
    var leDeg2 = leDeg1 - 360 * Math.floor(leDeg1 / 360);
    var earthTrueAnomalyDeg = leDeg2 - Number(earthInfo_peri_LongitudePerihelion);
    var rAU2 = Number(earthInfo_axis_AxisOrbit) * (1 - Math.pow(Number(earthInfo_ecc_EccentricityOrbit), 2)) / (1 + Number(earthInfo_ecc_EccentricityOrbit) * Math.cos(paUtils.degreesToRadians(earthTrueAnomalyDeg)));
    var lpNodeRad = paUtils.degreesToRadians(lpDeg2 - Number(planetInfo_node_LongitudeAscendingNode));
    var psiRad = Math.asin(Math.sin(lpNodeRad) * Math.sin(paUtils.degreesToRadians(Number(planetInfo_incl_OrbitalInclination))));
    var y = Math.sin(lpNodeRad) * Math.cos(paUtils.degreesToRadians(Number(planetInfo_incl_OrbitalInclination)));
    var x = Math.cos(lpNodeRad);
    var ldDeg = paMacros.degrees(Math.atan2(y, x)) + Number(planetInfo_node_LongitudeAscendingNode);
    var rdAU = rAU * Math.cos(psiRad);
    var leLdRad = paUtils.degreesToRadians(leDeg2 - ldDeg);
    var atan2Type1 = Math.atan2((rdAU * Math.sin(leLdRad)), (rAU2 - rdAU * Math.cos(leLdRad)));
    var atan2Type2 = Math.atan2((rAU2 * Math.sin(-leLdRad)), (rdAU - rAU2 * Math.cos(leLdRad)));
    var aRad = (rdAU < 1) ? atan2Type1 : atan2Type2;
    var lamdaDeg1 = (rdAU < 1) ? 180 + leDeg2 + paMacros.degrees(aRad) : paMacros.degrees(aRad) + ldDeg;
    var lamdaDeg2 = lamdaDeg1 - 360 * Math.floor(lamdaDeg1 / 360);
    var betaDeg = paMacros.degrees(Math.atan(rdAU * Math.tan(psiRad) * Math.sin(paUtils.degreesToRadians(lamdaDeg2 - ldDeg)) / (rAU2 * Math.sin(-leLdRad))));
    var raHours = paMacros.decimalDegreesToDegreeHours(paMacros.ecRA(lamdaDeg2, 0, 0, betaDeg, 0, 0, gdateDay, gdateMonth, gdateYear));
    var decDeg = paMacros.ecDec(lamdaDeg2, 0, 0, betaDeg, 0, 0, gdateDay, gdateMonth, gdateYear);

    var planetRAHour = paMacros.decimalHoursHour(raHours);
    var planetRAMin = paMacros.decimalHoursMinute(raHours);
    var planetRASec = paMacros.decimalHoursSecond(raHours);
    var planetDecDeg = paMacros.decimalDegreesDegrees(decDeg);
    var planetDecMin = paMacros.decimalDegreesMinutes(decDeg);
    var planetDecSec = paMacros.decimalDegreesSeconds(decDeg);

    return [planetRAHour, planetRAMin, planetRASec, planetDecDeg, planetDecMin, planetDecSec];
}

/**
 * Calculate precise position of a planet.
 */
function precisePositionOfPlanet(lctHour, lctMin, lctSec, isDaylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear, planetName) {
    var daylightSaving = (isDaylightSaving) ? 1 : 0;

    var [planetLongitude, planetLatitude, planetDistanceAU, planetHLong1, planetHLong2, planetHLat, planetRVect] = paMacros.planetCoordinates(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear, planetName);

    var planetRAHours = paMacros.decimalDegreesToDegreeHours(paMacros.ecRA(planetLongitude, 0, 0, planetLatitude, 0, 0, localDateDay, localDateMonth, localDateYear));
    var planetDecDeg1 = paMacros.ecDec(planetLongitude, 0, 0, planetLatitude, 0, 0, localDateDay, localDateMonth, localDateYear);

    var planetRAHour = paMacros.decimalHoursHour(planetRAHours);
    var planetRAMin = paMacros.decimalHoursMinute(planetRAHours);
    var planetRASec = paMacros.decimalHoursSecond(planetRAHours);
    var planetDecDeg = paMacros.decimalDegreesDegrees(planetDecDeg1);
    var planetDecMin = paMacros.decimalDegreesMinutes(planetDecDeg1);
    var planetDecSec = paMacros.decimalDegreesSeconds(planetDecDeg1);

    return [planetRAHour, planetRAMin, planetRASec, planetDecDeg, planetDecMin, planetDecSec];
}

/**
 * Calculate several visual aspects of a planet.
 */
function visualAspectsOfAPlanet(lctHour, lctMin, lctSec, isDaylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear, planetName) {
    var daylightSaving = (isDaylightSaving) ? 1 : 0;

    var greenwichDateDay = paMacros.localCivilTimeGreenwichDay(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);
    var greenwichDateMonth = paMacros.localCivilTimeGreenwichMonth(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);
    var greenwichDateYear = paMacros.localCivilTimeGreenwichYear(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);

    var [planetLongitude, planetLatitude, planetDistanceAU, planetHLong1, planetHLong2, planetHLat, planetRVect] = paMacros.planetCoordinates(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear, planetName);

    var planetRARad = paUtils.degreesToRadians(paMacros.ecRA(planetLongitude, 0, 0, planetLatitude, 0, 0, localDateDay, localDateMonth, localDateYear));
    var planetDecRad = paUtils.degreesToRadians(paMacros.ecDec(planetLongitude, 0, 0, planetLatitude, 0, 0, localDateDay, localDateMonth, localDateYear));

    var lightTravelTimeHours = planetDistanceAU * 0.1386;

    var [planet_name, tp_PeriodOrbit, long_LongitudeEpoch, peri_LongitudePerihelion, ecc_EccentricityOrbit, axis_AxisOrbit, incl_OrbitalInclination, node_LongitudeAscendingNode, theta0_AngularDiameter, v0_VisualMagnitude] = paPlanetData.getPlanetData(planetName);

    var angularDiameterArcsec = Number(theta0_AngularDiameter) / planetDistanceAU;
    var phase1 = 0.5 * (1.0 + Math.cos(paUtils.degreesToRadians(planetLongitude - planetHLong1)));

    var sunEclLongDeg = paMacros.sunLong(lctHour, lctMin, lctSec, daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);
    var sunRARad = paUtils.degreesToRadians(paMacros.ecRA(sunEclLongDeg, 0, 0, 0, 0, 0, greenwichDateDay, greenwichDateMonth, greenwichDateYear));
    var sunDecRad = paUtils.degreesToRadians(paMacros.ecDec(sunEclLongDeg, 0, 0, 0, 0, 0, greenwichDateDay, greenwichDateMonth, greenwichDateYear));

    var y = Math.cos(sunDecRad) * Math.sin(sunRARad - planetRARad);
    var x = Math.cos(planetDecRad) * Math.sin(sunDecRad) - Math.sin(planetDecRad) * Math.cos(sunDecRad) * Math.cos(sunRARad - planetRARad);

    var chiDeg = paMacros.degrees(Math.atan2(y, x));
    var radiusVectorAU = planetRVect;
    var approximateMagnitude1 = 5.0 * Math.log10(radiusVectorAU * planetDistanceAU / (Math.sqrt(phase1))) + Number(v0_VisualMagnitude);

    var distanceAU = paUtils.round(planetDistanceAU, 5);
    var angDiaArcsec = paUtils.round(angularDiameterArcsec, 1);
    var phase = paUtils.round(phase1, 2);
    var lightTimeHour = paMacros.decimalHoursHour(lightTravelTimeHours);
    var lightTimeMinutes = paMacros.decimalHoursMinute(lightTravelTimeHours);
    var lightTimeSeconds = paMacros.decimalHoursSecond(lightTravelTimeHours);
    var posAngleBrightLimbDeg = paUtils.round(chiDeg, 1);
    var approximateMagnitude = paUtils.round(approximateMagnitude1, 1);

    return [distanceAU, angDiaArcsec, phase, lightTimeHour, lightTimeMinutes, lightTimeSeconds, posAngleBrightLimbDeg, approximateMagnitude];
}

module.exports = {
    approximatePositionOfPlanet,
    precisePositionOfPlanet,
    visualAspectsOfAPlanet
};