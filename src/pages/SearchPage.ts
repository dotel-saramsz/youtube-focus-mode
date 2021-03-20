/** The page that displays the search results */
import { YouTubePage, YouTubePageStatus } from "./YouTubePage";

export class SearchPage extends YouTubePage {
    constructor() {
        super("ytd-search", "div#contents.ytd-section-list-renderer");
        this.filterSubTree();
    }

    public refresh = () => {
        super.refresh();
        this.filterSubTree();
    };

    public filterSubTree = () => {
        const searchFilterMenu = document.querySelector(
            "div#header-container.ytd-section-list-renderer"
        );
        searchFilterMenu?.classList.add("hide-display");
    };
}
