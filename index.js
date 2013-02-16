var recording = [],
	actors = [],
	frame = 0,
	isRecording = false,
	isPlaying = false

exports.register = function(actor, recordingMethod, playbackMethod){
	actors.push({
		actor:actor,
		recordingMethod:recordingMethod,
		playbackMethod:playbackMethod
	})
}

var recordFrame = function(){
	var positions = []
	actors.forEach(function(actor){
		var position = {}
		position.data = actor.recordingMethod(actor)
		position.actor = actor
		positions.push(position)
	})
	var keyframe = {
		time:Date.now(),
		positions:positions
	}
	recording.push(keyframe)
	frame = recording.length-1
}

exports.recordingLength = function(){
	return recording[recording.length-1].time-recording[0].time
}

exports.keyframeCount = function(){
	return recording.length
}

exports.currentFrame = function(){
	return frame
}

exports.jumpToTime = function(ms){
	for(var i=0; i<recording.length; i++){
		if(recording[i].time>=ms){
			frame = recording[i].time
			assumePosition()
			break
		}
	}
}

function assumePosition(){
	recording[frame].positions.forEach(function(position){
		position.actor.playbackMethod(actor, position.data)
	})
}

exports.jumpToKeyframe = function(frameNumber){
	frame = frameNumber
	assumePosition()
}

exports.startPlayback = function(){
	isPlaying = true
}