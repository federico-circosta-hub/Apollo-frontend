import Task from "./Task";

export default class PhysicianTask extends Task {
    url: string;
    deadline: string;
    annotation_cnt: number;

    constructor(obj: any) {
        super(obj);
        this.url = obj.url;
        this.deadline = obj.deadline;
        this.annotation_cnt = obj.annotation_cnt;
    }

    progress = () => {
        return this.annotation_cnt / this.media_cnt;
    };
}
