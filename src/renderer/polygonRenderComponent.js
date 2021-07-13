const RenderComponent = require("./renderComponent");

class PolygonRenderComponent extends RenderComponent {
    constructor(bodyComponent, graphics) {
        super();
        this.bodyComponent = bodyComponent;
        this.color = 0xFF0000;
        this.zIndex = 0;
        this.graphics = graphics;
    }

    update(camera) {
        let cameraIso = camera.cameraPosition;
        this.graphics.beginFill(this.color);
        let points = [];
        for(var i in this.bodyComponent.points) {
            let iso = this.bodyComponent.points[i];
            points.push(iso.x + cameraIso.x,iso.y + cameraIso.y);
        }
        this.graphics.drawPolygon(points);
        this.graphics.endFill();
    }

    destroy() {
        
    }
}

module.exports = PolygonRenderComponent;