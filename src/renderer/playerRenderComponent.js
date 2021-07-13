const RenderComponent = require("./renderComponent");
const PIXI = require("./pixi");

class PlayerRenderComponent extends RenderComponent {
    constructor(bodyComponent,playerComponent,resources,scene) {
        super();
        this.bodyComponent = bodyComponent;
        this.playerComponent = playerComponent;

        this.resources = resources;
        this.scene = scene;
        this.scale = 3;
        this.reflected = this.playerComponent.isFacingLeft;
        this.spriteName = this.spriteMap(this.playerComponent.state.stateName);
        this.displaySprite(this.spriteName);
    }

    update() {
        if(this.reflected !== this.playerComponent.isFacingLeft) {
            this.reflected = this.playerComponent.isFacingLeft;
            this.sprite.scale.x*=-1;
        }
        if(this.spriteName !== this.spriteMap(this.playerComponent.state.stateName)) {
            this.spriteName = this.spriteMap(this.playerComponent.state.stateName);
            this.destroy();
            this.displaySprite(this.spriteName);
        }
        const activeCamera = this.scene.activeCamera.cameraPosition;
        this.sprite.x = this.bodyComponent.position.x + activeCamera.x;
        this.sprite.y = this.bodyComponent.position.y + activeCamera.y;
    }

    playAnimation(animationTextures,animationSpeed) {
        this.animation = animationTextures;
        this.sprite = new PIXI.AnimatedSprite(this.animation);
        this.sprite.updateAnchor = true;
        this.sprite.scale.x = this.sprite.scale.y = this.scale;
        if(this.reflected) {
            this.sprite.scale.x*=-1;
        }
        this.sprite.animationSpeed = animationSpeed;
        this.sprite.play();
        this.scene.pixiStage.addChild(this.sprite);
    }

    displaySprite(spriteName) {
        this.playAnimation(this.resources.animations[spriteName],1/6);
        this.update();
    }

    spriteMap(playerState) {
        let sprites = {
            "idle":"player_idle",
            "running":"player_run",
            "jumping":"player_jump",
            "movingUp":"player_fall",
            "falling":"player_fall",
            "dead":"player_dead",
        }
        return sprites[playerState];
    }

    destroy() {
        this.sprite.destroy();
    }
}

module.exports = PlayerRenderComponent;