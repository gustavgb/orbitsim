function spawnRandomSat(simObj, constru, dist, varyDist) {
    var r = Math.random()*2*Math.PI;
    var orbitDist = dist || (SatelliteDist + EarthRadius);
    var randomDist = varyDist || 100000;
    var d = Math.floor(Math.random()*randomDist) + orbitDist;

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