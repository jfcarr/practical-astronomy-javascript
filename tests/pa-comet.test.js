const paComet = require('../src/pa-comet.js');

test('Position of an Elliptical Comet', () => {
    expect(paComet.positionOfEllipticalComet(0, 0, 0, false, 0, 1, 1, 1984, "Halley")).toStrictEqual([6, 29, 10, 13, 8.13]);
});

test('Position of Parabolic Comet', () => {
    expect(paComet.positionOfParabolicComet(0, 0, 0, false, 0, 25, 12, 1977, "Kohler")).toStrictEqual([23, 17, 11.53, -33, 42, 26.42, 1.11]);
});