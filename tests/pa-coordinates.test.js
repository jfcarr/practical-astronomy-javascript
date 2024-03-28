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

test('Mean Obliquity of the Ecliptic', () => {
    expect(paUtils.round(paCoord.meanObliquityOfTheEcliptic(6, 7, 2009), 8)).toBe(23.43805531);
});

test('Ecliptic Coordinate to Equatorial Coordinate', () => {
    expect(paCoord.eclipticCoordinateToEquatorialCoordinate(139, 41, 10, 4, 52, 31, 6, 7, 2009)).toStrictEqual([9, 34, 53.4, 19, 32, 8.52]);
});

test('Equatorial Coordinate to Ecliptic Coordinate', () => {
    expect(paCoord.equatorialCoordinateToEclipticCoordinate(9, 34, 53.4, 19, 32, 8.52, 6, 7, 2009)).toStrictEqual([139, 41, 9.97, 4, 52, 30.99]);
});

test('Equatorial Coordinate to Galactic Coordinate', () => {
    expect(paCoord.equatorialCoordinateToGalacticCoordinate(10, 21, 0, 10, 3, 11)).toStrictEqual([232, 14, 52.38, 51, 7, 20.16]);
});

test('Galactic Coordinate to Equatorial Coordinate', () => {
    expect(paCoord.galacticCoordinateToEquatorialCoordinate(232, 14, 52.38, 51, 7, 20.16)).toStrictEqual([10, 21, 0, 10, 3, 11]);
});