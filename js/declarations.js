"use strict";

export const TILE_SIZE = 256;

//Gradients
export const gradientBlackAquaWhite = [
    {
        value: 0,
        color: "black",
    },
    {
        value: 0.5,
        color: "aqua",
    },
    {
        value: 1.0,
        color: "white",
    },
];

export const gradientIncandescent = [
    {
        value: 0,
        color: "black",
    },
    {
        value: 0.33,
        color: "#8b0000", //Dark Red
    },
    {
        value: 0.66,
        color: "yellow",
    },
    {
        value: 1.0,
        color: "white",
    },
];

export const gradientHeatedMetal = [
    {
        value: 0,
        color: "black",
    },
    {
        value: 0.4,
        color: "purple",
    },
    {
        value: 0.6,
        color: "red",
    },
    {
        value: 0.8,
        color: "yellow",
    },
    {
        value: 1.0,
        color: "white",
    },
];

export const gradientVisibleSpectrum = [
    {
        value: 0,
        color: "purple",
    },
    {
        value: 0.25,
        color: "blue",
    },
    {
        value: 0.5,
        color: "green",
    },
    {
        value: 0.75,
        color: "yellow",
    },
    {
        value: 1.0,
        color: "red",
    },
];

export const gradientCustom = [
    {
        value: 0,
        color: "blue",
    },    
    {
        value: 0.5,
        color: "cyan",
    },
    {
        value: 0.7,
        color: "lime",
    },
    {
        value: 0.8,
        color: "yellow",
    },
    {
        value: 1.0,
        color: "red",
    },
];

export const defaultParameters = {
    airQuality: {
      o3: {
        enable: true,
        ranges: [33, 65, 120, 180, 240],
      },
      pm25: {
        enable: true,
        ranges: [5, 10, 20, 25, 60],
      },
      pm10: {
        enable: true,
        ranges: [10, 20, 35, 50, 100],
      },
      no2: {
        enable: true,
        ranges: [25, 50, 100, 200, 400],
      },
      so2: {
        enable: true,
        ranges: [25, 50, 120, 350, 500],
      },
      co: {
        enable: true,
        ranges: [1, 2, 4, 10, 30],
      },
      nh3: {
        enable: true,
        ranges: [3, 7.5, 37.5, 15000, 150000],
      },
    },
    demographic: {
  
    }
  }