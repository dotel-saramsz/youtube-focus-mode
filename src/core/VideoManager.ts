/**
 * Class to store the videos waiting to be processed by the service worker as well as the blocked videos for the page
 * Also handles the interaction of the DOM element
 * */
import * as youtube from "../api/youtube/api";

export interface VideoNode {
    nodeType: "THUMBNAIL" | "VIDEOPLAYER";
    videoId: string;
    linkNode: Node;
}

export interface VideoIdstoNodes {
    [videoId: string]: VideoNode;
}

/** A singleton class whose instance stores and manages the video elements in the DOM
 * and also handles blocking and unblocking them
 */
export class VideoManager {
    /** The private instance */
    private static _instance: VideoManager;
    private waitListVideos: VideoIdstoNodes;
    private blockedVideos: VideoIdstoNodes;

    private constructor() {
        this.waitListVideos = {};
        this.blockedVideos = {};
    }

    public static get instance(): VideoManager {
        VideoManager._instance = VideoManager._instance || new VideoManager();
        return VideoManager._instance;
    }

    private processVideo = async (videoId: string): Promise<boolean> => {
        const chosenCategories = ["27", "28"];
        const videoDataList = await youtube.getVideoData([videoId]);

        const videoData = videoDataList[0];

        let block = true;
        if (chosenCategories.includes(videoData.category)) {
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
        if (node.nodeType == "THUMBNAIL") {
            return node.linkNode.parentElement?.parentElement?.parentElement;
        } else {
            return node.linkNode;
        }
    };

    private waitForVideo = (videoNode: VideoNode) => {
        this.waitListVideos[videoNode.videoId] = videoNode;
    };

    private blockVideo = (videoNode: VideoNode) => {
        this.blockedVideos[videoNode.videoId] = videoNode;
        // Container node depends on the type
        // For thumbnail, container node is grand-grand-parent of the link node (<a>)
        // For videoplayer, container node is the link node
        const containerNode = this.getContainerNode(videoNode);
        // @ts-ignore
        containerNode?.classList.add("hide-display");
    };

    private unblockVideo = (videoNode: VideoNode) => {
        // Container node is grand-grand-parent of the <a> node
        const containerNode = this.getContainerNode(videoNode);
        // @ts-ignore
        if (containerNode?.classList.contains("hide-display")) {
            // @ts-ignore
            containerNode.classList.remove("hide-display");
        }
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
}
