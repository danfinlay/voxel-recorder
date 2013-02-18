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
var danObject = dan.mesh
kinect.puppeteer(dan)
game.scene.add(danObject)
game.addItem(dan)
dan.mesh.position.y=50

//Setting up Animatron here:
window.recorder = require('../')
recorder.register(dan, recordingMethod, playbackMethod)
function recordingMethod(actor){
	return recorder.currentPosition()
}
function playbackMethod(actor, positionData){
	["leftArm","rightArm",
	"leftLeg","rightLeg",
	"body","head"].forEach(function(bodyPart){
		actor[bodyPart].useQuaternian = true
		actor[bodyPart].setFromAxisAngle(positionData[bodyPart][0],positionData[bodyPart][1])
	})
}

kinect.onUpdate(function(){
	console.log("Kinect update triggering tick")
	recorder.tick()
})

window.addEventListener('keydown', function (ev) {
	if (ev.keyCode === 'R'.charCodeAt(0)) substack.toggle()
	if (ev.keyCode === 'S'.charCodeAt(0)) {

	}
})

//Giving navigation to the game using voxel-player:
var player = require('voxel-player')
var createPlayer = player(game)
window.substack = createPlayer('substack.png')
substack.position.set(5,180,5)
substack.possess()

// toggle between first and third person modes


// block interaction stuff
// var highlight = highlighter(game)
var currentMaterial = 1



module.exports = game
