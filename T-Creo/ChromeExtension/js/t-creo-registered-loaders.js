import TwitterLoader from "./twitter.com/loader.js";

/**
 * Available loaders per domain
*/
const _loaders = {};

// Add loaders
_loaders["twitter.com"] = new TwitterLoader();

/**
* Gets a loader according to the domain
* @param {string} domain Target domain
* @returns {AbstractTCreoLoader} Loader for target domain
*/
export function getLoader(domain) {
    // Check if the domain already has a loader in place
    if (_loaders[domain]) return _loaders[domain];
    throw `Could not retrieve loader for domain ${domain}: ${error}`;
}

export default { getLoader };