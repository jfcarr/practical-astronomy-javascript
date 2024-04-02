const paMoon = require('../src/pa-moon.js');
const paTypes = require('../src/pa-types.js');

test('Approximate Position of Moon', () => {
    expect(paMoon.approximatePositionOfMoon(0, 0, 0, false, 0, 1, 9, 2003)).toStrictEqual([14, 12, 42.31, -11, 31, 38.27]);
});

test('Precise Position of Moon', () => {
    expect(paMoon.precisePositionOfMoon(0, 0, 0, false, 0, 1, 9, 2003)).toStrictEqual([14, 12, 10.21, -11, 34, 57.83, 367964, 0.993191]);
});

test('Moon Phase', () => {
    expect(paMoon.moonPhase(0, 0, 0, false, 0, 1, 9, 2003, paTypes.AccuracyLevel.Approximate)).toStrictEqual([0.22, -71.58]);
});

test('Times of New Moon and Full Moon', () => {
    expect(paMoon.timesOfNewMoonAndFullMoon(false, 0, 1, 9, 2003)).toStrictEqual([17, 27, 27, 8, 2003, 16, 36, 10, 9, 2003]);
});