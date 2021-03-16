// This file is injected as a content script
import "./content.css";
import * as utils from "./utils";

const videoNodes = document.getElementsByTagName("ytd-rich-grid-media");
const videosGridContainer = document.querySelector(
    "div#contents.style-scope.ytd-rich-grid-renderer"
);

videosGridContainer?.classList.add("videos-grid-container");

const mutationCallback: MutationCallback = (mutationsList, observer) => {
    for (const mutation of mutationsList) {
        mutation.addedNodes.forEach((node, key, parent) => {
            if (node.nodeName == "YTD-RICH-GRID-MEDIA") {
                // Get the video id
                const videoId = utils.getVideoIdByTraversal(node);
                console.log(`New video added with id: ${videoId}`);
                // @ts-ignore
                node.classList.add("disabled-video");
            }
        });
    }
};

const observer = new MutationObserver(mutationCallback);
if (videosGridContainer) {
    observer.observe(videosGridContainer, { childList: true, subtree: true });
}

console.log(`Total Videos: ${videoNodes.length}`);

for (let index = 0; index < videoNodes.length; index++) {
    const videoNode = videoNodes[index];
    videoNode.classList.add("disabled-video");
}
