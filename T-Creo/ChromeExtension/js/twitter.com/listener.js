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
        // Handle errors
        if (!message.success) {
            console.error(message.error);
            return;
        }

        console.debug("Scores found: ", message.result)

        this.listenToTweetsRendering(message.result);
    }

    /**
     * Starts a listener to a set of tweets, to render their scores
     * @param {object} scores Target tweets scores
     */
    listenToTweetsRendering(scores, interval) {
        setInterval(() => {
            for (let i = 0; i < scores.length; i++) {
                // Look for a link with the tweet id
                const link = document.querySelector(`[href*='${scores[i].id}']`);
                // Ignore if:
                if (
                    !link                                   // The tweet is not rendered
                    || link.parentElement.nextSibling       // The tweet was already processed
                    || !link.parentElement.previousSibling  // There's some rendering issue with the tweet
                )
                    continue;

                this.renderScore(link, scores[i].score);
            }

        }, interval || 300);
    }

    /**
     * Renders a score on a tweet
     * @param {Element} link Target tweet's inner link
     * @param {number} score Target score
     */
    renderScore(link, score) {
        // Create the elements to render
        var scoreContainer = document.createElement('div');
        var scoreLink = document.createElement('a');
        
        // Format the score
        scoreLink.innerText = (score * 100).toFixed(2) + "%";

        // Add classes and styling
        scoreLink.className = link.className;
        scoreContainer.className = link.parentElement.className;

        // Add a T-Creo class depending on the results
        scoreLink.classList.add(
            score > 0.8 ? "t-creo-error" :
            score > 0.5 ? "t-creo-warning" :
            "t-creo-success"
        );

        // Append nodes
        scoreContainer.appendChild(scoreLink);
        link.parentElement.parentElement.appendChild(link.parentElement.previousSibling.cloneNode(true)); // dot separator
        link.parentElement.parentElement.appendChild(scoreContainer);
    }
}
