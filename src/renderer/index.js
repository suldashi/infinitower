const PIXI = require("./pixi");
const RendererScene = require("./rendererScene");
const StaticCameraComponent = require("./staticCameraComponent");
const BodyCameraComponent = require("./bodyCameraComponent");
const PolygonRenderComponent = require("./polygonRenderComponent");
const PlayerRenderComponent = require("./playerRenderComponent");
const StaticRenderComponent = require("./staticRenderComponent");
const ShaderComponent = require("./shaderComponent");
const Vec2 = require("../physics/vec2");
const config = require("../config");

PIXI.utils.skipHello();
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

class PixiRenderer {
    constructor(resources) {
        this.parentElement = document.getElementById("root");
        this.width = config.hres;
        this.height = config.vres;
        this.app = new PIXI.Application({width: this.width, height: this.height});
        this.app.renderer.backgroundColor = 0x472D3C;
        this.activeScene = this.createRenderScene();
        this.app.stage = this.activeScene.pixiStage;
        this.screenCenter = new Vec2(this.width/2,this.height/2);
        this.parentElement.appendChild(this.app.view);
        this.resources = resources;
        this.graphics = new PIXI.Graphics();
        this.app.stage.addChild(this.graphics);
        window.enableShader = this.enableShader.bind(this);
    }

    createRenderScene() {
        return new RendererScene();
    }

    setActiveRenderScene(renderScene) {
        this.activeScene = renderScene;
        this.app.stage = this.activeScene.pixiStage;
    }

    createPolygonRenderComponent(bodyComponent) {
        let renderComponent = new PolygonRenderComponent(bodyComponent,this.graphics);
        this.activeScene.addRenderComponent(renderComponent);
        return renderComponent;
    }

    createStaticRenderComponent(bodyComponent,textureName, random) {
        let renderComponent = new StaticRenderComponent(bodyComponent,this.resources,this.activeScene,textureName, random);
        this.activeScene.addRenderComponent(renderComponent);
        return renderComponent;
    }

    createPlayerRenderComponent(bodyComponent,playerComponent) {
        let renderComponent = new PlayerRenderComponent(bodyComponent,playerComponent,this.resources,this.activeScene);
        this.activeScene.addRenderComponent(renderComponent);
        return renderComponent;
    }

    createCameraComponent(bodyComponent) {
        return new BodyCameraComponent(bodyComponent);
    }

    setActiveCamera(cameraComponent) {
        this.activeScene.activeCamera = cameraComponent;
    }

    setStaticCamera() {
        this.activeScene.activeCamera = new StaticCameraComponent();
    }

    enableShader() {
        if(!this.activeScene.isShaderEnabled) {
            this.activeScene.isShaderEnabled = true;
            let shader = new ShaderComponent();
            this.activeScene.setShaders([shader]);
        }
    }

    drawFrame() {
        this.graphics.clear();
        this.activeScene.activeCamera.update().negateAndMove(this.screenCenter);
        this.activeScene.update();  
    }
}

module.exports = PixiRenderer;