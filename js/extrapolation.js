import { state } from "./state.js";
import { distanceBetweenLocations } from "./tile_layer.js";

/**
 * 
 * @param {number} lat1
 * @param {number} lng1
 * @param {number} lat2
 * @param {number} lng2
 * @param {number} bias - radius of influence (soft boundry)
 */
function similarity(lat1, lng1, lat2, lng2, bias) {
    let distance = distanceBetweenLocations(lat1, lng1, lat2, lng2);
    return Math.exp(-distance/(2*(bias**2)));
}

/**
 * 
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} bias - radius of influence (soft boundry)
 */
export function predictSeverity(lat, lng, bias) {
    if(state.heatmapData) {
        let weightedSum = 0;

        for(let data of state.heatmapData) {
            let influenceOfCurrentPoint = similarity(lat, lng, data.latitude, data.longitude, bias);
            weightedSum += data.severity * influenceOfCurrentPoint;
            //console.log(distanceBetweenLocations(lat, lng, data.latitude, data.longitude).toFixed(4) + "km", data.severity, influenceOfCurrentPoint);
        }

        return Math.exp(-1 / weightedSum) * 5;
    }
}