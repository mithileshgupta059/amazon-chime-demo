<script setup>
import {
    ConsoleLogger,
    DefaultDeviceController,
    DefaultMeetingSession,
    LogLevel,
    MeetingSessionConfiguration,
} from "amazon-chime-sdk-js";
import { ref } from "vue";

import useStartCall from "@/Hooks/useStartCall";
import useToggleVideo from "@/Hooks/useToggleVideo";
import useToggleAudio from "@/Hooks/useToggleAudio";

window.global = window;

const isCallStarted = ref(false);
const isVideoStarted = ref(false);
const isAudioStarted = ref(false);

const videoTag = ref(null);
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

const { startCall } = useStartCall(
    meetingSession,
    videoTag,
    audioTag,
    isCallStarted,
    isVideoStarted,
    isAudioStarted
);

const { toggleVideo } = useToggleVideo(meetingSession, isVideoStarted);
const { toggleAudio } = useToggleAudio(meetingSession, isAudioStarted);
</script>

<template>
    <div>
        <div class="p-6 sm:px-20 bg-white border-b border-gray-200">
            <div
                class="h-96 w-72 bg-gray-200 flex justify-center items-center rounded"
            >
                <button
                    v-if="!isCallStarted"
                    @click="startCall"
                    class="bg-white px-4 py-1 rounded"
                >
                    <i class="fa-solid fa-phone mr-2 text-md"></i>
                    <span class="text-md">Start</span>
                </button>
                <i
                    v-if="!isVideoStarted && isCallStarted"
                    class="fa-solid fa-user-slash text-2xl"
                ></i>
                <video
                    v-if="isCallStarted && isVideoStarted"
                    ref="videoTag"
                ></video>
                <audio
                    v-if="isCallStarted && isAudioStarted"
                    ref="audioTag"
                ></audio>
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
