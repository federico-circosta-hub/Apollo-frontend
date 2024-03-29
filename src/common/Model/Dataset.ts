import dayjs, { Dayjs } from "dayjs";
import CommunicationController from "./Communication/MainCommunicationController";

export enum MediaType {
    IMAGE = "image",
    VIDEO = "video",
}

export type StatsKeys = "invalidImgs" | "invalidVideos" | "validImgs" | "validVideos";

export type MediaStats = Record<StatsKeys, number> & {
    totImgs: number;
    totVideos: number;
    joints: {
        [key: string]: Record<StatsKeys, number> & {
            scans: {
                [key: string]: Record<StatsKeys, number>;
            };
        };
    };
};

export const isDatasetValid = (data: DatasetData): boolean => {
    return (
        data.name.trim() !== "" &&
        data.start_date !== null &&
        data.end_date !== null &&
        data.start_date.isBefore(data.end_date)
    );
};

export class DatasetData {
    name: string = "";
    description: string = "";
    start_date: Dayjs | null;
    end_date: Dayjs | null = dayjs();
    type: MediaType = MediaType.IMAGE;

    constructor() {
        this.start_date = dayjs().subtract(1, "month");
    }
}

export type DatasetDataKey = keyof DatasetData;

export default class Dataset {
    id: number;
    name: string;
    description: string;
    start_date?: string;
    end_date?: string;
    type: MediaType;
    media_count: number;
    completed: boolean;

    constructor(obj: Dataset) {
        this.id = obj.id;
        this.name = obj.name;
        this.description = obj.description;
        this.start_date = obj.start_date;
        this.end_date = obj.end_date;
        this.type = obj.type;
        this.media_count = obj.media_count ?? 0;
        this.completed = obj.completed;
    }

    isEmpty = (): boolean => {
        return this.media_count === 0;
    };

    typeStr = () => {
        switch (this.type) {
            case MediaType.IMAGE:
                return "Immagini";
            case MediaType.VIDEO:
                return "Video";
            default:
                return "Unknown";
        }
    };

    filter = (filter: string): boolean => {
        filter = filter.toLowerCase();
        return (
            this.name.toLowerCase().includes(filter) ||
            this.description.toLowerCase().includes(filter)
        );
    };

    setCompleted = async (): Promise<boolean> => {
        const completed = await CommunicationController.setDatasetCompleted(
            this.id
        );
        this.completed = completed;
        return this.completed;
    };
}
