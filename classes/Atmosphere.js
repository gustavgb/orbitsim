class Atmosphere {
    constructor(parent, r) {
        this.parent = parent;
        this.r = r;
    }

    applyDragOn(obj) {

        var dist = Space.distance(this.parent, obj);

        if (dist < obj.r + this.r) {

            var drag = 1-1/(dist/100);

            obj.changeSpeed(drag);
        }
    }

    draw() {
        fill("rgba(47, 99, 183, 0.5)");
        ellipse(this.parent.x, this.parent.y, this.r*2, this.r*2);
    }
}