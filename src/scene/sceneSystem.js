const SceneComponent = require("./sceneComponent");

class SceneSystem {
    constructor() {
        this.scenes = [];
        this.activeScene = null;
        this.queuedScene = null;
    }

    swapScene() {
        let currentIndex = this.scenes.indexOf(this.activeScene);
        if(currentIndex === this.scenes.length - 1) {
            currentIndex = 0;
        }
        else {
            currentIndex++;
        }
        let newScene = this.scenes[currentIndex];
        this.setActiveScene(newScene);
    }

    createSceneComponent(renderScene) {
        let scene = new SceneComponent(renderScene);
        if(!this.activeScene) {
            this.activeScene = scene;
        }
        this.scenes.push(scene);
        return scene;
    }

    setActiveScene(sceneComponent) {
        this.queuedScene = sceneComponent;
    }

    setImmediateActiveScene(sceneComponent) {
        this.activeScene = sceneComponent;
        this.queuedScene = null;
    }
    
    swapToQueuedScene() {
        if(this.queuedScene) {
            this.activeScene = this.queuedScene;
            this.queuedScene = null;
            return true;
        }
        return false;
    }

    addEntityToActiveScene(gameEntity) {
        this.activeScene.addGameObject(gameEntity);
    }

    update(delta) {
        this.activeScene.update(delta);
    }
}

module.exports = SceneSystem;