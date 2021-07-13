const PlayerComponent = require("./player/playerComponent");
const PlayerBodyComponent = require("./player/playerBodyComponent");
const ToggleComponent = require("./toggle/toggleComponent");

class EntityFactory {
    constructor() {
        this.componentTypes = [PlayerComponent, PlayerBodyComponent, ToggleComponent];
    }

    createPlayerComponent(playerBodyComponent) {
        let playerComponent = new PlayerComponent(playerBodyComponent);
        return playerComponent;
    }

    createPlayerBodyComponent(bodyComponent) {
        let playerBodyComponent = new PlayerBodyComponent(bodyComponent);
        return playerBodyComponent;
    }

    createToggleComponent(toggleBodyComponent) {
        let toggleComponent = new ToggleComponent(toggleBodyComponent);
        return toggleComponent;
    }

    update(entities, delta) {
        for(var i in entities) {
            entities[i].update(delta);
        }
    }
}

module.exports = EntityFactory;