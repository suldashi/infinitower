const uuid = require("uuid");

class GameObject {
    constructor() {
        this.id = uuid();
        this.components = [];
    }

    attachComponent(component) {
        this.components.push(component);
    }

    attachComponents(...components) {
        this.components = [...this.components, ...components];
    }
}

module.exports = GameObject;