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

/**
 * Calculate the circumstances of a lunar eclipse.
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

/**
 * Determine if a solar eclipse is likely to occur.
 */
function solarEclipseOccurrence(localDateDay, localDateMonth, localDateYear, isDaylightSaving, zoneCorrectionHours) {
    var daylightSaving = (isDaylightSaving) ? 1 : 0;

    var julianDateOfNewMoon = paMacros.newMoon(daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);
    var gDateOfNewMoonDay = paMacros.julianDateDay(julianDateOfNewMoon);
    var integerDay = Math.floor(gDateOfNewMoonDay);
    var gDateOfNewMoonMonth = paMacros.julianDateMonth(julianDateOfNewMoon);
    var gDateOfNewMoonYear = paMacros.julianDateYear(julianDateOfNewMoon);
    var utOfNewMoonHours = gDateOfNewMoonDay - integerDay;

    var localCivilDateDay = paMacros.universalTime_LocalCivilDay(utOfNewMoonHours, 0.0, 0.0, daylightSaving, zoneCorrectionHours, integerDay, gDateOfNewMoonMonth, gDateOfNewMoonYear);
    var localCivilDateMonth = paMacros.universalTime_LocalCivilMonth(utOfNewMoonHours, 0.0, 0.0, daylightSaving, zoneCorrectionHours, integerDay, gDateOfNewMoonMonth, gDateOfNewMoonYear);
    var localCivilDateYear = paMacros.universalTime_LocalCivilYear(utOfNewMoonHours, 0.0, 0.0, daylightSaving, zoneCorrectionHours, integerDay, gDateOfNewMoonMonth, gDateOfNewMoonYear);

    var eclipseOccurrence = paMacros.solarEclipseOccurrence(daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);

    var status = eclipseOccurrence;
    var eventDateDay = localCivilDateDay;
    var eventDateMonth = localCivilDateMonth;
    var eventDateYear = localCivilDateYear;

    return [status, eventDateDay, eventDateMonth, eventDateYear];
}

/**
   * Calculate the circumstances of a solar eclipse.
 */
function solarEclipseCircumstances(localDateDay, localDateMonth, localDateYear, isDaylightSaving, zoneCorrectionHours, geogLongitudeDeg, geogLatitudeDeg) {
    var daylightSaving = (isDaylightSaving) ? 1 : 0;

    var julianDateOfNewMoon = paMacros.newMoon(daylightSaving, zoneCorrectionHours, localDateDay, localDateMonth, localDateYear);
    var gDateOfNewMoonDay = paMacros.julianDateDay(julianDateOfNewMoon);
    var integerDay = Math.floor(gDateOfNewMoonDay);
    var gDateOfNewMoonMonth = paMacros.julianDateMonth(julianDateOfNewMoon);
    var gDateOfNewMoonYear = paMacros.julianDateYear(julianDateOfNewMoon);
    var utOfNewMoonHours = gDateOfNewMoonDay - integerDay;
    var localCivilDateDay = paMacros.universalTime_LocalCivilDay(utOfNewMoonHours, 0.0, 0.0, daylightSaving, zoneCorrectionHours, integerDay, gDateOfNewMoonMonth, gDateOfNewMoonYear);
    var localCivilDateMonth = paMacros.universalTime_LocalCivilMonth(utOfNewMoonHours, 0.0, 0.0, daylightSaving, zoneCorrectionHours, integerDay, gDateOfNewMoonMonth, gDateOfNewMoonYear);
    var localCivilDateYear = paMacros.universalTime_LocalCivilYear(utOfNewMoonHours, 0.0, 0.0, daylightSaving, zoneCorrectionHours, integerDay, gDateOfNewMoonMonth, gDateOfNewMoonYear);

    var utMaxEclipse = paMacros.utMaxSolarEclipse(localDateDay, localDateMonth, localDateYear, daylightSaving, zoneCorrectionHours, geogLongitudeDeg, geogLatitudeDeg);
    var utFirstContact = paMacros.utFirstContactSolarEclipse(localDateDay, localDateMonth, localDateYear, daylightSaving, zoneCorrectionHours, geogLongitudeDeg, geogLatitudeDeg);
    var utLastContact = paMacros.utLastContactSolarEclipse(localDateDay, localDateMonth, localDateYear, daylightSaving, zoneCorrectionHours, geogLongitudeDeg, geogLatitudeDeg);
    var magnitude = paMacros.magSolarEclipse(localDateDay, localDateMonth, localDateYear, daylightSaving, zoneCorrectionHours, geogLongitudeDeg, geogLatitudeDeg);

    var solarEclipseCertainDateDay = localCivilDateDay;
    var solarEclipseCertainDateMonth = localCivilDateMonth;
    var solarEclipseCertainDateYear = localCivilDateYear;

    var utFirstContactHour = (utFirstContact == -99.0) ? -99.0 : paMacros.decimalHoursHour(utFirstContact + 0.008333);
    var utFirstContactMinutes = (utFirstContact == -99.0) ? -99.0 : paMacros.decimalHoursMinute(utFirstContact + 0.008333);

    var utMidEclipseHour = (utMaxEclipse == -99.0) ? -99.0 : paMacros.decimalHoursHour(utMaxEclipse + 0.008333);
    var utMidEclipseMinutes = (utMaxEclipse == -99.0) ? -99.0 : paMacros.decimalHoursMinute(utMaxEclipse + 0.008333);

    var utLastContactHour = (utLastContact == -99.0) ? -99.0 : paMacros.decimalHoursHour(utLastContact + 0.008333);
    var utLastContactMinutes = (utLastContact == -99.0) ? -99.0 : paMacros.decimalHoursMinute(utLastContact + 0.008333);

    var eclipseMagnitude = (magnitude == -99.0) ? -99.0 : paUtils.round(magnitude, 3);

    return [solarEclipseCertainDateDay, solarEclipseCertainDateMonth, solarEclipseCertainDateYear, utFirstContactHour, utFirstContactMinutes, utMidEclipseHour, utMidEclipseMinutes, utLastContactHour, utLastContactMinutes, eclipseMagnitude];
}


module.exports = {
    lunarEclipseOccurrence,
    lunarEclipseCircumstances,
    solarEclipseOccurrence,
    solarEclipseCircumstances
};