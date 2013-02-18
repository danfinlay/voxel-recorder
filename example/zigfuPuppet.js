var kinect = require('voxel-zigfu')
var skin = require('minecraft-skin')

module.exports = function(game){

	var puppeteered

	return function(img){
		var player = skin(game.THREE, img)
		var playerObject = player.createPlayerObject()
		kinect.puppeteer(player)	
		game.scene.add(player)
		return player
	}

}