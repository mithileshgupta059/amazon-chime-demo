const useToggleAudio = (meetingSession, isAudioStarted) => {
    const toggleAudio = async () => {
        if (isAudioStarted.value == true) {
            isAudioStarted.value = false;

            meetingSession.audioVideo.realtimeMuteLocalAudio();

            return;
        }

        isAudioStarted.value = true;

        meetingSession.audioVideo.realtimeUnmuteLocalAudio();
    };

    return {
        toggleAudio,
    };
};

export default useToggleAudio;
