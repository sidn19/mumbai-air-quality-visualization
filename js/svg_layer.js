function getPolygonPath(polygon, mapping) {
    let boundary = polygon[0];
    let pixelCoords = mapping(boundary[0][1], boundary[0][0]);
    let pathString = `M${pixelCoords.x},${pixelCoords.y}`;

    for (let i = 1; i < boundary.length; i++) {
        pixelCoords = mapping(boundary[i][1], boundary[i][0]);
        pathString += `L${pixelCoords.x}, ${pixelCoords.y}`;
    }

    let holes = [];
    for (let i = 1; i < polygon.length; i++) {
        holes.push(polygon[i]);
    }

    for (let hole of holes) {
        pixelCoords = mapping(hole[0][1], hole[0][0]);
        pathString += `M${pixelCoords.x},${pixelCoords.y}`;
        for (let i = 1; i < hole.length; i++) {
            pixelCoords = mapping(hole[i][1], hole[i][0]);
            pathString += `L${pixelCoords.x}, ${pixelCoords.y}`;
        }
    }

    pathString += "Z";

    let path = document.createElementNS("http://www.w3.org/2000/svg", "path");

    let color = [0xaa, 0, 0];
    path.setAttributeNS(
        null,
        "fill",
        `rgb(${color[0]}, ${color[1]}, ${color[2]}, 0.5)`
    );
    path.setAttributeNS(
        null,
        "stroke",
        `rgb(${color[0]}, ${color[1]}, ${color[2]}, 1)`
    );
    path.setAttributeNS(null, "stroke-width", "1");
    path.setAttributeNS(null, "d", pathString);
    path.setAttributeNS(null, "fill-rule", "evenodd");
    return path;
}

function getMultiPolygonPath(multiPolygon, mapping) {
    let pathString = "";
    for (let polygon of multiPolygon) {
        let boundary = polygon[0];
        let pixelCoords = mapping(boundary[0][1], boundary[0][0]);
        pathString += `M${pixelCoords.x},${pixelCoords.y}`;

        for (let i = 1; i < boundary.length; i++) {
            pixelCoords = mapping(boundary[i][1], boundary[i][0]);
            pathString += `L${pixelCoords.x}, ${pixelCoords.y}`;
        }

        let holes = [];
        for (let i = 1; i < polygon.length; i++) {
            holes.push(polygon[i]);
        }

        for (let hole of holes) {
            pixelCoords = mapping(hole[0][1], hole[0][0]);
            pathString += `M${pixelCoords.x},${pixelCoords.y}`;
            for (let i = 1; i < hole.length; i++) {
                pixelCoords = mapping(hole[i][1], hole[i][0]);
                pathString += `L${pixelCoords.x}, ${pixelCoords.y}`;
            }
        }
    }
    pathString += "Z";

    let path = document.createElementNS("http://www.w3.org/2000/svg", "path");

    let color = [0xaa, 0, 0];
    path.setAttributeNS(
        null,
        "fill",
        `rgb(${color[0]}, ${color[1]}, ${color[2]}, 0.5)`
    );
    path.setAttributeNS(
        null,
        "stroke",
        `rgb(${color[0]}, ${color[1]}, ${color[2]}, 1)`
    );
    path.setAttributeNS(null, "stroke-width", "1");
    path.setAttributeNS(null, "d", pathString);
    path.setAttributeNS(null, "fill-rule", "evenodd");
    return path;
}


export function geojsonOverlay(geojsonData, mapping, container) {
    //console.time("overlay");
    for (let feature of geojsonData.features) {
        let properties = feature.properties;

        if(feature.geometry.type === "Polygon") {
            let path = getPolygonPath(feature.geometry.coordinates, mapping);
            container.appendChild(path);
        }
        else if(feature.geometry.type === "MultiPolygon") {
            let path = getMultiPolygonPath(feature.geometry.coordinates, mapping);
            container.appendChild(path);
        }
    }
    //console.timeEnd("overlay");
}

// export function geojsonOverlay1(geojsonData, mapping, container) {
//     //console.time("overlay");
//     for (let feature of geojsonData.features) {
//         let path = document.createElementNS(
//             "http://www.w3.org/2000/svg",
//             "path"
//         );

//         let color = [0xaa, 0, 0];
//         path.setAttributeNS(
//             null,
//             "fill",
//             `rgb(${color[0]}, ${color[1]}, ${color[2]}, 0.5)`
//         );
//         path.setAttributeNS(
//             null,
//             "stroke",
//             `rgb(${color[0]}, ${color[1]}, ${color[2]}, 1)`
//         );
//         path.setAttributeNS(null, "stroke-width", "1");
//         let properties = feature.properties;
//         let coordinates = feature.geometry.coordinates;

//         let pixelCoords = mapping(
//             coordinates[0][0][0][1],
//             coordinates[0][0][0][0]
//         );

//         let pathString = `M${pixelCoords.x},${pixelCoords.y}`;

//         for (let i = 1; i < coordinates[0][0].length; i++) {
//             pixelCoords = mapping(
//                 coordinates[0][0][i][1],
//                 coordinates[0][0][i][0]
//             );
//             pathString += `L${pixelCoords.x}, ${pixelCoords.y}`;
//         }
//         pathString += "Z";
//         path.setAttributeNS(null, "d", pathString);

//         container.appendChild(path);
//     }
//     //console.timeEnd("overlay");
// }
