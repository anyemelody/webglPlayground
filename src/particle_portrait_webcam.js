const THREE = require("three");
const OrbitControls = require("three-orbitcontrols");
import Perlin from "./js/Perlin.js";
const noise = new Perlin();
const Dat = require("dat.gui");
const Stats = require("stats.js");
let srcImg = require("./assets/image.png");
const discImage = require("./assets/dotSprite.svg");
import PointsPortrait from "./js/PointsPortrait.js";
import "./js/dropHandler";

var container, controls, gui, stats;
var camera,
  scene,
  renderer,
  canvas,
  imgGrey = [],
  imgR = [],
  imgB = [],
  imgG = [];

var pointNum,
  portrait,
  portraitObject = new THREE.Object3D();
var count = 0,
  colorUpdateCount = 0,
  pointDepth;
var load = false,
  blow = false;
const delayTime = 10;

var effectController = {
  cameraZ: 1, //the spaceing on z axis
  OrbitControl: true,
  depth: 10
};

function loadImage(image) {
  var loader = new THREE.TextureLoader();
  canvas = document.getElementById("drawing-canvas");
  pointNum = canvas.width * canvas.height;
  imgGrey = new Float32Array(pointNum);
  imgR = new Float32Array(pointNum);
  imgG = new Float32Array(pointNum);
  imgB = new Float32Array(pointNum);

  if (image) srcImg = image;
  loader.load(srcImg, function(texture) {
    canvas.height = canvas.width * (texture.image.height / texture.image.width);
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(texture.image, 0, 0, canvas.width, canvas.height);
    var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < imgData.data.length; i += 4) {
      imgR[i / 4] = imgData.data[i];
      imgG[i / 4] = imgData.data[i + 1];
      imgB[i / 4] = imgData.data[i + 2];
      var grey =
        (imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) / 3;
      imgGrey[i / 4] = grey;
      // imgData.data[i] = grey;
      // imgData.data[i+1] = grey;
      // imgData.data[i+2] = grey;
      // imgData.data[i+3] = 255;
    }
    load = true;
    portrait = new PointsPortrait(pointNum, canvas);
    portrait.setup(imgGrey, discImage, scene);
    // resetParticles();
  });
}
window.loadImage = loadImage;

function InitWebCam() {
  const video = document.getElementById("video");
  canvas = document.getElementById("drawing-canvas");
  var constraints = { audio: false, video: true };
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function(mediaStream) {
      video.srcObject = mediaStream;
      video.play();
    })
    .catch(function(err) {
      console.log("yikes, and err!" + err.message);
    });
}
window.addEventListener("load", InitWebCam);

// Trigger photo take
let live = false;

document.getElementById("live").addEventListener("click", function(event) {
  live = true;
  if (live) this.innerHTML = "Go Still";
  else this.innerHTML = "Go Live";
});
document.getElementById("snap").addEventListener("click", event => {
  load = false;
  live = false;
  colorUpdateCount = 0;
  resetPortrait();
});
document.getElementById("blowAway").addEventListener("click", () => {
  blow = true;
});

function resetPortrait() {
  if (load) return;
  scene.remove(portraitObject);
  // let ctx = canvas.getContext("2d");
  canvas.height = canvas.width * (video.videoHeight / video.videoWidth);
  // Elements for taking the snapshot
  pointNum = canvas.width * canvas.height;
  imgGrey = new Float32Array(pointNum);
  imgR = new Float32Array(pointNum);
  imgG = new Float32Array(pointNum);
  imgB = new Float32Array(pointNum);
  updatePixelColor();
  portrait = new PointsPortrait(pointNum, canvas);
  portraitObject = portrait.setup(
    imgGrey,
    imgR,
    imgG,
    imgB,
    discImage,
    scene,
    pointDepth
  );
  load = true;
}

function updatePixelColor() {
  let ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  for (var i = 0; i < imgData.data.length; i += 4) {
    imgR[i / 4] = imgData.data[i];
    imgG[i / 4] = imgData.data[i + 1];
    imgB[i / 4] = imgData.data[i + 2];
    var grey =
      (imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) / 3;
    if (colorUpdateCount == 0) imgGrey[i / 4] = grey;
  }

  if (colorUpdateCount < delayTime) {
    colorUpdateCount++;
  } else {
    colorUpdateCount = 0;
  }
}

init();
animate();

function init() {
  container = document.createElement("div");
  document.body.appendChild(container);

  scene = new THREE.Scene();
  scene.background = new THREE.Color("rgb(0,0,0)");
  // scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);
  var axesHelper = new THREE.AxesHelper(10);
  // scene.add(axesHelper);

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    10000
  );
  camera.position.set(0, 0, 90);
  scene.add(camera);
 

  stats = new Stats();
  stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild(stats.dom);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);

  gui = new Dat.GUI();
  // gui.add(effectController, "cameraZ", 1, 150, 1).onChange();
  gui.add(effectController, "OrbitControl", true).onChange();
  gui.add(effectController, "depth", 0, 50, 1).onChange();
}

function animate() {
  controls.enabled = effectController.OrbitControl;
  pointDepth = effectController.depth;
  requestAnimationFrame(animate);
  render();
  if (blow) {
    setTimeout(() => {
      blow = false;
      load = false;
      window.location.reload();
    }, 10000);
  }
}

function render() {
  controls.update();
  if (live) resetPortrait();
  if (load) {
    if (live) updatePixelColor();
    portrait.display(count, imgR, imgG, imgB, imgGrey, pointDepth, delayTime);
  }
  if (load && blow) {
    portrait.fallDown(count);
  }

  renderer.render(scene, camera);
  count += 0.01;
  stats.begin();
  stats.end();
}
