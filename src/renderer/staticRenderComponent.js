const RenderComponent = require("./renderComponent");
const PIXI = require("./pixi");
const Utils = require("../utils");

class StaticRenderComponent extends RenderComponent {
    constructor(bodyComponent,resources,scene,spriteName, random = false) {
        super();
        this.bodyComponent = bodyComponent;
        this.resources = resources;
        this.scene = scene;
        this._scale = 3;
        this.random = random;
        this.spriteName = spriteName;
        this.bodyPosition = this.bodyComponent.position;
        this.displaySprite(this.spriteName);
    }

    set scale(spriteScale) {
        this._scale = spriteScale;
        this.sprite.scale.x = this.sprite.scale.y = this._scale;
    }

    update() {
        this.bodyPosition = this.bodyComponent.position;
        const cameraPosition = this.scene.activeCamera.cameraPosition;
        this.sprite.zIndex = this.zIndex;
        this.sprite.x = this.bodyPosition.x+cameraPosition.x;
        this.sprite.y = this.bodyPosition.y+cameraPosition.y;
    }

    playAnimation(animationTextures,animationSpeed) {
        this.animation = animationTextures;
        if(this.random) {
            let shuffledTextures = [...animationTextures]
            Utils.shuffle(shuffledTextures);
            this.animation = shuffledTextures;
        }
        this.sprite = new PIXI.AnimatedSprite(this.animation);
        this.sprite.updateAnchor = true;
        this.sprite.scale.x = this.sprite.scale.y = this._scale;
        this.sprite.animationSpeed = animationSpeed;
        this.sprite.play();
        this.scene.pixiStage.addChild(this.sprite);
    }

    destroyAnimation() {
        this.sprite.destroy();
    }

    displaySprite(spriteName) {
        this.playAnimation(this.resources.animations[spriteName],1/10);
        this.update();
    }

    destroy() {
        this.sprite.destroy();
    }
}

module.exports = StaticRenderComponent;