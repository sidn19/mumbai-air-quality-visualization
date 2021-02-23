export const populationCategories = (region) => {
  return [
    {
      type: "male",
      value: region.male,
      color: "#0275d8",
    },
    {
      type: "female",
      value: region.female,
      color: "#fb98d4",
    },
    {
      type: "transgender",
      value: region.transgender,
      color: "#1e0166",
    },
  ];
};

export const createLegend = (div, categories) => {
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
    legendCategory.appendChild(categoryColor);
    legendCategory.appendChild(categoryType);
    legendCategory.appendChild(categoryValue);

    legendDiv.appendChild(legendCategory);
  }

  // Append the legend div to the content tab
  div.appendChild(legendDiv);
};
