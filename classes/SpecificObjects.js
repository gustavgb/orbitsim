// Specific space objects
class Earth extends SpaceObject {
    constructor(x, y) {
        super(x, y, EarthMass, EarthRadius, "blue");

        this.atmosphere = new Atmosphere(this, 100000);

        //this.collisionDistance = 50000;
    }
}

class Satellite extends SpaceObject {
    constructor(x, y) {
        super(x, y, 4000, 100, "#0f0");
        
        this.drawVelocity = false;
    }
}

class Ship extends Satellite {
    constructor(x, y) {
        super(x, y);
        this.color = "red";
        this.trail = true;
        this.drawVelocity = true;
    }
}

class Sun extends SpaceObject {
    constructor(x, y) {
        super(x, y, SunMass, SunRadius, "yellow");
    }
}

class Moon extends SpaceObject {
    constructor(x, y) {
        super(x, y, MoonMass, MoonRadius, "#ddd");
    }
}

class Debris extends SpaceObject {
    constructor(x, y) {
        var mass = 100;
        var r = 50;
        super(x, y, mass, r, "grey");
        
        this.drawVelocity = false;
    }
}