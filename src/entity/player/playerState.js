class PlayerState {
	constructor(playerComponent) {
        this.playerComponent = playerComponent;
		this._stateName = 'falling';
		this.stateTransitions = [];
		this.separator = "@";
		this.defineStateTransition('idle', 'move', "running");
		this.defineStateTransition('idle', 'jump', 'jumping');
		this.defineStateTransition('idle', 'fall', 'falling');
		this.defineStateTransition('running', 'jump', 'jumping');
		this.defineStateTransition('running', 'stopMoving', 'idle');
		this.defineStateTransition('running', 'fall', 'falling');
		this.defineStateTransition('jumping', 'stopJumping', 'movingUp');
		this.defineStateTransition('movingUp', 'isMovingDown', 'falling');
        this.defineStateTransition('falling', "hitTheGroundRunning", 'running');
		this.defineStateTransition('falling', "hitTheGround", 'idle');
		this.defineStateTransition('falling', "coyoteJump", 'jumping');
		this.defineStateTransition("*", "kill", 'dead');
	}

	defineStateTransition(currentState, action, nextState) {
		this.stateTransitions[currentState+this.separator+action] = nextState;
	}

	doAction(action) {
		const prevState = this._stateName;
		if(this.stateTransitions[prevState+this.separator+action] || this.stateTransitions["*"+this.separator+action]) {
			this._stateName = this.stateTransitions[prevState+this.separator+action]
				?this.stateTransitions[prevState+this.separator+action]
				:this.stateTransitions["*"+this.separator+action]
			if (prevState !== this._stateName) {
				this.playerComponent.stateChanged(this.stateName, prevState);
			}
		}
	}

	get stateName() {
		return this._stateName;
	}
}

module.exports = PlayerState;
