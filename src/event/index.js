class EventSystem {
    constructor() {
        this.activeComponentsByEventName = {}; 
    }
    
    emit(eventName,eventData) {
        for(var i in this.activeComponentsByEventName[eventName]) {
            this.activeComponentsByEventName[eventName][i](eventData);
        }
    }

    setActiveComponents(components) {
        for(var i in components) {
            if(components[i].eventHandlers) {
                let eventNames = Object.keys(components[i].eventHandlers);
                for(var j in eventNames) {
                    let eventName = eventNames[j];
                    if(!this.activeComponentsByEventName[eventName]) {
                        this.activeComponentsByEventName[eventName] = [];
                    }
                    this.activeComponentsByEventName[eventName].push(components[i].eventHandlers[eventName]);
                }
            }
        }
    }

    clearActiveComponents() {
        this.activeComponentsByEventName = {};
    }
}

module.exports = new EventSystem();