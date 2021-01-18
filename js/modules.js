"use strict";

import {
    TILE_SIZE,
    ORIGIN,
    PIXELS_PER_DEGREE,
    PIXELS_PER_RADIAN,
} from "./declarations.js";



export function getTileUrl(tileX, tileY, zoom) {
    return `https://a.tile.openstreetmap.org/${zoom}/${tileX}/${tileY}.png`;
}

export function getTileFromURL(url) {
    let regex = /\/([0-9]+)\/([0-9]+).png$/;
    let result = url.match(regex);
    return {
        x: +result[1],
        y: +result[2],
    };
}

export function coordsToTile(lat, lng, zoom) {
    let z = 1 << zoom;
    return {
        x: Math.floor(((lng + 180) / 360) * z),
        y: Math.floor(
            ((1 -
                Math.log(
                    Math.tan((lat * Math.PI) / 180) +
                        1 / Math.cos((lat * Math.PI) / 180)
                ) /
                    Math.PI) /
                2) *
                z
        ),
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
    img.setAttributeNS(
        "http://www.w3.org/1999/xlink",
        "href",
        getTileUrl(tileX, tileY, zoom)
    );
    return img;
}

export function latlngToPixelCoords(lat, lng, zoom) {
    let worldX = ORIGIN + lng * PIXELS_PER_DEGREE;
    let sinY = Math.sin((lat * Math.PI) / 180);
    sinY = Math.min(Math.max(sinY, -0.9999), 0.9999);
    let worldY =
        ORIGIN + 0.5 * (Math.log((1 + sinY) / (1 - sinY)) * -PIXELS_PER_RADIAN);

    let scale = 1 << zoom;
    let pixelX = worldX * scale;
    let pixelY = worldY * scale;
    return {
        x: pixelX,
        y: pixelY,
    };
}

export function tileToPixelCoords(tileX, tileY, zoom) {
    let coords = tileToCoords(tileX, tileY, zoom);
    let pixelCoords = latlngToPixelCoords(coords.lat, coords.lng, zoom);
    return pixelCoords;
}

export function geojsonOverlay(geojsonData, mapping, container) {
    for (let feature of geojsonData.features) {
        let path = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
        );

        let color = [0xaa, 0, 0];
        path.setAttributeNS(
            null,
            "fill",
            `rgb(${color[0]}, ${color[1]}, ${color[2]}, 0.5)`
        );
        path.setAttributeNS(
            null,
            "stroke",
            `rgb(${color[0]}, ${color[1]}, ${color[2]}, 1)`
        );
        path.setAttributeNS(null, "stroke-width", "1");
        let properties = feature.properties;
        let coordinates = feature.geometry.coordinates;

        let pixelCoords = mapping(
            coordinates[0][0][0][1],
            coordinates[0][0][0][0]
        );

        let pathString = `M${pixelCoords.x},${pixelCoords.y}`;

        for (let i = 1; i < coordinates[0][0].length; i++) {
            pixelCoords = mapping(
                coordinates[0][0][i][1],
                coordinates[0][0][i][0]
            );
            pathString += `L${pixelCoords.x}, ${pixelCoords.y}`;
        }
        pathString += "Z";
        path.setAttributeNS(null, "d", pathString);

        container.appendChild(path);
    }
}


