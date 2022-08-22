const useToggleVideo = (meetingSession, isVideoStarted) => {
    const toggleVideo = async () => {
        if (isVideoStarted.value == true) {
            isVideoStarted.value = false;

            await meetingSession.audioVideo.stopVideoInput();

            return;
        }

        isVideoStarted.value = true;

        const videoInputDevices =
            await meetingSession.audioVideo.listVideoInputDevices();

        await meetingSession.audioVideo.startVideoInput(
            videoInputDevices[0].deviceId
        );

        meetingSession.audioVideo.startLocalVideoTile();
    };

    return {
        toggleVideo,
    };
};

export default useToggleVideo;
