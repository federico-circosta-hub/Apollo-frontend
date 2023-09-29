export enum MediaType {
    IMAGE = "image",
    VIDEO = "video",
}

export default class Dataset {
    id: number;
    name: string;
    start_date?: string;
    end_date?: string;
    type: MediaType;
    media_count: number;

    constructor(obj: Dataset | any = {}) {
        this.id = obj.id ?? 0;
        this.name = obj.name ?? "";
        this.start_date = obj.start_date;
        this.end_date = obj.end_date;
        this.type = obj.type ?? MediaType.IMAGE;
        this.media_count = obj.media_count ?? false;
    }

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
}
