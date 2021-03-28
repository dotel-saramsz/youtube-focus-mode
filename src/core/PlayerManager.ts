import { VideoFilter } from "./VideoFilter";
import * as utils from "../utils";
import { PlayerFilter } from "./PlayerFilter";

/** The class that manages the video feeds */
export class PlayerManager {
    videoPlayer: Element | null;
    videoObserver: MutationObserver;
    videoFilter: VideoFilter;

    constructor() {
        this.videoPlayer = document.querySelector("ytd-watch-flexy");

        // Initialize the video filter
        this.videoFilter = new PlayerFilter();

        // Initialize the observer that observes mutations in the video player
        this.videoObserver = new MutationObserver(this.videoMutationCallback);
    }

    /** The mutation callback that responds to the mutations in the video that is being played */
    private videoMutationCallback: MutationCallback = (
        mutationsList,
        observer
    ) => {
        for (const mutation of mutationsList) {
            if (mutation.attributeName?.toLowerCase() == "video-id") {
                // @ts-ignore
                const newVideoId: string = mutation.target.getAttribute(
                    "video-id"
                );
                const oldVideoId = mutation.oldValue;
                if (newVideoId != oldVideoId) {
                    // Video Id in the player element changed.
                    // Get the relevant video node
                    const relevantNode = utils.getVideoPlayerNode(
                        mutation.target
                    );
                    if (relevantNode) {
                        this.videoFilter.filterVideo({
                            videoId: newVideoId,
                            relevantNode: relevantNode,
                        });
                    }
                }
            }
        }
    };

    public blockDistractiveVideo = (allowedCategories: string[]) => {
        // Set the allowList for the video filter
        this.videoFilter.allowedCategories = allowedCategories;

        // Start the mutation observations
        if (this.videoPlayer) {
            this.videoObserver.observe(this.videoPlayer, {
                attributes: true,
                attributeOldValue: true,
            });
        }

        const playerContainer = document.querySelector(
            "div#primary-inner.ytd-watch-flexy"
        );
        const videoId = this.videoPlayer?.getAttribute("video-id");

        if (playerContainer && videoId) {
            this.videoFilter.filterVideo({
                videoId: videoId,
                relevantNode: playerContainer,
            });
        }
    };

    public unblockDistractiveVideo = () => {
        // Stop the mutation observations
        this.videoObserver.disconnect();

        // Get the video player node
        const playerContainer = document.querySelector(
            "div#primary-inner.ytd-watch-flexy"
        );
        const videoId = this.videoPlayer?.getAttribute("video-id");

        // Unblock the video
        if (playerContainer && videoId) {
            this.videoFilter.unblockVideo({
                videoId: videoId,
                relevantNode: playerContainer,
            });
        }
    };
}
