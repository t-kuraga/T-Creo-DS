import { TCreoTwitterParser } from './twitter.com/loader.js';

chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
    handleMessage(message).then(sendResponse);
    return true; // return true to indicate you want to send a response asynchronously
});

/**
 * Handles a message from the listeners
 * @param {Object} message 
 * @returns 
 */
async function handleMessage(message) {
    try {
        switch (message.action) {
            case 'submit':
                console.log(message);
                const result = true;
                return { success: true, result }
            default:
                return { success: false, error: "Invalid action" };
        }
    } catch (error) {
        return { success: false, error };
    }
}
