function spawnRandomSat(simObj, constru) {
    var r = Math.random()*2*Math.PI;
    var d = Math.floor(Math.random()*100000) + 150000;

    var x = Math.cos(r) * d + simObj.mainObj.x;
    var y = Math.sin(r) * d + simObj.mainObj.y;

    if (constru === undefined) constru = Satellite;
    
    let deb = new constru(x, y);

    deb.orbit(simObj.mainObj);

    var e = 0;
    r = Math.random()*e*Math.PI;

    deb.turn(e);

    deb.changeSpeed(Math.random()*0.2 + 0.9);

    simObj.space.objlist.push(deb);
}