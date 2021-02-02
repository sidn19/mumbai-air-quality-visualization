const init = () => {
  document.getElementById("defaultOpen").click();
};

const toggleDemoData = () => {
  let infoToggle = document.getElementById("showInfo").checked;
  if (infoToggle) {
    document.getElementById("left").style.display = "block";
  } else {
    document.getElementById("left").style.display = "none";
  }
};

const toggleHeatmap = () => {
  console.log("hello");
};

const openData = (category) => {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabContent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  tablinks = document.getElementsByClassName("tabLink");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  document.getElementById(category).style.display = "block";
  event.currentTarget.className += " active";
};

const zoom = (x) => {
  // x = 1 if zoom in, 0 if out
  console.log(x);
  // connect to zoom functionality
};
