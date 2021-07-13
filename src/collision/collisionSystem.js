const CollisionComponent = require("./collisionComponent");
const checkCollision = require("./satCollisionChecker");
const uuid = require("uuid").v4;

class CollisionSystem {
    constructor() {
        this.collisionComponents = [];
        this.componentTypes = [CollisionComponent];
        this.colliderCallbacks = {};
    }

    createCollisionComponent(bodyComponent,collisionTag = uuid(), priority = 0) {
        let collisionComponent = new CollisionComponent(bodyComponent,collisionTag, priority);
        this.collisionComponents.push(collisionComponent);
        return collisionComponent;
    }

    onTagCollision(firstTag,secondTag,onCollisionCallback) {
        this.colliderCallbacks[`${firstTag}|${secondTag}`] = onCollisionCallback;
    }

    onCollision(collisionComponent,tag,onCollisionCallback) {
        this.colliderCallbacks[`${collisionComponent.collisionTag}|${tag}`] = onCollisionCallback;
    }

    onEnterCollision(collisionComponent,tag,onEnterCollisionCallback) {
        if(!this.colliderCallbacks[`${collisionComponent.collisionTag}|${tag}`]) {
            this.colliderCallbacks[`${collisionComponent.collisionTag}|${tag}`] = () => {};
        }
        collisionComponent.onInitialCollision(tag, onEnterCollisionCallback);
    }

    onExitCollision(collisionComponent,tag,onEnterCollisionCallback) {
        if(!this.colliderCallbacks[`${collisionComponent.collisionTag}|${tag}`]) {
            this.colliderCallbacks[`${collisionComponent.collisionTag}|${tag}`] = () => {};
        }
        collisionComponent.offCollision(tag, onEnterCollisionCallback);
    }

    getTagIndex(firstTag, secondTag) {
        if(firstTag>secondTag) {
            return `${firstTag}|${secondTag}`;
        }
        else {
            return `${secondTag}|${firstTag}`;
        }
    }

    update(collisionComponents) {
        collisionComponents.sort((l,r) => r.priority - l.priority);
        let buckets = this.createBuckets(collisionComponents);
        let collisionTags = Object.keys(this.colliderCallbacks);
        for(var idx in collisionTags) {
            let separatedTags = collisionTags[idx].split("|");
            let firstTagComponents = buckets[separatedTags[0]];
            let secondTagComponents = buckets[separatedTags[1]];
            if(firstTagComponents && secondTagComponents) {
                for(let i=0;i<firstTagComponents.length;i++) {
                    for(let j=0;j<secondTagComponents.length;j++) {
                        let firstCollisionComponent = firstTagComponents[i];
                        let secondCollisionComponent = secondTagComponents[j];
                        let firstTag = separatedTags[0];
                        let secondTag = separatedTags[1];
                        let collisionTag = collisionTags[idx];
                        let collision = checkCollision(firstCollisionComponent.bodyComponent,secondCollisionComponent.bodyComponent);
                        if(collision && firstCollisionComponent.isEnabled && secondCollisionComponent.isEnabled) {
                            if(this.colliderCallbacks[collisionTag]) {
                                this.colliderCallbacks[collisionTag](firstCollisionComponent,secondCollisionComponent,collision);
                            }
                            firstCollisionComponent.addCounterpartTag(secondTag, secondCollisionComponent);
                            secondCollisionComponent.addCounterpartTag(firstTag, firstCollisionComponent);
                        }
                    }
                }
            }
        }
        for(let i in collisionComponents) {
            collisionComponents[i].advanceTags();
        }
    }

    createBuckets(collisionComponents) {
        let buckets = {};
        for(var i in collisionComponents) {
            if(!buckets[collisionComponents[i].collisionTag]) {
                buckets[collisionComponents[i].collisionTag] = [];
            }
            buckets[collisionComponents[i].collisionTag].push(collisionComponents[i]);
        }
        return buckets;
    }
}

module.exports = CollisionSystem;