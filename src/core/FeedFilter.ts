/**
 * Class to store the videos waiting to be processed by the service worker as well as the blocked videos for the page
 * Also handles the interaction of the DOM element
 * */
import * as youtube from "../api/youtube/api";
import * as utils from "../utils";
import { VideoNode, VideoIdstoNodes } from "../types";
import { VideoQueue } from "./VideoQueue";
import { VideoFilter } from "./VideoFilter";

/** A class whose instance stores and manages the video elements in the DOM
 * and also handles blocking and unblocking them
 */
export class FeedFilter extends VideoFilter {
    private videoStore: VideoQueue;

    constructor() {
        super();
        this.videoStore = new VideoQueue(1000, 25, this.processVideos);
    }

    private processVideos = async (videoList: VideoNode[]) => {
        const videoIds = videoList.map((video) => video.videoId);
        const videoDataList = await youtube.getVideoData(videoIds);

        videoDataList.forEach((videoData, index) => {
            let block = true;
            if (this.allowList.includes(videoData.category)) {
                block = false;
            }
            this.onVideoProcessed(videoList[index], block);
        });
    };

    private onVideoProcessed = (videoNode: VideoNode, block: boolean) => {
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

    public blockVideo = (videoNode: VideoNode) => {
        const containerNode =
            videoNode.relevantNode.parentElement?.parentElement?.parentElement;
        // @ts-ignore
        containerNode?.classList.add("hide-display");
    };

    public unblockVideo = (videoNode: VideoNode) => {
        const containerNode =
            videoNode.relevantNode.parentElement?.parentElement?.parentElement;
        // @ts-ignore
        if (containerNode?.classList.contains("hide-display")) {
            // @ts-ignore
            containerNode.classList.remove("hide-display");
        }
    };

    /**Filter the video */
    public filterVideo = (video: VideoNode) => {
        // Queue the video before sending the video for processing
        this.videoStore.add(video);
    };
}
