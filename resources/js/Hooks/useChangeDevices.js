const useChangeDevices = (
    selectedAudioInputDevice,
    selectedVideoInputDevice,
    isSettingsVisible
) => {
    const changeDevices = (fd) => {
        selectedAudioInputDevice.value = fd.audioInputDevice;
        selectedVideoInputDevice.value = fd.videoInputDevice;

        isSettingsVisible.value = false;
    };

    return {
        changeDevices,
    };
};

export default useChangeDevices;
