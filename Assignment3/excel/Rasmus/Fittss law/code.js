var leftBox;
var rightBox;
var repetitions = 8; //number of repetitions
var results = []; //array including widths, distances and mts per trial
var timerStart;
var timerEnd;
var mt = 0; //movement time
var width;
var distance;
var widths = [6,12,24,48];
var distances = [40,80,160,320];
var startedAtLeftBox = true; //trial starts at left box
var completedCombinations = []; //array including all combinations completed
var counter = -1;
var numberOfConditions = widths.length * distances.length; //number of total conditions


//your trials should be saved here.
function saveTrial(mt){
	let result = {
		distance: distance,
		width: width,
		mt: mt
	};
	results.push(result);
}

//your data is exported and downloaded as a csv-file.
function saveToCsv(){
	var lineArray = [];
	let csvContent = "data:text/csv;charset=utf-8,width(px),distance(px),mt(ms)\n";
	results.forEach(function (infoArray, index) {
		let distance = infoArray.distance;
		let width = infoArray.width;
		let mt = infoArray.mt;
	    var line =  width + "," + distance+ "," + mt+"\n";
	    csvContent+=line;
	});
	var encodedUri = encodeURI(csvContent);
	console.log(encodedUri);
	var link = document.createElement("a");
	link.setAttribute("href", encodedUri);
	link.setAttribute("download", "results.csv");
	document.body.appendChild(link);
	link.click();
}

function quitExperiment(){
	document.getElementById("text").innerHTML = "Thank you for participating";
	rightBox.remove();
	leftBox.remove();

}

//check if condition is already completed. If so, true is returned, i.e. combination will not be tested again.
function checkIfConditionAlreadyCompleted(currentCombination){
	for (var i = 0, len = completedCombinations.length; i < len; i++) {
    	if (completedCombinations[i][0] == currentCombination[0] && completedCombinations[i][1] == currentCombination[1]) {
            return true;
        }
    }
    return false;
	
}

/*get random indices from array to obtain random width and distance. If combination of width and distance already tested,
 new indices are generated. 
*/
function getIndices(){
	let indexToGetWidth = 0;
	let indexToGetDistance = 0;
	let indices = [];
	do {
		indexToGetWidth = Math.floor((Math.random() * widths.length));
		indexToGetDistance = Math.floor((Math.random() * distances.length));
	}while(checkIfConditionAlreadyCompleted([indexToGetWidth,indexToGetDistance]) == true)
	completedCombinations.push([indexToGetWidth,indexToGetDistance]);
	indices.push(indexToGetWidth,indexToGetDistance);
	return indices;
}

//get width and distance and save in parameters array
function getParameters(){
	let indices = getIndices();
	let parameters = {
		width: widths[indices[0]],
		distance: distances[indices[1]]
	}
	return parameters;
}

function onRightBoxClicked(event){
	//if trials starts at left box
	if(startedAtLeftBox == true){
		calculateTrial();
		startedAtLeftBox = false;	
	}
	leftBox.classList.remove("disabledBox");
	rightBox.classList.add("disabledBox");
	initTarget(rightBox,leftBox);
	incrementCounter();
}

//sets the position of the target
function setTargetPosition(start,newTarget){
	newTarget.style.width = width;
	newTarget.style.left = distance;
	start.style.width = width;
}

//initializes target and starts timer
function initTarget(start,newTarget){
	start.classList.remove("borderStyle");
	newTarget.classList.add("borderStyle");
	timerStart = Date.now();
}

//initializes new condition 
function initCondition(start,newTarget){
	let parameters = getParameters();
	width = parameters["width"];
	distance = parameters["distance"];
	setTargetPosition(start,newTarget);
	start.classList.add("borderStyle");
	rightBox.classList.remove("borderStyle");
}

//increments counter to track repetitions. If repetitions finished, user can start new conition by clicking startButton
function incrementCounter(){
	counter++;
	if(counter>=repetitions){
		leftBox.style.visibility ="hidden";
		rightBox.style.visibility ="hidden";
		startButton.disabled=false;	
		counter = -1;
	}
}

//time per trial is calculated.
function calculateTrial(){
	timerEnd = Date.now();
	let mt = timerEnd - timerStart;
	saveTrial(mt);
	if(completedCombinations.length >= numberOfConditions){
		startButton.innerHTML = "Download data";
	}
}

function onLeftBoxClicked(event){
	//if trials starts at right box
 	if(startedAtLeftBox == false){
 		calculateTrial();
 		startedAtLeftBox = true;
 	}
	leftBox.classList.add("disabledBox");
	rightBox.classList.remove("disabledBox");
	initTarget(leftBox,rightBox);
	incrementCounter();
}	

// new condition starts. If all trials finished, csv-file with data can be downloaded
function onStartButtonClicked(){
	if(completedCombinations.length>=numberOfConditions){
		saveToCsv();
		quitExperiment();
	}
	else{
		leftBox.style.visibility ="visible";
		rightBox.style.visibility ="visible";
		initCondition(leftBox,rightBox);
		startButton.disabled = true;
		startedAtLeftBox = true;
		startButton.innerHTML = "Start new condition";
		leftBox.classList.remove("disabledBox");
		rightBox.classList.add("disabledBox");
	}
}

//initialize reference to dom-elements and start click-listeners
function init(){
	leftBox = document.querySelector(".left-box")
	rightBox = document.querySelector(".right-box");
	rightBox.addEventListener("mousedown", onRightBoxClicked);
	leftBox.addEventListener("mousedown",onLeftBoxClicked);
	startButton = document.querySelector("#start-button");
	startButton.addEventListener("click",onStartButtonClicked);
}

init();



