const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const listColumns = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

// Items
 let updateOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];


// Drag Functionality
let draggableItem;
let dragging = false;
let currentColumn;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ['Release the course', 'Sit back and relax'];
    progressListArray = ['Work on projects', 'Listen to music'];
    completeListArray = ['Being cool', 'Getting stuff done'];
    onHoldListArray = ['Being uncool'];
  }
}


// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [backlogListArray, progressListArray,completeListArray,onHoldListArray];
  const listNames = ['backlog','progress','complete','onHold'];
  listNames.forEach((listName, index) => {
    localStorage.setItem(`${listName}Items`, JSON.stringify(listArrays[index]));
  });

}

// filtered Array function 
function filterArray(array) {
  const filteredEl = array.filter(item => item !== null);
  return filteredEl;
}

// update item || delete if necessary
function updateItem(id, column) {
  const selectedArrays = listArrays[column];
  const selectedColumnEl = listColumns[column].children;
  if(!dragging) {
    if (!selectedColumnEl[id].textContent){
      delete selectedArrays[id];
    } else {
      selectedArrays[id] = selectedColumnEl[id].textContent;
    }
    updateDOM();
  }
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {

  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute('ondragstart', 'drag(event)');
  listEl.contentEditable = true;
  listEl.id = index;
  listEl.setAttribute('onfocusout', `updateItem(${index}, ${column})`);
  //append
  columnEl.appendChild(listEl);

}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if(!updateOnLoad){
    getSavedColumns();
  }

  // Backlog Column
  backlogList.textContent = '';
  backlogListArray.forEach((backlogItem, index) =>{
    createItemEl(backlogList, 0, backlogItem, index);
  });
  backlogListArray = filterArray(backlogListArray);
  // Progress Column
  progressList.textContent = '';
  progressListArray.forEach((progressItem, index) =>{
    createItemEl(progressList, 1, progressItem, index);
  });

  progressListArray = filterArray(progressListArray);

  // Complete Column
  completeList.textContent = '';
  completeListArray.forEach((completeItem, index) =>{
    createItemEl(completeList, 2, completeItem, index);
  });

  completeListArray = filterArray(completeListArray);

  // On Hold Column
  onHoldList.textContent = '';
  onHoldListArray.forEach((onHoldItem, index) =>{
    createItemEl(onHoldList, 3, onHoldItem, index);
  });
 
  onHoldListArray = filterArray(onHoldListArray);


  // Run getSavedColumns only once, Update Local Storage
updateOnLoad = true;
updateSavedColumns();

}
// Add to column
function addToColumn(column) {
  
  const itemText = addItems[column].textContent;
  const selectedArrays = listArrays[column];
  selectedArrays.push(itemText);
  addItems[column].textContent = '';


  updateDOM();
}

//show item onclick
function showBtnBox (column) {
  addBtns[column].style.visibility = 'hidden';
  saveItemBtns[column].style.display = 'flex';
  addItemContainers[column].style.display = 'flex';
}

// hide item onclick
function hideBtnBox (column) {
  addBtns[column].style.visibility = 'visible';
  saveItemBtns[column].style.display = 'none';
  addItemContainers[column].style.display = 'none';
  addToColumn(column);
}
//rebuild arrays  drag items
function rebuildArray () {
  backlogListArray = Array.from(backlogList.children).map(i => i.textContent);
  
  progressListArray =Array.from(progressList.children).map(i => i.textContent);
  
  completeListArray =Array.from(completeList.children).map(i => i.textContent);
  
  onHoldListArray = Array.from(onHoldList.children).map(i => i.textContent);
  
updateDOM();
}

//when it starts to drag
function drag(e) {
  draggableItem = e.target;
  dragging = true;
}

// on allow   drop 

function allowDrop(e) {
  e.preventDefault();
}

// drag enter
function dragEnter(column) {
  listColumns[column].classList.add('over');
  currentColumn = column;
}

// on drop fnc
function drop(e){
  e.preventDefault();
//removing added class in each column
listColumns.forEach((column) =>{ 
  column.classList.remove('over');
});
//add item to column
const parent = listColumns[currentColumn];
parent.appendChild(draggableItem);

// dragging complete
dragging = false;
rebuildArray();
}

// on load

updateDOM();