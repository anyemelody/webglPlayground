const THREE = require('three')
const OrbitControls = require('three-orbitcontrols')
const discImage = require('./assets/dotSprite.png');
const Dat = require('dat.gui');
const Stats = require('stats.js');
import CircleWave from './js/CircleWaveFade.js'
import Perlin from './js/Perlin.js'
const noise = new Perlin();



var container, controls, gui, stats;
var camera, scene, renderer;
var count = 0;
var deltaX, deltaY;
var index1, index2;
var waves, logoObject, waveRadius, waveNum, pointsNum, pinchNum;



var effectController = {
  zGap: 0.1, //the spaceing on z axis
  pinch: 4, //set the pinch num of the circle
  waveNum: 8,
  breathSpeed: 0.08,
  gradientColor: true,
  fadeProgress: 0,
  FadeMode: 1,
  OrbitControl: true
};




function resetWave(){
  scene.remove(logoObject);
  waves = [];
  logoObject = new THREE.Object3D();
  waveRadius = 2;
  waveNum = effectController.waveNum;
  pointsNum = 1000;
  pinchNum = effectController.pinch;
  for(var j=0; j<(waveNum); j++){
    var centerDeltaX = Math.sin(2*Math.PI/(waveNum*8)*j)*0.1;//
    var centerDeltaY = Math.cos(2*Math.PI/(waveNum*8)*j)*0.1;//
    var rotateDelta = j*0.2;
    var waveIndex = j;
    var circle = new CircleWave(centerDeltaX, centerDeltaY, waveRadius, rotateDelta, waveIndex, pinchNum, waveNum, pointsNum, discImage, scene);
    
    waves.push(circle);
    logoObject.add(circle.getThisWaveObject());
  }
  scene.add(logoObject);
  index1 = Math.random();
  index2 = Math.random();
}



init();
animate();



function init() {
  container = document.createElement('div');
  document.body.appendChild(container);

  scene = new THREE.Scene();
  scene.background = new THREE.Color("rgb(0,0,0)");
  scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);
  var axesHelper = new THREE.AxesHelper(10);
  // scene.add(axesHelper);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 1, 6);
  scene.add(camera);

  controls = new OrbitControls(camera);

  resetWave();
  
  stats = new Stats();
  stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild( stats.dom );

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  gui = new Dat.GUI();
  gui.add( effectController, 'zGap', 0, 0.5, 0.01 ).onChange();
  gui.add( effectController, 'pinch', 4, 6, 1).onChange(resetWave);
  gui.add( effectController, 'waveNum', 1, 12, 1 ).onChange( resetWave );
  gui.add( effectController, 'breathSpeed', 0.08, 0.2, 0.01 ).onChange();
  gui.add( effectController, 'gradientColor', true ).onChange();
  gui.add( effectController, 'OrbitControl', true ).onChange();
  var fade = gui.addFolder('Fade');
  fade.add(effectController, 'fadeProgress', 0, 100, 1).onChange();
  fade.add(effectController, 'FadeMode', 1, 3, 1).onChange();
}





function animate() {
  requestAnimationFrame(animate);
  render();
  controls.enabled = effectController.OrbitControl;
  
}

function render() {
  index1 += 0.003;
  index2 += 0.004;
  deltaX = noise.getValue(index1);
  deltaY = noise.getValue(index2);
  //rotate the whole logoObject
  logoObject.rotation.z += 0.0008;
  for(var k=0; k<waves.length; k++){
    waves[k].transferWave();
    // waves[k].display(...parameter);
    waves[k].display(count, pointsNum, deltaX, deltaY, effectController.zGap, effectController.breathSpeed, effectController.gradientColor, effectController.fadeProgress, effectController.FadeMode);
  }

  renderer.render(scene, camera);
  count+=0.1;
  stats.begin();
  stats.end();
}



var parameter = [
  count, 
  pointsNum, 
  deltaX, 
  deltaY, 
  effectController.zGap, 
  effectController.breathSpeed, 
  effectController.gradientColor, 
  effectController.fadeProgress, 
  effectController.linearFadeMode
]
  
