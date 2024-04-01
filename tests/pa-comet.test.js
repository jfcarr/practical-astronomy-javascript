const paComet = require('../src/pa-comet.js');

test('Calculate Position of an Elliptical Comet', () => {
    expect(paComet.positionOfEllipticalComet(0, 0, 0, false, 0, 1, 1, 1984, "Halley")).toStrictEqual([6, 29, 10, 13, 8.13]);
});