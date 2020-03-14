const THREE = require("three");
const OrbitControls = require("three-orbitcontrols");
import Perlin from "./js/Perlin.js";
const noise = new Perlin();
const Dat = require("dat.gui");
const Stats = require("stats.js");
// let srcImg = require("./assets/ibm.jpg");
// const discImage = require("./assets/dotSprite.png");
import srcImg from "./assets/ibm.jpg";
import discImage from "./assets/dotSprite.png";


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
  pointDepth;
var load = false,
  blow = false;

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
    portraitObject = portrait.setup(
      imgGrey,
      imgR,
      imgG,
      imgB,
      discImage,
      scene,
      pointDepth
    );
  });
}
window.loadImage = loadImage;
// document.getElementById("photo").addEventListener("click", () => {
//   loadImage();
// });
function InitWebCam() {
  // console.log("webcam");
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

document.getElementById("blowAway").addEventListener("click", () => {
  blow = true;
});

init();
animate();

function init() {
  container = document.createElement("div");
  document.body.appendChild(container);

  scene = new THREE.Scene();
  // scene.background = new THREE.Color("rgb(0,0,0)");
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

  loadImage();

  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });
  renderer.setClearColor(0x000000, 0);
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
  if (load) {
    portrait.display(count, imgR, imgG, imgB, imgGrey, pointDepth, 1);
  }
  if (load && blow) {
    portrait.fallDown(count);
  }

  renderer.render(scene, camera);
  count += 0.01;
  stats.begin();
  stats.end();
  // camera.position.z = effectController.cameraZ;
}
