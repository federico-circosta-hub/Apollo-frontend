import axios from "axios";
import config from "../../config";
import User, { AnnotationToolAccess } from "./User";
import PhysicianTask from "./PhysicianTask";
import Dataset from "./Dataset";
import AnnotationTool, { AnnotationToolEndpoints } from "./AnnotationTool";
import AnnotationType from "./AnnotationType";

type Params = { [key: string]: any };
type Result = any;

enum HttpMethod {
    GET = "GET",
    POST = "POST",
    DELETE = "DELETE",
    PUT = "PUT",
    PATCH = "PATCH",
}

class CommunicationController {
    controller = axios.create({
        baseURL: config.API_URL,
        timeout: 10000,
        headers: { "Content-Type": "application/json" },
    });

    signalController?: AbortController;

    private endpoints = {
        GET_PHYSICIANS: "/user/physician",
        LOGIN: "/user/login",
        GET_TASKS: "/task",
        RESET_USER_PASSWORD: "/user/resetPassword",
        TOGGLE_USER_ENABLED: "/user/enable",
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
    };

    private baseCall = async (
        method: HttpMethod,
        endpoint: string,
        data: Params
    ): Promise<Result> => {
        console.log(`Axios call: ${method} ${endpoint}`);

        this.signalController = new AbortController();
        const config = { signal: this.signalController.signal };

        let fn = this.getFunctionByHttpMethod(method);

        try {
            let res: any;
            if (method === HttpMethod.GET)
                res = await fn(
                    endpoint + "/" + this.formatGetData(data),
                    config
                );
            else if (method === HttpMethod.DELETE)
                res = await fn(endpoint, { ...config, data: data });
            else res = await fn(endpoint, data, config);

            return res.data;
        } catch (err: any) {
            console.error(`Axios error: ${err.message}`);
            if (err.response) {
                // status not in 2xx range
                console.error(`Response error: ${err.response.data.message}`);
            } else if (err.request) {
                console.error(`Request error: no response received`);
            }
            throw err;
        }
    };

    private get = (endpoint: string, data: Params = {}): Promise<Result> => {
        return this.baseCall(HttpMethod.GET, endpoint, data);
    };

    private post = (endpoint: string, data: Params = {}): Promise<Result> => {
        return this.baseCall(HttpMethod.POST, endpoint, data);
    };

    private put = (endpoint: string, data: Params = {}): Promise<Result> => {
        return this.baseCall(HttpMethod.PUT, endpoint, data);
    };

    private patch = (endpoint: string, data: Params = {}): Promise<Result> => {
        return this.baseCall(HttpMethod.PATCH, endpoint, data);
    };

    private delete = (endpoint: string, data: Params = {}): Promise<Result> => {
        return this.baseCall(HttpMethod.DELETE, endpoint, data);
    };

    abortLast = () => {
        this.signalController?.abort();
    };

    getPhysicians = async (
        includeDisabled: boolean = false,
        id?: number
    ): Promise<User[]> => {
        const users = await this.get(this.endpoints.GET_PHYSICIANS, {
            includeDisabled,
            id,
        });

        return users.map((user: User) => new User(user));
    };

    login = async (email: string, password: string): Promise<User> => {
        const user = await this.post(this.endpoints.LOGIN, { email, password });
        return new User(user);
    };

    getPhysicianTasks = async (
        id: number,
        includeCompleted: boolean = false
    ): Promise<PhysicianTask[]> => {
        const tasks = await this.get(this.endpoints.GET_TASKS, {
            physician: id,
            includeCompleted,
        });

        return tasks.map(
            (task: any) => new PhysicianTask(task, task.physician)
        );
    };

    generateNewPassword = async (email: string): Promise<string> => {
        const res = await this.post(this.endpoints.RESET_USER_PASSWORD, {
            email,
        });
        return res.password;
    };

    resetPassword = async (
        email: string,
        oldPassword: string,
        newPassword: string
    ): Promise<string> => {
        const res = await this.post(this.endpoints.RESET_USER_PASSWORD, {
            email,
            oldPassword,
            newPassword,
        });
        return res.password;
    };

    toggleUserEnabled = async (id: number): Promise<boolean> => {
        const res = await this.patch(this.endpoints.TOGGLE_USER_ENABLED, {
            id,
        });
        return res.enabled;
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
        data: {
            base_url: string;
            authorization_header: string;
            new_instance_instructions: string;
            endpoints: AnnotationToolEndpoints;
        }
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
        name: string,
        annotation_instructions: string,
        annotation_interface: string,
        print_function: string,
        conflict_function: string
    ): Promise<AnnotationType> => {
        const res = await this.post(this.endpoints.NEW_ANNOTATION_TYPE, {
            annotation_tool,
            name,
            annotation_instructions,
            annotation_interface,
            print_function,
            conflict_function,
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
        return this.delete(this.endpoints.DELETE_DATASET, { id: dataset });
    };

    private formatGetData = (data: Params): string => {
        let result = "?";

        Object.entries(data)
            .filter(([_key, value]) => value !== undefined && value !== null)
            .forEach(([key, value]) => {
                result += key + "=" + value + "&";
            });

        return result;
    };

    private getFunctionByHttpMethod = (method: HttpMethod) => {
        switch (method) {
            case HttpMethod.GET:
                return this.controller.get;
            case HttpMethod.POST:
                return this.controller.post;
            case HttpMethod.PUT:
                return this.controller.put;
            case HttpMethod.PATCH:
                return this.controller.patch;
            case HttpMethod.DELETE:
                return this.controller.delete;
        }
    };
}

const instance = new CommunicationController();

export default instance;
