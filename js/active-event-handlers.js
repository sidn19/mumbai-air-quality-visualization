import { downloadAQSample, csvToObject } from './csv.js';
import { openData, changeToolbarIcon, changeModalTab, snackbar, closeModal } from './interface.js';
import { resetAirQualityParametersToDefault, saveAirQualityParameters, addDatasetsToDOM, loadHeatmapFromAirQualityDatasets } from './air-quality-and-demographic-utils.js';
import { resetDemographicGradient } from './demographic-gradient.js'
import { state } from './state.js';
import { saveDemographicDataParameters } from './demographic-gradient.js'
import { saveCSVToState } from "./demographic-modal.js"
import { downloadDemographicSample } from './demographic-csv.js'
import { predictSeverity } from "./extrapolation.js";

/*
* Event handlers
*/
document.getElementById('download-aq-sample-dataset').addEventListener('click', downloadAQSample);

document.getElementById('resetAirQualityToDefaultButton').addEventListener('click', resetAirQualityParametersToDefault);

document.getElementById('resetDemographicGradient').addEventListener('click', resetDemographicGradient)

document.getElementById('aq-parameters-form').addEventListener('submit', saveAirQualityParameters);

document.getElementById('demo-parameter-form').addEventListener('submit', saveDemographicDataParameters)

document.getElementById('reset-dataset').addEventListener('click', (event) => {
  event.preventDefault();
  snackbar('Demographic dataset has been reset', 'success');
  saveCSVToState();
  closeModal('datasetModal');
  location.reload()
})

document.getElementById('play-button').addEventListener('click', event => {
  if (state.playing) {
    clearInterval(state.playInterval);
    state.playing = false;
    event.target.innerHTML = '&#9658;';
  }
  else {
    state.playInterval = setInterval(() => {
      const dateElement = document.getElementById('date-selection');
      const date = dateElement.value;
      [...document.getElementById('date-selection').children].forEach(option => {
        if (option.value === date) {
          if (option.nextSibling) {
            state.selectedDate = option.nextSibling.value;
            dateElement.value = state.selectedDate;
          }
          else {
            dateElement.value = dateElement.children[0].value;
            state.selectedDate = dateElement.children[0].value;
          }
        }
      });

      loadHeatmapFromAirQualityDatasets(state.datasets.airQuality);
    }, 500);
    state.playing = true;
    event.target.innerHTML = '&#10074;&#10074;';
  }
});

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

document.getElementById("demo-upload-dataset").addEventListener('change', (event) => {
  let reader = new FileReader();
  reader.onload = function () {
    state.datasets.demographic = {
      data: csvToObject(reader.result, true),
      name: event.target.value.replace(/^.*?([^\\\/]*)$/, '$1'),
      addedOn: new Date().toISOString()
    };
    snackbar('Demographic dataset has been loaded!', 'success');

    // Replace the data in localStorage by this
    localStorage.setItem('demographic-dataset', JSON.stringify(state.datasets.demographic));
    location.reload();
  };
  reader.readAsBinaryString(event.target.files[0]);
})

const tooltip = document.getElementById('location-tooltip');
const regionTooltip = document.getElementById('region-name-tooltip')

document.addEventListener('mousemove', function (event) {
  // Region name
  regionTooltip.style.left = `${event.clientX + 12}px`;
  regionTooltip.style.top = `${event.clientY + 12}px`;

  let x = event.clientX + state.viewBoxCoords.min_x;
  let y = event.clientY + state.viewBoxCoords.min_y;

  // Latitude and longitude
  const latlng = state.mappingPixelCoordsToLatLng(x, y);
  tooltip.innerHTML = `<strong>Latitude:</strong> ${latlng.lat.toFixed(4)}  <strong>Longitude:</strong> ${latlng.lng.toFixed(4)}`;

  //Predict severity at the current location
  predictSeverity(latlng.lat, latlng.lng, 1);
});

// Show region name near mouse when it is hovered over
let region = document.getElementById('svg-regions')
region.addEventListener('mouseover', (e) => {
  // Show hover effect only on non-active region
  if (!e.target.getAttribute('class').includes('activeRegion'))
    e.target.setAttribute('class', `${e.target.getAttribute('class')} regionHover`)

  if (regionTooltip.style.display === 'none') {
    regionTooltip.style.display = 'inline-block'
    regionTooltip.textContent = e.target.getAttribute('gname')
  }

  // Gradient is displayed => Also show value on hover
  if (state.gradientData && !document.getElementById('regionGradientValue')) {
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

