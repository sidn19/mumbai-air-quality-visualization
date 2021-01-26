"use strict";

import { TILE_SIZE } from "./declarations.js";

export function getTileUrl(tileX, tileY, zoom) {
    return `https://a.tile.openstreetmap.org/${zoom}/${tileX}/${tileY}.png`;
}

export function coordsToTile(lat, lng, zoom) {
    let z = 1 << zoom;
    return {
        x: Math.floor(((lng + 180) / 360) * z),
        y: Math.floor(((1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) / 2) * z),
    };
}

export function tileToCoords(tileX, tileY, zoom) {
    const z = 1 << zoom;
    var n = Math.PI - (2 * Math.PI * tileY) / z;
    return {
        lng: (tileX / z) * 360 - 180,
        lat: (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))),
    };
}

export function getTileImage(xLocation, yLocation, tileX, tileY, zoom) {
    const img = document.createElementNS("http://www.w3.org/2000/svg", "image");
    img.setAttributeNS(null, "height", TILE_SIZE);
    img.setAttributeNS(null, "width", TILE_SIZE);
    img.setAttributeNS(null, "class", "map-tile");
    img.setAttributeNS(null, "x", xLocation);
    img.setAttributeNS(null, "y", yLocation);
    img.setAttributeNS(null, "id", tileX + "," + tileY); //Store Tile Coordinates in ID
    img.setAttributeNS("http://www.w3.org/1999/xlink", "href", getTileUrl(tileX, tileY, zoom));
    return img;
}

export function latlngToPixelCoords(latitude, longitude, zoom) {
    let z = 1 << zoom;
    var sinLatitude = Math.sin((latitude * Math.PI) / 180);
    var pixelX = ((longitude + 180) / 360) * TILE_SIZE * z;
    var pixelY = (0.5 - Math.log((1 + sinLatitude) / (1 - sinLatitude)) / (4 * Math.PI)) * TILE_SIZE * z;

    return {
        x: pixelX,
        y: pixelY,
    };
}

export function mod(a, b) {
    return ((a % b) + b) % b;
}
