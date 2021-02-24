import regionData from "../data/demographic_data.js";
import { createPieChart } from "./piechart.js";
import {
  tabs,
  piechartCategories,
  otherProperties,
  createLegend,
  addOtherProperties,
} from "./demographic-categories.js";

let currentPiechartCategories = null;
let currentOtherProperties = null;

const findRegion = (gid) => {
  return regionData.find((region) => region.gid == gid);
};

const populateData = (tab, region) => {
  // Get piechart and other properties of the population tab
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

// Add a click event to each region
export const regionEventListener = () => {
  let currentRegionId = null;
  let currentRegion = null;
  let regions = document.getElementsByClassName("region");

  for (let i = 0; i < regions.length; i++) {
    regions[i].addEventListener("click", (event) => {
      currentRegionId = event.target.attributes[5].nodeValue;
      currentRegion = findRegion(currentRegionId);
      populateDemographicData(currentRegion);
    });
  }
};

window.addEventListener("load", regionEventListener);
