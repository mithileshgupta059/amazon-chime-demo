<script setup>
import {
    ConsoleLogger,
    DefaultDeviceController,
    DefaultMeetingSession,
    LogLevel,
    MeetingSessionConfiguration,
} from "amazon-chime-sdk-js";
import { onMounted, ref } from "vue";

window.global = window;

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

async function meetingSetup() {
    const observer = {
        videoTileDidUpdate: (tileState) => {
            console.error({ tileState });
            const audioElement = audioTag;
            const isDefaultVideo = tileState.tileId === 1;
            // bind audio output to audio HTML DOM element using ref
            meetingSession.audioVideo.bindAudioElement(audioElement.value);
            meetingSession.audioVideo.bindVideoElement(
                tileState.tileId,
                isDefaultVideo ? videoTag.value : videoTagSecond.value
            );
        },
        audioVideoDidStart: () => {
            console.error("Started");
        },
        audioVideoDidStop: (sessionStatus) => {
            console.error(
                "Stopped with a session status code: ",
                sessionStatus.statusCode()
            );
        },
        audioVideoDidStartConnecting: (reconnecting) => {
            if (reconnecting) {
                console.error("Attempting to reconnect");
            }
        },
    };

    meetingSession.audioVideo
        .listAudioInputDevices()
        .then((audioInputDevices) => {
            return meetingSession.audioVideo.startAudioInput(
                audioInputDevices[0].deviceId
            );
        })
        .then(() => {
            return meetingSession.audioVideo.listAudioOutputDevices();
        })
        .then(() => {
            const audioElement = audioTag;
            // bind audio output to audio HTML DOM element using ref
            return meetingSession.audioVideo.bindAudioElement(
                audioElement.value
            );
        })
        .then(() => {
            // register audio-video lifecycle observer
            meetingSession.audioVideo.addObserver(observer);
            return meetingSession.audioVideo.start();
        })
        .then(() => {
            meetingSession.audioVideo
                .listVideoInputDevices()
                .then((videoInputDevices) => {
                    return meetingSession.audioVideo.startVideoInput(
                        videoInputDevices.length
                            ? videoInputDevices[0].deviceId
                            : null
                    );
                })
                .then(() => {
                    return meetingSession.audioVideo.startLocalVideoTile();
                });
        })
        .then(() => {
            // Unmute
            const unmuted =
                meetingSession.audioVideo.realtimeUnmuteLocalAudio();
            if (unmuted) {
                console.log("Other attendees can hear your audio");
            } else {
                // See the realtimeSetCanUnmuteLocalAudio use case below.
                console.log("You cannot unmute yourself");
            }
            const muted = meetingSession.audioVideo.realtimeIsLocalAudioMuted();
            if (muted) {
                console.log("You are muted");
            } else {
                console.log("Other attendees can hear your audio");
            }
        })
        .catch((err) => {
            console.error("error", err);
        });
}

const startCall = () => {
    meetingSetup();
};
</script>

<template>
    <div>
        <div class="p-6 sm:px-20 bg-white border-b border-gray-200">
            <button
                class="bg-blue-500 text-white p-2 rounded"
                @click="startCall"
            >
                Start call
            </button>

            <audio ref="audioTag"></audio>
            <video ref="videoTag"></video>
            <video ref="videoTagSecond"></video>
        </div>
    </div>
</template>
