#Animatron
##A simple animation package that lets you record and play back anything that can be measured and controlled using your own functions and your own data structures, and can even handle saving and loading them as JSON files.
###Currently a single Animatron will only manage a single actor's performance, although you can fit as much data as you like in each frame, so you could probably hack more.  It's your processor speed!  I would personally make an animatron for each actor I wanted animated.

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

	//One could instead also refer to these pre-defined playback methods within voxel-zigfu and voxel-recorder:
	animatron.register(actor1, voxel-zigfu.currentPosition, animatron.minecraftSkinPlayback)

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
Registers an actor as the performer, with callback functions for recording and playing back.

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

###tick()
Must be called each frame for animation to be captured.  Playback timing, however, is handled internally, to emulate the timing of the original tick calls.  Currently there is no tweening, but eventually it would be nice, don't you think?

###stopRecording()

###saveRecording(filename, cb(err))

###openRecording(filePath, cb(err))
	Loads a performance from file, allowing the registered actor to perform it.

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