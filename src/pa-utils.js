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

module.exports = {
    isLeapYear
};