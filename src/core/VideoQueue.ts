import { VideoNode } from "../types";

export class VideoQueue {
    private ttl: number;
    private maxLength: number;
    private timer?: NodeJS.Timeout;
    private array: VideoNode[] = [];
    private callback: (videoList: VideoNode[]) => void;

    constructor(
        ttl: number,
        maxLength: number,
        callback: (videoList: VideoNode[]) => void
    ) {
        this.ttl = ttl;
        this.maxLength = maxLength;
        this.callback = callback;
    }

    private startTimer = () => {
        this.timer = setTimeout(() => {
            this.sendVideosForProcessing();
        }, this.ttl);
    };

    private stopTimer = () => {
        if (this.timer) {
            clearTimeout(this.timer);
        }
    };

    public add = (videoNode: VideoNode) => {
        // Add the video to the array
        this.array.push(videoNode);

        if (this.array.length == 1) {
            // This is the first video that is added to the queue
            // Start the timer after adding the element
            this.startTimer();
        }

        if (this.array.length >= this.maxLength) {
            this.stopTimer();
            this.sendVideosForProcessing();
        }
    };

    /** Send the current videos in the queue for processing and clear the array */
    private sendVideosForProcessing = () => {
        const currentVideoList = [...this.array];
        this.array = [];
        // Call the callback
        this.callback(currentVideoList);
    };
}
