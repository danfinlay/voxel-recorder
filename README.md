#Animatron
##A package for recording performances and playing them back again.

###Example
	var animatron = require('animatron')
	animatron.register(actor1, recordingMethod, playbackMethod)

	function recordingMethod(actor){
		return actor.leftArm.position
	}

	function playbackMethod(actor, positionData){
		actor.leftArm.position = positionData
	}

	//Call the tick function each frame:
	function renderTick(){
		animatron.tick()
	}

	//Start and stop recording like this:
	animatron.startRecording()
	animatron.stopRecording()

	//When done recording, play it back.
	//Make sure you aren't updating the position
	//With any other methods:
	animatron.jumpToTime(0)
	animatron.loop(true)
	animatron.startPlayback()

	//Save your recording or open it again:
	animatron.saveRecording('myrecording.json')
	animatron.openRecording('./myrecording.json')

##API##
###register(actor, recordingCallback, playbackCallback)
Registers an actor with a callback for recording and playing back.

	function recordingCallback(actor){

		//Includes a reference to the recorded actor.
		//You should return an object that your actor will use
		//to reenact its current position.
		return actor.leftArm.position
	}

	function playbackMethod(actor, positionData){
		//Includes a reference both to the actor and the positionData object you provided.
		//Just plug it together!
		actor.leftArm.position = positionData
	}

###startRecording()

###stopRecording()

###saveRecording(filename, cb(err))

###openRecording(filePath, cb(err))

###unregister(actor)
Stops recording the given actor in subsequent recordings.

###removePerformanceBy(actor)
Removes any performance by the given actor.

###recordingLength()
Returns recording length in milliseconds.

###keyframeCount()
Returns number of significant recorded moments, organized by timestamp.

###currentFrame()
Returns current frame number.

###currentTime()
Returns current animation time in milliseconds (recordings start at 0).

###jumpToTime(milliseconds)
Calls all actors' playback callbacks at the specified time.

###jumpToKeyframe(keyFrameInteger)
Calls all actors' playback callbacks at the specified keyframe.

###startPlayback()
Begins calling back actors' playback callbacks from the current keyframe.

###pausePlayback()

###loop(boolean)
Whether or not the animation should loop when completing.

###resetPlayback()

###playbackSpeed(speed)
A positive or negative number representing the speed at which to play back when playing.

###clearRecording()

###tick()
Must be called each frame for animation to be captured or performances to be displayed.

###frameSafe(bool)
Tells playback engine whether to render every frame regardless of time or not.  Defaults to true, neglecting timing accuracy but staying wary of what is probably a pretty sketchy playback attempt.  I would only turn this on if I had a really amazing computer to try it on.