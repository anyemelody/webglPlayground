var THREE = require('./js/three')
require('./js/OrbitControls')

var camera, controls, scene, renderer;
var container, stats;
var particles, count = 0;

init();
animate();

function init() {
  
  container = document.createElement('div');
  document.body.appendChild(container);

  scene = new THREE.Scene();
	scene.background = new THREE.Color("rgb(0,0,0)");
	scene.fog = new THREE.Fog( 0xa0a0a0, 200, 1000 );

  var axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);

  var aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera( 45, aspect, 0.25, 20 );
  camera.position.set(0, 1, 5);
  scene.add(camera);
  controls = new THREE.OrbitControls( camera );
  scene.add( new THREE.AmbientLight( 0x222222 ) );
	var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
	directionalLight.position.set( 1, 1, 1 ).normalize();
  scene.add( directionalLight );
  
  var numParticles = 100;
  var positions = new Float32Array(numParticles*3);
  var scales = new Float32Array(numParticles);


  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  particleGroup = new THREE.Group();


  //mesh
  var geometry = new THREE.SphereBufferGeometry(0.02, 32, 32);
  var material = new THREE.MeshPhysicalMaterial( { color: 0x2194ce, metalness:0.4, roughness:0.5, reflectivity: 0.3 });
  for(var x = -10; x<10; x++){
    for(var y = 0; y<3; y++){
      for (var z =-10; z<10; z++){
        var sphere = new THREE.Mesh(geometry, material);
        sphere.position.x = x*0.3;
        sphere.position.y = y*0.3;
        sphere.position.z = z*0.3;
        particleGroup.add(sphere);
      }
    }
  }
 scene.add(particleGroup);
}







function animate() {
  requestAnimationFrame( animate );
  controls.update();
  timer = Date.now();
  render();
}

function render(){
  for(var i = 0; i<particleGroup.children.length; i++){
    var sphere = particleGroup.getObjectById(14+i);
    sphere.position.y += Math.sin(timer*0.001+sphere.position.x)*0.005;
  }



  renderer.render( scene, camera );
}
