const useStartCall = (
    meetingSession,
    videoTag,
    videoTagSecond,
    audioTag,
    isCallStarted,
    isAudioStarted,
    isVideoStarted,
    selectedAudioInputDevice,
    selectedVideoInputDevice
) => {
    const startCall = async () => {
        const observer = {
            videoTileDidUpdate: (tileState) => {
                if (tileState.isContent) {
                    return;
                }

                if (tileState.localTile) {
                    meetingSession.audioVideo.bindVideoElement(
                        tileState.tileId,
                        videoTag.value
                    );
                    return;
                }
                if (!tileState.localTile) {
                    meetingSession.audioVideo.bindVideoElement(
                        tileState.tileId,
                        videoTagSecond.value
                    );
                }
            },
            audioVideoDidStart: () => {
                console.error("Started");
            },
            audioVideoDidStop: (sessionStatus) => {
                console.error(
                    "Stopped with a session status code: ",
                    sessionStatus.statusCode()
                );
            },
            audioVideoDidStartConnecting: (reconnecting) => {
                if (reconnecting) {
                    console.error("Attempting to reconnect");
                }
            },
        };

        isCallStarted.value = true;

        await meetingSession.audioVideo.startAudioInput(
            selectedAudioInputDevice.value.deviceId
        );

        isAudioStarted.value = true;

        await meetingSession.audioVideo.bindAudioElement(audioTag.value);

        meetingSession.audioVideo.addObserver(observer);

        meetingSession.audioVideo.start();

        await meetingSession.audioVideo.startVideoInput(
            selectedVideoInputDevice.value.deviceId
        );

        isVideoStarted.value = true;

        meetingSession.audioVideo.startLocalVideoTile();
    };

    return {
        startCall,
    };
};

export default useStartCall;
