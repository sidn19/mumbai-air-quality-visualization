// religion => religion and language
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
          value: region.data.population.male,
          color: "#b5fff6",
        },
        {
          type: "Female",
          value: region.data.population.female,
          color: "#ffc2e7",
        },
        {
          type: "Transgender",
          value: region.data.population.transgender,
          color: "#fff899",
        },
      ];
    case "family":
      return [
        {
          type: "Nuclear Family",
          value: region.data.family.nuclearFamily,
          color: "#ccc",
        },
        {
          type: "Joint Family",
          value: region.data.family.jointFamily,
          color: "#eee",
        },
      ];
    case "education":
      return [
        {
          type: "Illiterate",
          value: region.data.education_level.illiterate,
          color: "#aaa",
        },
        {
          type: "Primary",
          value: region.data.education_level.primary,
          color: "#bbb",
        },
        {
          type: "Middle",
          value: region.data.education_level.middle,
          color: "#ccc",
        },
        {
          type: "Secondary",
          value: region.data.education_level.secondary,
          color: "#ddd",
        },
        {
          type: "Higher Secondary",
          value: region.data.education_level.higherSecondary,
          color: "#eee",
        },
        {
          type: "Graduation",
          value: region.data.education_level.graduation,
          color: "#abc",
        },
        {
          type: "Above Graduation",
          value: region.data.education_level.aboveGraduation,
          color: "#def",
        },
      ];
    case "religion":
      return [
        {
          type: "Muslim",
          value: region.data.religion.muslim,
          color: "#abc",
        },
        {
          type: "Hindu",
          value: region.data.religion.hindu,
          color: "#def",
        },
        {
          type: "Baudha",
          value: region.data.religion.baudha,
          color: "#ace",
        },
      ];
    case "language":
      return [
        {
          type: "Hindi",
          value: region.data.language.hindi,
          color: "#aaa",
        },
        {
          type: "Bhojpuri",
          value: region.data.language.bhojpuri,
          color: "#bbb",
        },
        {
          type: "Urdu",
          value: region.data.language.urdu,
          color: "#ccc",
        },
        {
          type: "Marathi",
          value: region.data.language.marathi,
          color: "#ddd",
        },
        {
          type: "Bangala",
          value: region.data.language.bangala,
          color: "#eee",
        },
        {
          type: "Other",
          value: region.data.language.other,
          color: "#aec",
        },
      ];
    case "occupation":
      return [
        {
          type: "Casual Labourer",
          value: region.data.occupation.casualLabourer,
          color: "#aaa",
        },
        {
          type: "Salaried-Regular Income",
          value: region.data.occupation.regularIncome,
          color: "#bbb",
        },
        {
          type: "Business/Self-Employeed",
          value: region.data.occupation.selfEmployeed,
          color: "#ccc",
        },
        {
          type: "Home Based Business",
          value: region.data.occupation.homeBasedBusiness,
          color: "#ddd",
        },
        {
          type: "Rag Picker",
          value: region.data.occupation.ragPicker,
          color: "#eee",
        },
      ];
    case "healthindi":
      return null;
    case "healthinfra":
      return [
        {
          type: "Population accessing public hospitals/ dispensaries",
          value: region.data.healthInfrastructure.percentPublicHosp,
          color: "#aaa",
        },
        {
          type: "Population accessing private hospitals/ dispensaries",
          value: region.data.healthInfrastructure.percentPrivateHosp,
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
          value: region.data.population.total,
        },
        {
          type: "Sex Ratio",
          value: region.data.population.sexRatio,
        },
        {
          type: "Child Sex Ratio",
          value: region.data.population.childSexRatio,
        },
      ];
    case "family":
      return [
        {
          type: "Family Size",
          value: region.data.family.familySize,
        },
      ];
    case "education":
      return [
        {
          type: "Average Literacy",
          value: region.data.education.avgLiteracy + "%",
        },
        {
          type: "Female Literacy",
          value: region.data.education.femaleLiteracy + "%",
        },
        {
          type: "Male Literacy",
          value: region.data.education.maleLiteracy + "%",
        },
      ];
    case "religion":
      return [];
    case "occupation":
      return [
        {
          type: "Average Family Income",
          value: region.data.income.avgFamilyIncome,
        },
        {
          type: "Average Earning Member",
          value: region.data.income.avgEarningMember,
        },
      ];
    case "healthindi":
      return [
        {
          type: "% of Children Who Are Underweight",
          value: region.data.healthIndicators.underweight + "%",
        },
        {
          type: "% of Children Who Are Stunted",
          value: region.data.healthIndicators.stunted + "%",
        },
        {
          type: "% of Children Who Are Wasted",
          value: region.data.healthIndicators.wasted + "%",
        },
        {
          type: "Infant Mortality (per 1000 live births, 12 clusters)",
          value: region.data.healthIndicators.anaemia,
        },
        {
          type: "Anaemia in Pregnant Women",
          value: region.data.healthIndicators.infantMortality + "%",
        },
      ];
    case "diseases":
      return [
        {
          type: "Number of Cases of Communicable Cases",
          value: region.data.commDiseases.total,
        },
        {
          type: "Number of Cases of Fever",
          value: region.data.commDiseases.fever,
        },
        {
          type: "Number of Cases of Gastro",
          value: region.data.commDiseases.gastro,
        },
        {
          type: "Number of Cases of URTI",
          value: region.data.commDiseases.urti,
        },
        {
          type: "Number of Cases of Hepatitis",
          value: region.data.commDiseases.hepatitis,
        },
        {
          type: "Number of Cases of Malaria",
          value: region.data.commDiseases.malaria,
        },
        {
          type: "Number of Cases of Dengue",
          value: region.data.commDiseases.dengue,
        },
        {
          type: "Number of Cases of Tuberculosis",
          value: region.data.commDiseases.tuberculosis,
        },
        {
          type: "Number of Cases of Non Communicable Diseases",
          value: region.data.nonCommDiseases.total,
        },
        {
          type: "Number of Cases of Hypertension",
          value: region.data.nonCommDiseases.hypertension,
        },
        {
          type: "Number of Cases of Diabetes",
          value: region.data.nonCommDiseases.diabetes,
        },
        {
          type: "Number of Cases of Asthma",
          value: region.data.nonCommDiseases.asthma,
        },
        {
          type: "Number of Cases of IHD",
          value: region.data.nonCommDiseases.ihd,
        },
        {
          type: "Number of Cases of Psychiatric Disorders",
          value: region.data.nonCommDiseases.psychiatricDisorders,
        },
      ];
    case "healthinfra":
      return [
        {
          type: "No. of Government Hospitals",
          value: region.data.healthInfrastructure.numberGovtHospitals,
        },
        {
          type: "Available Government Dispensaries",
          value: region.data.healthInfrastructure.availableGovtDisp,
        },
        {
          type: "Density of government dispensaries to population",
          value: region.data.healthInfrastructure.densityGovtDisp,
        },
        {
          type: "% households where no member has insurance",
          value: region.data.healthInsurance.noInsurance,
        },
        {
          type: "% of annual family income spent on health",
          value: region.data.healthInsurance.percentIncomeHealth,
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
