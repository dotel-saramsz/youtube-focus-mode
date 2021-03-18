// This file is injected as a content script
import "./content.css";
import * as utils from "./utils";
import { VideoStore, VideoNode } from "./core/VideoStore";
import { MessageType } from "./core/messaging";
import * as youtube from "./api/youtube/api";

interface VideoBlockList {
    [videoId: string]: boolean;
}

// Initialize the VideoStore class
const videoStore = new VideoStore();

const videosGridContainer = document.querySelector(
    "div#contents.style-scope.ytd-rich-grid-renderer"
);
const feedFilterBar = document.querySelector(
    "ytd-feed-filter-chip-bar-renderer"
);
const topBarLogo = document.querySelector("ytd-topbar-logo-renderer");
const sideDrawer = document.querySelector("tp-yt-app-drawer");
const sideDrawerMini = document.querySelector("ytd-mini-guide-renderer");

videosGridContainer?.classList.add("videos-grid-container");
feedFilterBar?.classList.add("hide-display");
sideDrawer?.classList.add("hide-display");
sideDrawer?.classList.add("hide-display");

// const observeVideoLinkMutation = (videoNode: VideoNode) => {
//     const linkObserver = new MutationObserver((mutation) => {

//     });

//     linkObserver.observe(videoNode.node, { })

// }

// const processVideos = async (videoIds: string[]): Promise<VideoBlockList> => {
//     const chosenCategories = ["27", "28"];
//     const videoDataList = await youtube.getVideoData(videoIds);

//     const videoBlockList: VideoBlockList = {};
//     for (const videoData of videoDataList) {
//         let block = true;
//         if (chosenCategories.includes(videoData.category)) {
//             block = false;
//         }

//         // console.log(
//         //     `[VIDEO-DATA] id: ${videoData.videoId} | category: ${videoData.category} | block: ${block}`
//         // );

//         videoBlockList[videoData.videoId] = block;
//     }
//     return videoBlockList;
// };

const filterDistractiveVideos = () => {
    const videoLinkNodes = document.querySelectorAll(
        "ytd-thumbnail a#thumbnail"
    );
    for (let index = 0; index < videoLinkNodes.length; index++) {
        const videoLinkNode = videoLinkNodes[index];
        const videoId = utils.getVideoId(videoLinkNode);

        if (videoId) {
            // Add video to the video store
            videoStore.addVideoToStore({
                videoId: videoId,
                linkNode: videoLinkNode,
            });
        }
    }
};

const mutationCallback: MutationCallback = (mutationsList, observer) => {
    // console.log(`Mutations: ${mutationsList.length}`);
    for (const mutation of mutationsList) {
        mutation.addedNodes.forEach((node, key, parent) => {
            if (node.nodeName == "YTD-THUMBNAIL") {
                // Get the video link node and id
                const videoNode = utils.getVideoNode(node);
                if (videoNode) {
                    // Add video to the video store
                    videoStore.addVideoToStore(videoNode);
                }
            }
        });
        if (
            mutation.target.nodeName == "A" && // @ts-ignore
            mutation.target.getAttribute("id") == "thumbnail"
        ) {
            const videoLinkNode = mutation.target;
            const videoId = utils.getVideoId(videoLinkNode);

            if (videoId) {
                videoStore.addVideoToStore({
                    videoId: videoId,
                    linkNode: videoLinkNode,
                });
            }
        }
    }
};

const observer = new MutationObserver(mutationCallback);
if (videosGridContainer) {
    observer.observe(videosGridContainer, {
        attributes: true,
        childList: true,
        subtree: true,
    });
}

filterDistractiveVideos();

// Add the listener to listen to messages from background script
// chrome.runtime.onMessage.addListener(
//     (message: MessageType, sender, sendResponse) => {
//         switch (message.type) {
//             case "VIDEO_RESULT":
//                 console.log(`Video Processed Message: ${message.videoId}`);
//                 videoStore.onVideoProcessed(message.videoId, message.block);
//                 break;

//             default:
//                 break;
//         }
//     }
// );
