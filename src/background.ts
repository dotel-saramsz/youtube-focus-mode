import { MessageType } from "./core/messaging";

let appEnabled = false;

// Read the current app status from local storage
chrome.storage.local.get((items) => {
    if (items.hasOwnProperty("appEnabled")) {
        // Variable has already been initialized
        if (typeof items["appEnabled"] == "boolean") {
            appEnabled = items["appEnabled"];
        }
    } else {
        // The variable is not present in backend. Save it
        chrome.storage.local.set({ appEnabled: appEnabled }, () => {
            console.log("[Background] App initialized");
        });
    }
});

/** Send the app status to the popup and content script */
const sendAppStatusToEveryOne = (appEnabled: boolean) => {
    // Send app status to the popup
    chrome.runtime.sendMessage({ type: "APP_STATUS", appEnabled: appEnabled });

    // Send snow status to the tabs
    chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
            if (tab.id) {
                chrome.tabs.sendMessage(tab.id, {
                    type: "APP_STATUS",
                    appEnabled: appEnabled,
                });
            }
        });
    });
};

/** Send the app status only to the sender of the message */
const sendAppStatusToSender = (
    sender: chrome.runtime.MessageSender,
    appEnabled: boolean
) => {
    if (sender.tab && sender.tab.id) {
        // Message came from a tab. Send app status to the particular tab
        chrome.tabs.sendMessage(sender.tab.id, {
            type: "APP_STATUS",
            appEnabled: appEnabled,
        });
    } else {
        // Message came from popup
        chrome.runtime.sendMessage({
            type: "APP_STATUS",
            appEnabled: appEnabled,
        });
    }
};

// Respond to messages from popup or content script
chrome.runtime.onMessage.addListener(
    (message: MessageType, sender, sendResponse) => {
        switch (message.type) {
            case "REQ_APP_STATUS":
                // Get the app status from local storage and send
                chrome.storage.local.get((items) => {
                    if (
                        items.hasOwnProperty("appEnabled") &&
                        typeof items["appEnabled"] == "boolean"
                    ) {
                        sendAppStatusToSender(sender, items["appEnabled"]);
                    } else {
                        // appEnabled variable not present
                        sendAppStatusToSender(sender, false);
                    }
                });
                break;
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
                            appEnabled = true;
                            sendAppStatusToEveryOne(message.appEnabled);
                        }
                    }
                );
                break;
            default:
                break;
        }
    }
);
