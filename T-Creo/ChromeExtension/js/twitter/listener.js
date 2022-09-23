import { AbstractTCreoListener } from '../t-creo-core.js';

/**
 * TCreo Twitter Listener
 */
export class TCreoTwitterListener extends AbstractTCreoListener {

    constructor(extId) {
        super(extId);
    }

    /**
     * Validates whether a request has valid data
     * @abstract
     * @param {XMLHttpRequest} xhr   
     * @returns True if the request has valid data. False otherwise
     */
    hasValidData(xhr) {
        return xhr?._url?.includes("HomeTimeline");
    }

    /**
     * Handles messages from the background process
     * @abstract
     * @delegate
     * @param {Object} message Message from background process
     */
    handleBackgroundMessage(message) {
        console.log(message);
    }

    /**
     * Formats the captured data to be send to the background process
     * @abstract
     * @delegate
     * @param {string} dataString Target data string
     * @returns {object} FormattedData
     */
    mapData(dataString) {
        console.log(dataString);
        return JSON.parse(dataString);
    }

}

export default TCreoTwitterListener;