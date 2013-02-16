#Voxel Recorder#
##A module for recording motion and events through time in Voxel.js##

###Example
	var recorder = require('voxel-recorder')
	recorder.register(voxelSkinA, recordingMethod, playbackMethod)

	function recordingMethod(actor){
		return actor.leftArm.position
	}

	function playbackMethod(actor, positionData){
		actor.leftArm.position = positionData.leftArm.position
	}

	//call recordPositions() with each interesting moment.
	function renderTick(){
		recorder.recordPositions()
	}

##API##
###register(actor, recordingCallback, playbackCallback)
Registers an actor with a callback for recording and playing back.
recordingCallback has reference to the registered actor.  Does Javscript do that gracefully?
recordingCallback wants to be returned an object that represents all information needed to reenact that actor.  This object is then returned along with a reference to the original actor in the playbackCallback.
	recorder.register(voxelSkinA, recordingMethod, playbackMethod)

	function recordingMethod(actor){
		return actor.leftArm.position
	}

	function playbackMethod(actor, positionData){
		actor.leftArm.position = positionData.leftArm.position
	}

###recordFrame()###
Records a frame from all registered actors.

###recordingLength()
Returns recording length in milliseconds.

###keyframeCount()
Returns number of significant recorded moments, organized by timestamp.

###currentFrame()
Returns current time stamp in milliseconds.

##jumpToTime(milliseconds)
Calls all actors' playback callbacks at the specified time.

##jumpToKeyframe(keyFrameInteger)
Calls all actors' playback callbacks at the specified keyframe.

##startPlayback()
Begins calling back actors' playback callbacks from the current keyframe.

##pausePlayback()

##loop(boolean)
Whether or not the animation should loop when completing.

##resetPlayback()

##playbackSpeed(speed)
A positive or negative number representing the speed at which to play back when playing.