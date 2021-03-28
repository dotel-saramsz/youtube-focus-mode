import { VideoFilter } from "./VideoFilter";
import * as utils from "../utils";
import { FeedFilter } from "./FeedFilter";

const FEED_FILTER_TAGS = [
    "ytd-feed-filter-chip-bar-renderer",
    "yt-related-chip-cloud-renderer",
    "ytd-search-sub-menu-renderer",
];

/** The class that manages the video feeds */
export class FeedManager {
    pageContainer: Element | null;
    feedObserver: MutationObserver;
    videoFilter: VideoFilter;

    constructor() {
        this.pageContainer = document.querySelector("ytd-page-manager");

        // Initialize the video filter
        this.videoFilter = new FeedFilter();

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
        // Get the video link node and id
        const videoNode = utils.getVideoThumbnailNode(node);
        if (videoNode) {
            // Filter the video
            this.videoFilter.filterVideo(videoNode);
        }
    };

    /** Handle the inplace changes in video ids in feeds
     * This can happen in the following scenarios:
     * 1. When user applies filter to the feed or recommendations
     * 2. When user clicks the logo at the topbar while at home
     */
    private handleFeedChange = (mutation: MutationRecord) => {
        const videoLinkNode = mutation.target;
        const videoId = utils.getVideoId(videoLinkNode);

        if (videoId) {
            this.videoFilter.filterVideo({
                videoId: videoId,
                relevantNode: videoLinkNode,
            });
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
                } else if (
                    FEED_FILTER_TAGS.includes(node.nodeName.toLowerCase())
                ) {
                    this.blockRecommendations(node);
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

    /** Blocks the feed filter containers which contain the
     * recommendation chips
     */
    private blockRecommendations = (recommendationContainer: Node) => {
        // @ts-ignore
        recommendationContainer.classList.add("hide-display");
    };

    private unblockRecommendations = (recommendationContainer: Node) => {
        // @ts-ignore
        recommendationContainer.classList.remove("hide-display");
    };

    public blockDistractiveVideos = (allowedCategories: string[]) => {
        // Set the video filter's allowList
        this.videoFilter.allowedCategories = allowedCategories;
        // Start the mutation observations
        if (this.pageContainer) {
            this.feedObserver.observe(this.pageContainer, {
                attributes: true,
                childList: true,
                subtree: true,
            });
        }

        // Block the visible video containers in the feed
        const videoLinkNodes = document.querySelectorAll(
            "ytd-thumbnail a#thumbnail"
        );
        for (let index = 0; index < videoLinkNodes.length; index++) {
            const videoLinkNode = videoLinkNodes[index];
            const videoId = utils.getVideoId(videoLinkNode);

            if (videoId) {
                // Filter the video
                this.videoFilter.filterVideo({
                    videoId: videoId,
                    relevantNode: videoLinkNode,
                });
            }
        }

        // Block the recommendation bars
        this.recommendationContainers.forEach((containerNode) => {
            if (containerNode) {
                this.blockRecommendations(containerNode);
            }
        });
    };

    public unblockDistractiveVideos = () => {
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

        // Unblock the recommendation bars
        this.recommendationContainers.forEach((containerNode) => {
            if (containerNode) {
                this.unblockRecommendations(containerNode);
            }
        });
    };

    /** Get the container element that contains the recommendation (filter) chips
     * for this feed
     */
    private get recommendationContainers(): (Element | null)[] {
        const containerElements = FEED_FILTER_TAGS.map((selector) =>
            document.querySelector(selector)
        );
        return containerElements;
    }
}
