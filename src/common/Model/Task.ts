import dayjs from "dayjs";
import CommunicationController from "./Communication/MainCommunicationController";

export const isTaskDataValid = (data: TaskData) => {
    return (
        !isNaN(data.dataset) &&
        data.dataset >= 0 &&
        !isNaN(data.annotation_type) &&
        data.annotation_type >= 0 &&
        data.physicians.filter(
            (p) =>
                p.assign && (!p.deadline || dayjs(p.deadline).isBefore(dayjs()))
        ).length === 0
    );
};

export type AssignmentType = {
    user: number;
    assign: boolean;
    deadline: string | undefined;
};

export class TaskData {
    dataset: number = -1;
    annotation_type: number = -1;
    physicians: AssignmentType[] = [];
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

    physicians: {
        annotated_media: number;
        deadline: string;
        task_url: string;
        user: number;
    }[];

    constructor(obj: Task) {
        this.id = obj.id;
        this.dataset = obj.dataset;
        this.annotation_type = obj.annotation_type;
        this.dataset_name = obj.dataset_name;
        this.annotation_type_name = obj.annotation_type_name;
        this.media_count = obj.media_count;
        this.type = obj.type;
        this.annotation_tool = obj.annotation_tool;
        this.physicians = obj.physicians;
    }

    name = () => {
        return `${this.dataset_name} - ${this.annotation_type_name}`;
    };

    filter = (search: string): boolean => {
        return this.name().toLowerCase().includes(search.toLowerCase());
    };

    getData = (): TaskData => {
        return {
            dataset: this.dataset,
            annotation_type: this.annotation_type,
            physicians: this.physicians.map((p) => ({
                user: p.user,
                deadline: p.deadline,
                assign: true,
            })),
        };
    };

    updateAssignment = async (
        assignments: AssignmentType[]
    ): Promise<boolean> => {
        assignments = this.filterAssignments(assignments);

        const status = await CommunicationController.updateTaskAssignment(
            this.id,
            assignments
        );

        this.physicians = status;

        return true;
    };

    filterAssignments = (assignments: AssignmentType[]): AssignmentType[] => {
        return assignments.filter((a) => {
            const physician = this.physicians.find((p) => p.user === a.user);
            if (!physician) return a.assign;
            return !a.assign || physician.deadline !== a.deadline;
        });
    };

    overallProgress = () => {
        const annotations = this.physicians.reduce(
            (acc, p) => acc + p.annotated_media,
            0
        );
        return (annotations / this.media_count) * this.physicians.length;
    };
}
