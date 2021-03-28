export enum AppMode {
    Select,
    Display,
}

interface AppStatus {
    type: "APP_STATUS";
    appEnabled: boolean;
}

interface ToggleAppStatus {
    type: "TOGGLE_STATUS";
    appEnabled: boolean;
}

interface ChosenCategoriesList {
    type: "CHOSEN_CATEGORIES_LIST";
    chosenCategories: string[];
}

interface ChangeChosenCategories {
    type: "CHANGE_CHOSEN_CATEGORIES";
    chosenCategories: string[];
}

export type MessageType =
    | AppStatus
    | ToggleAppStatus
    | ChosenCategoriesList
    | ChangeChosenCategories;

export interface VideoNode {
    videoId: string;
    relevantNode: Node;
}

export interface VideoIdstoNodes {
    [videoId: string]: VideoNode;
}
