const paCoord = require('../src/pa-coordinates.js');
const paUtils = require('../src/pa-utils.js');

test('Angle to Decimal Degrees', () => {
    expect(paUtils.round(paCoord.angleToDecimalDegrees(182, 31, 27), 6)).toBe(182.524167);
});

test('Decimal Degrees to Angle', () => {
    expect(paCoord.decimalDegreesToAngle(182.524167)).toStrictEqual([182, 31, 27]);
});