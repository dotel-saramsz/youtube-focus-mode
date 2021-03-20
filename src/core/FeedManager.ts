import { VideoFilter } from "./VideoFilter";
import * as utils from "../utils";

/** The class that manages the video feeds */
export class FeedManager {
    pageContainer: Element | null;
    feedObserver: MutationObserver;
    videoFilter: VideoFilter;

    constructor() {
        this.pageContainer = document.querySelector("ytd-page-manager");

        // Initialize the video filter
        this.videoFilter = new VideoFilter("FEED");

        // Initialize the observer that observes mutations in the feeds
        this.feedObserver = new MutationObserver(this.feedMutationCallback);
    }

    /** Handle the videos that are added into the page
     * This can happen in the following scenarios:
     * 1. Due to the lazy loading on infinite scrolling
     * 2. When user switches from one page to another
     * (since YouTube is a Single Page App, videos get 'added')
     */
    private handleVideoAdditions = (node: Node) => {
        if (node.nodeName == "YTD-THUMBNAIL") {
            // Get the video link node and id
            const videoNode = utils.getVideoThumbnailNode(node);
            if (videoNode) {
                // Add video to the video store
                this.videoFilter.addVideoToStore(videoNode);
            }
        }
    };

    /** Handle the inplace changes in video ids in feeds
     * This can happen in the following scenarios:
     * 1. When user applies filter to the feed or recommendations
     * 2. When user clicks the logo at the topbar while at home
     */
    private handleFeedChange = (mutation: MutationRecord) => {
        if (
            mutation.target.nodeName == "A" && // @ts-ignore
            mutation.target.getAttribute("id") == "thumbnail"
        ) {
            const videoLinkNode = mutation.target;
            const videoId = utils.getVideoId(videoLinkNode);

            if (videoId) {
                this.videoFilter.addVideoToStore({
                    videoId: videoId,
                    relevantNode: videoLinkNode,
                });
            }
        }
    };

    /** The mutation callback that responds to mutations in the feed in video containers */
    private feedMutationCallback: MutationCallback = (
        mutationsList,
        observer
    ) => {
        for (const mutation of mutationsList) {
            mutation.addedNodes.forEach((node, key, parent) => {
                if (node.nodeName == "YTD-THUMBNAIL") {
                    this.handleVideoAdditions(node);
                }
            });

            if (
                mutation.attributeName?.toLowerCase() == "href" &&
                mutation.target.nodeName == "A" &&
                // @ts-ignore
                mutation.target.getAttribute("id") == "thumbnail"
            ) {
                this.handleFeedChange(mutation);
            }
        }
    };

    public blockDistractiveVideos = () => {
        console.log("[Feed] Blocking distractive videos");
        // Start the mutation observations
        if (this.pageContainer) {
            this.feedObserver.observe(this.pageContainer, {
                attributes: true,
                childList: true,
                subtree: true,
            });
        }

        const videoLinkNodes = document.querySelectorAll(
            "ytd-thumbnail a#thumbnail"
        );
        for (let index = 0; index < videoLinkNodes.length; index++) {
            const videoLinkNode = videoLinkNodes[index];
            const videoId = utils.getVideoId(videoLinkNode);

            if (videoId) {
                // Add video to the video store
                this.videoFilter.addVideoToStore({
                    videoId: videoId,
                    relevantNode: videoLinkNode,
                });
            }
        }
    };

    public unblockDistractiveVideos = () => {
        console.log("[Feed] Unblocking distractive videos");

        // Stop the mutation observation
        this.feedObserver.disconnect();

        // Unblock all videos in feed
        const videoLinkNodes = document.querySelectorAll(
            "ytd-thumbnail a#thumbnail"
        );
        for (let index = 0; index < videoLinkNodes.length; index++) {
            const videoLinkNode = videoLinkNodes[index];
            const videoId = utils.getVideoId(videoLinkNode);

            if (videoId) {
                // Add video to the video store
                this.videoFilter.unblockVideo({
                    videoId: videoId,
                    relevantNode: videoLinkNode,
                });
            }
        }
    };
}
