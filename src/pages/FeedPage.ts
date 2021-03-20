/** The page that displays the home feed of the user */
import { YouTubePage, YouTubePageStatus } from "./YouTubePage";

export class FeedPage extends YouTubePage {
    constructor() {
        super("ytd-browse", "div#contents.ytd-rich-grid-renderer");
        this.filterSubTree();
    }

    public refresh = () => {
        super.refresh();
        this.filterSubTree();
    };

    public filterSubTree = () => {
        const feedFilterBar = document.querySelector(
            "ytd-feed-filter-chip-bar-renderer"
        );
        feedFilterBar?.classList.add("hide-display");
    };
}
