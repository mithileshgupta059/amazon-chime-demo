const useStopCall = (meetingSession, isCallStarted) => {
    const stopCall = async () => {
        meetingSession.audioVideo.stop();

        await meetingSession.audioVideo.stopAudioInput();
        await meetingSession.audioVideo.stopVideoInput();

        isCallStarted.value = false;
    };

    return {
        stopCall,
    };
};

export default useStopCall;
