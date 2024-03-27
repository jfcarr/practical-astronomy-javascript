/**
 * Determine if year is a leap year.
 */
function isLeapYear(inputYear) {
    year = inputYear;

    if (year % 4 == 0) {
        if (year % 100 == 0)
            return (year % 400 == 0) ? true : false;
        else
            return true;
    }
    else
        return false;
}

/**
 * Round a number (value) to specified number of decimal places (precision)
 */
function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);

    return Math.round(value * multiplier) / multiplier;
}

module.exports = {
    isLeapYear,
    round
};