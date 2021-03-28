import { defaultAppStatus, defaultChosenCategories } from "./constants";
import { MessageType } from "./types";
import * as utils from "./utils";

/** Send the message to the popup and all content scripts */
const sendMessageToEveryOne = (message: MessageType) => {
    // Send app status to the popup
    chrome.runtime.sendMessage(message);

    // Send snow status to the tabs
    chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
            if (tab.id) {
                chrome.tabs.sendMessage(tab.id, message);
            }
        });
    });
};

/** Send the message response only to the sender of the message */
const sendMessageToSender = (
    sender: chrome.runtime.MessageSender,
    message: MessageType
) => {
    if (sender.tab && sender.tab.id) {
        // Message came from a tab. Send app status to the particular tab
        chrome.tabs.sendMessage(sender.tab.id, message);
    } else {
        // Message came from popup
        chrome.runtime.sendMessage(message);
    }
};

// Initialize the extension on installation
const initializeStorage = () => {
    chrome.storage.local.set({ appEnabled: defaultAppStatus }, () => {
        console.log("[Background] App status initialized with default value");
    });
    chrome.storage.local.set(
        { chosenCategories: utils.getCategoryIds(defaultChosenCategories) },
        () => {
            console.log(
                "[Background] Chosen categories for app initialized with default value"
            );
        }
    );
};

chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason == "install") {
        // Extension is installed for the first time.
        // Variables are not present in the storage.
        // Initialize them.
        initializeStorage();
    } else {
        chrome.storage.local.get((items) => {
            if (
                !items.hasOwnProperty("appEnabled") ||
                !items.hasOwnProperty("chosenCategories")
            ) {
                initializeStorage();
            }
        });
    }
});

// Respond to messages from popup or content script
chrome.runtime.onMessage.addListener(
    (message: MessageType, sender, sendResponse) => {
        switch (message.type) {
            case "TOGGLE_STATUS":
                // Save the new app status in local storage
                chrome.storage.local.set(
                    { appEnabled: message.appEnabled },
                    () => {
                        if (chrome.runtime.lastError) {
                            console.log(
                                "[Background] Error while toggling the app status"
                            );
                        } else {
                            // Send the app status to the popup and content script
                            sendMessageToEveryOne({
                                type: "APP_STATUS",
                                appEnabled: message.appEnabled,
                            });
                        }
                    }
                );
                break;
            case "CHANGE_CHOSEN_CATEGORIES":
                const categoryIds = utils.getCategoryIds(
                    message.chosenCategories
                );
                chrome.storage.local.set(
                    { chosenCategories: categoryIds },
                    () => {
                        if (chrome.runtime.lastError) {
                            console.log(
                                "[Background] Error while changing the chosen categories"
                            );
                        } else {
                            // Send the chosen categories to the all subscribers
                            sendMessageToEveryOne({
                                type: "CHOSEN_CATEGORIES_LIST",
                                chosenCategories: message.chosenCategories,
                            });
                        }
                    }
                );
                break;
            default:
                break;
        }
    }
);
