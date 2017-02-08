
let sim, scl, timeunit;

let windowsclX, windowsclY;

let includeTools = false;

let currentMode = "orbit";

function windowscl() {
    createCanvas(window.innerWidth, window.innerHeight);

    var a = 0;
    if (includeTools) a = 100;
    
    windowsclX = window.innerWidth / cW;
    windowsclY = window.innerHeight / (cH + a);
}
window.addEventListener("resize", windowscl, false);

function setup() {
    
    var setting = location.href.split("#")[1];
    if (setting !== undefined) {
        
        var l = setting.split(":");
        
        l.forEach(function (val, i) {
            
            switch (val) {
                case "kessler":
                    currentMode = "kessler";
                    break;
                case "game":
                    currentMode = "game";
                    break;
                case "orbit":
                    currentMode = "orbit";
                    break;
                case "tools":
                    includeTools = true;
                    break;
            }
            
        });
        
    }
    
    console.log("setup " + currentMode);
    presets[currentMode]();
    
    windowscl();
    
    background("white");
}

var running = false;
function draw() {

    scale(windowsclX, windowsclY);

    if (running) sim.loop();
    else {
        fill("white");
        
        var t = "Click to run simulation";
        var h = 60;
        textSize(h/2);
        var w = textWidth(t) + 20;
        
        strokeWeight(1);
        
        rect(cW/2 - w/2, cH/2 - h/2, w, h);
        
        fill("black");
        
        textAlign(CENTER, CENTER);
        text(t, cW/2, cH/2);
    }
    
    

}

var lastToggleTime = 0;
function stop() {
    var now = Date.now();
    if (now - lastToggleTime > 100) {
        running = false;
        lastToggleTime = now;
    }
}

function run() {
    var now = Date.now();
    if (now - lastToggleTime > 100) {
        running = true;
        lastToggleTime = now;
    }
}


window.addEventListener("focus", run, false);
window.addEventListener("blur", stop, false);
window.addEventListener("mousedown", run, false);