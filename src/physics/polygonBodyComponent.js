const Vec2 = require("./vec2");
const BaseComponent = require("../baseComponent");
const EventSystem = require("../event");

class PolygonBodyComponent extends BaseComponent {
    constructor(points) {
        super();
        this.points = points;
        let sumX = 0;
        let sumY = 0;
        for(var i in points) {
            sumX+=points[i].x;
            sumY+=points[i].y;
        }
        this.position = new Vec2(sumX/this.points.length,sumY/this.points.length);
        this.velocity = new Vec2(0,0);
        this.acceleration = new Vec2(0,0);
        this.attachedBodies = [];
        this.attachedTo = null;
        this.isAccelerationEnabled = true;
    }

    enableAcceleration() {
        this.isAccelerationEnabled = true;
    }

    disableAcceleration() {
        this.isAccelerationEnabled = false;
    }

    attachBody(otherBodyComponent) {
        otherBodyComponent.detach();
        otherBodyComponent.attachedTo = this;
        this.attachedBodies.push(otherBodyComponent);
    }

    detach() {
        if(this.attachedTo) {
            this.attachedTo.attachedBodies = this.attachedTo.attachedBodies.filter(x => x !== this);
            this.attachedTo = null;
        }
    }

    detachAll() {
        for(var i in this.attachedBodies) {
            this.attachedBodies[i].attachedTo = null;
        }
        this.attachedBodies = [];
    }

    setVelocity(velocity) {
        this.velocity = velocity.copy();
    }

    setAcceleration(acceleration) {
        this.acceleration = acceleration.copy();
    }

    setPosition(newPosition) {
        let positionDelta = newPosition.subtract(this.position);
        this.position.addToThis(positionDelta);
        for(var i in this.points) {
            this.points[i].addToThis(positionDelta);
        }
        EventSystem.emit("bodyMoved_"+this.id);
    }

    translate(translationVector) {
        let newPosition = this.position.add(translationVector);
        this.setPosition(newPosition);
        for(var i in this.attachedBodies) {
            this.attachedBodies[i].translate(translationVector);
        }
    }

    update(delta) {
        if(this.isAccelerationEnabled) {
            let da = this.acceleration.scale(delta);
            this.velocity = this.velocity.add(da);
        }
        let dv = this.velocity.scale(delta);
        if(!dv.isZero) {
            this.translate(dv);
        }
    }
}

module.exports = PolygonBodyComponent;