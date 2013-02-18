var kinect = require('voxel-zigfu')
var skin = require('../minecraft-skin')

module.exports = function(game){
	var puppeteered

	return function(img){
		var player = skin(game.THREE, img)

		var playerObject = player.createPlayerObject()
		game.scene.add(playerObject)

		game.addItem(player)
		kinect.puppeteer(player)
		return playerObject
	}
}