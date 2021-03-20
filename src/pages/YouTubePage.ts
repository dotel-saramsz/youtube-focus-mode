import * as utils from "../utils";
import { VideoManager } from "../core/VideoManager";

export type YouTubePageStatus = "UNDETECTED" | "DISPLAYED" | "HIDDEN";

export abstract class YouTubePage {
    tagName: string;
    videoContainerSelector: string;
    domElement: Element | null;
    videoContainerElement?: Element | null;
    status: YouTubePageStatus;
    observer?: MutationObserver;

    constructor(tagName: string, videoContainerSelector: string) {
        this.tagName = tagName;
        this.videoContainerSelector = videoContainerSelector;

        this.domElement = document.querySelector(this.tagName);
        this.status = this.getStatus(this.domElement);

        if (this.status == "DISPLAYED") {
            // Get the video container element
            this.videoContainerElement = document.querySelector(
                this.videoContainerSelector
            );
            // Filter the displayed videos
            this.filterDistractiveVideos();
            // Register observer on the video container
            this.observer = new MutationObserver(this.mutationCallback);
            this.observeMutation(this.videoContainerElement, this.observer);
        }
    }

    public refresh(this: YouTubePage): void {
        // Check current status
        if (this.status == "UNDETECTED") {
            // We need to search in DOM again
            this.domElement = document.querySelector(this.tagName);
        }
        // Get the new status
        this.status = this.getStatus(this.domElement);
        if (this.status == "DISPLAYED") {
            // Get the video container element
            this.videoContainerElement = document.querySelector(
                this.videoContainerSelector
            );
            // Filter the displayed videos
            this.filterDistractiveVideos();
            // Register observer on the video container
            this.observer = new MutationObserver(this.mutationCallback);
            this.observeMutation(this.videoContainerElement, this.observer);
        }
    }

    private filterDistractiveVideos = () => {
        console.log("Filter distractive videos");
        const videoLinkNodes = document.querySelectorAll(
            "ytd-thumbnail a#thumbnail"
        );
        for (let index = 0; index < videoLinkNodes.length; index++) {
            const videoLinkNode = videoLinkNodes[index];
            const videoId = utils.getVideoId(videoLinkNode);

            if (videoId) {
                // Add video to the video store
                VideoManager.instance.addVideoToStore({
                    videoId: videoId,
                    linkNode: videoLinkNode,
                });
            }
        }
    };

    private observeMutation = (
        containerElement: Element | null,
        observer: MutationObserver
    ) => {
        if (containerElement) {
            observer.observe(containerElement, {
                attributes: true,
                childList: true,
                subtree: true,
            });
        }
    };

    private getStatus = (domElement: Element | null): YouTubePageStatus => {
        if (domElement) {
            // Check if hidden or displayed
            if (domElement.hasAttribute("hidden")) {
                return "HIDDEN";
            } else {
                return "DISPLAYED";
            }
        } else {
            return "UNDETECTED";
        }
    };

    /** The mutation callback that responds to mutations in the video containers */
    private mutationCallback: MutationCallback = (mutationsList, observer) => {
        for (const mutation of mutationsList) {
            mutation.addedNodes.forEach((node, key, parent) => {
                if (node.nodeName == "YTD-THUMBNAIL") {
                    // Get the video link node and id
                    const videoNode = utils.getVideoNode(node);
                    if (videoNode) {
                        // Add video to the video store
                        VideoManager.instance.addVideoToStore(videoNode);
                    }
                }
            });
            if (
                mutation.target.nodeName == "A" && // @ts-ignore
                mutation.target.getAttribute("id") == "thumbnail"
            ) {
                const videoLinkNode = mutation.target;
                const videoId = utils.getVideoId(videoLinkNode);

                if (videoId) {
                    VideoManager.instance.addVideoToStore({
                        videoId: videoId,
                        linkNode: videoLinkNode,
                    });
                }
            }
        }
    };

    abstract filterSubTree: () => void;
}
