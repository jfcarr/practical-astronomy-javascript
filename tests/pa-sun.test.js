const paSun = require('../src/pa-sun.js');
const paTypes = require('../src/pa-types.js');

test('Approximate Position of Sun', () => {
    expect(paSun.approximatePositionOfSun(0, 0, 0, 27, 7, 2003, false, 0)).toStrictEqual([8, 23, 33.73, 19, 21, 14.33]);
});

test('Precise Position of Sun', () => {
    expect(paSun.precisePositionOfSun(0, 0, 0, 27, 7, 1988, false, 0)).toStrictEqual([8, 26, 3.83, 19, 12, 49.72]);
});

test('Sun Distance and Angular Size', () => {
    expect(paSun.sunDistanceAndAngularSize(0, 0, 0, 27, 7, 1988, false, 0)).toStrictEqual([151920130, 0, 31, 29.93]);
});

test('Sunrise and Sunset', () => {
    expect(paSun.sunriseAndSunset(10, 3, 1986, false, -5, -71.05, 42.37)).toStrictEqual([6, 5, 17, 45, 94.83, 265.43, paTypes.RiseSetCalcStatus.OK]);
});

test('Morning and Evening Twilight', () => {
    expect(paSun.morningAndEveningTwilight(7, 9, 1979, false, 0, 0, 52, paTypes.TwilightType.Astronomical)).toStrictEqual([3, 17, 20, 37, paTypes.TwilightStatus.OK]);
});

test('Equation of Time', () => {
    expect(paSun.equationOfTime(27, 7, 2010)).toStrictEqual([6, 31.52]);
});

test('Solar Elongation', () => {
    expect(paSun.solarElongation(10, 6, 45, 11, 57, 27, 27.8333333, 7, 2010)).toBe(24.78);
});