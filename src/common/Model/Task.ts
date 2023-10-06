export const isTaskDataValid = (data: TaskData) => {
    return (
        !isNaN(data.dataset) &&
        data.dataset >= 0 &&
        !isNaN(data.annotation_type) &&
        data.annotation_type >= 0
    );
};

export class TaskData {
    dataset: number = -1;
    annotation_type: number = -1;
}

export type TaskDataKey = keyof TaskData;

export default class Task {
    id: number;
    dataset: number;
    dataset_name: string;
    annotation_type: number;
    annotation_type_name: string;
    media_count: number;
    type: "image" | "video";
    annotation_tool: number;

    constructor(obj: Task) {
        this.id = obj.id;
        this.dataset = obj.dataset;
        this.annotation_type = obj.annotation_type;
        this.dataset_name = obj.dataset_name;
        this.annotation_type_name = obj.annotation_type_name;
        this.media_count = obj.media_count;
        this.type = obj.type;
        this.annotation_tool = obj.annotation_tool;
    }

    name = () => {
        return `${this.dataset_name} - ${this.annotation_type_name}`;
    };

    filter = (search: string): boolean => {
        return this.name().toLowerCase().includes(search.toLowerCase());
    };
}
