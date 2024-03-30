const paSun = require('../src/pa-sun.js');

test('Approximate Position of Sun', () => {
    expect(paSun.approximatePositionOfSun(0, 0, 0, 27, 7, 2003, false, 0)).toStrictEqual([8, 23, 33.73, 19, 21, 14.33]);
});

test('Precise Position of Sun', () => {
    expect(paSun.precisePositionOfSun(0, 0, 0, 27, 7, 1988, false, 0)).toStrictEqual([8, 26, 3.83, 19, 12, 49.72]);
});

test('Sun Distance and Angular Size', () => {
    expect(paSun.sunDistanceAndAngularSize(0, 0, 0, 27, 7, 1988, false, 0)).toStrictEqual([151920130, 0, 31, 29.93]);
});