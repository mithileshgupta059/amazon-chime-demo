<script setup>
import {
    ConsoleLogger,
    DefaultDeviceController,
    DefaultMeetingSession,
    LogLevel,
    MeetingSessionConfiguration,
    DefaultModality,
    DataMessage,
} from "amazon-chime-sdk-js";
import { reactive, ref } from "vue";

import placeholder from "@/img/placeholder.jpg";

import useStartCall from "@/Hooks/useStartCall";
import useToggleVideo from "@/Hooks/useToggleVideo";
import useToggleAudio from "@/Hooks/useToggleAudio";
import useStopCall from "@/Hooks/useStopCall";
import useChangeDevices from "@/Hooks/useChangeDevices";
import useContentShare from "@/Hooks/useContentShare";
import useMessaging from "@/Hooks/useMessaging";

window.global = window;

// Check if audio, video or call started <State>

const isCallStarted = ref(false);
const isVideoStarted = ref(false);
const isAudioStarted = ref(false);
const isSettingsVisible = ref(false);
const isContentSharing = ref(false);

// Remote person state

const remotePersonVideoAlive = ref(false);

// Roster state

const roster = ref({});

// State of audio, video <Input, output>

const audioInputDevices = ref([]);
const videoInputDevices = ref([]);

// Selected devices

const selectedAudioInputDevice = ref(null);
const selectedVideoInputDevice = ref(null);

// Keep track of currently selected devices

const videoTag = ref(null);
const videoTagSecond = ref(null);
const audioTag = ref(null);

// Form data

const fd = reactive({
    videoInputDevice: null,
    audioInputDevice: null,
});

// Internal message state

const messageInputValue = ref("");
const messages = ref([]);

// Props and other jazz

const { meeting_credentials, user } = defineProps({
    meeting_credentials: {},
    user: {},
});

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
    if (res.length > 0) {
        audioInputDevices.value = res;
        selectedAudioInputDevice.value = res[0];
        fd.audioInputDevice = res[0];
    }
});

meetingSession.audioVideo.listVideoInputDevices().then((res) => {
    if (res.length > 0) {
        videoInputDevices.value = res;
        selectedVideoInputDevice.value = res[0];
        fd.videoInputDevice = res[0];
    }
});

// Data message handler

const dataMessageHandler = (dataMessage) => {
    messages.value.push({
        message: JSON.parse(new TextDecoder().decode(dataMessage.data)).message,
        senderName: JSON.parse(new TextDecoder().decode(dataMessage.data))
            .senderName,
    });
};

// Hooks

const { startCall } = useStartCall(
    meetingSession,
    videoTag,
    videoTagSecond,
    audioTag,
    isCallStarted,
    isAudioStarted,
    isVideoStarted,
    selectedAudioInputDevice,
    selectedVideoInputDevice,
    roster,
    remotePersonVideoAlive,
    dataMessageHandler
);

const { toggleVideo } = useToggleVideo(
    meetingSession,
    isVideoStarted,
    videoTag,
    selectedVideoInputDevice
);

const { toggleAudio } = useToggleAudio(meetingSession, isAudioStarted);
const { stopCall } = useStopCall(
    meetingSession,
    isCallStarted,
    remotePersonVideoAlive
);
const { changeDevices } = useChangeDevices(
    selectedAudioInputDevice,
    selectedVideoInputDevice,
    isSettingsVisible
);
const { startContentShare, stopContentShare } = useContentShare(
    meetingSession,
    DefaultModality,
    isContentSharing,
    videoTagSecond
);
const { sendMessage } = useMessaging(
    meetingSession,
    DataMessage,
    user,
    dataMessageHandler
);

// Toggle settings

const toggleSettings = () => {
    isSettingsVisible.value == true
        ? (isSettingsVisible.value = false)
        : (isSettingsVisible.value = true);
};

// Check if remote audio is muted

const checkIfRemoteAudioMuted = () => {
    let res = false;

    Object.keys(roster.value).forEach((r) => {
        if (roster.value[r].muted === true) {
            res = true;
        }
    });

    return res;
};
</script>

<template>
    <div>
        <div class="p-6 sm:px-20 bg-white border-b border-gray-200">
            <div
                v-if="!isCallStarted"
                class="h-16 w-72 bg-gray-200 mb-2 flex justify-end items-center rounded p-2"
            >
                <i
                    @click="toggleSettings"
                    class="fa-solid fa-gear text-2xl bg-white px-4 py-2 rounded cursor-pointer"
                ></i>
            </div>
            <div
                v-if="isSettingsVisible && !isCallStarted"
                class="w-72 bg-gray-200 mb-2 rounded p-4"
            >
                <p>Camera</p>
                <select
                    v-model="fd.videoInputDevice"
                    class="w-full rounded my-2"
                >
                    <option
                        :value="videoInputDevice"
                        v-if="videoInputDevices.length > 0"
                        v-for="videoInputDevice in videoInputDevices"
                    >
                        {{ videoInputDevice.label }}
                    </option>
                </select>
                <p class="mb-2">Microphone</p>
                <select
                    v-model="fd.audioInputDevice"
                    class="w-full rounded my-2"
                >
                    <option
                        :value="audioInputDevice"
                        v-if="audioInputDevices.length > 0"
                        v-for="audioInputDevice in audioInputDevices"
                    >
                        {{ audioInputDevice.label }}
                    </option>
                </select>
                <button
                    @click="
                        () => {
                            changeDevices(fd);
                        }
                    "
                    class="w-full bg-blue-500 rounded text-white py-2 mt-2"
                >
                    Save
                </button>
            </div>
            <div class="w-72 bg-gray-200 rounded">
                <p v-if="meetingSession.audioVideo.realtimeIsLocalAudioMuted()">
                    Audio muted
                </p>
                <video :poster="placeholder" ref="videoTag"></video>
            </div>
            <div v-if="remotePersonVideoAlive" class="w-72 bg-gray-200 rounded">
                <template v-if="roster !== {}">
                    <p v-if="checkIfRemoteAudioMuted()">Audio muted</p>
                </template>
                <video :poster="placeholder" ref="videoTagSecond"></video>
            </div>
            <audio ref="audioTag"></audio>
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
            <div
                v-if="isCallStarted"
                class="bg-gray-200 w-72 h-20 mt-4 rounded flex justify-evenly"
            >
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
                <button @click="sendMessage">
                    <i
                        class="fa-solid fa-message text-2xl bg-white px-4 py-2 rounded"
                    ></i>
                </button>
                <button
                    v-if="!isContentSharing && isCallStarted"
                    @click="startContentShare"
                >
                    <i
                        class="fa-solid fa-laptop text-2xl bg-white px-4 py-2 rounded"
                    ></i>
                </button>
                <button
                    v-if="isContentSharing && isCallStarted"
                    @click="stopContentShare"
                >
                    <i
                        class="fa-solid fa-laptop-slash text-2xl bg-white px-4 py-2 rounded"
                    ></i>
                </button>
            </div>
            <div v-if="isCallStarted" class="bg-gray-200 w-72 mt-4 rounded p-4">
                <input
                    v-model="messageInputValue"
                    type="text"
                    class="rounded"
                />
                <button
                    @click="
                        () => {
                            sendMessage(messageInputValue);
                        }
                    "
                    class="bg-blue-500 rounded text-white px-4 py-2 mt-2"
                >
                    Add
                </button>
            </div>
            <div class="bg-gray-200 w-72 mt-4 rounded p-4">
                <div
                    class="bg-blue-500 text-white px-4 py-2 rounded mb-2"
                    v-for="message in messages"
                >
                    <p>{{ message.senderName }}</p>
                    <p>{{ message.message }}</p>
                </div>
            </div>
        </div>
    </div>
</template>
