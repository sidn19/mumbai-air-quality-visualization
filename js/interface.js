const toggleDemoData = () => {
  let infoToggle = document.getElementById("showInfo").checked;
  if (infoToggle) {
    document.getElementById("left").style.display = "block";
  } else {
    document.getElementById("left").style.display = "none";
  }
};

const toggleHeatmap = () => {};
