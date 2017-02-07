class Vector {
    constructor (x, y) {
        this.x = x;
        this.y = y;
    }

    get length() {
        var x = this.x, y = this.y;

        return Math.sqrt(x*x + y*y);
    }
}