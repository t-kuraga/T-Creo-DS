import { startXhrMonitor, addListener } from './t-creo-client-core.js';

// Initialize system
startXhrMonitor();

// Add a listener for the current domain
import(`./${window.location.hostname}/listener.js`)
    .then(({ default: Listener }) => {
        let extId = new URL(import.meta.url).searchParams.get('extId');
        addListener(new Listener(extId));
    });
