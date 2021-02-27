export const state = {
    datasets: {
        airQuality: [],
        demographic: []
    },
    parameters: {
        airQuality: {},
        demographic: []
    },
    currentRegionId: null,
    currentRegionData: null,
    viewHeatmap: true,
    viewBoxCoords: {
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
    currentZoom: 13
};
