/**
 * Angle measurement units
 */
const AngleMeasure = {
    Degrees: 'Degrees',
    Hours: 'Hours'
};

const CoordinateType = {
    True: 'True',
    Apparent: 'Apparent'
};

const RiseSetCalcStatus = {
    OK: 'OK',
    ConversionWarning: 'GST to UT conversion warning'
};

const RiseSetStatus = {
    OK: 'OK',
    NeverRises: 'NeverRises',
    Circumpolar: 'Circumpolar'
};

/**
 * Warning flags for calculation results
 */
const WarningFlag = {
    OK: 'OK',
    Warning: 'Warning'
};

module.exports = {
    AngleMeasure,
    CoordinateType,
    RiseSetCalcStatus,
    RiseSetStatus,
    WarningFlag
};