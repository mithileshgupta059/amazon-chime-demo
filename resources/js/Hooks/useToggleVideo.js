const useToggleVideo = (meetingSession, isVideoStarted) => {
    const toggleVideo = async () => {
        if (isVideoStarted.value == true) {
            await meetingSession.audioVideo.stopVideoInput();

            meetingSession.audioVideo.stopLocalVideoTile();

            isVideoStarted.value = false;

            return;
        }

        const videoInputDevices =
            await meetingSession.audioVideo.listVideoInputDevices();

        await meetingSession.audioVideo.startVideoInput(
            videoInputDevices[0].deviceId
        );

        meetingSession.audioVideo.startLocalVideoTile();

        isVideoStarted.value = true;
    };

    return {
        toggleVideo,
    };
};

export default useToggleVideo;
