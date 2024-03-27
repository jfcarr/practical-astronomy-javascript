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

module.exports = {
    angleToDecimalDegrees,
    decimalDegreesToAngle
};