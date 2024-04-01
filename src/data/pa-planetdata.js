const planetNames = {
    mercury: "Mercury",
    venus: "Venus",
    earth: "Earth",
    mars: "Mars",
    jupiter: "Jupiter",
    saturn: "Saturn",
    uranus: "Uranus",
    neptune: "Neptune"
};

/**
 * Planet Data
 * 
 * Elements:
 *   0: Name
 *   1: tp_PeriodOrbit
 *   2: long_LongitudeEpoch
 *   3: peri_LongitudePerihelion
 *   4: ecc_EccentricityOrbit 
 *   5: axis_AxisOrbit 
 *   6: incl_OrbitalInclination 
 *   7: node_LongitudeAscendingNode 
 *   8: theta0_AngularDiameter 
 *   9: v0_VisualMagnitude 
 */
const planetData = [
    [planetNames.mercury, 0.24085, 75.5671, 77.612, 0.205627, 0.387098, 7.0051, 48.449, 6.74, -0.42],
    [planetNames.venus, 0.615207, 272.30044, 131.54, 0.006812, 0.723329, 3.3947, 76.769, 16.92, -4.4],
    [planetNames.earth, 0.999996, 99.556772, 103.2055, 0.016671, 0.999985, -99.0, -99.0, -99.0, -99.0],
    [planetNames.mars, 1.880765, 109.09646, 336.217, 0.093348, 1.523689, 1.8497, 49.632, 9.36, -1.52],
    [planetNames.jupiter, 11.857911, 337.917132, 14.6633, 0.048907, 5.20278, 1.3035, 100.595, 196.74, -9.4],
    [planetNames.saturn, 29.310579, 172.398316, 89.567, 0.053853, 9.51134, 2.4873, 113.752, 165.6, -8.88],
    [planetNames.uranus, 84.039492, 356.135400, 172.884833, 0.046321, 19.21814, 0.773059, 73.926961, 65.8, -7.19],
    [planetNames.neptune, 165.845392, 326.895127, 23.07, 0.010483, 30.1985, 1.7673, 131.879, 62.2, -6.87]
];

function getPlanetData(planetName) {
    let [planet_name, tp_PeriodOrbit, long_LongitudeEpoch, peri_LongitudePerihelion, ecc_EccentricityOrbit, axis_AxisOrbit, incl_OrbitalInclination, node_LongitudeAscendingNode, theta0_AngularDiameter, v0_VisualMagnitude] = ["not found", -99, -99, -99, -99, -99, -99, -99, -99, -99];

    for (let iLoop = 0; iLoop < planetData.length; iLoop++) {
        if (planetData[iLoop][0] == planetName) {
            planet_name = String(planetData[iLoop][0]);
            tp_PeriodOrbit = Number(planetData[iLoop][1]);
            long_LongitudeEpoch = Number(planetData[iLoop][2]);
            peri_LongitudePerihelion = Number(planetData[iLoop][3]);
            ecc_EccentricityOrbit = Number(planetData[iLoop][4]);
            axis_AxisOrbit = Number(planetData[iLoop][5]);
            incl_OrbitalInclination = Number(planetData[iLoop][6]);
            node_LongitudeAscendingNode = Number(planetData[iLoop][7]);
            theta0_AngularDiameter = Number(planetData[iLoop][8]);
            v0_VisualMagnitude = Number(planetData[iLoop][9]);

            break;
        }
    }

    return [planet_name, tp_PeriodOrbit, long_LongitudeEpoch, peri_LongitudePerihelion, ecc_EccentricityOrbit, axis_AxisOrbit, incl_OrbitalInclination, node_LongitudeAscendingNode, theta0_AngularDiameter, v0_VisualMagnitude];
};

module.exports = {
    planetNames,
    planetData,
    getPlanetData
}