
// Constants
const content = document.getElementById("content");
const mainCircle = document.getElementById("main-circle");
const width = 1024;
const height = 768

// Variables
let targetDiv = document.createElement("div");
let target;
let diameterArray = [];
let IDsArray = [];
let MTsArray = [];
let slope;
let intersect;
let points = 0;
let round = 0;

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

/* class Calibration {
    constructor(IDs, MTs) {
        this.IDs = IDs;
        this.MTs = MTs;
    }
} */

function init() {
    // Insert diameters
    diameterArray[1] = 10;
    diameterArray[2] = 30;
    diameterArray[3] = 50;
    calibrate(1);
}

function startTest() {
    content.appendChild(mainCircle);
    startNewRound();
}

function startNewRound() {
    if(round == 3) {
        testResults();
    }
    mainCircle.onmousedown = () => startNewRoundConfiguration();
}

function testResults() {
    mainCircle.remove();
    pointDiv = document.createElement("div");
    pointDiv.id = "point";
    if (points == 0) {
        pointDiv.innerHTML = "That was very bad... You got " + points + " points";
    } else if (points == 1) {
            pointDiv.innerHTML = "That was very bad... You got " + points + " point";
    } else if (points <= 20) {
        pointDiv.innerHTML = "That was OK. You got " + points + " points";
    } else if (points <= 40) {
        pointDiv.innerHTML = "That was great. You got " + points + " points";
    } else {
        pointDiv.innerHTML = "Excellent you are talented. You got " + points + " points :D!";
    }
    content.appendChild(pointDiv);
}

function startNewRoundConfiguration() {
    createTarget();
    drawTarget(target);
    time = slope * target.calculateID() + intersect * 1.2;
    if(time < 1) {
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
        targetDiv.remove();
        startNewRound();
    }
}

function calibrateResults() {
    mainCircle.remove();
    lr = linearRegression(IDsArray, MTsArray);
    slope = lr.slope;
    intersect = lr.intersect;
    startTest();
}

function calibrate(n) {
    mainClickedTime = 0;
    targetClickedTime = 0;

    mainCircle.onmousedown = () => {
        mainClickedTime = new Date().getTime();
        createTarget();
    }
    targetDiv.onmousedown = () => {
        targetClickedTime = new Date().getTime();
        removeTarget();

        IDsArray[n] = target.calculateID();
        MTsArray[n] = targetClickedTime - mainClickedTime;

        if (n == 0) {
            calibrateResults();
        } else {
            calibrate(n - 1);
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

    for (var i = 0; i < y.length; i++) {
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

function createTarget() {
    typeNumber = Math.floor(3 * Math.random()) + 1;
    randomDiameter = diameterArray[typeNumber];
    position = createRandomPosition(randomDiameter);
    target = new Target(typeNumber, position);
    drawTarget(target);
}

function drawTarget(target) {
    targetDiv.className = "circle-" + target.type;
    targetDiv.style.marginLeft = target.position.x + "px";
    targetDiv.style.marginTop = target.position.y + "px";
    content.appendChild(targetDiv);
}

function createRandomPosition(diameter) {
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

function removeTarget() {
    targetDiv.remove();
}

/* function dinfar() {
    createTarget(3, createRandomPosition(50));
    setTimeout(() => dinfar(), 100);
} */

init();