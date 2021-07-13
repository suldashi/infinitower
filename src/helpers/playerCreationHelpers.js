function attachSchedulersToPlayer(playerEntity, playerComponent, schedulingSystem) {
    let jumpLimitScheduler = schedulingSystem.createScheduler();
    let jumpBufferScheduler = schedulingSystem.createScheduler();
    let edgeJumpScheduler = schedulingSystem.createScheduler();
    jumpLimitScheduler.addTask(300, () => {
        playerComponent.stopJumping();
        jumpLimitScheduler.reset();
    });
    jumpBufferScheduler.addTask(150, () => {
        playerComponent.isJumpBuffered = false;
        jumpBufferScheduler.reset();
    });
    edgeJumpScheduler.addTask(100, () => {
        playerComponent.canEdgeJump = false;
        edgeJumpScheduler.reset();
    });
    playerComponent.onStartedFallingFromGround = () => {
        playerComponent.canEdgeJump = true;
        edgeJumpScheduler.start();
    };
    playerComponent.onHitTheGround = () => {
        edgeJumpScheduler.reset();
    };
    playerComponent.onAttemptedJump = () => {
        playerComponent.isJumpBuffered = true;
        jumpBufferScheduler.start();
    }
    playerComponent.onJumped = () => {
        jumpLimitScheduler.start();
    }
    playerComponent.onStoppedJumping = () => {
        jumpLimitScheduler.reset();
    }
    playerEntity.attachComponents(jumpLimitScheduler, jumpBufferScheduler, edgeJumpScheduler);
}

function attachFeetColliderToPlayer(playerEntity, playerComponent, feetCollider, collisionSystem) {
    collisionSystem.onEnterCollision(feetCollider, "spike", () => {
        playerComponent.kill();
        window.enableShader();
    });
    collisionSystem.onEnterCollision(feetCollider, "wall", () => {
        playerComponent.feetTouching();
        playerComponent.hitFloor();
    });
    collisionSystem.onExitCollision(feetCollider, "wall", () => {
        playerComponent.feetNotTouching();
        playerComponent.leftFloor();
    });
    playerEntity.attachComponents(feetCollider);
}

function attachHeadColliderToPlayer(playerEntity, playerComponent, headCollider, collisionSystem) {
    collisionSystem.onEnterCollision(headCollider, "wall", () => {
        playerComponent.headTouching();
        playerComponent.stopJumping();
    });
    collisionSystem.onExitCollision(headCollider, "wall", () => {
        playerComponent.headNotTouching();
    });
    playerEntity.attachComponents(headCollider);
}

module.exports = {
    attachSchedulersToPlayer,
    attachFeetColliderToPlayer,
    attachHeadColliderToPlayer
}