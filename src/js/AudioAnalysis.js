const THREE = require("three");

const audioListener = new THREE.AudioListener();
audio = new THREE.Audio(audioListener);

const audioLoader = new THREE.AudioLoader();
// Load audio file inside asset folder
audioLoader.load("asset/audio.mp3", buffer => {
  audio.setBuffer(buffer);
  audio.setLoop(true);
  audio.play(); // Start playback
});

// About fftSize https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/fftSize
analyser = new THREE.AudioAnalyser(audio, fftSize);
let averageFrequency;
// analyser.getFrequencyData() returns array of half size of fftSize.
// ex. if fftSize = 2048, array size will be 1024.
// data includes magnitude of low ~ high frequency.
const data = analyser.getFrequencyData();

for (let i = 0, len = data.length; i < len; i++) {
  // access to magnitude of each frequency with data[i].
}
