// Select elements
const clear = document.querySelector('.clear');
const dateElement = document.getElementById('date');
const todoCountElement = document.getElementById('number-of-todo');
const list = document.getElementById('list');
const input = document.getElementById('input');
const message = document.getElementById('empty-list-message');
const addButton = document.getElementById('add-button');
const searchInput = document.getElementById('filter');

// Class names
const CHECK = 'fa-check-circle';
const UNCHECK = 'fa-circle-thin';
const LINETHROUGH = 'lineThrough';
const TRASH = 'fa-trash-o';

// Some text

// Variables
let LIST;
let id;
let validTasks = 0;
let undone = 0;

// Date variables
const options = {weekday: 'long', month: 'short', day: 'numeric'};
const today = new Date();


// Load data from localStorage or declare variables
const data = localStorage.getItem('TODO');

if (data) {
  LIST = JSON.parse(data);
  id = LIST.length;
  loadList(LIST);
} else {
  LIST = [];
  id = 0;
}

updateTodoCountHtml();
showEmptyListMessage();

/**
* Update display for the number of undone tasks
*/
function updateTodoCountHtml() {
  todoCountElement.innerHTML = `${undone} to do`;
}

/**
* Add all todo items from local storage on page refresh
* @param {array} todoList Todo items from local storage
*/
function loadList(todoList) {
  todoList.forEach(function(item) {
    addToDoHtml(item.name, item.id, item.done, item.trash);
  });
}

// Local storage
localStorage.setItem('TODO', JSON.stringify(LIST));

// Append today's date to view
dateElement.innerHTML = today.toLocaleDateString('en-US', options);

/**
* Append task to html if it is not deleted.
* @param {string} toDo Task description
* @param {int} id Unique identefier for item
* @param {boolean} done If task is completed or not
* @param {boolean} trash If task is deleted
*/
function addToDoHtml(toDo, id, done, trash) {
  if (trash) {
    return;
  }
  validTasks++;
  undone = done ? undone : ++undone;
  updateTodoCountHtml();

  const DONE = done ? CHECK : UNCHECK;
  const LINE = done ? LINETHROUGH : '';

  // New list element
  const listNode = document.createElement('li');
  listNode.classList.add('item');

  // Checkbox for marking task as complete
  const checkBox = document.createElement('i');
  checkBox.classList.add('fa', DONE, 'co');
  checkBox.setAttribute('job', 'complete');
  checkBox.setAttribute('id', id);

  // Paragraph to show task
  const textElement = document.createElement('p');
  const textNode = document.createTextNode(toDo);
  textElement.classList.add('text');
  textElement.appendChild(textNode);
  if (LINE) {
    textElement.classList.add(LINE);
  }

  // Delete button/icon
  const deleteNode = document.createElement('i');
  deleteNode.classList.add('fa', TRASH, 'de');
  deleteNode.setAttribute('job', 'delete');
  deleteNode.setAttribute('id', id);

  // Add elements to list item
  listNode.appendChild(checkBox);
  listNode.appendChild(textElement);
  listNode.appendChild(deleteNode);

  // Append list item to list
  list.appendChild(listNode);
}

/**
* Mark a task as completed
* @param {HTMLelement} element Task that is marked as done
*/
function completeToDo(element) {
  element.classList.toggle(CHECK);
  element.classList.toggle(UNCHECK);
  element.parentNode.querySelector('.text').classList.toggle(LINETHROUGH);
  LIST[element.id].done = LIST[element.id].done ? false : true;
  undone = LIST[element.id].done ? --undone : ++undone;
  updateTodoCountHtml();
}

/**
* Delete a task
* @param {HTMLelement} element Task to be deleted
*/
function removeToDo(element) {
  element.parentNode.parentNode.removeChild(element.parentNode);
  LIST[element.attributes.id.value].trash = true;
  validTasks--;
  undone = LIST[element.attributes.id.value].done ? undone : --undone;
  showEmptyListMessage();
}

/**
* Show info message if there are no tasks to display
*/
function showEmptyListMessage() {
  if (validTasks <= 0) {
    validTasks = 0;
    message.classList.remove('hidden');
  } else {
    message.classList.add('hidden');
  }
}

/**
* Create a task and store it in localStorage
* @param {string} toDo Task description
*/
function createTodoItem(toDo) {
  if (toDo) {
    addToDoHtml(toDo, id, false, false);
    LIST.push({
      name: toDo,
      id: id,
      done: false,
      trash: false,
    });
    localStorage.setItem('TODO', JSON.stringify(LIST));
    showEmptyListMessage();
    id++;
    input.value = '';
  } else {
    alert('Please fill out todo input');
    input.select();
  }
}

// Remove all todo tasks from localStorage and refresh page
clear.addEventListener('click', function() {
  localStorage.clear();
  location.reload();
});

// Event lister for the add task button
addButton.addEventListener('click', function() {
  createTodoItem(input.value);
});

/*
* Event listener that handles actions on the list element.
*/
list.addEventListener('click', function() {
  const element = event.target;
  const elementJob = element.hasAttribute('job') ?
  element.attributes.job.value : '';

  if (elementJob == 'complete') {
    completeToDo(element);
  } else if (elementJob == 'delete') {
    removeToDo(element);
  }

  updateTodoCountHtml();
  localStorage.setItem('TODO', JSON.stringify(LIST));
});

/*
* Add new task on enter click.
*/
document.addEventListener('keyup', function(even) {
  if (event.keyCode == 13) {
    const toDo = input.value;
    createTodoItem(toDo);
  }
});

/**
* Event listener for the search input field.
*/
searchInput.addEventListener('input', function() {
  // Declare variables
  let p;
  let i;
  let txtValue;

  // Get all elements in list
  const li = list.getElementsByTagName('li');

  // Create filter string with lower case letters
  const filter = searchInput.value.toLowerCase();

  // Loop through all list items,
  // and hide those who don't match the search query
  for (i = 0; i < li.length; i++) {
    p = li[i].getElementsByTagName('p')[0];
    txtValue = p.textContent || p.innerText;
    if (txtValue.toLowerCase().indexOf(filter) > -1) {
      li[i].style.display = '';
    } else {
      li[i].style.display = 'none';
    }
  }
});
