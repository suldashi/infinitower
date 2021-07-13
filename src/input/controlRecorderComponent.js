const BaseComponent = require("../baseComponent");
const EventSystem = require("../event");

class ControlRecorderComponent extends BaseComponent {
    constructor() {
        super();
        this.entries = [];
        this.on("newPlayerControlsMove", (controls) => {
            this.entries.push({
                type:"newPlayerControlsMove",
                controls
            });
        });
        this.on("newPlayerControlsJump", (controls) => {
            this.entries.push({
                type:"newPlayerControlsJump",
                controls
            });
        });

        window.getControls = () => {
            return JSON.stringify(this.entries);
        }
    }
}

module.exports = ControlRecorderComponent;