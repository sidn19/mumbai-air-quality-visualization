import { defaultParameters } from './declarations.js';
import { state } from './state.js';
import { drawMap, initializeMap, initializeHeatmapData } from './map.js';
import { addHeatmapTiles, removeHeatmapTiles } from './heatmap_layer.js';
import { csvToObject, aqvObjectToCSVFile } from './csv.js';
import { snackbar, closeModal, getAlert } from './interface.js';

/*
* Initializing datasets and parameters
*/
let JSONParameters = {
  airQuality: localStorage.getItem("air-quality-parameters"),
  demographic: localStorage.getItem('demographic-parameters')
}

for (let parameter in state.parameters) {
  if (JSONParameters[parameter] !== null) {
    state.parameters[parameter] = JSON.parse(JSONParameters[parameter]);
  }
  else {
    // initialize with default data
    state.parameters[parameter] = defaultParameters[parameter];
  }
}

// load air quality parameters
loadAirQualityParametersToForm();

let JSONDatasets = {
  airQuality: localStorage.getItem("air-quality-datasets"),
  demographic: localStorage.getItem('demographic-datasets')
};

for (let dataset in state.datasets) {
  if (JSONDatasets[dataset] !== null && JSONDatasets[dataset].length > 2) {
    state.datasets[dataset] = JSON.parse(JSONDatasets[dataset]);

    if (dataset === 'airQuality') {
      addDatasetsToDOM(state.datasets[dataset], dataset);
      loadHeatmapFromAirQualityDatasets(state.datasets[dataset]);
    }
  }
  else {
    if (dataset === 'airQuality') {
      fetch('./data/demo-air-quality.csv')
        .then(response => {
          if (!response.ok) {
            throw new Error;
          }
          return response.text();
        })
        .then(data => {
          state.datasets[dataset][0] = {
            data: csvToObject(data),
            name: 'demo-air-quality.csv',
            addedOn: new Date().toISOString(),
            id: 0
          };
          addDatasetsToDOM(state.datasets[dataset], dataset);
          loadHeatmapFromAirQualityDatasets(state.datasets[dataset])
          localStorage.setItem('air-quality-datasets', JSON.stringify(state.datasets[dataset]));
        })
        .catch(error => {
          console.error(error);
        });
    }
  }
}

export function loadHeatmapFromAirQualityDatasets(datasets) {
  // generate air quality heatmap from dataset sources
  const date = state.selectedDate;
  let locations = [];
  for (let dataset of datasets) {
    // group by date
    dataset = groupDataByDate(dataset);
    if (dataset.hasOwnProperty(date)) {
      for (let location of dataset[date]) {
        let severity = getAirQualityValueFromPollutants(location);
        //console.log(severity);
        locations.push({
          latitude: location.latitude,
          longitude: location.longitude,
          severity: severity
        });
      }
    }
  }

  state.heatmapData = locations;
  //drawMap(state.mapCoords.left, state.mapCoords.top, state.tileCoords.min_x, state.tileCoords.min_y, state.currentZoom);
  initializeHeatmapData();
  removeHeatmapTiles(document.getElementById("heatmap-layer"), state.mapCoords.left, state.mapCoords.top, state.mapCoords.right, state.mapCoords.bottom);
  if (state.viewHeatmap) {
    addHeatmapTiles(state.heatmapDataRefined, document.getElementById("heatmap-layer"), state.mapCoords.left, state.mapCoords.top, state.mapCoords.right, state.mapCoords.bottom);
  }
  console.log(state.tileCoords, state.mapCoords);
}

function getAirQualityValueFromPollutants(pollutants) {
  let overallSeverity = 0;
  let enabledParameters = 0;
  for (let pollutant in state.parameters.airQuality) {
    if (!state.parameters.airQuality[pollutant].enable) {
      continue;
    }

    ++enabledParameters;

    let pollutantSeverity = 0;
    while (pollutantSeverity < state.parameters.airQuality[pollutant].ranges.length) {
      if (pollutants[pollutant] < state.parameters.airQuality[pollutant].ranges[pollutantSeverity]) {
        break;
      }

      ++pollutantSeverity;
    }
    overallSeverity += pollutantSeverity;
  }

  return overallSeverity / enabledParameters;
}

export const saveAirQualityParameters = event => {
  event.preventDefault();
  // check if parameters are valid!
  for (let pollutant in state.parameters.airQuality) {
    for (let i = 0; i < state.parameters.airQuality[pollutant].ranges.length - 1; ++i) {
      if (parseFloat(document.getElementById(`${pollutant}-${i}`).value) >= parseFloat(document.getElementById(`${pollutant}-${i + 1}`).value)) {
        return snackbar('Please enter valid ranges!');
      }
    }
  }

  // apply air quality parameters
  for (let pollutant in state.parameters.airQuality) {
    state.parameters.airQuality[pollutant].enable = document.getElementById(`${pollutant}-enable`).checked;
    for (let i = 0; i < state.parameters.airQuality[pollutant].ranges.length; ++i) {
      state.parameters.airQuality[pollutant].ranges[i] = parseFloat(document.getElementById(`${pollutant}-${i}`).value);
    }
  }
  localStorage.setItem(
    "air-quality-parameters",
    JSON.stringify(state.parameters.airQuality)
  );

  loadHeatmapFromAirQualityDatasets(state.datasets.airQuality);
  snackbar('New Parameters have been set!', 'success');
  closeModal('parameterModal');
}

export function resetAirQualityParametersToDefault() {
  state.parameters.airQuality = defaultParameters.airQuality

  localStorage.setItem(
    "air-quality-parameters",
    JSON.stringify(state.parameters.airQuality)
  );

  loadAirQualityParametersToForm();
  loadHeatmapFromAirQualityDatasets(state.datasets.airQuality);
  snackbar('Air quality parameters have been reset!', 'success');
}

function loadAirQualityParametersToForm() {
  for (let pollutant in state.parameters.airQuality) {
    document.getElementById(`${pollutant}-enable`).checked =
      state.parameters.airQuality[pollutant].enable;
    for (let i = 0; i < state.parameters.airQuality[pollutant].ranges.length; ++i) {
      document.getElementById(`${pollutant}-${i}`).value =
        state.parameters.airQuality[pollutant].ranges[i];
    }
  }
}

function groupDataByDate(dataset) {
  let dates = {};
  let firstDate = '';

  for (let dataItem of dataset.data) {
    if (!dates.hasOwnProperty(dataItem.date)) {
      dates[dataItem.date] = [];

      if (firstDate === '') {
        firstDate = dataItem.date;
      }
    }

    const dataToPush = {};
    for (let property in dataItem) {
      if (property !== 'date') {
        dataToPush[property] = dataItem[property];
      }
    }
    dates[dataItem.date].push(dataToPush);
  }

  return dates;
}

function addDatesToDOM(datasets) {
  const dates = [];
  for (let dataset of datasets) {
    for (let item of dataset.data) {
      if (!dates.includes(item.date)) {
        dates.push(item.date);
      }
    }
  }

  const dateSelection = document.getElementById('date-selection');
  const dateNodes = dateSelection.querySelectorAll('option');
  for (let date of dateNodes) {
    date.remove();
  }
  for (let date of dates) {
    const dateNode = document.createElement('option');
    dateNode.innerText = date;
    dateNode.value = date;
    dateSelection.append(dateNode);
  }
}

export function addDatasetsToDOM(datasets, dataset) {
  const list = document.getElementById(dataset === 'airQuality' ? 'aq-dataset-list' : 'demo-dataset-list');

  if (dataset === 'airQuality') {
    addDatesToDOM(datasets);
  }

  const items = list.querySelectorAll('.dataset-item');
  for (let item of items) {
    item.remove();
  }

  for (let dataset of datasets) {
    const div = document.createElement('div');
    div.className = 'dataset-item';
    div.innerHTML = `
      <div class="dataset-item-inner-div">
        <img src="./assets/icons/datasheet.svg" style="height: 50px;">
        <div class="dataset-text">
          <div>${dataset.name}</div>
          <div>${new Date(dataset.addedOn).toLocaleString()}</div>
        </div>
      </div>
      <div>
        <button class="download-button"></button>
        <button class="delete-button"></button>
      </div>
    `;
    div.querySelector('.download-button').addEventListener('click', () => {
      aqvObjectToCSVFile(dataset.data, dataset.name);
    });
    div.querySelector('.delete-button').addEventListener('click', () => {
      getAlert('Are you sure you want to delete this file?', () => {
        state.datasets.airQuality.splice(
          state.datasets.airQuality.findIndex(
            x => x.id == dataset.id
          ),
          1
        );
        addDatasetsToDOM(state.datasets.airQuality, 'airQuality');
        loadHeatmapFromAirQualityDatasets(state.datasets.airQuality)
        localStorage.setItem('air-quality-datasets', JSON.stringify(state.datasets.airQuality));
        snackbar(`Dataset ${dataset.name} has been deleted!`, 'success');
      });
    });
    list.prepend(div);
  }
}