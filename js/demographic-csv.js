import regionData from '../data/demographic_data.js'

var line = '', headers = 'gid,name,direction,total,male,transgender,female,sexRatio,childSexRatio,familySize,nuclearFamily,jointFamily,femaleLiteracy,maleLiteracy,avgLiteracy,aboveGraduation,graduation,higherSecondary,illiterate,primary,middle,secondary,hindu,baudha,muslim,hindi,bhojpuri,urdu,marathi,bangala,other,avgFamilyIncome,avgEarningMember,casualLabourer,regularIncome,selfEmployeed,homeBasedBusiness,ragPicker,underweight,stunted,wasted,anaemia,infantMortality,fever,gastro,urti,hepatitis,malaria,dengue,tuberculosis,total,hypertension,diabetes,asthma,ihd,psychiatricDisorders,total,numberGovtHospitals,availableGovtDisp,densityGovtDisp,percentPublicHosp,percentPrivateHosp,noInsurance,percentIncomeHealth\r\n';

const iterate = (obj) => {
    Object.keys(obj).forEach(key => {
        if (typeof obj[key] != 'object') {
            if (line != "") line += ",";
            line += obj[key];
        }
        if (typeof obj[key] === 'object') {
            iterate(obj[key])
        }
    })
}

const convertToCSV = (json) => {
    let str = '';
    for (var i = 0; i < json.length; i++) {
        line = ''
        iterate(json[i])
        str += line + "\r\n";
    }
    return str;
}

export const downloadDemographicSample = () => {
    let csv = headers + convertToCSV(regionData);

    var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    if (navigator.msSaveBlob) {
        navigator.msSaveBlob(blob, 'Sample Demographic Data.csv');
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) {
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", 'Sample Demographic Data.csv');
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}


