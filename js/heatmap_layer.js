"use strict";

import {
    gradientBlackAquaWhite,
    gradientIncandescent,
    gradientHeatedMetal,
    gradientVisibleSpectrum,
    gradientCustom,
} from "./declarations.js";

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
// const brush = new Image();
// brush.src = brushCanvas.toDataURL();

const gradientColors = gradientIncandescent;

function getColorValue(value, color_value_gradient_map) {
    //Pending: get boundaries of value efficiently

    for (let i = 0; i < color_value_gradient_map.length - 1; i++) {
        if (
            color_value_gradient_map[i].value <= value &&
            value <= color_value_gradient_map[i + 1].value
        ) {
            let value1 = color_value_gradient_map[i].value;
            let value2 = color_value_gradient_map[i + 1].value;
            let color1 = color_value_gradient_map[i].color;
            let color2 = color_value_gradient_map[i + 1].color;

            let percent = (value - value1) / (value2 - value1);

            let color1red = (color1 >> 16) & 0xff;
            let color1green = (color1 >> 8) & 0xff;
            let color1blue = color1 & 0xff;

            return {
                red:
                    (color1red +
                        percent * (((color2 >> 16) & 0xff) - color1red)) |
                    0,
                green:
                    (color1green +
                        percent * (((color2 >> 8) & 0xff) - color1green)) |
                    0,
                blue:
                    (color1blue + percent * ((color2 & 0xff) - color1blue)) | 0,
            };
        }
    }
}

export function heatmapOverlay(data, mapping, context, canvasViewBox) {
    context.clearRect(
        canvasViewBox.left,
        canvasViewBox.top,
        canvasViewBox.width,
        canvasViewBox.height
    );

    //console.log("heatmapOverlay called");

    for (let point of data) {
        context.globalAlpha = point[2];
        const pixelCoords = mapping(point[1], point[0]);

        //console.log(pixelCoords, point[2]);
        context.drawImage(
            brushCanvas,
            pixelCoords.x - brushRadius,
            pixelCoords.y - brushRadius
        );
    }

    context.globalAlpha = 1;

    let imageData = context.getImageData(
        0,
        0,
        canvasViewBox.width,
        canvasViewBox.height
    );
    let pixels = imageData.data;
    let len = pixels.length;
    for (let i = 0; i < len; i += 4) {
        //Skip processing transparent regions
        if (pixels[i + 3] === 0) continue;

        let colorValue = getColorValue(pixels[i + 3] / 256, gradientColors);
        pixels[i] = colorValue.red;
        pixels[i + 1] = colorValue.green;
        pixels[i + 2] = colorValue.blue;

        //Change opacity of heatmap after colorizing
        //pixels[i + 3] = 255;
    }
    context.putImageData(imageData, 0, 0);
}
