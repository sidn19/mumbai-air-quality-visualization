"use strict";

export const TILE_SIZE = 256;

//Gradients
//Must define for value 0 and 1, otherwise intermediate gradients may not work
export const gradientBlackAquaWhite = [
    {
        value: 0,
        color: 0x000000, //Black
    },
    {
        value: 0.5,
        color: 0x00ffff, //Aqua
    },
    {
        value: 1.0,
        color: 0xffffff, //White
    },
];

export const gradientIncandescent = [
    {
        value: 0,
        color: 0x000000, //Black
    },
    {
        value: 0.33,
        color: 0x8b0000, //Dark Red
    },
    {
        value: 0.66,
        color: 0xffff00, //Yellow
    },
    {
        value: 1.0,
        color: 0xffffff, //White
    },
];

export const gradientHeatedMetal = [
    {
        value: 0,
        color: 0x000000, //Black
    },
    {
        value: 0.4,
        color: 0x800080, //Purple
    },
    {
        value: 0.6,
        color: 0xff0000, //Red
    },
    {
        value: 0.8,
        color: 0xffff00, //Yellow
    },
    {
        value: 1.0,
        color: 0xffffff, //White
    },
];

export const gradientVisibleSpectrum = [
    {
        value: 0,
        color: 0xff00ff, //Purple
    },
    {
        value: 0.25,
        color: 0x0000ff, //Blue
    },
    {
        value: 0.5,
        color: 0x00ff00, //Green
    },
    {
        value: 0.75,
        color: 0xffff00, //Yellow
    },
    {
        value: 1.0,
        color: 0xff0000, //Red
    },
];

export const gradientCustom = [
    {
        value: 0,
        color: 0x0000ff, //Blue
    },
    {
        value: 0.2,
        color: 0x0000ff, //Blue
    },
    {
        value: 0.5,
        color: 0x00ffff, //Cyan
    },
    {
        value: 0.7,
        color: 0xbfff00, //Lime
    },
    {
        value: 0.8,
        color: 0xffff00, //Yellow
    },
    {
        value: 1.0,
        color: 0xff0000, //Red
    },
];