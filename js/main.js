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
            const img = document.getElementById(`img${y}${x}`);
            img.style.zIndex = 0;
            img.src = getTileUrl(tile.x - Math.ceil(xSize / 2) + x, tile.y - Math.ceil(ySize / 2) + y, zoom);
        }
    }
}

function loadMap() {
    loadImageTiles(coords[0], coords[1], currentZoom);
}

function initialize() {
    const map = document.getElementById('map');
    const greyMap = document.getElementById('grey-map');
    
    for (let row = 0; row < 3; ++row) {
        const mapRow = document.createElement('DIV');
        const greyMapRow = document.createElement('DIV');
        
        mapRow.style.display = greyMapRow.style.display = 'flex';
        mapRow.style.flexDirection = greyMapRow.style.flexDirection = 'row';
        
        map.appendChild(mapRow);
        greyMap.appendChild(greyMapRow);
        
        for (let col = 0; col < 7; ++col) {
            const img = document.createElement('IMG');
            const greyImg = document.createElement('IMG');

            img.id = `img${row}${col}`;
            greyImg.id = `img${row}${col}g`;
            greyImg.src = './images/grey.png';
            
            img.addEventListener('load', () => {
                img.style.zIndex = 1;
            });

            mapRow.appendChild(img);
            greyMapRow.appendChild(greyImg);
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