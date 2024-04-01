const paBinary = require('../src/pa-binary.js');
const paBinaryData = require('../src/data/pa-binarydata.js');

test('Binary Star Orbit', () => {
    expect(paBinary.binaryStarOrbit(1, 1, 1980, paBinaryData.binaryStarNames.etaCor)).toStrictEqual([318.5, 0.41]);
});