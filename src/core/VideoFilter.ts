/**
 * Class to store the videos waiting to be processed by the service worker as well as the blocked videos for the page
 * Also handles the interaction of the DOM element
 * */
import * as youtube from "../api/youtube/api";
import * as utils from "../utils";

export interface VideoNode {
    videoId: string;
    relevantNode: Node;
}

export interface VideoIdstoNodes {
    [videoId: string]: VideoNode;
}

/** A singleton class whose instance stores and manages the video elements in the DOM
 * and also handles blocking and unblocking them
 */
export class VideoFilter {
    private filterType: "FEED" | "VIDEOPLAYER";
    private waitListVideos: VideoIdstoNodes;
    private blockedVideos: VideoIdstoNodes;
    private allowList: string[] = [];

    constructor(filterType: "FEED" | "VIDEOPLAYER") {
        this.filterType = filterType;
        this.waitListVideos = {};
        this.blockedVideos = {};
    }

    public set allowedCategories(categories: string[]) {
        // The allow list should contain category ids but the
        // provided categories has category names
        const categoryIds = utils.getCategoryIds(categories);
        this.allowList = [...categoryIds];
    }

    private processVideo = async (videoId: string): Promise<boolean> => {
        const videoDataList = await youtube.getVideoData([videoId]);

        const videoData = videoDataList[0];

        let block = true;
        if (this.allowList.includes(videoData.category)) {
            block = false;
        }

        return block;
    };

    private onVideoProcessed = (videoId: string, block: boolean) => {
        // Remove the video from the waitList
        const videoNode = this.waitListVideos[videoId];
        delete this.waitListVideos[videoId];
        if (videoNode) {
            if (block) {
                // Block the video
                this.blockVideo(videoNode);
            } else {
                // Unblock the video
                this.unblockVideo(videoNode);
            }
        }
    };

    private getContainerNode = (node: VideoNode) => {
        if (this.filterType == "FEED") {
            return node.relevantNode.parentElement?.parentElement
                ?.parentElement;
        } else {
            return node.relevantNode;
        }
    };

    private waitForVideo = (videoNode: VideoNode) => {
        this.waitListVideos[videoNode.videoId] = videoNode;
    };

    public blockVideo = (videoNode: VideoNode) => {
        this.blockedVideos[videoNode.videoId] = videoNode;
        // Container node depends on the type
        // For videoplayer, container node is the link node
        const containerNode = this.getContainerNode(videoNode);
        // @ts-ignore
        containerNode?.classList.add("hide-display");
        // If the filter is for video player, we have additional blocking to do
        this.blockVideoPlayer(videoNode);
    };

    public unblockVideo = (videoNode: VideoNode) => {
        // Container node is grand-grand-parent of the <a> node
        const containerNode = this.getContainerNode(videoNode);
        // @ts-ignore
        if (containerNode?.classList.contains("hide-display")) {
            // @ts-ignore
            containerNode.classList.remove("hide-display");
        }
        // If the filter is for video player, we have additional unblocking to do
        this.unblockVideoPlayer(videoNode);
    };

    /**Add the video to the store */
    public addVideoToStore = (video: VideoNode) => {
        // Wait for the video to get processed
        this.waitForVideo(video);
        // Send the video for processing
        this.processVideo(video.videoId).then((block) => {
            this.onVideoProcessed(video.videoId, block);
        });
    };

    /** Additional blocking for video player like
     * pausing the video and hiding the theater mode
     */
    private blockVideoPlayer = (videoNode: VideoNode) => {
        // Get the theater container
        const theaterContainer = document.querySelector(
            "div#player-theater-container"
        );
        // Get the HTML5 video element
        const videoElement = document.querySelector("video.html5-main-video");
        theaterContainer?.classList.add("hide-display");
        if (videoElement) {
            // @ts-ignore
            videoElement.pause();
        }
    };

    /** Additional unblocking for video player like
     * pausing the video and hiding the theater mode
     */
    private unblockVideoPlayer = (videoNode: VideoNode) => {
        // Get the theater container
        const theaterContainer = document.querySelector(
            "div#player-theater-container"
        );
        // Get the HTML5 video element
        const videoElement = document.querySelector("video.html5-main-video");
        theaterContainer?.classList.remove("hide-display");
        // @ts-ignore
        if (videoElement && videoElement.paused) {
            // @ts-ignore
            videoElement.play();
        }
    };
}
