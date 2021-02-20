const init = () => {
  document.getElementById("defaultOpen").click();
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

const changeToolbarIcon = (icon) => {
  let toolbarIcons = document.getElementsByClassName("toolbarIcon");
  for (i = 0; i < toolbarIcons.length; i++) {
    toolbarIcons[i].className = toolbarIcons[i].className.replace(
      " activeIcon",
      ""
    );
  }
  let activeIcon = document.getElementById(icon);
  activeIcon.className += " activeIcon";

  switch (icon) {
    case "demographicDataIcon":
      if (document.getElementById("left").style.display === "none") {
        document.getElementById("left").style.display = "block";
      } else {
        document.getElementById("left").style.display = "none";
      }
    case "parameterIcon":
  }
};
