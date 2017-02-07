// SpaceObjects references
var space, scl, timeunit, speedup, accuracy;
var earth, satellite, globalCollisions, globalScore;
var followObj;
function setup() {
    createCanvas(cW, cH);

    globalCollisions = 0;
    globalScore = 0;

    accuracy = 2;
    speedup = accuracy;
    timeunit = 1/(60*accuracy);

    var dist = SatelliteDist;
    //sun = new Sun(0, dist);
    earth = new Earth(0, 0);
    //earth.orbit(sun);

    satellite = new Ship(0, -SatelliteDist);
    satellite.orbit(earth);

    //satellite.trail = true;
    //earth.velocity.x = Math.sqrt(G * sun.mass / Space.distance(earth, sun));
    //satellite.velocity.x = Math.sqrt(G * earth.mass / Space.distance(earth, satellite)) + earth.velocity.x;

    var l = [
        earth,
        satellite
    ];

    space = new Space(l);

    for (var i = 0; i < 50; i++) {spawnRandomSat();}

    //scl = 1 / (dist / 125);
    scl = 1/300;

    background("white");

    followObj = satellite;
}

function draw() {

    background("white");


    for (let i = 0; i < speedup; i++) {
        space.update();
    }

    var transX = -followObj.x*scl + cW/2;
    var transY = -followObj.y*scl + cH/2;

    translate(transX, transY);

    //scl = 1 / (Math.ceil((Space.distance(satellite, earth)/1000) / 230) * 1000);
    //rotate(Math.atan2(satellite.velocity.y, satellite.velocity.x));
    scale(scl);

    strokeWeight(1/scl);


    space.draw();

    // INFO
    scale(1/scl);
    translate(-transX, -transY);

    textAlign(LEFT, TOP);

    textSize(20);
    fill("black");
    text("Zoom: 1/" + (1/scl) + "x", 5, 5);
    text("Time: " + speedup/accuracy + "x", 5, 25);
    var dist = Math.round(Space.distance(satellite, earth));

    var v = Math.round(satellite.velocity.length);
    var pow = v.toString().length-1;
    v /= Math.pow(10, pow);
    text("Velocity: " + v.toFixed(2) + " * 10^" + pow + " m/s", 5, 65);

    var pow = dist.toString().length-1;
    dist /= Math.pow(10, pow);
    text("Distance from Earth: " + dist.toFixed(2) + " * 10^" + pow + " m", 5, 45);

    text("Collision: " + satellite.collided, 5, 85);
    text("Total Collisions: " + globalCollisions, 5, 105);
    text("Objects: " + space.objlist.length, 5, 125);
    text("Score: " + globalScore, 5, 145);
    /*var startY = 65;
    space.objlist.forEach(function (obj, i) {

        text(obj.totalVelocity, 5, i*20 + startY);

    });

    textAlign(RIGHT, TOP);

    var t = [
        Space.gravityForce(earth, satellite).length,
        Space.gravityForce(earth, sun).length
    ];
    startY = 5;
    t.forEach(function (val, i) {
        text(val, cW-5, i*20 + startY);
    });*/

    //space.objlist.forEach(function (obj, i) {text(obj.collided, 5, 105 + i*20);});

    textAlign(LEFT, BOTTOM);
    textSize(15);

    var t = [
        "Esc: Reset",
        "E, R: Zoom +/-",
        "Q, W: Time +/-",
        "Left/Right: Turn",
        "Up/Down: Velocity",
        "Spacekey: Correct Orbit"
    ];
    startY = cH-5;
    t.forEach(function (val, i) {
        text(val, 5, -i*20 + startY);
    });

}