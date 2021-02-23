import { defaultParameters } from './declarations.js';
import { state } from './state.js';

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
  }
  else {
    // initialize with default data
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