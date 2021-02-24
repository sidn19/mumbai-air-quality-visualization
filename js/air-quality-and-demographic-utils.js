import { defaultParameters } from './declarations.js';
import { state } from './state.js';
import { csvToObject } from './csv.js';

/*
* Initializing datasets and parameters
*/
let JSONDatasets = {
  airQuality: localStorage.getItem("air-quality-datasets"),
  demographic: localStorage.getItem('demographic-datasets')
};

for (let dataset in state.datasets) {
  if (JSONDatasets[dataset] !== null) {
    state.datasets[dataset] = JSON.parse(JSONDatasets[dataset]);

    if (dataset === 'airQuality') {
      addDatasetsToDOM(state.datasets[dataset]);

      for (let data of state.datasets[dataset]) {
        data = groupDataByDate(data);
      }
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
          addedOn: new Date().toISOString()
        };
        localStorage.setItem('air-quality-datasets', JSON.stringify(state.datasets[dataset]));
      })
      .catch(error => {
        console.error(error);
      });
    }
  }
}

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

export const saveAirQualityParameters = event => {
  event.preventDefault();
  // apply air quality parameters
  for (let pollutant in state.parameters.airQuality) {
    state.parameters.airQuality[pollutant].enable = document.getElementById(`${pollutant}-enable`).checked;
    for (let i = 0; i < state.parameters.airQuality[pollutant].ranges.length; ++i) {
      state.parameters.airQuality[pollutant].ranges[i] = document.getElementById(`${pollutant}-${i}`).value;
    }
  }
  localStorage.setItem(
    "air-quality-parameters",
    JSON.stringify(state.parameters.airQuality)
  );
}

export function resetAirQualityParametersToDefault() {
  state.parameters.airQuality = defaultParameters.airQuality
  
  localStorage.setItem(
    "air-quality-parameters",
    JSON.stringify(state.parameters.airQuality)
  );

  loadAirQualityParametersToForm();
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

function addDatasetsToDOM(datasets) {
  const list = document.getElementById('aq-dataset-list');
  for (let dataset of datasets) {
    const div = document.createElement('div');
    div.className = 'dataset-item';
    div.innerHTML = `
      <div class="dataset-text">
        <div>${dataset.name}</div>
        <div>Added on: ${dataset.addedOn}</div>
      </div>
      <div>
        <button class="download-button"></button>
        <button class="delete-button"></button>
      </div>
    `;
    list.prepend(div);
  }
}