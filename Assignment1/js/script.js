// Constants
const grid = document.getElementById("grid");
const title = document.getElementById("title");
const description1 = document.getElementById("description1");
const description2 = document.getElementById("description2");
const btn = document.getElementById("btn");

// Variables
let gridSize = 1;
let gridCreationTime;
let whiteCircle;
let reactionTime = new Array();
let resultDiv;

// Methods
function startTest() {
    btn.onclick = function(){removeHTML()}
}

function removeHTML() {
    title.remove();
    description1.remove();
    description2.remove();
    btn.remove();
    experiment();
}

function experiment() {
    let delay = Math.floor(2000 * Math.random() + 500);

    if(gridSize > 10) {
        showResults();
        return;
    }
    setTimeout(() => createGrid(gridSize), delay);
}

function circleClicked() {
    let circleClickedTime = new Date().getTime();

    let deltaTime = circleClickedTime - gridCreationTime;
    reactionTime.push(deltaTime);

    clearGrid();

    gridSize++;
    experiment();
}

function showResults() {
    resultDiv = document.createElement("div");
    grid.parentNode.insertBefore(resultDiv, grid);

    for(let i = 0; i < reactionTime.length; i++) {
        let reactionTimeResult = document.createElement("div");
        reactionTimeResult.style.width = 300 + "px";
        reactionTimeResult.style.height = 50 + "px";

        resultDiv.appendChild(reactionTimeResult);

        reactionTimeResult.className = "reaction-time-result";
        reactionTimeResult.innerHTML = "Trial " + (i+1).toString()+ ": " + reactionTime[i] + " ms";
    }

    let meanDeltaTime = 0.0;

    for (let i = 0; i < reactionTime.length; i++) {
        meanDeltaTime += reactionTime[i];
    }

    meanDeltaTime = Math.round(meanDeltaTime / reactionTime.length);

    let meanDeltaTimeResult = document.createElement("div");
    meanDeltaTimeResult.style.width = 300 + "px";
    meanDeltaTimeResult.style.height = 50 + "px";

    resultDiv.appendChild(meanDeltaTimeResult);

    meanDeltaTimeResult.className = "reaction-time-result";
    meanDeltaTimeResult.innerHTML = "Mean: " + meanDeltaTime + " ms";

    let standardDeviation = 0.0;
    for (let i = 0; i < reactionTime.length; i++) {
        let diff = (reactionTime[i] - meanDeltaTime);
        standardDeviation += diff * diff;
    }
    standardDeviation = Math.round(Math.sqrt(standardDeviation / reactionTime.length));

    let standardDeviationResult = document.createElement("div");
    standardDeviationResult.style.width = 300 + "px";
    standardDeviationResult.style.height = 50 + "px";

    resultDiv.appendChild(standardDeviationResult);

    standardDeviationResult.className = "reaction-time-result";
    standardDeviationResult.innerHTML = "SD: " + standardDeviation + " ms";

    let retryButton = document.createElement("div");
    resultDiv.appendChild(retryButton);
    retryButton.id = "retry";
    retryButton.innerHTML = "Retry";

    retryButton.onclick = function(){
        clearResult();
        reactionTime = new Array();
        gridSize = 1;
        experiment();
    }
}

function clearResult() {
    while(resultDiv.lastElementChild) {
        resultDiv.removeChild(resultDiv.lastElementChild);
    }
}

function clearGrid() {
    while(grid.lastElementChild) {
        grid.removeChild(grid.lastElementChild);
    }
}

function createGrid(n) {
    grid.style.gridTemplateRows = "repeat(" + n.toString() + ", 1fr)";
    grid.style.gridTemplateColumns = "repeat(" + n.toString() + ", 1fr)"

    let isPlaced = false;
    let isPlaced2 = false;

    for(let i = 0; i < n * n; i++) {

        // Create grid item
        let gridItem = document.createElement("div");

        //Size of grid item
        gridItem.style.width = (700 / n - 10).toString() + "px";
        gridItem.style.height = (700 / n -10).toString() + "px";

        // Append grid item to grid
        grid.appendChild(gridItem);

        // Return a random number between 2-4
        let randomShapeNumber = Math.floor(((3 * Math.random()) + 2));
        
        let probability = 1 / (n * n - i);
        if(Math.random() < probability && !isPlaced) {
            randomShapeNumber = 1;
            isPlaced = true;
            isPlaced2 = true;
        }

        // Determine which shape it should be
        gridItem.className = "grid-item-" + randomShapeNumber;

        if(isPlaced2) {
            whiteCircle = gridItem;
            isPlaced2 = false;
        }
    }

    // Get the time the entire grid was created
    gridCreationTime = new Date().getTime();
    whiteCircle.onclick = function(){circleClicked()};
}


window.onload = () => startTest();