let presets = {
    kessler: function () {
        sim = new KesslerSim();
    },
    orbit: function () {
        sim = new StandardSim();
    },
    game: function () {
        sim = new Game();
    },
    solarsystem: function () {
        sim = new SolarSystem();
    }
}