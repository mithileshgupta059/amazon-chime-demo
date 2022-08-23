<script setup>
import {
    ConsoleLogger,
    DefaultDeviceController,
    DefaultMeetingSession,
    LogLevel,
    MeetingSessionConfiguration,
} from "amazon-chime-sdk-js";
import { computed, ref } from "vue";

import useStartCall from "@/Hooks/useStartCall";
import useToggleVideo from "@/Hooks/useToggleVideo";
import useToggleAudio from "@/Hooks/useToggleAudio";
import useStopCall from "@/Hooks/useStopCall";

window.global = window;

// Check if audio, video or call started <State>

const isCallStarted = ref(false);
const isVideoStarted = ref(false);
const isAudioStarted = ref(false);
const isSettingsVisible = ref(false);

// State of audio, video <Input, output>

const audioInputDevices = ref([]);
const videoInputDevices = ref([]);
const audioOutputDevices = ref([]);

// Keep track of currently selected devices

const videoTag = ref(null);
const videoTagSecond = ref(null);
const audioTag = ref(null);

const { meeting_credentials } = defineProps({ meeting_credentials: {} });

const logger = new ConsoleLogger("MeetingLogs", LogLevel.INFO);
const deviceController = new DefaultDeviceController(logger);

const configuration = new MeetingSessionConfiguration(
    meeting_credentials.meeting_response,
    meeting_credentials.attendee_response
);

const meetingSession = new DefaultMeetingSession(
    configuration,
    logger,
    deviceController
);

// Set audio, video devices in state

meetingSession.audioVideo.listAudioInputDevices().then((res) => {
    audioInputDevices.value = res;
});

meetingSession.audioVideo.listVideoInputDevices().then((res) => {
    videoInputDevices.value = res;
});

meetingSession.audioVideo.listAudioOutputDevices().then((res) => {
    audioOutputDevices.value = res;
});

// Hooks

const { startCall } = useStartCall(
    meetingSession,
    videoTag,
    videoTagSecond,
    audioTag,
    isCallStarted,
    isAudioStarted,
    isVideoStarted
);

const { toggleVideo } = useToggleVideo(
    meetingSession,
    isVideoStarted,
    videoTag
);

const { toggleAudio } = useToggleAudio(meetingSession, isAudioStarted);
const { stopCall } = useStopCall(meetingSession, isCallStarted);

// Toggle settings

const toggleSettings = () => {
    isSettingsVisible.value == true
        ? (isSettingsVisible.value = false)
        : (isSettingsVisible.value = true);
};
</script>

<template>
    <div>
        <div class="p-6 sm:px-20 bg-white border-b border-gray-200">
            <div
                class="h-16 w-72 bg-gray-200 mb-2 flex justify-end items-center rounded p-2"
            >
                <i
                    @click="toggleSettings"
                    class="fa-solid fa-gear text-2xl bg-white px-4 py-2 rounded cursor-pointer"
                ></i>
            </div>
            <div
                v-if="isSettingsVisible"
                class="w-72 bg-gray-200 mb-2 rounded p-4"
            >
                <p>Camera</p>
                <select class="w-full rounded my-2">
                    <option
                        v-if="videoInputDevices.length > 0"
                        v-for="videoInputDevice in videoInputDevices"
                    >
                        {{ videoInputDevice.label }}
                    </option>
                </select>
                <p class="mb-2">Microphone</p>
                <select class="w-full rounded my-2">
                    <option
                        v-if="audioInputDevices.length > 0"
                        v-for="audioInputDevice in audioInputDevices"
                    >
                        {{ audioInputDevice.label }}
                    </option>
                </select>
                <button class="w-full bg-blue-500 rounded text-white py-2 mt-2">
                    Save
                </button>
            </div>
            <div
                class="h-96 w-72 bg-gray-200 flex justify-center items-center rounded"
            >
                <video ref="videoTag"></video>

                <video ref="videoTagSecond"></video>

                <audio ref="audioTag"></audio>
            </div>
            <div
                class="bg-gray-200 w-72 h-20 mt-4 rounded flex justify-evenly py-4"
            >
                <button
                    v-if="!isCallStarted"
                    @click="startCall"
                    class="bg-white px-4 py-1 rounded"
                >
                    <i class="fa-solid fa-phone text-md mr-4"></i>
                    <span class="text-md">Start</span>
                </button>
                <button
                    v-if="isCallStarted"
                    @click="stopCall"
                    class="bg-white px-4 py-1 rounded"
                >
                    <i class="fa-solid fa-phone-slash text-md mr-4"></i>
                    <span class="text-md">Stop</span>
                </button>
            </div>
            <div class="bg-gray-200 w-72 h-20 mt-4 rounded flex justify-evenly">
                <button @click="toggleAudio">
                    <i
                        v-if="isAudioStarted"
                        class="fa-solid fa-microphone text-2xl bg-white px-4 py-2 rounded"
                    ></i>
                    <i
                        v-else
                        class="fa-solid fa-microphone-slash text-2xl bg-white px-4 py-2 rounded"
                    ></i>
                </button>
                <button @click="toggleVideo">
                    <i
                        v-if="isVideoStarted"
                        class="fa-solid fa-video text-2xl bg-white px-4 py-2 rounded"
                    ></i>
                    <i
                        v-else
                        class="fa-solid fa-video-slash text-2xl bg-white px-4 py-2 rounded"
                    ></i>
                </button>
                <button>
                    <i
                        class="fa-solid fa-message text-2xl bg-white px-4 py-2 rounded"
                    ></i>
                </button>
                <button>
                    <i
                        class="fa-solid fa-laptop text-2xl bg-white px-4 py-2 rounded"
                    ></i>
                </button>
            </div>
        </div>
    </div>
</template>
