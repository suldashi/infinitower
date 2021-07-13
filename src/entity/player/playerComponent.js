const BaseComponent = require("../../baseComponent");
const PlayerState = require("./playerState");
const EventSystem = require("../../event");

class PlayerComponent extends BaseComponent {

    constructor(playerBodyComponent) {
        super();
        this.playerBodyComponent = playerBodyComponent;
        this.onJumped = () => {};
        this.onAttemptedJump = () => {};
        this.onStoppedJumping = () => {};
        this.onStartedFallingFromGround = () => {};
        this.onHitTheGround = () => {};
        this.direction = "E";
        this.isFacingLeft = false;
        this.state = new PlayerState(this);
        this.isDead = false;
        this.isJumpBuffered = false;
        this.canEdgeJump = false;
        this.isHeadTouching = false;
        this.isFeetTouching = false;
        this.on("newPlayerControlsMove",(inputs) => {
            if(!this.isDead) {
                this.handleMoveInputs(inputs);
            }
        });
        this.on("newPlayerControlsJump",(inputs) => {
            if(!this.isDead) {
                this.handleJumpInputs(inputs);
            }
        });
        this.on("playerTouchedMovingFloor", () => {
            this.hitFloor();
        })
    }

    feetTouching() {
        this.isFeetTouching = true;
        if(this.isHeadTouching) {
            this.kill();
        }
    }

    headTouching() {
        this.isHeadTouching = true;
        if(this.isFeetTouching) {
            this.kill();
        }
    }

    headNotTouching() {
        this.isHeadTouching = false;
    }

    feetNotTouching() {
        this.isFeetTouching = false;
    }

    handleMoveInputs(inputs) {
        if(inputs.left ^ inputs.right) {
            this.direction = this.getDirection(inputs);
            if(inputs.left && !inputs.right) {
                this.isFacingLeft = true;
            }
            else if(!inputs.left && inputs.right) {
                this.isFacingLeft = false;
            }
            this.state.doAction("move");
            this.playerBodyComponent.moveHorizontally(this.direction);
        }
        else {
            this.state.doAction("stopMoving");
            this.playerBodyComponent.stopMovingHorizontally();
        }
    }

    handleJumpInputs(inputs) {
        if(inputs.up) {
            if(this.canEdgeJump) {
                this.state.doAction("coyoteJump");
            }
            else {
                this.state.doAction("jump");
            }
            this.onAttemptedJump();
        }
        else {
            this.state.doAction("stopJumping");
        }
    }

    hitFloor() {
        if(this.playerBodyComponent.isMovingHorizontally) {
            this.state.doAction("hitTheGroundRunning");
        }
        else {
            this.state.doAction("hitTheGround");
        }
    }

    kill() {
        this.state.doAction("kill");
    }

    leftFloor() {
        this.state.doAction("fall");
    }

    stopJumping() {
        this.state.doAction("stopJumping");
    }

    getDirection(inputs) {
        if(inputs.left && !inputs.right) {
            return "W";
        }
        else if(inputs.right && !inputs.left) {
            return "E";
        }
        else {
            return "0";
        }
    }

    stateChanged(newState, prevState) {
        if(newState === "idle") {
            this.playerBodyComponent.hitTheGround();
            this.onHitTheGround();
            this.canEdgeJump = false;
            if(this.isJumpBuffered && prevState !== "movingUp") {
                this.state.doAction("jump");
            }
        }
        else if(newState === "running") {
            this.playerBodyComponent.hitTheGround();
            this.onHitTheGround();
            this.canEdgeJump = false;
            if(this.isJumpBuffered && prevState !== "movingUp") {
                this.state.doAction("jump");
            }
        }
        else if(newState === "jumping") {
            this.playerBodyComponent.jump();
            this.onJumped();
        }
        else if(newState === "falling") {
            this.playerBodyComponent.fall();
            if(prevState === "running" || prevState === "idle") {
                this.onStartedFallingFromGround();
            }
        }
        else if(newState === "dead") {
            this.isDead = true;
            this.playerBodyComponent.bodyComponent.disableAcceleration();
            this.playerBodyComponent.bodyComponent.velocity = new Vec2(0,0);
        }
    }

    update() {
        if(this.playerBodyComponent.bodyComponent.velocity.y >= 0) {
            this.state.doAction("isMovingDown");
        }
    }

    
}

module.exports = PlayerComponent;