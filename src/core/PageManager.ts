/** The topmost container that holds all types of pages */
import { YouTubePage, YouTubePageStatus } from "../pages/YouTubePage";

export class PageManager {
    tagName: string = "ytd-page-manager";
    domElement: Element | null;
    feedPage: YouTubePage;
    searchPage: YouTubePage;
    videoPage: YouTubePage;
    pageStatusObserver: MutationObserver;

    constructor(
        feedPage: YouTubePage,
        searchPage: YouTubePage,
        videoPage: YouTubePage
    ) {
        this.domElement = document.querySelector(this.tagName);

        this.feedPage = feedPage;
        this.searchPage = searchPage;
        this.videoPage = videoPage;

        // Initialize the observer that observes status of the pages
        this.pageStatusObserver = new MutationObserver(
            this.statusMutationCallback
        );

        if (this.domElement) {
            this.pageStatusObserver.observe(this.domElement, {
                attributes: true,
                childList: true,
            });
        }
    }

    private statusMutationCallback: MutationCallback = (
        mutations,
        observer
    ) => {
        for (const mutation of mutations) {
            if (
                mutation.target.nodeName.toLowerCase() ==
                    this.feedPage.tagName &&
                // @ts-ignore
                mutation.target.hasAttribute("hidden")
            ) {
                console.log(
                    // @ts-ignore
                    `FeedPage hidden: ${mutation.target.hasAttribute("hidden")}`
                );
                this.feedPage.refresh();
            } else if (
                mutation.target.nodeName.toLowerCase() ==
                    this.searchPage.tagName &&
                // @ts-ignore
                mutation.target.hasAttribute("hidden")
            ) {
                console.log(
                    // @ts-ignore
                    `SearchPage hidden: ${mutation.target.hasAttribute(
                        "hidden"
                    )}`
                );
                this.searchPage.refresh();
            } else if (
                mutation.target.nodeName.toLowerCase() ==
                    this.videoPage.tagName &&
                // @ts-ignore
                mutation.target.hasAttribute("hidden")
            ) {
                console.log(
                    // @ts-ignore
                    `VideoPage hidden: ${mutation.target.hasAttribute(
                        "hidden"
                    )}`
                );
                this.videoPage.refresh();
            }
            // Search page DOM element is not present initially and only gets added later on
            mutation.addedNodes.forEach((node) => {
                if (node.nodeName.toLowerCase() == this.searchPage.tagName) {
                    // Search page was detected
                    console.log("SearchPage was added");
                    this.searchPage.refresh();
                }
            });
        }
    };
}
