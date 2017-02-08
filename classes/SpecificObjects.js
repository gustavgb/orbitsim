// Specific space objects
class Earth extends SpaceObject {
    constructor(x, y) {
        var r = EarthRadius;
        super(x, y, EarthMass, r, "blue");

        this.atmosphere = new Atmosphere(this, r + 100000);
    }
}
class MiniEarth extends SpaceObject {
    constructor(x, y) {
        var r = EarthRadius/1000;
        
        super(x, y, EarthMass, r, "blue");

        this.atmosphere = new Atmosphere(this, r+10000);
    }
}

class Satellite extends SpaceObject {
    constructor(x, y) {
        super(x, y, 4000, 100, "#0f0");
        
        this.drawVelocity = false;
    }
}

class AdvSatellite extends Satellite {
    constructor(x, y) {
        super(x, y);
        
        this.drawVelocity = true;
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