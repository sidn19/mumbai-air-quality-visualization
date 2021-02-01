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

//Change RHS to desired gradient profile (profiles are imported)
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

export function addHeatmapTiles(data, container, min_x, min_y, max_x, max_y) {
    console.time("draw");

    for (let currentLocationY = min_y; currentLocationY < max_y; currentLocationY += TILE_SIZE) {
        for (let currentLocationX = min_x; currentLocationX < max_x; currentLocationX += TILE_SIZE) {
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

export function removeHeatmapTiles(container, min_x, min_y, max_x, max_y) {
    console.time("removeCanvasTiles");
    let tiles = container.getElementsByClassName("canvas-tile");
    for (let i = tiles.length - 1; i >= 0; i--) {
        let tx = +tiles[i].getAttribute("data-tx");
        let ty = +tiles[i].getAttribute("data-ty");
        if (tx >= min_x && tx < max_x && ty >= min_y && ty < max_y) {
            tiles[i].remove();
        }
    }
    console.timeEnd("removeCanvasTiles");
}
