import * as youtube from "./api/youtube/api";
import { MessageType } from "./core/messaging";
import axios from "axios";

const chosenCategories = ["27", "28"];

const processVideo = async (senderTabId: number, videoId: string) => {
    const videoDataList = await youtube.getVideoData([videoId]);

    for (const videoData of videoDataList) {
        let block = true;
        if (chosenCategories.includes(videoData.category)) {
            block = false;
        }

        console.log(
            `[VIDEO-DATA] id: ${videoData.videoId} | category: ${videoData.category} | block: ${block}`
        );

        chrome.tabs.sendMessage(senderTabId, {
            type: "VIDEO_RESULT",
            videoId: videoData.videoId,
            block: block,
        });
    }
};

// Respond to messages from popup or content script
chrome.runtime.onMessage.addListener(
    (message: MessageType, sender, sendResponse) => {
        switch (message.type) {
            case "PROCESS_VIDEO":
                const senderTabId = sender.tab?.id;
                console.log(`Request to process: ${message.videoId}`);
                if (senderTabId) {
                    // Only process this message if sent from tab (i.e. content script)
                    processVideo(senderTabId, message.videoId);
                }
                break;
            default:
                break;
        }
    }
);
