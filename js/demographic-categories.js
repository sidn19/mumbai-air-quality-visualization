export const tabs = [
  "population",
  "family",
  "education",
  "religion",
  "language",
  "occupation",
  "healthindi",
  "diseases",
  "healthinfra",
];

export const piechartCategories = (tab, region) => {
  switch (tab) {
    case "population":
      return [
        {
          type: "Male",
          value: region.malePopulation,
          color: "#b5fff6",
        },
        {
          type: "Female",
          value: region.femalePopulation,
          color: "#ffc2e7",
        },
        {
          type: "Transgender",
          value: region.transgenderPopulation,
          color: "#fff899",
        },
      ];
    case "family":
      return [
        {
          type: "Nuclear Family",
          value: region.nuclearFamily,
          color: "#ccc",
        },
        {
          type: "Joint Family",
          value: region.jointFamily,
          color: "#eee",
        },
      ];
    case "education":
      return [
        {
          type: "Illiterate",
          value: region.illiterate,
          color: "#aaa",
        },
        {
          type: "Primary",
          value: region.primary,
          color: "#bbb",
        },
        {
          type: "Middle",
          value: region.middle,
          color: "#ccc",
        },
        {
          type: "Secondary",
          value: region.secondary,
          color: "#ddd",
        },
        {
          type: "Higher Secondary",
          value: region.higherSecondary,
          color: "#eee",
        },
        {
          type: "Graduation",
          value: region.graduation,
          color: "#abc",
        },
        {
          type: "Above Graduation",
          value: region.aboveGraduation,
          color: "#def",
        },
      ];
    case "religion":
      return [
        {
          type: "Muslim",
          value: region.muslim,
          color: "#abc",
        },
        {
          type: "Hindu",
          value: region.hindu,
          color: "#def",
        },
        {
          type: "Baudha",
          value: region.baudha,
          color: "#ace",
        },
      ];
    case "language":
      return [
        {
          type: "Hindi",
          value: region.hindi,
          color: "#aaa",
        },
        {
          type: "Bhojpuri",
          value: region.bhojpuri,
          color: "#bbb",
        },
        {
          type: "Urdu",
          value: region.urdu,
          color: "#ccc",
        },
        {
          type: "Marathi",
          value: region.marathi,
          color: "#ddd",
        },
        {
          type: "Bangala",
          value: region.bangala,
          color: "#eee",
        },
        {
          type: "Other",
          value: region.other,
          color: "#aec",
        },
      ];
    case "occupation":
      return [
        {
          type: "Casual Labourer",
          value: region.casualLabourer,
          color: "#aaa",
        },
        {
          type: "Salaried-Regular Income",
          value: region.regularIncome,
          color: "#bbb",
        },
        {
          type: "Business/Self-Employeed",
          value: region.selfEmployeed,
          color: "#ccc",
        },
        {
          type: "Home Based Business",
          value: region.homeBasedBusiness,
          color: "#ddd",
        },
        {
          type: "Rag Picker",
          value: region.ragPicker,
          color: "#eee",
        },
      ];
    case "healthindi":
      return null;
    case "healthinfra":
      return [
        {
          type: "Population accessing public hospitals/ dispensaries",
          value: region.percentPublicHosp,
          color: "#aaa",
        },
        {
          type: "Population accessing private hospitals/ dispensaries",
          value: region.percentPrivateHosp,
          color: "#ddd",
        },
      ];
  }
};

export const otherProperties = (tab, region) => {
  switch (tab) {
    case "population":
      return [
        {
          type: "Total Population",
          value: region.totalPopulation,
        },
        {
          type: "Sex Ratio",
          value: region.sexRatio,
        },
        {
          type: "Child Sex Ratio",
          value: region.childSexRatio,
        },
      ];
    case "family":
      return [
        {
          type: "Family Size",
          value: region.familySize,
        },
      ];
    case "education":
      return [
        {
          type: "Average Literacy",
          value: region.avgLiteracy + "%",
        },
        {
          type: "Female Literacy",
          value: region.femaleLiteracy + "%",
        },
        {
          type: "Male Literacy",
          value: region.maleLiteracy + "%",
        },
      ];
    case "religion":
      return [];
    case "occupation":
      return [
        {
          type: "Average Family Income",
          value: region.avgFamilyIncome,
        },
        {
          type: "Average Earning Member",
          value: region.avgEarningMember,
        },
      ];
    case "healthindi":
      return [
        {
          type: "% of Children Who Are Underweight",
          value: region.underweight + "%",
        },
        {
          type: "% of Children Who Are Stunted",
          value: region.stunted + "%",
        },
        {
          type: "% of Children Who Are Wasted",
          value: region.wasted + "%",
        },
        {
          type: "Infant Mortality (per 1000 live births, 12 clusters)",
          value: region.anaemia,
        },
        {
          type: "Anaemia in Pregnant Women",
          value: region.infantMortality + "%",
        },
      ];
    case "diseases":
      return [
        [
          {
            type: "Fever",
            value: region.fever,
          },
          {
            type: "Gastro",
            value: region.gastro,
          },
          {
            type: "URTI",
            value: region.urti,
          },
          {
            type: "Hepatitis",
            value: region.hepatitis,
          },
          {
            type: "Malaria",
            value: region.malaria,
          },
          {
            type: "Dengue",
            value: region.dengue,
          },
          {
            type: "Tuberculosis",
            value: region.tuberculosis,
          },
          {
            type: "Total",
            value: region.totalCommDiseases,
          }],
        [
          {
            type: "Hypertension",
            value: region.hypertension,
          },
          {
            type: "Diabetes",
            value: region.diabetes,
          },
          {
            type: "Asthma",
            value: region.asthma,
          },
          {
            type: "IHD",
            value: region.ihd,
          },
          {
            type: "Psychiatric Disorders",
            value: region.psychiatricDisorders,
          },
          {
            type: "Total",
            value: region.totalNonCommDiseases,
          }]]
    case "healthinfra":
      return [
        {
          type: "No. of Government Hospitals",
          value: region.numberGovtHospitals,
        },
        {
          type: "Available Government Dispensaries",
          value: region.availableGovtDisp,
        },
        {
          type: "Density of government dispensaries to population",
          value: region.densityGovtDisp,
        },
        {
          type: "% households where no member has insurance",
          value: region.noInsurance,
        },
        {
          type: "% of annual family income spent on health",
          value: region.percentIncomeHealth,
        },
      ];
  }
};

export const createLegend = (categories) => {
  if (!categories) return "";

  let legendDiv = document.createElement("div");

  //div container of legend
  legendDiv.setAttribute("class", "legendDiv");

  for (let category of categories) {
    //create legendCategory for each category
    let legendCategory = document.createElement("div");
    legendCategory.setAttribute("class", "legendCategory");

    // Legend color
    let categoryColor = document.createElement("div");
    categoryColor.setAttribute("class", "categoryColor");
    categoryColor.style.backgroundColor = category.color;

    // Legend type
    let categoryType = document.createElement("h3");
    categoryType.setAttribute("class", "categoryType");
    categoryType.textContent = category.type;

    // Legend value
    let categoryValue = document.createElement("h4");
    categoryValue.setAttribute("class", "categoryValue");
    categoryValue.textContent = category.value + "%";

    // Append color, type, and value to the legend category
    legendCategory.append(categoryColor, categoryType, categoryValue);

    legendDiv.append(legendCategory);
  }

  // Append the legend div to the content tab
  return legendDiv;
};

export const populateDiseasesTable = (properties) => {
  let div = document.createElement('div');

  // Create table heading
  for (let d in properties) {
    let h3 = document.createElement('h3');
    h3.setAttribute('class', 'disease-table-heading')
    if (d == 0) {
      h3.textContent = 'Communicable Diseases'
      div.append(h3)
    } else {
      h3.textContent = 'Non Communicable Diseases'
      div.append(h3)
    }

    // Create table
    let table = document.createElement('table')
    for (let i = -1; i < properties[d].length; i++) {
      let tr = document.createElement('tr');
      let td1 = document.createElement('td')
      let td2 = document.createElement('td')
      // Table headers
      if (i == -1) {
        let th1 = document.createElement('th');
        th1.setAttribute('class', 'disease-table-header')
        th1.textContent = 'Disease'
        let th2 = document.createElement('th');
        th2.setAttribute('class', 'disease-table-header')
        th2.textContent = 'Cases'
        tr.append(th1)
        tr.append(th2)
      } else {
        // Table data
        td1.textContent = properties[d][i].type;
        td1.setAttribute('class', 'disease-table-data')
        td2.textContent = properties[d][i].value;
        td2.setAttribute('class', 'disease-table-data')
        tr.append(td1)
        tr.append(td2)
      }
      table.append(tr)
      div.append(table)
    }
  }
  return div;
}

export const addOtherProperties = (properties) => {
  let otherPropertiesDiv = document.createElement("div");
  otherPropertiesDiv.setAttribute("class", "otherPropertiesDiv");

  if (properties) {
    for (let property of properties) {
      let otherProperty = document.createElement("h3");
      otherProperty.setAttribute("class", "otherProperty");
      otherProperty.textContent = `${property.type}: ${property.value}`;
      otherPropertiesDiv.append(otherProperty);
    }
  }

  return otherPropertiesDiv;
};
