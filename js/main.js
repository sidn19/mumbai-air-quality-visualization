let currentZoom = 12;

const coords = [19.034597998590936, 72.92177841567673];

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
    const xSize = 7;
    const ySize = 3;
    for (let x = 0; x < xSize; ++x) {
        for (let y = 0; y < ySize; ++y) {
            const gTile = document.getElementById(`gtile${y}${x}`);
            gTile.setAttributeNS(null, 'visibility', 'visible');

            const img = document.getElementById(`tile${y}${x}`);
            img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', getTileUrl(tile.x - Math.ceil(xSize / 2) + x, tile.y - Math.ceil(ySize / 2) + y, zoom));
        }
    }
}

function loadMap() {
    loadImageTiles(coords[0], coords[1], currentZoom);
}

function initialize() {
    const map = document.getElementById('svg-map');
    
    for (let row = 0; row < 3; ++row) {
        for (let col = 0; col < 7; ++col) {
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
    if (event.deltaY > 0 && currentZoom >= 3) {
        // scrolled down
        currentZoom -= 1;
    }
    else if (event.deltaY < 0 && currentZoom <= 18) {
        currentZoom += 1;
    }
    loadMap();
});