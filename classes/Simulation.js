class Simulation {
    constructor () {
        this.collisions = 0;
        this.score = 0;
        
        this.space = new Space();
        
        this.accuracy = 1;
        this.speedup = 1;
        
        this.mainObj = new SpaceObject(0, 0, 1, 1, "black");
        this.followObj;
        this.controlObj;
        this.trackObj;
        
        this.collisionDebrisAmount = 10;
        
        this.showScore = false;
        this.showInfo = true;
        
        this.textBatch = [];
        
        this.controlTime = true;
        this.controlZoom = true;
        
        this.showCrashes = true;
        
        timeunit = 1/60;
        scl = 1/300;
    }
    
    setAccuracy(a) {
        this.accuracy = a;
        timeunit = 1/(60*a);
        this.speedup = a;
    }
    
    loop() {
        background("white");

        scale(windowsclX, windowsclY);
        
        for (let i = 0; i < this.speedup; i++) {
            this.space.update();
        }

        var transX, transY;
        if (this.followObj !== undefined) {
            transX = -this.followObj.x*scl + cW/2;
            transY = -this.followObj.y*scl + cH/2;
        } else {
            transX = 300;
            transY = 300;
        }

        
        // Scale to world
        translate(transX, transY);
        scale(scl);
        strokeWeight(1/scl);

        this.space.draw();

        // Undo scaling
        scale(1/scl);
        translate(-transX, -transY);

        // INFO
        textAlign(LEFT, TOP);

        textSize(20);
        fill("black");
        if (this.showInfo) {
            text("Zoom: 1/" + (1/scl) + "x", 5, 5);
            text("Time: " + this.speedup/this.accuracy + "x", 5, 25);

            text("Total Collisions: " + this.collisions, 5, 105);
            text("Objects: " + this.space.objlist.length, 5, 125);
        }
        
        if (this.mainObj !== undefined && this.trackObj !== undefined) {
            if (this.showInfo) {
                var dist = Math.round(Space.distance(this.trackObj, this.mainObj));
                var v = Math.round(this.trackObj.velocity.length);
                var pow = v.toString().length-1;
                v /= Math.pow(10, pow);
                text("Velocity: " + v.toFixed(2) + " * 10^" + pow + " m/s", 5, 65);

                var pow = dist.toString().length-1;
                dist /= Math.pow(10, pow);
                text("Distance from Earth: " + dist.toFixed(2) + " * 10^" + pow + " m", 5, 45);
                text("Collision: " + this.trackObj.collided, 5, 85);
            }
            if (this.showScore) {
                text("Score: " + this.score, 5, 145);
            }
        }
        
        textAlign(RIGHT, TOP);
        textSize(15);
        
        var startY = 5;
        this.textBatch.forEach(function (val, i) {
            text(val, cW-5, i*20 + startY);
        });
        
        // Menu
        fill("#66d9ff");
        strokeWeight(0);
        rect(0, cH, cW, 100);
        
        textAlign(CENTER, TOP);
        textSize(20);
        fill("black");
        
        text("Choose simulation using number keys:", cW/2, cH+10);
        
        textAlign(LEFT, TOP)
        var marginSides = 30;
        var marginTop = cH + 35;
        text("[1] Interactive Orbit", marginSides, marginTop);
        text("[2] Kessler Syndrome", marginSides, marginTop + 20);
        
        textAlign(RIGHT, TOP);
        text("[3] Cleanup Game", cW - marginSides, marginTop);

        this.loopExtension();
    }
    
    loopExtension() {
        
    }
    
    keyEvent(code) {
        switch (code) {
            case LEFT_ARROW:
                if (this.controlObj === undefined) break;
                this.controlObj.turn(-0.05*Math.PI);
                break;
            case RIGHT_ARROW:
                if (this.controlObj === undefined) break;
                this.controlObj.turn(0.05*Math.PI);
                break;
            case UP_ARROW:
                if (this.controlObj === undefined) break;
                this.controlObj.changeSpeed(1.25);
                break;
            case DOWN_ARROW:
                if (this.controlObj === undefined) break;
                this.controlObj.changeSpeed(0.8);
                break;
            case 32:
                if (this.controlObj === undefined) break;
                this.controlObj.orbit(this.mainObj);
                break;
            case 81:
                if (!this.controlTime) break;
                this.speedup /= 2;
                if (this.speedup < 1) this.speedup = 1;
                break;
            case 87:
                if (!this.controlTime) break;
                this.speedup *= 2;
                break;
            case 69:
                if (!this.controlZoom) break;
                scl /= 2;
                break;
            case 82:
                if (!this.controlZoom) break;
                scl *= 2;
                break;
            case 27:
                setup();
                return false;
                break;
            case 65:
                if (this.controlObj === undefined) break;

                var s = this;

                this.space.objlist.forEach(function (obj, i) {
                    if (obj !== s.controlObj) {

                        var col = s.controlObj.collision(obj);

                        if (col[1].distance < 5000 + col[1].collisionDistance) {
                            
                            obj.orbit(s.mainObj);
                            obj.turn(0.15 * (Space.distance(obj, s.mainObj) / SatelliteDist) *Math.PI);
                            s.score++;

                        }
                    }
                })
                break;
            case 83: // Spawn new sat
                if (this instanceof StandardSim) {
                    spawnRandomSat(this, Satellite);
                }
                break;
            
            // Choose simulation
            case 49:
                if (!includeTools) break;
                presets.orbit();
                break;
            case 50:
                if (!includeTools) break;
                presets.kessler();
                break;
            case 51:
                if (!includeTools) break;
                presets.game();
                break;
        }
    }
}



class StandardSim extends Simulation {
    constructor() {
        super();
        
        this.earth = new Earth(0, 0);
        this.satellite = new Ship(0, -SatelliteDist);
        this.satellite.orbit(this.earth);
        
        this.mainObj = this.followObj = this.earth;
        
        this.controlObj = this.trackObj = this.satellite;
        
        var sat = new Satellite(0, SatelliteDist*(Math.random()*0.2 + 0.9));
        sat.orbit(this.earth);
        sat.changeSpeed(Math.random()*0.3 + 0.9);
        sat.trail = true;
        
        this.space.addObj(this.earth, this.satellite, sat);
        
        this.setAccuracy(8);
        
        scl = 1/(SatelliteDist / 200);
        
        this.textBatch = [
            "Esc: Reset",
            "E, R: Zoom -/+",
            "Q, W: Time -/+",
            "Left/Right: Turn",
            "Up/Down: Velocity",
            "Spacekey: Correct Orbit"
        ];
    }
}

class Game extends Simulation {
    constructor() {
        super();
        
        this.earth = new Earth(0, 0);
        this.satellite = new Ship(0, -SatelliteDist);
        this.satellite.orbit(this.earth);
        
        this.satellite.trail = false;
        
        this.mainObj = this.earth;
        
        this.followObj = this.controlObj = this.trackObj = this.satellite;
        
        this.space.addObj(this.earth, this.satellite);
        
        for (var i = 0; i < 50; i++) {spawnRandomSat(this, Satellite);}
        for (var i = 0; i < 30; i++) {spawnRandomSat(this, Debris);}
        
        this.setAccuracy(8);
        
        this.showScore = true;
        this.showInfo = false;
        
        this.spawnCounter = 0;
        
        this.controlTime = false;
        
        this.textBatch = [
            "Esc: Reset",
            "E, R: Zoom -/+",
            "Left/Right: Turn",
            "Up/Down: Velocity",
            "Spacekey: Correct Orbit"
        ];
    }
    
    loopExtension() {
        this.spawnCounter++;
        
        if (this.spawnCounter > 1000) {
            this.spawnCounter = 0;
            spawnRandomSat(this, Satellite);
        }
    }
}

class KesslerSim extends Simulation{
    constructor() {
        super();
        
        this.earth = new Earth(0, 0);
        
        this.mainObj = this.earth;
        this.followObj = this.earth;
        
        this.space.addObj(this.earth);
        
        for (var i = 0; i < 50; i++) {spawnRandomSat(this);}
        
        this.setAccuracy(1);
        
        this.showCrashes = false;
        
        scl = 1/(300000 / 250);
        
        this.textBatch = [
            "Esc: Reset",
            "E, R: Zoom -/+",
            "Q, W: Time -/+"
        ];
    }
}



class SolarSystem extends Simulation {
    constructor() {
        super();
        
        this.sun = new Sun(0, 0);
        this.earth = new Earth(0, -SunDist);
        this.earth.orbit(this.sun);
        this.moon = new Moon(0, -SunDist-MoonDist);
        this.moon.orbit(this.earth);
        
        this.mainObj = this.sun;
        this.followObj = this.earth;
        
        this.space.addObj(this.sun, this.earth, this.moon);
        
        this.setAccuracy(1);
        
        scl = 1/(SunDist / 200);
        
        this.textBatch = [
            "Esc: Reset",
            "E, R: Zoom -/+",
            "Q, W: Time -/+",
            "Left/Right: Turn",
            "Up/Down: Velocity",
            "Spacekey: Correct Orbit"
        ];
    }
}