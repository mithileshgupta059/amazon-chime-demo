const useMessaging = (meetingSession, DataMessage, messages, user) => {
    const sendMessage = (message) => {
        const dataMessageHandler = (dataMessage) => {
            messages.value.push({
                message: new TextDecoder().decode(dataMessage.data),
            });
        };

        meetingSession.audioVideo.realtimeSubscribeToReceiveDataMessage(
            "General",
            (dataMessage) => {
                dataMessageHandler(dataMessage);
            }
        );

        meetingSession.audioVideo.realtimeSendDataMessage("General", message);

        dataMessageHandler(
            new DataMessage(
                Date.now(),
                "General",
                new TextEncoder().encode(message),
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
