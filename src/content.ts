// This file is injected as a content script
import "./content.css";
import { FeedPage } from "./pages/FeedPage";
import { SearchPage } from "./pages/SearchPage";
import { VideoPage } from "./pages/VideoPage";
import { PageManager } from "./core/PageManager";

// Initialize the VideoStore class
// const videoStore = VideoStore.instance;

// Select some global DOM elements
const sideDrawer = document.querySelector("tp-yt-app-drawer");
const sideDrawerMini = document.querySelector("ytd-mini-guide-renderer");

// Hide the disturbing elements
sideDrawer?.classList.add("hide-display");
sideDrawerMini?.classList.add("hide-display");

// Create the different pages
const feedPage = new FeedPage();
const searchPage = new SearchPage();
const videoPage = new VideoPage();

// Instantiate the page manager
const pageManager = new PageManager(feedPage, searchPage, videoPage);
