interface RequestAppStatus {
    type: "REQ_APP_STATUS";
}

interface AppStatus {
    type: "APP_STATUS";
    appEnabled: boolean;
}

interface ToggleAppStatus {
    type: "TOGGLE_STATUS";
    appEnabled: boolean;
}

export type MessageType = RequestAppStatus | AppStatus | ToggleAppStatus;
