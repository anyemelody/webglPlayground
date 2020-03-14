const THREE = require("three");

class PointsPortrait {
  constructor(pointNum, canvas) {
    this.points;
    this.portrait = new THREE.Object3D();
    this.pointNum = pointNum;
    this.pointPosition = new Float32Array(pointNum * 3);
    this.originPointPosition = new Float32Array(pointNum * 3);
    this.pointSize = new Float32Array(pointNum);
    this.pointOriginSize = new Float32Array(pointNum);
    this.pointColor = new Float32Array(pointNum * 3);
    this.pointUpdateGrey = new Float32Array(pointNum);
    // this.pointUpdateR = new Float32Array(pointNum);
    // this.pointUpdateG = new Float32Array(pointNum);
    // this.pointUpdateB = new Float32Array(pointNum);
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;
    this.velY = new Float32Array(pointNum);
  }

  setup(imgGrey, imgR, imgG, imgB, discImage, scene, pointDepth) {
    for (var i = 0; i < this.pointNum; i++) {
      var x = parseInt(i % this.canvasWidth);
      var y = parseInt(i / this.canvasWidth);
      this.pointPosition[3 * i] = x;
      this.pointPosition[3 * i + 1] = -y;
      this.pointPosition[3 * i + 2] = MathMap(
        imgGrey[i],
        0,
        255,
        pointDepth * -1,
        pointDepth
      );
      this.originPointPosition[i] = this.pointPosition[i];
      //size
      this.pointSize[i] = Math.random() * 5;
      this.pointOriginSize[i] = this.pointSize[i];
      //colors
      var c = new THREE.Color(255, 255, 255);
      // c.setRGB(imgR[i], imgG[i], imgB[i]);
      c.setRGB(imgGrey[i], imgGrey[i], imgGrey[i]);
      this.pointUpdateGrey[i] = imgGrey[i];
      // this.pointUpdateR[i] = imgR[i];
      // this.pointUpdateG[i] = imgG[i];
      // this.pointUpdateB[i] = imgB[i];
      c.toArray(this.pointColor, i * 3);

      // if (imgGrey[i] < 1) {
      //   this.pointPosition = this.pointPosition.splice(3*i, 3);
      //   this.pointSize = this.pointSize.prototype.splice(i, 1);
      //   this.pointOriginSize.prototype.splice(i, 3);
      //   this.pointColor.prototype.splice(i, 1);
      // }
      this.velY[i] = Math.random() * -9.8;
    }

    var geometry = new THREE.BufferGeometry();
    geometry.addAttribute(
      "position",
      new THREE.BufferAttribute(this.pointPosition, 3)
    );
    geometry.addAttribute("size", new THREE.BufferAttribute(this.pointSize, 1));
    geometry.addAttribute(
      "customColor",
      new THREE.BufferAttribute(this.pointColor, 3)
    );
    var material = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(0x010101) },
        pointTexture: { value: new THREE.TextureLoader().load(discImage) }
      },
      vertexShader: document.getElementById("vertexshader").textContent,
      fragmentShader: document.getElementById("fragmentshader").textContent,

      alphaTest: 0.9
    });
    this.points = new THREE.Points(geometry, material);
    this.portrait.add(this.points);
    this.portrait.position.copy(
      new THREE.Vector3(-this.canvasWidth / 2, this.canvasHeight / 2, 0)
    );
    scene.add(this.portrait);
    return this.portrait;
  }

  display(count, imgR, imgG, imgB, imgGrey, pointDepth, delayTime) {
    var positions = this.points.geometry.attributes.position.array;
    var sizes = this.points.geometry.attributes.size.array;
    var colors = this.points.geometry.attributes.customColor.array;
    const delay = 1 / delayTime;

    for (var i = 0; i < this.pointNum; i++) {
      var x = parseInt(i % this.canvasWidth);
      var y = parseInt(i / this.canvasWidth);
      positions[3 * i] =
        x + Math.sin(count * x * 0.04 + this.pointOriginSize[i]) * 2;
      positions[3 * i + 1] =
        -y + Math.cos(count * y * 0.04 + this.pointOriginSize[i]) * 2; //noise.getValue((count*0.5-sizes[i]))  //
      this.pointUpdateGrey[i] =
        (1 - delay) * this.pointUpdateGrey[i] + delay * imgGrey[i];
      positions[3 * i + 2] = MathMap(
        this.pointUpdateGrey[i],
        0,
        255,
        pointDepth * -1,
        pointDepth
      );
      //size
      sizes[i] =
        this.pointOriginSize[i] +
        Math.sin(
          count * this.pointOriginSize[i] + this.pointOriginSize[i] * 0.1
        );
      //colors
      var c = new THREE.Color(255, 255, 255);
      // this.pointUpdateR[i] = (1 - delay) * this.pointUpdateR[i] + delay * imgR[i];
      // this.pointUpdateG[i] = (1 - delay) * this.pointUpdateG[i] + delay * imgG[i];
      // this.pointUpdateB[i] = (1 - delay) * this.pointUpdateB[i] + delay * imgB[i];
      c.setRGB(imgR[i], imgG[i], imgB[i]);
      //c.setRGB(imgGrey[i], imgGrey[i], imgGrey[i]);
      c.toArray(colors, i * 3);
    }
    this.points.geometry.attributes.position.needsUpdate = true;
    this.points.geometry.attributes.size.needsUpdate = true;
    this.points.geometry.attributes.customColor.needsUpdate = true;
  }

  fallDown(count) {
    var positions = this.points.geometry.attributes.position.array;
    for (var i = 0; i < this.pointNum; i++) {
      this.velY[i] *= 1.02;
      positions[3 * i + 1] += this.velY[i]; //noise.getValue((count*0.5-sizes[i]))  //
    }
    this.points.geometry.attributes.position.needsUpdate = true;
  }
}

export default PointsPortrait;

function MathMap(num, in_min, in_max, out_min, out_max) {
  return ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
}
