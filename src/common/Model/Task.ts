import dayjs from "dayjs";
import MainCC from "./Communication/MainCommunicationController";

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

export type TaskConflictsMatrix = {
    [key: number]: {
        [key: number]: {
            common_annotations: number;
            conflict_degree: number;
        };
    };
};

export default class Task {
    id: number;
    dataset: number;
    dataset_name: string;
    dataset_description: string;
    annotation_type: number;
    annotation_type_name: string;
    annotation_type_description: string;
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
        this.dataset_description = obj.dataset_description;
        this.annotation_type_name = obj.annotation_type_name;
        this.annotation_type_description = obj.annotation_type_description;
        this.media_count = obj.media_count;
        this.type = obj.type;
        this.annotation_tool = obj.annotation_tool;
        this.physicians = obj.physicians;
    }

    name = () => {
        return `${this.dataset_name} - ${this.annotation_type_name}`;
    };

    filter = (search: string): boolean => {
        search = search.toLowerCase();
        return (
            this.name().toLowerCase().includes(search) ||
            this.dataset_description.toLowerCase().includes(search) ||
            this.annotation_type_description.toLowerCase().includes(search)
        );
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

        const status = await MainCC.updateTaskAssignment(this.id, assignments);

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

        const percent =
            annotations / (this.media_count * this.physicians.length);
        return Math.round(percent * 10000) / 10000;
    };

    conflictMatrix = (): Promise<TaskConflictsMatrix> => {
        return MainCC.getConflictMatrix(this.id);
    };
}
