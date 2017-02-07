
let sim, scl, timeunit;

let windowsclX, windowsclY;

let includeTools = false;

function windowscl() {
    createCanvas(window.innerWidth, window.innerHeight);

    var a = 0;
    if (includeTools) a = 100;
    
    windowsclX = window.innerWidth / cW;
    windowsclY = window.innerHeight / (cH + a);
}
window.addEventListener("resize", windowscl, false);

function setup() {
    
    sim = new StandardSim();
    
    var setting = location.href.split("#")[1];
    if (setting !== undefined) {
        
        var l = setting.split(":");
        
        l.forEach(function (val, i) {
            
            switch (val) {
                case "kessler":
                    presets.kessler();
                    break;
                case "game":
                    presets.game();
                    break;
                case "orbit":
                    presets.orbit();
                    break;
                case "tools":
                    includeTools = true;
                    break;
            }
            
        });
        
    }
    windowscl();
    
    background("white");
}

function draw() {

    sim.loop();
    return;

}