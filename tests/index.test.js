const myMath = require('../src/index');

test('adds two numbers', () => {
    expect(myMath.add(2, 3)).toBe(5);
});

test('subtracts two numbers', () => {
    expect(myMath.subtract(8, 3)).toBe(5);
});