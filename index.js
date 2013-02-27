var recording = null,
	actor,
	actors,
	recordingMethod,
	playbackMethod,
	frame = 0,
	isRecording = false,
	isPlaying = false,
	loop = false,
	speed = 1,
	recLength = 0,
	timeStartedRecording = timeStartedPlaying = Date.now(),
	playingFromFrame = 0,
	preserveAllFrames = false

exports.register = function(newActor, newRecordingMethod, newPlaybackMethod){
	actor=newActor
	console.log("Actor sett to "+actor)
	recordingMethod=newRecordingMethod
	playbackMethod=newPlaybackMethod
}

var Performer = function(anActor, aRecordingMethod, aPlaybackMethod){
	this.actor = anActor
	this.recordingMethod = aRecordingMethod
	this.playbackMethod = aPlaybackMethod
	this.loop = true
	this.recordMode = true
	this.playMode = true
	this.recording = []
	return this
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
	if(recording.length>0) recLength = recording[recording.length-1].time
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

recordingLength = function(){
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
	playbackMethod(actor, recording[frame]['position'])
}
exports.assumePosition = assumePosition

exports.jumpToKeyframe = function(frameNumber){
	frame = frameNumber
	assumePosition()
}

function assumeFrame(){
	playbackMethod(actor, recording[frame]['position'])
}
exports.assumeFrame=assumeFrame

var frameAssumed = 0
var lastTickTime
var recLength = 0
exports.startPlayback = function(){

	isPlaying = true
	isRecording = false
	lastTickTime = Date.now()
	recLength = recordingLength()
	//Pull this out once proper scrubbing exists:
	frame=0
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

var playbackTime = 0
exports.tick = function(){
	if(isRecording){
		recordFrame()
	}
	if(isPlaying){
		playbackTime += (Date.now()-lastTickTime)*speed
		if(0 > playbackTime || playbackTime > recLength){
			if(0 > playbackTime){
				playbackTime+=recLength
			}else{
				playbackTime-=recLength
			}
		}
		frame = returnFrameNearest(playbackTime)
		assumeFrame()
		lastTickTime = Date.now()
	}
}

function returnFrameNearest(comparedTime){
	var bestGuess = 0
	var guessDistance = recording.length
	for(var i=0; i<recording.length; i++){
		var frameDistance = Math.abs(recording[i].time-comparedTime)
		if(frameDistance<guessDistance){
			bestGuess=i
			guessDistance = frameDistance
		}
	}
	return bestGuess
}

var bodyParts = ["leftArm","rightArm", "leftLeg","rightLeg", "upperBody", "playerGroup","head"]
exports.minecraftSkinPlayback = function(actor, positionData){
	if(actor && positionData){
		bodyParts.forEach(function(bodyPart){
			if(positionData[bodyPart][0]&&positionData[bodyPart][1]){
				actor[bodyPart].useQuaternian = true
				var quat = actor[bodyPart].quaternion.setFromAxisAngle(positionData[bodyPart][0], positionData[bodyPart][1])
				return true
			}else{
				return false
			}
		})
	}else{
		//console.log("Skipped a frame.")
		return false
	}
}

exports.unregister = function(actor){
	actor = undefined
}