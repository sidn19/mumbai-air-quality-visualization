"use strict";

import regions from "../data/regions.js";
import aqv_points from "../data/aqv_points.js";

import { TILE_SIZE } from "./declarations.js";
import {
    getTileImage,
    latlngToPixelCoords,
} from "./modules.js";

import { geojsonOverlay } from "./svg_layer.js";
import { heatmapOverlay } from "./heatmap_layer.js";

const svgMap = document.getElementById("svg-map");
const svgMapRect = svgMap.getBoundingClientRect();

const svgMapTiles = document.getElementById("map-tiles");
const svgRegions = document.getElementById("svg-regions");

const canvas = document.getElementById("heatmap");
const ctx = canvas.getContext("2d");

canvas.width = svgMapRect.width;
canvas.height = svgMapRect.height;

let mapping = null; //This will be the mapping function from (lat,lng) to pixel coordinates

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

//Heatmap canvas viewbox
let canvasViewBox = {
    top: 0,
    left: 0,
    width: canvas.width,
    height: canvas.height,
};

let currentZoom = 13;

function loadVerticalTiles(xLocation, xTile) {
    //yLocation ranges from mapCoords.top to mapCoords.bottom (excluding mapCoords.bottom)
    //yTile ranges from tileCoords.min_y to tileCoords.max_y

    for (
        let yLocation = mapCoords.top, yTile = tileCoords.min_y;
        yLocation < mapCoords.bottom;
        yLocation += TILE_SIZE, yTile++
    ) {
        svgMapTiles.appendChild(
            getTileImage(xLocation, yLocation, xTile, yTile, currentZoom)
        );
    }
}

function loadHorizontalTiles(yLocation, yTile) {
    //xLocation ranges from mapCoords.left to mapCoords.right (excluding mapCoords.right)
    //yTile ranges from tileCoords.min_y to tileCoords.max_y

    for (
        let xLocation = mapCoords.left, xTile = tileCoords.min_x;
        xLocation < mapCoords.right;
        xLocation += TILE_SIZE, xTile++
    ) {
        svgMapTiles.appendChild(
            getTileImage(xLocation, yLocation, xTile, yTile, currentZoom)
        );
    }
}

function removeVerticalTiles(xLocation) {
    //yLocation ranges from mapCoords.top to mapCoords.bottom
    const imgList = Object.values(
        svgMapTiles.getElementsByClassName("map-tile")
    ).filter((img) => {
        return +img.getAttribute("x") === xLocation;
    });
    for (let img of imgList) {
        svgMapTiles.removeChild(img);
    }
}

function removeHorizontalTiles(yLocation) {
    //xLocation ranges from mapCoords.left to mapCoords.right
    const imgList = Object.values(
        svgMapTiles.getElementsByClassName("map-tile")
    ).filter((img) => {
        return +img.getAttribute("y") === yLocation;
    });
    for (let img of imgList) {
        svgMapTiles.removeChild(img);
    }
}

function updateViewBox(min_x, min_y, width, height) {
    viewBoxCoords.min_x = min_x;
    viewBoxCoords.min_y = min_y;
    viewBoxCoords.width = width;
    viewBoxCoords.height = height;
    svgMap.setAttribute(
        "viewBox",
        min_x + " " + min_y + " " + width + " " + height
    );
}

function drawMap(locationX, locationY, tileX, tileY, zoom) {
    //Clear map tiles and svg overlay
    svgMapTiles.innerHTML = "";
    svgRegions.innerHTML = "";

    //Reset viewBox
    updateViewBox(
        viewport.min_x,
        viewport.min_y,
        viewport.width,
        viewport.height
    );

    mapCoords.left =
        locationX -
        Math.ceil((locationX - svgMapRect.left) / TILE_SIZE) * TILE_SIZE;
    mapCoords.top =
        locationY -
        Math.ceil((locationY - svgMapRect.top) / TILE_SIZE) * TILE_SIZE;

    tileCoords.min_x =
        tileX - Math.ceil((locationX - svgMapRect.left) / TILE_SIZE);
    tileCoords.min_y =
        tileY - Math.ceil((locationY - svgMapRect.top) / TILE_SIZE);

    let currentLocationY = mapCoords.top,
        currentTileY = tileCoords.min_y;
    let currentLocationX = mapCoords.left,
        currentTileX = tileCoords.min_x;

    while (currentLocationY < svgMapRect.bottom) {
        currentLocationX = mapCoords.left;
        currentTileX = tileCoords.min_x;
        while (currentLocationX < svgMapRect.right) {
            svgMapTiles.appendChild(
                getTileImage(
                    currentLocationX,
                    currentLocationY,
                    currentTileX,
                    currentTileY,
                    zoom
                )
            );
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
    mapping = (lat, lng) => {
        let pixelCoords = latlngToPixelCoords(lat, lng, zoom);
        return {
            x: pixelCoords.x + locationX - tileX * TILE_SIZE,
            y: pixelCoords.y + locationY - tileY * TILE_SIZE,
        };
    };
    
    //Add geoJSON SVG Layer
    geojsonOverlay(regions, mapping, svgRegions);

    //Add Heat Map Overlay
    ctx.translate(canvasViewBox.left, canvasViewBox.top);
    canvasViewBox.left = 0;
    canvasViewBox.top = 0;
    heatmapOverlay(aqv_points, mapping, ctx, canvasViewBox);
}

//initialize map
//Note: Rounding the locations because floating translated values create blurry tiles
drawMap(
    Math.round(viewport.width / 2) - 100,
    Math.round(viewport.height / 2) - 170,
    5755,
    3654,
    currentZoom
);

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

        canvasViewBox.left -= dx;
        canvasViewBox.top -= dy;

        ctx.translate(dx, dy);
        heatmapOverlay(aqv_points, mapping, ctx, canvasViewBox);

        updateViewBox(
            viewBoxCoords.min_x - dx,
            viewBoxCoords.min_y - dy,
            viewBoxCoords.width,
            viewBoxCoords.height
        );

        //Logic for on-demand tile loading
        if (viewBoxCoords.min_x < mapCoords.left) {
            //console.log("load left tiles");
            mapCoords.left -= TILE_SIZE;
            tileCoords.min_x--;
            loadVerticalTiles(mapCoords.left, tileCoords.min_x);
        } else if (
            viewBoxCoords.min_x + viewBoxCoords.width >
            mapCoords.right
        ) {
            //console.log("load right tiles");
            tileCoords.max_x++;
            loadVerticalTiles(mapCoords.right, tileCoords.max_x);
            mapCoords.right += TILE_SIZE;
        }

        if (viewBoxCoords.min_y < mapCoords.top) {
            //console.log("load top tiles");
            mapCoords.top -= TILE_SIZE;
            tileCoords.min_y--;
            loadHorizontalTiles(mapCoords.top, tileCoords.min_y);
        } else if (
            viewBoxCoords.min_y + viewBoxCoords.height >
            mapCoords.bottom
        ) {
            //console.log("load bottom tiles");
            tileCoords.max_y++;
            loadHorizontalTiles(mapCoords.bottom, tileCoords.max_y);
            mapCoords.bottom += TILE_SIZE;
        }

        //Logic for on demand tile removal
        if (viewBoxCoords.min_x > mapCoords.left + TILE_SIZE) {
            //console.log("remove left tiles");
            removeVerticalTiles(mapCoords.left);
            mapCoords.left += TILE_SIZE;
            tileCoords.min_x++;
        } else if (
            viewBoxCoords.min_x + viewBoxCoords.width <
            mapCoords.right - TILE_SIZE
        ) {
            //console.log("remove right tiles");
            mapCoords.right -= TILE_SIZE;
            tileCoords.max_x--;
            removeVerticalTiles(mapCoords.right);
        }

        if (viewBoxCoords.min_y > mapCoords.top + TILE_SIZE) {
            //console.log("remove top tiles");
            removeHorizontalTiles(mapCoords.top);
            mapCoords.top += TILE_SIZE;
            tileCoords.min_y++;
        } else if (
            viewBoxCoords.min_y + viewBoxCoords.height <
            mapCoords.bottom - TILE_SIZE
        ) {
            //console.log("remove bottom tiles");
            mapCoords.bottom -= TILE_SIZE;
            tileCoords.max_y--;
            removeHorizontalTiles(mapCoords.bottom);
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
    let tileDOM = document
        .elementsFromPoint(event.clientX, event.clientY)
        .filter((dom) => {
            return dom.getAttribute("class") === "map-tile";
        })[0];

    let [oldTileX, oldTileY] = tileDOM.getAttribute("id").split(",");

    let rect = tileDOM.getBoundingClientRect();

    let newTileX, newTileY, tileLocationX, tileLocationY;

    if (event.deltaY > 0 && currentZoom >= 3) {
        //zoom out

        newTileX = Math.floor(oldTileX / 2);
        newTileY = Math.floor(oldTileY / 2);

        tileLocationX = (x + rect.x - (oldTileX & 1) * rect.width) / 2;
        tileLocationY = (y + rect.y - (oldTileY & 1) * rect.height) / 2;

        currentZoom--;

        //Note: Rounding the locations because floating point translated values create blurry tiles
        drawMap(
            Math.round(tileLocationX),
            Math.round(tileLocationY),
            newTileX,
            newTileY,
            currentZoom
        );
    } else if (event.deltaY < 0 && currentZoom <= 18) {
        //zoom in

        //Get the required sub-tile on which zoom is performed
        //(xFactor, yFactor) => (0,0) top left subtile, (1,0) top right subtile, (0,1) bottom left subtile, (1,1) bottom right subtile
        let xFactor = Math.round((x - rect.left) / rect.width);
        let yFactor = Math.round((y - rect.top) / rect.height);

        newTileX = 2 * oldTileX + xFactor;
        newTileY = 2 * oldTileY + yFactor;

        tileLocationX = 2 * rect.x - x + xFactor * rect.width;
        tileLocationY = 2 * rect.y - y + yFactor * rect.height;

        currentZoom++;

        //Note: Rounding the locations because floating point translated values create blurry tiles
        drawMap(
            Math.round(tileLocationX),
            Math.round(tileLocationY),
            newTileX,
            newTileY,
            currentZoom
        );
    }
});
