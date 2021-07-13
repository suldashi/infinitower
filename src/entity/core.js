const GameObject = require("./gameObject");
const EventSystem = require("../event");
const playerCreationHelpers = require("../helpers/playerCreationHelpers");

class EngineCore {
    constructor(sceneSystem, physics, collisionSystem, renderer, schedulerFactory, entityFactory, inputFactory) {
        this.sceneSystem = sceneSystem;
        this.physics = physics;
        this.collisionSystem = collisionSystem;
        this.renderer = renderer;
        this.schedulerFactory = schedulerFactory;
        this.entityFactory = entityFactory;
        this.inputFactory = inputFactory;
        this.sceneSystem.createSceneComponent(this.renderer.activeScene);
        this.collisionSystem.onTagCollision("player", "wall", (playerCollisionComponent, wallCollisionComponent, collisionVector) => {
            playerCollisionComponent.bodyComponent.translate(collisionVector.scale(-1));
        });
    }

    swapScene() {
        this.sceneSystem.swapScene();
    }

    setImmediateActiveScene(newScene) {
        this.sceneSystem.setImmediateActiveScene(newScene);
        this.renderer.setActiveRenderScene(this.sceneSystem.activeScene.renderScene);
    }

    setActiveScene(scene) {
        this.sceneSystem.setActiveScene(scene);
    }

    createScene() {
        let renderScene = this.renderer.createRenderScene();
        let scene = this.sceneSystem.createSceneComponent(renderScene);
        return scene;
    }

    createGround(x,y,spriteName="wall_n",destroyable=false) {
        let groundEntity = new GameObject();
        let bodyComponent = this.physics.createBodyComponent(x,y,48,48);
        let renderComponent = this.renderer.createStaticRenderComponent(bodyComponent,spriteName);
        let colliderComponent = this.collisionSystem.createCollisionComponent(bodyComponent,"wall");
        if(destroyable) {
            bodyComponent.on("destroyWall",() => {
                this.sceneSystem.activeScene.deleteGameObject(groundEntity);
            });
        }
        groundEntity.attachComponents(bodyComponent, renderComponent, colliderComponent);
        this.sceneSystem.addEntityToActiveScene(groundEntity);
    }

    createElevator(x,y) {
        let elevatorEntity = new GameObject();
        let bodyComponent = this.physics.createBodyComponent(x,y,48,48);
        bodyComponent.setVelocity(new Vec2(0,-240));
        let schedulerComponent = this.schedulerFactory.createScheduler();
        schedulerComponent.addTask(3000, () => {
            bodyComponent.setVelocity(new Vec2(0, 240));
        });
        schedulerComponent.addTask(3000, () => {
            bodyComponent.setVelocity(new Vec2(0,-240));
        });
        schedulerComponent.startAndRepeat();
        let renderComponent = this.renderer.createStaticRenderComponent(bodyComponent,"interactive_elements_elevator");
        let colliderComponent = this.collisionSystem.createCollisionComponent(bodyComponent,"wall");
        let eleColliderComponent = this.collisionSystem.createCollisionComponent(bodyComponent);
        this.collisionSystem.onCollision(eleColliderComponent, "feet", (elevatorCollider, feetCollder) => {
            let playerBody = feetCollder.bodyComponent.attachedTo;
            let elevatorBody = eleColliderComponent.bodyComponent;
            elevatorBody.attachBody(playerBody);
            EventSystem.emit("playerTouchedMovingFloor");
        });
        this.collisionSystem.onExitCollision(eleColliderComponent, "feet", (feetCollder) => {
            let playerBody = feetCollder.bodyComponent.attachedTo;
            if(playerBody.attachedTo === eleColliderComponent.bodyComponent) {
                playerBody.detach();
            }
        });
        elevatorEntity.attachComponents(bodyComponent, schedulerComponent, renderComponent, colliderComponent, eleColliderComponent);
        this.sceneSystem.addEntityToActiveScene(elevatorEntity);
    }

    createElevator2(x,y) {
        let elevatorEntity = new GameObject();
        let bodyComponent = this.physics.createBodyComponent(x,y,48,48);
        bodyComponent.setVelocity(new Vec2(0,240));
        let schedulerComponent = this.schedulerFactory.createScheduler();
        schedulerComponent.addTask(3000, () => {
            bodyComponent.setVelocity(new Vec2(0, -240));
        });
        schedulerComponent.addTask(3000, () => {
            bodyComponent.setVelocity(new Vec2(0,240));
        });
        schedulerComponent.startAndRepeat();
        let renderComponent = this.renderer.createStaticRenderComponent(bodyComponent,"interactive_elements_elevator");
        let colliderComponent = this.collisionSystem.createCollisionComponent(bodyComponent,"wall");
        let eleColliderComponent = this.collisionSystem.createCollisionComponent(bodyComponent);
        this.collisionSystem.onCollision(eleColliderComponent, "feet", (elevatorCollider, feetCollder) => {
            let playerBody = feetCollder.bodyComponent.attachedTo;
            let elevatorBody = eleColliderComponent.bodyComponent;
            elevatorBody.attachBody(playerBody);
            EventSystem.emit("playerTouchedMovingFloor");
        });
        this.collisionSystem.onExitCollision(eleColliderComponent, "feet", (feetCollder) => {
            let playerBody = feetCollder.bodyComponent.attachedTo;
            if(playerBody.attachedTo === eleColliderComponent.bodyComponent) {
                playerBody.detach();
            }
        });
        elevatorEntity.attachComponents(bodyComponent, schedulerComponent, renderComponent, colliderComponent, eleColliderComponent);
        this.sceneSystem.addEntityToActiveScene(elevatorEntity);
    }

    createSpike(x,y) {
        let spikeEntity = new GameObject();
        let w = 48;
        let h = 27;
        let bodyComponent = this.physics.createBodyComponent(x,y,w,h);
        let spikeRenderer = this.renderer.createStaticRenderComponent(bodyComponent, "wall_spike");
        let colliderComponent = this.collisionSystem.createCollisionComponent(bodyComponent,"spike");
        spikeEntity.attachComponents(bodyComponent, spikeRenderer, colliderComponent);
        this.sceneSystem.addEntityToActiveScene(spikeEntity);
    }

    createOneWayWall(x,y) {
        let spikeEntity = new GameObject();
        let playerHeight = 33;
        let w = 48;
        let h = 12;
        let bodyComponent = this.physics.createBodyComponent(x,y,w,h);
        let wallTriggerBodyComponent = this.physics.createBodyComponent(x-w,y-playerHeight-h,w*3,h);
        let wallTriggerColliderComponent = this.collisionSystem.createCollisionComponent(wallTriggerBodyComponent);
        let spikeRenderer = this.renderer.createStaticRenderComponent(bodyComponent, "wall_one_way");
        let colliderComponent = this.collisionSystem.createCollisionComponent(bodyComponent,"wall");
        colliderComponent.isEnabled = false;
        this.collisionSystem.onEnterCollision(wallTriggerColliderComponent, "head", () => {
            colliderComponent.isEnabled = true;
        });
        this.collisionSystem.onExitCollision(wallTriggerColliderComponent, "head", () => {
            colliderComponent.isEnabled = false;
        });
        spikeEntity.attachComponents(bodyComponent, spikeRenderer, colliderComponent, wallTriggerBodyComponent, wallTriggerColliderComponent);
        this.sceneSystem.addEntityToActiveScene(spikeEntity);
    }

    createControlRecorder() {
        let recorderEntity = new GameObject();
        let controlRecorderComponent = this.inputFactory.createControlRecorderComponent();
        recorderEntity.attachComponents(controlRecorderComponent);
        this.sceneSystem.addEntityToActiveScene(recorderEntity);
    }

    createControlReplayer() {
        let replayerEntity = new GameObject();
        let controlReplayerComponent = this.inputFactory.createControlReplayerComponent();
        replayerEntity.attachComponents(controlReplayerComponent);
        this.sceneSystem.addEntityToActiveScene(replayerEntity);
    }

    createShinyWall(x,y) {
        let spikeEntity = new GameObject();
        let w = 18;
        let h = 48;
        let bodyComponent = this.physics.createBodyComponent(x,y,w,h);
        let spikeRenderer = this.renderer.createStaticRenderComponent(bodyComponent, "wall_shiny", true);
        spikeRenderer.random = true;
        spikeEntity.attachComponents(bodyComponent, spikeRenderer);
        this.sceneSystem.addEntityToActiveScene(spikeEntity);
    }

    createToggle(x,y) {
        let toggleEntity = new GameObject();
        let w = 48;
        let h = 48;
        let bodyComponent = this.physics.createBodyComponent(x,y,w,h);
        let toggleComponent = this.entityFactory.createToggleComponent(bodyComponent);
        let toggleRenderComponent = this.renderer.createStaticRenderComponent(bodyComponent, "interactive_elements_air_toggle");
        let toggleColliderComponent = this.collisionSystem.createCollisionComponent(bodyComponent);
        this.collisionSystem.onEnterCollision(toggleColliderComponent, "player", () => {
            if(!toggleComponent.isToggled) {
                toggleComponent.isToggled = true;
                this.createGround(48*10,48*6,"wall_ne");
                this.createGround(48*10,48*7,"wall_inner_ne");
                this.createGround(48*11,48*7,"wall_ne");
                this.createGround(48*11,48*8,"wall_inner_ne");
                this.createGround(48*12,48*8,"wall_n");
                this.createGround(48*13,48*8,"wall_n");
                this.sceneSystem.activeScene.deleteGameObject(toggleEntity);
            }
        });
        toggleEntity.attachComponents(bodyComponent, toggleComponent, toggleRenderComponent, toggleColliderComponent);
        this.sceneSystem.addEntityToActiveScene(toggleEntity);
    }

    createEndLevelToggle(x,y) {
        let toggleEntity = new GameObject();
        let w = 48;
        let h = 48;
        let bodyComponent = this.physics.createBodyComponent(x,y,w,h);
        let toggleComponent = this.entityFactory.createToggleComponent(bodyComponent);
        let toggleRenderComponent = this.renderer.createStaticRenderComponent(bodyComponent, "interactive_elements_air_toggle");
        let toggleColliderComponent = this.collisionSystem.createCollisionComponent(bodyComponent);
        this.collisionSystem.onEnterCollision(toggleColliderComponent, "player", () => {
            if(!toggleComponent.isToggled) {
                this.swapScene();
            }
        });
        toggleEntity.attachComponents(bodyComponent, toggleComponent, toggleRenderComponent, toggleColliderComponent);
        this.sceneSystem.addEntityToActiveScene(toggleEntity);
    }

    createWallToggle(x,y) {
        let toggleEntity = new GameObject();
        let w = 48;
        let h = 48;
        let bodyComponent = this.physics.createBodyComponent(x,y,w,h);
        let toggleComponent = this.entityFactory.createToggleComponent(bodyComponent);
        let toggleRenderComponent = this.renderer.createStaticRenderComponent(bodyComponent, "interactive_elements_air_toggle");
        let toggleColliderComponent = this.collisionSystem.createCollisionComponent(bodyComponent);
        this.collisionSystem.onEnterCollision(toggleColliderComponent, "player", () => {
            if(!toggleComponent.isToggled) {
                toggleComponent.isToggled = true;
                this.createGround(48*20,48*6,"wall_nw");
                this.createGround(48*21,48*6,"wall_n");
                this.createGround(48*22,48*6,"wall_n");
                this.createGround(48*23,48*6,"wall_n");
                this.createGround(48*24,48*6,"wall_ne");
                this.createGround(48*20,48*2,"wall_sw");
                this.createGround(48*21,48*2,"wall_s");
                this.createGround(48*22,48*2,"wall_s");
                this.createGround(48*23,48*2,"wall_s");
                this.createGround(48*24,48*2,"wall_se");
                EventSystem.emit("destroyWall");
                this.sceneSystem.activeScene.deleteGameObject(toggleEntity);
            }
        });
        toggleEntity.attachComponents(bodyComponent, toggleComponent, toggleRenderComponent, toggleColliderComponent);
        this.sceneSystem.addEntityToActiveScene(toggleEntity);
    }

    createPlayer(x,y) {
        let playerEntity = new GameObject();
        let w = 36;
        let h = 33;
        let bodyComponent = this.physics.createBodyComponent(x,y,w,h);
        bodyComponent.setAcceleration(new Vec2(0,2000));
        let playerColliderComponent = this.collisionSystem.createCollisionComponent(bodyComponent, "player", 1);
        let feetBodyComponent = this.physics.createBodyComponent(x,y+24,w,10);
        let headBodyComponent = this.physics.createBodyComponent(x,y-1,w,10);
        let headColliderComponent = this.collisionSystem.createCollisionComponent(headBodyComponent, "head");
        let feetColliderComponent = this.collisionSystem.createCollisionComponent(feetBodyComponent, "feet");
        bodyComponent.attachBody(feetBodyComponent);
        bodyComponent.attachBody(headBodyComponent);
        let playerBodyComponent = this.entityFactory.createPlayerBodyComponent(bodyComponent);
        let playerComponent = this.entityFactory.createPlayerComponent(playerBodyComponent);
        let playerInputComponent = this.inputFactory.createPlayerInputComponent();
        let renderComponent = this.renderer.createPlayerRenderComponent(bodyComponent, playerComponent);
        playerCreationHelpers.attachSchedulersToPlayer(playerEntity, playerComponent, this.schedulerFactory);
        playerCreationHelpers.attachFeetColliderToPlayer(playerEntity, playerComponent, feetColliderComponent, this.collisionSystem);
        playerCreationHelpers.attachHeadColliderToPlayer(playerEntity, playerComponent, headColliderComponent, this.collisionSystem);
        playerEntity.attachComponents(bodyComponent, playerComponent, renderComponent,
            playerInputComponent, playerBodyComponent, playerColliderComponent,
            feetBodyComponent, headBodyComponent);
        this.sceneSystem.addEntityToActiveScene(playerEntity);
    }

    update(delta) {
        this.sceneSystem.update(delta);
        EventSystem.setActiveComponents(this.sceneSystem.activeScene.allComponents);
        let inputComponents = this.sceneSystem.activeScene.getComponentsBySystem(this.inputFactory);
        this.inputFactory.update(inputComponents, delta);
        let schedulerComponents = this.sceneSystem.activeScene.getComponentsBySystem(this.schedulerFactory);
        this.schedulerFactory.update(schedulerComponents, delta*1000);
        let physicsComponents = this.sceneSystem.activeScene.getComponentsBySystem(this.physics);
        this.physics.update(physicsComponents, delta);
        let collisionComponents = this.sceneSystem.activeScene.getComponentsBySystem(this.collisionSystem);
        this.collisionSystem.update(collisionComponents);
        let entities = this.sceneSystem.activeScene.getComponentsBySystem(this.entityFactory);
        this.entityFactory.update(entities, delta);
        EventSystem.clearActiveComponents();
        if(this.sceneSystem.swapToQueuedScene()) {
            this.renderer.setActiveRenderScene(this.sceneSystem.activeScene.renderScene);
        }
    }
}

module.exports = EngineCore;