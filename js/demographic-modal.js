import regionData from "../data/demographic_data.js";
import { createPieChart } from "./piechart.js";
import {
  populationCategories,
  createLegend,
} from "./demographic-categories.js";

const findRegion = (gid) => {
  return regionData.find((region) => region.gid == gid);
};

const modalPopulation = (region) => {
  let div = document.getElementById("population");
  // Clear all previous child nodes
  div.innerHTML = "";

  // Add the piechart
  div.append(
    createPieChart(populationCategories(region.data.population), 100, false, 90)
  );
  // Add piechart legend
  createLegend(div, populationCategories(region.data.population));

  //Display total population, sex ratio, and child sex ratio
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
  //Populate population data
  modalPopulation(region);
};

// Add a click event to each region
export const regionEventListener = () => {
  let currentRegionId = null;
  let currentRegion = null;
  let regions = document.getElementsByClassName("region");
  for (let i = 0; i < regions.length; i++) {
    regions[i].addEventListener("click", (event) => {
      //or add id = gid to the path
      currentRegionId = event.target.attributes[5].nodeValue;
      currentRegion = findRegion(currentRegionId);
      populateDemographicData(currentRegion);
    });
  }
};

window.addEventListener("load", regionEventListener);
