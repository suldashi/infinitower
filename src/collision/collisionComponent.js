const BaseComponent = require("../baseComponent");

class CollisionComponent extends BaseComponent {
    constructor(bodyComponent, collisionTag, priority) {
        super();
        this.bodyComponent = bodyComponent;
        this.collisionTag = collisionTag;
        this.isEnabled = true;
        this.priority = priority;
        this.collisionCells = [];
        this.generateCollisionCells(this.bodyComponent);
        this.newCounterpartTags = {};
        this.counterpartTags = {};
        this.inCallbacks = {};
        this.outCallbacks = {};
        this.counter = 0;
        this.on("bodyMoved_"+this.bodyComponent.id, () => {
            this.generateCollisionCells();
        });
    }

    generateCollisionCells() {
        let tmpOffset = 1e10;
        this.collisionCells = [];
        let minX = this.bodyComponent.points[0].x;
        let maxX = this.bodyComponent.points[0].x;
        let minY = this.bodyComponent.points[0].y;
        let maxY = this.bodyComponent.points[0].y;
        for(var i in this.bodyComponent.points) {
            if(this.bodyComponent.points[i].x < minX) minX = this.bodyComponent.points[i].x;
            if(this.bodyComponent.points[i].x >= maxX) maxX = this.bodyComponent.points[i].x;
            if(this.bodyComponent.points[i].y < minY) minY = this.bodyComponent.points[i].y;
            if(this.bodyComponent.points[i].y >= maxY) maxY = this.bodyComponent.points[i].y;
        }
        minX+=tmpOffset;
        maxX+=tmpOffset;
        minY+=tmpOffset;
        maxY+=tmpOffset;
        for(var x = minX - minX % 100;x<maxX;x+=100) {
            for(var y = minY - minY % 100;y<maxY;y+=100) {
                this.collisionCells[(x - tmpOffset) + "|" + (y - tmpOffset)] = true;
            }
        }
    }

    enable() {
        this.isEnabled = true;
    }

    disable() {
        this.isEnabled = false;
    }

    addCounterpartTag(counterpartTag, counterpartCollisionComponent) {
        if(!this.newCounterpartTags[counterpartTag] && !this.counterpartTags[counterpartTag]) {
            if(this.inCallbacks[counterpartTag]) {
                this.inCallbacks[counterpartTag](counterpartCollisionComponent);
            }
        }
        this.newCounterpartTags[counterpartTag] = counterpartCollisionComponent;
    }

    onInitialCollision(collisionTag, callback) {
        this.inCallbacks[collisionTag] = callback;
    }

    offCollision(collisionTag, callback) {
        this.outCallbacks[collisionTag] = callback;
    }

    advanceTags() {
        const oldTags = Object.keys(this.counterpartTags);
        for(var i in oldTags) {
            if(!this.newCounterpartTags[oldTags[i]]) {
                if(this.outCallbacks[oldTags[i]]) {
                    this.outCallbacks[oldTags[i]](this.counterpartTags[oldTags[i]]);
                }
            }
        }
        this.counterpartTags = {...this.newCounterpartTags};
        this.newCounterpartTags = {};
    }
}

module.exports = CollisionComponent;