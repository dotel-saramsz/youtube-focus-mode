interface ProcessVideo {
    type: "PROCESS_VIDEO";
    videoId: string;
}

interface VideoResult {
    type: "VIDEO_RESULT";
    videoId: string;
    block: boolean;
}

export type MessageType = ProcessVideo | VideoResult;
