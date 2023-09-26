export default class Task {
    id: number;
    dataset: number;
    annotation_type: number;
    name: string;
    media_cnt: number;

    constructor(obj: any) {
        this.id = obj.id;
        this.dataset = obj.dataset;
        this.annotation_type = obj.annotation_type;
        this.name = `${obj.dataset_name} - ${obj.annotation_type_name}`;
        this.media_cnt = obj.media_cnt;
    }
}
