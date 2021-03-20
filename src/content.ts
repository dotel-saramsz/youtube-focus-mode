// This file is injected as a content script
import "./content.css";
import { FeedManager } from "./core/FeedManager";
import { PlayerManager } from "./core/PlayerManager";
import { MessageType } from "./core/messaging";

// Select some global DOM elements
const sideDrawer = document.querySelector("tp-yt-app-drawer");
const sideDrawerMini = document.querySelector("ytd-mini-guide-renderer");

// Instantiate the feed manager
const feedManager = new FeedManager();
// Instantiate hte video player manager
const playerManager = new PlayerManager();

const blockGlobalDistractions = () => {
    // Hide the disturbing elements
    sideDrawer?.classList.add("hide-display");
    sideDrawerMini?.classList.add("hide-display");
};

const unblockGlobalDistractions = () => {
    // Unhide the disturbing elements
    sideDrawer?.classList.remove("hide-display");
    sideDrawerMini?.classList.remove("hide-display");
};

const blockDistractions = () => {
    // Filter the videos
    feedManager.blockDistractiveVideos();
    playerManager.blockDistractiveVideo();
};

const unblockDistractions = () => {
    // Filter the videos
    feedManager.unblockDistractiveVideos();
    playerManager.unblockDistractiveVideo();
};

// Get the current app status
let appEnabled = true;
chrome.runtime.sendMessage({ type: "REQ_APP_STATUS" });
// chrome.storage.local.get((items) => {
//     if (items["appEnabled"] && typeof items["appEnabled"] == "boolean") {
//         appEnabled = items["appEnabled"];
//         toggleAppStatus(appEnabled);
//     }
// });

// Add listener to listen to the app status changes
chrome.runtime.onMessage.addListener(
    (message: MessageType, sender, sendResponse) => {
        switch (message.type) {
            case "APP_STATUS":
                console.log(`[Content] App status: ${message.appEnabled}`);
                if (message.appEnabled) {
                    // Block the distractions
                    blockGlobalDistractions();
                    blockDistractions();
                } else {
                    // Unblock the distractions
                    unblockGlobalDistractions();
                    unblockDistractions();
                }
                break;
            default:
                break;
        }
    }
);
