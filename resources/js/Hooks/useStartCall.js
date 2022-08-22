const useStartCall = (
    meetingSession,
    videoTag,
    audioTag,
    isCallStarted,
    isVideoStarted,
    isAudioStarted
) => {
    const startCall = () => {
        const observer = {
            videoTileDidUpdate: (tileState) => {
                console.error({ tileState });
                const audioElement = audioTag;
                const isDefaultVideo = tileState.tileId === 1;
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

        meetingSession.audioVideo
            .listAudioInputDevices()
            .then((audioInputDevices) => {
                isCallStarted.value = true;

                return meetingSession.audioVideo.startAudioInput(
                    audioInputDevices[0].deviceId
                );
            })
            .then(() => {
                isAudioStarted.value = true;

                return meetingSession.audioVideo.listAudioOutputDevices();
            })
            .then(() => {
                const audioElement = audioTag;

                // bind audio output to audio HTML DOM element using ref
                return meetingSession.audioVideo.bindAudioElement(
                    audioElement.value
                );
            })
            .then(() => {
                // register audio-video lifecycle observer
                meetingSession.audioVideo.addObserver(observer);
                return meetingSession.audioVideo.start();
            })
            .then(() => {
                isVideoStarted.value = true;

                meetingSession.audioVideo
                    .listVideoInputDevices()
                    .then((videoInputDevices) => {
                        return meetingSession.audioVideo.startVideoInput(
                            videoInputDevices.length
                                ? videoInputDevices[0].deviceId
                                : null
                        );
                    })
                    .then(() => {
                        return meetingSession.audioVideo.startLocalVideoTile();
                    });
            })
            .catch((err) => {
                console.error("error", err);
            });
    };

    return {
        startCall,
    };
};

export default useStartCall;
