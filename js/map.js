"use strict";

import regions from "../data/regions.js";
import aqv_points from "../data/aqv_points.js";

import { TILE_SIZE } from "./declarations.js";
import { latlngToPixelCoords, pixelCoordsToLatLng, addMapTiles, removeMapTiles } from "./tile_layer.js";

import { geojsonOverlay } from "./svg_layer.js";
import { addHeatmapTiles, removeHeatmapTiles } from "./heatmap_layer.js";

import { regionEventListener } from "./demographic-modal.js";

import { state } from "./state.js";

const svgMap = document.getElementById("svg-map");
const svgMapRect = svgMap.getBoundingClientRect();

const svgMapTiles = document.getElementById("map-tiles");
const svgRegions = document.getElementById("svg-regions");

const heatmapLayer = document.getElementById("heatmap-layer");

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

//Initialize View Box Boundary
state.viewBoxCoords.min_x = svgMapRect.left;
state.viewBoxCoords.min_y = svgMapRect.top;
state.viewBoxCoords.width = svgMapRect.width;
state.viewBoxCoords.height = svgMapRect.height;

let heatmapLayerCoords = {
    left: 0,
    top: 0,
};

function updateViewBox(min_x, min_y, width, height) {
    state.viewBoxCoords.min_x = min_x;
    state.viewBoxCoords.min_y = min_y;
    state.viewBoxCoords.width = width;
    state.viewBoxCoords.height = height;
    svgMap.setAttribute("viewBox", min_x + " " + min_y + " " + width + " " + height);
}

export function toggleHeatmap() {
    if (state.viewHeatmap) {
        //Remove All Heatmap Tiles
        removeHeatmapTiles(heatmapLayer, mapCoords.left, mapCoords.top, mapCoords.right, mapCoords.bottom);
        state.viewHeatmap = false;
    }
    else {
        //Add All Heatmap Tiles of Current mapCoords
        addHeatmapTiles(state.heatmapDataRefined, heatmapLayer, mapCoords.left, mapCoords.top, mapCoords.right, mapCoords.bottom);
        state.viewHeatmap = true;
    }
}

/**
 * 
 * @param {{latitude: number, longitude: number, severity: number}[]} heatmapData - Raw Heatmap Data
 * @param {*} mapping - Mapping function from latitude longitude to pixel coordinates
 * @param {*} normalize - Normalization function to normalize value of severity from 0 to 1
 */
function refineHeatmapData(heatmapData, mapping, normalize) {
    let heatmapDataRefined = heatmapData.map((point) => {
        let pixelCoords = mapping(point.latitude, point.longitude);
        return [pixelCoords.x, pixelCoords.y, normalize(point.severity)];
    });
    return heatmapDataRefined;
}

export function drawMap(locationX, locationY, tileX, tileY, zoom) {
    //Clear map tiles and svg overlay
    svgMapTiles.innerHTML = "";
    svgRegions.innerHTML = "";
    heatmapLayer.innerHTML = "";

    //Reset viewBox
    updateViewBox(viewport.min_x, viewport.min_y, viewport.width, viewport.height);

    mapCoords.left = locationX - Math.ceil((locationX - svgMapRect.left) / TILE_SIZE) * TILE_SIZE - BUFFER_TILES * TILE_SIZE;
    mapCoords.top = locationY - Math.ceil((locationY - svgMapRect.top) / TILE_SIZE) * TILE_SIZE - BUFFER_TILES * TILE_SIZE;

    tileCoords.min_x = tileX - Math.ceil((locationX - svgMapRect.left) / TILE_SIZE) - BUFFER_TILES;
    tileCoords.min_y = tileY - Math.ceil((locationY - svgMapRect.top) / TILE_SIZE) - BUFFER_TILES;

    mapCoords.right = locationX + Math.ceil((svgMapRect.right - locationX) / TILE_SIZE) * TILE_SIZE + BUFFER_TILES * TILE_SIZE;
    mapCoords.bottom = locationY + Math.ceil((svgMapRect.bottom - locationY) / TILE_SIZE) * TILE_SIZE + BUFFER_TILES * TILE_SIZE;

    tileCoords.max_x = tileX + Math.ceil((svgMapRect.right - locationX) / TILE_SIZE) - 1 + BUFFER_TILES;
    tileCoords.max_y = tileY + Math.ceil((svgMapRect.bottom - locationY) / TILE_SIZE) - 1 + BUFFER_TILES;

    addMapTiles(svgMapTiles, mapCoords.left, mapCoords.top, mapCoords.right, mapCoords.bottom, tileCoords.min_x, tileCoords.min_y, state.currentZoom);

    //Set up mapping functions
    state.mappingLatLngToPixelCoords = (lat, lng) => {
        let pixelCoords = latlngToPixelCoords(lat, lng, zoom);
        return {
            x: pixelCoords.x + locationX - tileX * TILE_SIZE, //Translate pixel coordinate to match with our svg map coordinate system
            y: pixelCoords.y + locationY - tileY * TILE_SIZE, //Translate pixel coordinate to match with our svg map coordinate system
        };
    };

    state.mappingPixelCoordsToLatLng = (pixelX, pixelY) => {
        let originalPixelX = pixelX - (locationX - tileX * TILE_SIZE); //Remove the translation to get the original pixel coordinate system of web map
        let originalPixelY = pixelY - (locationY - tileY * TILE_SIZE); //Remove the translation to get the original pixel coordinate system of web map
        let coordinates = pixelCoordsToLatLng(originalPixelX, originalPixelY, zoom);
        return {
            lat: coordinates.lat,
            lng: coordinates.lng,
        };
    };

    //Add geoJSON SVG Layer
    geojsonOverlay(regions, state.mappingLatLngToPixelCoords, svgRegions);

    //Add Heat Map Overlay
    heatmapLayerCoords.left = 0;
    heatmapLayerCoords.top = 0;
    heatmapLayer.style.transform = `translate(0px, 0px)`;
    
    // Need to update this
    state.heatmapDataRefined = refineHeatmapData(state.heatmapData, state.mappingLatLngToPixelCoords, function(severity) {
        return severity / 3;
    });
    console.log(state.heatmapDataRefined);
    if (state.viewHeatmap) {
        addHeatmapTiles(state.heatmapDataRefined, heatmapLayer, mapCoords.left, mapCoords.top, mapCoords.right, mapCoords.bottom);
    }

    regionEventListener();
}

//initialize map
// setTimeout(function() {
//     drawMap((viewport.width >>> 1) - 100, (viewport.height >>> 1) - 170, 5755, 3654, state.currentZoom);
// }, 3000);

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

        updateViewBox(state.viewBoxCoords.min_x - dx, state.viewBoxCoords.min_y - dy, state.viewBoxCoords.width, state.viewBoxCoords.height);

        //Logic for on-demand tile loading
        if (state.viewBoxCoords.min_x < mapCoords.left + BUFFER_TILES * TILE_SIZE) {
            //console.log("load left tiles");
            mapCoords.left -= TILE_SIZE;
            tileCoords.min_x--;
            addMapTiles(svgMapTiles, mapCoords.left, mapCoords.top, mapCoords.left + TILE_SIZE, mapCoords.bottom, tileCoords.min_x, tileCoords.min_y, state.currentZoom);
            if (state.viewHeatmap) {
                addHeatmapTiles(state.heatmapDataRefined, heatmapLayer, mapCoords.left, mapCoords.top, mapCoords.left + TILE_SIZE, mapCoords.bottom);
            }
        } else if (state.viewBoxCoords.min_x + state.viewBoxCoords.width > mapCoords.right - BUFFER_TILES * TILE_SIZE) {
            //console.log("load right tiles");
            tileCoords.max_x++;
            addMapTiles(svgMapTiles, mapCoords.right, mapCoords.top, mapCoords.right + TILE_SIZE, mapCoords.bottom, tileCoords.max_x, tileCoords.min_y, state.currentZoom);
            if (state.viewHeatmap) {
                addHeatmapTiles(state.heatmapDataRefined, heatmapLayer, mapCoords.right, mapCoords.top, mapCoords.right + TILE_SIZE, mapCoords.bottom);
            }
            mapCoords.right += TILE_SIZE;
        }

        if (state.viewBoxCoords.min_y < mapCoords.top + BUFFER_TILES * TILE_SIZE) {
            //console.log("load top tiles");
            mapCoords.top -= TILE_SIZE;
            tileCoords.min_y--;
            addMapTiles(svgMapTiles, mapCoords.left, mapCoords.top, mapCoords.right, mapCoords.top + TILE_SIZE, tileCoords.min_x, tileCoords.min_y, state.currentZoom);
            if (state.viewHeatmap) {
                addHeatmapTiles(state.heatmapDataRefined, heatmapLayer, mapCoords.left, mapCoords.top, mapCoords.right, mapCoords.top + TILE_SIZE);
            }
        } else if (state.viewBoxCoords.min_y + state.viewBoxCoords.height > mapCoords.bottom - BUFFER_TILES * TILE_SIZE) {
            //console.log("load bottom tiles");
            tileCoords.max_y++;
            addMapTiles(svgMapTiles, mapCoords.left, mapCoords.bottom, mapCoords.right, mapCoords.bottom + TILE_SIZE, tileCoords.min_x, tileCoords.max_y, state.currentZoom);
            if (state.viewHeatmap) {
                addHeatmapTiles(state.heatmapDataRefined, heatmapLayer, mapCoords.left, mapCoords.bottom, mapCoords.right, mapCoords.bottom + TILE_SIZE);
            }
            mapCoords.bottom += TILE_SIZE;
        }

        //Logic for on demand tile removal
        if (state.viewBoxCoords.min_x > mapCoords.left + TILE_SIZE + BUFFER_TILES * TILE_SIZE) {
            //console.log("remove left tiles");
            removeMapTiles(svgMapTiles, mapCoords.left, mapCoords.top, mapCoords.left + TILE_SIZE, mapCoords.bottom);
            removeHeatmapTiles(heatmapLayer, mapCoords.left, mapCoords.top, mapCoords.left + TILE_SIZE, mapCoords.bottom);
            mapCoords.left += TILE_SIZE;
            tileCoords.min_x++;
        } else if (state.viewBoxCoords.min_x + state.viewBoxCoords.width < mapCoords.right - TILE_SIZE - BUFFER_TILES * TILE_SIZE) {
            //console.log("remove right tiles");
            mapCoords.right -= TILE_SIZE;
            tileCoords.max_x--;
            removeMapTiles(svgMapTiles, mapCoords.right, mapCoords.top, mapCoords.right + TILE_SIZE, mapCoords.bottom);
            removeHeatmapTiles(heatmapLayer, mapCoords.right, mapCoords.top, mapCoords.right + TILE_SIZE, mapCoords.bottom);
        }

        if (state.viewBoxCoords.min_y > mapCoords.top + TILE_SIZE + BUFFER_TILES * TILE_SIZE) {
            //console.log("remove top tiles");
            removeMapTiles(svgMapTiles, mapCoords.left, mapCoords.top, mapCoords.right, mapCoords.top + TILE_SIZE);
            removeHeatmapTiles(heatmapLayer, mapCoords.left, mapCoords.top, mapCoords.right, mapCoords.top + TILE_SIZE);
            mapCoords.top += TILE_SIZE;
            tileCoords.min_y++;
        } else if (state.viewBoxCoords.min_y + state.viewBoxCoords.height < mapCoords.bottom - TILE_SIZE - BUFFER_TILES * TILE_SIZE) {
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
function zoomAt(x, y, scroll) {
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

    if (scroll > 0 && state.currentZoom > state.minZoom) {
        //zoom out

        let newTileX = oldTileX >>> 1;
        let newTileY = oldTileY >>> 1;

        let tileLocationX = (x + rect.left - (oldTileX & 1 ? rect.width : 0)) >> 1;
        let tileLocationY = (y + rect.top - (oldTileY & 1 ? rect.height : 0)) >> 1;

        state.currentZoom--;

        drawMap(tileLocationX, tileLocationY, newTileX, newTileY, state.currentZoom);
    } else if (scroll < 0 && state.currentZoom < state.maxZoom) {
        //zoom in

        let newTileX = oldTileX << 1;
        let newTileY = oldTileY << 1;

        let tileLocationX = (rect.left << 1) - x;
        let tileLocationY = (rect.top << 1) - y;

        state.currentZoom++;

        drawMap(tileLocationX, tileLocationY, newTileX, newTileY, state.currentZoom);
    }
}

svgMap.addEventListener("wheel", function (event) {
    event.preventDefault();

    let x = event.clientX;
    let y = event.clientY;

	zoomAt(x, y, event.deltaY);    
});

document.getElementById("zoom-in-button").addEventListener("click", function(event) {
	zoomAt(Math.floor(viewport.width >>> 1), Math.floor(viewport.height >>> 1), -1);
});

document.getElementById("zoom-out-button").addEventListener("click", function(event) {
	zoomAt(Math.floor(viewport.width >>> 1), Math.floor(viewport.height >>> 1), 1);
});
