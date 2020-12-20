let currentZoom = 12;
let endRow = Math.ceil(window.innerHeight / 256) + 2;
let endCol = Math.ceil(window.innerWidth / 256) + 2;
let startRow = -1;
let startCol = -1;

const map = document.getElementById('svg-map');

let mouseButtonHeld = false;

const coords = [19.034597998590936, 72.92177841567673];

let resizeTimeout = null;

let currentCoords = {
    x: 0,
    y: 0
};

window.addEventListener('mousedown', () => mouseButtonHeld = true);

window.addEventListener('mouseup', () => mouseButtonHeld = false);

let previousPosition = null;
window.addEventListener('mousemove', event => {
    if (mouseButtonHeld && previousPosition !== null) {
        const x = event.x - previousPosition.x;
        const y = event.y - previousPosition.y;

        // pan map tiles
        for (let tile of map.children) {
            tile.setAttributeNS(null, 'x', parseInt(tile.getAttributeNS(null, 'x')) + x);
            tile.setAttributeNS(null, 'y', parseInt(tile.getAttributeNS(null, 'y')) + y);
        }

        currentCoords.x += x;
        currentCoords.y += y;
        
        const tile = coordsToTile(coords[0], coords[1], currentZoom);

        if ((window.innerWidth + Math.abs(currentCoords.x)) / 256 > endCol - startCol - 2.5) {
            if (currentCoords.x > 0) {
                console.log('new tile left');
                for (let x = startRow; x < endRow - 1; ++x) {
                    const refImg = document.getElementById(`tile${x}${startCol}`);

                    const img = appendImage(
                        parseInt(refImg.getAttributeNS(null, 'x')) - 256,
                        parseInt(refImg.getAttributeNS(null, 'y')),
                        `tile${x}${startCol - 1}`
                    );

                    img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', getTileUrl(tile.x + startCol - 5, tile.y + x - 3, currentZoom));
                }
                --startCol;
            }
            else {
                console.log('new tile right');
                for (let x = startRow; x < endRow - 1; ++x) {
                    const refImg = document.getElementById(`tile${x}${endCol - 2}`);
                    const img = appendImage(
                        parseInt(refImg.getAttributeNS(null, 'x')) + 256,
                        parseInt(refImg.getAttributeNS(null, 'y')),
                        `tile${x}${endCol - 1}`
                    );                    

                    img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', getTileUrl(tile.x + endCol - 5, tile.y + x - 3, currentZoom));
                }
                ++endCol;
            }
        }
        if ((window.innerHeight + Math.abs(currentCoords.y)) / 256 > endRow - startRow - 2.5) {
            if (currentCoords.y > 0) {
                console.log('new tile top');
                for (let y = startCol; y < endCol - 1; ++y) {
                    const refImg = document.getElementById(`tile${startRow}${y}`);

                    const img = appendImage(
                        parseInt(refImg.getAttributeNS(null, 'x')),
                        parseInt(refImg.getAttributeNS(null, 'y')) - 256,
                        `tile${startRow - 1}${y}`
                    );

                    img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', getTileUrl(tile.x + y - 4, tile.y + startRow - 4, currentZoom));
                }
                --startRow;
            }
            else {
                console.log('new tile bottom');
                for (let y = startCol; y < endCol - 1; ++y) {
                    const refImg = document.getElementById(`tile${endRow - 2}${y}`);

                    const img = appendImage(
                        parseInt(refImg.getAttributeNS(null, 'x')),
                        parseInt(refImg.getAttributeNS(null, 'y')) + 256,
                        `tile${endRow - 1}${y}`
                    );

                    img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', getTileUrl(tile.x + y - 4, tile.y + endRow - 4, currentZoom));
                }
                ++endRow;
            }
        }
        console.log(currentCoords);
    }

    previousPosition = {
        x: event.x,
        y: event.y
    };
});

window.onresize = () => {
    endRow = Math.ceil(window.innerHeight / 256);
    endCol = Math.ceil(window.innerWidth / 256);
    
    if (resizeTimeout !== null) {
        clearTimeout(resizeTimeout);
        resizeTimeout = null;
    }

    resizeTimeout = setTimeout(() => initialize(), 100);
}

function appendImage(x, y, id) {
    const img = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    img.setAttributeNS(null, 'height', 256);
    img.setAttributeNS(null, 'width', 256);
    img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', './images/grey.png');
    img.setAttributeNS(null, 'x', x);
    img.setAttributeNS(null, 'y', y);
    img.setAttributeNS(null, 'visibility', 'visible');
    img.setAttributeNS(null, 'id', id);
                    
    img.addEventListener('load', () => {
        const greyImg = document.getElementById(`g${id}`);
        greyImg.setAttributeNS(null, 'visibility', 'hidden');
    });
    map.appendChild(img);

    const greyImg = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    greyImg.setAttributeNS(null, 'height', 256);
    greyImg.setAttributeNS(null, 'width', 256);
    greyImg.setAttributeNS('http://www.w3.org/1999/xlink', 'href', './images/grey.png');
    greyImg.setAttributeNS(null, 'x', x);
    greyImg.setAttributeNS(null, 'y', y);
    greyImg.setAttributeNS(null, 'visibility', 'hidden');
    greyImg.setAttributeNS(null, 'id', `g${id}`);
    map.appendChild(greyImg);

    return img;
}

function getTileUrl(x, y, zoom) {
    return `https://a.tile.openstreetmap.org/${zoom}/${x}/${y}.png`;
}

function coordsToTile(lat, lon, zoom) {
    return {
        x: (Math.floor((lon + 180) / 360 * Math.pow(2, zoom))),
        y: (Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom)))
    };
}

function loadImageTiles(lat, lon, zoom) {
    const tile = coordsToTile(lat, lon, zoom);
    for (let x = startRow; x < endRow - 1; ++x) {
        for (let y = startCol; y < endCol - 1; ++y) {
            const gTile = document.getElementById(`gtile${x}${y}`);
            gTile.setAttributeNS(null, 'visibility', 'visible');

            const img = document.getElementById(`tile${x}${y}`);
            img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', getTileUrl(tile.x - Math.ceil(endCol / 2) + y, tile.y - Math.ceil(endRow / 2) + x, zoom));
        }
    }
}

function loadMap() {
    loadImageTiles(coords[0], coords[1], currentZoom);
}

function initialize() {
    while (map.lastChild) {
        map.removeChild(map.lastChild);
    }
    
    for (let row = startRow; row < endRow - 1; ++row) {
        for (let col = startCol; col < endCol - 1; ++col) {
            appendImage(col * 256, row * 256, `tile${row}${col}`);
        }
    }
    loadMap();
}

initialize();



window.addEventListener('wheel', event => {
    if (event.deltaY > 0) {
        // scrolled down
        if (currentZoom >= 5) {
            currentZoom -= 1;
            loadMap();
        }
    }
    // scrolled up
    else if (currentZoom <= 18) {
        currentZoom += 1;
        loadMap();
    }
    
});