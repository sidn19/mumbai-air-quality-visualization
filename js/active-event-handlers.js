import { downloadAQSample } from './csv.js';
import { zoom, openData, changeToolbarIcon, changeModalTab } from './interface.js';
import { resetAirQualityParametersToDefault, saveAirQualityParameters } from './air-quality-and-demographic-utils.js';
import { viewBoxCoords, mappingPixelCoordsToLatLng } from './map.js';

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
  const latlng = mappingPixelCoordsToLatLng(event.clientX + viewBoxCoords.min_x, event.clientY + viewBoxCoords.min_y);
  const tooltip = document.getElementById('location-tooltip');
  tooltip.style.left = `${event.clientX}px`;
  tooltip.style.top = `${event.clientY + 12}px`;
  tooltip.innerHTML = `<strong>Latitude:</strong> ${latlng.lat.toFixed(4)}<br><strong>Longitude:</strong> ${latlng.lng.toFixed(4)}`;
});