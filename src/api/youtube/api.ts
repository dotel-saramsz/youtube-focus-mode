import axios from "axios";
import { YoutubeVideoData } from "./types";

const API_KEY = "AIzaSyCLtPIDnh66lUXv440RfC09ztaQekc2KxA";
const FETCH_URL = "https://youtube.googleapis.com/youtube/v3/videos";

// Function to get the data from YouTube's API
export const getVideoData = async (
    videoIds: string[]
): Promise<YoutubeVideoData[]> => {
    // Form the query parameter
    const queryParameters = {
        part: "snippet, statistics",
        id: videoIds.join(","),
        key: API_KEY,
    };

    const videoList: YoutubeVideoData[] = [];

    try {
        console.log(`Sending API request with ${videoIds.length} items`);
        const response = await axios.get(FETCH_URL, {
            params: queryParameters,
        });

        if (response.status == 200) {
            // Form the video data(s)
            const data = response.data;
            for (const dataItem of data["items"]) {
                videoList.push({
                    videoId: dataItem["id"],
                    title: dataItem["snippet"]["title"],
                    description: dataItem["snippet"]["description"],
                    category: dataItem["snippet"]["categoryId"],
                    channel: dataItem["snippet"]["channelTitle"],
                    tags: dataItem["snippet"]["tags"],
                });
            }
        }
        // let req = new XMLHttpRequest();
        // req.addEventListener("load", (ev) => {
        //     if (req.status == 200) {
        //         const response = req.responseText;
        //         console.log(response);
        //     }
        // });
        // req.open(
        //     "GET",
        //     `${FETCH_URL}?part=snippet%2Cstatistics&id=${videoIds.join(
        //         "%2C"
        //     )}&key=${API_KEY}`
        // );
        // req.send();

        return videoList;
    } catch (error) {
        console.log(`Error: ${error}`);
        return videoList;
    }
};
