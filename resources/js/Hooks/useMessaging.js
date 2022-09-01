const useMessaging = (
    meetingSession,
    DataMessage,
    user,
    dataMessageHandler
) => {
    const sendMessage = (message) => {
        const messageToSend = new TextEncoder().encode(
            JSON.stringify({
                senderName: user.name,
                message,
            })
        );

        meetingSession.audioVideo.realtimeSendDataMessage(
            "General",
            messageToSend
        );

        dataMessageHandler(
            new DataMessage(
                Date.now(),
                "General",
                messageToSend,
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
