import { toggleHeatmap } from "./map.js";
import { state } from './state.js'

/*
 * Interface Functions
 */
export const openData = (event) => {
  let category = event.currentTarget.getAttribute("data-open");
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabContent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  tablinks = document.getElementsByClassName("tabLink");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  document.getElementById(category).style.display = "flex";
  event.currentTarget.className += " active";
};

export const changeToolbarIcon = (event) => {
  // let toolbarIcons = document.getElementsByClassName("toolbarIcon");
  // for (let i = 0; i < toolbarIcons.length; i++) {
  //   toolbarIcons[i].className = toolbarIcons[i].className.replace(
  //     " activeIcon",
  //     ""
  //   );
  // }
  // event.currentTarget.className += " activeIcon";

  switch (event.currentTarget.id) {
    case "demographicDataIcon":
      if (!state.viewDemographicData) {
        document.getElementById("left").style.display = "block";
        event.currentTarget.className += " activeIcon";
        state.viewDemographicData = true
      } else {
        document.getElementById("left").style.display = "none";
        event.currentTarget.className = event.currentTarget.className.replace(' activeIcon', '')
        state.viewDemographicData = false
      }
      break;
    case "parameterIcon":
      openModal("parameterModal", "close-parameter-modal");
      break;
    case "databaseIcon":
      openModal("datasetModal", "close-dataset-modal");
      break;
    case "heatmapIcon":
      toggleHeatmap();
      if (!state.viewHeatmap)
        event.currentTarget.className = event.currentTarget.className.replace(' activeIcon', '')
      else event.currentTarget.className += " activeIcon";
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

export const closeModal = (modalId) => {
  const modal = document.getElementById(modalId);
  modal.style.display = "none";
}

export const changeModalTab = (event) => {
  let activateId = event.currentTarget.getAttribute("data-modal-tab");
  let activeClasses = JSON.parse(
    event.currentTarget.getAttribute("data-tab-classes")
  );

  for (let activeClass of activeClasses) {
    for (let tab of document.getElementsByClassName(activeClass)) {
      tab.className = tab.className.replace(" active", "");
    }
  }

  event.currentTarget.className += " active";
  document.getElementById(activateId).className += " active";
};

export function snackbar(text, type = 'error') {
  const x = document.createElement('div');
  x.innerText = text;
  x.className += `snackbar ${type}`;
  document.body.append(x);
  setTimeout(function () {
    x.remove();
  }, 3000);
}

export function getAlert(text, confirmCallback) {
  const box = document.createElement('div');
  box.id = 'confirm';
  box.className += 'modal';
  box.style.display = 'flex';
  document.body.append(box);

  const frm = document.createElement('form');
  frm.className = 'modal-content';
  frm.action = '#';
  box.appendChild(frm);

  const container = document.createElement('div');
  container.className = 'container';
  frm.appendChild(container);


  const p = document.createElement('div');
  p.innerText = text;
  p.style.marginBottom = '1rem';
  container.appendChild(p);

  const footer = document.createElement('div');
  footer.className = 'modal-footer';
  container.appendChild(footer);

  const yes = document.createElement('button');
  yes.className = 'yesbtn';
  yes.innerText = "Confirm";
  yes.type = 'button';
  footer.appendChild(yes);
  yes.onclick = function () {
    confirmCallback();
    box.remove();
  }

  const no = document.createElement('button');
  no.className = 'nobtn';
  no.innerText = 'Cancel';
  no.type = 'button';
  footer.appendChild(no);
  no.onclick = function () {
    box.remove();
  }

  window.onclick = function (event) {
    if (event.target == box) {
      box.remove();
    }
  }
}