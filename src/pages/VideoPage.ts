/** The page that displays the video player */
import { YouTubePage, YouTubePageStatus } from "./YouTubePage";

export class VideoPage extends YouTubePage {
    constructor() {
        super("ytd-watch-flexy", "div#contents.ytd-item-section-renderer");
        this.filterSubTree();
    }

    public refresh = () => {
        super.refresh();
        this.filterSubTree();
    };

    public filterSubTree = () => {
        const recommendationChips = document.querySelector(
            "yt-related-chip-cloud-renderer"
        );
        recommendationChips?.classList.add("hide-display");
    };
}
