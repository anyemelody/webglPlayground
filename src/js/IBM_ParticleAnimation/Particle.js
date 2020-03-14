const THREE = require("three");
import { vertexshader, fragmentshader } from "../CustomShader.js";
import { Vector3 } from "three";
import TWEEN from "@tweenjs/tween.js";

class Particle {
  constructor() {
    this.particle;
    this.pos = new THREE.Vector3(0, 0, 0);
    this.scale = new THREE.Vector2(0, 0);
    this.lifespan = 255;
    this.opacity = { alpha: 1 };
  }

  setup(spriteMaterial) {
    this.particle = new THREE.Sprite(spriteMaterial);
    this.particle.position.set(this.pos.x, this.pos.y, this.pos.z);
    this.particle.scale.set(this.scale.x, this.scale.y);
    this.particle.material.opacity = this.opacity.alpha;
  }

  updatePos(pos, animateTime, delayTime) {
    //update pos
    let tween = new TWEEN.Tween(this.pos)
      .to({ x: pos.x, y: pos.y, z: pos.z }, animateTime)
      .delay(delayTime)
      .onUpdate(() => {
        this.particle.position.set(this.pos.x, this.pos.y, this.pos.z);
      })
      .start();
    return tween;
  }

  updateScale(scale, animateTime, delayTime) {
    let tween = new TWEEN.Tween(this.scale)
      .to({ x: scale.x, y: scale.y }, animateTime)
      .delay(delayTime)
      .start()
      .onUpdate(() => {
        this.particle.scale.set(this.scale.x, this.scale.y);
      });
    return tween;
  }

  updatePathInterpolation(posArrayX, posArrayY, animateTime, delayTime) {
    let tween = new TWEEN.Tween(this.pos)
      .to({ x: posArrayX, y: posArrayY, z: 0 }, animateTime)
      .delay(delayTime)
      .start()
      .onUpdate(() => {
        this.particle.position.set(this.pos.x, this.pos.y, this.pos.z);
      })
      .interpolation(TWEEN.Interpolation.Bezier);
    //.easing(TWEEN.Easing.Linear.None)
    return tween;
  }

  updateOpacity(opacity, animateTime, delayTime) {
    let tween = new TWEEN.Tween(this.opacity)
      .to({ alpha: opacity }, animateTime)
      .delay(delayTime)
      .onUpdate(() => {
        this.particle.material.opacity = this.opacity.alpha;
      })
      .start();
    return tween;
  }
}

export default Particle;
