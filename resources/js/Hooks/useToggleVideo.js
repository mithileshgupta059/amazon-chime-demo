const useToggleVideo = (
    meetingSession,
    isVideoStarted,
    videoTag,
    selectedVideoInputDevice
) => {
    const toggleVideo = async () => {
        if (isVideoStarted.value == true) {
            meetingSession.audioVideo.stopLocalVideoTile();

            // Stop video input. If the previously chosen camera has an LED light on,
            // it will turn off indicating the camera is no longer capturing.
            await meetingSession.audioVideo.stopVideoInput();

            isVideoStarted.value = false;

            return;
        }

        // The camera LED light will turn on indicating that it is now capturing.
        // See the "Device" section for details.
        await meetingSession.audioVideo.startVideoInput(
            selectedVideoInputDevice.value.deviceId
        );

        meetingSession.audioVideo.startLocalVideoTile();

        isVideoStarted.value = true;
    };

    return {
        toggleVideo,
    };
};

export default useToggleVideo;
