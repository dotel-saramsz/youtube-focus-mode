import { VideoFilter } from "./VideoFilter";
import { VideoNode } from "../types";
import * as youtube from "../api/youtube/api";

export class PlayerFilter extends VideoFilter {
    constructor() {
        super();
    }

    private processVideo = async (video: VideoNode): Promise<boolean> => {
        const videoDataList = await youtube.getVideoData([video.videoId]);

        const videoData = videoDataList[0];

        let block = true;
        if (this.allowList.includes(videoData.category)) {
            block = false;
        }

        return block;
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
        // Container node depends on the type
        // For videoplayer, container node is the link node
        const containerNode = videoNode.relevantNode;
        // @ts-ignore
        containerNode?.classList.add("hide-display");
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

    public unblockVideo = (videoNode: VideoNode) => {
        // Container node is grand-grand-parent of the <a> node
        const containerNode = videoNode.relevantNode;
        // @ts-ignore
        if (containerNode?.classList.contains("hide-display")) {
            // @ts-ignore
            containerNode.classList.remove("hide-display");
        }
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

    /** Filter the video */
    public filterVideo = (video: VideoNode) => {
        // Send the video for processing
        this.processVideo(video).then((block) => {
            this.onVideoProcessed(video, block);
        });
    };
}
