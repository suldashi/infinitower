const Vec2 = require("../physics/vec2");

class CameraComponent {
    constructor(x,y) {
        this.cameraPosition = new Vec2(x,y);
    }

    negateAndMove(newPosition) {
        this.cameraPosition = this.cameraPosition.neg().add(newPosition);
        return this;
    }

    update() {
        return this;
    }
}

module.exports = CameraComponent;