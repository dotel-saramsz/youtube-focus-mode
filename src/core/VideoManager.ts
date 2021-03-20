/**
 * Class to store the videos waiting to be processed by the service worker as well as the blocked videos for the page
 * Also handles the interaction of the DOM element
 * */
import * as youtube from "../api/youtube/api";

export interface VideoIdstoNodes {
    [videoId: string]: Node;
}

export interface VideoNode {
    videoId: string;
    linkNode: Node;
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
                this.blockVideo({ videoId: videoId, linkNode: videoNode });
            } else {
                // Unblock the video
                this.unblockVideo({ videoId: videoId, linkNode: videoNode });
            }
        }
    };

    private waitForVideo = (video: VideoNode) => {
        this.waitListVideos[video.videoId] = video.linkNode;
    };

    private blockVideo = (video: VideoNode) => {
        this.blockedVideos[video.videoId] = video.linkNode;
        // Container node is grand-grand-parent of the <a> node
        const containerNode =
            video.linkNode.parentElement?.parentElement?.parentElement;
        containerNode?.classList.add("hide-display");
    };

    private unblockVideo = (video: VideoNode) => {
        // Container node is grand-grand-parent of the <a> node
        const containerNode =
            video.linkNode.parentElement?.parentElement?.parentElement;
        if (containerNode?.classList.contains("hide-display")) {
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
