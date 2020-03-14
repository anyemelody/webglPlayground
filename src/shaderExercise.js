const THREE = require("three");
const OrbitControls = require("three-orbitcontrols");
import {
  vertexshader,
  fragmentshader
} from "./js/Shaders/illusionFlowerShader.js";

var container;
var camera, scene, renderer, controls;
var uniforms;

init();
animate();

function init() {
  container = document.getElementById("container");
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    10000
  );
  camera.position.set(0, 0, 10);
  scene.add(camera);


  var geometry = new THREE.BoxBufferGeometry(2, 2, 2);

  uniforms = {
    u_time: { type: "f", value: 1.0 },
    u_resolution: { type: "v2", value: new THREE.Vector2() },
    u_mouse: { type: "v2", value: new THREE.Vector2() }
  };

  var material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexshader,
    fragmentShader: fragmentshader
  });

  var mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);

  container.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);

  onWindowResize();
  window.addEventListener("resize", onWindowResize, false);

  document.onmousemove = function(e) {
    uniforms.u_mouse.value.x = e.pageX;
    uniforms.u_mouse.value.y = e.pageY;
  };
}

function onWindowResize(event) {
  renderer.setSize(window.innerWidth, window.innerHeight);
  uniforms.u_resolution.value.x = renderer.domElement.width;
  uniforms.u_resolution.value.y = renderer.domElement.height;
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  uniforms.u_time.value += 0.02;
  renderer.render(scene, camera);
}
