class Scheduler {
    constructor() {
        this.tasks = [];
        this.taskTimeOffset = 0;
        this.reset();
    }

    reset() {
        this.accumulatedTime = 0.001;  //adds a fuzz factor due to lack of precision in floating point addition over time
        this.started = false;
        this.ended = false;
        this.repeating = false;
        this.taskIndex = 0;
    }

    update(deltaInMilliseconds) {
        if(this.started && !this.ended) {
            this.accumulatedTime+=deltaInMilliseconds;
            while(!this.ended && this.accumulatedTime>this.tasks[this.taskIndex].time) {
                let task = this.tasks[this.taskIndex];
                this.taskIndex++;
                if(this.taskIndex===this.tasks.length) {
                    if(this.repeating) {
                        this.taskIndex = 0;
                        this.accumulatedTime-=this.taskTimeOffset;
                    }
                    else {
                        this.ended = true;
                    }
                }
                task.callback();
            }
        }
    }

    addTask(timeInMilliseconds,callback) {
        this.tasks.push({
            time:timeInMilliseconds+this.taskTimeOffset,callback:callback
        });
        this.taskTimeOffset+=timeInMilliseconds;
    }

    start() {
        if(this.tasks.length>0 && !this.started) {
            this.started = true;
            return true;
        }
        return false;
    }

    startAndRepeat() {
        let started = this.start();
        if(started) {
            this.repeating = true;
        }
        return started;
    }

    stop() {
        if(this.started && !this.ended) {
            this.ended = true;
            return true;
        }
        return false;
    }
    
}

module.exports = Scheduler;