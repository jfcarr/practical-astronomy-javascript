const paMacros = require('./pa-macros.js');
const paTypes = require('./pa-types.js');
const paUtils = require('./pa-utils.js');

/**
 * Determine if a lunar eclipse is likely to occur.
 */
function lunarEclipseOccurrence(localDateDay, localDateMonth, localDateYear, isDaylightSaving, zoneCorrectionHours) {
    var daylightSaving = (isDaylightSaving) ? 1 : 0;

    var julianDateOfFullMoon = paMacros.fullMoon(daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);

    var gDateOfFullMoonDay = paMacros.julianDateDay(julianDateOfFullMoon);
    var integerDay = Math.floor(gDateOfFullMoonDay);
    var gDateOfFullMoonMonth = paMacros.julianDateMonth(julianDateOfFullMoon);
    var gDateOfFullMoonYear = paMacros.julianDateYear(julianDateOfFullMoon);
    var utOfFullMoonHours = gDateOfFullMoonDay - integerDay;

    var localCivilDateDay = paMacros.universalTime_LocalCivilDay(utOfFullMoonHours, 0.0, 0.0, daylightSaving, zoneCorrectionHours, integerDay, gDateOfFullMoonMonth, gDateOfFullMoonYear);
    var localCivilDateMonth = paMacros.universalTime_LocalCivilMonth(utOfFullMoonHours, 0.0, 0.0, daylightSaving, zoneCorrectionHours, integerDay, gDateOfFullMoonMonth, gDateOfFullMoonYear);
    var localCivilDateYear = paMacros.universalTime_LocalCivilYear(utOfFullMoonHours, 0.0, 0.0, daylightSaving, zoneCorrectionHours, integerDay, gDateOfFullMoonMonth, gDateOfFullMoonYear);

    var eclipseOccurrence = paMacros.lunarEclipseOccurrence(daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);

    var status = eclipseOccurrence;
    var eventDateDay = localCivilDateDay;
    var eventDateMonth = localCivilDateMonth;
    var eventDateYear = localCivilDateYear;

    return [status, eventDateDay, eventDateMonth, eventDateYear];
}

/// <summary>
/// </summary>
/// <returns>
/// </returns>
/**
 * Calculate the circumstances of a lunar eclipse.
 *
 * @param {*} localDateDay 
 * @param {*} localDateMonth 
 * @param {*} localDateYear 
 * @param {*} isDaylightSaving 
 * @param {*} zoneCorrectionHours 
 * @returns 
 * lunarEclipseCertainDateDay -- Lunar eclipse date (day)
 * lunarEclipseCertainDateMonth -- Lunar eclipse date (month)
 * lunarEclipseCertainDateYear -- Lunar eclipse date (year)
 * utstartPenPhaseHour -- Start of penumbral phase (hour)
 * utStartPenPhaseMinutes -- Start of penumbral phase (minutes)
 * utStartUmbralPhaseHour -- Start of umbral phase (hour)
 * utStartUmbralPhaseMinutes -- Start of umbral phase (minutes)
 * utStartTotalPhaseHour -- Start of total phase (hour)
 * utStartTotalPhaseMinutes -- Start of total phase (minutes)
 * utMidEclipseHour -- Mid-eclipse (hour)
 * utMidEclipseMinutes -- Mid-eclipse (minutes)
 * utEndTotalPhaseHour -- End of total phase (hour)
 * utEndTotalPhaseMinutes -- End of total phase (minutes)
 * utEndUmbralPhaseHour -- End of umbral phase (hour)
 * utEndUmbralPhaseMinutes -- End of umbral phase (minutes)
 * utEndPenPhaseHour -- End of penumbral phase (hour)
 * utEndPenPhaseMinutes -- End of penumbral phase (minutes)
 * eclipseMagnitude -- Eclipse magnitude
 */
function lunarEclipseCircumstances(localDateDay, localDateMonth, localDateYear, isDaylightSaving, zoneCorrectionHours) {
    var daylightSaving = (isDaylightSaving) ? 1 : 0;

    var julianDateOfFullMoon = paMacros.fullMoon(daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);
    var gDateOfFullMoonDay = paMacros.julianDateDay(julianDateOfFullMoon);
    var integerDay = Math.floor(gDateOfFullMoonDay);
    var gDateOfFullMoonMonth = paMacros.julianDateMonth(julianDateOfFullMoon);
    var gDateOfFullMoonYear = paMacros.julianDateYear(julianDateOfFullMoon);
    var utOfFullMoonHours = gDateOfFullMoonDay - integerDay;

    var localCivilDateDay = paMacros.universalTime_LocalCivilDay(utOfFullMoonHours, 0.0, 0.0, daylightSaving, zoneCorrectionHours, integerDay, gDateOfFullMoonMonth, gDateOfFullMoonYear);
    var localCivilDateMonth = paMacros.universalTime_LocalCivilMonth(utOfFullMoonHours, 0.0, 0.0, daylightSaving, zoneCorrectionHours, integerDay, gDateOfFullMoonMonth, gDateOfFullMoonYear);
    var localCivilDateYear = paMacros.universalTime_LocalCivilYear(utOfFullMoonHours, 0.0, 0.0, daylightSaving, zoneCorrectionHours, integerDay, gDateOfFullMoonMonth, gDateOfFullMoonYear);

    var utMaxEclipse = paMacros.utMaxLunarEclipse(localDateDay, localDateMonth, localDateYear, daylightSaving, zoneCorrectionHours);
    var utFirstContact = paMacros.utFirstContactLunarEclipse(localDateDay, localDateMonth, localDateYear, daylightSaving, zoneCorrectionHours);
    var utLastContact = paMacros.utLastContactLunarEclipse(localDateDay, localDateMonth, localDateYear, daylightSaving, zoneCorrectionHours);
    var utStartUmbralPhase = paMacros.utStartUmbraLunarEclipse(localDateDay, localDateMonth, localDateYear, daylightSaving, zoneCorrectionHours);
    var utEndUmbralPhase = paMacros.utEndUmbraLunarEclipse(localDateDay, localDateMonth, localDateYear, daylightSaving, zoneCorrectionHours);
    var utStartTotalPhase = paMacros.utStartTotalLunarEclipse(localDateDay, localDateMonth, localDateYear, daylightSaving, zoneCorrectionHours);
    var utEndTotalPhase = paMacros.utEndTotalLunarEclipse(localDateDay, localDateMonth, localDateYear, daylightSaving, zoneCorrectionHours);

    var eclipseMagnitude1 = paMacros.magLunarEclipse(localDateDay, localDateMonth, localDateYear, daylightSaving, zoneCorrectionHours);

    var lunarEclipseCertainDateDay = localCivilDateDay;
    var lunarEclipseCertainDateMonth = localCivilDateMonth;
    var lunarEclipseCertainDateYear = localCivilDateYear;

    var utStartPenPhaseHour = (utFirstContact == -99.0) ? -99.0 : paMacros.decimalHoursHour(utFirstContact + 0.008333);
    var utStartPenPhaseMinutes = (utFirstContact == -99.0) ? -99.0 : paMacros.decimalHoursMinute(utFirstContact + 0.008333);

    var utStartUmbralPhaseHour = (utStartUmbralPhase == -99.0) ? -99.0 : paMacros.decimalHoursHour(utStartUmbralPhase + 0.008333);
    var utStartUmbralPhaseMinutes = (utStartUmbralPhase == -99.0) ? -99.0 : paMacros.decimalHoursMinute(utStartUmbralPhase + 0.008333);

    var utStartTotalPhaseHour = (utStartTotalPhase == -99.0) ? -99.0 : paMacros.decimalHoursHour(utStartTotalPhase + 0.008333);
    var utStartTotalPhaseMinutes = (utStartTotalPhase == -99.0) ? -99.0 : paMacros.decimalHoursMinute(utStartTotalPhase + 0.008333);

    var utMidEclipseHour = (utMaxEclipse == -99.0) ? -99.0 : paMacros.decimalHoursHour(utMaxEclipse + 0.008333);
    var utMidEclipseMinutes = (utMaxEclipse == -99.0) ? -99.0 : paMacros.decimalHoursMinute(utMaxEclipse + 0.008333);

    var utEndTotalPhaseHour = (utEndTotalPhase == -99.0) ? -99.0 : paMacros.decimalHoursHour(utEndTotalPhase + 0.008333);
    var utEndTotalPhaseMinutes = (utEndTotalPhase == -99.0) ? -99.0 : paMacros.decimalHoursMinute(utEndTotalPhase + 0.008333);

    var utEndUmbralPhaseHour = (utEndUmbralPhase == -99.0) ? -99.0 : paMacros.decimalHoursHour(utEndUmbralPhase + 0.008333);
    var utEndUmbralPhaseMinutes = (utEndUmbralPhase == -99.0) ? -99.0 : paMacros.decimalHoursMinute(utEndUmbralPhase + 0.008333);

    var utEndPenPhaseHour = (utLastContact == -99.0) ? -99.0 : paMacros.decimalHoursHour(utLastContact + 0.008333);
    var utEndPenPhaseMinutes = (utLastContact == -99.0) ? -99.0 : paMacros.decimalHoursMinute(utLastContact + 0.008333);

    var eclipseMagnitude = (eclipseMagnitude1 == -99.0) ? -99.0 : paUtils.round(eclipseMagnitude1, 2);

    return [lunarEclipseCertainDateDay, lunarEclipseCertainDateMonth, lunarEclipseCertainDateYear, utStartPenPhaseHour, utStartPenPhaseMinutes, utStartUmbralPhaseHour, utStartUmbralPhaseMinutes, utStartTotalPhaseHour, utStartTotalPhaseMinutes, utMidEclipseHour, utMidEclipseMinutes, utEndTotalPhaseHour, utEndTotalPhaseMinutes, utEndUmbralPhaseHour, utEndUmbralPhaseMinutes, utEndPenPhaseHour, utEndPenPhaseMinutes, eclipseMagnitude];
}


module.exports = {
    lunarEclipseOccurrence,
    lunarEclipseCircumstances
};