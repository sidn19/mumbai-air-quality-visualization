export const state = {
    datasets: {
        airQuality: [],
        demographic: []
    },
    parameters: {
        airQuality: {},
        demographic: []
    },
    currentRegionId: 112,
    currentRegionData: null,
    viewHeatmap: true,
    viewDemographicData: true,
    currentRegionDataElement: null,
    currentRegionIndex: null,

    //mapCoords represents the extreme positions of the map tile group
    mapCoords: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
    },

    //tileCoords represents Tile Coordinate System
    tileCoords: {
        min_x: 0,
        min_y: 0,
        max_x: 0,
        max_y: 0,
    },

    viewBoxCoords: {
        min_x: 0,
        min_y: 0,
        width: 0,
        height: 0
    },
    viewport: {
        min_x: 0,
        min_y: 0,
        width: 0,
        height: 0
    },
    selectedDate: '1/1/2020',
    heatmapData: null, //Raw heatmap data
    heatmapDataRefined: null, //Heatmap data points in pixel coordinates
    mappingLatLngToPixelCoords: null, //Mapping function from (lat, lng) to pixel coordinates
    mappingPixelCoordsToLatLng: null, //Reverse mapping function from pixel coordinates to (lat, lng)
    minZoom: 0,
    maxZoom: 18,
    currentZoom: 13,
    color: {
        minColor: {
            red: 170,
            green: 204,
            blue: 238
        },
        maxColor: {
            red: 0,
            green: 128,
            blue: 255
        }
    },
    nColor: null,
    gradientData: null,
    currentGradientProperty: null,
    hasPageLoaded: false,
};
