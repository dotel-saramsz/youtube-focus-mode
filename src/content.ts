// This file is injected as a content script
import "./content.css";
import { FeedManager } from "./core/FeedManager";
import { PlayerManager } from "./core/PlayerManager";

// Initialize the VideoStore class
// const videoStore = VideoStore.instance;

// Select some global DOM elements
const sideDrawer = document.querySelector("tp-yt-app-drawer");
const sideDrawerMini = document.querySelector("ytd-mini-guide-renderer");

// Hide the disturbing elements
sideDrawer?.classList.add("hide-display");
sideDrawerMini?.classList.add("hide-display");

// Instantiate the feed manager
const feedManager = new FeedManager();
// Instantiate hte video player manager
const playerManager = new PlayerManager();

// Filter the videos
feedManager.filterDistractiveVideos();
playerManager.filterDistractiveVideo();
