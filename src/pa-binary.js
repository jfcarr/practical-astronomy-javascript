const paBinaryData = require("./data/pa-binarydata");
const paMacros = require('./pa-macros.js');
const paUtils = require('./pa-utils.js');

/**
 * Calculate orbital data for binary star.
 */
function binaryStarOrbit(greenwichDateDay, greenwichDateMonth, greenwichDateYear, binaryName) {
    var [binary_name, period, epochPeri, longPeri, ecc, axis, incl, paNode] = paBinaryData.getBinaryData(binaryName);

    var yYears = (greenwichDateYear + (paMacros.civilDateToJulianDate(greenwichDateDay, greenwichDateMonth, greenwichDateYear) - paMacros.civilDateToJulianDate(0, 1, greenwichDateYear)) / 365.242191) - Number(epochPeri);
    var mDeg = 360 * yYears / Number(period);
    var mRad = paUtils.degreesToRadians(mDeg - 360 * Math.floor(mDeg / 360));
    var eccentricity = Number(ecc);
    var trueAnomalyRad = paMacros.trueAnomaly(mRad, eccentricity);
    var rArcsec = (1 - eccentricity * Math.cos(paMacros.eccentricAnomaly(mRad, eccentricity))) * Number(axis);
    var taPeriRad = trueAnomalyRad + paUtils.degreesToRadians(Number(longPeri));

    var y = Math.sin(taPeriRad) * Math.cos(paUtils.degreesToRadians(Number(incl)));
    var x = Math.cos(taPeriRad);
    var aDeg = paMacros.degrees(Math.atan2(y, x));
    var thetaDeg1 = aDeg + Number(paNode);
    var thetaDeg2 = thetaDeg1 - 360 * Math.floor(thetaDeg1 / 360);
    var rhoArcsec = rArcsec * Math.cos(taPeriRad) / Math.cos(paUtils.degreesToRadians(thetaDeg2 - Number(paNode)));

    var positionAngleDeg = paUtils.round(thetaDeg2, 1);
    var separationArcsec = paUtils.round(rhoArcsec, 2);

    return [positionAngleDeg, separationArcsec];
}


module.exports = {
    binaryStarOrbit
};