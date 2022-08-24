const useChangeDevices = (
    selectedAudioInputDevice,
    selectedVideoInputDevice
) => {
    const changeDevices = (fd) => {
        selectedAudioInputDevice.value = fd.audioInputDevice;
        selectedVideoInputDevice.value = fd.videoInputDevice;

        console.error({
            selectedAudioInputDevice: selectedAudioInputDevice.value,
            selectedVideoInputDevice: selectedVideoInputDevice.value,
        });
    };

    return {
        changeDevices,
    };
};

export default useChangeDevices;
