var recording = [],
	actors = [],
	frame = 0,
	isRecording = false,
	isPlaying = false,
	loop = false,
	speed = 1,
	recordingLength = 0,
	timeStartedRecording = timeStartedPlaying = Date.now(),
	playingFromFrame = 0

exports.register = function(actor, recordingMethod, playbackMethod){
	actors.push({
		actor:actor,
		recordingMethod:recordingMethod,
		playbackMethod:playbackMethod
	})
}

exports.startRecording = function(){
	isRecording = true
	timeStartedRecording = Date.now()
}
exports.stopRecording = function(){
	isRecording = false
	recordingLength = recording[recording.length-1].time
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
		time:Date.now()-timeStartedRecording,
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
	isRecording = false
	timeStartedPlaying = Date.now()
	playingFromFrame = frame
}

exports.pausePlayback = function(){
	isPlaying = false
}

exports.loop = function(shouldLoop){
	loop = shouldLoop
}

exports.resetPlayback = function(){
	frame = 0
}

exports.playbackSpeed = function(desiredSpeed){
	speed = desiredSpeed
}

exports.clearRecording = function(){
	recording = []
}

var preserveAllFrames = false
exports.frameSafe = function(safeOrNot){
	preserveAllFrames = safeOrNot
}

exports.tick = function(){
	if(recording){
		recordFrame()
	}else if(playing){
		if(preserveAllFrames){
			frame+=1
			assumePosition
		}else{
			var progress = (Date.now() - timeStartedPlaying) * speed
			var target = (recording[playingFromFrame].time + progress)
			
			if(loop){
				if(target<0){
					while(target<0){
						target+=recordingLength
				}
				if(target > recordingLength){
					while(target > recordingLength){
						target -= recordingLength
					}
				}
			}else{ 
				if(target > recordingLength || target < 0){
					isPlaying = false
				}else{
					for(var i=0; i<recording.length; i++){
						if(recording[i].time>=target){
							assumePosition()
							break
						}
					}
				}
			}
		}
	}
}