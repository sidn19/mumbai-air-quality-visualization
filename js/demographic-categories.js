export const tabs = ["population", "family"];

export const piechartCategories = (tab, region) => {
  switch (tab) {
    case "population":
      return [
        {
          type: "Male",
          value: region.data.population.male,
          color: "#0275d8",
        },
        {
          type: "Female",
          value: region.data.population.female,
          color: "#fb98d4",
        },
        {
          type: "Transgender",
          value: region.data.population.transgender,
          color: "#FFFF00",
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
  }
};

export const createLegend = (categories) => {
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

  for (let property of properties) {
    let otherProperty = document.createElement("h3");
    otherProperty.setAttribute("class", "otherProperty");
    otherProperty.textContent = `${property.type}: ${property.value}`;
    otherPropertiesDiv.append(otherProperty);
  }

  return otherPropertiesDiv;
};
