const paDateTime = require('../src/pa-datetime.js');
const paUtils = require('../src/pa-utils.js');

test('Calculate date of Easter', () => {
    let [month, day, year] = paDateTime.getDateOfEaster(2003);
    expect([month, day, year]).toStrictEqual([4, 20, 2003]);

    [month, day, year] = paDateTime.getDateOfEaster(2019);
    expect([month, day, year]).toStrictEqual([4, 21, 2019]);

    [month, day, year] = paDateTime.getDateOfEaster(2020);
    expect([month, day, year]).toStrictEqual([4, 12, 2020]);
});

test('Civil Date to Day Number', () => {
    expect(paDateTime.civilDateToDayNumber(1, 1, 2000)).toBe(1);

    expect(paDateTime.civilDateToDayNumber(3, 1, 2000)).toBe(61);

    expect(paDateTime.civilDateToDayNumber(6, 1, 2003)).toBe(152);

    expect(paDateTime.civilDateToDayNumber(11, 27, 2009)).toBe(331);
});

test('Civil Time to Decimal Hours', () => {
    expect(paUtils.round(paDateTime.civilTimeToDecimalHours(18, 31, 27), 8)).toBe(18.52416667);
});

test('Decimal Hours to Civil Time', () => {
    expect(paDateTime.decimalHoursToCivilTime(18.52416667)).toStrictEqual([18, 31, 27]);
});