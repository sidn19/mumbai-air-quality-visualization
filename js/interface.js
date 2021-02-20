let airQualityDatasets = localStorage.getItem('air-quality-datasets');

if (airQualityDatasets !== null) {
  airQualityDatasets = JSON.parse(airQualityDatasets);
}
else {
  // initialize with demo data
}

let demographicDatasets = localStorage.getItem('demographic-datasets');

if (demographicDatasets !== null) {
  demographicDatasets = JSON.parse(demographicDatasets);
}
else {
  // initialize with demo data
}

let airQualityParameters = localStorage.getItem('air-quality-parameters');

if (airQualityParameters !== null) {
  airQualityParameters = JSON.parse(airQualityParameters);
}
else {
  // initialize with default parameters
  airQualityParameters = {
    o3: {
      enable: true,
      ranges: [33, 65, 120, 180, 240]
    },
    pm25: {
      enable: true,
      ranges: [5, 10, 20, 25, 60]
    },
    pm10: {
      enable: true,
      ranges: [10, 20, 35, 50, 100]
    },
    no2: {
      enable: true,
      ranges: [25, 50, 100, 200, 400]
    },
    so2: {
      enable: true,
      ranges: [25, 50, 120, 350, 500]
    },
    co: {
      enable: true,
      ranges: [1, 2, 4, 10, 30]
    },
    nh3: {
      enable: true,
      ranges: [3, 7.5, 37.5, 15000, 150000]
    }
  }

  localStorage.setItem('air-quality-parameters', JSON.stringify(airQualityParameters));
}

let demographicParameters = localStorage.getItem('demographic-parameters');

if (demographicParameters !== null) {
  demographicParameters = JSON.parse(demographicParameters);
}
else {
  // initialize with default parameters
}

const init = () => {
  document.getElementById("defaultOpen").click();

  // load air quality parameters
  for (let pollutant in airQualityParameters) {
    document.getElementById(`${pollutant}-enable`).checked = airQualityParameters[pollutant].enable;
    for (let i = 0; i < airQualityParameters[pollutant].ranges.length; ++i) {
      document.getElementById(`${pollutant}-${i}`).value = airQualityParameters[pollutant].ranges[i];
    }
  }
};

const openData = (category) => {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabContent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  tablinks = document.getElementsByClassName("tabLink");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  document.getElementById(category).style.display = "block";
  event.currentTarget.className += " active";
};

const zoom = (x) => {
  // x = 1 if zoom in, 0 if out
  console.log(x);
  // connect to zoom functionality
};

const changeToolbarIcon = (icon) => {
  let toolbarIcons = document.getElementsByClassName("toolbarIcon");
  for (i = 0; i < toolbarIcons.length; i++) {
    toolbarIcons[i].className = toolbarIcons[i].className.replace(
      " activeIcon",
      ""
    );
  }
  let activeIcon = document.getElementById(icon);
  activeIcon.className += " activeIcon";

  switch (icon) {
    case "demographicDataIcon":
      if (document.getElementById("left").style.display === "none") {
        document.getElementById("left").style.display = "block";
      } else {
        document.getElementById("left").style.display = "none";
      }
    case "parameterIcon":
  }
};

const openModal = (modalId, closeButtonClass) => {
  const modal = document.getElementById(modalId);
  modal.style.display = 'flex';

  var clickEvent = event => {
    if (event.target.id === modalId || event.target.className.includes(closeButtonClass)) {
      modal.style.display = 'none';
      modal.removeEventListener('click', clickEvent);
    }
  }
  
  modal.addEventListener('click', clickEvent);
}

const changeModalTab = (event, activateId, activeClasses) => {
  for (let activeClass of activeClasses) {
    for (let tab of document.getElementsByClassName(activeClass)) {
      tab.className = tab.className.replace(' active', '');
    }
  }

  event.target.className += ' active';
  document.getElementById(activateId).className += ' active';
}


function convertToCSV(objArray) {
  var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
  var str = '';

  for (var i = 0; i < array.length; i++) {
      var line = '';
      for (var index in array[i]) {
          if (line != '') line += ','

          line += array[i][index];
      }

      str += line + '\r\n';
  }

  return str;
}

function exportCSVFile(headers, data, fileName) {
  if (headers) {
      data.unshift(headers);
  }

  var jsonObject = JSON.stringify(data);

  var csv = this.convertToCSV(jsonObject);

  var exportedFilename = fileName + '.csv' || 'aqvdata.csv';

  var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, exportedFilename);
  } else {
      var link = document.createElement("a");
      if (link.download !== undefined) {
          var url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", exportedFilename);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      }
  }
}

function downloadAQSample() {
  let headers = {
    date: 'Date',
    latitude: 'Latitude',
    longitude: 'Longitude',
    o3: 'O3',
    pm25: 'PM 2.5',
    pm10: 'PM 10',
    no2: 'NO2',
    so2: 'SO2',
    co: 'CO',
    nh3: 'NH3'
  };

  let aqvdatanotFormatted = [
    {
        date: '01-02-2021',
        latitude: '45.8',
        longitude: '80.2',
        o3: '30',
        pm25: '10.5',
        pm10: '12.4',
        no2: '2.4',
        so2: '5.1',
        co: '1',
        nh3: '17'
    },
    {
        date: '02-02-2021',
        latitude: '46.3',
        longitude: '67',
        o3: '20',
        pm25: '14.5',
        pm10: '11.2',
        no2: '2',
        so2: '2.5',
        co: '1.2',
        nh3: '11.5'
    }
  ];

  let aqvdataFormatted = [];

  aqvdatanotFormatted.forEach((data) => {
    aqvdataFormatted.push({
      ...data
    });
  });

  exportCSVFile(headers, aqvdataFormatted, 'Mumbai M ward AQV data');
}

document.getElementById("aq-upload-dataset").addEventListener('change', function (event) {
  let reader = new FileReader();
  reader.onload = function () {
    console.log(reader.result);
  };
  reader.readAsBinaryString(event.target.files[0]);
});

document.getElementById("demo-upload-dataset").addEventListener('change', function (event) {
  let reader = new FileReader();
  reader.onload = function () {
    console.log(reader.result);
  };
  reader.readAsBinaryString(event.target.files[0]);
});