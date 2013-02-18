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

//Giving navigation to the game using voxel-player:
var player = require('voxel-player')
var createPlayer = player(game)
window.substack = createPlayer('substack.png')
substack.position.set(5,180,5)
substack.possess()

//Attempting to combine voxel-zigfu with the game:
var kinect = require('voxel-zigfu')
var skin = require('minecraft-skin')

window.dan = skin(game.THREE, 'danf.png')

var danObject = dan.createPlayerObject()
kinect.puppeteer(dan)
game.scene.add(danObject)
game.addItem(dan)
dan.mesh.position.y=50
//Previous attempts:

// var puppet = require('../zigfuPuppet')
// //My attempt to emulate the voxel-player api to find the problem:
// var createPuppet = puppet(game)
// window.dan = createPuppet('danf.png')
// dan.mesh.position.y = 60
// game.scene.add(dan)

// var kinect = require('voxel-zigfu')
// var skin = require('../minecraft-skin')
// window.dan = skin(game.THREE, 'danf.png')
// dan.mesh.position.y = 60
// game.scene.add(dan.createPlayerObject())
// kinect.puppeteer(dan)


// var viking = skin(THREE, 'viking.png')
// viking.mesh.position.y = 50
// game.scene.add(viking.mesh)

//window.dan = skin(THREE, 'danf.png')
// window.dan = createPlayer('danf.png')
// dan.position.set(0, 62, 0)
// kinect.puppeteer(dan)
//game.scene.add(dan.createPlayerObject())

// toggle between first and third person modes
window.addEventListener('keydown', function (ev) {
  if (ev.keyCode === 'R'.charCodeAt(0)) substack.toggle()
})

// block interaction stuff
// var highlight = highlighter(game)
var currentMaterial = 1



module.exports = game
