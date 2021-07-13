class SceneComponent {
    constructor(renderScene) {
        this.renderScene = renderScene;
        this.gameObjects = [];
        this.createdGameObjects = [];
        this.deletedGameObjects = [];
        this.allComponents = [];
        this.createdComponents = [];
        this.deletedComponents = [];
    }

    getComponentsBySystem(system) {
        return this.allComponents.filter(componentInstance => system.componentTypes.some(ComponentType => componentInstance instanceof ComponentType));
    }

    addGameObject(gameObject) {
        this.createdGameObjects.push(gameObject);
        this.createdComponents = [...this.createdComponents, ...gameObject.components];
    }

    deleteGameObject(gameObject) {
        this.deletedComponents.push(gameObject);
        this.deletedComponents = [...this.deletedComponents, ...gameObject.components];
        let toBeDeleted = this.renderScene.renderComponents.filter(x => this.deletedComponents.includes(x));
        this.renderScene.deleteComponents(toBeDeleted);
    }

    update() {
        this.gameObjects = this.gameObjects.filter(x => !this.deletedGameObjects.includes(x));
        this.deletedGameObjects = [];
        this.allComponents = this.allComponents.filter(x => !this.deletedComponents.includes(x));
        this.deletedComponents = [];
        this.gameObjects = [...this.gameObjects, ...this.createdGameObjects];
        this.createdGameObjects = [];
        this.allComponents = [...this.allComponents, ...this.createdComponents];
        this.createdComponents = [];
    }
}

module.exports = SceneComponent;