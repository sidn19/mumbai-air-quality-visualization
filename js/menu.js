"use strict";

let menus = document.getElementsByClassName("menu");

let menuItems = document.getElementsByClassName("menu-item");

let menuActive = false;

let showWorldMap = true;
let showVectorMap = true;
let showLegend = true;

function menuAction(menuItem) {
    let id = menuItem.getAttribute("id");
    switch (id) {
        case "mi-open-dataset":
            console.log("Open Dataset");
            break;
        case "mi-open-polygons":
            console.log("Open Polygons");
            break;
        case "mi-world-map":
            if (showWorldMap) {
                showWorldMap = false;
                menuItem.querySelector(".tick").style.visibility = "hidden";
            } else {
                showWorldMap = true;
                menuItem.querySelector(".tick").style.visibility = "";
            }
            break;
        case "mi-vector-map":
            if (showVectorMap) {
                showVectorMap = false;
                menuItem.querySelector(".tick").style.visibility = "hidden";
            } else {
                showVectorMap = true;
                menuItem.querySelector(".tick").style.visibility = "";
            }
            break;
        case "mi-legend":
            if (showLegend) {
                showLegend = false;
                menuItem.querySelector(".tick").style.visibility = "hidden";
                document.getElementById("legend-panel").style.display = "none";
                //map.style.width = "98%";
            } else {
                showLegend = true;
                menuItem.querySelector(".tick").style.visibility = "";
                document.getElementById("legend-panel").style.display = "";
                //legend.style.width = "28.8%";
                //map.style.width = "67.2%";
            }
            break;
        default:
            break;
    }
}

function hideAllMenus(menus) {
    for (let menu of menus) {
        menu.querySelector(".menu-item-container").style.display = "none";
    }
}

for (let menu of menus) {
    menu.addEventListener("click", function () {
        if (menuActive) {
            menuActive = false;
            hideAllMenus(menus);
        } else {
            menuActive = true;
            this.querySelector(".menu-item-container").style.display = "block";
        }
    });

    menu.addEventListener("mouseover", function () {
        if (menuActive) {
            hideAllMenus(menus);
            this.querySelector(".menu-item-container").style.display = "block";
        }
        for (let m of menus) {
            m.style.backgroundColor = "";
        }
        this.style.backgroundColor = "#007BFF";
    });

    menu.addEventListener("mouseout", function () {
        if (menuActive) {
        } else {
            this.style.backgroundColor = "";
        }
    });
}

for (let menuItem of menuItems) {
    menuItem.addEventListener("click", function () {
        menuAction(this);
    });
}

window.onclick = function (event) {
    if (!event.target.matches(".menu, .menu *") && menuActive) {
        menuActive = false;
        hideAllMenus(menus);
        for (let m of menus) {
            m.style.backgroundColor = "";
        }
    }
};
