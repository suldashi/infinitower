const Vec2 = require("./vec2");

class PolygonBodyComponent {
    constructor(x,y) {
        this.position = new Vec2(x,y);
        this.velocity = new Vec2(0,0);
        this.acceleration = new Vec2(0,0);
    }

    setVelocity(velocity) {
        this.velocity = velocity.copy();
    }

    setAcceleration(acceleration) {
        this.acceleration = acceleration.copy();
    }

    setPosition(position) {
        this.position = position.copy();
    }

    update(delta) {
        let da = this.acceleration.scale(delta);
        this.velocity = this.velocity.add(da);
        let dv = this.velocity.scale(delta);
        this.position.addToThis(dv);
    }
}

module.exports = PolygonBodyComponent;