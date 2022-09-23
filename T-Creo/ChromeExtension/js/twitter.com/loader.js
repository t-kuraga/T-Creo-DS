import { AbstractTCreoLoader } from "../t-creo-core.js";

export default class TCreoTwitterLoader extends AbstractTCreoLoader {
    /**
     * Gets score input data from the provided listener input
     * @param {string} dataString Data from xhr request
     */
    map(dataString) {
        const data = JSON.parse(dataString);
        console.log(dataString, data);

        return data;
    }

}