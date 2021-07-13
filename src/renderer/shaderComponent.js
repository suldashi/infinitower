const PIXI = require("./pixi");
let shaderText = document.getElementById("shader").innerText;

class ShaderComponent {
    constructor() {
        this.shaderText = shaderText;
        this.uniforms = {
            randomRX: 0,
            randomRY: 0,
            randomGX: 0,
            randomGY: 0,
            randomBX: 0,
            randomBY: 0,
        }
        this.intensity = 3;
        this.shader = new PIXI.Filter(null,shaderText,this.uniforms);
    }

    update() {
        this.uniforms.randomRX = this.intensity * (Math.random()*2-1)/1920;
        this.uniforms.randomRY = this.intensity * (Math.random()*2-1)/1080;
        this.uniforms.randomGX = this.intensity * (Math.random()*2-1)/1920;
        this.uniforms.randomGY = this.intensity * (Math.random()*2-1)/1080;
        this.uniforms.randomBX = this.intensity * (Math.random()*2-1)/1920;
        this.uniforms.randomBY = this.intensity * (Math.random()*2-1)/1080;
    }
}
module.exports = ShaderComponent;