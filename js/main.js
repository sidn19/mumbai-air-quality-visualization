const coords = [19.034597998590936, 72.92177841567673, 12];

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
    document.getElementById('img1').src = getTileUrl(tile.x - 1, tile.y - 1, zoom);
    document.getElementById('img2').src = getTileUrl(tile.x, tile.y - 1, zoom);
    document.getElementById('img3').src = getTileUrl(tile.x + 1, tile.y - 1, zoom);
    document.getElementById('img4').src = getTileUrl(tile.x - 1, tile.y, zoom);
    document.getElementById('img5').src = getTileUrl(tile.x, tile.y, zoom);
    document.getElementById('img6').src = getTileUrl(tile.x + 1, tile.y, zoom);
    document.getElementById('img7').src = getTileUrl(tile.x - 1, tile.y + 1, zoom);
    document.getElementById('img8').src = getTileUrl(tile.x, tile.y + 1, zoom);
    document.getElementById('img9').src = getTileUrl(tile.x + 1, tile.y + 1, zoom);
}

loadImageTiles(coords[0], coords[1], coords[2]);

/*

lat_rad = math.radians(lat_deg)
  n = 2.0 ** zoom
  xtile = int((lon_deg + 180.0) / 360.0 * n)
  ytile = int((1.0 - math.asinh(math.tan(lat_rad)) / math.pi) / 2.0 * n)
  return (xtile, ytile)
*/