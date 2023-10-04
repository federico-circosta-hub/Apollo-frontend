import dayjs, { Dayjs } from "dayjs";
import CommunicationController from "./CommunicationController";

export enum MediaType {
    IMAGE = "image",
    VIDEO = "video",
}

export type DatasetDataKey = keyof DatasetData;

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
    start_date: Dayjs | null;
    end_date: Dayjs | null = dayjs();
    type: MediaType = MediaType.IMAGE;

    constructor() {
        this.start_date = dayjs().subtract(1, "month");
    }
}

export default class Dataset {
    id: number;
    name: string;
    start_date?: string;
    end_date?: string;
    type: MediaType;
    media_count: number;
    completed: boolean;

    constructor(obj: Dataset) {
        this.id = obj.id ?? 0;
        this.name = obj.name ?? "";
        this.start_date = obj.start_date;
        this.end_date = obj.end_date;
        this.type = obj.type ?? MediaType.IMAGE;
        this.media_count = obj.media_count ?? false;
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
        return this.name.toLowerCase().includes(filter.toLowerCase());
    };

    setCompleted = async (): Promise<boolean> => {
        const completed = await CommunicationController.setDatasetCompleted(
            this.id
        );
        this.completed = completed;
        return this.completed;
    };
}
