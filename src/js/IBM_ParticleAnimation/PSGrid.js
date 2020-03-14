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
const eventBus = require("js-event-bus")();

class PSGrid extends ParticleSystem {
  constructor(scene, color, randomOpacity, map, scale) {
    super(scene, color, randomOpacity, map, scale);
    this.specialDotsPos = [];
  }

  createAndSetupParticles(x, y) {
    if (this.map == 0) {
      this.spriteMap = spriteMap0;
    } else if (this.map == 1) {
      this.spriteMap = spriteMap1;
    } else if (this.map == 2) {
      this.spriteMap = spriteMap2;
    }
    const spriteMaterial = new THREE.SpriteMaterial({
      map: this.spriteMap,
      color: this.color
    });

    let particle = new Particle();
    particle.pos = new THREE.Vector3(x * this.gap, y * this.gap, 0);
    particle.scale.addScalar(this.scale);
    if (this.randomOpacity) {
      particle.opacity.alpha = Math.random() + 0.1;
    }
    particle.setup(spriteMaterial);
    this.psArray.push(particle);
    this.ps.add(particle.particle);
    this.psNum++;
  }

  //////////////////the first pattern//////////////////
  setUpGrid() {
    for (let j = 4; j >= -4; j--) {
      if (j % 2 == 0) {
        for (var i = -4; i <= 4; i++) {
          this.createAndSetupParticles(i, j);
        }
      } else {
        for (var i = 4; i >= -4; i--) {
          this.createAndSetupParticles(i, j);
        }
      }
    }
    this.scene.add(this.ps);
  }
  ////////////////update the grid animation////////////
  updateGrid() {
    this.gridStage1();
    //setTimeout(this.gridStage2.bind(this), 4200);
    eventBus.on('grid-complete', this.gridStage2.bind(this));
  }



  ////////////////grid particles show one by one////////////
  gridStage1() {
    //////show the grid particles one by one//////////////
    const startVal = 30;
    const endVal = 5050;
    let speed = startVal;
    const percAccel = 0.02;
    
    var baseSpeed = 50; 
    for (let i = 0; i < this.psArray.length; i++) {
      var targetVector = new Vector2(1, 1);
      var incrementSpeed = baseSpeed * i - baseSpeed 
      this.psArray[i].updateScale(targetVector, 100,  (speed += (endVal - speed) * percAccel)).onComplete(() => {
        this.scene.remove(targetVector);
        if (i == this.psArray.length-1){
          eventBus.emit('grid-complete');
        }
      });
    }
  }
  //////////////grid particles have the ripple effect to scale up and down////////
  gridStage2() {
    for (let i = 0; i < this.psArray.length; i++) {
      /////////pick up the special ten dots////////////
      if (
        i == 0 ||
        i == 4 ||
        i == 8 ||
        i == 28 ||
        i == 40 ||
        i == 44 ||
        i == 60 ||
        i == 72 ||
        i == 76 ||
        i == 80
      ) {
        ////////save the special dots positions//////////
        this.specialDotsPos.push(this.psArray[i].particle.position);

        ////////fade out and delete the ten dots in the grid/////////////
        var targetVector = new Vector2(0, 0);
        this.psArray[i].updateScale(targetVector, 50, 0).onComplete(() => {
          this.scene.remove(targetVector);
          this.scene.remove(this.psArray[i]);
        });
      } else {
        ////////////from right to left column///////////////
        for (let k = 4; k >= -4; k--) {
          setTimeout(() => {
            if (this.psArray[i].pos.x == k * this.gap) {
              let delayTime = 0;
              if (k % 4 != 0) {
                delayTime = Math.abs(this.psArray[i].pos.y) * this.gap;
              } else {
                delayTime = (4 - Math.abs(this.psArray[i].pos.y)) * this.gap;
              }
              //make the particles fade out to 0 after scale up and dowm with random delay time
              var chainB = this.psArray[i].updateScale(
                new Vector2(0, 0),
                200,
                0
              );
              //particles start to scale up and down with random delay time
              let targetVector = new Vector2(2, 2);
              this.psArray[i]
                .updateScale(targetVector, 300, delayTime)
                .repeat(1)
                .yoyo(true)
                .chain(chainB)
                .onComplete(() => {
                  this.scene.remove(targetVector);
                  this.scene.remove(this.psArray[i]);
                });

              //update the pos
              var updatePos = new THREE.Vector3(4, 0, 0);
              updatePos.add(this.psArray[i].pos);
              this.psArray[i]
                .updatePos(updatePos, 850, 0)
                .easing(TWEEN.Easing.Sinusoidal.InOut)
                .onComplete(() => {
                  this.scene.remove(updatePos);
                });
            }
          }, (4 - k) * 50);
        }
      }
    }
  }
}

export default PSGrid;
