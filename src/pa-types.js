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

const TwilightStatus = {
    OK: 'OK',
    AllNight: 'Lasts all night',
    TooFarBelowHorizon: 'Sun too far below horizon',
    ConversionWarning: 'GST to UT conversion warning'
};

const TwilightType = {
    Civil: 6,
    Nautical: 12,
    Astronomical: 18
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
    TwilightStatus,
    TwilightType,
    WarningFlag
};