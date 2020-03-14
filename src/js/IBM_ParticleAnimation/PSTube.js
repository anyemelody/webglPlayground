const THREE = require("three");
import { Vector3, Vector2 } from "three";
import TWEEN from "@tweenjs/tween.js";
const discImage0 = require("../../assets/dotSprite.png");
const discImage1 = require("../../assets/emoji.png");
const discImage2 = require("../../assets/sprite.png");
const spriteMap0 = new THREE.TextureLoader().load(discImage0);
const spriteMap1 = new THREE.TextureLoader().load(discImage1);
const spriteMap2 = new THREE.TextureLoader().load(discImage2);
import ParticleSystem from "./ParticleSystem";
import Particle from "./Particle.js";

class PSTube extends ParticleSystem {
  constructor(scene, color, randomOpacity, map, scale) {
    super(scene, color, randomOpacity, map, scale);
    this.fadeOut = false;
  }

  setupTube() {
    //draw 50 circles in total
    for (let i = 0; i < 100; i++) {
      if (this.map == 0) {
        this.spriteMap = spriteMap0;
      } else if (this.map == 1) {
        this.spriteMap = spriteMap1;
      } else if (this.map == 2) {
        this.spriteMap = spriteMap2;
      }
      let spriteMaterial = new THREE.SpriteMaterial({
        map: this.spriteMap,
        color: this.color
      });
      //for each circle there will be 35 particles
      for (let j = 0; j < 35; j++) {
        let particle = new Particle();
        let posX = Math.cos(((2 * Math.PI) / 35) * j) * 12;
        let posY = Math.sin(((2 * Math.PI) / 35) * j) * 12;
        particle.pos = new THREE.Vector3(posX, posY, 0);
        particle.scale = new Vector2(0.5, 0.5).addScalar(this.scale);
        if (this.randomOpacity) {
          particle.opacity.alpha = Math.random();
        }
        particle.setup(spriteMaterial);
        this.psArray.push(particle);
        this.ps.add(particle.particle);
        this.psNum++;
      }
    }
    this.scene.add(this.ps);
  }

  updateTube() {
    this.tubeStage1();
    setTimeout(this.tubeStage2.bind(this), 1600);
  }
  //////////tube expand and scale///////////////
  tubeStage1() {
    for (let i = 0; i < 100; i++) {
      //set the z postion for each circle
      let posZ = i * i * 0.01;
      let scale = new Vector2(i * 0.002, i * 0.002);
      for (let j = 0; j < 35; j++) {
        let posX = Math.cos(((2 * Math.PI) / 35) * j) * this.tubeRadius;
        let posY = Math.sin(((2 * Math.PI) / 35) * j) * this.tubeRadius;
        let pos = new THREE.Vector3(posX, posY, posZ);
        this.psArray[35 * i + j].updatePos(pos, 2000, 0);
        this.psArray[35 * i + j].updateScale(scale, 2000, 0);
      }
    }
  }
  ///////////tube move on z axis and fadeout ////////////
  tubeStage2() {
    ////////fade out particles circle by circles///////////////
    for (let i = 99; i > 0; i--) {
      for (let j = 0; j < 35; j++) {
        /////////////fade the tube to 0.3, then fade out totally/////////////
        this.psArray[35 * i + j]
          .updateOpacity(0.3, 500, (100 - i) * 50)
          .onComplete(() => {
            this.psArray[35 * i + j].updateOpacity(0, 200, i * 100);
          });
      }
    }

    ////////tube move on the z axis///////////
    let psPos = this.ps.position;
    let tween = new TWEEN.Tween(psPos)
      .to({ x: psPos.x, y: psPos.y, z: 50 }, 10000)
      .start()
      .onUpdate(() => {
        this.ps.position.set(psPos.x, psPos.y, psPos.z);
      })
      .onComplete(() => {
        this.fadeOut = true;
      });

    return tween;
  }
}

export default PSTube;
