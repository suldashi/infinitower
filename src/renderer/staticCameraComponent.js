const Vec2 = require("../physics/vec2");

class StaticCameraComponent {
    constructor(cameraPosition) {
        if(!cameraPosition) {
            this.cameraPosition = new Vec2(0,0);
        }
        else {
            this.cameraPosition = cameraPosition.copy();
        }
    }

    negateAndMove(newPosition) {
        return this;
    }

    update() {
        return this;
    }
    
}

module.exports = StaticCameraComponent;