const useContentShare = (meetingSession, DefaultModality, isContentSharing) => {
    const startContentShare = async () => {
        const observer = {
            videoTileDidUpdate: (tileState) => {
                console.error(tileState);

                // Ignore a tile without attendee ID and videos.
                if (!tileState.boundAttendeeId || !tileState.isContent) {
                    return;
                }

                const yourAttendeeId =
                    meetingSession.configuration.credentials.attendeeId;

                // tileState.boundAttendeeId is formatted as "attendee-id#content".
                const boundAttendeeId = tileState.boundAttendeeId;

                // Get the attendee ID from "attendee-id#content".
                const baseAttendeeId = new DefaultModality(
                    boundAttendeeId
                ).base();
                if (baseAttendeeId === yourAttendeeId) {
                    console.log(
                        "You called startContentShareFromScreenCapture"
                    );
                }
            },

            contentShareDidStart: () => {
                console.log("Screen share started");
            },
            contentShareDidStop: () => {
                console.log("Screen share stopped");
            },
        };

        meetingSession.audioVideo.addContentShareObserver(observer);
        meetingSession.audioVideo.addObserver(observer);

        // A browser will prompt the user to choose the screen.

        const mediaStream = await navigator.mediaDevices.getDisplayMedia();

        await meetingSession.audioVideo.startContentShare(mediaStream);

        isContentSharing.value = true;
    };

    const stopContentShare = async () => {
        const observer = {
            contentShareDidStop: () => {
                console.log("Content share stopped");
            },
        };

        meetingSession.audioVideo.addContentShareObserver(observer);

        await meetingSession.audioVideo.stopContentShare();

        isContentSharing.value = false;
    };

    return {
        startContentShare,
        stopContentShare,
    };
};

export default useContentShare;
