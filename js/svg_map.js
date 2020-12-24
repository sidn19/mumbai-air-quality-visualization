const mapContainer = document.getElementById("map-container");
const svgMap = document.getElementById("svg-map");

const TILE_SIZE = 256;

//tileCoords represents Tile Coordinate System
let tileCoords = {
    min_x: 0,
    min_y: 0,
    max_x: 0,
    max_y: 0,
};

//mapCoords represents the extreme positions of the map tile group
let mapCoords = {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
};

let viewport = {
    min_x: svgMap.getBoundingClientRect().left,
    min_y: svgMap.getBoundingClientRect().top,
    width: svgMap.getBoundingClientRect().width,
    height: svgMap.getBoundingClientRect().height,
};

let viewBoxCoords = {
    min_x: svgMap.getBoundingClientRect().left,
    min_y: svgMap.getBoundingClientRect().top,
    width: svgMap.getBoundingClientRect().width,
    height: svgMap.getBoundingClientRect().height,
};

let currentZoom = 13;

function getTileUrl(x, y, zoom) {
    return `https://a.tile.openstreetmap.org/${zoom}/${x}/${y}.png`;
}

function coordsToTile(lat, lng, zoom) {
    let z = 1 << zoom;
    return {
        x: Math.floor(((lng + 180) / 360) * z),
        y: Math.floor(
            ((1 -
                Math.log(
                    Math.tan((lat * Math.PI) / 180) +
                        1 / Math.cos((lat * Math.PI) / 180)
                ) /
                    Math.PI) /
                2) *
                z
        ),
    };
}

function getTileImage(xLocation, yLocation, xTile, yTile, zoom) {
    const img = document.createElementNS("http://www.w3.org/2000/svg", "image");
    img.setAttributeNS(null, "height", TILE_SIZE);
    img.setAttributeNS(null, "width", TILE_SIZE);
    img.setAttributeNS(null, "class", "map-tile");
    img.setAttributeNS(null, "x", xLocation);
    img.setAttributeNS(null, "y", yLocation);
    img.setAttributeNS(
        "http://www.w3.org/1999/xlink",
        "href",
        getTileUrl(xTile, yTile, zoom)
    );
    return img;
}

function loadVerticalTiles(xLocation, xTile) {
    //yLocation ranges from mapCoords.top to mapCoords.bottom (excluding mapCoords.bottom)
    //yTile ranges from tileCoords.min_y to tileCoords.max_y

    for (
        let yLocation = mapCoords.top, yTile = tileCoords.min_y;
        yLocation < mapCoords.bottom;
        yLocation += TILE_SIZE, yTile++
    ) {
        svgMap.appendChild(
            getTileImage(xLocation, yLocation, xTile, yTile, currentZoom)
        );
    }
}

function loadHorizontalTiles(yLocation, yTile) {
    //xLocation ranges from mapCoords.left to mapCoords.right (excluding mapCoords.right)
    //yTile ranges from tileCoords.min_y to tileCoords.max_y

    for (
        let xLocation = mapCoords.left, xTile = tileCoords.min_x;
        xLocation < mapCoords.right;
        xLocation += TILE_SIZE, xTile++
    ) {
        svgMap.appendChild(
            getTileImage(xLocation, yLocation, xTile, yTile, currentZoom)
        );
    }
}

function removeVerticalTiles(xLocation) {
    //yLocation ranges from mapCoords.top to mapCoords.bottom
    const imgList = Object.values(
        svgMap.getElementsByClassName("map-tile")
    ).filter((img) => {
        return +img.getAttribute("x") === xLocation;
    });
    for (let img of imgList) {
        svgMap.removeChild(img);
    }
}

function removeHorizontalTiles(yLocation) {
    //xLocation ranges from mapCoords.left to mapCoords.right
    const imgList = Object.values(
        svgMap.getElementsByClassName("map-tile")
    ).filter((img) => {
        return +img.getAttribute("y") === yLocation;
    });
    for (let img of imgList) {
        svgMap.removeChild(img);
    }
}

function updateViewBox(min_x, min_y, width, height) {
    viewBoxCoords.min_x = min_x;
    viewBoxCoords.min_y = min_y;
    viewBoxCoords.width = width;
    viewBoxCoords.height = height;
    svgMap.setAttribute(
        "viewBox",
        min_x + " " + min_y + " " + width + " " + height
    );
}

function drawMap(xLocation, yLocation, xTile, yTile, zoom) {
    //Clear map tiles if any
    //Need to loop backwards because everytime the nodes get deleted, the indexes are reorganized
    let tiles = svgMap.getElementsByClassName('map-tile');
    for(let i=tiles.length - 1; i >= 0; i--)
    {
        tiles[i].remove();
    }

    //Reset viewBox
    updateViewBox(
        viewport.min_x,
        viewport.min_y,
        viewport.width,
        viewport.height
    );

    const rect = svgMap.getBoundingClientRect();

    let startLocationX =
        xLocation - Math.ceil((xLocation - rect.left) / TILE_SIZE) * TILE_SIZE;
    let startLocationY =
        yLocation - Math.ceil((yLocation - rect.top) / TILE_SIZE) * TILE_SIZE;

    let startTileX = xTile - Math.ceil((xLocation - rect.left) / TILE_SIZE);
    let startTileY = yTile - Math.ceil((yLocation - rect.top) / TILE_SIZE);

    mapCoords.left = startLocationX;
    mapCoords.top = startLocationY;

    tileCoords.min_x = startTileX;
    tileCoords.min_y = startTileY;

    let yLoc = startLocationY,
        _yTile = startTileY;
    let xLoc = startLocationX,
        _xTile = startTileX;

    for (; yLoc < rect.bottom; yLoc += TILE_SIZE, _yTile++) {
        xLoc = startLocationX;
        _xTile = startTileX;
        for (; xLoc < rect.right; xLoc += TILE_SIZE, _xTile++) {            
            svgMap.appendChild(getTileImage(xLoc, yLoc, _xTile, _yTile, zoom));
        }
    }

    mapCoords.right = xLoc;
    mapCoords.bottom = yLoc;

    tileCoords.max_x = _xTile - 1;
    tileCoords.max_y = _yTile - 1;

    //console.log(mapCoords, tileCoords);

    /*const obj = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    obj.setAttributeNS(null, "x", xLocation);
    obj.setAttributeNS(null, "y", yLocation);
    obj.setAttributeNS(null, "height", TILE_SIZE);
    obj.setAttributeNS(null, "width", TILE_SIZE);
    obj.setAttributeNS(null, "fill", "#AA0000AA");
    svgMap.appendChild(obj);*/
}

//initialize map
//Note: Rounding the locations because floating translated values create blurry tiles
drawMap(
    Math.round(viewport.width / 2) - 100,
    Math.round(viewport.height / 2) - 170,
    5755,
    3654,
    currentZoom
);

/**
 * Panning Functionality
 */
svgMap.addEventListener("mousedown", mousedown);

function mousedown(event) {
    svgMap.style.cursor = "grabbing";
    window.addEventListener("mousemove", mousemove);
    window.addEventListener("mouseup", mouseup);

    let prevX = event.clientX,
        prevY = event.clientY;

    function mousemove(event) {
        let newX = event.clientX,
            newY = event.clientY;
        let dx = newX - prevX,
            dy = newY - prevY;
        updateViewBox(
            viewBoxCoords.min_x - dx,
            viewBoxCoords.min_y - dy,
            viewBoxCoords.width,
            viewBoxCoords.height
        );

        //Logic for on demand tile loading
        if (viewBoxCoords.min_x < mapCoords.left) {
            //console.log("load left tiles");
            mapCoords.left -= TILE_SIZE;
            tileCoords.min_x--;
            loadVerticalTiles(mapCoords.left, tileCoords.min_x);
        }

        if (viewBoxCoords.min_y < mapCoords.top) {
            //console.log("load top tiles");
            mapCoords.top -= TILE_SIZE;
            tileCoords.min_y--;
            loadHorizontalTiles(mapCoords.top, tileCoords.min_y);
        }

        if (viewBoxCoords.min_x + viewBoxCoords.width > mapCoords.right) {
            //console.log("load right tiles");
            tileCoords.max_x++;
            loadVerticalTiles(mapCoords.right, tileCoords.max_x);
            mapCoords.right += TILE_SIZE;
        }

        if (viewBoxCoords.min_y + viewBoxCoords.height > mapCoords.bottom) {
            //console.log("load bottom tiles");
            tileCoords.max_y++;
            loadHorizontalTiles(mapCoords.bottom, tileCoords.max_y);
            mapCoords.bottom += TILE_SIZE;
        }

        //Logic for on demand tile removal
        if (viewBoxCoords.min_x > mapCoords.left + TILE_SIZE) {
            //console.log("remove left tiles");
            removeVerticalTiles(mapCoords.left);
            mapCoords.left += TILE_SIZE;
            tileCoords.min_x++;
        }

        if (viewBoxCoords.min_y > mapCoords.top + TILE_SIZE) {
            //console.log("remove top tiles");
            removeHorizontalTiles(mapCoords.top);
            mapCoords.top += TILE_SIZE;
            tileCoords.min_y++;
        }

        if (
            viewBoxCoords.min_x + viewBoxCoords.width <
            mapCoords.right - TILE_SIZE
        ) {
            //console.log("remove right tiles");
            mapCoords.right -= TILE_SIZE;
            tileCoords.max_x--;
            removeVerticalTiles(mapCoords.right);
        }

        if (
            viewBoxCoords.min_y + viewBoxCoords.height <
            mapCoords.bottom - TILE_SIZE
        ) {
            //console.log("remove bottom tiles");
            mapCoords.bottom -= TILE_SIZE;
            tileCoords.max_y--;
            removeHorizontalTiles(mapCoords.bottom);
        }

        prevX = newX;
        prevY = newY;
    }

    function mouseup() {
        svgMap.style.cursor = "grab";
        window.removeEventListener("mousemove", mousemove);
        window.removeEventListener("mouseup", mouseup);
    }
}

function getTileFromURL(url) {
    let regex = /\/([0-9]+)\/([0-9]+).png$/;
    let result = url.match(regex);
    return {
        x: +result[1],
        y: +result[2],
    };
}

/**
 * Zooming Functionality
 */
svgMap.addEventListener("wheel", function (event) {
    event.preventDefault();

    let [x, y] = [event.clientX, event.clientY];

    //Get the Tile on which zoom was performed

    //Approach 1, but doesn't work when we have an overlay over map-tile
    let tileDOM = document.elementFromPoint(x, y);

    //Approach 2, Bulky but works when we have an overlay over map-tile
    /*let tileDOM = Object.values(document.getElementsByClassName('map-tile')).filter(mapTile => {
        let mapTileRect = mapTile.getBoundingClientRect();
        return mapTileRect.left <= x && x <= mapTileRect.right && mapTileRect.top <= y && y <= mapTileRect.bottom;
    })[0];*/
    //console.log(tileDOM);

    let tile = getTileFromURL(tileDOM.getAttribute("href"));

    let rect = tileDOM.getBoundingClientRect();

    let xTile, yTile, tileLocationX, tileLocationY;

    if (event.deltaY > 0 && currentZoom >= 3) {
        //zoom out

        xTile = Math.floor(tile.x / 2);
        yTile = Math.floor(tile.y / 2);

        //Get the main tile of which this is a sub-tile and identify the position of this sub-tile in main tile
        if ((tile.x & 1) === 0 && (tile.y & 1) === 0) {
            //Sub-tile is top left of the main tile

            //Calculate the location of the main tile
            tileLocationX = (x + rect.x) / 2;
            tileLocationY = (y + rect.y) / 2;
        } else if ((tile.x & 1) === 1 && (tile.y & 1) === 0) {
            //Sub-tile is top right of the main tile

            //Calculate the location of the main tile
            tileLocationX = (x + rect.x - rect.width) / 2;
            tileLocationY = (y + rect.y) / 2;
        } else if ((tile.x & 1) === 0 && (tile.y & 1) === 1) {
            //Sub-tile is bottom left of the main tile

            //Calculate the location of the main tile
            tileLocationX = (x + rect.x) / 2;
            tileLocationY = (y + rect.y - rect.height) / 2;
        } else if ((tile.x & 1) === 1 && (tile.y & 1) === 1) {
            //Sub-tile is bottom right of the main tile

            //Calculate the location of the main tile
            tileLocationX = (x + rect.x - rect.width) / 2;
            tileLocationY = (y + rect.y - rect.height) / 2;
        }
        currentZoom--;

        //Note: Rounding the locations because floating translated values create blurry tiles
        drawMap(
            Math.round(tileLocationX),
            Math.round(tileLocationY),
            xTile,
            yTile,
            currentZoom
        );
    } else if (event.deltaY < 0 && currentZoom <= 18) {
        //zoom in

        //Get the required sub-tile on which zoom is performed
        if (rect.top <= y && y < rect.top + rect.height / 2) {
            if (rect.left <= x && x < rect.left + rect.width / 2) {
                //Top Left sub-tile
                xTile = 2 * tile.x;
                yTile = 2 * tile.y;

                //Calculate the location of the subtile
                tileLocationX = 2 * rect.x - x;
                tileLocationY = 2 * rect.y - y;
            } else if (rect.left + rect.width / 2 <= x && x < rect.right) {
                //Top Right sub-tile
                xTile = 2 * tile.x + 1;
                yTile = 2 * tile.y;

                //Calculate the location of the subtile
                tileLocationX = 2 * rect.x - x + rect.width;
                tileLocationY = 2 * rect.y - y;
            }
        } else if (rect.top + rect.height / 2 <= y && y < rect.bottom) {
            if (rect.left <= x && x < rect.left + rect.width / 2) {
                //Bottom Left sub-tile
                xTile = 2 * tile.x;
                yTile = 2 * tile.y + 1;

                //Calculate the location of the subtile
                tileLocationX = 2 * rect.x - x;
                tileLocationY = 2 * rect.y - y + rect.height;
            } else if (rect.left + rect.width / 2 <= x && x < rect.right) {
                //Bottom Right sub-tile
                xTile = 2 * tile.x + 1;
                yTile = 2 * tile.y + 1;

                //Calculate the location of the subtile
                tileLocationX = 2 * rect.x - x + rect.width;
                tileLocationY = 2 * rect.y - y + rect.height;
            }
        }
        currentZoom++;

        //Note: Rounding the locations because floating translated values create blurry tiles
        drawMap(
            Math.round(tileLocationX),
            Math.round(tileLocationY),
            xTile,
            yTile,
            currentZoom
        );
    }
});

/**
 * For Debugging
 */
/*svgMap.addEventListener("click", function (event) {
    let x=event.clientX,y=event.clientY;

    let tileDOM = Object.values(
        document.getElementsByClassName("map-tile")
    ).filter((mapTile) => {
        let mapTileRect = mapTile.getBoundingClientRect();
        return (
            mapTileRect.left <= x &&
            x <= mapTileRect.right &&
            mapTileRect.top <= y &&
            y <= mapTileRect.bottom
        );
    })[0];
    console.log(tileDOM);
});*/
