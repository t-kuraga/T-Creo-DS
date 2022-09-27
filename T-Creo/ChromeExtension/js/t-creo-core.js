/**
 * TCreo data loader base class
 */
export class AbstractTCreoLoader {
    constructor() {

    }

    /**
     * Gets score input data from the provided listener input
     * @abstract
     * @param {string} dataString Data from xhr request
     * @returns {[string[], object[]]} Ids and data rows
     */
    map(dataString) {
        throw "Not implemented";
    }
}

export class AbstractTCreoCalculationService {
    /**
     * Calculates scores for a data set
     * @abstract
     * @param {object[]} dataSet Target data set
     * @returns {Promise<object[]>} Scores
     */
     async calculateScores (dataSet) {
        throw "Not implemented";
    }

}

export default { AbstractTCreoLoader }