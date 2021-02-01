"use strict";

import { gradientBlackAquaWhite, gradientIncandescent, gradientHeatedMetal, gradientVisibleSpectrum, gradientCustom, TILE_SIZE } from "./declarations.js";

function createBrush(brushSize, brushBlurSize) {
    let brushCanvas = document.createElement("canvas");

    // set brush size
    let r = brushSize + brushBlurSize;
    let d = r * 2;
    brushCanvas.width = d;
    brushCanvas.height = d;

    let brushContext = brushCanvas.getContext("2d");
    brushContext.shadowOffsetX = d;
    brushContext.shadowBlur = brushBlurSize;
    brushContext.shadowColor = "black";

    // draw circle in the left to the canvas
    brushContext.beginPath();
    brushContext.arc(-r, r, brushSize, 0, Math.PI * 2, true);
    brushContext.closePath();
    brushContext.fill();

    return brushCanvas;
}

const brushSize = 15;
const brushBlurSize = 25;
const brushRadius = brushSize + brushBlurSize;

const brushCanvas = createBrush(brushSize, brushBlurSize);

const gradientColors = gradientIncandescent;

let gradientCanvas = document.createElement("canvas");
let gradientCanvasContext = gradientCanvas.getContext("2d");

let gradient = gradientCanvasContext.createLinearGradient(0, 0, 0, 256);

for (let color of gradientColors) {
    gradient.addColorStop(color.value, color.color);
}

gradientCanvas.width = 1;
gradientCanvas.height = 256;

gradientCanvasContext.fillStyle = gradient;
gradientCanvasContext.fillRect(0, 0, 1, 256);

const gradientDataArray = gradientCanvasContext.getImageData(0, 0, 1, 256).data;

export function heatmapOverlay(data, container, mapCoords) {
    console.time("draw");

    for (let currentLocationY = mapCoords.top; currentLocationY < mapCoords.bottom; currentLocationY += TILE_SIZE) {
        for (let currentLocationX = mapCoords.left; currentLocationX < mapCoords.right; currentLocationX += TILE_SIZE) {
            let canvasTile = document.createElement("canvas");
            let canvasContext = canvasTile.getContext("2d");
            canvasTile.width = TILE_SIZE;
            canvasTile.height = TILE_SIZE;
            canvasTile.setAttribute("class", "canvas-tile");
            canvasTile.setAttribute("data-tx", currentLocationX);
            canvasTile.setAttribute("data-ty", currentLocationY);
            canvasTile.style.transform = `translate(${currentLocationX}px, ${currentLocationY}px)`;

            let noPointsToPlot = true;

            for (let point of data) {
                if (
                    point[0] > currentLocationX - brushRadius &&
                    point[0] < currentLocationX + TILE_SIZE + brushRadius &&
                    point[1] > currentLocationY - brushRadius &&
                    point[1] < currentLocationY + TILE_SIZE + brushRadius
                ) {
                    noPointsToPlot = false;
                    canvasContext.globalAlpha = point[2];
                    canvasContext.drawImage(brushCanvas, point[0] - currentLocationX - brushRadius, point[1] - currentLocationY - brushRadius);
                }
            }

            if(!noPointsToPlot) {
                let imageData = canvasContext.getImageData(0, 0, TILE_SIZE, TILE_SIZE);
                let pixels = imageData.data;
                let len = pixels.length;
                for (let i = 0; i < len; i += 4) {
                    //Skip processing transparent regions
                    if (pixels[i + 3] === 0) {
                        continue;
                    }
    
                    let index = pixels[i + 3] << 2;
                    pixels[i] = gradientDataArray[index];
                    pixels[i + 1] = gradientDataArray[index + 1];
                    pixels[i + 2] = gradientDataArray[index + 2];
                }
    
                canvasContext.putImageData(imageData, 0, 0);
    
                container.appendChild(canvasTile);
            }

            
        }
    }

    console.timeEnd("draw");
}

export function loadHorizontalCanvasTiles(data, container, mapCoords, yLocation) {
    for (let xLocation = mapCoords.left; xLocation < mapCoords.right; xLocation += TILE_SIZE) {
        let canvasTile = document.createElement("canvas");
        let canvasContext = canvasTile.getContext("2d");
        canvasTile.width = TILE_SIZE;
        canvasTile.height = TILE_SIZE;
        canvasTile.setAttribute("class", "canvas-tile");
        canvasTile.setAttribute("data-tx", xLocation);
        canvasTile.setAttribute("data-ty", yLocation);
        canvasTile.style.transform = `translate(${xLocation}px, ${yLocation}px)`;

        let noPointsToPlot = true;

        for (let point of data) {
            if (point[0] > xLocation - brushRadius && point[0] < xLocation + TILE_SIZE + brushRadius && point[1] > yLocation - brushRadius && point[1] < yLocation + TILE_SIZE + brushRadius) {
                noPointsToPlot = false;
                canvasContext.globalAlpha = point[2];
                canvasContext.drawImage(brushCanvas, point[0] - xLocation - brushRadius, point[1] - yLocation - brushRadius);
            }
        }

        if(!noPointsToPlot) {
            let imageData = canvasContext.getImageData(0, 0, TILE_SIZE, TILE_SIZE);
            let pixels = imageData.data;
            let len = pixels.length;
            for (let i = 0; i < len; i += 4) {
                //Skip processing transparent regions
                if (pixels[i + 3] === 0) {
                    continue;
                }
    
                let index = pixels[i + 3] << 2;
                pixels[i] = gradientDataArray[index];
                pixels[i + 1] = gradientDataArray[index + 1];
                pixels[i + 2] = gradientDataArray[index + 2];
            }
    
            canvasContext.putImageData(imageData, 0, 0);
    
            container.appendChild(canvasTile);
        }
    }
}

export function loadVerticalCanvasTiles(data, container, mapCoords, xLocation) {
    for (let yLocation = mapCoords.top; yLocation < mapCoords.bottom; yLocation += TILE_SIZE) {
        let canvasTile = document.createElement("canvas");
        let canvasContext = canvasTile.getContext("2d");
        canvasTile.width = TILE_SIZE;
        canvasTile.height = TILE_SIZE;
        canvasTile.setAttribute("class", "canvas-tile");
        canvasTile.setAttribute("data-tx", xLocation);
        canvasTile.setAttribute("data-ty", yLocation);
        canvasTile.style.transform = `translate(${xLocation}px, ${yLocation}px)`;

        let noPointsToPlot = true;

        for (let point of data) {
            if (point[0] > xLocation - brushRadius && point[0] < xLocation + TILE_SIZE + brushRadius && point[1] > yLocation - brushRadius && point[1] < yLocation + TILE_SIZE + brushRadius) {
                noPointsToPlot = false;
                canvasContext.globalAlpha = point[2];
                canvasContext.drawImage(brushCanvas, point[0] - xLocation - brushRadius, point[1] - yLocation - brushRadius);
            }
        }

        if(!noPointsToPlot) {
            let imageData = canvasContext.getImageData(0, 0, TILE_SIZE, TILE_SIZE);
            let pixels = imageData.data;
            let len = pixels.length;
            for (let i = 0; i < len; i += 4) {
                //Skip processing transparent regions
                if (pixels[i + 3] === 0) {
                    continue;
                }
    
                let index = pixels[i + 3] << 2;
                pixels[i] = gradientDataArray[index];
                pixels[i + 1] = gradientDataArray[index + 1];
                pixels[i + 2] = gradientDataArray[index + 2];
            }
    
            canvasContext.putImageData(imageData, 0, 0);
    
            container.appendChild(canvasTile);
        }
    }
}

export function removeHorizontalCanvasTiles(heatmapLayer, yLocation) {
    let tiles = heatmapLayer.getElementsByClassName("canvas-tile");
    for (let i = tiles.length - 1; i >= 0; i--) {
        if (tiles[i].getAttribute("data-ty") == yLocation) {
            tiles[i].remove();
        }
    }
}

export function removeVerticalCanvasTiles(heatmapLayer, xLocation) {
    let tiles = heatmapLayer.getElementsByClassName("canvas-tile");
    for (let i = tiles.length - 1; i >= 0; i--) {
        if (tiles[i].getAttribute("data-tx") == xLocation) {
            tiles[i].remove();
        }
    }
}
