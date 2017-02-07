class CrashView {
    constructor () {
        this.objlist = [];
    }

    draw() {

        var size = 5;
        fill("pink");
        this.objlist.forEach(function (obj) {
            ellipse(obj.x, obj.y, size/scl, size/scl);
        });
    }

    addObj(obj) {
        this.objlist.push(obj);
        if (this.objlist.length > 100) this.objlist.splice(0, 1);
    }
}