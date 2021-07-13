const MainLoop = require("mainloop.js");
const Physics = require("./physics");
const CollisionSystem = require("./collision/collisionSystem");
const SceneSystem = require("./scene/sceneSystem");
const EngineCore = require("./entity/core");
const SchedulerFactory = require("./scheduler/schedulerFactory");
const InputFactory = require("./input/inputFactory");
const EntityFactory = require("./entity/entityFactory");
const PixiRenderer = require("./renderer");
const ResourceLoader = require("./resourceLoader");

let resourceLoader = new ResourceLoader();
resourceLoader.loadAllResources().then((resources) => {
    
    let renderer = new PixiRenderer(resources);
    let engineCore = new EngineCore(
        new SceneSystem(),
        new Physics(),
        new CollisionSystem(),
        renderer,
        new SchedulerFactory(),
        new EntityFactory(),
        new InputFactory(),
    );

    createFirstLevel(engineCore);
    let firstlevel = engineCore.sceneSystem.activeScene;
    let secondLevel = engineCore.createScene();
    engineCore.setImmediateActiveScene(secondLevel);
    createSecondLevel(engineCore);
    engineCore.setImmediateActiveScene(firstlevel);
    window.swapScene = () => {
        engineCore.swapScene();
    }
    MainLoop.setUpdate((delta) => {
        let scaledDelta = delta/1000;
        engineCore.update(scaledDelta);
    }).setDraw(() => {
        renderer.drawFrame();
    }).start();
});
function createFirstLevel(engineCore) {
    let tileSize = 48;
    engineCore.createControlRecorder();
    //engineCore.createControlReplayer();
    engineCore.createPlayer(tileSize*3, tileSize*2);
    engineCore.createToggle(tileSize*5, tileSize*5);
    engineCore.createEndLevelToggle(tileSize*38, tileSize*2);
    engineCore.createWallToggle(tileSize*18, tileSize*6);
    engineCore.createElevator(tileSize*34, tileSize*17);
    engineCore.createElevator2(tileSize*34, tileSize*2);
    engineCore.createShinyWall(tileSize*8,tileSize*5);
    engineCore.createShinyWall(tileSize*8,tileSize*4);
    engineCore.createShinyWall(tileSize*8,tileSize*3);
    engineCore.createShinyWall(tileSize*8,tileSize*2);
    engineCore.createShinyWall(tileSize*8,tileSize*1);
    for(var i = 1;i<20;i++) {
        createGroundOnCoord(engineCore,i,0,"wall_s");
    }
    for(var i = 1;i<6;i++) {
        createGroundOnCoord(engineCore,0,i,"wall_e");
    }
    createGroundOnCoord(engineCore,20,1,"wall_w");
    for(var i = 2;i<7;i++) {
        createGroundOnCoord(engineCore,20,i,"wall_w", true);
    }
    createGroundOnCoord(engineCore,20,7,"wall_w");
    for(var i = 9;i<12;i++) {
        createGroundOnCoord(engineCore,14,i,"wall_w");
    }
    for(var i = 1;i<9;i++) {
        createGroundOnCoord(engineCore,i,6,"wall_n");
    }
    for(var i = 10;i<14;i++) {
        createGroundOnCoord(engineCore,i,12,"wall_n");
    }
    for(var i = 15;i<20;i++) {
        createGroundOnCoord(engineCore,i,8,"wall_n");
    }
    for(var i = 7;i<12;i++) {
        createGroundOnCoord(engineCore,9,i,"wall_e");
    }
    createGroundOnCoord(engineCore,0,0,"wall_inner_se");
    createGroundOnCoord(engineCore,20,8,"wall_inner_nw");
    createGroundOnCoord(engineCore,14,12,"wall_inner_nw");
    createGroundOnCoord(engineCore,0,6,"wall_inner_ne");
    createGroundOnCoord(engineCore,20,0,"wall_inner_sw");
    createGroundOnCoord(engineCore,9,6,"wall_ne");
    createGroundOnCoord(engineCore,14,8,"wall_nw");
    createGroundOnCoord(engineCore,9,12,"wall_inner_ne");
    engineCore.createSpike(tileSize*10,tileSize*11 + 21);
    engineCore.createSpike(tileSize*11,tileSize*11 + 21);
    engineCore.createSpike(tileSize*12,tileSize*11 + 21);
    engineCore.createSpike(tileSize*13,tileSize*11 + 21);
    createGroundOnCoord(engineCore,24,1,"wall_e");
    for(var i = 2;i<7;i++) {
        createGroundOnCoord(engineCore,24,i,"wall_e", true);
    }
    for(var i = 7;i<17;i++) {
        createGroundOnCoord(engineCore,24,i,"wall_e");
    }
    for(var i = 25;i<28;i++) {
        createGroundOnCoord(engineCore,i,0,"wall_s");
    }
    for(var i = 1;i<13;i++) {
        createGroundOnCoord(engineCore,28,i,"wall_w");
    }
    for(var i = 25;i<32;i++) {
        createGroundOnCoord(engineCore,i,17,"wall_n");
    }
    for(var i = 29;i<32;i++) {
        createGroundOnCoord(engineCore,i,13,"wall_s");
    }
    for(var i = 1;i<13;i++) {
        createGroundOnCoord(engineCore,32,i,"wall_e");
    }
    for(var i = 33;i<36;i++) {
        createGroundOnCoord(engineCore,i,19,"wall_n");
    }
    for(var i = 5;i<19;i++) {
        createGroundOnCoord(engineCore,36,i,"wall_w");
    }
    for(var i = 33;i<40;i++) {
        createGroundOnCoord(engineCore,i,0,"wall_s");
    }
    for(var i = 37;i<40;i++) {
        createGroundOnCoord(engineCore,i,4,"wall_n");
    }
    for(var i = 1;i<4;i++) {
        createGroundOnCoord(engineCore,40,i,"wall_e");
    }
    for(var i = 33;i<36;i++) {
        engineCore.createSpike(tileSize*i,tileSize*18 + 21);
    }
    createGroundOnCoord(engineCore,32,18,"wall_e");
    createGroundOnCoord(engineCore,24,0,"wall_inner_se");
    createGroundOnCoord(engineCore,28,0,"wall_inner_sw");
    createGroundOnCoord(engineCore,24,17,"wall_inner_ne");
    createGroundOnCoord(engineCore,32,17,"wall_ne");
    createGroundOnCoord(engineCore,28,13,"wall_sw");
    createGroundOnCoord(engineCore,32,13,"wall_se");
    createGroundOnCoord(engineCore,32,19,"wall_inner_ne");
    createGroundOnCoord(engineCore,36,19,"wall_inner_nw");
    createGroundOnCoord(engineCore,32,0,"wall_inner_se");
    createGroundOnCoord(engineCore,36,4,"wall_nw");
    engineCore.createOneWayWall(tileSize*33, tileSize*8);
    engineCore.createOneWayWall(tileSize*34, tileSize*8);
    engineCore.createOneWayWall(tileSize*35, tileSize*8);
}

function createSecondLevel(engineCore) {
    let tileSize = 48;
    engineCore.createPlayer(tileSize*19,tileSize*4);
    for(var i = 18;i<21;i++) {
        createGroundOnCoord(engineCore,i,1,"wall_s");
    }
    for(var i = 2;i<18;i++) {
        createGroundOnCoord(engineCore,17,i,"wall_e");
    }
    for(var i = 2;i<18;i++) {
        createGroundOnCoord(engineCore,21,i,"wall_w");
    }
    for(var i = 18;i<21;i++) {
        createGroundOnCoord(engineCore,i,18,"wall_n");
    }
    createGroundOnCoord(engineCore,17,1,"wall_inner_se");
    createGroundOnCoord(engineCore,21,1,"wall_inner_sw");
    createGroundOnCoord(engineCore,17,18,"wall_inner_ne");
    createGroundOnCoord(engineCore,21,18,"wall_inner_nw");
    engineCore.createSpike(tileSize*18,tileSize*17 + 21);
    engineCore.createSpike(tileSize*19,tileSize*17 + 21);
    engineCore.createSpike(tileSize*20,tileSize*17 + 21);
    
}

function createGroundOnCoord(engineCore,x,y,spriteName, destroyable) {
    let tileSize = 48;
    engineCore.createGround(x*tileSize,y*tileSize,spriteName, destroyable);
}