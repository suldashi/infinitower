const PlayerInputComponent = require("./playerInputComponent");
const ControlRecorderComponent = require("./controlRecorderComponent");
const ControlReplayerComponent = require("./controlReplayerComponent");

class InputSystem {
    constructor() {
        this.components = [];
        this.componentTypes = [PlayerInputComponent, ControlRecorderComponent, ControlReplayerComponent];
        this.touchStatus = {
            left: false,
            right: false,
            leftJump: false,
            rightJump: false
        }
        this.inputState = {
            up: false,
            down: false,
            left: false,
            right: false
        };
        this.newStates = {
            up: false,
            down: false,
            left: false,
            right: false
        };
        window.onkeydown = (event) => {
            if(!event.repeat) {
                switch(event.code) {
                    case "KeyW": {
                        this.inputState.up = true;
                        this.newStates.up = true;
                        break;
                    }
                    case "KeyS": {
                        this.inputState.down = true;
                        this.newStates.down = true;
                        break;
                    }
                    case "KeyA": {
                        this.inputState.left = true;
                        this.newStates.left = true;
                        break;
                    }
                    case "KeyD": {
                        this.inputState.right = true;
                        this.newStates.right = true;
                        break;
                    }
                }
            }
            
        };
        window.onkeyup = (event) => {
            switch(event.code) {
                case "KeyW": {
                    this.inputState.up = false;
                    this.newStates.up = true;
                    break;
                }
                case "KeyS": {
                    this.inputState.down = false;
                    this.newStates.down = true;
                    break;
                }
                case "KeyA": {
                    this.inputState.left = false;
                    this.newStates.left = true;
                    break;
                }
                case "KeyD": {
                    this.inputState.right = false;
                    this.newStates.right = true;
                    break;
                }
            }
        };

        let leftTouch = document.getElementById("mobile-controls-left");
		let rightTouch = document.getElementById("mobile-controls-right");
		rightTouch.ontouchstart = leftTouch.ontouchstart = (ev) => {
            ev.preventDefault();
            let elHeight = 100;
			for(var i=0;i<ev.touches.length;i++) {
                let touch = ev.touches.item(i);
                let target = touch.target;
				if(touch.clientY - target.offsetTop > elHeight/2) {
					if(target.id==="mobile-controls-left") {
                        this.touchStatus.left = true;
                        this.touchStatus.leftJump = false;
                    }
                    else {
                        this.touchStatus.right = true;
                        this.touchStatus.rightJump = false;
                    }
				}
				else {
					if(target.id==="mobile-controls-left") {
                        this.touchStatus.left = true;
                        this.touchStatus.leftJump = true;
                    }
                    else {
                        this.touchStatus.right = true;
                        this.touchStatus.rightJump = true;
                    }
				}
            }
            if(this.touchStatus.right && !this.touchStatus.left) {
                this.inputState.right = true;
                this.newStates.right = true;
            }
            else if(!this.touchStatus.right && this.touchStatus.left) {
                this.inputState.left = true;
                this.newStates.left = true;
            }
            else {
                this.inputState.right = false;
                this.newStates.right = true;
                this.inputState.left = false;
                this.newStates.left = true;
            }
            if(this.touchStatus.leftJump || this.touchStatus.rightJump) {    
                this.newStates.up = true;
                this.inputState.up = true;
            }
		}

		rightTouch.ontouchend = leftTouch.ontouchend = leftTouch.ontouchcancel = (ev) => {
            let target = ev.target;
            if(target.id==="mobile-controls-left") {
                this.touchStatus.left = false;
                this.touchStatus.leftJump = false;
            }
            else {
                this.touchStatus.right = false;
                this.touchStatus.rightJump = false;
            }
            if(this.touchStatus.right && !this.touchStatus.left) {
                this.inputState.right = true;
                this.newStates.right = true;
            }
            else if(!this.touchStatus.right && this.touchStatus.left) {
                this.inputState.left = true;
                this.newStates.left = true;
            }
            else {
                this.inputState.right = false;
                this.newStates.right = true;
                this.inputState.left = false;
                this.newStates.left = true;
            }
		}

		leftTouch.ontouchmove = rightTouch.ontouchmove =  (ev) => {
			ev.preventDefault();
			let elHeight = 100;
			for(var i=0;i<ev.touches.length;i++) {
				let touch = ev.touches.item(i);
				let target = touch.target;
				if(touch.clientY - target.offsetTop > elHeight/2) {
					if(target.id==="mobile-controls-left") {
                        this.touchStatus.leftJump = false;
                    }
                    else {
                        this.touchStatus.rightJump = false;
                    }
                    if(this.inputState.up && !this.touchStatus.rightJump && !this.touchStatus.leftJump) {
                        this.inputState.up = false;
                        this.newStates.up = true;
                    }
				}
				else {
					if(target.id==="mobile-controls-left") {
                        this.touchStatus.leftJump = true;
                    }
                    else {
                        this.touchStatus.rightJump = true;
                    }
                    if(!this.inputState.up) {
                        this.inputState.up = true;
                        this.newStates.up = true;
                    }
				}
			}
		}
    }

    createPlayerInputComponent() {
        let playerInputComponent = new PlayerInputComponent();
        this.components.push(playerInputComponent);
        return playerInputComponent;
    }

    createControlRecorderComponent() {
        let controlRecorderComponent = new ControlRecorderComponent();
        this.components.push(controlRecorderComponent);
        return controlRecorderComponent;
    }

    createControlReplayerComponent() {
        let controlReplayerComponent = new ControlReplayerComponent();
        this.components.push(controlReplayerComponent);
        return controlReplayerComponent;
    }

    update(inputComponents, delta) {
        for(var i in inputComponents) {
            if(inputComponents[i] instanceof PlayerInputComponent) {
                if(this.newStates.up) {
                    inputComponents[i].updateUp(this.inputState.up);
                    this.newStates.up = false;
                }
                if(this.newStates.down) {
                    inputComponents[i].updateDown(this.inputState.down);
                    this.newStates.down = false;
                }
                if(this.newStates.left) {
                    inputComponents[i].updateLeft(this.inputState.left);
                    this.newStates.left = false;
                }
                if(this.newStates.right) {
                    inputComponents[i].updateRight(this.inputState.right);
                    this.newStates.right = false;
                }
            }
            inputComponents[i].update(delta);
        }
    }
}

module.exports = InputSystem;