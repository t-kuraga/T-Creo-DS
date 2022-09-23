import { AbstractTCreoListener } from '../t-creo-core.js';

/**
 * TCreo Twitter Listener
 */
export default class TCreoTwitterListener extends AbstractTCreoListener {

    constructor(extId) {
        super(extId);
    }

    /**
     * Validates whether a request has valid data
     * @override
     * @param {XMLHttpRequest} xhr   
     * @returns True if the request has valid data. False otherwise
     */
    hasValidData(xhr) {
        return xhr?._url?.includes("HomeTimeline");
    }

    /**
     * Handles messages from the background process
     * @override
     * @param {Object} message Message from background process
     */
    handleBackgroundMessage(message) {
        console.log(message);
    }
}
