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

export function pixelCoordsToLatLng(pixelX, pixelY, zoom) {
    let z = 1 << zoom;
    let lng = (pixelX * 360) / (TILE_SIZE * z) - 180;
    let x = Math.exp(4 * Math.PI * (0.5 - pixelY / (TILE_SIZE * z)));
    let lat = (Math.asin((x - 1) / (x + 1)) * 180) / Math.PI;
    return {
        lat: lat,
        lng: lng
    }
}

export function addMapTiles(container, min_x, min_y, max_x, max_y, minTileX, minTileY, zoom) {
    let maxTiles = 1 << zoom;

    //console.time("addMapTiles");

    for (let currentLocationY = min_y, currentTileY = minTileY; currentLocationY < max_y; currentLocationY += TILE_SIZE, currentTileY++) {
        for (let currentLocationX = min_x, currentTileX = minTileX; currentLocationX < max_x; currentLocationX += TILE_SIZE, currentTileX++) {
            if (currentTileX >= 0 && currentTileX < maxTiles && currentTileY >= 0 && currentTileY < maxTiles) {
                container.appendChild(getTileImage(currentLocationX, currentLocationY, currentTileX, currentTileY, zoom));
            }
        }
    }
    //console.timeEnd("addMapTiles");
}

export function removeMapTiles(container, min_x, min_y, max_x, max_y) {
    //console.time("removeMapTiles");
    let tiles = container.getElementsByClassName("map-tile");
    for (let i = tiles.length - 1; i >= 0; i--) {
        let x = +tiles[i].getAttribute("x");
        let y = +tiles[i].getAttribute("y");
        if (x >= min_x && x < max_x && y >= min_y && y < max_y) {
            tiles[i].remove();
        }
    }
    //console.timeEnd("removeMapTiles");
}

export function distanceBetweenLocations(lat1,lon1,lat2,lon2) {
    let R = 6371; // Radius of the earth in km
    let dLat = deg2rad(lat2-lat1);  // deg2rad below
    let dLon = deg2rad(lon2-lon1);
    let a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2)
        ; 
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    let d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}