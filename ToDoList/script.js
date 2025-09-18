const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
function addTask() {
    if(inputBox.value === ''){
        alert("You must write something!"); //if the input box is empty, alert the user
    }
    else {
        let li = document.createElement("li");
        li.innerHTML = inputBox.value; //create a new list item with the value from the input box
        listContainer.appendChild(li); //displays list item in the list container
        let span = document.createElement("span");
        span.innerHTML = "\u00d7"; //creates a span with a cross to delete the task
        li.appendChild(span); //appends the span to the list item
    }
    inputBox.value = ""; //clears the input box after adding the task
    saveData(); //whenever I add a new task, this function is called to save updated content in the browser's local storage
}

listContainer.addEventListener("click", function(e) {
    if(e.target.tagName === "LI") { //checks if the clicked element is a list item
        e.target.classList.toggle("checked"); // If it is, toggle the "checked" class
        saveData(); 
    }
    else if(e.target.tagName === "SPAN") { //checks if the clicked element is a span
        e.target.parentElement.remove(); //removes the parent element (LI) when the span is clicked
        saveData();
    }       
}, false);

function saveData() {
    localStorage.setItem("data", listContainer.innerHTML); //saves the current state of the list container to local storage
}
function showTask() {
    listContainer.innerHTML = localStorage.getItem("data"); //displays all content stored in browser
}
showTask(); //calls the function to show tasks when the page loads