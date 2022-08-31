const useStopCall = (meetingSession, isCallStarted, remotePersonVideoAlive) => {
    const stopCall = async () => {
        meetingSession.audioVideo.stop();

        await meetingSession.audioVideo.stopAudioInput();
        await meetingSession.audioVideo.stopVideoInput();

        remotePersonVideoAlive.value = false;

        isCallStarted.value = false;
    };

    return {
        stopCall,
    };
};

export default useStopCall;
