import { startXhrListener } from './t-creo-core.js';

// Initialize system
let extId = new URL(import.meta.url).searchParams.get('extId');
const listeners = startXhrListener();

import Listener from './twitter/listener.js';
listeners.push(new Listener(extId));