const StaticCameraComponent = require("./staticCameraComponent");
const Vec2 = require("../physics/vec2");
const PIXI = require("./pixi.js");

class RendererScene {
    constructor() {
        this.pixiStage = new PIXI.Container();
        this.graphics = new PIXI.Graphics();
        this.pixiStage.sortableChildren = true;
        this.pixiStage.addChild(this.graphics);
        this.isShaderActive = false;
        this.activeShaders = [];
        this.renderComponents = [];
        this.activeCamera = new StaticCameraComponent();
    }

    setShaders(shaders) {
        this.activeShaders = shaders;
        this.pixiStage.filters = shaders.map(x => x.shader);
    }

    addRenderComponent(renderComponent) {
        this.renderComponents.push(renderComponent);
    }

    deleteComponents(toBeDeleted) {
        this.renderComponents = this.renderComponents.filter(x => !toBeDeleted.includes(x));
        for(var i in toBeDeleted) {
            toBeDeleted[i].destroy();
        }
    }

    update(delta) {
        this.graphics.clear();
        for(var i in this.renderComponents) {
            this.renderComponents[i].update(this.activeCamera);
        }
        for(var i in this.activeShaders) {
            this.activeShaders[i].update(delta);
        }
    }
}

module.exports = RendererScene;