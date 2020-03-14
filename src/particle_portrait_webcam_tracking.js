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
import * as cocoSSD from "@tensorflow-models/coco-ssd";
var TWEEN = require('@tweenjs/tween.js').default;

// console.log(TWEEN)
let tfModel = null
cocoSSD.load().then(model => {
const buttons = document.querySelectorAll('button')
    tfModel = model
    video.play()

    buttons.forEach(function(target){
        target.removeAttribute("disabled")
    })
    // detect objects in the image.
    // console.log(video)
    detectFrame(canvas, tfModel)
    // model.detect(canvas).then(predictions => {
    //     console.log('Predictions: ', predictions);
    // });
});
const detectFrame = (canvas, model) => {
    return model.detect(canvas)
};

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
    depth: 10,
    xTrackingMovement: 40,
    yTrackingMovement: 5
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
    ctx = canvas.getContext("2d");
    var constraints = { audio: false, video: true };
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function(mediaStream) {
            video.srcObject = mediaStream;
            video.play();
        })
        .catch(function(err) {
            // console.log("yikes, and err!" + err.message);
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

function drawBox(box, canvas) {
    // console.log(box)
    ctx.beginPath();
    ctx.rect(box[0], box[1], box[2], box[3]);
    ctx.lineWidth = "8";
    ctx.strokeStyle = "white";
    ctx.stroke();
}

let ctx // = canvas.getContext("2d");
let lookatPos = { x: 0, y: 0, z: 90 };
let coords = { x: 0, y: 0 }; // Start at (0, 0)
let isTween = false;
new TWEEN.Tween(coords) // Create a new tween that modifies 'coords'.
    .to({ x: lookatPos.x, y: lookatPos.y }, 1500) // Move to (300, 200) in 1 second.
    .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
    .onUpdate(() => { // Called after tween.js updates 'coords'.
        // Move 'box' to the position described by 'coords' with a CSS translation.
        // console.log(coords)
        coords = coords
        camera.position.x = coords.x * 150
        camera.position.y = -coords.y * 35
        // box.style.setProperty('transform', `translate(${coords.x}px, ${coords.y}px)`);
    }).onComplete(() => {
        console.log(coords)
        console.log('done!')
        isTween = false
    }).onStart(() => {
        console.log('start!')
        isTween = true
    })
    .start(); // Start the tween immediately.


function updatePixelColor() {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // for (var i = 0; i < imgData.data.length; i += 4) {
    //   imgR[i / 4] = imgData.data[i];
    //   imgG[i / 4] = imgData.data[i + 1];
    //   imgB[i / 4] = imgData.data[i + 2];
    //   var grey =
    //     (imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) / 3;
    //   if (colorUpdateCount == 0) imgGrey[i / 4] = grey;
    // }

    // if (colorUpdateCount < delayTime) {
    //   colorUpdateCount++;
    // } else {
    //   colorUpdateCount = 0;
    // }
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
    if (isTween) return
    detectFrame(canvas, tfModel).then(predictions => {
      console.log(predictions)
        if (isTween) return
        // const hasPerson = predictions.find(obj => obj.class === "cell phone");
        const hasPerson = predictions.find(obj => obj.class === "person");
        if (hasPerson) {
            const x = hasPerson.bbox[0]
            const w = hasPerson.bbox[1]
            const y = hasPerson.bbox[2]
            const h = hasPerson.bbox[3]
            const xMid = x + w / 2
            const yMid = y + h / 2
            const canvasXcenter = canvas.width / 2
            const canvasYcenter = canvas.height / 2
            const xPos = (xMid - canvasXcenter) / canvasXcenter
            const yPos = (yMid - canvasYcenter) / canvasYcenter
            lookatPos.x = -xPos * effectController.xTrackingMovement
            lookatPos.y = -yPos * effectController.yTrackingMovement
            coords = { x: camera.position.x, y: camera.position.y }; // Start at (0, 0)
            isTween = true
            // if(camera.position.x - lookatPos.x < 5)
            //   return
            // if(camera.position.y - lookatPos.y < 5)
            //   return
            new TWEEN.Tween(coords) // Create a new tween that modifies 'coords'.
                .to({ x: lookatPos.x, y: lookatPos.y }, 1000) // Move to (300, 200) in 1 second.
                .easing(TWEEN.Easing.Quintic.InOut) // Use an easing function to make the animation smooth.
                .onUpdate(() => { // Called after tween.js updates 'coords'.
                    // Move 'box' to the position described by 'coords' with a CSS translation.
                    // console.log(coords)
                    coords = coords
                    camera.position.x = coords.x
                    camera.position.y = coords.y
                    // box.style.setProperty('transform', `translate(${coords.x}px, ${coords.y}px)`);
                }).onComplete(() => {
                    console.log(coords)
                    camera.position.x = coords.x
                    camera.position.y = coords.y
                    console.log('done!')
                    setTimeout(() => {
                        isTween = false
                    }, 250)
                }).onStart(() => {
                    console.log('start!')
                })
                .start(); // Start the tween immediately.

            // .start()
            // console.log(canvas.width,x,w,xMid,yMid,xPos)
            // const pos = new THREE.Vector3(xPos,yPos,1)
            // console.log(pos,'pos')
            // portrait.portrait.lookAt(pos)
            // drawBox(hasPerson.bbox, canvas)
        } else {
            isTween = true
            // if(camera.position.x - lookatPos.x < 5)
            //   return
            // if(camera.position.y - lookatPos.y < 5)
            //   return
            new TWEEN.Tween(coords) // Create a new tween that modifies 'coords'.
                .to({ x: 0, y: 0 }, 1000) // Move to (300, 200) in 1 second.
                .easing(TWEEN.Easing.Quadratic.In) // Use an easing function to make the animation smooth.
                .onUpdate(() => { // Called after tween.js updates 'coords'.
                    camera.position.x = coords.x
                    camera.position.y = coords.y
                    // box.style.setProperty('transform', `translate(${coords.x}px, ${coords.y}px)`);
                }).onComplete(() => {
                    // console.log(coords)
                    camera.position.x = coords.x
                    camera.position.y = coords.y
                    console.log('done!')
                    setTimeout(() => {
                        isTween = false
                    }, 250)
                }).onStart(() => {
                    console.log('start!')
                })
                .start(); // Start the tween immediately.
        }
        // console.log(hasPerson)
        // console.log(!!hasPerson, "hasPerson");
        // requestAnimationFrame(() => {
        // });
    });
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
    gui.add(effectController, "xTrackingMovement", -150, 150, 1).onChange();
    gui.add(effectController, "yTrackingMovement", -150, 150, 1).onChange();
}

function animate(time) {
    controls.enabled = effectController.OrbitControl;
    pointDepth = effectController.depth;
    TWEEN.update(time);
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

        var timer = Date.now() * 0.0001;

        // camera.position.x = Math.cos( timer ) * 200;
        // camera.position.z = Math.sin( timer ) * 200;
        // console.log(camera.position.x,camera.position.z,lookatPos)
        // camera.position.y = lookatPos.y
        // camera.position.z = lookatPos.z
        // console.log(camera.position.x,camera.position.z)
        camera.lookAt(scene.position);
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