const Vec2 = require("../physics/vec2");

class BodyCameraComponent {
    constructor(bodyComponent) {
        this.bodyComponent = bodyComponent;
        this.cameraPosition = this.bodyComponent.position.copy();
    }

    negateAndMove(newPosition) {
        this.cameraPosition = this.cameraPosition.neg().add(newPosition).add(new Vec2(0,this.bodyComponent.height));
        return this;
    }

    update() {
        this.cameraPosition = this.bodyComponent.position.copy();
        return this;
    }
    
}

module.exports = BodyCameraComponent;