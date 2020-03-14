const THREE = require("three");
var cConvert = require("color-convert");

import { vertexshader, fragmentshader } from "./CustomShader.js";
function MathMap(num, in_min, in_max, out_min, out_max) {
  return ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
}

class CircleWave {
  constructor(
    centerX,
    centerY,
    waveRadius,
    rotateDelta,
    waveIndex,
    pinchNum,
    waveNum,
    pointsNum,
    discImage,
    scene
  ) {
    this.wave = new THREE.Object3D();
    this.centerX = centerX;
    this.centerY = centerY;
    this.waveRadius = waveRadius;
    this.rotateDelta = rotateDelta;
    this.waveIndex = waveIndex;
    this.pinch = pinchNum;
    this.waveNum = waveNum;
    //////points
    this.points = new Float32Array(pointsNum * 3);
    this.originPoints = new Float32Array(pointsNum * 3);
    /////points size
    this.sizes = new Float32Array(pointsNum);
    this.weightMin = 0.07;
    this.weightMax = 0.22;
    this.pointStroke = 0;
    this.pointWeight = 0;
    /////points color
    this.colors = new Float32Array(pointsNum * 3);
    this.hue = 0;
    this.sat = 0;
    this.bright = 0;
    this.colorGap = (327 - 184) / waveNum;
    this.deltaBreath = 0;
    this.fadeGap = pointsNum / 5;

    for (var i = 0; i < pointsNum; i++) {
      this.points[3 * i] =
        this.centerX +
        Math.sin(((2 * Math.PI) / pointsNum) * i + this.rotateDelta) *
          this.waveRadius *
          (1 +
            0.08 *
              Math.cos(
                ((this.pinch * 2 * Math.PI) / pointsNum) * i +
                  this.waveIndex * 0.3
              )) *
          0.4;
      this.points[3 * i + 1] =
        this.centerY +
        Math.cos(((2 * Math.PI) / pointsNum) * i + this.rotateDelta) *
          this.waveRadius *
          (1 +
            0.08 *
              Math.cos(
                ((-this.pinch * 2 * Math.PI) / pointsNum) * i +
                  this.waveIndex * 0.3
              )) *
          0.4;
      this.points[3 * i + 2] = (this.waveIndex - this.waveNum * 0.58) * 0.1;
      this.originPoints[3 * i] =
        this.centerX +
        Math.sin(((2 * Math.PI) / pointsNum) * i + this.rotateDelta) *
          this.waveRadius *
          (1 +
            0.08 *
              Math.cos(
                ((this.pinch * 2 * Math.PI) / pointsNum) * i +
                  this.waveIndex * 0.3
              )) *
          0.4;
      this.originPoints[3 * i + 1] =
        this.centerY +
        Math.cos(((2 * Math.PI) / pointsNum) * i + this.rotateDelta) *
          this.waveRadius *
          (1 +
            0.08 *
              Math.cos(
                ((-this.pinch * 2 * Math.PI) / pointsNum) * i +
                  this.waveIndex * 0.3
              )) *
          0.4;
      this.originPoints[3 * i + 2] =
        (this.waveIndex - this.waveNum * 0.58) * 0.1;
      ///////size
      this.sizes[i] = 0.1;
      //colors
      var c = new THREE.Color();
      c.setHSL(0, 0, 0);
      c.toArray(this.colors, i * 3);
    }

    var geometry = new THREE.BufferGeometry();
    geometry.addAttribute(
      "position",
      new THREE.BufferAttribute(this.points, 3)
    );
    geometry.addAttribute(
      "size",
      new THREE.Float32BufferAttribute(this.sizes, 1)
    );
    geometry.addAttribute(
      "customColor",
      new THREE.Float32BufferAttribute(this.colors, 3)
    );
    var material = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(0xffffff) },
        pointTexture: { value: new THREE.TextureLoader().load(discImage) }
      },
      vertexShader: vertexshader,
      fragmentShader: fragmentshader,

      alphaTest: 0.95
    });
    // var material = new THREE.PointsMaterial( { linewidth: 5, vertexColors: THREE.VertexColors } );

    var circle = new THREE.Points(geometry, material);
    this.wave.add(circle);
    scene.add(this.wave);
  }

  transferWave() {
    var scale = 1 + 0.05 * this.waveIndex; //1+0.06*this.waveIndex;
    this.wave.scale.copy(new THREE.Vector3(scale, scale, scale));
  }

  getThisWaveObject() {
    return this.wave;
  }

  display(
    count,
    pointsNum,
    deltaX,
    deltaY,
    zGap,
    breathSpeed,
    gradientC,
    fadeProgress,
    fadeMode
  ) {
    this.deltaBreath = Math.sin(count * breathSpeed);
    var circle = this.wave.getObjectByName("");

    var positions = circle.children[0].geometry.attributes.position.array;
    var sizes = circle.children[0].geometry.attributes.size.array;
    var colors = circle.children[0].geometry.attributes.customColor.array;
    for (var i = 0; i < pointsNum; i++) {
      positions[3 * i] =
        this.originPoints[3 * i] +
        Math.sin(positions[3 * i] * 3 + deltaX + amplify) *
          this.waveRadius *
          0.05 *
          this.deltaBreath;
      positions[3 * i + 1] =
        this.originPoints[3 * i + 1] +
        Math.cos(positions[3 * i + 1] * 3 + deltaY + amplify) *
          this.waveRadius *
          0.05 *
          this.deltaBreath;
      positions[3 * i + 2] = (this.waveIndex - this.waveNum * 0.58) * zGap;
      //////////////////////////////////
      this.pointStroke = Math.sin(
        count * 0.1 + ((2 * Math.PI) / pointsNum) * i
      );
      this.pointWeight = MathMap(
        this.pointStroke,
        -1,
        1,
        strokeWeight, //this.weightMin
        strokeWeight * 3
      );
      sizes[i] = this.pointWeight;
      //dynamic color
      if (gradientC) {
        var hue = MathMap(this.pointStroke, -1, 1, 184, 327);
      } else {
        // var hue = MathMap(this.pointStroke, -1, 1, 184+this.colorGap*(this.waveIndex), 184+this.colorGap*(this.waveIndex+1));
        var hue = MathMap(
          this.pointStroke,
          -1,
          1,
          327 - this.colorGap * (this.waveIndex + 1),
          327 - this.colorGap * this.waveIndex
        );
      }
      //fade in color
      //linear changes as a unit
      if (fadeMode == 1) {
        //remap the fadeProcess data
        var _fadeProgress = Math.pow(fadeProgress / 10, 4);
        if (i < _fadeProgress) {
          var sat = MathMap(i, 0, _fadeProgress, 100, 0);
          var bright = MathMap(i, 0, _fadeProgress, 100, 20);
        } else {
          var sat = 0;
          var bright = 20;
        }
      }
      //nonlinear changes as a unit
      else if (fadeMode == 2) {
        var _fadeProgress = Math.pow(fadeProgress / 10, 4);
        var nonLinearProgress = _fadeProgress / 5;
        for (var gapIndex = 0; gapIndex < 5; gapIndex++) {
          if (
            i >= this.fadeGap * gapIndex &&
            i < this.fadeGap * (gapIndex + 1)
          ) {
            if (i < nonLinearProgress + gapIndex * this.fadeGap) {
              var sat = MathMap(
                i,
                this.fadeGap * gapIndex,
                nonLinearProgress + this.fadeGap * gapIndex,
                100,
                0
              );
              var bright = MathMap(
                i,
                this.fadeGap * gapIndex,
                nonLinearProgress + this.fadeGap * gapIndex,
                100,
                20
              );
            } else {
              var sat = 0;
              var bright = 20;
            }
          }
        }
      }
      //linear changes in gradient
      else {
        var totalpoints = pointsNum * this.waveNum;
        var pointProcess = MathMap(fadeProgress, 0, 100, 0, totalpoints);
        if (
          pointProcess >= this.waveIndex * pointsNum &&
          pointProcess < (this.waveIndex + 1) * pointsNum
        ) {
          if (i + this.waveIndex * pointsNum < pointProcess) {
            var sat = MathMap(i, 0, pointProcess - pointsNum, 100, 0);
            var bright = MathMap(i, 0, pointProcess - pointsNum, 100, 20);
          } else {
            var sat = 0;
            var bright = 20;
          }
        } else if (pointProcess < this.waveIndex * pointsNum) {
          var sat = 0;
          var bright = 20;
        } else {
          var sat = 100;
          var bright = 100;
        }
      }

      var color = new THREE.Color();
      var rgb = cConvert.hsv.rgb(hue, sat, bright);
      color.setRGB(rgb[0] / 255, rgb[1] / 255, rgb[2] / 255);
      color.toArray(colors, i * 3);
    }

    circle.children[0].geometry.attributes.position.needsUpdate = true;
    circle.children[0].geometry.attributes.size.needsUpdate = true;
    circle.children[0].geometry.attributes.customColor.needsUpdate = true;
  }
}

export default CircleWave;
