const paCoord = require('../src/pa-coordinates.js');
const paUtils = require('../src/pa-utils.js');

test('Angle to Decimal Degrees', () => {
    expect(paUtils.round(paCoord.angleToDecimalDegrees(182, 31, 27), 6)).toBe(182.524167);
});

test('Decimal Degrees to Angle', () => {
    expect(paCoord.decimalDegreesToAngle(182.524167)).toStrictEqual([182, 31, 27]);
});

test('Right Ascension to Hour Angle', () => {
    expect(paCoord.rightAscensionToHourAngle(18, 32, 21, 14, 36, 51.67, false, -4, 22, 4, 1980, -64)).toStrictEqual([9, 52, 23.66]);
});

test('Hour Angle to Right Ascension', () => {
    expect(paCoord.hourAngleToRightAscension(9, 52, 23.66, 14, 36, 51.67, false, -4, 22, 4, 1980, -64)).toStrictEqual([18, 32, 21]);
});

test('Equatorial Coordinates to Horizon Coordinates', () => {
    expect(paCoord.equatorialCoordinatesToHorizonCoordinates(5, 51, 44, 23, 13, 10, 52)).toStrictEqual([283, 16, 15.7, 19, 20, 3.64]);
});

test('Horizon Coordinates to Equatorial Coordinates', () => {
    expect(paCoord.horizonCoordinatesToEquatorialCoordinates(283, 16, 15.7, 19, 20, 3.64, 52)).toStrictEqual([5, 51, 44, 23, 13, 10]);
});