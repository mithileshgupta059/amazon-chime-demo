const useMessaging = (meetingSession, DataMessage) => {
    const sendMessage = () => {
        const dataMessageHandler = (dataMessage) => {
            console.error(dataMessage);
        };

        meetingSession.audioVideo.realtimeSubscribeToReceiveDataMessage(
            "test",
            (dataMessage) => {
                dataMessageHandler(dataMessage);
            }
        );

        meetingSession.audioVideo.realtimeSendDataMessage(
            "test",
            "My name is Bob"
        );

        dataMessageHandler(
            new DataMessage(
                Date.now(),
                "test",
                new TextEncoder().encode("My name is Bob"),
                meetingSession.configuration.credentials.attendeeId,
                meetingSession.configuration.credentials.externalUserId
            )
        );
    };

    return {
        sendMessage,
    };
};

export default useMessaging;
