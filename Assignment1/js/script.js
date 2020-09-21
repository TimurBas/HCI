// Constants
const grid = document.getElementById("grid");
const title = document.getElementById("title");
const description1 = document.getElementById("description1");
const description2 = document.getElementById("description2");
const btn = document.getElementById("btn");

// Variables
let gridSize = 0;
let reactionTimes = new Array();
let resultDiv;

// Methods
function startTest() {
    btn.onclick = () => removeHTML();
}

function removeHTML() {
    title.remove();
    description1.remove();
    description2.remove();
    btn.remove();
    startNextRound();
}

function startNextRound() {
    gridSize++;

    let delay = Math.floor(3000 * Math.random() + 500);

    if(gridSize > 10) {
        showResults();
        return;
    }
    setTimeout(() => createGrid(gridSize), delay);
}

function createGrid(n) {
    grid.style.gridTemplateRows = "repeat(" + n.toString() + ", 1fr)";
    grid.style.gridTemplateColumns = "repeat(" + n.toString() + ", 1fr)"

    var items = [];

    // Fill array with random grid items
    for(let i = 0; i < n * n; i++) {
        let gridItem = createGridItem(Math.floor((3 * Math.random() + 2)), 700 / n - 10);
        items.push(gridItem);
    }

    // Add one white circle to array at random index
    var whiteCircle = createGridItem(1, 700 / n - 10);
    var time = new Date().getTime();
    whiteCircle.onmousedown = () => circleClicked(time);
    items[Math.floor(Math.random() * items.length)] = whiteCircle;

    // Draw all grid items from array
    items.forEach(p => grid.appendChild(p));
}

function createGridItem(classNumber, size) {
    let gridItem = document.createElement("div");
    gridItem.style.width = size + "px";
    gridItem.style.height = size + "px";
    gridItem.className = "grid-item-" + classNumber;

    return gridItem;
}

function circleClicked(gridCreationTime) {
    console.log(new Date().getTime() - gridCreationTime);
    reactionTimes.push(new Date().getTime() - gridCreationTime);

    clearGrid();
    startNextRound();
}

function clearGrid() {
    while(grid.lastElementChild) {
        grid.removeChild(grid.lastElementChild);
    }
}

function showResults() {
    resultDiv = document.createElement("div");
    grid.parentNode.insertBefore(resultDiv, grid);

    // Show result of each trial
    for (let i = 0; i < reactionTimes.length; i++) {
        resultDiv.appendChild(createResultDiv("Trial " + (i + 1).toString(), reactionTimes[i]));
    }

    // Calculate and show mean
    let meanDeltaTime = reactionTimes.reduce((a, b) => a + b) / reactionTimes.length;
    resultDiv.appendChild(createResultDiv("Mean", meanDeltaTime));
    
    // let standardDeviation = 0.0;
    // for (let i = 0; i < reactionTimes.length; i++) {
    //     let diff = (reactionTimes[i] - meanDeltaTime);
    //     standardDeviation += diff * diff;
    // }
    // standardDeviation = Math.round(Math.sqrt(standardDeviation / reactionTimes.length));

    // Calculate and show standard deviation
    let standardDeviation = Math.sqrt(reactionTimes.map(a => a - 600).map(a => a * a).reduce((a, b) => a + b) / reactionTimes.length);
    resultDiv.appendChild(createResultDiv("SD", standardDeviation));

    let retryButton = document.createElement("div");
    resultDiv.appendChild(retryButton);
    retryButton.id = "retry";
    retryButton.innerHTML = "Retry";

    retryButton.onclick = () => {
        clearResult();
        reactionTimes = new Array();
        gridSize = 0;
        startNextRound();
    }
}

function createResultDiv(attribute, attributeResult) {
    let resultDiv = document.createElement("div");
    resultDiv.style.width = 300 + "px";
    resultDiv.style.height = 50 + "px";
    resultDiv.className = "reaction-time-result";
    resultDiv.innerHTML = attribute + ": " + Math.round(attributeResult) + " ms";

    return resultDiv;
}

function clearResult() {
    while(resultDiv.lastElementChild) {
        resultDiv.removeChild(resultDiv.lastElementChild);
    }
}

window.onload = () => startTest();