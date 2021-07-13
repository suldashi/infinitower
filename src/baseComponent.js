const uuid = require("uuid").v4;

class BaseComponent {
    constructor() {
        this.id = uuid();
        this.eventHandlers = [];
    }

    on(eventName, callback) {
        this.eventHandlers[eventName] = callback;
    }

    update() {

    }
}

module.exports = BaseComponent;