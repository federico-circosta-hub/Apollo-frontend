import axios from "axios";
import config from "../../config";
import User, { AnnotationToolAccess } from "./User";
import PhysicianTask from "./PhysicianTask";
import Dataset from "./Dataset";
import AnnotationTool from "./AnnotationTool";

type Params = { [key: string]: any };
type Result = any;

enum HttpMethod {
    GET = "GET",
    POST = "POST",
    DELETE = "DELETE",
    PUT = "PUT",
    PATCH = "PATCH",
}

class Communication {
    controller = axios.create({
        baseURL: config.API_URL,
        timeout: 5000,
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
        const res = await this.post(this.endpoints.RESET_USER_PASSWORD, { email });
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
        const res = await this.patch(this.endpoints.TOGGLE_USER_ENABLED, { id });
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
		const annotationTools = await this.get(this.endpoints.GET_ANNOTATION_TOOLS);

		return annotationTools.map((annotationTool: AnnotationTool) => {
			return new AnnotationTool(annotationTool);
		});
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

const instance = new Communication();

export default instance;
