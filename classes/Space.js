class Space {

    constructor (objlist) {

        this.objlist = (objlist instanceof Array) ? objlist : [];

        this.crashView = new CrashView();

    }
    
    addObj(...obj) {
        var s = this;
        
        obj.forEach(function (o) {
            s.objlist.push(o);
        })
    }

    draw() {
        this.objlist.forEach(function (obj) {
            obj.draw();
        });

        if (sim.showCrashes) this.crashView.draw();
    }

    gravity() {

        var l = this.objlist;

        for (var i = 0; i < l.length; i++) {

            for (var j = 0; j < l.length; j++) {

                if (i !== j) { // Don't pull on itself

                    var obj1 = l[i];
                    var obj2 = l[j];

                    if (obj1.collided) break;

                    var force = Space.gravityForce(obj1, obj2);

                    obj1.addBatchForce(force);
                }

            }

        }

        l.forEach(function (obj) {
            obj.applyBatchForces();
        });

        l.forEach(function (obj1, i) {
            if (obj1.atmosphere !== undefined) {

                l.forEach(function (obj2, j) {

                    if (i !== j) {
                        obj1.atmosphere.applyDragOn(obj2);
                    }
                });
            }
        });

    }

    static gravityForce(obj1, obj2) {

        var dist = Space.distance(obj1, obj2);

        var netForce = (obj1.mass * obj2.mass * G) / Math.pow(dist, 2);

        var vec = Space.distVector(obj2, obj1);
        var force = new Vector(netForce*vec.x, netForce*vec.y);

        return force;
    }

    static distance(obj1, obj2) {

        var x = obj1.x - obj2.x;
        var y = obj1.y - obj2.y;

        return Math.sqrt(x*x + y*y);

    }

    static distVector(obj1, obj2) {
        var x = obj1.x - obj2.x;
        var y = obj1.y - obj2.y;
        var len = Math.sqrt(x*x + y*y);

        return new Vector(x/len, y/len);
    }

    update() {
        this.clearForces();

        this.collision();

        this.objlist.forEach(function (obj) {
            //if (obj.hasExploded) obj.collided = true;
        });

        this.gravity();

        this.objlist.forEach(function (obj) {
            obj.move();
        })
    }

    clearForces() {
        this.objlist.forEach(function (obj) {
            obj.clearForces();
        });
    }


    collision(dist) {

        var l = this.objlist;

        for (var i = 0; i < l.length; i++) {

            var obj1 = l[i];
            var collision = false;

            for (var j = 0; j < l.length; j++) {

                if (i !== j) { // Don't collide with itself
                    var obj2 = l[j];

                    var collisionData = obj1.collision(obj2, dist);
                    collision = collisionData[0];

                    if (collision) break;
                }

            }

            obj1.collided = collision;

        }

        for (let i = l.length-1; i >= 0; i--) {
            let obj = l[i];

            if (obj.collided) {

                if (obj.mass >= 1000 && !obj.hasExploded) {

                    for (let a = 0; a < sim.collisionDebrisAmount; a++) {
                        let r = Math.random()*Math.PI*2;

                        let deb = new Debris(obj.x, obj.y);
                        
                        var v = Math.random()*5000 + 2000;

                        deb.velocity.x = Math.cos(r) * v + obj.velocity.x;
                        deb.velocity.y = Math.sin(r) * v + obj.velocity.y;

                        deb.x += Math.cos(r)*(obj.r + deb.r + v);
                        deb.y += Math.sin(r)*(obj.r + deb.r + v);

                        sim.space.objlist.push(deb);
                    }

                }

                obj.hasExploded = true;
                this.crashView.addObj(new Vector(obj.x, obj.y));
                this.objlist.splice(i, 1);

                sim.collisions++;
            }


        }

    }

}