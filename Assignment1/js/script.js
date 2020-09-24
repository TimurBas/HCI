// Constants
const grid = document.getElementById("grid");
const title = document.getElementById("title");
const description1 = document.getElementById("description1");
const description2 = document.getElementById("description2");
const btn = document.getElementById("btn");
const center = document.getElementById("center");
const testSizePixels = 700;
const gridItemMargin = 10;

// Variables
let gridSize = 0;
let reactionTimes = new Array();
let resultDiv;
let testTimeout;
let shouldClick = true;
let messageH1 = null;
let alertTimeout = null;

// Setup
window.onresize = () => changeSize();

document.onmousedown = () => {
    if (shouldClick) {
        return;
    }
    alertMessage("Stop clicking!");
    addRandomDelay(3000);
}
window.onload = () => startTest();

// Methods
function changeSize() {
    console.log(window.innerHeight, window.innerWidth);
    size = Math.min(window.innerHeight, window.innerWidth) * 0.75;
    size = Math.max(size, 300);
    document.documentElement.style.setProperty("--grid-pixel-size", size.toString() + "px");
}

function addRandomDelay(min) {
    clearTimeout(testTimeout);
    let delay = Math.floor(3000 * Math.random() + min);
    testTimeout = setTimeout(() => createGrid(gridSize), delay);
}

function startTest() {
    changeSize();
    btn.onclick = () => {
        removeHTML();
        shouldClick = false;
    }
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

    if(gridSize > 10) {
        showResults();
        return;
    }
    addRandomDelay(1500);
}

function createGrid(n) {
    shouldClick = true;
    document.documentElement.style.setProperty("--grid-size", n.toString());
    grid.style.gridTemplateRows = "repeat(" + n.toString() + ", 1fr)";
    grid.style.gridTemplateColumns = "repeat(" + n.toString() + ", 1fr)"

    let items = [];

    // Fill array with random grid items
    for(let i = 0; i < n * n; i++) {
        let gridItem = createGridItem(Math.floor((3 * Math.random() + 2)));
        items.push(gridItem);
    }

    // Add one white circle to array at random index
    let whiteCircle = createGridItem(1);
    let time = new Date().getTime();
    whiteCircle.onmousedown = () => circleClicked(time);
    items[Math.floor(Math.random() * items.length)] = whiteCircle;

    // Draw all grid items from array
    items.forEach(p => grid.appendChild(p));
}

function createGridItem(classNumber) {
    let gridItem = document.createElement("div");
    gridItem.className = "grid-item-" + classNumber;
    return gridItem;
}

function circleClicked(gridCreationTime) {
    setTimeout(() => shouldClick = false, 50);
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
    grid.remove();
    shouldClick = true;
    resultDiv = document.createElement("div");
    document.documentElement.style.setProperty("--center-height", (665).toString());
    center.height = "665px";
    center.appendChild(resultDiv);

    // Show result of each trial
    for (let i = 0; i < reactionTimes.length; i++) {
        resultDiv.appendChild(createResultDiv("Trial " + (i + 1).toString(), reactionTimes[i]));
    }

    // Calculate and show mean
    let meanDeltaTime = reactionTimes.reduce((a, b) => a + b) / reactionTimes.length;
    resultDiv.appendChild(createResultDiv("Mean", meanDeltaTime));
    
    // Calculate and show standard deviation
    let standardDeviation = Math.sqrt(reactionTimes.map(a => a - meanDeltaTime).map(a => a * a).reduce((a, b) => a + b) / reactionTimes.length);
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

function alertMessage(message) {
    if (messageH1 == null) {
        messageH1 = document.createElement("h1");
        messageH1.id = "alertMessage";
        messageH1.innerHTML = message;
        console.log(messageH1);
        if (center.contains(grid)) {
            center.insertBefore(messageH1, grid);
        }
    }

    if (alertTimeout != null) {
        clearTimeout(alertTimeout);
    }
    alertTimeout = setTimeout(() => {
        messageH1.remove();
        messageH1 = null;
    }, 1500);
}