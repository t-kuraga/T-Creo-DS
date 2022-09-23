/**
 * TCreo listener base class
 */
export class AbstractTCreoListener {
    /**
     * Extension Id
     */
    extensionId
    /**
     * Validates whether a request has valid data
     * @abstract
     * @delegate
     * @param {XMLHttpRequest} xhr Target request
     * @returns True if the request has valid data. False otherwise
     */
    hasValidData(xhr){
        throw "Not implemented";
    }
    /**
     * Formats the captured data to be send to the background process
     * @abstract
     * @delegate
     * @param {string} dataString Target data string
     * @returns {object} FormattedData
     */
    mapData(dataString){
        throw "Not implemented";
    }
    /**
    * Handles messages from the background process
    * @abstract
    * @delegate
    * @param {Object} message Message from background process
    */
    handleBackgroundMessage(message){
        throw "Not implemented"; 
    }

    constructor(extId) {
        this.extensionId = extId;
    }

    /**
     * Submits data to the background process
     * @param {any} data Target data set 
     */
    submit(data) {
        chrome.runtime.sendMessage(this.extensionId, {
            action: "submit",
            params: { domain: window.location.hostname, data }
        }, this.handleBackgroundMessage);
    }

    /**
     * Gets data from a request
     * @param {XMLHttpRequest} xhr Target request 
     * @returns True if data was fetched. False otherwise
     */
    getXHRData(xhr) {
        if (this.hasValidData(xhr) && xhr.responseType != 'blob' && xhr.responseText) {
            // responseText is string or null
            try {
                this.submit(xhr.responseText);
            } catch (err) {
                console.error("T-Creo: Error in responseType try catch", err);
                throw err;
            }
            return true;
        }
        return false;
    }
}


/**
 * TCreo data loader base class
 */
export class AbstractTCreoLoader {
    /**
     * loader type
     */
    loaderType;
    /**
     * Gets score input data from the provided listener input
     * @abstract
     * @delegate
     * @param {Object}  Data from xhr request
     */
    map;

    constructor() {

    }
}

/**
 * Adds listeners to XHR requests
 * @returns {AbstractTCreoListener[]} listeners Target listeners
 */
export function startXhrListener() {
    const listeners = [];
    var XHR = XMLHttpRequest.prototype;

    // Capture current XHR functions
    var open = XHR.open;
    var send = XHR.send;
    var setRequestHeader = XHR.setRequestHeader;

    // Patch functions to include validations
    XHR.open = function (method, url) {
        this._method = method;
        this._url = url;
        this._requestHeaders = {};
        this._startTime = (new Date()).toISOString();

        return open.apply(this, arguments);
    };

    XHR.setRequestHeader = function (header, value) {
        this._requestHeaders[header] = value;
        return setRequestHeader.apply(this, arguments);
    };

    XHR.send = function () {
        // Adds the target listener to the send request
        this.addEventListener('load', processRequest);
        return send.apply(this, arguments);
    };

    function processRequest() {
        try {
            if ((this.responseType === '' || this.responseType === 'text') && this.responseText) {
                // Evaluate each listener in order
                for (let i = 0; i < listeners.length; i++)
                    if (listeners[i].getXHRData(this)) return;
            }
        } catch (error) {
            console.error(error); //Ignore errors and continue with execution
        }
    }

    return listeners;
}

export default { AbstractTCreoListener, startXhrListener }