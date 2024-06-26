# Practical Astronomy - JavaScript (practical-astronomy-javascript)

Algorithms from "[Practical Astronomy with your Calculator or Spreadsheet](https://www.amazon.com/Practical-Astronomy-your-Calculator-Spreadsheet/dp/1108436072)" by Peter Duffett-Smith, implemented in JavaScript.

If you're interested in this topic, please buy the book! It provides far more detail and context.

## Installation

```bash
npm install practical-astronomy-javascript
```

## Usage

### Example 1: Calculate date of Easter for 2024.

Create client.js:

```javascript
const pa = require('practical-astronomy-javascript');

console.log(pa.paDateTime.getDateOfEaster(2024));
```

Run it:

```bash
node client.js
```

Result:

```
[ 3, 31, 2024 ]
```

### Example 2: Get detailed information about the April 8 solar eclipse, for West Alexandria, Ohio

Create client.js:

```javascript
const pa = require('practical-astronomy-javascript');

// Information about the observer location
var monthOfObservation = 4;
var dayOfObservation = 8;
var yearOfObservation = 2024;
var isDaylightSavings = true;
var zoneCorrectionHours = 5;
var observerLatitude = 39.74722;
var observerLongitude = -84.53639;

var [solarEclipseCertainDateDay, solarEclipseCertainDateMonth, solarEclipseCertainDateYear, utFirstContactHour, utFirstContactMinutes, utMidEclipseHour, utMidEclipseMinutes, utLastContactHour, utLastContactMinutes, eclipseMagnitude] = pa.paEclipses.solarEclipseCircumstances(dayOfObservation, monthOfObservation, yearOfObservation, isDaylightSavings, zoneCorrectionHours, observerLongitude, observerLatitude);

// Results are in universal time, so adjust them for the observer's time zone
utFirstContactHour = utFirstContactHour - ((isDaylightSavings) ? zoneCorrectionHours - 1 : zoneCorrectionHours);
utMidEclipseHour = utMidEclipseHour - ((isDaylightSavings) ? zoneCorrectionHours - 1 : zoneCorrectionHours);
utLastContactHour = utLastContactHour - ((isDaylightSavings) ? zoneCorrectionHours - 1 : zoneCorrectionHours);

console.log(`Date of eclipse:        ${solarEclipseCertainDateMonth}/${solarEclipseCertainDateDay}/${solarEclipseCertainDateYear}`);
console.log(`First contact:          ${utFirstContactHour}:${utFirstContactMinutes}`);
console.log(`Mid-eclipse (totality): ${utMidEclipseHour}:${utMidEclipseMinutes}`);
console.log(`Last contact:           ${utLastContactHour}:${utLastContactMinutes}`);
console.log(`Magnitude of eclipse:   ${eclipseMagnitude}`);
```

Run it:

```bash
node client.js
```

Result:

```
Date of eclipse:        4/8/2024
First contact:          13:55
Mid-eclipse (totality): 15:11
Last contact:           16:27
Magnitude of eclipse:   1.006
```

## Links

[GitHub](https://github.com/jfcarr/practical-astronomy-javascript)

[Documentation](https://jfcarr.github.io/practical-astronomy-javascript/)

[NPM page](https://www.npmjs.com/package/practical-astronomy-javascript)

## Library Functions - Status

### Date/Time

- [x] Calculate -> Date of Easter
- [x] Convert -> Civil Date to Day Number
- [x] Convert -> Civil Time <-> Decimal Hours
- [x] Extract -> Hour, Minutes, and Seconds parts of Decimal Hours
- [x] Convert -> Local Civil Time <-> Universal Time
- [x] Convert -> Universal Time <-> Greenwich Sidereal Time
- [x] Convert -> Greenwich Sidereal Time <-> Local Sidereal Time

### Coordinates

- [x] Convert -> Angle <-> Decimal Degrees
- [x] Convert -> Right Ascension <-> Hour Angle
- [x] Convert -> Equatorial Coordinates <-> Horizon Coordinates
- [x] Calculate -> Obliquity of the Ecliptic
- [x] Convert -> Ecliptic Coordinates <-> Equatorial Coordinates
- [x] Convert -> Equatorial Coordinates <-> Galactic Coordinates
- [x] Calculate -> Angle between two objects
- [x] Calculate -> Rising and Setting times for an object
- [x] Calculate -> Precession (corrected coordinates between two epochs)
- [x] Calculate -> Nutation (in ecliptic longitude and obliquity) for a Greenwich date
- [x] Calculate -> Effects of aberration for ecliptic coordinates
- [x] Calculate -> RA and Declination values, corrected for atmospheric refraction
- [x] Calculate -> RA and Declination values, corrected for geocentric parallax
- [x] Calculate -> Heliographic coordinates
- [x] Calculate -> Carrington rotation number
- [x] Calculate -> Selenographic (lunar) coordinates (sub-Earth and sub-Solar)

### The Sun

- [x] Calculate -> Approximate and precise positions of the Sun
- [x] Calculate -> Sun's distance and angular size
- [x] Calculate -> Local sunrise and sunset
- [x] Calculate -> Morning and evening twilight
- [x] Calculate -> Equation of time
- [x] Calculate -> Solar elongation

### Planets

- [x] Calculate -> Approximate position of planet
- [x] Calculate -> Precise position of planet
- [x] Calculate -> Visual aspects of planet (distance, angular diameter, phase, light time, position angle of bright limb, and apparent magnitude)

### Comets

- [x] Calculate -> Position of comet (elliptical)
- [x] Calculate -> Position of comet (parabolic)

### Binary Stars

- [x] Calculate -> Binary star orbit data

### The Moon

- [x] Calculate -> Approximate and precise position of Moon
- [x] Calculate -> Moon phase and position angle of bright limb
- [x] Calculate -> Times of new Moon and full Moon
- [x] Calculate -> Moon's distance, angular diameter, and horizontal parallax
- [x] Calculate -> Local moonrise and moonset

### Eclipses

- [x] Calculate -> Lunar eclipse occurrence and circumstances
- [x] Calculate -> Solar eclipse occurrence and circumstances
