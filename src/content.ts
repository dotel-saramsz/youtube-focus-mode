// This file is injected as a content script
import { defaultAppStatus, defaultChosenCategories } from "./constants";
import "./content.css";
import { FeedManager } from "./core/FeedManager";
import { PlayerManager } from "./core/PlayerManager";
import { MessageType } from "./types";
import * as utils from "./utils";

// Define global state variables
let appEnabled = defaultAppStatus;
let chosenCategories: string[] = defaultChosenCategories;

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

const blockDistractions = (allowedCategories: string[]) => {
    // Filter the videos
    feedManager.blockDistractiveVideos(allowedCategories);
    playerManager.blockDistractiveVideo(allowedCategories);
};

const unblockDistractions = () => {
    // Filter the videos
    feedManager.unblockDistractiveVideos();
    playerManager.unblockDistractiveVideo();
};

const runApp = (appEnabled: boolean, chosenCategories: string[]) => {
    if (appEnabled) {
        // Block the distractions
        blockGlobalDistractions();
        blockDistractions(chosenCategories);
    } else {
        // Unblock the distractions
        unblockGlobalDistractions();
        unblockDistractions();
    }
};

// Add listener to listen to the app status changes
chrome.runtime.onMessage.addListener(
    (message: MessageType, sender, sendResponse) => {
        switch (message.type) {
            case "APP_STATUS":
                appEnabled = message.appEnabled;
                runApp(appEnabled, chosenCategories);
                break;
            case "CHOSEN_CATEGORIES_LIST":
                chosenCategories = message.chosenCategories;
                runApp(appEnabled, chosenCategories);
                break;
            default:
                break;
        }
    }
);

// Get the app status and chosen categories from chrome storage for the first run
chrome.storage.local.get((items) => {
    if (items.hasOwnProperty("appEnabled")) {
        appEnabled = items["appEnabled"];
    }
    if (items.hasOwnProperty("chosenCategories")) {
        const categoryNames = utils.getCategoryNames(items["chosenCategories"]);
        chosenCategories = categoryNames;
    }
    // First run
    runApp(appEnabled, chosenCategories);
});
