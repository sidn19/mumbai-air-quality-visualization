import regionData from "../data/demographic_data.js";

const findRegion = (gid) => {
  return regionData.find((region) => region.gid == gid);
};

const populateDemographicData = (region) => {
  let name = document.getElementById("regionName");
  let direction = document.getElementById("regionDir");
  let population = document.getElementById("population");

  name.textContent = region.name;
  direction.textContent =
    region.direction === "east"
      ? "East"
      : region.direction === "west"
      ? "West"
      : "Other";
  population.textContent = region.data.poulation.total;
};

window.addEventListener("load", () => {
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
});
