
// Constants
const content = document.getElementById("content");
const mainCircle = document.getElementById("main-circle");
const button = document.getElementById("button");
const body = document.getElementsByTagName('body')[0];
const width = 1024;
const height = 768

// Variables
let targetDiv = document.createElement("div");
let diameterArray = [];
let target;
let IDsArray = [];
let MTsArray = [];
let regression;
let points = 0;
let round = 0;
let n = 0;

class Position {
    constructor(x, y, distance) { 
        this.x = x;
        this.y = y;
        this.distance = distance;
    }
}

class Target {
    constructor(type, position) {
        this.type = type;
        this.position = position;
    }

    calculateID() {
        return Math.log2(distance/diameterArray[this.type])
    }
}

function init() {
    // Insert diameters
    diameterArray[1] = 10;
    diameterArray[2] = 30;
    diameterArray[3] = 50;
    
    mainCircle.remove();
    button.onmousedown = () => {
        removeStartHTML();
        startCalibration();
    }
}

// Calibration

function startCalibration() {
    calibrationDiv = document.createElement("div");
    calibrationDiv.id = "countdown";
    calibrationDiv.innerHTML = "The calibration begins in 5 seconds";
    content.appendChild(calibrationDiv);

    countDown(calibrationDiv, "calibration", calibrate);
}

function calibrate() {
    mainClickedTime = 0;
    targetClickedTime = 0;

    mainCircle.onmousedown = () => {
        mainClickedTime = new Date().getTime();
        createRandomTarget();
        mainCircle.onmousedown = null;
    }
    targetDiv.onmousedown = () => {
        targetClickedTime = new Date().getTime();
        targetDiv.remove();

        IDsArray[n] = target.calculateID();
        MTsArray[n] = targetClickedTime - mainClickedTime;

        n++;

        if (n >= 5) {
            calibrateResults();
        } else {
            calibrate();
        }
    }
}

function calibrateResults() {
    regression = linearRegression(IDsArray, MTsArray);

    if(regression.r2 >= 0.70 || n == 10) {
        startTest();
    } else {
        calibrate();
    }
}

// Test

function startTest() {
    mainCircle.remove();
    countdownDiv = document.createElement("div");
    countdownDiv.id = "countdown";
    countdownDiv.innerHTML = "The test begins in 5 seconds";
    content.appendChild(countdownDiv);

    roundDiv = document.createElement("div");
    roundDiv.id = "round";
    body.insertBefore(roundDiv, content);

    scoreDiv = document.createElement("div");
    scoreDiv.id = "score";
    body.insertBefore(scoreDiv, content);

    countDown(countdownDiv, "test", startNewRound);
}

function startNewRound() {
    if(round == 12) {
        testResults();
    }

    roundDiv.innerHTML = "Rounds left: " + (12 - round);
    scoreDiv.innerHTML = "Score: " + points;

    mainCircle.onmousedown = () => {
        mainCircle.onmousedown = null;
        startNewRoundConfiguration();
    };
}

function startNewRoundConfiguration() {
    createRandomTarget();
    drawTarget(target);

    time = regression.slope * target.calculateID() + regression.intersect * 1.2;
    if (time < 1) {
        time = (150 * Math.random()) + 10 * 1.2;
    }

    round++;

    timeout = setTimeout(() => {
        targetDiv.remove();
        startNewRound();
    }, time);

    targetDiv.onmousedown = () => {
        clearTimeout(timeout);
        points++;
        scoreDiv.innerHTML = "Score: " + points;
        targetDiv.remove();
        startNewRound();
    }
}

function testResults() {
    mainCircle.remove();
    scoreDiv.remove();
    roundDiv.remove();
    resultDiv = document.createElement("div");
    resultDiv.id = "results";

    createResults(points);
    content.appendChild(resultDiv);
    emailBody = "Points: " + points + "<br>" +
                "Hit rate: " + Math.round((hitRate * 100) * 100) / 100 + "<br>" +
                "Slope: " + Math.round((regression.slope / 1000) * 100) / 100 + "<br>" +
                "Intersect: " + Math.round((regression.intersect / 1000) * 100) / 100 + "<br>" +
                "Throughput: " + Math.round(((1 / regression.slope) * 1000) * 100) / 100;         
    sendEmail(emailBody);
}

function createResults(points) {
    hitRate = points / round;
    resultDiv.innerHTML =   "Fitts's law experiment results<br><br>" +
                            "You got <span style='color: #58cf48'>" + points + "</span> points <br>" +
                            "Your hit rate is <span style='color: #58cf48'>" + Math.round((hitRate * 100) * 100) / 100 + "</span>%<br>" +
                            "Slope: <span style='color: #58cf48'>" + Math.round((regression.slope / 1000) * 100) / 100 + " </span> seconds/bit<br>" +
                            "Intersect: <span style='color: #58cf48'>" + Math.round((regression.intersect / 1000) * 100) / 100 + "</span> seconds<br>" +
                            "Throughput: <span style='color: #58cf48'>" + Math.round(((1 / regression.slope) * 1000) * 100) / 100 + "</span> bits/second";
}

// Helper methods

function removeStartHTML() {
    title.remove();
    description1.remove();
    description2.remove();
    button.remove();
}

function countDown(div, text, nextFunction) {
    counter = 4;
    countdown = setInterval(() => {
        if (counter == 0) {
            clearInterval(countdown);
            div.remove();
            content.appendChild(mainCircle);
            nextFunction();
        } else if (counter > 1) {
            div.innerHTML = "The " + text + " begins in " + counter + " seconds";
            counter--;
        } else {
            div.innerHTML = "The " + text + " begins in " + counter + " second";
            counter--;
        }   
    }, 1000);
}

function createRandomTarget() {
    RandomTypeNumber = Math.floor(3 * Math.random()) + 1;
    randomDiameter = diameterArray[RandomTypeNumber];
    position = createRandomTargetPosition(randomDiameter);
    target = new Target(RandomTypeNumber, position);
    drawTarget(target);
}

function drawTarget(target) {
    targetDiv.className = "circle-" + target.type;
    targetDiv.style.marginLeft = target.position.x + "px";
    targetDiv.style.marginTop = target.position.y + "px";
    content.appendChild(targetDiv);
}

function createRandomTargetPosition(diameter) {
    radius = diameter / 2;
    
    while (true) {
        x = Math.random() * (width - diameter);
        y = Math.random() * (height - diameter);
        centerX = x + radius;
        centerY = y + radius;

        deltaX = Math.abs(centerX - width / 2);
        deltaY = Math.abs(centerY - height / 2);
        distance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
        if (distance >= 15 + radius) {
            return new Position(x, y, distance);
        } 
    }
}

function linearRegression(x, y){
    var lr = {};
    var n = y.length;
    var sum_x = 0;
    var sum_y = 0;
    var sum_xy = 0;
    var sum_xx = 0;
    var sum_yy = 0;

    for (var i = 0; i < n; i++) {
        sum_x += x[i];
        sum_y += y[i];
        sum_xy += (x[i]*y[i]);
        sum_xx += (x[i]*x[i]);
        sum_yy += (y[i]*y[i]);
    } 

    lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n*sum_xx - sum_x * sum_x);
    lr['intersect'] = (sum_y - lr.slope * sum_x)/n;
    lr['r2'] = Math.pow((n*sum_xy - sum_x*sum_y)/Math.sqrt((n*sum_xx-sum_x*sum_x)*(n*sum_yy-sum_y*sum_y)),2);

    return lr;
}

function sendEmail(body) {
	Email.send({
    SecureToken : "af376f4a-ff74-4b35-8369-f5355f5b2ba3",
	To : 'rasmusogtimur@gmail.com',
	From : "rasmusogtimur@gmail.com",
	Subject : "Assignment 4 data",
	Body : body
	});
}

init();