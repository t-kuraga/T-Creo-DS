import { startXhrListener } from './t-creo-core.js';

// Initialize system
const listeners = startXhrListener();

// Add a listener for the current domain
import(`./${window.location.hostname}/listener.js`)
    .then(({ default: Listener }) => {
        let extId = new URL(import.meta.url).searchParams.get('extId');
        listeners.push(new Listener(extId));
    });
