import { downloadAQSample, csvToObject } from './csv.js';
import { openData, changeToolbarIcon, changeModalTab, snackbar } from './interface.js';
import { resetAirQualityParametersToDefault, saveAirQualityParameters, addDatasetsToDOM, loadHeatmapFromAirQualityDatasets } from './air-quality-and-demographic-utils.js';
import { resetDemographicGradient } from './demographic-gradient.js'
import { state } from './state.js';
import { saveDemographicDataParameters } from './demographic-gradient.js'
import { downloadDemographicSample } from './demographic-csv.js'

/*
* Event handlers
*/
document.getElementById('download-aq-sample-dataset').addEventListener('click', downloadAQSample);

document.getElementById('download-demo-sample-dataset').addEventListener('click', downloadDemographicSample)

document.getElementById('resetAirQualityToDefaultButton').addEventListener('click', resetAirQualityParametersToDefault);

document.getElementById('resetDemographicGradient').addEventListener('click', resetDemographicGradient)

document.getElementById('aq-parameters-form').addEventListener('submit', saveAirQualityParameters);

document.getElementById('demo-parameter-form').addEventListener('submit', saveDemographicDataParameters)

document.getElementById('close-demo-parameter-modal').addEventListener('click', (event) => {
  event.preventDefault()
})

Array.from(document.querySelectorAll('.openData')).map(x => x.addEventListener('click', openData));
Array.from(document.querySelectorAll('.toolbarIcon')).map(x => x.addEventListener('click', changeToolbarIcon));
Array.from(document.querySelectorAll('.changeModalTab')).map(x => x.addEventListener('click', changeModalTab));

document
  .getElementById("aq-upload-dataset")
  .addEventListener("change", function (event) {
    let reader = new FileReader();
    reader.onload = function () {
      state.datasets.airQuality.push({
        data: csvToObject(reader.result),
        name: event.target.value.replace(/^.*?([^\\\/]*)$/, '$1'),
        addedOn: new Date().toISOString(),
        id: state.datasets.airQuality.length > 0 ? state.datasets.airQuality[state.datasets.airQuality.length - 1].id + 1 : 0
      });
      addDatasetsToDOM(state.datasets.airQuality, 'airQuality');
      loadHeatmapFromAirQualityDatasets(state.datasets.airQuality)
      localStorage.setItem('air-quality-datasets', JSON.stringify(state.datasets.airQuality));
      snackbar('Air quality dataset has been loaded!', 'success');
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


const tooltip = document.getElementById('location-tooltip');
const regionTooltip = document.getElementById('region-name-tooltip')

document.addEventListener('mousemove', function (event) {
  // Region name
  regionTooltip.style.left = `${event.clientX + 12}px`;
  regionTooltip.style.top = `${event.clientY + 12}px`;

  // Latitude and longitude
  const latlng = state.mappingPixelCoordsToLatLng(event.clientX + state.viewBoxCoords.min_x, event.clientY + state.viewBoxCoords.min_y);
  tooltip.innerHTML = `<strong>Latitude:</strong> ${latlng.lat.toFixed(4)}  <strong>Longitude:</strong> ${latlng.lng.toFixed(4)}`;
});

// Show region name near mouse when it is hovered over
let region = document.getElementById('svg-regions')
region.addEventListener('mouseover', (e) => {
  // Show hover effect only on non-active region
  if (!e.target.getAttribute('class').includes('activeRegion'))
    e.target.setAttribute('class', `${e.target.getAttribute('class')} regionHover`)

  if (regionTooltip.style.display == 'none') {
    regionTooltip.style.display = 'inline-block'
    regionTooltip.textContent = e.target.getAttribute('gname')
  }

  // Gradient is displayed => Also show value on hover
  if (state.gradientData) {
    let regionGradientValue = document.createElement('div')
    regionGradientValue.setAttribute('id', 'regionGradientValue')
    regionGradientValue.textContent = `${state.currentGradientProperty}: ${state.gradientData.find(v => v.gid == e.target.getAttribute('gid')).data}`
    regionTooltip.append(regionGradientValue)
  }
})

region.addEventListener('mouseout', (e) => {
  regionTooltip.style.display = 'none'
  // Remove hover class
  if (e.target.getAttribute('class').includes('regionHover'))
    e.target.setAttribute('class', e.target.getAttribute('class').replace(' regionHover', ''))
})

document.getElementById('date-selection').addEventListener('change', event => {
  state.selectedDate = event.target.value;
  loadHeatmapFromAirQualityDatasets(state.datasets.airQuality);
});

