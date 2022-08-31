import { DefaultModality } from "amazon-chime-sdk-js";

const useStartCall = (
    meetingSession,
    videoTag,
    videoTagSecond,
    audioTag,
    isCallStarted,
    isAudioStarted,
    isVideoStarted,
    selectedAudioInputDevice,
    selectedVideoInputDevice,
    roster,
    remotePersonVideoAlive
) => {
    const startCall = async () => {
        roster.value = {};

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
                    meetingSession.audioVideo.realtimeSubscribeToAttendeeIdPresence(
                        (presentAttendeeId, present) => {
                            if (!present) {
                                delete roster.value[presentAttendeeId];

                                remotePersonVideoAlive.value = false;

                                return;
                            }

                            meetingSession.audioVideo.realtimeSubscribeToVolumeIndicator(
                                tileState.boundAttendeeId,
                                (attendeeId, volume, muted, signalStrength) => {
                                    const baseAttendeeId = new DefaultModality(
                                        attendeeId
                                    ).base();
                                    if (baseAttendeeId !== attendeeId) {
                                        // Optional: Do not include the content attendee (attendee-id#content) in the roster.
                                        // See the "Screen and content share" section for details.
                                        return;
                                    }

                                    if (
                                        roster.value.hasOwnProperty(attendeeId)
                                    ) {
                                        // A null value for any field means that it has not changed.
                                        roster.value[attendeeId].volume =
                                            volume; // a fraction between 0 and 1
                                        roster.value[attendeeId].muted = muted; // A boolean
                                        roster.value[
                                            attendeeId
                                        ].signalStrength = signalStrength; // 0 (no signal), 0.5 (weak), 1 (strong)
                                    } else {
                                        // Add an attendee.
                                        // Optional: You can fetch more data, such as attendee name,
                                        // from your server application and set them here.
                                        roster.value[attendeeId] = {
                                            attendeeId,
                                            volume,
                                            muted,
                                            signalStrength,
                                        };
                                    }
                                }
                            );
                        }
                    );

                    remotePersonVideoAlive.value = true;

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
