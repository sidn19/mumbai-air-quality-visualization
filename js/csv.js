/*
* CSV Functions
*/

function convertToCSV(objArray) {
    var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
    var str = "";
  
    for (var i = 0; i < array.length; i++) {
      var line = "";
      for (var index in array[i]) {
        if (line != "") line += ",";
  
        line += array[i][index];
      }
  
      str += line + "\r\n";
    }
  
    return str;
  }
  
  function exportCSVFile(headers, data, fileName) {
    if (headers) {
      data.unshift(headers);
    }
  
    var jsonObject = JSON.stringify(data);
  
    var csv = convertToCSV(jsonObject);
  
    var exportedFilename = fileName + ".csv" || "aqvdata.csv";
  
    var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, exportedFilename);
    } else {
      var link = document.createElement("a");
      if (link.download !== undefined) {
        var url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", exportedFilename);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }
  
  export function downloadAQSample() {
    let headers = {
      date: "Date",
      latitude: "Latitude",
      longitude: "Longitude",
      o3: "O3",
      pm25: "PM 2.5",
      pm10: "PM 10",
      no2: "NO2",
      so2: "SO2",
      co: "CO",
      nh3: "NH3",
    };
  
    let aqvdatanotFormatted = [
      {
        date: "01-02-2021",
        latitude: "45.8",
        longitude: "80.2",
        o3: "30",
        pm25: "10.5",
        pm10: "12.4",
        no2: "2.4",
        so2: "5.1",
        co: "1",
        nh3: "17",
      },
      {
        date: "02-02-2021",
        latitude: "46.3",
        longitude: "67",
        o3: "20",
        pm25: "14.5",
        pm10: "11.2",
        no2: "2",
        so2: "2.5",
        co: "1.2",
        nh3: "11.5",
      },
    ];
  
    let aqvdataFormatted = [];
  
    aqvdatanotFormatted.forEach((data) => {
      aqvdataFormatted.push({
        ...data,
      });
    });
  
    exportCSVFile(headers, aqvdataFormatted, "Mumbai M ward AQV data");
  }


export function csvToObject(data) {
  let dataset = [];
  let properties = [];
  for (let item of data.split('\n')) {
    if (item === '') {
      continue;
    }

    const itemData = item.trim().split(',');

    if (properties.length === 0) {
      properties = itemData;
    }
    else {
      const dataItem = {};

      for (let i = 0; i < itemData.length; ++i) {
        if (properties[i] !== 'date') {
          dataItem[properties[i]] = parseFloat(itemData[i]);
        }
        else {
          dataItem[properties[i]] = itemData[i];
        }
      }
      dataset.push(dataItem);
    }
  }

  return dataset;
}