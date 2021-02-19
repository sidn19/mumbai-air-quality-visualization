const init = () => {
  document.getElementById("defaultOpen").click();
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

// use jquery to add className activeIcon
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
};

const openDataSheetModal = () => {
  const datasetModal = document.getElementById('datasetModal');

  datasetModal.style.display = 'flex';

  var clickEvent = event => {
    if (event.target.id === 'datasetModal' || event.target.id === 'close-dataset-modal') {
      datasetModal.style.display = 'none';
      datasetModal.removeEventListener('click', clickEvent);
    }
  }
  
  datasetModal.addEventListener('click', clickEvent);
}

const changeDatasetModalTab = (event, type) => {
  for (let tab of document.getElementsByClassName('dataset-tab')) {
    tab.className = tab.className.replace(' active', '');
  }

  for (let tab of document.getElementsByClassName('dataset-list')) {
    tab.className = tab.className.replace(' active', '');
  }
  event.target.className += ' active';

  if (type === 'demographic') {
    document.getElementById('demo-dataset-list').className += ' active';
  }
  else {
    document.getElementById('aq-dataset-list').className += ' active';
  }
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

function download(){
var headers = {
  date: 'Date',
  latitude: "Latitude",
  longitude: "Longtitude",
  chemicalA: "Chemical A",
  chemicalB: "Chemical B"
};

aqvdatanotFormatted = [
  {
      date: '01-02-2021',
      latitude: '45.8',
      longitude: '80.2',
      chemicalA: '30',
      chemicalB: '22'
  },
  {
      date: '02-02-2021',
      latitude: '46.3',
      longitude: '67',
      chemicalA: '18',
      chemicalB: '29'
  }
];

var aqvdataFormatted = [];

aqvdatanotFormatted.forEach((data) => {
  aqvdataFormatted.push({
      date: data.date,  
      latitude: data.latitude,
      longitude: data.longitude,
      chemicalA: data.chemicalA,
      chemicalB: data.chemicalB
  });
});

var fileName = 'Mumbai M ward AQV data';

exportCSVFile(headers, aqvdataFormatted, fileName);
}

var csvfile = document.getElementById("upload-dataset")
readCSVfile = function () {
  var reader = new FileReader();
  reader.onload = function () {
    document.getElementById('jsonoutput').innerHTML = reader.result;
  };
  reader.readAsBinaryString(csvfile.files[0]);
};
csvfile.addEventListener('change', readCSVfile);
