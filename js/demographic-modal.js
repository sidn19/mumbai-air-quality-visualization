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
  for(let path of document.querySelectorAll('.activeRegion')){
    path.setAttribute('class', path.getAttribute('class').replace('activeRegion',""))
  }
}


// Add a click event to each region
export const regionEventListener = () => {
  let regions = document.getElementsByClassName("region");
  
  for (let i = 0; i < regions.length; i++) {
    regions[i].addEventListener("click", (event) => {
      // Remove 'activeRegion' classname
      clearActiveRegions();

      // Get region id of selected event
      state.currentRegionId = event.target.attributes[5].nodeValue;
      state.currentRegion = findRegion(state.currentRegionId);

      //Highlight selected region
      event.target.setAttribute('class',`${event.target.getAttribute('class')} activeRegion`)
      
      populateDemographicData(state.currentRegion);
    });
  }
};

window.addEventListener("load", () => {
  regionEventListener();
  document.querySelector(".active").click();
});
