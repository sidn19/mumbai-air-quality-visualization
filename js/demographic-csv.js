import { state } from './state.js'

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

export const downloadDemographicSample = () => {
    const headers = {
        gid: 'gid',
        name: 'name',
        direction: 'direction',
        totalPopulation: 'totalPopulation',
        malePopulation: 'malePopulation',
        transgenderPopulation: 'transgenderPopulation',
        femalePopulation: 'femalePopulation',
        sexRatio: 'sexRatio',
        childSexRatio: 'childSexRatio',
        familySize: 'familySize',
        nuclearFamily: 'nuclearFamily',
        jointFamily: 'jointFamily',
        femaleLiteracy: 'femaleLiteracy',
        maleLiteracy: 'maleLiteracy',
        avgLiteracy: 'avgLiteracy',
        aboveGraduation: 'aboveGraduation',
        graduation: 'graduation',
        higherSecondary: 'higherSecondary',
        illiterate: 'illiterate',
        primary: 'primary',
        middle: 'middle',
        secondary: 'secondary',
        hindu: 'hindu',
        baudha: 'baudha',
        muslim: 'muslim',
        hindi: 'hindi',
        bhojpuri: 'bhojpuri',
        urdu: 'urdu',
        marathi: 'marathi',
        bangala: 'bangala',
        other: 'other',
        avgFamilyIncome: 'avgFamilyIncome',
        avgEarningMember: 'avgEarningMember',
        casualLabourer: 'casualLabourer',
        regularIncome: 'regularIncome',
        selfEmployeed: 'selfEmployeed',
        homeBasedBusiness: 'homeBasedBusiness',
        ragPicker: 'ragPicker',
        underweight: 'underweight',
        stunted: 'stunted',
        wasted: 'wasted',
        anaemia: 'anaemia',
        infantMortality: 'infantMortality',
        fever: 'fever',
        gastro: 'gastro',
        urti: 'urti',
        hepatitis: 'hepatitis',
        malaria: 'malaria',
        dengue: 'dengue',
        tuberculosis: 'tuberculosis',
        totalCommDiseases: 'totalCommDiseases',
        hypertension: 'hypertension',
        diabetes: 'diabetes',
        asthma: 'asthma',
        ihd: 'ihd',
        psychiatricDisorders: 'psychiatricDisorders',
        totalNonCommDiseases: 'totalNonCommDiseases',
        numberGovtHospitals: 'numberGovtHospitals',
        availableGovtDisp: 'availableGovtDisp',
        densityGovtDisp: 'densityGovtDisp',
        percentPublicHosp: 'percentPublicHosp',
        percentPrivateHosp: 'percentPrivateHosp',
        noInsurance: 'noInsurance',
        percentIncomeHealth: 'percentIncomeHealth'
    };

    state.datasets.demographic.data.unshift(headers);

    var jsonObject = JSON.stringify(state.datasets.demographic.data);

    var csv = convertToCSV(jsonObject);

    var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    if (navigator.msSaveBlob) {
        navigator.msSaveBlob(blob, 'demo-demographic-data.csv');
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) {
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", 'demo-demographic-data.csv');
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}


