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

test('Moon distance, angular diameter, and horizontal parallax', () => {
    expect(paMoon.moonDistAngDiamHorParallax(0, 0, 0, false, 0, 1, 9, 2003)).toStrictEqual([367964, 0, 32, 0, 59, 35.49]);
});

test('Moonrise and Moonset', () => {
    expect(paMoon.moonriseAndMoonset(6, 3, 1986, false, -5, -71.05, 42.3667)).toStrictEqual([4, 21, 6, 3, 1986, 127.34, 13, 8, 6, 3, 1986, 234.05]);
})