import { VideoFilter } from "./VideoFilter";
import * as utils from "../utils";

/** The class that manages the video feeds */
export class PlayerManager {
    videoPlayer: Element | null;
    videoObserver: MutationObserver;
    videoFilter: VideoFilter;

    constructor() {
        this.videoPlayer = document.querySelector("ytd-watch-flexy");

        // Initialize the video filter
        this.videoFilter = new VideoFilter("VIDEOPLAYER");

        // Initialize the observer that observes mutations in the video player
        this.videoObserver = new MutationObserver(this.videoMutationCallback);

        if (this.videoPlayer) {
            this.videoObserver.observe(this.videoPlayer, {
                attributes: true,
                attributeOldValue: true,
            });
        }
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
                console.log(
                    `Video player video-id changed from ${oldVideoId} to ${newVideoId}`
                );
                if (newVideoId != oldVideoId) {
                    // Video Id in the player element changed.
                    // Get the relevant video node
                    const relevantNode = utils.getVideoPlayerNode(
                        mutation.target
                    );
                    if (relevantNode) {
                        this.videoFilter.addVideoToStore({
                            videoId: newVideoId,
                            relevantNode: relevantNode,
                        });
                    }
                }
            }
        }
    };

    public filterDistractiveVideo = () => {
        console.log("Filter video in video player");
        const playerContainer = document.querySelector(
            "div#primary-inner.ytd-watch-flexy"
        );
        const videoId = this.videoPlayer?.getAttribute("video-id");

        if (playerContainer && videoId) {
            this.videoFilter.addVideoToStore({
                videoId: videoId,
                relevantNode: playerContainer,
            });
        }
    };
}
