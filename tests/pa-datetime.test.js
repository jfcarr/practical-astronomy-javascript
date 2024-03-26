const paDateTime = require('../src/pa-datetime.js');

test('Calculate date of Easter', () => {
    let [month, day, year] = paDateTime.getDateOfEaster(2003);

    expect(month).toBe(4);
    expect(day).toBe(20);
    expect(year).toBe(2003);

    [month, day, year] = paDateTime.getDateOfEaster(2019);

    expect(month).toBe(4);
    expect(day).toBe(21);
    expect(year).toBe(2019);

    [month, day, year] = paDateTime.getDateOfEaster(2020);

    expect(month).toBe(4);
    expect(day).toBe(12);
    expect(year).toBe(2020);
});
