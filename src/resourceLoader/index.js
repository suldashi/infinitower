let config = require("../config");
const PIXI = require("../renderer/pixi");

class ResourceLoader {
    constructor() {
        this.sheets = ["wall", "player", "interactive_elements"],
        this.resources = {
            animations:{},
            sheets:{},
        };
    }

    loadImage(url) {
        return new Promise((resolve,reject) => {
            let img = new Image();
            img.onload = () => {
                resolve(img);
            }
            img.src = url;
        });
    }

    addSheet(sheetName) {
        return new Promise(async (resolve,reject) => {
            let jsonData = await fetch(`${config.spriteRoot}/${sheetName}.json`).then(response => response.json());
            let img = await this.loadImage(`${config.spriteRoot}/${sheetName}.png`);
            let sheet = new PIXI.Spritesheet(new PIXI.BaseTexture(img), jsonData);
            this.resources.sheets[sheetName] = sheet;
            sheet.parse(() => {
                for(var i in sheet.animations) {
                    this.resources.animations[i] = sheet.animations[i];
                }
                for(var i in sheet.textures) {
                    let textureName = this.removeFileExtension(i);
                    this.resources.animations[textureName] = [sheet.textures[i]];
                }
                resolve(this.resources.sheets[sheetName]);
            });
        });
    }
    
    getResources() {
        return this.resources;
    }

    async loadAllResources() {
        await this.loadAllSheets();
        return this.getResources();
    }

    loadAllSheets() {
        return Promise.all(this.sheets.map(el => this.addSheet(el)));
    }

    removeFileExtension(filename){
        return filename.substring(0, filename.lastIndexOf('.')) || filename;
    }

}

module.exports = ResourceLoader;