/*
* Interface Functions
*/
export const openData = event => {
  let category = event.currentTarget.getAttribute('data-open');
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

export const changeToolbarIcon = event => {
  let toolbarIcons = document.getElementsByClassName("toolbarIcon");
  for (let i = 0; i < toolbarIcons.length; i++) {
    toolbarIcons[i].className = toolbarIcons[i].className.replace(
      " activeIcon",
      ""
    );
  }
  event.currentTarget.className += " activeIcon";

  switch (event.currentTarget.id) {
    case "demographicDataIcon":
      if (document.getElementById("left").style.display === "none") {
        document.getElementById("left").style.display = "block";
      } else {
        document.getElementById("left").style.display = "none";
      }
      break;
    case "parameterIcon":
      openModal("parameterModal", "close-parameter-modal");
      break;
    case "datasheetIcon":
      openModal("datasetModal", "close-dataset-modal");
      break;
  }
};

const openModal = (modalId, closeButtonClass) => {
  const modal = document.getElementById(modalId);
  modal.style.display = "flex";

  var clickEvent = (event) => {
    if (
      event.target.id === modalId ||
      event.target.className.includes(closeButtonClass)
    ) {
      modal.style.display = "none";
      modal.removeEventListener("click", clickEvent);
    }
  };

  modal.addEventListener("click", clickEvent);
};

export const changeModalTab = event => {
  let activateId = event.currentTarget.getAttribute('data-modal-tab');
  let activeClasses = JSON.parse(event.currentTarget.getAttribute('data-tab-classes'));
  
  for (let activeClass of activeClasses) {
    for (let tab of document.getElementsByClassName(activeClass)) {
      tab.className = tab.className.replace(" active", "");
    }
  }

  event.currentTarget.className += " active";
  document.getElementById(activateId).className += " active";
};
