const paPlanet = require('../src/pa-planet.js');
const paPlanetData = require('../src/data/pa-planetdata.js');

test('Approximate Position of Planet', () => {
    expect(paPlanet.approximatePositionOfPlanet(0, 0, 0, false, 0, 22, 11, 2003, paPlanetData.planetNames.jupiter)).toStrictEqual([11, 11, 13.8, 6, 21, 25.1]);
});

test('Precise Position of Planet', () => {
    expect(paPlanet.precisePositionOfPlanet(0, 0, 0, false, 0, 22, 11, 2003, paPlanetData.planetNames.jupiter)).toStrictEqual([11, 10, 30.99, 6, 25, 49.46]);
});

test('Visual Aspects of a Planet', () => {
    expect(paPlanet.visualAspectsOfAPlanet(0, 0, 0, false, 0, 22, 11, 2003, paPlanetData.planetNames.jupiter)).toStrictEqual([5.59829, 35.1, 0.99, 0, 46, 33.32, 113.2, -2.0]);
});