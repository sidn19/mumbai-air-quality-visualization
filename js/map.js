"use strict";

import regions from "../data/regions.js";
import aqv_points from "../data/aqv_points.js";

import { TILE_SIZE } from "./declarations.js";
import { getTileImage, latlngToPixelCoords, pixelCoordsToLatLng, addMapTiles, removeMapTiles } from "./tile_layer.js";

import { geojsonOverlay } from "./svg_layer.js";
import { addHeatmapTiles, removeHeatmapTiles } from "./heatmap_layer.js";

const svgMap = document.getElementById("svg-map");
const svgMapRect = svgMap.getBoundingClientRect();

const svgMapTiles = document.getElementById("map-tiles");
const svgRegions = document.getElementById("svg-regions");

const heatmapLayer = document.getElementById("heatmap-layer");

let mappingLatLngToPixelCoords = null; //This will be the mapping function from (lat, lng) to pixel coordinates
let mappingPixelCoordsToLatLng = null; //This will be the reverse mapping function from pixel coordinates to (lat, lng)

let heatmapDataRefined = null; //This will hold the heatmap data points in pixel coordinates

const BUFFER_TILES = 1; //Number of extra layer of tiles to be loaded around the visible area tiles

//tileCoords represents Tile Coordinate System
let tileCoords = {
    min_x: 0,
    min_y: 0,
    max_x: 0,
    max_y: 0,
};

//mapCoords represents the extreme positions of the map tile group
let mapCoords = {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
};

let viewport = {
    min_x: svgMapRect.left,
    min_y: svgMapRect.top,
    width: svgMapRect.width,
    height: svgMapRect.height,
};

let viewBoxCoords = {
    min_x: svgMapRect.left,
    min_y: svgMapRect.top,
    width: svgMapRect.width,
    height: svgMapRect.height,
};

let heatmapLayerCoords = {
    left: 0,
    top: 0,
};

let currentZoom = 13;

let minZoom = 0;
let maxZoom = 18;

// for(let zoom = 0; zoom <= maxZoom; zoom++) {
//     if((1 << zoom) * TILE_SIZE > viewport.width && (1 << zoom) * TILE_SIZE > viewport.height) {
//         minZoom = zoom;
//         break;
//     }
// }

function updateViewBox(min_x, min_y, width, height) {
    viewBoxCoords.min_x = min_x;
    viewBoxCoords.min_y = min_y;
    viewBoxCoords.width = width;
    viewBoxCoords.height = height;
    svgMap.setAttribute("viewBox", min_x + " " + min_y + " " + width + " " + height);
}

function drawMap(locationX, locationY, tileX, tileY, zoom) {
    //Clear map tiles and svg overlay
    svgMapTiles.innerHTML = "";
    svgRegions.innerHTML = "";
    heatmapLayer.innerHTML = "";

    //Reset viewBox
    updateViewBox(viewport.min_x, viewport.min_y, viewport.width, viewport.height);

    let maxTiles = 1 << zoom;

    mapCoords.left = locationX - Math.ceil((locationX - svgMapRect.left) / TILE_SIZE) * TILE_SIZE - BUFFER_TILES * TILE_SIZE;
    mapCoords.top = locationY - Math.ceil((locationY - svgMapRect.top) / TILE_SIZE) * TILE_SIZE - BUFFER_TILES * TILE_SIZE;

    tileCoords.min_x = tileX - Math.ceil((locationX - svgMapRect.left) / TILE_SIZE) - BUFFER_TILES;
    tileCoords.min_y = tileY - Math.ceil((locationY - svgMapRect.top) / TILE_SIZE) - BUFFER_TILES;

    let currentLocationY = mapCoords.top,
        currentTileY = tileCoords.min_y;
    let currentLocationX = mapCoords.left,
        currentTileX = tileCoords.min_x;

    while (currentLocationY < svgMapRect.bottom + BUFFER_TILES * TILE_SIZE) {
        currentLocationX = mapCoords.left;
        currentTileX = tileCoords.min_x;
        while (currentLocationX < svgMapRect.right + BUFFER_TILES * TILE_SIZE) {
            if (currentTileX >= 0 && currentTileX < maxTiles && currentTileY >= 0 && currentTileY < maxTiles) {
                svgMapTiles.appendChild(getTileImage(currentLocationX, currentLocationY, currentTileX, currentTileY, zoom));
            }
            currentLocationX += TILE_SIZE;
            currentTileX++;
        }
        currentLocationY += TILE_SIZE;
        currentTileY++;
    }

    mapCoords.right = currentLocationX;
    mapCoords.bottom = currentLocationY;

    tileCoords.max_x = currentTileX - 1;
    tileCoords.max_y = currentTileY - 1;

    //Set up mapping function
    mappingLatLngToPixelCoords = (lat, lng) => {
        let pixelCoords = latlngToPixelCoords(lat, lng, zoom);
        return {
            x: pixelCoords.x + locationX - tileX * TILE_SIZE, //Translate pixel coordinate to match with our svg map coordinate system
            y: pixelCoords.y + locationY - tileY * TILE_SIZE, //Translate pixel coordinate to match with our svg map coordinate system
        };
    };

    mappingPixelCoordsToLatLng = (pixelX, pixelY) => {
        let originalPixelX = pixelX - (locationX - tileX * TILE_SIZE); //Remove the translation to get the original pixel coordinate system of web map
        let originalPixelY = pixelY - (locationY - tileY * TILE_SIZE); //Remove the translation to get the original pixel coordinate system of web map
        let coordinates = pixelCoordsToLatLng(originalPixelX, originalPixelY, zoom);
        return {
            lat: coordinates.lat,
            lng: coordinates.lng
        }
    }

    heatmapDataRefined = aqv_points.map((point) => {
        let pixelCoords = mappingLatLngToPixelCoords(point[1], point[0]);
        return [pixelCoords.x, pixelCoords.y, point[2]];
    });

    //Add geoJSON SVG Layer
    geojsonOverlay(regions, mappingLatLngToPixelCoords, svgRegions);

    //Add Heat Map Overlay
    heatmapLayerCoords.left = 0;
    heatmapLayerCoords.top = 0;
    heatmapLayer.style.transform = `translate(0px, 0px)`;
    addHeatmapTiles(heatmapDataRefined, heatmapLayer, mapCoords.left, mapCoords.top, mapCoords.right, mapCoords.bottom);
}

//initialize map
drawMap((viewport.width >>> 1) - 100, (viewport.height >>> 1) - 170, 5755, 3654, currentZoom);

/**
 * Panning Functionality
 */
svgMap.addEventListener("mousedown", mousedown);

function mousedown(event) {
    svgMap.style.cursor = "grabbing";
    window.addEventListener("mousemove", mousemove);
    window.addEventListener("mouseup", mouseup);

    let prevX = event.clientX,
        prevY = event.clientY;

    function mousemove(event) {
        let newX = event.clientX,
            newY = event.clientY;
        let dx = newX - prevX,
            dy = newY - prevY;

        heatmapLayerCoords.left += dx;
        heatmapLayerCoords.top += dy;

        heatmapLayer.style.transform = `translate(${heatmapLayerCoords.left}px, ${heatmapLayerCoords.top}px)`;

        updateViewBox(viewBoxCoords.min_x - dx, viewBoxCoords.min_y - dy, viewBoxCoords.width, viewBoxCoords.height);

        //Logic for on-demand tile loading
        if (viewBoxCoords.min_x < mapCoords.left + BUFFER_TILES * TILE_SIZE) {
            //console.log("load left tiles");
            mapCoords.left -= TILE_SIZE;
            tileCoords.min_x--;
            addMapTiles(svgMapTiles, mapCoords.left, mapCoords.top, mapCoords.left + TILE_SIZE, mapCoords.bottom, tileCoords.min_x, tileCoords.min_y, currentZoom);
            addHeatmapTiles(heatmapDataRefined, heatmapLayer, mapCoords.left, mapCoords.top, mapCoords.left + TILE_SIZE, mapCoords.bottom);
        } else if (viewBoxCoords.min_x + viewBoxCoords.width > mapCoords.right - BUFFER_TILES * TILE_SIZE) {
            //console.log("load right tiles");
            tileCoords.max_x++;
            addMapTiles(svgMapTiles, mapCoords.right, mapCoords.top, mapCoords.right + TILE_SIZE, mapCoords.bottom, tileCoords.max_x, tileCoords.min_y, currentZoom);
            addHeatmapTiles(heatmapDataRefined, heatmapLayer, mapCoords.right, mapCoords.top, mapCoords.right + TILE_SIZE, mapCoords.bottom);
            mapCoords.right += TILE_SIZE;
        }

        if (viewBoxCoords.min_y < mapCoords.top + BUFFER_TILES * TILE_SIZE) {
            //console.log("load top tiles");
            mapCoords.top -= TILE_SIZE;
            tileCoords.min_y--;
            addMapTiles(svgMapTiles, mapCoords.left, mapCoords.top, mapCoords.right, mapCoords.top + TILE_SIZE, tileCoords.min_x, tileCoords.min_y, currentZoom);
            addHeatmapTiles(heatmapDataRefined, heatmapLayer, mapCoords.left, mapCoords.top, mapCoords.right, mapCoords.top + TILE_SIZE);
        } else if (viewBoxCoords.min_y + viewBoxCoords.height > mapCoords.bottom - BUFFER_TILES * TILE_SIZE) {
            //console.log("load bottom tiles");
            tileCoords.max_y++;
            addMapTiles(svgMapTiles, mapCoords.left, mapCoords.bottom, mapCoords.right, mapCoords.bottom + TILE_SIZE, tileCoords.min_x, tileCoords.max_y, currentZoom);
            addHeatmapTiles(heatmapDataRefined, heatmapLayer, mapCoords.left, mapCoords.bottom, mapCoords.right, mapCoords.bottom + TILE_SIZE);
            mapCoords.bottom += TILE_SIZE;
        }

        //Logic for on demand tile removal
        if (viewBoxCoords.min_x > mapCoords.left + TILE_SIZE + BUFFER_TILES * TILE_SIZE) {
            //console.log("remove left tiles");
            removeMapTiles(svgMapTiles, mapCoords.left, mapCoords.top, mapCoords.left + TILE_SIZE, mapCoords.bottom);
            removeHeatmapTiles(heatmapLayer, mapCoords.left, mapCoords.top, mapCoords.left + TILE_SIZE, mapCoords.bottom);
            mapCoords.left += TILE_SIZE;
            tileCoords.min_x++;
        } else if (viewBoxCoords.min_x + viewBoxCoords.width < mapCoords.right - TILE_SIZE - BUFFER_TILES * TILE_SIZE) {
            //console.log("remove right tiles");
            mapCoords.right -= TILE_SIZE;
            tileCoords.max_x--;
            removeMapTiles(svgMapTiles, mapCoords.right, mapCoords.top, mapCoords.right + TILE_SIZE, mapCoords.bottom);
            removeHeatmapTiles(heatmapLayer, mapCoords.right, mapCoords.top, mapCoords.right + TILE_SIZE, mapCoords.bottom);
        }

        if (viewBoxCoords.min_y > mapCoords.top + TILE_SIZE + BUFFER_TILES * TILE_SIZE) {
            //console.log("remove top tiles");
            removeMapTiles(svgMapTiles, mapCoords.left, mapCoords.top, mapCoords.right, mapCoords.top + TILE_SIZE);
            removeHeatmapTiles(heatmapLayer, mapCoords.left, mapCoords.top, mapCoords.right, mapCoords.top + TILE_SIZE);
            mapCoords.top += TILE_SIZE;
            tileCoords.min_y++;
        } else if (viewBoxCoords.min_y + viewBoxCoords.height < mapCoords.bottom - TILE_SIZE - BUFFER_TILES * TILE_SIZE) {
            //console.log("remove bottom tiles");
            mapCoords.bottom -= TILE_SIZE;
            tileCoords.max_y--;
            removeMapTiles(svgMapTiles, mapCoords.left, mapCoords.bottom, mapCoords.right, mapCoords.bottom + TILE_SIZE);
            removeHeatmapTiles(heatmapLayer, mapCoords.left, mapCoords.bottom, mapCoords.right, mapCoords.bottom + TILE_SIZE);
        }

        prevX = newX;
        prevY = newY;
    }

    function mouseup() {
        svgMap.style.cursor = "grab";
        window.removeEventListener("mousemove", mousemove);
        window.removeEventListener("mouseup", mouseup);
    }
}

/**
 * Zooming Functionality
 */
svgMap.addEventListener("wheel", function (event) {
    event.preventDefault();

    let x = event.clientX;
    let y = event.clientY;

    //Get the Tile on which zoom was performed
    let tileDOM = document.elementsFromPoint(event.clientX, event.clientY).filter((dom) => {
        return dom.getAttribute("class") === "map-tile";
    })[0];

    let [oldTileX, oldTileY] = tileDOM
        .getAttribute("id")
        .split(",")
        .map((x) => {
            return +x;
        });

    let rect = tileDOM.getBoundingClientRect();

    if (event.deltaY > 0 && currentZoom > minZoom) {
        //zoom out

        let newTileX = oldTileX >>> 1;
        let newTileY = oldTileY >>> 1;

        let tileLocationX = (x + rect.left - (oldTileX & 1 ? rect.width : 0)) >> 1;
        let tileLocationY = (y + rect.top - (oldTileY & 1 ? rect.height : 0)) >> 1;

        currentZoom--;

        drawMap(tileLocationX, tileLocationY, newTileX, newTileY, currentZoom);
    } else if (event.deltaY < 0 && currentZoom < maxZoom) {
        //zoom in

        let newTileX = oldTileX << 1;
        let newTileY = oldTileY << 1;

        let tileLocationX = (rect.left << 1) - x;
        let tileLocationY = (rect.top << 1) - y;

        currentZoom++;

        drawMap(tileLocationX, tileLocationY, newTileX, newTileY, currentZoom);
    }
});

//Testing mappingPixelCoordsToLatLng function
svgMap.addEventListener("click", function(event) {
    let x = event.clientX;
    let y = event.clientY;

    console.log(x + viewBoxCoords.min_x, y + viewBoxCoords.min_y)
    let latlng = mappingPixelCoordsToLatLng(x + viewBoxCoords.min_x, y + viewBoxCoords.min_y);
    console.log(latlng.lat, latlng.lng);
    let pixelCoords = mappingLatLngToPixelCoords(latlng.lat, latlng.lng);
    console.log(pixelCoords.x, pixelCoords.y);
})
