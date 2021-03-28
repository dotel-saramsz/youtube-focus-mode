/**
 * Class to store the videos waiting to be processed by the service worker as well as the blocked videos for the page
 * Also handles the interaction of the DOM element
 * */
import * as utils from "../utils";
import { VideoNode, VideoIdstoNodes } from "../types";

/** A class whose instance stores and manages the video elements in the DOM
 * and also handles blocking and unblocking them
 */
export abstract class VideoFilter {
    protected allowList: string[] = [];

    constructor() {}

    public set allowedCategories(categories: string[]) {
        // The allow list should contain category ids but the
        // provided categories has category names
        const categoryIds = utils.getCategoryIds(categories);
        this.allowList = [...categoryIds];
    }

    abstract blockVideo: (video: VideoNode) => void;
    abstract unblockVideo: (video: VideoNode) => void;
    abstract filterVideo: (video: VideoNode) => void;
}
