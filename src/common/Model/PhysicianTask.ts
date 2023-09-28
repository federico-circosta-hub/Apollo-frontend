import Task from "./Task";

export default class PhysicianTask extends Task {
    physician: number;
    url: string;
    deadline: string;
    annotated_media: number;

    constructor(
        task: Task,
        physician: {
            user: number;
            task_url: string;
            deadline: string;
            annotated_media: number;
        }
    ) {
        super(task);
        this.physician = physician.user;
        this.annotated_media = physician.annotated_media;
        this.deadline = physician.deadline;
        this.url = physician.task_url;
    }

    progress = () => {
        return this.annotated_media / this.media_count;
    };
}
