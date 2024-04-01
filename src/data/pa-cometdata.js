/**
 * Comet Elliptical Data
 * 
 * Elements:
 *   0: Name
 *   1: epoch_EpochOfPerihelion
 *   2: peri_LongitudeOfPerihelion
 *   3: node_LongitudeOfAscendingNode
 *   4: period_PeriodOfOrbit
 *   5: axis_SemiMajorAxisOfOrbit
 *   6: ecc_EccentricityOfOrbit
 *   7: incl_InclinationOfOrbit
 */
const cometEllipticalData = [
    ["Encke", 1974.32, 160.1, 334.2, 3.3, 2.21, 0.85, 12.0],
    ["Temple 2", 1972.87, 310.2, 119.3, 5.26, 3.02, 0.55, 12.5],
    ["Haneda-Campos", 1978.77, 12.02, 131.7, 5.37, 3.07, 0.64, 5.81],
    ["Schwassmann-Wachmann 2", 1974.7, 123.3, 126.0, 6.51, 3.49, 0.39, 3.7],
    ["Borrelly", 1974.36, 67.8, 75.1, 6.76, 3.58, 0.63, 30.2],
    ["Whipple", 1970.77, 18.2, 188.4, 7.47, 3.82, 0.35, 10.2],
    ["Oterma", 1958.44, 150.0, 155.1, 7.88, 3.96, 0.14, 4.0],
    ["Schaumasse", 1960.29, 138.1, 86.2, 8.18, 4.05, 0.71, 12.0],
    ["Comas Sola", 1969.83, 102.9, 62.8, 8.55, 4.18, 0.58, 13.4],
    ["Schwassmann-Wachmann 1", 1974.12, 334.1, 319.6, 15.03, 6.09, 0.11, 9.7],
    ["Neujmin 1", 1966.94, 334.0, 347.2, 17.93, 6.86, 0.78, 15.0],
    ["Crommelin", 1956.82, 86.4, 250.4, 27.89, 9.17, 0.92, 28.9],
    ["Olbers", 1956.46, 150.0, 85.4, 69.47, 16.84, 0.93, 44.6],
    ["Pons-Brooks", 1954.39, 94.2, 255.2, 70.98, 17.2, 0.96, 74.2],
    ["Halley", 1986.112, 170.011, 58.154, 76.0081, 17.9435, 0.9673, 162.2384]
];

function getCometEllipticalData(cometName) {
    let [comet_name, epoch_EpochOfPerihelion, peri_LongitudeOfPerihelion, node_LongitudeOfAscendingNode, period_PeriodOfOrbit, axis_SemiMajorAxisOfOrbit, ecc_EccentricityOfOrbit, incl_InclinationOfOrbit] = ["not found", -99, -99, -99, -99, -99, -99, -99]

    for (let iLoop = 0; iLoop < cometEllipticalData.length; iLoop++) {
        if (cometEllipticalData[iLoop][0] == cometName) {
            comet_name = String(cometEllipticalData[iLoop][0]);
            epoch_EpochOfPerihelion = Number(cometEllipticalData[iLoop][1]);
            peri_LongitudeOfPerihelion = Number(cometEllipticalData[iLoop][2]);
            node_LongitudeOfAscendingNode = Number(cometEllipticalData[iLoop][3]);
            period_PeriodOfOrbit = Number(cometEllipticalData[iLoop][4]);
            axis_SemiMajorAxisOfOrbit = Number(cometEllipticalData[iLoop][5]);
            ecc_EccentricityOfOrbit = Number(cometEllipticalData[iLoop][6]);
            incl_InclinationOfOrbit = Number(cometEllipticalData[iLoop][7]);

            break;
        }
    }

    return [comet_name, epoch_EpochOfPerihelion, peri_LongitudeOfPerihelion, node_LongitudeOfAscendingNode, period_PeriodOfOrbit, axis_SemiMajorAxisOfOrbit, ecc_EccentricityOfOrbit, incl_InclinationOfOrbit];
};


module.exports = {
    cometEllipticalData,
    getCometEllipticalData
};