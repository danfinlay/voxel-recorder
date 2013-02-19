var fs = require('fs'),
	recording = null,
	actor={},
	recordingMethod,
	playbackMethod,
	frame = 0,
	isRecording = false,
	isPlaying = false,
	loop = false,
	speed = 1,
	recordingLength = 0,
	timeStartedRecording = timeStartedPlaying = Date.now(),
	playingFromFrame = 0,
	preserveAllFrames = false

exports.register = function(newActor, newRecordingMethod, newPlaybackMethod){
	actor=newActor
	console.log("Actor sett to "+actor)
	recordingMethod=newRecordingMethod
	playbackMethod=newPlaybackMethod
}

exports.data = function(){
	return recording
}

exports.startRecording = function(){
	if(!isRecording && recording){
		var response = confirm("Recording will erase previous performance.  Continue?")
		if(response){
			isRecording = true
			timeStartedRecording = Date.now()
			recording = []
			return isRecording
		}
	}else if(!isRecording && !recording){
		isRecording = true
		timeStartedRecording = Date.now()
		recording = []
	}
	return isRecording
}
exports.stopRecording = function(){
	isRecording = false
	if(recording.length>0) recordingLength = recording[recording.length-1].time
	frame = 0
	return isRecording
}

exports.saveRecording = function(filename, cb){
	fs.writeFile(filename|'recording'+Math.ceil(Math.random()*1000)+'.json',
		JSON.stringify(recording),
		function(err){
			if(err){
				cb("Save failed!")
			}else{
				cb(null)
				console.log("Save succeeded.")
			}
		}
	)
}

exports.loadRecordingOnActor = function(filename, cb){
	fs.readFile(filename, function(err, data){
		if(err){
			cb("File open failed")
		}else{
			recording = JSON.parse(data)
			cb(null)
		}
	})
}

var recordFrame = function(){
	var theTime = Date.now()-timeStartedRecording
	var keyframe = {
		time:theTime,
		position:recordingMethod(actor)
	}
	recording.push(keyframe)
	frame = recording.length-1
}

exports.recordingLength = function(){
	return recording[recording.length-1].time
}

exports.keyframeCount = function(){
	return recording.length
}

exports.currentFrame = function(){
	return frame
}

exports.currentTime = function(){
	return recording[frame].time
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
	playbackMethod(actor, recording[frame].position)
}
exports.assumePosition = assumePosition

exports.jumpToKeyframe = function(frameNumber){
	frame = frameNumber
	assumePosition()
}

function assumeFrame(aFrame){
	return playbackMethod(actor, recording[aFrame].position)
}
exports.assumeFrame=assumeFrame

var frameAssumed = 0
exports.startPlayback = function(){
	isPlaying = true
	isRecording = false
	timeStartedPlaying = Date.now()
	playingFromFrame = 0
	frame=0
	frameAssumed = recording.length

	for(var i=0; i<recording.length; i++){
		var time = Math.ceil((recording[frame+i]['time']-recording[frame]['time'])/speed)
		setTimeout(function(){

			if(frame===recording.length-1){
				isPlaying=false
			}
			assumeFrame(++frame)
		}, time)
	}

	// while(frame < recording.length){
	// 	if(!isPlaying){
	// 		break
	// 	}else{
	// 		if(frameAssumed!==frame){
	// 			frameAssumed = frame
	// 			assumePosition()
	// 			var interval = recording[frame+1]['time']-recording[frame]['time']
	// 			var timeout = setTimeout(function(){
	// 				frame++
	// 			}, Math.ceil(interval/speed))
	// 		}
	// 	}
	// }
}

exports.pausePlayback = function(){
	isPlaying = false
}

exports.loop = function(shouldLoop){
	loop = shouldLoop
	return loop
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

exports.frameSafe = function(safeOrNot){
	preserveAllFrames = true
	//Avoiding the temporarily deprecated commented pit below.
}

exports.tick = function(){
	if(isRecording){
		recordFrame()
	}
}

exports.unregister = function(actor){
	actor = undefined
}