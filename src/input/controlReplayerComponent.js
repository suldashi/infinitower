const BaseComponent = require("../baseComponent");
const EventSystem = require("../event");

class ControlReplayerComponent extends BaseComponent {
    constructor() {
        super();
        this.entries = JSON.parse(`[{"type":"newPlayerControlsMove","controls":{"up":false,"down":false,"left":true,"right":false,"frameCounter":33}},{"type":"newPlayerControlsMove","controls":{"up":false,"down":false,"left":false,"right":false,"frameCounter":45}},{"type":"newPlayerControlsMove","controls":{"up":false,"down":false,"left":true,"right":false,"frameCounter":55}},{"type":"newPlayerControlsMove","controls":{"up":false,"down":false,"left":false,"right":false,"frameCounter":59}},{"type":"newPlayerControlsMove","controls":{"up":false,"down":false,"left":false,"right":true,"frameCounter":186}},{"type":"newPlayerControlsJump","controls":{"up":true,"down":false,"left":false,"right":true,"frameCounter":188}},{"type":"newPlayerControlsMove","controls":{"up":true,"down":false,"left":false,"right":false,"frameCounter":206}},{"type":"newPlayerControlsJump","controls":{"up":false,"down":false,"left":false,"right":false,"frameCounter":207}}]`);
        this.frameCounter = 0;
    }

    update() {
        let currentFrameControls = this.entries.filter(x => x.controls.frameCounter === this.frameCounter);
        for(var i in currentFrameControls) {
            EventSystem.emit(currentFrameControls[i].type, currentFrameControls[i].controls);
        }
        this.frameCounter++;
    }
}

module.exports = ControlReplayerComponent;