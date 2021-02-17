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

// use jquery to add className activeIcon
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
};

const openDataSheetModal = () => {
  const datasetModal = document.getElementById('datasetModal');

  datasetModal.style.display = 'flex';

  var clickEvent = event => {
    if (event.target.id === 'datasetModal' || event.target.id === 'close-dataset-modal') {
      datasetModal.style.display = 'none';
      datasetModal.removeEventListener('click', clickEvent);
    }
  }
  
  datasetModal.addEventListener('click', clickEvent);
}

const changeDatasetModalTab = (event, type) => {
  for (let tab of document.getElementsByClassName('dataset-tab')) {
    tab.className = tab.className.replace(' active', '');
  }

  for (let tab of document.getElementsByClassName('dataset-list')) {
    tab.className = tab.className.replace(' active', '');
  }
  event.target.className += ' active';

  if (type === 'demographic') {
    document.getElementById('demo-dataset-list').className += ' active';
  }
  else {
    document.getElementById('aq-dataset-list').className += ' active';
  }
}
