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
     * @param {XMLHttpRequest} xhr Target request
     * @returns True if the request has valid data. False otherwise
     */
    hasValidData(xhr) {
        throw "Not implemented";
    }

    /**
    * Handles messages from the background process
    * @abstract
    * @param {Object} message Message from background process
    */
    handleBackgroundMessage(message) {
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
        const self = this;
        chrome.runtime.sendMessage(this.extensionId, {
            action: "submit",
            domain: window.location.hostname,
            params: { data }
        }, m => self.handleBackgroundMessage(m));
    }

    /**
     * Gets data from a request
     * @param {XMLHttpRequest} xhr Target request 
     * @returns {bool} True if data was fetched. False otherwise
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
 * Initial XHR Queue
 */
const _initialXhrQueue = [];
const _listeners = [];

/**
 * Adds listeners to XHR requests
 * @returns {AbstractTCreoListener[]} listeners Target listeners
 */
export function startXhrMonitor() {
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
                // Check if no listeners have been added
                if (!_listeners.length) {
                    _initialXhrQueue.push(this);
                    return;
                }

                // Evaluate each listener in order
                for (let i = 0; i < _listeners.length; i++)
                    if (_listeners[i].getXHRData(this)) return;
            }
        } catch (error) {
            console.error(error); //Ignore errors and continue with execution
        }
    }
}

/**
 * Adds a listener to the XHR listeners set
 * @param {AbstractTCreoListener} listener 
 */
export function addListener(listener) {
    // Add the listener
    _listeners.push(listener);

    // Analyze previous requests
    for (let i = 0; i < _initialXhrQueue.length; i++)
        listener.getXHRData(_initialXhrQueue[i]);
}

export default { AbstractTCreoListener, startXhrMonitor, addListener }