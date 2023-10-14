import config from "../../../config";
import { AnnotationToolAccess } from "../User";
import PhysicianTask from "../PhysicianTask";
import Dataset, { DatasetData } from "../Dataset";
import AnnotationTool, { AnnotationToolData } from "../AnnotationTool";
import AnnotationType from "../AnnotationType";
import Task, { AssignmentType, TaskData } from "../Task";
import AbstractCommunicationController from "./AbstractCommunicationController";
import DeanonymizedCC from "./DeanonymizedCommunicationController";

class MainCommunicationController extends AbstractCommunicationController {
    private endpoints = {
        GET_TASKS: "/task",
        ANNOTATION_TOOL_ACCESS: "/annotationTool/access",
        TOGGLE_USER_TOOL_ACCESS: "/user/physician/annotationTool",
        GET_DATASET: "/dataset",
        COMPLETE_DATASET: "/dataset/complete",
        GET_ANNOTATION_TOOLS: "/annotationTool",
        GET_ANNOTATION_TYPES: "/annotationType",
        UPDATE_ANNOTATION_TOOL: "/annotationTool",
        GET_PRINT_FUNCTIONS: "/annotationType/printFunctions",
        GET_CONFLICT_FUNCTIONS: "/annotationType/conflictFunctions",
        NEW_ANNOTATION_TYPE: "/annotationType",
        UPDATE_ANNOTATION_TYPE: "/annotationType",
        DELETE_DATASET: "/dataset",
        DELETE_ANNOTATION_TOOL: "/annotationTool",
        DELETE_ANNOTATION_TYPE: "/annotationType",
        NEW_DATASET: "/dataset",
        NEW_ANNOTATION_TOOL: "/annotationTool",
        NEW_TASK: "/task",
        DELETE_TASK: "/task",
        ASSIGN_TASK: "/task/assign",
    };

    protected getHeaders(): { [key: string]: string } {
        const session = localStorage.getItem(config.LOCAL_STORAGE_SESSION_KEY);

        return {
            [DeanonymizedCC.SESSION_HEADER_NAME]: session ?? "",
        };
    }

    getPhysicianTasks = async (
        id: number,
        includeCompleted: boolean = false,
        offset: number = 0,
        cnt: number = 20
    ): Promise<PhysicianTask[]> => {
        const tasks = await this.get(this.endpoints.GET_TASKS, {
            physician: id,
            includeCompleted,
            cnt: cnt,
            offset: offset,
        });

        return tasks.map(
            (task: any) => new PhysicianTask(task, task.physician)
        );
    };

    getAllTasks = async (
        includeCompleted: boolean = false,
        offset: number = 0,
        cnt: number = 20
    ): Promise<Task[]> => {
        const tasks = await this.get(this.endpoints.GET_TASKS, {
            includeCompleted,
            cnt: cnt,
            offset: offset,
        });

        return tasks.map((task: any) => new Task(task));
    };

    getUserAnnotationTool = async (
        physician: number
    ): Promise<AnnotationToolAccess[]> => {
        const res = await this.get(this.endpoints.ANNOTATION_TOOL_ACCESS, {
            physician,
        });

        return res.map((access: any) => {
            return {
                id: access.annotation_tool,
                name: access.annotation_tool_name,
                endpoint: access.endpoint ?? "",
                access: access.access,
            };
        });
    };

    toggleUserAnnotationToolAccess = async (
        physician: number,
        annotationTool: number,
        access: boolean,
        endpoint?: string
    ): Promise<string> => {
        const res = await this.patch(this.endpoints.TOGGLE_USER_TOOL_ACCESS, {
            physician,
            id: annotationTool,
            grant: access,
            endpoint,
        });
        return res.instructions ?? "";
    };

    getDatasets = async (): Promise<any[]> => {
        const datasets = await this.get(this.endpoints.GET_DATASET);

        return datasets.map((dataset: Dataset) => new Dataset(dataset));
    };

    setDatasetCompleted = async (dataset: number): Promise<boolean> => {
        const res = await this.patch(this.endpoints.COMPLETE_DATASET, {
            id: dataset,
        });

        return res.completed;
    };

    getAnnotationTools = async (): Promise<AnnotationTool[]> => {
        const annotationTools = await this.get(
            this.endpoints.GET_ANNOTATION_TOOLS
        );

        return annotationTools.map((annotationTool: AnnotationTool) => {
            return new AnnotationTool(annotationTool);
        });
    };

    getAnnotationTypes = async (
        annotationTool: number
    ): Promise<AnnotationType[]> => {
        const annotationTypes = await this.get(
            this.endpoints.GET_ANNOTATION_TYPES,
            { annotation_tool: annotationTool }
        );

        return annotationTypes.map((annotationType: AnnotationType) => {
            return new AnnotationType(annotationType);
        });
    };

    updateAnnotationTool = async (
        annotationTool: number,
        data: AnnotationToolData
    ): Promise<AnnotationTool> => {
        const res = await this.patch(this.endpoints.UPDATE_ANNOTATION_TOOL, {
            id: annotationTool,
            ...data,
        });

        return new AnnotationTool(res);
    };

    getPrintFunctions = async (): Promise<string[]> => {
        return this.get(this.endpoints.GET_PRINT_FUNCTIONS);
    };

    getConflictFunctions = async (): Promise<string[]> => {
        return this.get(this.endpoints.GET_CONFLICT_FUNCTIONS);
    };

    newAnnotationType = async (
        annotation_tool: number,
        data: {
            name: string;
            annotation_instructions: string;
            annotation_interface: string;
            print_function: string;
            conflict_function: string;
        }
    ): Promise<AnnotationType> => {
        const res = await this.post(this.endpoints.NEW_ANNOTATION_TYPE, {
            annotation_tool,
            name: data.name,
            annotation_instructions: data.annotation_instructions,
            annotation_interface: data.annotation_interface,
            print_function: data.print_function,
            conflict_function: data.conflict_function,
        });

        return new AnnotationType(res);
    };

    updateAnnotationType = async (
        annotationType: number,
        data: {
            name: string;
            annotation_instructions: string;
            annotation_interface: string;
            print_function: string;
            conflict_function: string;
        }
    ) => {
        const res = await this.patch(this.endpoints.UPDATE_ANNOTATION_TYPE, {
            id: annotationType,
            ...data,
        });
        return new AnnotationType(res);
    };

    deleteDataset = async (dataset: number): Promise<Dataset> => {
        const res = await this.delete(this.endpoints.DELETE_DATASET, {
            id: dataset,
        });
        return new Dataset(res);
    };

    deleteAnnotationTool = async (
        annotationTool: number
    ): Promise<AnnotationTool> => {
        const res = await this.delete(this.endpoints.DELETE_ANNOTATION_TOOL, {
            id: annotationTool,
        });
        return new AnnotationTool(res);
    };

    deleteAnnotationType = async (
        annotationType: number
    ): Promise<AnnotationType> => {
        const res = await this.delete(this.endpoints.DELETE_ANNOTATION_TYPE, {
            id: annotationType,
        });
        return new AnnotationType(res);
    };

    newDataset = async (data: DatasetData): Promise<Dataset> => {
        const res = await this.post(this.endpoints.NEW_DATASET, data);
        return new Dataset(res);
    };

    newAnnotationTool = async (
        data: AnnotationToolData
    ): Promise<AnnotationTool> => {
        const res = await this.post(this.endpoints.NEW_ANNOTATION_TOOL, data);
        return new AnnotationTool(res);
    };

    newAnnotationTask = async (data: TaskData): Promise<Task> => {
        const res = await this.post(this.endpoints.NEW_TASK, data);
        return new Task(res);
    };

    deleteAnnotationTask = async (task: number): Promise<Task> => {
        const res = await this.delete(this.endpoints.DELETE_TASK, {
            id: task,
        });
        return new Task(res);
    };

    updateTaskAssignment = (
        id: number,
        assignments: AssignmentType[]
    ): Promise<
        {
            user: number;
            deadline: string;
            annotated_media: number;
            task_url: string;
        }[]
    > => {
        return this.patch(this.endpoints.ASSIGN_TASK, { id, assignments });
    };
}

const instance = new MainCommunicationController(config.MAIN_API_URL);

export default instance;
