"use strict";

/**
 * 
 * @param {{ type: string, value: number, color: string }[]} categories 
 * @param {number} size - Width and Height of the piechart
 * @param {boolean} clockwise - Whether piechart should show data in clockwise direction else in anti-clockwise direction
 * @param {number} startingAngle - Angle from which piechart should start (angle is in degrees)
 */

export function createPieChart(categories, size, clockwise = true, startingAngle = 0) {
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", size);
    svg.setAttribute("height", size);
    svg.setAttribute("viewBox", "-1 -1 2 2");

    let currentAngle = startingAngle;
    let total = categories.reduce((total, category) => {
        return total + category.value;
    }, 0);

    for (let category of categories) {
        let angle = (360 * category.value) / total;
        let newX = Math.cos((angle * Math.PI) / 180);
        let newY = Math.sin((angle * Math.PI) / 180);

        let sweep_flag = 1; //positive angle direction
        let large_arc_flag = angle > 180 ? 1 : 0;

        let pathString = `M0,0 L1,0 A1,1 0 ${large_arc_flag},${sweep_flag} ${newX},${newY} L0,0Z`;

        let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", pathString);
        path.setAttribute("fill", category.color);

        if (clockwise) {
            path.setAttribute("transform", `rotate(${currentAngle})`);
            currentAngle += angle;
        } else {
            currentAngle -= angle;
            path.setAttribute("transform", `rotate(${currentAngle})`);
        }

        svg.appendChild(path);
    }
    return svg;
}


