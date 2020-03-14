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

class PSCircleLine extends ParticleSystem {
  constructor(scene, color, randomOpacity, map, scale) {
    super(scene, color, randomOpacity, map, scale);
  }

  ////////////////the second pattern//////////////////
  setUpCircleLine(specialDotsPos) {
    for (let i = 0; i < 36; i++) {
      let particle = new Particle();
      this.psArray.push(particle);
    }

    this.psArray[0].pos = specialDotsPos[0];
    this.psArray[1].pos = specialDotsPos[1];
    this.psArray[2].pos = specialDotsPos[2];
    this.psArray[3].pos = specialDotsPos[3];
    this.psArray[4].pos = specialDotsPos[4];
    this.psArray[5].pos = specialDotsPos[5];
    this.psArray[6].pos = specialDotsPos[6];
    this.psArray[7].pos = specialDotsPos[7];
    this.psArray[8].pos = specialDotsPos[8];
    this.psArray[35].pos = specialDotsPos[9];
    for (let i = 0; i < 36; i++) {
      if (i < 9 || i == 35) {
        this.psArray[i].scale = new Vector2(1, 1).addScalar(this.scale);
        this.time[i] = 0;
        this.finish[i] = false;
      }
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
      if (this.randomOpacity) {
        this.psArray[i].opacity.alpha = Math.random() + 0.1;
      }

      this.psArray[i].setup(spriteMaterial);
      this.ps.add(this.psArray[i].particle);
      this.psNum++;
    }
    this.scene.add(this.ps);
  }
  ////////////////update the circleLine animation////////////
  updateCircleLine() {
    this.circleLineStage1();
    //setTimeout(this.circleLineStage2.bind(this), 200);
    eventBus.on('circle-complete', this.circleLineStage2.bind(this));
  }
  ////////////the ten particles scale down/////////////
  circleLineStage1() {
    var targetVector = new Vector2(0.5, 0.5);
    for (let i = 0; i < 9; i++) {
      this.psArray[i].updateScale(targetVector, 200, 0).onComplete(() => {
        this.scene.remove(targetVector);
      });
    }
    this.psArray[35].updateScale(targetVector, 200, 0).onComplete(() => {
      this.scene.remove(targetVector);
      eventBus.emit('circle-complete');
    });
  }
  //////////the nine particles start moving to form a line///////////
  circleLineStage2() {
    let posArrayX0 = [4 * this.gap, 8 * this.gap, 4 * this.gap];
    let posArrayY0 = [0, 0, 0];
    this.psArray[0]
      .updatePathInterpolation(posArrayX0, posArrayY0, 1000, 0)
      .onComplete(() => {
        this.circleLineStage3();
      });
    let posArrayX1 = [4 * this.gap, 0 * this.gap, 3.2 * this.gap];
    let posArrayY1 = [4 * this.gap, 0.5 * this.gap, 0];
    this.psArray[1]
      .updatePathInterpolation(posArrayX1, posArrayY1, 1200, 0)
      .onComplete(() => {
        this.finish[1] = true;
      });
    let posArrayX2 = [-4 * this.gap, 0.5 * this.gap, 3.5 * this.gap];
    let posArrayY2 = [-4 * this.gap, -0.5 * this.gap, 0];
    this.psArray[2]
      .updatePathInterpolation(posArrayX2, posArrayY2, 1500, 0)
      .onComplete(() => {
        this.finish[2] = true;
      });
    let posArrayX3 = [2 * this.gap, -2.2 * this.gap, 3 * this.gap, 10];
    let posArrayY3 = [2 * this.gap, 0.5 * this.gap, 0, 0];
    this.psArray[3]
      .updatePathInterpolation(posArrayX3, posArrayY3, 1700, 0)
      .onComplete(() => {
        this.finish[3] = true;
      });
    let posArrayX4 = [2 * this.gap, -2 * this.gap, 2.7 * this.gap, 9];
    let posArrayY4 = [-2 * this.gap, -0.5 * this.gap, 0, 0];
    this.psArray[4]
      .updatePathInterpolation(posArrayX4, posArrayY4, 2000, 0)
      .onComplete(() => {
        this.finish[4] = true;
      });
    let posArrayX5 = [0 * this.gap, -5 * this.gap, 1 * this.gap, 8];
    let posArrayY5 = [4 * this.gap, 0.5 * this.gap, 0, 0];
    this.psArray[5]
      .updatePathInterpolation(posArrayX5, posArrayY5, 2200, 0)
      .onComplete(() => {
        this.finish[5] = true;
      });
    let posArrayX6 = [0 * this.gap, -4 * this.gap, 0.5 * this.gap, 7];
    let posArrayY6 = [-4 * this.gap, -0.5 * this.gap, 0 * this.gap, 0];
    this.psArray[6]
      .updatePathInterpolation(posArrayX6, posArrayY6, 2400, 0)
      .onComplete(() => {
        this.finish[6] = true;
      });
    let posArrayX7 = [-4 * this.gap, -7 * this.gap, -1.2 * this.gap, 6];
    let posArrayY7 = [4 * this.gap, 0.5 * this.gap, 0 * this.gap, 0];
    this.psArray[7]
      .updatePathInterpolation(posArrayX7, posArrayY7, 2600, 0)
      .onComplete(() => {
        this.finish[7] = true;
      });
    let posArrayX8 = [-4 * this.gap, -8 * this.gap, -2 * this.gap, 5];
    let posArrayY8 = [-4 * this.gap, -1 * this.gap, -0.5 * this.gap, 0];
    this.psArray[8]
      .updatePathInterpolation(posArrayX8, posArrayY8, 2800, 0)
      .onComplete(() => {
        this.finish[8] = true;
      });
    let posArrayX35 = [
      0 * this.gap,
      -4 * this.gap,
      -9 * this.gap,
      -12 * this.gap,
      -5 * this.gap,
      0
    ];
    let posArrayY35 = [
      0 * this.gap,
      2 * this.gap,
      4 * this.gap,
      2 * this.gap,
      -4 * this.gap,
      0
    ];
    this.psArray[35]
      .updatePathInterpolation(posArrayX35, posArrayY35, 5000, 0)
      .onComplete(() => {
        this.theOne = this.psArray[35];
        this.psArray[35].updateScale(new Vector2(0, 0), 6000, 6000);
        document.addEventListener(
          "mousemove",
          this.followMouseMove.bind(this),
          false
        );
      });
    let targetVector = new Vector2(2, 2);
    this.psArray[35].updateScale(targetVector, 2000, 3000).onComplete(() => {
      this.scene.remove(targetVector);
    });
  }
  ////////make the special one follow the mouse
  followMouseMove(event) {
    let mouse = new THREE.Vector3(0, 0, 0);
    mouse.x = event.clientX / window.innerWidth - 0.5;
    mouse.y = -(event.clientY / window.innerHeight) + 0.5;
    this.theOne.particle.position.add(mouse);
  }
  ////////////////the third pattern: the nine form from line to circle////////////////
  circleLineStage3() {
    ///the first particle start do circle////////
    this.target.x = Math.cos((this.time[0] * Math.PI * 4) / 100) * 12;
    this.target.y = Math.sin((this.time[0] * Math.PI * 4) / 100) * 12;
    this.psArray[0].particle.position.lerp(
      new THREE.Vector3(this.target.x, this.target.y, 0),
      0.3 + this.time[0] * 0.007
    );
    this.time[0] += 0.25;
    /////the pariticles from 1-8 ////////////////////////
    if (this.time[0] < 100) {
      for (let k = 1; k < 9; k++) {
        if (this.finish[k] == true) {
          this.target.x = Math.cos((this.time[k] * Math.PI * 4) / 100) * 12;
          this.target.y = Math.sin((this.time[k] * Math.PI * 4) / 100) * 12;
          let averagePosX, averagePosY;
          this.time[k] += 0.25;
          if (this.time[0] < 50) {
            averagePosX = this.target.x;
            averagePosY = this.target.y;
            this.psArray[k].particle.position.lerp(
              new Vector3(averagePosX, averagePosY, 0),
              0.3
            );
          } else {
            let deltaX =
              Math.cos(
                (this.time[0] * Math.PI * 4) / 100 +
                  ((2 * Math.PI) / this.particleGap) * -k
              ) * 12;
            let deltaY =
              Math.sin(
                (this.time[0] * Math.PI * 4) / 100 +
                  ((2 * Math.PI) / this.particleGap) * -k
              ) * 12;
            ////update particle gap/////////
            if (this.particleGap < 35) this.particleGap += 0.02;
            else this.particleGap = 35;
            ////////calculate average pos between current and target pos////
            averagePosX =
              this.target.x * (1 - this.weight) + deltaX * this.weight;
            averagePosY =
              this.target.y * (1 - this.weight) + deltaY * this.weight;
            ////update particle target position weight/////////
            if (this.weight < 1) this.weight += 0.002;
            else this.weight == 1;

            this.psArray[k].particle.position.lerp(
              new Vector3(averagePosX, averagePosY, 0),
              0.3 + (this.time[0] - 50) * 0.01
            );
          }
        }
      }
      /////start show the rest particles/////////
      if (this.time[0] > 50) {
        this.circleLineShowRestParticles();
      }
      requestAnimationFrame(() => {
        this.circleLineStage3();
      });
    } else {//why does this never gets executed?
      cancelAnimationFrame(() => {
        this.circleLineStage3();        
      });
      this.time[0] = 0;
      ///////////fade out all the ps////////
      var targetVector = new Vector2(0, 0);
      for (let i = 0; i < 35; i++) {
        this.psArray[i].updateScale(targetVector, 100, 0).onComplete(() => {
          this.scene.remove(targetVector);
          this.scene.remove(this.psArray[i]);

          if (i == 34) eventBus.emit('circle-animate-complete');

        });
      }
    }
  }
  ////////////////the forth pattern: the rest points appear////////////////
  circleLineShowRestParticles() {
    ////set the 9-35 particles postions/////////
    for (let i = 9; i < 35; i++) {
      let posX =
        Math.cos(
          (this.time[0] * Math.PI * 4) / 100 + ((2 * Math.PI) / 35) * (i - 8)
        ) * 12;
      let posY =
        Math.sin(
          (this.time[0] * Math.PI * 4) / 100 + ((2 * Math.PI) / 35) * (i - 8)
        ) * 12;
      this.psArray[i].particle.position.set(posX, posY, 0);
    }
    ////show the rest 9-35 particles one by one
    if (this.count % 5 == 0) {
      let n = this.count / 5;
      if (n < 26) {
        this.psArray[9 + n].particle.scale.set(0.5, 0.5);
      }
    }
    this.count += 1;
  }
}

export default PSCircleLine;
