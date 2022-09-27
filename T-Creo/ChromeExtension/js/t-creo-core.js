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

export default { AbstractTCreoLoader }