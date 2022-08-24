const useStartCall = (
    meetingSession,
    videoTag,
    videoTagSecond,
    audioTag,
    isCallStarted,
    isAudioStarted,
    isVideoStarted
) => {
    const startCall = async () => {
        const observer = {
            videoTileDidUpdate: (tileState) => {
                console.error(tileState);

                if (tileState.localTile && !tileState.isContent) {
                    meetingSession.audioVideo.bindVideoElement(
                        tileState.tileId,
                        videoTag.value
                    );
                    return;
                }
                if (!tileState.isContent && !tileState.localTile) {
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

        const audioInputDevices =
            await meetingSession.audioVideo.listAudioInputDevices();

        await meetingSession.audioVideo.startAudioInput(
            audioInputDevices[0].deviceId
        );

        isAudioStarted.value = true;

        await meetingSession.audioVideo.bindAudioElement(audioTag.value);

        meetingSession.audioVideo.addObserver(observer);

        meetingSession.audioVideo.start();

        const videoInputDevices =
            await meetingSession.audioVideo.listVideoInputDevices();

        await meetingSession.audioVideo.startVideoInput(
            videoInputDevices[0].deviceId
        );

        isVideoStarted.value = true;

        meetingSession.audioVideo.startLocalVideoTile();
    };

    return {
        startCall,
    };
};

export default useStartCall;
