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

// Select various DOM elements
// The whole page container
const pageContainer = document.querySelector("ytd-page-manager");
// The home page container
const homePageContainer = document.querySelector("ytd-browse");
// The video player page container
const playerPageContainer = document.querySelector("ytd-watch-flexy");
// The search results page container
const searchPageContainer = document.querySelector("ytd-search");

const videosGridContainer = document.querySelector("ytd-page-manager");
const feedFilterBar = document.querySelector(
    "ytd-feed-filter-chip-bar-renderer"
);
const topBarLogo = document.querySelector("ytd-topbar-logo-renderer");
const sideDrawer = document.querySelector("tp-yt-app-drawer");
const sideDrawerMini = document.querySelector("ytd-mini-guide-renderer");

// Hide the disturbing elements
feedFilterBar?.classList.add("hide-display");
sideDrawer?.classList.add("hide-display");
sideDrawerMini?.classList.add("hide-display");

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
