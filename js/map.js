/**
 *
 * paneTopLeft/paneTopRight:
 * Initially contains the translated value of the top-left/bottom eight map tile
 * It changes dynamically on dragging
 *
 *
 * tileTopLeft/tileBottomRight:
 * Tile number with respect to initial center tile
 * It is an integer value
 * Negative value represents tile to the left or above the center tile
 * Positive value represents tile to the right or below the center tile
 * It only changes when new tile is added or existing tile is removed
 *
 *
 * mapTopLeft/mapBottomRight:
 * Contains the translated value of the top-left/bottom-right map tile
 * It only changes when new tile is added or existing tile is removed
 *
 *
 */

let map = document.getElementById('map');

let viewport = {
    x: 0,
    y: 0,
    width: map.getBoundingClientRect().width,
    height: map.getBoundingClientRect().height,
};

const TILE_SIZE = 256; //Tile size in pixels

let currentZoom = 12;

let coords = [19.034597998590936, 72.92177841567673];

let paneTopLeft = { x: 0, y: 0 };
let paneBottomRight = { x: 0, y: 0 };

let mapTopLeft = { x: 0, y: 0 };
let mapBottomRight = { x: 0, y: 0 };

let tileTopLeft = { x: 0, y: 0 };
let tileBottomRight = { x: 0, y: 0 };

document.getElementById("map-pane").style.transform = "translate(0,0)";

function getTileUrl(x, y, zoom) {
    return `https://a.tile.openstreetmap.org/${zoom}/${x}/${y}.png`;
}

function coordsToTile(lat, lon, zoom) {
    return {
        x: Math.floor(((lon + 180) / 360) * Math.pow(2, zoom)),
        y: Math.floor(
            ((1 -
                Math.log(
                    Math.tan((lat * Math.PI) / 180) +
                        1 / Math.cos((lat * Math.PI) / 180)
                ) /
                    Math.PI) /
                2) *
                Math.pow(2, zoom)
        ),
    };
}

function tileToCoords(xTile, yTile, zoom) {
    let lng = (xTile / Math.pow(2, zoom)) * 360 - 180;
    let n = Math.PI - (2 * Math.PI * yTile) / Math.pow(2, zoom);
    let lat = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));

    return {
        lat: lat,
        lng: lng,
    };
}

function getTileFromURL(url) {
    let regex = /\/([0-9]+)\/([0-9]+).png$/;
    let result = url.match(regex);
    return {
        x: +result[1],
        y: +result[2],
    };
}


function drawMap(xTile, yTile, zoom, x, y) {
    //const tile = coordsToTile(lat, lng, zoom);

    document.getElementById("map-pane").innerHTML = "";
    document.getElementById("map-pane").style.transform = "translate(0,0)";

    let cx = x - 128;
    let cy = y - 128;

    let tx = cx - Math.ceil(cx / 256) * 256;
    let ty = cy - Math.ceil(cy / 256) * 256;

    let xTileNum = xTile - Math.ceil(cx / 256);
    let yTileNum = yTile - Math.ceil(cy / 256);

    [paneTopLeft.x, paneTopLeft.y] = [tx, ty];

    [mapTopLeft.x, mapTopLeft.y] = [tx, ty];

    [tileTopLeft.x, tileTopLeft.y] = [xTileNum, yTileNum];

    for (; ty < viewport.height; yTileNum++, ty += 256) {
        tx = paneTopLeft.x;
        xTileNum = tileTopLeft.x;

        for (; tx < viewport.width; xTileNum++, tx += 256) {
            let map_tile = document.createElement("img");
            map_tile.classList.add("map-tile");
            map_tile.style.position = "absolute";
            map_tile.src = getTileUrl(xTileNum, yTileNum, zoom);
            map_tile.setAttribute("data-tile", xTileNum + ", " + yTileNum);

            map_tile.style.transform = "translate(" + tx + "px, " + ty + "px)";
            document.getElementById("map-pane").appendChild(map_tile);
        }
    }

    [paneBottomRight.x, paneBottomRight.y] = [tx, ty];

    [mapBottomRight.x, mapBottomRight.y] = [tx, ty];

    [tileBottomRight.x, tileBottomRight.y] = [xTileNum - 1, yTileNum - 1];

    // console.log("Tile:", tileTopLeft, tileBottomRight);
    // console.log("Map:", mapTopLeft, mapBottomRight);
    // console.log("Pane:", paneTopLeft, paneBottomRight);
}

let initTile = coordsToTile(coords[0], coords[1], currentZoom);
drawMap(
    initTile.x,
    initTile.y,
    currentZoom,
    viewport.width / 2,
    viewport.height / 2
);

document.getElementById("map").addEventListener("wheel", (event) => {
    event.preventDefault();

    let [x, y] = [event.clientX, event.clientY];
    let tileDOM = document.elementFromPoint(x, y);
    let tile = getTileFromURL(tileDOM.src);

    let rect = tileDOM.getBoundingClientRect();

    let xTile, yTile, tileLocationX, tileLocationY;

    if (event.deltaY > 0 && currentZoom >= 3) {
        //zoom out

        //Get the main tile of which this is a sub-tile and identify the position of this sub-tile in main tile        
        if(tile.x % 2 === 0 && tile.y % 2 === 0)
        {
            //Sub-tile is top left of the main tile
            xTile = tile.x / 2;
            yTile = tile.y / 2;

            //Calculate the location of the main tile
            tileLocationX = (x + rect.x) / 2 + 128;
            tileLocationY = (y + rect.y) / 2 + 128;
        }
        else if (tile.x % 2 !== 0 && tile.y % 2 === 0)
        {
            //Sub-tile is top right of the main tile
            xTile = Math.floor(tile.x / 2);
            yTile = tile.y / 2;

            //Calculate the location of the main tile
            tileLocationX = (x + rect.x - rect.width) / 2 + 128;
            tileLocationY = (y + rect.y) / 2 + 128;
        }
        else if (tile.x % 2 === 0 && tile.y % 2 !== 0)
        {
            //Sub-tile is bottom left of the main tile
            xTile = tile.x / 2;
            yTile = Math.floor(tile.y / 2);

            //Calculate the location of the main tile
            tileLocationX = (x + rect.x) / 2 + 128;
            tileLocationY = (y + rect.y - rect.height) / 2 + 128;
        }
        else if (tile.x % 2 !== 0 && tile.y % 2 !== 0)
        {
            //Sub-tile is bottom right of the main tile
            xTile = Math.floor(tile.x / 2);
            yTile = Math.floor(tile.y / 2);

            //Calculate the location of the main tile
            tileLocationX = (x + rect.x - rect.width) / 2 + 128;
            tileLocationY = (y + rect.y - rect.height) / 2 + 128;
        }
        currentZoom--;
        drawMap(xTile, yTile, currentZoom, tileLocationX, tileLocationY);
    } else if (event.deltaY < 0 && currentZoom <= 18) {
        //zoom in

        //Get the required sub-tile on which zoom is performed
        if (rect.top <= y && y < rect.top + rect.height / 2) {
            if (rect.left <= x && x < rect.left + rect.width / 2) {
                //Top Left
                xTile = 2 * tile.x;
                yTile = 2 * tile.y;

                //Calculate the location of the subtile
                tileLocationX = 2 * rect.x - x + 128;
                tileLocationY = 2 * rect.y - y + 128;
            } else if (rect.left + rect.width / 2 <= x && x < rect.right) {
                //Top Right
                xTile = 2 * tile.x + 1;
                yTile = 2 * tile.y;

                //Calculate the location of the subtile
                tileLocationX = 2 * rect.x - x + rect.width + 128;
                tileLocationY = 2 * rect.y - y + 128;
            }
        } else if (rect.top + rect.height / 2 <= y && y < rect.bottom) {
            if (rect.left <= x && x < rect.left + rect.width / 2) {
                //Bottom Left
                xTile = 2 * tile.x;
                yTile = 2 * tile.y + 1;

                //Calculate the location of the subtile
                tileLocationX = 2 * rect.x - x + 128;
                tileLocationY = 2 * rect.y - y + rect.height + 128;
            } else if (rect.left + rect.width / 2 <= x && x < rect.right) {
                //Bottom Right
                xTile = 2 * tile.x + 1;
                yTile = 2 * tile.y + 1;

                //Calculate the location of the subtile
                tileLocationX = 2 * rect.x - x + rect.width + 128;
                tileLocationY = 2 * rect.y - y + rect.height + 128;
            }
        }
        currentZoom++;
        drawMap(xTile, yTile, currentZoom, tileLocationX, tileLocationY);
    }
});

function getTranslateValue(element) {
    const str = element.style.transform;
    if (str === "") return [0, 0];

    let translation = str
        .substring(str.indexOf("(") + 1, str.indexOf(")"))
        .split(",")
        .map((x) => {
            x = x.substring(0, x.length - 2);
            return +x;
        });

    return translation;
    /*const regex = /([-.0-9]+)(?:px)?,\s?([-.0-9]+)(?:px)?/;
    let res = element.style.transform.match(regex);
    return [+res[1], +res[2]];*/
}

function loadVerticalTiles(xTile, tx) {
    //number of tiles = tileTopLeft.y to tileBottomRight.y
    //ty from mapTopLeft.y to mapBottomRight.y

    //const tile = coordsToTile(coords[0], coords[1], currentZoom);

    for (
        let yTile = tileTopLeft.y, ty = mapTopLeft.y;
        yTile <= tileBottomRight.y;
        yTile++, ty += 256
    ) {
        let map_tile = document.createElement("img");
        map_tile.classList.add("map-tile");
        map_tile.style.position = "absolute";
        map_tile.src = getTileUrl(xTile, yTile, currentZoom);
        map_tile.style.transform = "translate(" + tx + "px, " + ty + "px)";
        map_tile.setAttribute("data-tile", xTile + ", " + yTile);
        document.getElementById("map-pane").appendChild(map_tile);
    }
}

function loadHorizontalTiles(yTile, ty) {
    //number of tiles = tileTopLeft.x to tileBottomRight.x
    //tx from mapTopLeft.x to mapBottomRight.x

    //const tile = coordsToTile(coords[0], coords[1], currentZoom);

    for (
        let xTile = tileTopLeft.x, tx = mapTopLeft.x;
        xTile <= tileBottomRight.x;
        xTile++, tx += 256
    ) {
        let map_tile = document.createElement("img");
        map_tile.classList.add("map-tile");
        map_tile.style.position = "absolute";
        map_tile.src = getTileUrl(xTile, yTile, currentZoom);
        map_tile.style.transform = "translate(" + tx + "px, " + ty + "px)";
        map_tile.setAttribute("data-tile", xTile + ", " + yTile);
        document.getElementById("map-pane").appendChild(map_tile);
        //console.log(yTile,ty);
    }
}

function removeVerticalTiles(tx) {
    let tiles = Object.values(
        document.getElementsByClassName("map-tile")
    ).filter((tile) => {
        return getTranslateValue(tile)[0] === tx;
    });

    for (let tile of tiles) {
        tile.parentNode.removeChild(tile);
    }
}

function removeHorizontalTiles(ty) {
    let tiles = Object.values(
        document.getElementsByClassName("map-tile")
    ).filter((tile) => {
        return getTranslateValue(tile)[1] === ty;
    });

    for (let tile of tiles) {
        tile.parentNode.removeChild(tile);
    }
}

let panning = false;

document.getElementById("map").addEventListener("mousedown", mousedown);

document.getElementById("map-pane").addEventListener("click", function (event) {
    let tileDOM = document.elementFromPoint(event.clientX, event.clientY);

    let rect = tileDOM.getBoundingClientRect();
    console.log("Viewport:", event.clientX, event.clientY);
    console.log("dom rect:", rect);

    console.log(document.elementFromPoint(event.clientX, event.clientY));
});

document.getElementById("map").ondragstart = () => {
    return false;
};

function mousedown(event) {
    let prevX = event.clientX;
    let prevY = event.clientY;

    panning = true;

    window.addEventListener("mousemove", mousemove);
    window.addEventListener("mouseup", mouseup);

    function mousemove(event) {
        if (panning) {
            let newX = event.clientX;
            let newY = event.clientY;
            let dx = newX - prevX;
            let dy = newY - prevY;

            let map_pane = document.getElementById("map-pane");
            let [currentX, currentY] = getTranslateValue(map_pane);
            map_pane.style.transform =
                "translate(" +
                (currentX + dx) +
                "px, " +
                (currentY + dy) +
                "px)";

            paneTopLeft.x += dx;
            paneTopLeft.y += dy;

            paneBottomRight.x += dx;
            paneBottomRight.y += dy;

            //Logic for loading tiles
            if (paneTopLeft.x > 0) {
                //console.log("load left tiles");
                paneTopLeft.x -= 256;
                mapTopLeft.x -= 256;
                tileTopLeft.x--;
                loadVerticalTiles(tileTopLeft.x, mapTopLeft.x);
            }

            if (paneTopLeft.y > 0) {
                //console.log("load top tiles");
                paneTopLeft.y -= 256;
                mapTopLeft.y -= 256;
                tileTopLeft.y--;
                loadHorizontalTiles(tileTopLeft.y, mapTopLeft.y);
            }

            if (paneBottomRight.x < viewport.width) {
                //console.log("load right tiles");
                paneBottomRight.x += 256;
                tileBottomRight.x++;
                loadVerticalTiles(tileBottomRight.x, mapBottomRight.x);
                mapBottomRight.x += 256;
            }

            if (paneBottomRight.y < viewport.height) {
                //console.log("load bottom tiles");
                paneBottomRight.y += 256;
                tileBottomRight.y++;
                loadHorizontalTiles(tileBottomRight.y, mapBottomRight.y);
                mapBottomRight.y += 256;
            }

            //Logic for removing tiles
            if (paneBottomRight.x - 256 > viewport.width) {
                //console.log("remove right tiles");
                removeVerticalTiles(mapBottomRight.x - 256);
                mapBottomRight.x -= 256;
                paneBottomRight.x -= 256;
                tileBottomRight.x--;
            }

            if (paneBottomRight.y - 256 > viewport.height) {
                //console.log("remove bottom tiles");
                removeHorizontalTiles(mapBottomRight.y - 256);
                mapBottomRight.y -= 256;
                paneBottomRight.y -= 256;
                tileBottomRight.y--;
            }

            if (paneTopLeft.x + 256 < 0) {
                //console.log("remove left tiles");
                removeVerticalTiles(mapTopLeft.x);
                mapTopLeft.x += 256;
                paneTopLeft.x += 256;
                tileTopLeft.x++;
            }

            if (paneTopLeft.y + 256 < 0) {
                //console.log("remove top tiles");
                removeHorizontalTiles(mapTopLeft.y);
                mapTopLeft.y += 256;
                paneTopLeft.y += 256;
                tileTopLeft.y++;
            }

            prevX = newX;
            prevY = newY;
        }
    }

    function mouseup() {
        window.removeEventListener("mousemove", mousemove);
        window.removeEventListener("mouseup", mouseup);
        panning = false;
    }
}

//Window Resizing Handler
window.addEventListener('resize', function(event) {
    //console.log("Viewport:", viewport.width, viewport.height);
    //console.log("Window", window.innerWidth, window.innerHeight);    
    //redraw map relative to top left tile
    //alert("resized");
    drawMap(tileTopLeft.x, tileTopLeft.y, currentZoom, mapTopLeft.x + 128, mapTopLeft.y + 128);    
});