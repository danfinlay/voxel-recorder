var createGame = require('voxel-engine')
var voxel = require('voxel')
var texturePath = require('painterly-textures')(__dirname)
var game = createGame({
  startingPosition: [0, 200, 0],
  generate: voxel.generator['Valley'],
  chunkDistance: 2,
  texturePath: texturePath,
  worldOrigin: [0, 0, 0],
  controls: { discreteFire: true }
})
window.game = game // for debugging
var container = document.querySelector('#container')
game.appendTo(container)

var kinect = require('./voxel-zigfu')
var skin = require('minecraft-skin')
window.dan = skin(game.THREE, 'danf.png')
kinect.puppeteer(dan)
game.scene.add(dan.mesh)
game.addItem(dan)
dan.mesh.position.y=60


game.camera.position = new THREE.Vector3(59, 69, 0)
game.camera.rotation = new THREE.Vector3(0,1.5,0)

//Setting up Animatron here:
window.recorder = require('../')
recorder.register(dan, kinect.currentPosition, recorder.minecraftSkinPlayback)

var bodyParts = ["leftArm","rightArm", "leftLeg","rightLeg", "upperBody", "playerGroup","head"]

recorder.loop(true)

kinect.onUpdate(function(){
	recorder.tick()
})

game.addItem(recorder)

var kinectMode = true
var recording = false
var playing = false
window.addEventListener('keydown', function (ev) {
	if (ev.keyCode === 'R'.charCodeAt(0)){
		if(!recording){
			recording = recorder.startRecording()
		}else{
			recording = recorder.stopRecording()
		}
		console.log("Recording set to "+recording)
	}
	if (ev.keyCode === 'K'.charCodeAt(0)) {
		if(kinectMode){
			kinectMode=false
			kinect.setActive(false)
		}else{
			kinectMode=true
			kinect.setActive(true)
		}
		console.log("Kinect mode set to "+kinectMode)
	}
	if (ev.keyCode === 'P'.charCodeAt(0)) {
		if(playing){
			playing=false
			recorder.pausePlayback()
		}else{
			playing=true
			recorder.startPlayback()
		}
		console.log("Playing set to "+playing)
	}
})

var currentMaterial = 1

module.exports = game