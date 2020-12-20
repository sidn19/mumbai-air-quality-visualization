let currentZoom = 12;
let xSize = Math.ceil(window.innerHeight / 256);
let ySize = Math.ceil(window.innerWidth / 256);

const coords = [19.034597998590936, 72.92177841567673];

let resizeTimeout = null;

window.onresize = () => {
    xSize = Math.ceil(window.innerHeight / 256);
    ySize = Math.ceil(window.innerWidth / 256);
    
    if (resizeTimeout !== null) {
        clearTimeout(resizeTimeout);
        resizeTimeout = null;
    }

    resizeTimeout = setTimeout(() => initialize(), 100);
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
    for (let x = 0; x < xSize; ++x) {
        for (let y = 0; y < ySize; ++y) {
            const gTile = document.getElementById(`gtile${x}${y}`);
            gTile.setAttributeNS(null, 'visibility', 'visible');

            const img = document.getElementById(`tile${x}${y}`);
            img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', getTileUrl(tile.x - Math.ceil(ySize / 2) + y, tile.y - Math.ceil(xSize / 2) + x, zoom));
        }
    }
}

function loadMap() {
    loadImageTiles(coords[0], coords[1], currentZoom);
}

function initialize() {
    const map = document.getElementById('svg-map');
    while (map.lastChild) {
        map.removeChild(map.lastChild);
    }
    
    for (let row = 0; row < xSize; ++row) {
        for (let col = 0; col < ySize; ++col) {
            const img = document.createElementNS('http://www.w3.org/2000/svg', 'image');
            img.setAttributeNS(null, 'height', 256);
            img.setAttributeNS(null, 'width', 256);
            img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', './images/grey.png');
            img.setAttributeNS(null, 'x', col * 256);
            img.setAttributeNS(null, 'y', row * 256);
            img.setAttributeNS(null, 'visibility', 'visible');
            img.setAttributeNS(null, 'id', `tile${row}${col}`);
            
            img.addEventListener('load', () => {
                const greyImg = document.getElementById(`gtile${row}${col}`);
                greyImg.setAttributeNS(null, 'visibility', 'hidden');
            });
            map.appendChild(img);

            const greyImg = document.createElementNS('http://www.w3.org/2000/svg', 'image');
            greyImg.setAttributeNS(null, 'height', 256);
            greyImg.setAttributeNS(null, 'width', 256);
            greyImg.setAttributeNS('http://www.w3.org/1999/xlink', 'href', './images/grey.png');
            greyImg.setAttributeNS(null, 'x', col * 256);
            greyImg.setAttributeNS(null, 'y', row * 256);
            greyImg.setAttributeNS(null, 'visibility', 'hidden');
            greyImg.setAttributeNS(null, 'id', `gtile${row}${col}`);
            map.appendChild(greyImg);
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