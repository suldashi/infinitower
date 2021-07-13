const Vec2 = require("../../physics/vec2");

class PlayerBodyComponent {
    constructor(bodyComponent) {
        this.bodyComponent = bodyComponent;
        this.speed = 300;
        this.slidingStartingSpeed = 150;
        this.dampingFactor = 8;
        this.dampingCutoffSpeed = 50;
        this.terminalVelocity = 1300;
        this.isDamping = false;
    }

    getDirectionVector(direction) {
        switch(direction) {
            case "E":
                return new Vec2(this.speed,this.bodyComponent.velocity.y);
            case "W":
                return new Vec2(-this.speed,this.bodyComponent.velocity.y);
            case "0":
                return new Vec2(0,this.bodyComponent.velocity.y);

        }
    }

    hitTheGround() {
        this.bodyComponent.disableAcceleration();
        this.bodyComponent.velocity = new Vec2(this.bodyComponent.velocity.x, 0);
    }

    moveHorizontally(playerDirection) {
        this.isDamping = false;
        this.bodyComponent.setVelocity(this.getDirectionVector(playerDirection));
    }
    
    get isMovingHorizontally() {
        return this.bodyComponent.velocity.x > this.slidingStartingSpeed || this.bodyComponent.velocity.x < -this.slidingStartingSpeed;
    }

    stopMovingHorizontally() {
        this.isDamping = true;
        let xSlidingSpeed = this.bodyComponent.velocity.x > 0 ? this.slidingStartingSpeed : -this.slidingStartingSpeed;
        this.bodyComponent.setVelocity(new Vec2(xSlidingSpeed,this.bodyComponent.velocity.y));
    }

    jump() {
        this.bodyComponent.setVelocity(new Vec2(this.bodyComponent.velocity.x,-700));
        this.bodyComponent.enableAcceleration();
    }

    fall() {
        this.bodyComponent.enableAcceleration();
    }

    update(delta) {
        if(this.isDamping) {
            let newXVelocity = this.bodyComponent.velocity.x/(1+(this.dampingFactor*delta));
            if(newXVelocity > -this.dampingCutoffSpeed && newXVelocity < this.dampingCutoffSpeed) {
                newXVelocity = 0;
                this.isDamping = false;
            }
            this.bodyComponent.setVelocity(new Vec2(newXVelocity, this.bodyComponent.velocity.y));
        }
        if(this.bodyComponent.velocity.y > this.terminalVelocity) {
            this.bodyComponent.velocity.y = this.terminalVelocity;
        }
    }
}

module.exports = PlayerBodyComponent;