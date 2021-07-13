const Vec2 = require("./vec2");
const PolygonBodyComponent = require("./polygonBodyComponent");
const PointBodyComponent = require("./pointBodyComponent");

class Physics {

    constructor() {
        this.bodies = [];
        this.componentTypes = [PolygonBodyComponent, PointBodyComponent];
    }

    createBodyComponent(x,y,width,height) {
        let body = new PolygonBodyComponent([new Vec2(x,y),new Vec2(x+width,y),new Vec2(x+width,y+height),new Vec2(x,y+height)]);
        this.bodies.push(body);
        return body;
    }

    createPointBodyComponent(x,y) {
        let body = new PointBodyComponent(x,y);
        this.bodies.push(body);
        return body;
    }

    update(physicsComponents, delta) {
        for(var i in physicsComponents) {
            physicsComponents[i].update(delta);
        }
    }
}

module.exports = Physics;