/*
* Defaults
*/
const defaultParameters = {
    airQuality: {
      o3: {
        enable: true,
        ranges: [33, 65, 120, 180, 240],
      },
      pm25: {
        enable: true,
        ranges: [5, 10, 20, 25, 60],
      },
      pm10: {
        enable: true,
        ranges: [10, 20, 35, 50, 100],
      },
      no2: {
        enable: true,
        ranges: [25, 50, 100, 200, 400],
      },
      so2: {
        enable: true,
        ranges: [25, 50, 120, 350, 500],
      },
      co: {
        enable: true,
        ranges: [1, 2, 4, 10, 30],
      },
      nh3: {
        enable: true,
        ranges: [3, 7.5, 37.5, 15000, 150000],
      },
    },
    demographic: {
  
    }
  }

/*
* Initializing datasets and parameters
*/
let datasets = {
  airQuality: localStorage.getItem("air-quality-datasets"),
  demographic: localStorage.getItem('demographic-datasets')
};

for (let dataset in datasets) {
  if (datasets[dataset] !== null) {
    datasets[dataset] = JSON.parse(datasets[dataset]);
  }
  else {
    // initialize with default data
  }
}

let parameters = {
  airQuality: localStorage.getItem("air-quality-parameters"),
  demographic: localStorage.getItem('demographic-parameters')
}

for (let parameter in parameters) {
  if (parameters[parameter] !== null) {
    parameters[parameter] = JSON.parse(parameters[parameter]);
  }
  else {
    // initialize with default data
    parameters[parameter] = defaultParameters[parameter];
  }
}

// load air quality parameters
loadAirQualityParametersToForm();

export const saveAirQualityParameters = event => {
  event.preventDefault();
  // apply air quality parameters
  for (let pollutant in parameters.airQuality) {
    parameters.airQuality[pollutant].enable = document.getElementById(`${pollutant}-enable`).checked;
    for (let i = 0; i < parameters.airQuality[pollutant].ranges.length; ++i) {
      parameters.airQuality[pollutant].ranges[i] = document.getElementById(`${pollutant}-${i}`).value;
    }
  }
  localStorage.setItem(
    "air-quality-parameters",
    JSON.stringify(parameters.airQuality)
  );
}

export function resetAirQualityParametersToDefault() {
  parameters.airQuality = defaultParameters.airQuality
  
  localStorage.setItem(
    "air-quality-parameters",
    JSON.stringify(parameters.airQuality)
  );

  loadAirQualityParametersToForm();
}

function loadAirQualityParametersToForm() {
  for (let pollutant in parameters.airQuality) {
    document.getElementById(`${pollutant}-enable`).checked =
      parameters.airQuality[pollutant].enable;
    for (let i = 0; i < parameters.airQuality[pollutant].ranges.length; ++i) {
      document.getElementById(`${pollutant}-${i}`).value =
        parameters.airQuality[pollutant].ranges[i];
    }
  }
}