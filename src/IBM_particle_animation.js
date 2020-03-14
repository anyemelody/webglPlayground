const THREE = require("three");
const OrbitControls = require("three-orbitcontrols");
const Dat = require("dat.gui");
const Stats = require("stats.js");
const eventBus = require("js-event-bus")();




 
 
 //eventBus.on('grid-complete', callbackForMyEvent);
 
  //window.eventBus.emit('my-event');


//import ParticleSystem from "./js/IBM_ParticleAnimation/ParticleSystem.js";
import PSGrid from "./js/IBM_ParticleAnimation/PSGrid.js";
import PSCircleLine from "./js/IBM_ParticleAnimation/PSCircleLine.js";
import PSTube from "./js/IBM_ParticleAnimation/PSTube.js";
import TWEEN from "@tweenjs/tween.js";

let container, controls, stats, gui;
let camera, scene, renderer;
let ps1,
  ps2,
  ps3,
  psGroup = [];
let psObject = new THREE.Object3D();

const controller = {
  color: 0xffffff,
  addSize: 0,
  OrbitControl: false,
  randomOpacity: false,
  spriteMap: 0,
  cameraFOV: 75
};

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
  camera.position.set(0, 0, 60);
  scene.add(camera);


  stats = new Stats();
  stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild(stats.dom);

  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);
 
  controls = new OrbitControls(camera, renderer.domElement);

  setupPS1();
  scene.add(psObject);
  ///////////setup control panel/////////////
  gui = new Dat.GUI();
  gui
    .addColor(controller, "color")
    .listen()
    .onChange(() => {
      for (let i = 0; i < psGroup.length; i++) {
        psGroup[i].controllerUpdateColor(
          controller.color,
          controller.randomOpacity,
          controller.spriteMap
        );
      }
    });
  gui.add(controller, "randomOpacity", false).onChange(() => {
    for (let i = 0; i < psGroup.length; i++) {
      psGroup[i].controllerUpdateColor(
        controller.color,
        controller.randomOpacity,
        controller.spriteMap
      );
    }
  });
  gui.add(controller, "spriteMap", 0, 2, 1).onChange(() => {
    for (let i = 0; i < psGroup.length; i++) {
      psGroup[i].controllerUpdateColor(
        controller.color,
        controller.randomOpacity,
        controller.spriteMap
      );
    }
  });

  // gui.add(controller, "addSize", -0.1, 0.1, 0.1).onChange(() => {
  //   for (let i = 0; i < psGroup.length; i++) {
  //     psGroup[i].controllerUpdateSize(controller.addSize);
  //   }
  // });
  gui.add(controller, "cameraFOV", 50, 80, 1).onChange(() => {
    camera.fov = controller.cameraFOV;
    camera.updateProjectionMatrix();
  });
  gui.add(controller, "OrbitControl", true).onChange();
  //////////////////////////////////
  document.addEventListener("mousemove", onMouseMove, false);
}

function setupPS1() {
  //define a new PS
  ps1 = new PSGrid(
    scene,
    controller.color,
    controller.randomOpacity,
    controller.spriteMap,
    controller.size
  );
  ps1.setUpGrid();
  ps1.updateGrid();
  psGroup.push(ps1);
  psObject.add(ps1.ps);
  //setTimeout(setupPS2, 4200);
  eventBus.on('grid-complete', setupPS2);
}

////define the ps2
function setupPS2() {
  ps2 = new PSCircleLine(
    scene,
    controller.color,
    controller.randomOpacity,
    controller.spriteMap,
    controller.size
  );
  ps2.setUpCircleLine(ps1.specialDotsPos);
  ps2.updateCircleLine();
  psGroup.push(ps2);
  psObject.add(ps2.ps);
  //setTimeout(setupPS3, 7800);
  eventBus.on('circle-animate-complete', setupPS3);
}

function setupPS3() {
  console.log('circle animation finished');
  ps3 = new PSTube(
    scene,
    controller.color,
    controller.randomOpacity,
    controller.spriteMap,
    controller.size
  );
  ps3.setupTube();
  ps3.updateTube();
  psGroup.push(ps3);
  psObject.add(ps3.ps);
  psObject.remove(ps1.ps);
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  controls.enabled = controller.OrbitControl;
  controls.update();
  TWEEN.update();
  renderer.render(scene, camera);
  stats.begin();
  stats.end();
  
  if (ps3)//check if p3 has been initiated, otherwise it throws console errors
  {
    if (ps3.fadeOut) {
      window.location.reload();
    }
  }
}

let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let pointOfIntersection = new THREE.Vector3();
let plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -58);

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  raycaster.ray.intersectPlane(plane, pointOfIntersection);
  psObject.lookAt(pointOfIntersection);
}
