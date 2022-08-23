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
                console.error({ tileState });
                const audioElement = audioTag;
                const isDefaultVideo = tileState.localTile;
                // bind audio output to audio HTML DOM element using ref
                meetingSession.audioVideo.bindAudioElement(audioElement.value);
                meetingSession.audioVideo.bindVideoElement(
                    tileState.tileId,
                    isDefaultVideo ? videoTag.value : videoTagSecond.value
                );
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
