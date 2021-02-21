import { downloadAQSample } from './csv.js';
import { zoom, openData, changeToolbarIcon, changeModalTab } from './interface.js';
import { resetAirQualityParametersToDefault, saveAirQualityParameters } from './air-quality-and-demographic-utils.js';

/*
* Event handlers
*/
document.getElementById('download-aq-sample-dataset').addEventListener('click', downloadAQSample);

document.getElementById('resetAirQualityToDefaultButton').addEventListener('click', resetAirQualityParametersToDefault);

document.getElementById('aq-parameters-form').addEventListener('submit', saveAirQualityParameters);

document.getElementById('zoom-in-button').addEventListener('click', () => zoom(1));
document.getElementById('zoom-out-button').addEventListener('click', () => zoom(0));

Array.from(document.querySelectorAll('.openData')).map(x => x.addEventListener('click', openData));
Array.from(document.querySelectorAll('.toolbarIcon')).map(x => x.addEventListener('click', changeToolbarIcon));
Array.from(document.querySelectorAll('.changeModalTab')).map(x => x.addEventListener('click', changeModalTab));

document
  .getElementById("aq-upload-dataset")
  .addEventListener("change", function (event) {
    let reader = new FileReader();
    reader.onload = function () {
      console.log(reader.result);
    };
    reader.readAsBinaryString(event.target.files[0]);
  });

document
  .getElementById("demo-upload-dataset")
  .addEventListener("change", function (event) {
    let reader = new FileReader();
    reader.onload = function () {
      console.log(reader.result);
    };
    reader.readAsBinaryString(event.target.files[0]);
  });

document.addEventListener('mousemove', function (event) {
    let x = event.clientX;
    let y = event.clientY;

//     console.log(x + viewBoxCoords.min_x, y + viewBoxCoords.min_y)
//     let latlng = mappingPixelCoordsToLatLng(x + viewBoxCoords.min_x, y + viewBoxCoords.min_y);
//     console.log(latlng.lat, latlng.lng);
//     let pixelCoords = mappingLatLngToPixelCoords(latlng.lat, latlng.lng);
//     console.log(pixelCoords.x, pixelCoords.y);
});