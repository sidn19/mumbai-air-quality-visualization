import regionData from "../data/demographic_data.js";
import { createPieChart } from "./piechart.js";
import {
  tabs,
  piechartCategories,
  otherProperties,
  createLegend,
  addOtherProperties,
} from "./demographic-categories.js";
import { state } from "./state.js";

let currentPiechartCategories = null;
let currentOtherProperties = null;

const findRegion = (gid) => {
  return regionData.find((region) => region.gid == gid);
};

const populateData = (tab, region) => {
  // Get piechart and other properties of the tab
  currentPiechartCategories = piechartCategories(tab, region);
  currentOtherProperties = otherProperties(tab, region);

  // Clear all previous child nodes
  let div = document.getElementById(tab);
  div.innerHTML = "";

  // Add the piechart and legend
  div.append(
    createPieChart(currentPiechartCategories, 100, false, 90),
    createLegend(currentPiechartCategories)
  );

  //Display other properties
  div.append(addOtherProperties(currentOtherProperties));
};

const populateDemographicData = (region) => {

  // Change region name and direction
  document.getElementById("regionName").textContent = region.name;
  document.getElementById("regionDir").textContent =
    region.direction === "east"
      ? "East"
      : region.direction === "west"
        ? "West"
        : "Other";

  //Populate data
  for (let tab of tabs) {
    populateData(tab, region);
  }
};

const clearActiveRegions = () => {
  for (let path of document.querySelectorAll('.activeRegion')) {
    path.setAttribute('class', path.getAttribute('class').replace('activeRegion', ""))
  }
}

const clearDemographicData = () => {
  // Clear tab content
  for (let tab of tabs) {
    let div = document.getElementById(tab);
    div.innerHTML = "";
  }

  // Change region and direction name
  document.getElementById("regionName").textContent = 'Region name';
  document.getElementById("regionDir").textContent = 'M Ward East/West'
}

const changeCurrentRegion = (event) => {
  // Current region is not the activeRegion
  if (event.target.getAttribute('class').indexOf('activeRegion') === -1) {
    // Remove 'activeRegion' classname
    clearActiveRegions(event.target);

    // Get region id of selected event
    state.currentRegionDataElement = event.target;
    state.currentRegionId = event.target.getAttribute('gid');
    state.currentRegionIndex = parseInt(event.target.getAttribute('index'));
    state.currentRegionData = findRegion(state.currentRegionId);

    //Highlight selected region
    event.target.setAttribute('class', `${event.target.getAttribute('class').replace(' regionHover', '')} activeRegion`);

    populateDemographicData(state.currentRegionData);
  }
  // Current region is the activeRegion => Deselect
  else {
    clearDemographicData()
    event.target.setAttribute('class', event.target.getAttribute('class').replace('activeRegion', ""))
  }

}

// Add a click event to the whole svg region
export const regionEventListener = () => {

  let regions = document.getElementById("svg-regions");
  regions.addEventListener("click", changeCurrentRegion);
};

window.addEventListener("load", () => {
  state.hasPageLoaded = true;
  regionEventListener();
  document.querySelector(".active").click();
});
