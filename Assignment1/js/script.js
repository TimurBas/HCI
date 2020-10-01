// Constants
const title = document.getElementById("title");
const description1 = document.getElementById("description1");
const description2 = document.getElementById("description2");
const btn = document.getElementById("btn");
const center = document.getElementById("center");
const testSizePixels = 700;
const gridItemMargin = 10;

// Variables
let grid = document.getElementById("grid");
let gridSize = 0;
let reactionTimes = new Array();
let resultDiv;
let testTimeout;
let shouldClick = true;
let messageH1 = null;
let alertTimeout = null;
let retry = false;

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
    setTimeout(() => shouldClick = false, 10);
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
    setTimeout(() => shouldClick = true, 20);
    resultDiv = document.createElement("div");
    document.documentElement.style.setProperty("--center-height", (665).toString());
    center.height = "665px";
    center.appendChild(resultDiv);
    mailBody = "";

    // Show result of each trial and add to mail
    for (let i = 0; i < reactionTimes.length; i++) {
        time = reactionTimes[i];
        resultDiv.appendChild(createResultDiv("Trial " + (i + 1).toString(), time));
        mailBody += time + "<br>";
    }

    // Calculate, show, and add mean to mail
    let meanDeltaTime = reactionTimes.reduce((a, b) => a + b) / reactionTimes.length;
    resultDiv.appendChild(createResultDiv("Mean", meanDeltaTime));
    mailBody += meanDeltaTime.toFixed(3) + "<br>";

    
    // Calculate, show, and add standard deviation to mail
    let standardDeviation = Math.sqrt(reactionTimes.map(a => a - meanDeltaTime).map(a => a * a).reduce((a, b) => a + b) / reactionTimes.length);
    resultDiv.appendChild(createResultDiv("SD", standardDeviation));
    mailBody += standardDeviation.toFixed(3);

    let retryButton = document.createElement("div");
    resultDiv.appendChild(retryButton);
    retryButton.id = "retry";
    retryButton.innerHTML = "Retry";

    retryButton.onclick = () => {
        clearResult();
        document.documentElement.style.setProperty("--grid-size", "1");
        document.documentElement.style.setProperty("--center-height", "calc(100% - 150px)");
        changeSize();
        reactionTimes = new Array();
        gridSize = 0;
        startNextRound();
        grid = document.createElement("div");
        grid.id = "grid";
        center.appendChild(grid);
        retry = false;
        shouldClick = false;
    }

    sendEmail(mailBody);
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

function sendEmail(body) {
	Email.send({
    SecureToken : "af376f4a-ff74-4b35-8369-f5355f5b2ba3",
	To : 'rasmusogtimur@gmail.com',
	From : "rasmusogtimur@gmail.com",
	Subject : "Assignment 1 data",
	Body : body
	});
}