"use strict";

let legendContainer = document.querySelector(".legend-container");
let map = document.getElementById("map");

let legendAdd = document.getElementById("legend-add");

let legends = document.getElementsByClassName("legend");

legendAdd.addEventListener("click", function () {
    let legend = document.createElement("div");
    legend.classList.add("legend");

    let legendHead = document.createElement("div");
    legendHead.classList.add("legend-head");

    let legendTitle = document.createElement("span");
    legendTitle.classList.add("legend-title");
    legendTitle.innerHTML = "Legend " + Math.random().toString().substr(2, 5);

    let legendRemove = document.createElement("span");
    legendRemove.classList.add("legend-remove");
    legendRemove.innerHTML = '<i class="fas fa-trash-alt"></i>';

    legendRemove.addEventListener("click", function (event) {
        legend.parentNode.removeChild(legend);
    });

    let legendBody = document.createElement("div");
    legendBody.classList.add("legend-body");
    legendBody.innerHTML = "Legend Body";

    legendHead.appendChild(legendTitle);
    legendHead.appendChild(legendRemove);
    
    legend.appendChild(legendHead);
    legend.appendChild(legendBody);
    
    legendContainer.appendChild(legend);
});


/*
const minLegendWidth = "200px";
const maxLegendWidth = "500px";

let resizable = false;

let prevX = 0;
let prevY = 0;

legend.addEventListener("mousedown", mousedown);
legend.addEventListener("mousemove", mousemove);

function mousemove(event) {
    //const rect = legend.getBoundingClientRect();
    if (event.offsetX < 5) {
        this.style.cursor = "ew-resize";
        resizable = true;
    } else {
        this.style.cursor = "default";
        resizable = false;
    }
    console.log();
}

function mousedown(event) {
    if (resizable) {
        prevX = event.clientX;
        prevY = event.clientY;

        window.addEventListener("mousemove", mousemove);
        window.addEventListener("mouseup", mouseup);

        function mousemove(event) {            

            const rect = legend.getBoundingClientRect();
            const mapRect = map.getBoundingClientRect();
            if (prevX > event.clientX && legend.style.width < maxLegendWidth) {
                //dragged left
                legend.style.width =
                    Math.floor(rect.width + (prevX - event.clientX)) + "px";
                map.style.width =
                    Math.floor(mapRect.width - (prevX - event.clientX)) + "px";
                prevX = event.clientX;
                prevY = event.clientY;
            } else if (prevX < event.clientX && legend.style.width > minLegendWidth) {
                //dragged right
                legend.style.width =
                    Math.floor(rect.width + (prevX - event.clientX)) + "px";
                map.style.width =
                    Math.floor(mapRect.width - (prevX - event.clientX)) + "px";
                prevX = event.clientX;
                prevY = event.clientY;
            }

            console.log(legend.style.width);
        }

        function mouseup() {
            window.removeEventListener("mousemove", mousemove);
            window.removeEventListener("mouseup", mouseup);
            resizable = false;
        }
    }
}
*/
