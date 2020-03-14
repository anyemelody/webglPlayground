const THREE = require("three");
import { Vector3, Vector2 } from "three";
import Particle from "./Particle.js";
import TWEEN from "@tweenjs/tween.js";
const discImage0 = require("../../assets/dotSprite.png");
const discImage1 = require("../../assets/emoji.png");
const discImage2 = require("../../assets/sprite.png");
const spriteMap0 = new THREE.TextureLoader().load(discImage0);
const spriteMap1 = new THREE.TextureLoader().load(discImage1);
const spriteMap2 = new THREE.TextureLoader().load(discImage2);
// const spriteMaterial = new THREE.SpriteMaterial({
//   map: spriteMap,
//   color: 0xffffff
// });

class ParticleSystem {
  constructor(scene, color, randomOpacity, map, scale) {
    this.psArray = [];
    this.psNum = 0;
    this.ps = new THREE.Object3D();
    this.gap = 6;
    this.scene = scene;
    this.color = color;
    this.randomOpacity = randomOpacity;
    this.map = map;
    this.spriteMap = spriteMap0;
    this.scale = scale;
    this.target = new Vector3(0, 0, 0);
    this.count = 0;
    this.time = [];
    this.finish = [];
    this.weight = 0;
    this.particleGap = 10;
    this.tubeRadius = 4;
    this.zGap = 1;
    this.theOne;    
  }

  controllerUpdateColor(color, randomOpacity, map) {
    for (let i = 0; i < this.psArray.length; i++) {
      this.psArray[i].particle.material.color.set(color);
      if (map == 0) {
        this.spriteMap = spriteMap0;
      } else if (map == 1) {
        this.spriteMap = spriteMap1;
      } else {
        this.spriteMap = spriteMap2;
      }
      this.psArray[i].particle.material.map = this.spriteMap;
      if (randomOpacity) {
        this.psArray[i].particle.material.opacity = Math.random() + 0.1;
      } else {
        this.psArray[i].particle.material.opacity = 1;
      }
    }
  }

  controllerUpdateSize(size) {
    for (let i = 0; i < this.psArray.length; i++) {
      if (
        this.psArray[i].particle.scale.x < 2 &&
        this.psArray[i].particle.scale.x > 0
      ) {
        this.psArray[i].particle.scale.addScalar(size);
      }
    }
  }
}

export default ParticleSystem;
