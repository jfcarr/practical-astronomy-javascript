const binaryStarNames = {
    etaCor: "eta-Cor",
    gammaVir: "gamma-Vir",
    etaCas: "eta-Cas",
    zetaOri: "zeta-Ori",
    alphaCma: "alpha-CMa",
    deltaGem: "delta-Gem",
    alphaGem: "alpha-Gem",
    aplahCmi: "aplah-CMi",
    alphaCen: "alpha-Cen",
    alphaSco: "alpha Sco"
};

/**
 * Binary Star Data
 * 
 * Elements:
 *   0: binaryName -- Name of binary system.
 *   1: period     -- Period of the orbit.
 *   2: epochPeri  -- Epoch of the perihelion.
 *   3: longPeri   -- Longitude of the perihelion.
 *   4: ecc        -- Eccentricity of the orbit.
 *   5: axis       -- Semi-major axis of the orbit.
 *   6: incl       -- Orbital inclination.
 *   7: paNode     -- Position angle of the ascending node.
 */
const binaryData = [
    [binaryStarNames.etaCor, 41.623, 1934.008, 219.907, 0.2763, 0.907, 59.025, 23.717],
    [binaryStarNames.gammaVir, 171.37, 1836.433, 252.88, 0.8808, 3.746, 146.05, 31.78],
    [binaryStarNames.etaCas, 480.0, 1889.6, 268.59, 0.497, 11.9939, 34.76, 278.42],
    [binaryStarNames.zetaOri, 1508.6, 2070.6, 47.3, 0.07, 2.728, 72.0, 155.5],
    [binaryStarNames.alphaCma, 50.09, 1894.13, 147.27, 0.5923, 7.5, 136.53, 44.57],
    [binaryStarNames.deltaGem, 1200.0, 1437.0, 57.19, 0.11, 6.9753, 63.28, 18.38],
    [binaryStarNames.alphaGem, 420.07, 1965.3, 261.43, 0.33, 6.295, 115.94, 40.47],
    [binaryStarNames.aplahCmi, 40.65, 1927.6, 269.8, 0.4, 4.548, 35.7, 284.3],
    [binaryStarNames.alphaCen, 79.92, 1955.56, 231.56, 0.516, 17.583, 79.24, 204.868],
    [binaryStarNames.alphaSco, 900.0, 1889.0, 0.0, 0.0, 3.21, 86.3, 273.0]
];

function getBinaryData(binaryName) {
    let [binary_name, period, epochPeri, longPeri, ecc, axis, incl, paNode] = ["not found", -99, -99, -99, -99, -99, -99, -99];

    for (let iLoop = 0; iLoop < binaryData.length; iLoop++) {
        if (binaryData[iLoop][0] == binaryName) {
            binary_name = String(binaryData[iLoop][0]);
            period = Number(binaryData[iLoop][1]);
            epochPeri = Number(binaryData[iLoop][2]);
            longPeri = Number(binaryData[iLoop][3]);
            ecc = Number(binaryData[iLoop][4]);
            axis = Number(binaryData[iLoop][5]);
            incl = Number(binaryData[iLoop][6]);
            paNode = Number(binaryData[iLoop][7]);

            break;
        }
    }

    return [binary_name, period, epochPeri, longPeri, ecc, axis, incl, paNode];
};


module.exports = {
    binaryStarNames,
    binaryData,
    getBinaryData
}