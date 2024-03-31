const paPlanet = require('../src/pa-planet.js');

test('Approximate Position of Planet', () => {
    expect(paPlanet.approximatePositionOfPlanet(0, 0, 0, false, 0, 22, 11, 2003, "Jupiter")).toStrictEqual([11, 11, 13.8, 6, 21, 25.1]);
});

test('Precise Position of Planet', () => {
    expect(paPlanet.precisePositionOfPlanet(0, 0, 0, false, 0, 22, 11, 2003, "Jupiter")).toStrictEqual([11, 10, 30.99, 6, 25, 49.46]);
});