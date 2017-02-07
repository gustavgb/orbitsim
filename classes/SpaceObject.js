class SpaceObject {

    constructor(x, y, mass, radius, color) {

        this.x = x;
        this.y = y;

        this.mass = mass;

        this.r = radius;

        this.color = (typeof color == "string") ? color : "black";

        this.velocity = new Vector(0, 0);

        this.forces = [];

        this.trail = false;
        this.trails = [];
        this.trailLength = 35;

        this.collisionDistance = radius;
        this.collided = false;

        this.hasExploded = false;

        this.atmosphere;
        
        this.drawVelocity = true;
    }

    draw() {
        // Atmosphere
        if (this.atmosphere !== undefined) this.atmosphere.draw();

        // Trail
        if (this.trails.length > 0) this.drawTrail();

        strokeWeight(1/scl);
        
        var x = this.x;
        var y = this.y;

        // Velocity vector
        if (this.drawVelocity) {
            var v = this.velocity;
            var len = v.length;
            line(x, y, x + v.x, y + v.y);
        }
            
        // Define minimum display size
        var minsize = 3;

        
        var r;
        if (this.collisionDistance > this.r) {
            fill("pink");
            r = this.collisionDistance;
            if (r * scl < minsize) r = minsize / scl;

            ellipse(x, y, r*2, r*2);
        }

        fill(this.color);
        r = this.r;
        if (r * scl < minsize) r = minsize / scl;

        ellipse(x, y, r*2, r*2);
    }

    get totalVelocity() {
        return this.velocity.length;
    }

    get totalForce() {
        var sumX = 0;
        var sumY = 0;

        this.forces.forEach(function (obj) {
            sumX += obj.x;
            sumY += obj.y;
        });

        var f = new Vector(sumX, sumY);

        return f;
    }

    move() {
        if (this.collided) return false;

        var v = this.velocity;
        this.x += v.x * timeunit;
        this.y += v.y * timeunit;

        if (this.trail) {
            this.updateTrail();
        }
    }

    updateTrail() {
        var len = this.trails.length;
        var o = new Vector(this.x, this.y);

        if (len > 0) {
            var lastO = this.trails[len-1];
            var dist = Space.distance(o, lastO);

            if (dist > this.velocity.length/2) {
                this.trails.push(o);
            }
        } else {
            this.trails.push(o);
        }


        if (this.trails.length > this.trailLength) {
            this.trails.splice(0, 1);
        }
    }

    drawTrail() {
        if (this.trails.length < 2) return false;

        strokeWeight(1 / scl);

        for (let i = 0; i < this.trails.length-1; i++) {
            line(this.trails[i].x, this.trails[i].y, this.trails[i+1].x, this.trails[i+1].y);
        }
    }

    addBatchForce(force) {
        this.forces.push(force);
    }

    applyBatchForces() {

        var v = this.velocity;
        var mass = this.mass;
        this.forces.forEach(function (force) {

            var aX = force.x / mass;
            var aY = force.y / mass;

            v.x += aX * timeunit;
            v.y += aY * timeunit;

        });

    }

    clearForces() {
        this.forces = [];
    }

    turn(angle) {

        var cosA = Math.cos(angle);
        var sinA = Math.sin(angle);

        var v = this.velocity;

        var x = v.x * cosA - v.y * sinA;
        var y = v.x * sinA + v.y * cosA;

        this.velocity.x = x;
        this.velocity.y = y;

    }

    changeSpeed(n) {
        this.velocity.x *= n;
        this.velocity.y *= n;
    }

    orbit(orbitObj) {
        var f = Space.gravityForce(this, orbitObj).length;
        var dist = Space.distance(this, orbitObj);
        var vec = Space.distVector(orbitObj, this);
        var vX = Math.sqrt((f*dist)/this.mass) * vec.x;
        var vY = Math.sqrt((f*dist)/this.mass) * vec.y;

        // Determine direction
        // x1*y2 - x2*y1
        var mod = orbitObj.velocity.x * this.velocity.y - this.velocity.x * orbitObj.velocity.y;

        this.velocity.x = vX;
        this.velocity.y = vY;

        this.turn(-0.5*Math.PI);

        this.velocity.x += orbitObj.velocity.x;
        this.velocity.y += orbitObj.velocity.y;
    }

    collision(obj, distLimit) {

        var colDist = distLimit || this.collisionDistance + obj.collisionDistance;

        var dist = Space.distance(this, obj);

        this.collided = false;

        if (dist <= colDist && !this.hasExploded) {
            // Determine lightest obj
            if (obj.mass / this.mass > 0.05) {
                this.collided = true;
            }
        }

        return [this.collided, {
            distance: dist,
            collisionDistance: colDist
        }];

    }

}