export interface Video {
    id?: number;
    url?: string;
    name?: string;
    duration?: string;
    frameData?: string;
}

export interface VideoGroups {
    name: string;
    videoList: Array<Video>;
}