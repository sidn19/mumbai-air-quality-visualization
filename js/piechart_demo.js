"use strict";

import { createPieChart } from './piechart.js';

const categories = [
    {
        type: "male",
        value: 55,
        color: "#0275d8",
    },
    {
        type: "female",
        value: 40,
        color: "#fb98d4",
    },
    {
        type: "others",
        value: 5,
        color: "#1e0166",
    },
];

document.getElementById("piechart").append(createPieChart(categories, 500, true, 0));