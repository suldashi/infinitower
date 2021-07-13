const BaseComponent = require("../baseComponent");
const EventSystem = require("../event");

class PlayerInputComponent extends BaseComponent {
    constructor() {
        super();
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;
        this.updatedMove = false;
        this.updatedJump = false;
        this.frameCounter = 0;
    }

    updateUp(newUp) {
        this.up = newUp;
        this.updatedJump = true;
    }

    updateDown(newDown) {
        this.down = newDown;
        this.updatedMove = true;
    }

    updateLeft(newLeft) {
        this.left = newLeft;
        this.updatedMove = true;
    }

    updateRight(newRight) {
        this.right = newRight;
        this.updatedMove = true;
    }

    getInputs() {
        let inputs = {
            up: this.up,
            down: this.down,
            left: this.left,
            right: this.right,
            frameCounter: this.frameCounter
        };
        return inputs;
    }

    update() { 
        if(this.updatedMove) {
            EventSystem.emit("newPlayerControlsMove",this.getInputs());
            this.updatedMove = false;
        }
        if(this.updatedJump) {
            EventSystem.emit("newPlayerControlsJump",this.getInputs());
            this.updatedJump = false;
        }
        this.frameCounter++;
    }
}

module.exports = PlayerInputComponent;