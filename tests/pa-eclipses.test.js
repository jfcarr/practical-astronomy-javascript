const paEclipses = require('../src/pa-eclipses.js');
const paTypes = require('../src/pa-types.js');

test('Lunar Eclipse Occurrence', () => {
    expect(paEclipses.lunarEclipseOccurrence(1, 4, 2015, false, 10)).toStrictEqual([paTypes.LunarEclipseOccurrence.Certain, 4, 4, 2015]);
});

test('Lunar Eclipse Circumstances', () => {
    expect(paEclipses.lunarEclipseCircumstances(1, 4, 2015, false, 10)).toStrictEqual([4, 4, 2015, 9, 0, 10, 16, 11, 55, 12, 1, 12, 7, 13, 46, 15, 1, 1.01]);
});